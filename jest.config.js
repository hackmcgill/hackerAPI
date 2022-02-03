/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleNameMapper: {
    "@app/(.*)$": "<rootDir>/src/$1",
    "@models/(.*)$": "<rootDir>/src/models/$1",
    "@controllers/(.*)$": "<rootDir>/src/controllers/$1",
    "@middlewares/(.*)$": "<rootDir>/src/middlewares/$1",
    "@services/(.*)$": "<rootDir>/src/services/$1",
    "@constants/(.*)$": "<rootDir>/src/constants/$1",
    "@assets/(.*)$": "<rootDir>/src/assets/$1",
    "@strategies/(.*)$": "<rootDir>/src/strategies/$1",
  }
};
