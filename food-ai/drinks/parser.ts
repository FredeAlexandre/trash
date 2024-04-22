import ollama, { type Message } from "ollama"
import { getInstagramDescription } from "../utils/getInstagramDescription"

import chalk from "chalk"
import { resolve } from "node:path"

const systemMessage: Message = {
  role: "system",
  content: `The user sed you a drink recipe you need to format it liek this:\n\n# Title\n\n## Ingredients\n\n- Ingredient 1\n- Ingredient 2\n\n## Instructions\n\n1. Step 1\n2. Step 2\n\n## Notes\n\n- Note 1\n- Note 2\n\n# Tags\n\n- Tag 1\n- Tag 2\n\n# Source\n\n- [Instagram](link)`
}

const inputs = await Bun.file("./inputs.md").text()

console.log(chalk.blue(`Getting links descriptions...`))

const fetchers = (await Promise.all(inputs.split("\n").map(async (link) => {
  return {
    link,
    description: await getInstagramDescription(link)
  }
}))).filter((x) => !!x) as {link: string, description: string}[]

for await (const {link, description} of fetchers) {
  const id = link.split("/").pop()?.trim()

  console.log(chalk.blue(`Requesting Mistral for ${id}`))

  const response = await ollama.chat({
    model: "mistral",
    messages: [
      systemMessage,
      {
        role: "user",
        content: `${link}\n\n${description}`
      }
    ]
  })

  await Bun.write(resolve(`./output/${id}.md`), response.message.content)

  console.log(chalk.green(`Mistral responded for ${id}`))
}
