# Configuration Analysis Report

**Date:** 2025-11-01  
**Purpose:** Analyze current configurations and dependencies on internal CDEK resources

## 1. Configuration Files Backup

All configuration files have been backed up to `.backup-configs/`:

- ✅ `eslint.config.ts.backup`
- ✅ `.prettierrc.backup`
- ✅ `lefthook.yml.backup`
- ✅ `.commitlintrc.json.backup`
- ✅ `package.json.backup`
- ✅ `.yarnrc.yml.backup`

## 2. Private Package Dependencies

### 2.1 @cdek/eslint-config-mobile (v1.1.9)

**Location in code:**
```typescript
// eslint.config.ts
import { MobileConfig } from '@cdek/eslint-config-mobile'
```

**Status:** ❌ Not accessible (requires private npm registry)

**Required Actions:**
- Need to obtain the actual configuration from the package
- Must expand the full ESLint configuration inline
- Add public ESLint plugins as direct dependencies:
  - `eslint-plugin-react`
  - `eslint-plugin-react-native`
  - `eslint-plugin-react-hooks`
  - `@typescript-eslint/eslint-plugin`
  - `@typescript-eslint/parser`

**Impact:** HIGH - Core development tool

---

### 2.2 @cdek/prettier-config-mobile (v1.1.0)

**Location in code:**
```
// .prettierrc
"@cdek/prettier-config-mobile"
```

**Status:** ❌ Not accessible (requires private npm registry)

**Required Actions:**
- Need to obtain the actual Prettier configuration
- Create `.prettierrc.js` with explicit configuration
- Common Prettier options to define:
  - `semi`
  - `singleQuote`
  - `trailingComma`
  - `printWidth`
  - `tabWidth`
  - `arrowParens`

**Impact:** MEDIUM - Code formatting tool

---

### 2.3 @cdek/cz-conventional-mobile (v1.2.0)

**Location in code:**
```json
// package.json
"config": {
  "commitizen": {
    "path": "./node_modules/@cdek/cz-conventional-mobile"
  }
}
```

**Status:** ❌ Not accessible (requires private npm registry)

**Required Actions:**
- Replace with public alternative: `cz-conventional-changelog`
- Update package.json config section
- Add `cz-conventional-changelog` to devDependencies

**Impact:** LOW - Commit message helper (optional for external developers)

---

## 3. Remote Git Configurations

### 3.1 Lefthook Remote Config

**Location in code:**
```yaml
# lefthook.yml
remotes:
  - git_url: git@gitcode.cdek.ru:cdek-it/reactnative/conventions/lefthook-config.git
    configs:
      - config.yml
```

**Status:** ❌ Not accessible (requires access to internal GitLab)

**Required Actions:**
- Clone the remote repository (if accessible)
- Extract the `config.yml` content
- Merge it into local `lefthook.yml`
- Remove the `remotes` section
- Typical hooks to configure:
  - `pre-commit`: lint, prettier checks
  - `commit-msg`: commitlint validation

**Impact:** MEDIUM - Git hooks for code quality

---

## 4. NPM Registry Configuration

### 4.1 Private NPM Scope

**Location in code:**
```yaml
# .yarnrc.yml
npmScopes:
  cdek:
    npmRegistryServer: 'https://repo.cdek.ru/repository/npm-private'
```

**Status:** ❌ Blocks external installation

**Required Actions:**
- Remove the entire `npmScopes.cdek` section
- Ensure all dependencies are available in public npm registry
- Keep other Yarn configurations (plugins, packageExtensions, nodeLinker)

**Impact:** CRITICAL - Prevents external developers from installing dependencies

---

## 5. Package.json Internal References

### 5.1 Package Metadata

**Current values:**
```json
{
  "name": "@cdek/react-native-prime-ui-kit",
  "homepage": "https://gitcode.cdek.ru/cdek-it/reactnative/ui-kit/react-native-prime-ui-kit",
  "repository": {
    "type": "git",
    "url": "https://gitcode.cdek.ru/cdek-it/reactnative/ui-kit/react-native-prime-ui-kit.git"
  }
}
```

**Required Actions:**
- Change `name` to `react-native-prime-ui-kit` (remove @cdek scope)
- Update `homepage` to GitHub URL
- Update `repository.url` to GitHub URL

**Impact:** HIGH - Package identity and discoverability

---

### 5.2 DevDependencies to Remove

```json
"@cdek/cz-conventional-mobile": "1.2.0",
"@cdek/eslint-config-mobile": "1.1.9",
"@cdek/prettier-config-mobile": "1.1.0"
```

**Required Actions:**
- Remove all three packages
- Add public alternatives where needed

**Impact:** CRITICAL - Must be done after configurations are expanded

---

## 6. Other Internal References

### 6.1 Fastlane Directory

**Status:** Present in project (based on file tree)

**Required Actions:**
- Remove entire `fastlane/` directory
- Contains deployment configurations and certificates
- Not needed for library development

**Impact:** LOW - Only affects internal deployment

---

### 6.2 GitHub Actions Workflows

**Files to check:**
- `.github/workflows/auto-assign-by-label.yml`
- `.github/workflows/sync-status-in-satellite.yml`

**Required Actions:**
- Remove internal workflows
- Optionally create public CI workflow for tests/lint

**Impact:** LOW - Only affects CI/CD

---

## 7. Commitlint Configuration

### 7.1 Current Status

```json
// .commitlintrc.json
{ "extends": ["@commitlint/config-conventional"] }
```

**Status:** ✅ Already using public package

**Required Actions:**
- No changes needed
- Already configured correctly for public use

**Impact:** NONE - Already compliant

---

## 8. Summary of Dependencies on Internal Resources

### Critical Blockers (Must Fix)
1. ❌ Private npm registry in `.yarnrc.yml`
2. ❌ `@cdek/eslint-config-mobile` package
3. ❌ `@cdek/prettier-config-mobile` package
4. ❌ Package name and URLs in `package.json`

### High Priority (Should Fix)
5. ❌ Lefthook remote configuration
6. ❌ `@cdek/cz-conventional-mobile` package
7. ❌ Fastlane directory removal
8. ❌ Internal GitHub Actions workflows

### Documentation (Must Update)
9. ❌ README.md - contains internal links
10. ❌ CHANGELOG.md - may contain internal links

---

## 9. Recommended Implementation Order

1. **First:** Analyze and document private package contents (requires access)
2. **Second:** Create expanded configurations locally
3. **Third:** Update package.json to use local configs
4. **Fourth:** Remove private npm registry from .yarnrc.yml
5. **Fifth:** Remove private packages from devDependencies
6. **Sixth:** Test that `yarn install` works
7. **Seventh:** Clean up CI/CD and documentation

---

## 10. Access Requirements

To complete the analysis, we need:

1. ✅ Access to current configuration files (DONE)
2. ❌ Access to `@cdek/eslint-config-mobile` package contents
3. ❌ Access to `@cdek/prettier-config-mobile` package contents
4. ❌ Access to `@cdek/cz-conventional-mobile` package contents
5. ❌ Access to Lefthook remote repository
6. ❌ Access to Fastlane remote repository (if needed)

**Note:** Since node_modules are not installed and we don't have access to the private registry, we'll need to either:
- Install dependencies with access to the private registry first
- Obtain the package contents from someone with access
- Make educated guesses based on common configurations

---

## 11. Complete List of Internal References Found

### Configuration Files
- ✅ `package.json` - @cdek scope, internal URLs
- ✅ `.yarnrc.yml` - private npm registry
- ✅ `eslint.config.ts` - @cdek/eslint-config-mobile
- ✅ `.prettierrc` - @cdek/prettier-config-mobile
- ✅ `lefthook.yml` - remote git config

### Documentation Files
- ✅ `README.md` - GitLab badges, Confluence, Mattermost, Redmine, internal Figma
- ✅ `CONTRIBUTING.md` - Confluence link
- ✅ `CHANGELOG.md` - GitLab commit links

### CI/CD Files
- ✅ `.github/workflows/auto-assign-by-label.yml` - internal team assignments
- ✅ `.github/workflows/sync-status-in-satellite.yml` - Hub synchronization
- ✅ `fastlane/Fastfile` - remote git config
- ✅ `fastlane/Matchfile` - internal git storage

### Internal URLs Found
1. `https://gitcode.cdek.ru` - Internal GitLab (multiple locations)
2. `https://repo.cdek.ru` - Private NPM registry
3. `https://project.cdek.ru` - Redmine
4. `https://cloud.cdek.ru` - Internal cloud storage
5. `https://confluence.cdek.ru` - Confluence wiki
6. `https://talk.cdek.ru` - Mattermost chat
7. `git@gitcode.cdek.ru` - Git SSH URLs

## 12. Next Steps

1. ✅ Backup all configuration files (COMPLETED)
2. ⏳ Obtain private package contents (BLOCKED - need registry access)
3. ⏳ Obtain Lefthook remote config (BLOCKED - need GitLab access)
4. ✅ Document findings (COMPLETED)
5. ⏳ Create implementation plan (READY - documented in tasks.md)

---

## 12. Risk Assessment

| Risk | Severity | Mitigation |
|------|----------|------------|
| Cannot access private packages | HIGH | Use common ESLint/Prettier configs as baseline |
| Lefthook config unknown | MEDIUM | Create standard pre-commit hooks |
| Breaking existing code | HIGH | Test thoroughly after each change |
| Missing dependencies | MEDIUM | Add all required public packages |

---

## Conclusion

The project has **4 critical dependencies** on internal CDEK infrastructure that must be resolved before open-source publication. The main challenge is obtaining the actual configurations from the private packages, which requires either:

1. Installing dependencies with access to the private registry
2. Getting the package contents from internal developers
3. Recreating reasonable configurations based on common practices

All configuration files have been backed up and are ready for modification once we have the necessary information.
