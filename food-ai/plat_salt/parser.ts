import ollama, { type Message } from "ollama"
import { getInstagramDescription } from "../utils/getInstagramDescription"

import chalk from "chalk"
import { resolve } from "node:path"
import { askMistral } from "../utils/askMistral"

const systemMessage = `The user send you a recipe you need to format it like this:\n\n# Title\n\n## Ingredients\n\n- Ingredient 1\n- Ingredient 2\n\n## Instructions\n\n1. Step 1\n2. Step 2\n\n## Notes\n\n- Note 1\n- Note 2\n\n# Tags\n\n- Tag 1\n- Tag 2\n\n# Source\n\n- [Instagram](link)`

console.log(chalk.white(`Getting inputs...`))

const inputs = await Bun.file("./inputs.md").text()

const BATCH_SIZE = 10

const links = inputs.split("\n")
const batches: string[][] = []

for (let i = 0; i < links.length; i += BATCH_SIZE) {
  batches.push(links.slice(i, i + BATCH_SIZE))
}

let i = 1;
let total = batches.length

for await (const batch of batches) {
  if (i !== 1) {
    console.log(chalk.cyan(`\n==================================\n`))
  }
  console.log(chalk.cyan(`PROCESSING BATCH ${i}/${total} !\n`))

  const promises = batch.map(async (link) => {
    const id = link.split("/").pop()?.trim()

    if (await Bun.file(`./output/${id}.md`).exists()) {
      console.log(chalk.gray(`Skipping ${id} already exists!`))
      return
    }

    console.log(chalk.blue(`Getting description for ${id}`))
    const description = await getInstagramDescription(link)
    if (description === null) {
      console.log(chalk.red(`Failed to get description for ${id}`))
      return
    }
    console.log(chalk.yellow(`Asking Mistral for ${id}`))
    const message = `${link}\n\n${description}`
    const response = await askMistral(systemMessage, message)
    console.log(chalk.magenta(`Mistral responded for ${id}`))
    await Bun.write(resolve(`./output/${id}.md`), response.message.content)
    console.log(chalk.green(`Saved ${id}`))
  })

  await Promise.all(promises)
  i++
}
