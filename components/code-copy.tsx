"use client"

import { useEffect } from "react"

const COPY_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect width="8" height="4" x="8" y="2" rx="1" ry="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/></svg>`
const CHECK_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6L9 17l-5-5"/></svg>`

function injectButtons() {
  document.querySelectorAll<HTMLElement>("figure[data-rehype-pretty-code-figure]").forEach((figure) => {
    if (figure.querySelector("[data-copy-button]")) return

    const wrapper = document.createElement("div")
    wrapper.className = "relative group"

    const btnContainer = document.createElement("div")
    btnContainer.className =
      "empty:hidden absolute top-3 right-2 z-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200"

    const btn = document.createElement("button")
    btn.type = "button"
    btn.setAttribute("aria-label", "Copy Text")
    btn.setAttribute("data-copy-button", "")
    btn.className =
      "inline-flex items-center justify-center rounded-md p-1 text-muted-foreground hover:text-accent-foreground transition-colors duration-100 [&_svg]:size-4"
    btn.innerHTML = COPY_SVG
    btnContainer.appendChild(btn)

    while (figure.firstChild) {
      wrapper.appendChild(figure.firstChild)
    }
    wrapper.prepend(btnContainer)
    figure.appendChild(wrapper)
    figure.classList.add("relative")
  })
}

export function CodeCopyProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    injectButtons()

    const observer = new MutationObserver(() => {
      injectButtons()
    })
    observer.observe(document.body, { childList: true, subtree: true })

    const handler = (e: MouseEvent) => {
      const btn = (e.target as Element).closest<HTMLElement>("[data-copy-button]")
      if (!btn) return

      const figure = btn.closest("figure")
      if (!figure) return

      const code = figure.querySelector("code")
      if (!code?.textContent) return

      navigator.clipboard.writeText(code.textContent)
      btn.innerHTML = CHECK_SVG

      setTimeout(() => {
        btn.innerHTML = COPY_SVG
      }, 2000)
    }

    document.addEventListener("click", handler)
    return () => {
      observer.disconnect()
      document.removeEventListener("click", handler)
    }
  }, [])

  return <>{children}</>
}
