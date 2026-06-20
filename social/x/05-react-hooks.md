React hooks for reactive UIs. useQuery re-fetches when data changes. useMutation tracks loading + error state.

const todos = useQuery("todos", (q) => q.sort({ createdAt: "desc" }))
const { create } = useMutation("todos")

No Redux. No Zustand. No manual subscriptions. Just your database and React.
