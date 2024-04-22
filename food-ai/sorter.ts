import { resolve } from "node:path"
import { homedir } from "node:os"
import { existsSync } from "node:fs"

import ollama, { type Message } from "ollama"
import chalk from "chalk"

const directory = resolve(homedir(), "Documents/Obsidian Vaults/memory/projects/personal/food")

if (!existsSync(directory)) {
  console.log(chalk.red(`The directory doesn't exists at: ${directory}`))
  process.exit(1)
}

const filePath = resolve(directory, "links.md")

const linksFile = Bun.file(filePath)

if (!await linksFile.exists()) {
  console.log(chalk.red(`The "links" file doesn't exists at: ${filePath}`))
  process.exit(1)
}

const links = await linksFile.text()

const messages: Message[] = [
  {
    role: "system",
    content: `For each line of the input, transform the part after the URL into tags separated by commas. Ensure the format is precise for programmatic parsing. The input will contain URLs followed by tags. Convert the space between tags into a comma without altering the original tag meanings. Example:
    Input: https://www.example.com/page - tag1 tag2
    Output: https://www.example.com/page - tag1,tag2

    Your task is to apply this transformation to all input lines.`
  },
  {
    role: "user",
    content: links.split("\n").slice(0, 1).join("\n")
  }
]

const response = await ollama.chat({
  model: "mistral",
  messages
})

console.log(response.message.content)