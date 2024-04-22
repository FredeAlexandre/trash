import { JSDOM } from "jsdom"

export async function getInstagramDescription(_link: string) {
  const link = _link.trim()
  if (!link) return null
  const page = await fetch(link)
  const html = await page.text()
  const dom = new JSDOM(html)

  const element = dom.window.document.querySelector(`meta[property="og:title"]`)

  if (element === null) return null

  return element.getAttribute("content")
}