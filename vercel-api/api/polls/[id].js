import { Redis } from '@upstash/redis'

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN
})

export default async function handler(req, res) {
  const { id } = req.query
  if (req.method === 'GET') {
    const raw = await redis.get(`poll:${id}`)
    if (!raw) return res.status(404).json({ error: 'Not found' })
    return res.status(200).json(JSON.parse(raw))
  }
  res.status(405).json({ error: 'Method not allowed' })
}
