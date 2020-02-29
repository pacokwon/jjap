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


def pages_to_words(soup, url):
    pass


def wordcode_from_url(url):
    pass


def single_page_to_words(soup, driver, base_url):
    lst = soup.find_all(class_="lst")[0]
    children = lst.find_all(recursive=False)

    p = re.compile("(JK\\d+)(?!.*\\1)")
    for child in children:
        print(child)
        result = p.search(child.find_all("a")[0]["href"])
        print(meaning(result.group(1), driver))


def meaning(code, driver):
    """
    Extract meaning of word by word code.
    Naver Dictionary uses redirection upon the push of the word anchor.
    We retrieve a word code that lets us go directly to the final redirected link.
    """
    id_template = "https://ja.dict.naver.com/icur/v1/jakodict:alldic:jako:entry/o2n/{}"
    retrieved_code = requests.get(id_template.format(code)).json()

    word_template = "https://ja.dict.naver.com/#/entry/jako/{}"
    # print(word_template.format(retrieved_code))

    driver.get(word_template.format(retrieved_code))
    exists = wait(driver, "/html/body/div[2]/div[2]/div[1]/div[2]/div/p")
    return (
        driver.find_element_by_xpath(
            "/html/body/div[2]/div[2]/div[1]/div[2]/div/p"
        ).text
        if exists
        else ""
    )


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
        help="JLPT Level. As of Feb. 2020, JLPT has levels 1 ~ 5",
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
    level, part = get_parsed_arguments()

    base_url = "https://ja.dict.naver.com"
    path = "/jlpt/level-{}/parts-{}/p1.nhn"

    sauce = requests.get(f"{base_url}{path}".format(level, part)).text
    soup = bs4.BeautifulSoup(sauce, "lxml")

    chrome_options = Options()
    with open("preferences.json") as json_file:
        pref_json = json.load(json_file)
    chrome_options.add_experimental_option("prefs", pref_json)
    chrome_options.add_experimental_option("detach", True)
    chrome_options.add_argument("--disable-extensions")
    chrome_options.add_argument("--headless")

    driver = webdriver.Chrome("./chromedriver", options=chrome_options)
    single_page_to_words(soup, driver, base_url)


if __name__ == "__main__":
    main()
