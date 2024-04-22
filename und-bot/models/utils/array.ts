import redis from "../../services/redis";

export const get = async <T>(key: string) => {
  return JSON.parse((await redis.get(key)) || "[]") as T[];
};

export const set = async <T>(key: string, value: T[]) => {
  await redis.set(key, JSON.stringify(value));
  return value;
};

export const add = async <T>(key: string, value: T) => {
  const values = await get<T>(key);
  values.push(value);
  await set(key, values);
  return values;
};

export const addMultiple = async <T>(key: string, newValues: T[]) => {
  const values = await get<T>(key);
  await set(key, values.concat(newValues));
  return values.concat(newValues);
};

export const remove = async <T>(key: string, value: T) => {
  const values = await get<T>(key);
  const result = values.filter((v) => v !== value);
  if (result.length === values.length) {
    return values;
  }
  await set(key, result);
  return result;
};

export const removeMultiple = async <T>(key: string, removeValues: T[]) => {
  const values = await get<T>(key);
  const result = values.filter((v) => !removeValues.includes(v));
  if (result.length === values.length) {
    return values;
  }
  await set(key, result);
  return result;
};
