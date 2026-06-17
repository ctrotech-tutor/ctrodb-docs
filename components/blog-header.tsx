export function BlogHeader({
  title,
  description,
  date,
  author,
  tags,
}: {
  title: string
  description: string
  date: string
  author: string
  tags: string[]
}) {
  return (
    <header className="not-prose mb-12">
      <div className="mb-4 flex flex-wrap gap-2">
        {tags.map((tag) => (
          <span
            key={tag}
            className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground"
          >
            {tag}
          </span>
        ))}
      </div>
      <h1 className="text-4xl font-bold tracking-tight">{title}</h1>
      <p className="mt-2 text-lg text-muted-foreground">{description}</p>
      <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
        <time dateTime={date}>
          {new Date(date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </time>
        <span aria-hidden="true">&middot;</span>
        <span>{author}</span>
      </div>
    </header>
  )
}
