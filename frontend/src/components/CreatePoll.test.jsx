import React from 'react'
import { render, fireEvent, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import App from '../App'

describe('Create form', () => {
  it('shows validation error when not enough choices', async () => {
    render(<App />)
    const title = screen.getByPlaceholderText('Title')
    const textarea = screen.getByPlaceholderText('One choice per line')
    fireEvent.change(title, { target: { value: 'Test poll' } })
    fireEvent.change(textarea, { target: { value: 'Only one choice' } })
    fireEvent.click(screen.getByText('Create'))
    expect(await screen.findByText(/at least two choices/i)).toBeTruthy()
  })
})
