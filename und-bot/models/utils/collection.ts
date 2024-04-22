import redis from "../../services/redis";

const removeDuplicates = <T>(array: T[]) => {
  return [...new Set(array)];
};

export const get = async <T>(key: string) => {
  return JSON.parse((await redis.get(key)) || "[]") as T[];
};

export const set = async <T>(key: string, value: T[]) => {
  const result = removeDuplicates(value);
  await redis.set(key, JSON.stringify(result));
  return result;
};

export const add = async <T>(key: string, value: T) => {
  const values = await get<T>(key);
  values.push(value);
  const result = removeDuplicates(values);
  await set(key, result);
  return result;
};

export const addMultiple = async <T>(key: string, newValues: T[]) => {
  const values = await get<T>(key);
  const result = removeDuplicates(values.concat(newValues));
  await set(key, result);
  return result;
};

export const remove = async <T>(key: string, value: T) => {
  const values = await get<T>(key);
  const result = removeDuplicates(values.filter((v) => v !== value));
  if (result.length === values.length) {
    return values;
  }
  await set(key, result);
  return result;
};

export const removeMultiple = async <T>(key: string, removeValues: T[]) => {
  const values = await get<T>(key);
  const result = removeDuplicates(
    values.filter((v) => !removeValues.includes(v))
  );
  if (result.length === values.length) {
    return values;
  }
  await set(key, result);
  return result;
};
