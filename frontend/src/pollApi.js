const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8787'

async function createPoll({ title, choices }) {
  const res = await fetch(`${API_BASE}/polls`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, choices })
  })
  return res.json()
}

async function getPoll(id) {
  const res = await fetch(`${API_BASE}/polls/${id}`)
  if (!res.ok) throw new Error('Poll not found')
  return res.json()
}

async function vote(id, choiceIndex) {
  const res = await fetch(`${API_BASE}/polls/${id}/vote`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ choiceIndex })
  })
  if (!res.ok) throw new Error('Vote failed')
  return res.json()
}

export { createPoll, getPoll, vote }
