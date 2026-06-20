Relations with lazy accessors built into every Model. Eager loading via .with() for the N+1 crowd.

user.posts.fetch()                  // lazy (always works)
users.with("posts", "comments").fetch()  // eager (needs plugin)

has_many, belongs_to, has_one — all defined in the schema.
