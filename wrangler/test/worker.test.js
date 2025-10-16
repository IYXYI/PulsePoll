import { test } from 'node:test'
import assert from 'node:assert'
import { Miniflare } from '@miniflare/core'
import path from 'path'

test('create -> get -> vote flow', async (t) => {
  const mf = new Miniflare({
    scriptPath: path.resolve('./src/index.js'),
    modules: true,
    kvNamespaces: { POLLS: new Map() }
  })
  try {
    const baseUrl = mf.url
    const createRes = await mf.dispatchFetch(`${baseUrl}/polls`, {
      method: 'POST',
      body: JSON.stringify({ title: 'Test', choices: ['A', 'B'] }),
      headers: { 'Content-Type': 'application/json' }
    })
    assert.strictEqual(createRes.status, 200)
    const createBody = await createRes.json()
    assert.ok(createBody.ok)
    const id = createBody.id

    const getRes = await mf.dispatchFetch(`${baseUrl}/polls/${id}`)
    assert.strictEqual(getRes.status, 200)
    const poll = await getRes.json()
    assert.strictEqual(poll.title, 'Test')
    assert.deepStrictEqual(poll.counts, [0,0])

    const voteRes = await mf.dispatchFetch(`${baseUrl}/polls/${id}/vote`, {
      method: 'POST',
      body: JSON.stringify({ choiceIndex: 1 }),
      headers: { 'Content-Type': 'application/json' }
    })
    assert.strictEqual(voteRes.status, 200)
    const after = await voteRes.json()
    assert.strictEqual(after.counts[1], 1)
  } finally {
    await mf.stop()
  }
})
