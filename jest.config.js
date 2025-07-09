const { pathsToModuleNameMapper } = require('ts-jest');
const { compilerOptions } = require('./tsconfig');

module.exports = {
  preset: 'ts-jest',
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'js', 'json', 'node'],
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
    prefix: '<rootDir>/',
  }),
  collectCoverageFrom: ['src/**/services/*.ts', 'src/**/domain/entities/*.ts'],
  testMatch: ['**/*.spec.ts'],
  rootDir: '.',
  testPathIgnorePatterns: ['/node_modules/'],
  coverageDirectory: './coverage',
  testEnvironment: 'node',
  roots: ['<rootDir>/src', '<rootDir>/test'],
};
