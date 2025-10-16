import { v4 as uuidv4 } from 'uuid'

/**
 * Poll storage shape:
 * {
 *   id: string,
 *   title: string,
 *   choices: string[],
 *   counts: number[]
 * }
 */

async function handleCreate(request, kv) {
  const body = await request.json().catch(() => null)
  if (!body || !body.title || !Array.isArray(body.choices)) {
    return new Response(JSON.stringify({ error: 'Invalid body' }), { status: 400 })
  }
  const id = uuidv4()
  const poll = { id, title: body.title, choices: body.choices, counts: body.choices.map(() => 0) }
  await kv.put(`poll:${id}`, JSON.stringify(poll))
  return new Response(JSON.stringify({ ok: true, id }), { status: 200 })
}

async function handleGet(id, kv) {
  const raw = await kv.get(`poll:${id}`)
  if (!raw) return new Response(JSON.stringify({ error: 'Not found' }), { status: 404 })
  return new Response(raw, { status: 200 })
}

async function handleVote(id, request, kv) {
  const body = await request.json().catch(() => null)
  if (!body || typeof body.choiceIndex !== 'number') {
    return new Response(JSON.stringify({ error: 'Invalid body' }), { status: 400 })
  }
  const key = `poll:${id}`
  const raw = await kv.get(key)
  if (!raw) return new Response(JSON.stringify({ error: 'Not found' }), { status: 404 })
  const poll = JSON.parse(raw)
  const idx = body.choiceIndex
  if (idx < 0 || idx >= poll.choices.length) {
    return new Response(JSON.stringify({ error: 'Invalid choice index' }), { status: 400 })
  }
  // Minimal optimistic update: get, modify, put. For strict concurrency use Durable Objects.
  poll.counts[idx] = (poll.counts[idx] || 0) + 1
  await kv.put(key, JSON.stringify(poll))
  return new Response(JSON.stringify(poll), { status: 200 })
}

export default {
  async fetch(request, env) {
    const kv = env?.POLLS || globalThis.POLLS
    const url = new URL(request.url)
    if (url.pathname === '/status' && request.method === 'GET') {
      return new Response(JSON.stringify({ ok: true, version: 'v1' }), { status: 200 })
    }
    if (url.pathname === '/polls' && request.method === 'POST') {
      return handleCreate(request, kv)
    }
    const voteMatch = url.pathname.match(/^\/polls\/([^/]+)\/vote$/)
    if (voteMatch && request.method === 'POST') {
      const id = voteMatch[1]
      return handleVote(id, request, kv)
    }
    const getMatch = url.pathname.match(/^\/polls\/([^/]+)$/)
    if (getMatch && request.method === 'GET') {
      const id = getMatch[1]
      return handleGet(id, kv)
    }
    return new Response(JSON.stringify({ error: 'Not found' }), { status: 404 })
  }
}
