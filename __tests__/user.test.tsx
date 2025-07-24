import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import UserPage from '@/app/user/page'
import '@testing-library/jest-dom'

// Mock fetch globally
global.fetch = jest.fn()

const mockUserData = {
  user: {
    id: '123456789',
    email: 'test@example.com',
    name: 'John Doe',
    picture: 'https://example.com/avatar.jpg',
    verified_email: true
  }
}

describe('User Page', () => {
  beforeEach(() => {
    ;(fetch as jest.Mock).mockClear()
  })

  test('shows loading state initially', () => {
    ;(fetch as jest.Mock).mockImplementation(() => new Promise(() => {})) // Never resolves
    
    render(<UserPage />)
    expect(screen.getByText('Loading user information...')).toBeInTheDocument()
  })

  test('displays user information when fetch succeeds', async () => {
    ;(fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockUserData
    })

    render(<UserPage />)

    await waitFor(() => {
      expect(screen.getAllByText('John Doe')).toHaveLength(2) // Header and form
    })

    expect(screen.getAllByText('test@example.com')).toHaveLength(2) // Header and form
    expect(screen.getByText('123456789')).toBeInTheDocument()
    expect(screen.getByText('Verified')).toBeInTheDocument()
  })

  test('shows error state when fetch fails', async () => {
    ;(fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 401
    })

    render(<UserPage />)

    await waitFor(() => {
      expect(screen.getByText('Access Denied')).toBeInTheDocument()
    })

    expect(screen.getByText('Failed to fetch user information')).toBeInTheDocument()
    expect(screen.getByText('Go to Login')).toBeInTheDocument()
  })

  test('displays profile picture correctly', async () => {
    ;(fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockUserData
    })

    render(<UserPage />)

    await waitFor(() => {
      const profileImages = screen.getAllByAltText('John Doe')
      expect(profileImages).toHaveLength(2) // Header and profile section
      profileImages.forEach(img => {
        expect(img).toHaveAttribute('src', 'https://example.com/avatar.jpg')
      })
    })
  })

  test('shows unverified email status correctly', async () => {
    const unverifiedUserData = {
      user: { ...mockUserData.user, verified_email: false }
    }

    ;(fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => unverifiedUserData
    })

    render(<UserPage />)

    await waitFor(() => {
      expect(screen.getByText('Not Verified')).toBeInTheDocument()
    })
  })

  test('renders navigation elements', async () => {
    ;(fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockUserData
    })

    render(<UserPage />)

    await waitFor(() => {
      expect(screen.getByText('One Click')).toBeInTheDocument()
    })

    expect(screen.getAllByText('Logout')).toHaveLength(2) // Header and footer
    expect(screen.getByText('Back to Home')).toBeInTheDocument()
  })

  test('logout functionality calls correct API', async () => {
    ;(fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockUserData
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ message: 'Logged out successfully' })
      })

    // Mock window.location.href
    delete (window as any).location
    ;(window as any).location = { href: '' }

    render(<UserPage />)

    await waitFor(() => {
      expect(screen.getAllByText('John Doe')).toHaveLength(2)
    })

    const logoutButtons = screen.getAllByText('Logout')
    fireEvent.click(logoutButtons[0])

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('/api/auth/logout', { method: 'POST' })
    })
  })

  test('handles network error gracefully', async () => {
    ;(fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'))

    render(<UserPage />)

    await waitFor(() => {
      expect(screen.getByText('Access Denied')).toBeInTheDocument()
    })

    expect(screen.getByText(/Error fetching user information/)).toBeInTheDocument()
  })
})