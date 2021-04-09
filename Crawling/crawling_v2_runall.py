import pandas as pd
import requests
from requests_html import HTMLSession
from bs4 import BeautifulSoup
import datetime
import time

delay = 0.5


def getAmazonSearch(search_query):
    url = "https://www.amazon.com/s?k=" + search_query
    print(url)
    time.sleep(delay)

    page = sess.get(url)
    page.html.render(sleep=0.5)
    if page.status_code == 200:
        return page
    else:
        return "Error"


def Searchasin(asin):
    url = "https://www.amazon.com/dp/" + asin
    print(url)
    time.sleep(delay)

    page = sess.get(url)
    page.html.render(sleep=0.5)
    if page.status_code == 200:
        return page
    else:
        return "Error"


def Searchreviews(review_link):
    url = "https://www.amazon.com" + review_link
    print(url)
    time.sleep(delay)

    page = sess.get(url)
    page.html.render(sleep=0.5)

    if page.status_code == 200:
        return page
    else:
        return "Error"


def getReviewsByProduct(generic_products, data_asin):
    link = []
    generic_products_refined = []

    print(f"Total products available: {len(data_asin)}")
    for i in range(len(data_asin)):
        response = Searchasin(data_asin[i])
        l = response.html.xpath("//a[@data-hook='see-all-reviews-link-foot']/@href", first=True)
        if l is not None:
            link.append(l)
            generic_products_refined.append(generic_products[i])
        else:
            print(f"No links found for this product: {i}")

    print(f"Total number of links found: {len(link)}")
    result_list = []

    for j in range(len(link)):
        for k in range(1, 5):
            print(f"Crawling page {k} of reviews...")
            response = Searchreviews(link[j] + '&pageNumber=' + str(k))
            product_name = response.html.xpath("//a[@data-hook='product-link']/text()", first=True)

            review_elements = response.html.xpath("//div[@data-hook='review' and following-sibling::h3[@data-hook='dp-global-reviews-header']]")
            if len(review_elements) == 0:
                review_elements = response.html.xpath("//div[@data-hook='review']")

            for i in review_elements:
                # uname = i.find("span", {"class": "a-profile-name"}).text.strip()
                uname = i.xpath(".//span[@class='a-profile-name']/text()", first=True).strip()
                # rating = float(i.find("span", {"class": "a-icon-alt"}).text.strip().split()[0])
                rating = float(i.xpath(".//span[@class='a-icon-alt']/text()", first=True).strip().split()[0])

                # review = i.find("span", {"data-hook": "review-body"})
                review = i.xpath(".//span[@data-hook='review-body']/span/text()")
                if len(review) > 1:
                    review = "\n".join(review)
                elif len(review) == 1:
                    review = review[0]

                review = review.strip() if review is not None else ""
                product = product_name

                # review_title = i.find("a", {"data-hook": "review-title"})
                review_title = i.xpath(".//*[@data-hook='review-title']/span/text()", first=True)

                # review_title = review_title.text.strip() if review_title is not None else ""
                review_title = review_title.strip() if review_title is not None else ""

                # date = i.find("span", {"data-hook": "review-date"}).text.strip().split()[-3:]
                # date = " ".join(d.replace(",","") for d in date)
                # date = datetime.datetime.strptime(date, "%B %d %Y")
                # date = date.isoformat()
                date = i.xpath(".//span[@data-hook='review-date']/text()")[0].strip().split()[-3:]
                date = " ".join(d.replace(",", "") for d in date)
                date = datetime.datetime.strptime(date, "%B %d %Y")
                date = date.isoformat()

                image = i.xpath(".//img[@data-hook='review-image-tile']/@src", first=True)
                image = image if image is not None else ""

                # upvotes = i.find("span", {"data-hook": "helpful-vote-statement"})
                upvotes = i.xpath(".//span[@data-hook='helpful-vote-statement']/text()", first=True)
                upvotes = upvotes.strip().split()[0] if upvotes is not None else 0

                if upvotes == "One":
                    upvotes = "1"
                elif upvotes == "Two":
                    upvotes = "2"

                product_id = link[j].split("/")[3]  # asin
                row = (product_id, product, generic_products_refined[j], uname, rating, review_title, review, date, image, upvotes)
                result_list.append(row)

            print(f"{len(result_list)} records crawled..")

    return result_list


if __name__ == '__main__':
    sess = HTMLSession()
    # generic_products = ["smartphone", "television", "headphones", "monitor", "keyboard", "router", "laptop", "printer", "data storage", "speaker"]
    # generic_products = ["smartphone", "television"]
    final = []

    file = "product_lists.csv"
    df = pd.read_csv(file)
    data_asin = df["product_id"]
    generic_products = df["generic_product"]

    reviews = getReviewsByProduct(generic_products, data_asin)
    print(f"Total {len(reviews)} reviews crawled.")
    final.extend(reviews)
    df = pd.DataFrame(final, columns=['product_id', 'product', 'generic_product', 'uname', 'rating', 'review_title',
                                      'review', 'date', 'image', 'upvotes'])
    df.to_csv("review_table.csv")


    # for search_query in generic_products:
    #     q = search_query.replace(" ", "+")
    #     response = getAmazonSearch(q)
    #     data_asin = []
    #     for i in response.html.xpath(
    #             "//*[@class='s-result-item s-asin sg-col-0-of-12 sg-col-16-of-20 sg-col sg-col-12-of-16']/@data-asin"):
    #         data_asin.append(i)
    #
    #     reviews = getReviewsByProduct(search_query)
    #     print(f"Total {len(reviews)} reviews crawled for {search_query}.")
    #     final.extend(reviews)

    # df = pd.DataFrame(final, columns=['product_id', 'product', 'generic_product', 'uname', 'rating', 'review_title',
    #                                   'review', 'date', 'image', 'upvotes'])
    # df.to_csv("review_table.csv")
