import ollama, { type Message } from "ollama"

export function askMistral(system: string, content: string) {

  const systemMessage: Message = {
    role: "system",
    content: system
  }

  return ollama.chat({
    model: "mistral",
    messages: [
      systemMessage,
      {
        role: "user",
        content
      }
    ]
  })
}