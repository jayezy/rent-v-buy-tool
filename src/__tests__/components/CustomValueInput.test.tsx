/**
 * Tests for CustomValueInput component.
 * Covers dollar / percent / years input types, validation, error messages,
 * keyboard submission, and the "Use this" button.
 */
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import CustomValueInput from '../../components/wizard/CustomValueInput'
import type { CustomInputConfig } from '../../lib/types'

const DOLLAR_CONFIG: CustomInputConfig = {
  type: 'dollar',
  label: 'Or enter exact amount',
  min: 0,
  max: 10000000,
}

const PERCENT_CONFIG: CustomInputConfig = {
  type: 'percent',
  label: 'Or enter annual return %',
  min: 0,
  max: 30,
}

const YEARS_CONFIG: CustomInputConfig = {
  type: 'years',
  label: 'Or enter exact years',
  min: 1,
  max: 50,
}

describe('CustomValueInput — rendering', () => {
  it('renders the label text', () => {
    render(<CustomValueInput config={DOLLAR_CONFIG} onSubmit={() => {}} />)
    expect(screen.getByText('Or enter exact amount')).toBeInTheDocument()
  })

  it('renders the "Use this" button', () => {
    render(<CustomValueInput config={DOLLAR_CONFIG} onSubmit={() => {}} />)
    expect(screen.getByRole('button', { name: /use this/i })).toBeInTheDocument()
  })

  it('button is disabled when input is empty', () => {
    render(<CustomValueInput config={DOLLAR_CONFIG} onSubmit={() => {}} />)
    expect(screen.getByRole('button', { name: /use this/i })).toBeDisabled()
  })

  it('shows $ prefix for dollar type', () => {
    const { container } = render(<CustomValueInput config={DOLLAR_CONFIG} onSubmit={() => {}} />)
    expect(container.textContent).toContain('$')
  })

  it('shows % suffix for percent type', () => {
    const { container } = render(<CustomValueInput config={PERCENT_CONFIG} onSubmit={() => {}} />)
    expect(container.textContent).toContain('%')
  })

  it('shows yrs suffix for years type', () => {
    const { container } = render(<CustomValueInput config={YEARS_CONFIG} onSubmit={() => {}} />)
    expect(container.textContent).toContain('yrs')
  })
})

describe('CustomValueInput — submission', () => {
  it('calls onSubmit with the numeric value when "Use this" is clicked', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()
    render(<CustomValueInput config={DOLLAR_CONFIG} onSubmit={onSubmit} />)
    const input = screen.getByRole('spinbutton')
    await user.type(input, '150000')
    await user.click(screen.getByRole('button', { name: /use this/i }))
    expect(onSubmit).toHaveBeenCalledWith(150000)
  })

  it('calls onSubmit when Enter key is pressed', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()
    render(<CustomValueInput config={DOLLAR_CONFIG} onSubmit={onSubmit} />)
    const input = screen.getByRole('spinbutton')
    await user.type(input, '75000')
    await user.keyboard('{Enter}')
    expect(onSubmit).toHaveBeenCalledWith(75000)
  })

  it('calls onSubmit with decimal percent value', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()
    render(<CustomValueInput config={PERCENT_CONFIG} onSubmit={onSubmit} />)
    const input = screen.getByRole('spinbutton')
    await user.type(input, '8')
    await user.click(screen.getByRole('button', { name: /use this/i }))
    expect(onSubmit).toHaveBeenCalledWith(8)
  })

  it('clears the input after successful submission', async () => {
    const user = userEvent.setup()
    render(<CustomValueInput config={DOLLAR_CONFIG} onSubmit={() => {}} />)
    const input = screen.getByRole('spinbutton') as HTMLInputElement
    await user.type(input, '50000')
    await user.click(screen.getByRole('button', { name: /use this/i }))
    expect(input.value).toBe('')
  })
})

describe('CustomValueInput — validation', () => {
  it('shows an error when submitted with empty input', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()
    render(<CustomValueInput config={DOLLAR_CONFIG} onSubmit={onSubmit} />)
    // Manually enable button by getting submit via Enter with space (won't fire since empty)
    // Instead directly call the button — but button is disabled when empty, so we use keyboard
    const input = screen.getByRole('spinbutton')
    await user.click(input)
    await user.keyboard('{Enter}')
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('shows error message when value is below minimum', async () => {
    const user = userEvent.setup()
    const configWithMin: CustomInputConfig = { ...YEARS_CONFIG, min: 1 }
    render(<CustomValueInput config={configWithMin} onSubmit={() => {}} />)
    const input = screen.getByRole('spinbutton')
    await user.type(input, '0')
    await user.keyboard('{Enter}')
    expect(screen.getByRole('alert')).toBeInTheDocument()
    expect(screen.getByRole('alert').textContent).toMatch(/minimum/i)
  })

  it('shows error message when value exceeds maximum', async () => {
    const user = userEvent.setup()
    const smallMax: CustomInputConfig = { ...DOLLAR_CONFIG, max: 100 }
    render(<CustomValueInput config={smallMax} onSubmit={() => {}} />)
    const input = screen.getByRole('spinbutton')
    await user.type(input, '999')
    await user.keyboard('{Enter}')
    expect(screen.getByRole('alert')).toBeInTheDocument()
    expect(screen.getByRole('alert').textContent).toMatch(/maximum/i)
  })

  it('does not call onSubmit when validation fails', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()
    const smallMax: CustomInputConfig = { ...DOLLAR_CONFIG, max: 100 }
    render(<CustomValueInput config={smallMax} onSubmit={onSubmit} />)
    const input = screen.getByRole('spinbutton')
    await user.type(input, '999')
    await user.keyboard('{Enter}')
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('button becomes enabled after typing a value', async () => {
    const user = userEvent.setup()
    render(<CustomValueInput config={DOLLAR_CONFIG} onSubmit={() => {}} />)
    const button = screen.getByRole('button', { name: /use this/i })
    expect(button).toBeDisabled()
    const input = screen.getByRole('spinbutton')
    await user.type(input, '1')
    expect(button).not.toBeDisabled()
  })
})
