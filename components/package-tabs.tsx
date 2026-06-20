"use client";

import * as Tabs from "@radix-ui/react-tabs";
import { useEffect, useState } from "react";
import { codeToHtml } from "shiki";

type PackageTab = {
  label: string;
  code: string;
  lang?: string;
  title?: string;
};

export function PackageTabs({ tabs }: { tabs: PackageTab[] }) {
  const [htmlMap, setHtmlMap] = useState<Record<string, string>>({});
  const [activeTab, setActiveTab] = useState(tabs[0]?.label);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function highlight() {
      const result: Record<string, string> = {};

      for (const tab of tabs) {
        result[tab.label] = await codeToHtml(tab.code, {
          lang: tab.lang ?? "bash",
          themes: {
            light: "github-light",
            dark: "github-dark",
          },
          defaultColor: false,
        });
      }

      setHtmlMap(result);
    }

    highlight();
  }, [tabs]);

  async function copyCode() {
    const tab = tabs.find((t) => t.label === activeTab);
    if (!tab) return;

    await navigator.clipboard.writeText(tab.code);

    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  }

  const currentTab = tabs.find((t) => t.label === activeTab);

  return (
    <Tabs.Root
      value={activeTab}
      onValueChange={setActiveTab}
      className="rounded-xl border bg-card my-5 overflow-hidden"
    >
      {/* HEADER */}
      <div className="flex items-center justify-between border-b px-5 py-2 bg-muted/40">
        <span className="text-xs text-muted-foreground font-medium transition-all duration-200">
          {currentTab?.title ?? "Terminal"}
        </span>

        <button
          onClick={copyCode}
          className="
            text-[11px]
            px-2 py-1
            rounded-md
            border
            bg-background/80
            hover:bg-background
            transition-all duration-200
            active:scale-95
          "
        >
          {copied ? "Copied" : "Copy"}
        </button>
      </div>

      {/* TABS */}
      <Tabs.List className="flex gap-2 px-2 overflow-x-auto border-b text-muted-foreground">
        {tabs.map((tab) => (
          <Tabs.Trigger
            key={tab.label}
            value={tab.label}
            className="
              px-3 py-2 text-sm font-medium
              relative
              transition-colors duration-200
              data-[state=active]:text-primary
              data-[state=active]:after:absolute
              data-[state=active]:after:bottom-0
              data-[state=active]:after:left-2
              data-[state=active]:after:right-2
              data-[state=active]:after:h-0.5
              data-[state=active]:after:bg-primary
              data-[state=active]:after:rounded-full
            "
          >
            {tab.label}
          </Tabs.Trigger>
        ))}
      </Tabs.List>

      {/* CONTENT */}
      <div className="relative">
        {tabs.map((tab) => (
          <Tabs.Content
            key={tab.label}
            value={tab.label}
            className="
              relative
              focus-visible:outline-none
              data-[state=active]:animate-in
              data-[state=active]:fade-in-0
              data-[state=active]:slide-in-from-bottom-1
              duration-200
            "
          >
            <div
              className="package-code py-3 px-5 overflow-x-auto text-sm transition-all duration-200"
              dangerouslySetInnerHTML={{
                __html: htmlMap[tab.label] ?? "",
              }}
            />
          </Tabs.Content>
        ))}
      </div>
    </Tabs.Root>
  );
}
