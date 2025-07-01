import { LIVE_API_URL, LOCAL_API_URL } from "./constants";

export async function fetchLocation(index) {
  const res = await fetch(`${LOCAL_API_URL}?index=${index}`);
  if (res.status === 204) return null;
  const data = await res.json();
  return data;
}

export const retryOrThrowError = async (
  fn,
  args,
  retryDelay,
  maxRetries = 5
) => {
  return new Promise((resolve, reject) => {
    let attempts = 0;

    const attempt = async () => {
      try {
        const res = await fn(...args);

        if (res.success) {
          return resolve(res.data);
        }
      } catch (err) {}

      attempts++;
      if (attempts >= maxRetries) {
        return reject(new Error("Retry limit reached"));
      }

      setTimeout(attempt, retryDelay);
    };

    attempt();
  });
};
