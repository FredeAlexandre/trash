import { Glob } from "bun";

const glob = new Glob("./output/*.md");

for await (const file of glob.scan(".")) {
  let content = await Bun.file(file).text();
  const lines = content.split("\n");

  if (lines.length == 0) continue;
  const title = lines[0].replace(" # ", "");
  let link: string | undefined;
  let link_line: number | undefined;

  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes("[Instagram]")) {
      link = lines[i].split("(")[1].split(")")[0];
      link_line = i;
      break;
    }
  }

  if (!link_line) continue;

  const iframe = `<iframe width="400" height="400" src="${link}/embed/captioned"></iframe>`;

  content = `# ${title}\n\n${iframe}\n\n${lines.slice(2).join("\n")}`;

  await Bun.write(`./vault/${title}.md`, content);
}
