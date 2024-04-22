import redis from "../../services/redis";

export const get = async (key: string) => {
  return parseInt((await redis.get(key)) || "0");
};

export const set = async (key: string, value: number) => {
  return parseInt((await redis.set(key, value)) || "0");
};

export const add = async (key: string, value: number) => {
  return (await redis.incrBy(key, value)) || 0;
};

export const remove = async (key: string, value: number) => {
  return (await redis.decrBy(key, value)) || 0;
};
