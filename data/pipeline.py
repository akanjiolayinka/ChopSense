"""Yelp dataset ingestion pipeline.

Reads the raw Yelp parquet files, filters to the business categories we care
about, normalises fields, and writes the processed catalogue ready for
embedding and database load.
"""

# import pandas as pd


def load_raw_businesses(path):
    # TODO: read the raw parquet/JSON dump from `path`.
    return None


def clean_businesses(df):
    # TODO: filter, normalise columns, and drop incomplete rows.
    return df


def run():
    # TODO: orchestrate load → clean → write to data/processed/.
    pass


if __name__ == "__main__":
    run()
