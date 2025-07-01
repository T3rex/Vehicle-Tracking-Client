import { LOCAL_API_URL } from "./constants";

export async function fetchLocation(index) {
  const res = await fetch(`${LOCAL_API_URL}?index=${index}`);
  if (res.status === 204) return null;
  const data = await res.json();
  return data;
}
