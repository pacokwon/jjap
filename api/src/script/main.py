#!/usr/bin/env python

import argparse
import bs4
import json
import os.path
from pprint import pprint
import psycopg2
import re
import requests
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.common.exceptions import TimeoutException
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.by import By


def pages_to_words(soup, driver, page_template):
    """
    Once a vocablist's part and level are decided, words must be collected
    from multiple pages. Retrieve the number of pages and visit each page
    to collect words
    """
    p = re.compile("단어 (\\d+)건")
    words = int(p.search(soup.find_all(class_="jlpt_rgt")[0].text).group(1))

    words_per_page = 38
    pages = words // words_per_page + (0 if words % words_per_page == 0 else 1)

    all_words = []
    for page in range(pages):
        print(f"Page: {page + 1}")
        req = requests.get(page_template.format(page + 1))
        page_soup = bs4.BeautifulSoup(req.text, "lxml")
        all_words += single_page_to_words(page_soup, driver)

    return all_words


def single_page_to_words(soup, driver):
    """
    Collect words from a single page
    """
    lst = soup.find_all(class_="lst")[0]
    children = lst.find_all(recursive=False)

    p = re.compile("(JK\\d+)(?!.*\\1)")
    words_list = []
    for child in children:
        word_dict = {}

        word = list(map(lambda c: c.text, child.select("span:first-child > *")))

        if not word:
            print("Does not have word")
            continue

        word_dict["furigana"] = word[0]
        if len(word) > 1:
            word_dict["kanji"] = word[1]

        result = p.search(child.find_all("a")[0]["href"])

        word_dict["meaning"] = meaning(result.group(1), driver)

        if not word_dict["meaning"]:
            print("Does not have meaning")
            continue

        words_list.append(word_dict)
    return words_list


def meaning(code, driver):
    """
    Extract meaning of word by word code.
    Naver Dictionary uses redirection upon the push of the word anchor.
    We retrieve a word code that lets us go directly to the final redirected link.
    """
    id_template = "https://ja.dict.naver.com/icur/v1/jakodict:alldic:jako:entry/o2n/{}"
    retrieved_code = requests.get(id_template.format(code)).json()

    word_template = "https://ja.dict.naver.com/#/entry/jako/{}"

    driver.get(word_template.format(retrieved_code))

    meaning_path = "/html/body/div[2]/div[2]/div[1]/div[2]/div/p"
    exists = wait(driver, meaning_path)

    if exists:
        return driver.find_element_by_xpath(meaning_path).text

    span_mean_tags = driver.find_elements_by_css_selector(".article span.mean")

    return "\n".join([tag.get_attribute("innerText") for tag in span_mean_tags])


def wait(driver, xpath):
    timeout = 2
    try:
        present = EC.presence_of_element_located((By.XPATH, xpath))
        WebDriverWait(driver, timeout).until(present)
    except TimeoutException:
        return False

    return True


def get_parsed_arguments():
    """
    Retrun parsed command line arguments
    """
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "-l",
        "--level",
        required=True,
        help="JLPT Level. As of March. 2020, JLPT has levels 1 ~ 5",
    )

    parts = [
        "all",
        "noun",
        "pronoun",
        "verb",
        "postposition",
        "adjective",
        "adverb",
        "affix",
        "exclamation",
        "adjective-verb",
        "etc",
    ]
    parser.add_argument(
        "-p",
        "--part",
        required=True,
        help="Part of Speech. Word Class.",
        choices=parts,
    )

    parser.add_argument(
        "-o",
        "--output",
        required=True,
        help="Output Method. Either json or db",
        choices=["json", "db"],
    )

    args = parser.parse_args()
    return {
        "level": args.level,
        "part": args.part,
        "output": args.output,
        "part_index": parts.index(args.part),
    }


def applied_options(path):
    """
    Selenium browser options for optimization
    """
    chrome_options = Options()
    with open(path) as json_file:
        pref_json = json.load(json_file)
    chrome_options.add_experimental_option("prefs", pref_json)
    chrome_options.add_argument("--disable-extensions")
    chrome_options.add_argument("--headless")
    chrome_options.add_experimental_option("detach", True)
    return chrome_options


def init_db(conn, level, part, words_list):
    """
    Create table if necessary and insert words
    """
    cur = conn.cursor()
    try:
        cur.execute(
            f"""CREATE TABLE IF NOT EXISTS level{level} (
                            id SERIAL PRIMARY KEY,
                            furigana text NOT NULL,
                            kanji text,
                            meaning text NOT NULL CHECK (meaning <> ''),
                            part VARCHAR(20) NOT NULL CHECK (part <> '')
                            ) """
        )
    except:
        print("error occurred during table initialization")

    for word in words_list:
        cur.execute(
            f"""INSERT INTO level{level}
            (furigana, kanji, meaning, part)
            VALUES (%s, %s, %s, %s);
            """,
            (
                word["furigana"],
                "" if "kanji" not in word else word["kanji"],
                word["meaning"],
                part,
            ),
        )
    conn.commit()
    cur.close()
    conn.close()


def main():
    parsed_arguments = get_parsed_arguments()

    level = parsed_arguments["level"]
    part_index = parsed_arguments["part_index"]
    output = parsed_arguments["output"]

    file_exists = os.path.isfile(f"./vocablist/level{level}part{part_index}.json")
    if file_exists:
        with open(
            f"./vocablist/level{level}part{part_index}.json", "r", encoding="utf-8"
        ) as f:
            words_list = json.load(f)
    else:
        base_url = "https://ja.dict.naver.com"
        path = "/jlpt/level-{}/parts-{}/p{}.nhn"
        destination_template = base_url + path

        sauce = requests.get(destination_template.format(level, part_index, page)).text
        soup = bs4.BeautifulSoup(sauce, "lxml")
        chrome_options = applied_options("preferences.json")

        driver = webdriver.Chrome("./chromedriver", options=chrome_options)
        words_list = pages_to_words(
            soup, driver, destination_template.format(level, part_index, "{}")
        )

    if output == "db":
        try:
            conn = psycopg2.connect(
                database="vocab_list",
                user="root",
                password="keyboardcat",
                host="localhost",
                port=5432,
            )
        except:
            print("Connection attempt to database failed")
        init_db(conn, level, parsed_arguments["part"], words_list)
    elif not file_exists:
        with open(
            f"./vocablist/level{level}part{part}.json", "w", encoding="utf-8"
        ) as f:
            json.dump(words_list, f, ensure_ascii=False, indent=4)


if __name__ == "__main__":
    main()
