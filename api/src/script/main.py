#!/usr/bin/env python

import argparse
import json
import os.path
import psycopg2
import requests
import urllib.parse


def get_parsed_arguments():
    """
    Return parsed command line arguments
    """
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "-l",
        "--level",
        required=True,
        help="JLPT Level. As of March. 2020, JLPT has levels 1 ~ 5",
    )

    part_dict = {
        "all": "전체",
        "noun": "명사",
        "pronoun": "대명사",
        "verb": "동사",
        "postposition": "조사",
        "adjective": "형용사",
        "adverb": "부사",
        "affix": "접사",
        "exclamation": "감동사",
        "adjective-verb": "형용동사",
        "etc": "기타",
    }

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
        "part_ko": part_dict[args.part],
        "output": args.output,
        "part_en": args.part,
    }


def init_db(conn, level, part, word_list):
    """
    Create table if necessary and insert words
    """
    cur = conn.cursor()
    try:
        cur.execute(
            f"""CREATE TABLE IF NOT EXISTS level{level} (
                            id SERIAL PRIMARY KEY,
                            furigana text NOT NULL,
                            furigana_show text NOT NULL,
                            kanji text,
                            meaning text NOT NULL CHECK (meaning <> ''),
                            part VARCHAR(20) NOT NULL CHECK (part <> '')
                            ) """
        )
    except:
        print("error occurred during table initialization")

    for word in word_list:
        cur.execute(
            f"""INSERT INTO level{level}
            (furigana, furigana_show, kanji, meaning, part)
            VALUES (%s, %s, %s, %s, %s);
            """,
            (
                word["furigana"],
                word["furigana_show"],
                "" if "kanji" not in word else word["kanji"],
                word["meaning"],
                part,
            ),
        )
    conn.commit()
    cur.close()
    conn.close()


def retrieve_word_list(level, part):
    base_path = "https://ja.dict.naver.com/api/jako/getJLPTList.nhn"
    params = {"level": level, "part": part}
    encoded_params = urllib.parse.urlencode(params, quote_via=urllib.parse.quote)
    pages = requests.get(f"{base_path}?{encoded_params}").json()["m_totalPage"]

    word_list = []
    for page in range(pages):
        print(f"Page {page + 1}")
        encoded_params = urllib.parse.urlencode(
            {**params, page: page + 1}, quote_via=urllib.parse.quote
        )
        items = requests.get(f"{base_path}?{encoded_params}").json()["m_items"]

        word_list += [
            {
                "furigana": urllib.parse.unquote(item["entry"]),
                "furigana_show": item["show_entry"],
                "meaning": ",".join(item["means"]),
                "kanji": item["pron"],
            }
            for item in items
        ]

    return word_list


def main():
    parsed_arguments = get_parsed_arguments()

    level = parsed_arguments["level"]
    output = parsed_arguments["output"]
    part_en = parsed_arguments["part_en"]
    part_ko = parsed_arguments["part_ko"]

    output_filename = f"./vocablist/level{level}{part_en}.json"

    file_exists = os.path.isfile(output_filename)
    if file_exists:
        with open(output_filename, "r", encoding="utf-8") as f:
            word_list = json.load(f)
    else:
        word_list = retrieve_word_list(level, part_ko)

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
        init_db(conn, level, part_en, word_list)
    elif not file_exists:
        with open(output_filename, "w", encoding="utf-8") as f:
            json.dump(word_list, f, ensure_ascii=False, indent=4)


if __name__ == "__main__":
    main()
