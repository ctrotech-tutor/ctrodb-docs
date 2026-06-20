Define a schema once. Get validation, typed queries, and reactive updates for free.

const db = new Database({ name: "app", schema, plugins: [ftsPlugin()] })
await db.connect()
const items = db.collection("items")

Field types, required checks, email/URL validators, regex, defaults — all at write time.
