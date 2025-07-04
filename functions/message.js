// functions/message.js
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

  // Unique key: msg:timestamp:uuid
  const key = `msg:${new Date().toISOString()}:${crypto.randomUUID()}`;
  await env.MESSAGES.put(key, text);

  return new Response('Stored', { status: 201 });
}
