# 🤝 Contributing to CloakBid

Thank you for considering contributing to **CloakBid** — the zero-knowledge sealed-bid auction protocol built on the Midnight Network!

---

## Getting Started

### Prerequisites
- **Node.js** v18+ (v20 LTS recommended)
- **npm** v9+
- **Git** v2.40+
- Familiarity with React, TypeScript, and basic cryptography concepts

### Local Setup
```bash
# 1. Fork the repository on GitHub
# 2. Clone your fork
git clone https://github.com/YOUR_USERNAME/CloakBid.git
cd CloakBid

# 3. Copy environment template
cp .env.example .env

# 4. Install dependencies
npm install

# 5. Start development server
npm run dev
```

---

## Development Workflow

### Branch Naming
- `feat/short-description` — new features
- `fix/issue-number-description` — bug fixes
- `docs/what-you-updated` — documentation improvements
- `ci/pipeline-changes` — CI/CD modifications
- `refactor/scope` — code refactoring without behavior change

### Commit Message Format
We follow [Conventional Commits](https://www.conventionalcommits.org/):
```
<type>(scope): <description>

Types: feat, fix, docs, style, refactor, test, ci, chore
```

Examples:
```
feat(vault): add holographic shimmer to commitment capsules
fix(prover): resolve circuit step race condition on mobile
docs(readme): add Preprod deployment screenshot
ci(actions): add CodeQL security scanning workflow
```

### Pull Request Checklist
- [ ] `npm run build` passes with zero TypeScript errors
- [ ] Code follows existing naming conventions and file structure
- [ ] New components use existing design system (glass-card, btn-gold, etc.)
- [ ] No hardcoded secrets or private keys committed
- [ ] Meaningful commit messages following Conventional Commits

---

## Reporting Issues
Open a [GitHub Issue](https://github.com/Soumi14mili/CloakBid/issues) with:
- Steps to reproduce
- Expected vs actual behavior
- Browser/OS/Node version
- Screenshots if applicable

---

## Security Disclosures
**Do NOT open a public issue for security vulnerabilities.**  
Please email the maintainer privately. Security issues will be patched and disclosed responsibly.

---

## Code of Conduct
Be excellent to each other. Zero tolerance for harassment or discrimination. See [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md).

---

Built with ❤️ for the Midnight Network ecosystem.
