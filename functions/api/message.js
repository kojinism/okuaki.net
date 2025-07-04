// functions/api/message.js
export async function onRequestPost({ request, env }) {
  let data;
  try {
    data = await request.json();
  } catch {
    return new Response('Bad JSON', { status: 400 });
  }

  const text = (data.text || '').toString().trim().slice(0, 300);
  if (!text) {
    return new Response('Empty message', { status: 400 });
  }

  // Compute Manila-local time (UTC+8)
  const now = new Date();
  const manilaMs = now.getTime() + 8 * 60 * 60 * 1000;
  const manilaIso = new Date(manilaMs).toISOString();

  // Build a key with the Manila-local timestamp
  const key = `msg:${manilaIso}:${crypto.randomUUID()}`;
  await env.MESSAGES.put(key, text);

  return new Response('Stored', { status: 201 });
}
