import { Redis } from '@upstash/redis'

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN
})

export default async function handler(req, res) {
  const { id } = req.query
  if (req.method === 'POST') {
    const body = req.body
    if (!body || typeof body.choiceIndex !== 'number') return res.status(400).json({ error: 'Invalid body' })
    const key = `poll:${id}`
    const raw = await redis.get(key)
    if (!raw) return res.status(404).json({ error: 'Not found' })
    const poll = JSON.parse(raw)
    const idx = body.choiceIndex
    if (idx < 0 || idx >= poll.choices.length) return res.status(400).json({ error: 'Invalid choice index' })
    // atomic increment via Redis INCR is better, but here we update the JSON as we stored it
    poll.counts[idx] = (poll.counts[idx] || 0) + 1
    await redis.set(key, JSON.stringify(poll))
    return res.status(200).json(poll)
  }
  res.status(405).json({ error: 'Method not allowed' })
}
