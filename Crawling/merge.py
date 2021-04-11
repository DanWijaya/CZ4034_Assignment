"""
This script merges crawled data with classification results.
"""
import pandas as pd


def add_click_counts(review_csv):
    review_csv["click_counts"] = 0
    return review_csv


def main():
    review_csv = pd.read_csv("review_table_edited.csv")
    print(review_csv.head())


if __name__ == "__main__":
    main()
