"""
This script merges crawled data with classification results.
"""
import pandas as pd


def add_click_counts(review_csv):
    review_csv["click_counts"] = 0
    return review_csv


def main():
    product_csv = pd.read_csv("product_lists.csv")
    result_csv = pd.read_csv("result.csv")
    review_csv = pd.read_csv("review_table.csv")
    print(add_click_counts(review_csv).to_csv("review_table_click_counts.csv", index=False))

    # print(len(review_csv))
    # print(len(product_csv))
    # print(result_csv["product_id"].value_counts())


if __name__ == "__main__":
    main()
