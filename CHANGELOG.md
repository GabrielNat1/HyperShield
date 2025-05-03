# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-05-03

### Added
- Redis cache provider implementation
- Memory cache provider with TTL support
- GZIP compression middleware
- Prometheus metrics integration
- Alert system with multiple destinations
- Express middleware support
- Basic event bus implementation
- Compression factory with extensible providers
- Cache factory with provider management
- Unit and integration test suites

### Security
- Input validation for cache keys
- Compression threshold limits
- Memory usage limits
- TTL validation and limits
