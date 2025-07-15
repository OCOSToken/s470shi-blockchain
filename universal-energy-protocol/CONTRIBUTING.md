
# Contributing to Universal Energy Protocol

Thank you for your interest in contributing to UniversalEnergyProtocol and our open-source ecosystem!  
Your help powers secure, composable, and community-owned protocols.  
Please read this guide before opening issues, submitting pull requests, or proposing improvements.

---

## Table of Contents
- [How to Contribute](#how-to-contribute)
- [Development Environment](#development-environment)
- [Code Style & Standards](#code-style--standards)
- [Testing & Coverage](#testing--coverage)
- [Pull Requests](#pull-requests)
- [Code Review Process](#code-review-process)
- [Security & Disclosure](#security--disclosure)
- [Community & DAO Proposals](#community--dao-proposals)
- [License](#license)

---

## How to Contribute

- **Issues:**  
  - Search [existing issues](https://github.com/s470shi/universal-energy-protocol/issues) before opening a new one.
  - For bugs, provide a clear title, steps to reproduce, expected/actual results, and logs if possible.
  - For feature requests or proposals, explain the motivation, use-case, and how it fits the protocol.

- **Pull Requests:**  
  - Fork the repository, create a branch from `main`, and make atomic, logically separated commits.
  - Reference related issues (e.g. `Closes #47`).
  - Include detailed commit messages and PR descriptions.

---

## Development Environment

- Requires [Node.js](https://nodejs.org/), [Hardhat](https://hardhat.org/), [Yarn](https://yarnpkg.com/) or [npm](https://www.npmjs.com/).
- Contracts: Solidity ^0.8.19
- Tests: Hardhat, Mocha/Chai, ethers.js
- Formatters/Linters: Prettier, Solhint/Solcover (recommended)

Install dependencies:
```bash
yarn install
# or
npm install
```

---

## Code Style & Standards

- **Solidity:** Follow [Solidity Style Guide](https://docs.soliditylang.org/en/v0.8.19/style-guide.html).
- **JavaScript/TypeScript:** Follow [Airbnb JS Style Guide](https://github.com/airbnb/javascript).
- Indent with 4 spaces, use descriptive variable/function names, document all public/external functions.
- All new contracts **must** include NatSpec comments.

---

## Testing & Coverage

- All PRs must include tests for new features and bug fixes.
- Aim for 100% coverage (unit + integration).
- Use `npx hardhat test` or `yarn test`.
- Test all access control, reentrancy, edge cases, and fail scenarios.

---

## Pull Requests

- Small, focused PRs are preferred.
- Explain the motivation, technical context, and impact.
- Update relevant docs (`README.md`, `API.md`, etc).
- Pass all tests, lint, and audit checks before requesting review.

---

## Code Review Process

- At least one core maintainer or DAO representative must review and approve all PRs before merge.
- Feedback will focus on security, readability, gas efficiency, and protocol alignment.
- Be respectful and responsive to review comments.

---

## Security & Disclosure

- See [SECURITY.md](SECURITY.md) for vulnerability reporting and responsible disclosure.
- **Never** disclose vulnerabilities in public issues, commits, or chats.
- Coordinated security advisories will be published on [s470shi.org](https://s470shi.org).

---

## Community & DAO Proposals

- Substantial protocol changes should be discussed via GitHub Discussions, issues, or the OCOS DAO forum before implementation.
- All governance proposals must follow DAO rules (see [docs/architecture.md](docs/architecture.md)).

---

## License

By contributing, you agree your work will be released under the [MIT License](LICENSE).

---

**Thank you for helping build resilient, open, and composable Web3 protocols.**  
— OCOS DAO • [s470shi.org](https://s470shi.org)
