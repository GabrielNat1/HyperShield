# Contributing to HyperShield

We love your input! We want to make contributing to HyperShield as easy and transparent as possible.

## Development Process

We use GitHub to host code, to track issues and feature requests, as well as accept pull requests.

1. Fork the repo and create your branch from `main`.
2. If you've added code that should be tested, add tests.
3. If you've changed APIs, update the documentation.
4. Ensure the test suite passes.
5. Make sure your code lints.
6. Issue that pull request!

## Pull Request Process

1. Update the README.md with details of changes to the interface
2. Update the CHANGELOG.md with details of any changes
3. The PR will be merged once you have the sign-off of two other developers

## Testing

Before submitting a PR, ensure all tests pass:

```bash
npm test                 # Run all tests
npm run test:unit       # Run unit tests only
npm run test:integration # Run integration tests
```

## Code Style

We use ESLint to maintain code style and consistency. To check your code:

```bash
npm run lint
```

## Project Structure

```
src/
├── adapters/     # Framework-specific adapters
├── core/         # Core types and utilities
├── domains/      # Business logic domains
└── shared/       # Shared utilities
```

## TypeScript Guidelines

- Use interfaces for public APIs
- Avoid `any` types
- Document public methods and interfaces
- Use strict null checks
