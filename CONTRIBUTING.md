# Contributing to Privacy Insurance Claims

Thank you for your interest in contributing to this FHEVM example project!

## How to Contribute

### Reporting Issues

If you find a bug or have a suggestion:

1. Check if the issue already exists in the GitHub Issues
2. If not, create a new issue with:
   - Clear title and description
   - Steps to reproduce (for bugs)
   - Expected vs actual behavior
   - Your environment details (Node version, OS, etc.)

### Submitting Changes

1. **Fork the Repository**
   ```bash
   git fork <repository-url>
   cd PrivacyInsuranceClaims
   ```

2. **Create a Branch**
   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/your-bug-fix
   ```

3. **Make Your Changes**
   - Follow the existing code style
   - Add tests for new features
   - Update documentation as needed
   - Add JSDoc comments to test cases

4. **Test Your Changes**
   ```bash
   npm test
   npm run lint
   npm run format
   ```

5. **Commit Your Changes**
   ```bash
   git add .
   git commit -m "feat: add new feature"
   # or
   git commit -m "fix: resolve issue with claim submission"
   ```

   Use conventional commit messages:
   - `feat:` for new features
   - `fix:` for bug fixes
   - `docs:` for documentation changes
   - `test:` for test additions/changes
   - `refactor:` for code refactoring
   - `chore:` for maintenance tasks

6. **Push and Create Pull Request**
   ```bash
   git push origin feature/your-feature-name
   ```

   Then create a Pull Request on GitHub with:
   - Clear description of changes
   - Link to related issues
   - Screenshots (if applicable)

## Development Guidelines

### Code Style

- Use TypeScript for tests and scripts
- Follow Solidity style guide for contracts
- Use meaningful variable and function names
- Add comments for complex logic
- Keep functions focused and small

### Testing

- Write tests for all new features
- Use JSDoc annotations in tests for documentation
- Include both positive and negative test cases
- Test edge cases and error conditions
- Aim for >80% code coverage

### Documentation

- Update README.md for significant changes
- Add JSDoc comments to test descriptions
- Use @title, @notice, @dev, @chapter tags
- Include code examples in documentation
- Keep documentation up-to-date

### FHEVM Best Practices

When working with FHEVM:

1. **Always encrypt sensitive data**
   ```solidity
   euint32 encrypted = FHE.asEuint32(plainValue);
   ```

2. **Set up proper access control**
   ```solidity
   FHE.allowThis(encrypted);  // Contract access
   FHE.allow(encrypted, user); // User access
   ```

3. **Validate inputs before encryption**
   ```solidity
   require(value > 0, "Value must be positive");
   euint32 encrypted = FHE.asEuint32(value);
   ```

4. **Use appropriate encrypted types**
   - `euint8`: 0-255
   - `euint16`: 0-65,535
   - `euint32`: 0-4,294,967,295
   - `euint64`: 0-18,446,744,073,709,551,615

5. **Consider gas costs**
   - FHE operations are more expensive
   - Batch operations when possible
   - Minimize encrypted storage

## Areas for Contribution

### High Priority

- [ ] Additional test coverage for edge cases
- [ ] Gas optimization analysis and improvements
- [ ] Security audit findings implementation
- [ ] Error handling improvements
- [ ] Event emission optimization

### Medium Priority

- [ ] Additional FHEVM patterns (comparison operations)
- [ ] Integration examples with other protocols
- [ ] Frontend improvements
- [ ] Deployment guide for mainnet
- [ ] Multi-signature support for insurance company

### Nice to Have

- [ ] Automated claim approval based on criteria
- [ ] Support for multiple policy types
- [ ] Claim appeal mechanism
- [ ] Reviewer reputation system
- [ ] Analytics dashboard

## Code Review Process

All submissions require review. Reviewers will check:

- Code quality and style
- Test coverage
- Documentation completeness
- Security considerations
- Gas efficiency
- FHEVM best practices

## Community Guidelines

- Be respectful and inclusive
- Help others learn about FHEVM
- Share knowledge and experiences
- Give constructive feedback
- Celebrate contributions

## Questions?

- Open a Discussion on GitHub
- Join the Zama Discord community
- Check the official Zama documentation

Thank you for contributing to the future of privacy-preserving smart contracts!
