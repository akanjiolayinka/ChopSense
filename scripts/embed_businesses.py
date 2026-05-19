"""One-off script that embeds the cleaned business catalogue into pgvector."""

# from app.embeddings.encoder import encode
# from app.db.postgres import get_pool


def main():
    # TODO: read processed businesses, encode descriptions, upsert into the
    # businesses table with their 768-dim embeddings.
    pass


if __name__ == "__main__":
    main()
