import { renderHook, waitFor } from '@testing-library/react'
import { useAuth } from '@/hooks/useAuth'
import '@testing-library/jest-dom'

// Mock fetch globally
global.fetch = jest.fn()

// Mock Next.js router
const mockPush = jest.fn()
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}))

const mockUserResponse = {
  user: {
    id: '123456789',
    email: 'test@example.com',
    name: 'John Doe',
    picture: 'https://example.com/avatar.jpg',
    verified_email: true
  }
}

describe('useAuth Hook', () => {
  beforeEach(() => {
    ;(fetch as jest.Mock).mockClear()
    ;(fetch as jest.Mock).mockReset()
    mockPush.mockClear()
  })

  test('fetches and sets user data on successful authentication', async () => {
    ;(fetch as jest.Mock).mockImplementation(() => 
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockUserResponse)
      })
    )

    const { result } = renderHook(() => useAuth())

    expect(result.current.loading).toBe(true)
    expect(result.current.user).toBeNull()

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    await waitFor(() => {
      expect(result.current.user).toEqual(mockUserResponse.user)
    })
    expect(result.current.error).toBe('')
  })

  test('redirects to login when authentication fails', async () => {
    ;(fetch as jest.Mock).mockImplementation(() => 
      Promise.resolve({
        ok: false,
        status: 401
      })
    )

    const { result } = renderHook(() => useAuth())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.user).toBeNull()
    expect(result.current.error).toBe('Authentication required')
    expect(mockPush).toHaveBeenCalledWith('/login')
  })

  test('handles network errors gracefully', async () => {
    ;(fetch as jest.Mock).mockImplementation(() => 
      Promise.reject(new Error('Network error'))
    )

    const { result } = renderHook(() => useAuth())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.user).toBeNull()
    expect(result.current.error).toBe('Authentication error')
    expect(mockPush).toHaveBeenCalledWith('/login')
  })

  test('logout function clears user and redirects to home', async () => {
    // First, set up authenticated user
    ;(fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockUserResponse
    })

    const { result } = renderHook(() => useAuth())

    await waitFor(() => {
      expect(result.current.user).toEqual(mockUserResponse.user)
    })

    // Mock logout API call
    ;(fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ message: 'Logged out successfully' })
    })

    // Call logout and wait for state update
    await waitFor(async () => {
      await result.current.logout()
    })

    expect(fetch).toHaveBeenCalledWith('/api/auth/logout', { method: 'POST' })
    expect(mockPush).toHaveBeenCalledWith('/')
  })

  test('handles logout errors gracefully', async () => {
    // First, set up authenticated user
    ;(fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockUserResponse
    })

    const { result } = renderHook(() => useAuth())

    await waitFor(() => {
      expect(result.current.user).toEqual(mockUserResponse.user)
    })

    // Mock logout API error
    ;(fetch as jest.Mock).mockRejectedValueOnce(new Error('Logout failed'))

    // Spy on console.error to avoid test output pollution
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {})

    // Call logout
    await result.current.logout()

    expect(consoleSpy).toHaveBeenCalledWith('Logout error:', expect.any(Error))
    consoleSpy.mockRestore()
  })
})