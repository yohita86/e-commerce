/// <reference types="jest" />
/// <reference types="supertest" />

declare global {
  namespace jest {
    interface Matchers<R> {
      toBeDefined(): R;
      toEqual(expected: any): R;
    }
  }
}
