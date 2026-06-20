The QueryBuilder does where, sort, limit, offset, and OR groups. The planner picks index scans when it can, full scans when it has to.

items.query()
  .where("price", "<", 100)
  .sort({ name: "asc" })
  .limit(20)
  .fetch()

No raw IndexedDB. No manual filtering.
