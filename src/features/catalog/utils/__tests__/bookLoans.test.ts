import { enrichBooksWithLoanStatus, formatLoanHistory } from '@/features/catalog/utils/bookLoans'

describe('formatLoanHistory', () => {
  it('should format loan history with correct structure', () => {
    const loanDate = '2024-01-01T00:00:00.000Z'
    const result = formatLoanHistory(loanDate, '2024-01-14T00:00:00.000Z')

    expect(result).toHaveProperty('status')
    expect(result).toHaveProperty('loanDate')
    expect(result).toHaveProperty('daysUntilDue')
    expect(typeof result.loanDate).toBe('string')
    expect(typeof result.daysUntilDue).toBe('number')
  })

  it('should return overdue status for past loan dates', () => {
    const loanDate = '2023-01-01T00:00:00.000Z' // Clearly in the past
    const result = formatLoanHistory(loanDate)

    expect(result.status).toBe('overdue')
    expect(result.daysUntilDue).toBeLessThan(0)
  })

  it('should return returned status when returned date is provided', () => {
    const loanDate = '2024-01-01T00:00:00.000Z'
    const returnedDate = '2024-01-10T00:00:00.000Z'
    const result = formatLoanHistory(loanDate, undefined, returnedDate)

    expect(result.status).toBe('returned')
    expect(result.returnedDate).toBeDefined()
    expect(typeof result.returnedDate).toBe('string')
  })
})

// Mock the useBookLoansStore for testing
jest.mock('@/features/catalog/stores/useBookLoansStore', () => ({
  useBookLoansStore: {
    getState: jest.fn(() => ({
      getBookAvailability: jest.fn(() => 'available'),
      isBookBorrowedByUser: jest.fn(() => false),
    })),
  },
}))

describe('enrichBooksWithLoanStatus', () => {
  it('should enrich books with loan status information', () => {
    const books = [
      { id: '1', title: 'Test Book', author: 'Test Author' },
    ]

    const enriched = enrichBooksWithLoanStatus(books, null)

    expect(enriched).toHaveLength(1)
    expect(enriched[0].internalStatus).toBeDefined()
    expect(enriched[0].isBorrowable).toBeDefined()
    expect(enriched[0].isBorrowedByCurrentUser).toBeDefined()
  })
})