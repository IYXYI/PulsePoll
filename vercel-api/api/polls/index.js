import { Redis } from '@upstash/redis'
import { v4 as uuidv4 } from 'uuid'

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN
})

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const body = req.body
    if (!body || !body.title || !Array.isArray(body.choices)) {
      return res.status(400).json({ error: 'Invalid body' })
    }
    const id = uuidv4()
    const poll = { id, title: body.title, choices: body.choices, counts: body.choices.map(() => 0) }
    await redis.set(`poll:${id}`, JSON.stringify(poll))
    return res.status(200).json({ ok: true, id })
  }
  res.status(405).json({ error: 'Method not allowed' })
}
