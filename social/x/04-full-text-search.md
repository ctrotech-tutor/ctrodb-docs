Built-in FTS plugin. Inverted index, stop word removal, auto-indexed on create/update/delete. No search service, no API key, no network request.

items.query().search("title", "typescript").fetch()

The index lives in IndexedDB alongside your data. Millisecond search on thousands of docs.
