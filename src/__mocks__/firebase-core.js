// Mock for src/core/firebase.ts
const mockApp = {}
const mockAuth = {
  currentUser: null,
  onAuthStateChanged: jest.fn((callback) => callback(null)),
}
const mockDb = {}

module.exports = {
  auth: mockAuth,
  db: mockDb,
  default: mockApp,
}