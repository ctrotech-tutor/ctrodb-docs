import { PackageTabs } from "./package-tabs";

const INSTALL_COMMANDS = [
  {
    label: "npm",
    title: "npm install",
    lang: "bash",
    code: "npm install ctrodb",
  },
  {
    label: "pnpm",
    title: "pnpm add",
    lang: "bash",
    code: "pnpm add ctrodb",
  },
  {
    label: "yarn",
    title: "yarn add",
    lang: "bash",
    code: "yarn add ctrodb",
  },
  {
    label: "bun",
    title: "bun add",
    lang: "bash",
    code: "bun add ctrodb",
  },
];

export function InstallTabs() {
  return <PackageTabs tabs={INSTALL_COMMANDS} />;
}