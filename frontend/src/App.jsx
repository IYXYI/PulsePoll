import React, { useState } from 'react'
import { createPoll, getPoll, vote } from './pollApi'

function CreateForm({ onCreated }) {
  const [title, setTitle] = useState('')
  const [choicesText, setChoicesText] = useState('')
  const [error, setError] = useState(null)

  async function submit(e) {
    e.preventDefault()
    setError(null)
    const choices = choicesText
      .split('\n')
      .map(s => s.trim())
      .filter(Boolean)
    if (!title || choices.length < 2) {
      setError('Please provide a title and at least two choices.')
      return
    }
    try {
      const res = await createPoll({ title, choices })
      if (res.ok) onCreated(res.id)
      else setError('Create failed')
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <form onSubmit={submit}>
      <h2>Create a poll</h2>
      {error && <div className="error">{error}</div>}
      <input placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} />
      <textarea placeholder="One choice per line" value={choicesText} onChange={e => setChoicesText(e.target.value)} />
      <button type="submit">Create</button>
    </form>
  )
}

function PollView({ id }) {
  const [poll, setPoll] = useState(null)
  const [error, setError] = useState(null)

  React.useEffect(() => {
    let mounted = true
    getPoll(id)
      .then(p => mounted && setPoll(p))
      .catch(e => mounted && setError(e.message))
    return () => (mounted = false)
  }, [id])

  if (error) return <div className="error">{error}</div>
  if (!poll) return <div>Loading...</div>

  async function doVote(i) {
    try {
      const updated = await vote(id, i)
      setPoll(updated)
    } catch (e) {
      setError(e.message)
    }
  }

  return (
    <div className="poll">
      <h3>{poll.title}</h3>
      <ul>
        {poll.choices.map((c, idx) => (
          <li key={idx}>
            <button onClick={() => doVote(idx)}>{c}</button>
            <span className="count">{poll.counts[idx] || 0}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default function App() {
  const [pollId, setPollId] = useState(null)

  return (
    <div className="container">
      {!pollId ? (
        <CreateForm onCreated={setPollId} />
      ) : (
        <PollView id={pollId} />
      )}
    </div>
  )
}
