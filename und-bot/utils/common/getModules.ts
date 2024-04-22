import { glob } from "glob";

async function getModules<T>(pattern: string) {
  const modules = await glob(pattern);
  const result = await Promise.all(
    modules
      .filter((file) => file.endsWith(".ts"))
      .map((file) => import(file.replace(".ts", "")))
  );
  return result as T[];
}

export default getModules;
