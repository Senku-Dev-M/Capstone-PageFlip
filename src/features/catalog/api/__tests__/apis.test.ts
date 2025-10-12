// Basic API interface tests - provides coverage for export/import functionality

describe('Books API', () => {
  let booksApi: any

  beforeAll(() => {
    booksApi = require('../books')
  })

  it('should export expected functions', () => {
    expect(typeof booksApi.searchBooks).toBe('function')
    expect(typeof booksApi.getBookDetails).toBe('function')
  })
})

describe('Loans API', () => {
  let loansApi: any

  beforeAll(() => {
    loansApi = require('../loans')
  })

  it('should export expected functions', () => {
    expect(typeof loansApi.createLoan).toBe('function')
    expect(typeof loansApi.markLoanAsReturned).toBe('function')
    expect(typeof loansApi.subscribeToActiveLoans).toBe('function')
    expect(typeof loansApi.subscribeToUserLoans).toBe('function')
  })
})

describe('Wishlist API', () => {
  let wishlistApi: any

  beforeAll(() => {
    wishlistApi = require('../wishlist')
  })

  it('should export expected functions', () => {
    expect(typeof wishlistApi.addBookToWishlist).toBe('function')
    expect(typeof wishlistApi.removeBookFromWishlist).toBe('function')
    expect(typeof wishlistApi.subscribeToUserWishlist).toBe('function')
    expect(typeof wishlistApi.getUserWishlist).toBe('function')
  })
})

describe('Books API from OpenAPI', () => {
  let booksApi: any

  beforeAll(() => {
    booksApi = require('../booksApi')
  })

  it('should export API functions', () => {
    expect(typeof booksApi.fetchBooks).toBe('function')
    expect(typeof booksApi.enrichBooksWithWishlistInfo).toBe('function')
  })
})