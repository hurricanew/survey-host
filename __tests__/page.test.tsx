import { render, screen } from '@testing-library/react'
import Home from '@/app/page'
import '@testing-library/jest-dom'

describe('Home Page', () => {
  test('renders SurveyHost logo in header', () => {
    render(<Home />)
    const logo = screen.getByAltText('SurveyHost Logo')
    expect(logo).toBeInTheDocument()
    expect(logo).toHaveAttribute('src', '/logo.svg')
    expect(logo).toHaveClass('h-full', 'w-auto', 'hover:opacity-80', 'transition-opacity', 'cursor-pointer')
  })

  test('logo is clickable and links to home page', () => {
    render(<Home />)
    const logoLink = screen.getByAltText('SurveyHost Logo').closest('a')
    expect(logoLink).toBeInTheDocument()
    expect(logoLink).toHaveAttribute('href', '/')
    expect(logoLink).toHaveClass('block', 'h-full')
  })

  test('renders header navigation buttons', () => {
    render(<Home />)
    expect(screen.getByText('Log In')).toBeInTheDocument()
    expect(screen.getByText('Sign Up')).toBeInTheDocument()
    expect(screen.getByText('Sign Up')).toHaveClass('bg-green-600', 'text-white')
  })

  test('renders survey code question text', () => {
    render(<Home />)
    expect(screen.getByText('Has a survey/Quiz code?')).toBeInTheDocument()
    expect(screen.getByText('Has a survey/Quiz code?')).toHaveClass('text-white')
  })

  test('renders input with correct placeholder and auto-focus', () => {
    render(<Home />)
    const input = screen.getByPlaceholderText('Enter code here')
    expect(input).toBeInTheDocument()
    expect(input).toHaveFocus()
    expect(input).toHaveClass('flex-1', 'text-gray-700', 'text-lg')
  })

  test('renders hashtag symbol before input', () => {
    render(<Home />)
    expect(screen.getByText('#')).toBeInTheDocument()
    expect(screen.getByText('#')).toHaveClass('text-xl', 'font-bold')
  })

  test('renders submit button with arrow icon', () => {
    render(<Home />)
    const button = screen.getByRole('button', { name: '' })
    expect(button).toHaveClass('text-white', 'rounded-full')
  })

  test('renders main heading', () => {
    render(<Home />)
    expect(screen.getByText('The easiest way to make an interactive journey')).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 1 })).toHaveClass('text-6xl', 'font-bold', 'text-black')
  })

  test('has white background', () => {
    render(<Home />)
    const mainContainer = document.querySelector('.min-h-screen')
    expect(mainContainer).toHaveClass('min-h-screen', 'bg-white')
  })

  test('blue search container has correct styling', () => {
    render(<Home />)
    const searchContainer = screen.getByText('Has a survey/Quiz code?').closest('div')?.parentElement?.parentElement
    expect(searchContainer).toHaveClass('rounded-full')
  })

  test('input container has white background and rounded styling', () => {
    render(<Home />)
    const input = screen.getByPlaceholderText('Enter code here')
    const inputContainer = input.closest('div')
    expect(inputContainer).toHaveClass('bg-white', 'rounded-full')
  })
})