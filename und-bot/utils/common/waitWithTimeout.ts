import wait from "./wait";

async function promiseTimeout(timeout: number) {
  await wait(timeout);
  throw new Error("TIMEOUT");
}

async function waitWithTimeout<T>(
  promise: Promise<T>,
  timeout: number,
  onTimeout: () => void
) {
  try {
    const result = await Promise.race([promise, promiseTimeout(timeout)]);
    if (result) return result;
  } catch (error) {
    if (
      typeof error == "object" &&
      error != null &&
      "message" in error &&
      error.message == "TIMEOUT"
    ) {
      onTimeout();
    } else {
      throw error;
    }
  }
  return await promise;
}

export default waitWithTimeout;
