module.exports = {
  testEnvironment: 'jest-environment-jsdom',
  verbose: true,
  roots: ['<rootDir>/src'],
  testMatch: ['**/*.(spec|test).{js,jsx,mjs,ts,tsx}'],
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },
};
