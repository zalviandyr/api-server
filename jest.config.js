/** @type {import('@ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleNameMapper: {
    '^@api/(.*)$': '<rootDir>/src/app/controllers/api/$1',
    '^@core/(.*)$': '<rootDir>/src/core/$1',
    '^@config/(.*)$': '<rootDir>/src/config/$1',
    '^@controllers/(.*)$': '<rootDir>/src/app/controllers/$1',
    '^@errors/(.*)$': '<rootDir>/src/app/errors/$1',
    '^@helpers/(.*)$': '<rootDir>/src/app/helpers/$1',
    '^@interfaces/(.*)$': '<rootDir>/src/app/interfaces/$1',
    '^@lib/(.*)$': '<rootDir>/src/lib/$1',
    '^@routes/(.*)$': '<rootDir>/src/app/routes/$1',
  },
  modulePathIgnorePatterns: ['<rootDir>/dist/tests/'],
};
