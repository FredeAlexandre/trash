export function translate(text: string):
  | {
      name: string;
      grid: { width: number; height: number };
    }
  | {
      name: string;
      grid: { width: number; height: number };
      animation: { id: number; next: number };
    } {
  const regex = /^[a-zA-Z0-9-]+@\d+(\.\d+)?(#\d+\.\d+)?$/;

  if (!regex.test(text))
    throw new Error("invalid string format for tanslation");

  const [name, rest] = text.split("@");

  if (!rest || rest.length === 0)
    return { name: name!, grid: { width: 1, height: 1 } };

  const [size, animation] = rest.split("#");

  // eslint-disable-next-line prefer-const
  let [width, height] = size!.split(".").map((v) => parseInt(v));

  if (!height) height = width;

  if (!animation)
    return { name: name!, grid: { width: width!, height: height! } };

  const [id, next] = animation.split(".").map((v) => parseInt(v));

  return {
    name: name!,
    grid: { width: width!, height: height! },
    animation: { id: id!, next: next! },
  };
}
