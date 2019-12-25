module.exports = {
  verbose: true,
  roots: ['<rootDir>/src', '<rootDir>/tests'],
  testMatch: ['**/*.(spec|test).{js,jsx,mjs,ts,tsx}'],
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },
};
