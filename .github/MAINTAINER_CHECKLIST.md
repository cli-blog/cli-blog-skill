# Agent skill maintainer checklist

This repository does not deploy to Coolify. Its Stage 2 gate is skill package validation in GitHub Actions.

## Protected branches

Protect both `staging` and `main` with:

- required pull requests;
- required status check `CI / validate`;
- no force pushes;
- no branch deletion.

## CI gate

The `CI` workflow runs on pull requests and pushes to `staging` and `main`:

```bash
node scripts/validate.mjs
```

Do not put provider secrets, real API keys, or internal deployment procedures in public skill references.
