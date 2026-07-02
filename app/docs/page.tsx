import { redirect } from "next/navigation"
import { getDefaultVersion } from "@/lib/versions"

export default function DocsRoot() {
  redirect(`/docs/${getDefaultVersion()}/getting-started/installation`)
}
