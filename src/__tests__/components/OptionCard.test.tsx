import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import OptionCard from '../../components/wizard/OptionCard'

const baseOption = { label: 'Under $50K', value: 40000 }
const optionWithDesc = { label: 'Index funds', value: 0.07, description: 'Moderate, ~7% return' }

describe('OptionCard', () => {
  it('renders the option label', () => {
    render(<OptionCard option={baseOption} isSelected={false} onClick={vi.fn()} />)
    expect(screen.getByText('Under $50K')).toBeInTheDocument()
  })

  it('renders description when provided', () => {
    render(<OptionCard option={optionWithDesc} isSelected={false} onClick={vi.fn()} />)
    expect(screen.getByText('Moderate, ~7% return')).toBeInTheDocument()
  })

  it('does not render description when absent', () => {
    const { container } = render(<OptionCard option={baseOption} isSelected={false} onClick={vi.fn()} />)
    // No description text node beyond the label
    expect(container.querySelector('div > div > div:last-child')?.textContent).toBe('Under $50K')
  })

  it('calls onClick when clicked', async () => {
    const user = userEvent.setup()
    const handler = vi.fn()
    render(<OptionCard option={baseOption} isSelected={false} onClick={handler} />)
    await user.click(screen.getByRole('button'))
    expect(handler).toHaveBeenCalledOnce()
  })

  it('shows a checkmark SVG when selected', () => {
    render(<OptionCard option={baseOption} isSelected={true} onClick={vi.fn()} />)
    expect(document.querySelector('svg')).toBeInTheDocument()
  })

  it('does not show a checkmark SVG when not selected', () => {
    render(<OptionCard option={baseOption} isSelected={false} onClick={vi.fn()} />)
    expect(document.querySelector('svg')).not.toBeInTheDocument()
  })

  it('is a button element (keyboard accessible)', () => {
    render(<OptionCard option={baseOption} isSelected={false} onClick={vi.fn()} />)
    expect(screen.getByRole('button')).toBeInTheDocument()
  })
})
