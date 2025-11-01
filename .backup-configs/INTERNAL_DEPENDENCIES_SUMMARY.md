# Internal Dependencies Summary

**Generated:** 2025-11-01  
**Task:** Preparation and analysis of current configurations

---

## Executive Summary

This document provides a comprehensive list of all internal CDEK dependencies found in the project that must be addressed before open-source publication.

**Total Internal References:** 47+  
**Critical Blockers:** 4  
**High Priority:** 4  
**Documentation Updates:** 3

---

## 1. Private NPM Packages (CRITICAL)

### @cdek/eslint-config-mobile v1.1.9
- **File:** `eslint.config.ts`
- **Line:** `import { MobileConfig } from '@cdek/eslint-config-mobile'`
- **Action:** Expand configuration inline, add public plugins
- **Status:** ❌ BLOCKED (package not accessible without private registry)

### @cdek/prettier-config-mobile v1.1.0
- **File:** `.prettierrc`
- **Line:** `"@cdek/prettier-config-mobile"`
- **Action:** Create `.prettierrc.js` with explicit config
- **Status:** ❌ BLOCKED (package not accessible without private registry)

### @cdek/cz-conventional-mobile v1.2.0
- **File:** `package.json`
- **Line:** `"path": "./node_modules/@cdek/cz-conventional-mobile"`
- **Action:** Replace with `cz-conventional-changelog`
- **Status:** ❌ BLOCKED (package not accessible without private registry)

---

## 2. Private NPM Registry (CRITICAL)

### .yarnrc.yml Configuration
```yaml
npmScopes:
  cdek:
    npmRegistryServer: 'https://repo.cdek.ru/repository/npm-private'
```
- **Action:** Remove entire `npmScopes.cdek` section
- **Impact:** Prevents external developers from installing dependencies
- **Status:** ⚠️ READY TO FIX

---

## 3. Remote Git Configurations (HIGH PRIORITY)

### Lefthook Remote Config
- **File:** `lefthook.yml`
- **URL:** `git@gitcode.cdek.ru:cdek-it/reactnative/conventions/lefthook-config.git`
- **Action:** Clone remote config, merge into local file, remove remotes section
- **Status:** ❌ BLOCKED (requires GitLab access)

### Fastlane Remote Config
- **File:** `fastlane/Fastfile`
- **URL:** `git@gitcode.cdek.ru:cdek-it/reactnative/ci/fastlane-config.git`
- **Action:** Delete entire fastlane directory
- **Status:** ⚠️ READY TO FIX

### Fastlane Match Storage
- **File:** `fastlane/Matchfile`
- **URL:** `git@gitcode.cdek.ru:cdek-it/reactnative/ci/fastlane-match-storage.git`
- **Action:** Delete entire fastlane directory
- **Status:** ⚠️ READY TO FIX

---

## 4. Package Metadata (CRITICAL)

### package.json Internal References
```json
{
  "name": "@cdek/react-native-prime-ui-kit",
  "homepage": "https://gitcode.cdek.ru/cdek-it/reactnative/ui-kit/react-native-prime-ui-kit",
  "repository": {
    "url": "https://gitcode.cdek.ru/cdek-it/reactnative/ui-kit/react-native-prime-ui-kit.git"
  }
}
```
- **Action:** Update to GitHub URLs, remove @cdek scope
- **Status:** ⚠️ READY TO FIX

---

## 5. GitHub Actions Workflows (HIGH PRIORITY)

### auto-assign-by-label.yml
- **Purpose:** Auto-assign issues based on internal team structure
- **References:** `cdek-it` organization, internal teams
- **Action:** Delete file
- **Status:** ⚠️ READY TO FIX

### sync-status-in-satellite.yml
- **Purpose:** Sync status to internal Hub repository
- **References:** `cdek-ui` hub repo, internal workflows
- **Action:** Delete file
- **Status:** ⚠️ READY TO FIX

---

## 6. Documentation Internal Links (HIGH PRIORITY)

### README.md
**GitLab Badges (3):**
- Pipeline status badge
- Coverage report badge
- Latest release badge

**Internal Links (7):**
1. `https://project.cdek.ru/projects/innerdev` - Redmine board
2. `https://cloud.cdek.ru/s/aokcGTsCAoEHiCg` - Cloud storage
3. `https://axiomatic-lock-3b2.notion.site/...` - Notion page
4. `https://confluence.cdek.ru/display/development/Prime+Design+System` - Confluence
5. `https://talk.cdek.ru/cdek/channels/ds-react-native` - Mattermost
6. Internal Figma links (4 links)

**Action:** Rewrite for external developers, remove all internal links
**Status:** ⚠️ READY TO FIX

### CONTRIBUTING.md
**Internal Links (1):**
- `https://confluence.cdek.ru/pages/viewpage.action?pageId=182414709` - InnerSource process

**Action:** Rewrite contribution guidelines for open-source
**Status:** ⚠️ READY TO FIX

### CHANGELOG.md
**Internal Links (Multiple):**
- All commit links point to `gitcode.cdek.ru`
- All version comparison links point to internal GitLab

**Action:** Update links to GitHub or create fresh changelog
**Status:** ⚠️ READY TO FIX

---

## 7. Fastlane Directory (HIGH PRIORITY)

### Files to Remove
- `fastlane/Fastfile` - Remote config import
- `fastlane/Matchfile` - Certificate storage config
- `fastlane/Appfile` - App identifiers
- `fastlane/.env` - Environment variables
- `fastlane/AuthKey_64224VQS8A.p8.enc` - Encrypted auth key

**Action:** Delete entire directory
**Status:** ⚠️ READY TO FIX

---

## 8. Implementation Roadmap

### Phase 1: Analysis (COMPLETED ✅)
- [x] Backup all configuration files
- [x] Document all internal dependencies
- [x] Identify blockers

### Phase 2: Obtain Private Configs (BLOCKED ❌)
- [ ] Access @cdek/eslint-config-mobile contents
- [ ] Access @cdek/prettier-config-mobile contents
- [ ] Access @cdek/cz-conventional-mobile contents
- [ ] Clone Lefthook remote config

**Options to Unblock:**
1. Install dependencies with access to private registry
2. Get package contents from internal developers
3. Create reasonable configs based on common practices

### Phase 3: Expand Configurations (PENDING ⏳)
- [ ] Create full ESLint config
- [ ] Create full Prettier config
- [ ] Create local Lefthook config
- [ ] Replace Commitizen adapter

### Phase 4: Clean Dependencies (PENDING ⏳)
- [ ] Remove private npm registry from .yarnrc.yml
- [ ] Remove @cdek packages from package.json
- [ ] Update package metadata
- [ ] Test yarn install

### Phase 5: Clean CI/CD (PENDING ⏳)
- [ ] Delete GitHub Actions workflows
- [ ] Delete Fastlane directory
- [ ] Optionally create public CI workflow

### Phase 6: Update Documentation (PENDING ⏳)
- [ ] Rewrite README.md
- [ ] Create CONTRIBUTING.md
- [ ] Add LICENSE file
- [ ] Update CHANGELOG.md

### Phase 7: Final Verification (PENDING ⏳)
- [ ] Test clean installation
- [ ] Verify all tools work
- [ ] Search for remaining internal references
- [ ] Validate documentation

---

## 9. Risk Assessment

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Cannot access private packages | HIGH | HIGH | Use common configs as baseline |
| Breaking existing code | MEDIUM | HIGH | Test thoroughly after each change |
| Missing dependencies | LOW | MEDIUM | Add all required public packages |
| Incomplete documentation | LOW | MEDIUM | Follow open-source best practices |
| Leftover internal references | MEDIUM | HIGH | Comprehensive search before release |

---

## 10. Success Criteria

- ✅ All configuration files backed up
- ✅ All internal dependencies documented
- ⏳ All private packages replaced with public alternatives
- ⏳ yarn install works without private registry access
- ⏳ All development tools work (lint, test, build)
- ⏳ No internal URLs remain in codebase
- ⏳ Documentation suitable for external developers
- ⏳ Project can be cloned and run by anyone

---

## 11. Files Modified/Created

### Backup Files Created
- `.backup-configs/eslint.config.ts.backup`
- `.backup-configs/.prettierrc.backup`
- `.backup-configs/lefthook.yml.backup`
- `.backup-configs/.commitlintrc.json.backup`
- `.backup-configs/package.json.backup`
- `.backup-configs/.yarnrc.yml.backup`
- `.backup-configs/ANALYSIS.md`
- `.backup-configs/INTERNAL_DEPENDENCIES_SUMMARY.md`

### Files to Modify
- `eslint.config.ts` - Expand config
- `.prettierrc` → `.prettierrc.js` - Expand config
- `lefthook.yml` - Localize config
- `package.json` - Remove private deps, update metadata
- `.yarnrc.yml` - Remove private registry
- `README.md` - Rewrite for external devs
- `CONTRIBUTING.md` - Rewrite for open-source
- `CHANGELOG.md` - Update or recreate

### Files to Delete
- `.github/workflows/auto-assign-by-label.yml`
- `.github/workflows/sync-status-in-satellite.yml`
- `fastlane/` (entire directory)

### Files to Create
- `LICENSE` - Open-source license
- `.github/workflows/ci.yml` (optional) - Public CI

---

## 12. Contact Points for Unblocking

To proceed with implementation, we need:

1. **Access to private npm registry** OR **exported package contents**
   - @cdek/eslint-config-mobile
   - @cdek/prettier-config-mobile
   - @cdek/cz-conventional-mobile

2. **Access to internal GitLab** OR **exported config file**
   - Lefthook remote configuration

3. **Decision on licensing**
   - Which open-source license to use (MIT, Apache 2.0, etc.)

4. **GitHub repository details**
   - Organization/user name
   - Repository name
   - URL for package.json updates

---

## Conclusion

Task 1 (Preparation and Analysis) is **COMPLETE**. All configuration files have been backed up and all internal dependencies have been documented. The project has **4 critical blockers** that require access to private packages before proceeding with implementation.

The next task (Task 2: ESLint Configuration Deployment) is **BLOCKED** until we can access the contents of `@cdek/eslint-config-mobile`.

**Recommended Next Action:** Obtain private package contents or create reasonable configurations based on common React Native + TypeScript best practices.
