#!/usr/bin/env python

import argparse
import bs4
import json
import re
import requests
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.common.exceptions import TimeoutException
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.by import By


def pages_to_words(soup, driver, page_template):
    p = re.compile("단어 (\\d+)건")
    words = int(p.search(soup.find_all(class_="jlpt_rgt")[0].text).group(1))

    words_per_page = 38
    pages = words // words_per_page + (0 if words % words_per_page == 0 else 1)
    print(pages)


def single_page_to_words(soup, driver):
    lst = soup.find_all(class_="lst")[0]
    children = lst.find_all(recursive=False)

    p = re.compile("(JK\\d+)(?!.*\\1)")
    for child in children:
        print(
            "Word:", list(map(lambda c: c.text, child.select("span:first-child > *")))
        )
        result = p.search(child.find_all("a")[0]["href"])
        print("Meaning:", meaning(result.group(1), driver))


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

    args = parser.parse_args()
    return args.level, parts.index(args.part)


def main():
    # level, part = get_parsed_arguments()
    level, part = 4, 1
    page = 1

    base_url = "https://ja.dict.naver.com"
    path = "/jlpt/level-{}/parts-{}/p{}.nhn"
    destination_template = base_url + path

    sauce = requests.get(destination_template.format(level, part, page)).text
    soup = bs4.BeautifulSoup(sauce, "lxml")

    chrome_options = Options()
    with open("preferences.json") as json_file:
        pref_json = json.load(json_file)
    chrome_options.add_experimental_option("prefs", pref_json)
    chrome_options.add_argument("--disable-extensions")
    chrome_options.add_argument("--headless")
    chrome_options.add_experimental_option("detach", True)

    driver = webdriver.Chrome("./chromedriver", options=chrome_options)
    # single_page_to_words(soup, driver, base_url)
    pages_to_words(soup, driver, destination_template.format(level, part, "{}"))


if __name__ == "__main__":
    main()
