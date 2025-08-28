import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { AppButton } from '@/components/app-button'
import { VibeApp } from '@/types/domain'

const mockApp: VibeApp = {
  id: 'test-app',
  name: 'Test App',
  url: 'https://example.com',
  logoUrl: '/images/test-logo.svg',
}

const mockDefaultApp: VibeApp = {
  ...mockApp,
  id: 'default-app',
  name: 'Default App',
  isDefault: true,
}

describe('AppButton', () => {
  it('renders app name and logo', () => {
    const mockOnClick = vi.fn()
    render(
      <AppButton 
        app={mockApp} 
        isActive={false} 
        onClick={mockOnClick} 
      />
    )

    expect(screen.getByText('Test App')).toBeInTheDocument()
    expect(screen.getByAltText('Test App logo')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Load Test App application/i })).toBeInTheDocument()
  })

  it('applies active styling when active', () => {
    const mockOnClick = vi.fn()
    render(
      <AppButton 
        app={mockApp} 
        isActive={true} 
        onClick={mockOnClick} 
      />
    )

    const button = screen.getByRole('button')
    expect(button).toHaveClass('active')
  })

  it('calls onClick when clicked', () => {
    const mockOnClick = vi.fn()
    render(
      <AppButton 
        app={mockApp} 
        isActive={false} 
        onClick={mockOnClick} 
      />
    )

    fireEvent.click(screen.getByRole('button'))
    expect(mockOnClick).toHaveBeenCalledOnce()
  })

  it('shows remove button for non-default apps when onRemove provided', () => {
    const mockOnClick = vi.fn()
    const mockOnRemove = vi.fn()
    
    render(
      <AppButton 
        app={mockApp} 
        isActive={false} 
        onClick={mockOnClick}
        onRemove={mockOnRemove}
      />
    )

    expect(screen.getByRole('button', { name: /Remove Test App/i })).toBeInTheDocument()
  })

  it('does not show remove button for default apps', () => {
    const mockOnClick = vi.fn()
    const mockOnRemove = vi.fn()
    
    render(
      <AppButton 
        app={mockDefaultApp} 
        isActive={false} 
        onClick={mockOnClick}
        onRemove={mockOnRemove}
      />
    )

    expect(screen.queryByRole('button', { name: /Remove Default App/i })).not.toBeInTheDocument()
  })

  it('calls onRemove when remove button clicked', () => {
    const mockOnClick = vi.fn()
    const mockOnRemove = vi.fn()
    
    render(
      <AppButton 
        app={mockApp} 
        isActive={false} 
        onClick={mockOnClick}
        onRemove={mockOnRemove}
      />
    )

    fireEvent.click(screen.getByRole('button', { name: /Remove Test App/i }))
    expect(mockOnRemove).toHaveBeenCalledOnce()
    expect(mockOnClick).not.toHaveBeenCalled()
  })

  it('shows fallback when logo fails to load', () => {
    const mockOnClick = vi.fn()
    render(
      <AppButton 
        app={mockApp} 
        isActive={false} 
        onClick={mockOnClick} 
      />
    )

    const image = screen.getByAltText('Test App logo')
    
    // Simulate image load error
    fireEvent.error(image)

    // Should show fallback with first letter
    expect(screen.getByText('T')).toBeInTheDocument()
  })
})
