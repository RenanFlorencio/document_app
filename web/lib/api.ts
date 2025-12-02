export default async function api(path: string, options: RequestInit = {}) {
  const res = await fetch(process.env.NEXT_PUBLIC_API_URL + path, options);

  if (!res.ok) {
    throw new Error(`API error: ${res.status}`);
  }

  return res.json();
}