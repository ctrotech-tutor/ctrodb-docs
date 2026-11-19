export type VersionInfo = {
  label: string
  version: string
  badge?: string
}

const versions: VersionInfo[] = [
  { label: "v1.13.2", version: "v1", badge: "Current" },
]

export function getVersions(): VersionInfo[] {
  return versions
}

export function getDefaultVersion(): string {
  return versions[0].version
}

export function isValidVersion(v: string): boolean {
  return versions.some((ver) => ver.version === v)
}

export function getVersionLabel(v: string): string {
  return versions.find((ver) => ver.version === v)?.label ?? v
}

export function getVersionBadge(v: string): string | undefined {
  return versions.find((ver) => ver.version === v)?.badge
}
