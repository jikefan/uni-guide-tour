# Contributing to uni-guide-tour

Thanks for your interest! This is a small, focused open-source project — contributions of all sizes are welcome.

## Code of Conduct

This project follows the [Contributor Covenant Code of Conduct](CODE_OF_CONDUCT.md). By participating, you agree to uphold it.

## Dev Setup

```bash
git clone https://github.com/jikefan/uni-guide-tour.git
cd uni-guide-tour
pnpm install
pnpm -r --filter './packages/*' build
pnpm test
```

**Requirements:** Node ≥ 18.18, pnpm ≥ 9 (the repo's `packageManager` field pins this).

## Running examples

```bash
pnpm dev:h5                                   # H5 demo (Vite, opens in browser)
pnpm --filter mp-weixin-demo dev:mp-weixin    # WeChat MP build (open dist/dev/mp-weixin/ in DevTools)
```

## Workflow

1. **Fork** the repo and create a feature branch off `main`:
   ```bash
   git checkout -b feat/<short-name>
   # or fix/<short-name>, docs/<short-name>, test/<short-name>, chore/<short-name>
   ```

2. **Write tests first** (TDD). The codebase follows strict RED → GREEN flow:
   - Unit tests live in `packages/core/tests/unit/`
   - Component tests in `packages/core/tests/components/`
   - E2E tests in `examples/h5-demo/tests/e2e/`

3. **Add a changeset** describing your change:
   ```bash
   pnpm changeset
   ```
   Pick the affected packages and severity (patch / minor / major). Write a one-line summary in user-facing language.

4. **Verify locally**:
   ```bash
   pnpm lint
   pnpm -r --filter './packages/*' test
   pnpm --filter uni-guide-tour build
   pnpm --filter h5-demo test:e2e
   ```

5. **Open a PR** against `main`. CI will run lint + build + test + e2e automatically.

## Conventional Commits

Commit messages follow [Conventional Commits](https://www.conventionalcommits.org/):

| Prefix | Meaning |
|---|---|
| `feat` | new feature (visible to consumers) |
| `fix` | bug fix |
| `docs` | documentation only |
| `test` | adding/changing tests, no production change |
| `chore` | tooling, deps, config |
| `refactor` | code change without behavior change |
| `perf` | performance improvement |
| `ci` | CI workflow changes |

Examples:
- `feat(core): add resumeStrategy 'ask' with built-in dialog`
- `fix(mp-weixin): :data-guide-target binding for cross-platform target marking`
- `docs(recipes): add i18n with vue-i18n example`

## Code Style

- 2-space indent, no semicolons after type-only TS lines (defer to ESLint).
- TypeScript strict mode is on; no `any` unless interfacing with `uni.*` ambient globals.
- Files should have one clear responsibility (~200-400 lines, 800 max).
- Comments explain *why* (non-obvious constraints, workarounds for platform quirks), not *what*.

## Reporting Bugs

Open an issue with:
- The platform you hit it on (H5 / mp-weixin / mp-xhs / App)
- Reproduction repo or CodeSandbox if possible
- Version of `uni-guide-tour` and uniapp

For security issues, please email the maintainer directly rather than opening a public issue.

## Releases

Releases are automated via [changesets](https://github.com/changesets/changesets). When changesets accumulate on `main`, the release workflow opens a "Version Packages" PR; merging it bumps versions, generates `CHANGELOG.md`, and publishes to npm.

## Questions?

Open a [GitHub Discussion](https://github.com/jikefan/uni-guide-tour/discussions) (preferred for design questions) or an issue (for bugs).
