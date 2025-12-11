# Contributing to Lee-Su-Threads

Thank you for your interest in contributing! This guide covers the development workflow and release process.

## Development Setup

1. Clone the repository
2. Run `npm install`
3. Run `npm run build` to build both Chrome and Firefox versions
4. Load the extension:
   - **Chrome**: Navigate to `chrome://extensions/`, enable Developer mode, click "Load unpacked", select `dist/chrome/`
   - **Firefox**: Navigate to `about:debugging#/runtime/this-firefox`, click "Load Temporary Add-on", select `dist/firefox/manifest.json`

## Testing

```bash
npm test              # Run tests once
npm run test:watch    # Run tests in watch mode
```

## Release Process

### Firefox Self-Distribution Setup

This repository uses **self-distributed (unlisted)** Firefox extensions signed via Mozilla's API. This means:

- Extensions are signed by Mozilla but not listed on AMO (addons.mozilla.org)
- Users install via direct download link from GitHub Releases
- Firefox auto-updates work via the `updates.json` manifest

#### Setting up Firefox API Credentials

To enable automatic signing in CI, you need Mozilla API credentials:

1. Go to https://addons.mozilla.org/developers/addon/api/key/
2. Generate new API credentials
3. Add them as GitHub repository secrets:
   - `FIREFOX_API_KEY` (format: `user:{user_id}:{key_id}`)
   - `FIREFOX_API_SECRET`

#### How the Release Workflow Works

When you push a version tag (e.g., `v0.3.8`):

**With Firefox API credentials (main repository):**
1. Builds both Chrome and Firefox extensions
2. Signs Firefox extension with `--channel=unlisted` (no manual review needed)
3. Creates GitHub Release with:
   - `lee-su-threads-chrome-v{version}.zip` (unsigned, for Chrome Web Store submission)
   - `lee-su-threads-firefox-v{version}-signed.xpi` (signed, for user installation)
   - `updates.json` (update manifest for auto-updates)

**Without Firefox API credentials (forks):**
1. Builds both Chrome and Firefox extensions
2. Skips signing steps
3. Creates GitHub Release with:
   - `lee-su-threads-chrome-v{version}.zip` (unsigned)
   - `lee-su-threads-firefox-v{version}.zip` (unsigned)

### Creating a Release

1. Update version in `src/manifest.json` and `src/manifest.firefox.json`
2. Commit and push to main
3. Create and push a version tag:
   ```bash
   git tag v0.3.8
   git push origin v0.3.8
   ```
4. GitHub Actions will automatically:
   - Build the extensions
   - Sign the Firefox extension (if credentials are available)
   - Create a GitHub Release
   - Upload the distribution files

### Installing Self-Distributed Firefox Extension

Users can install the signed Firefox extension from:
```
https://github.com/meettomorrow/lee-su-threads/releases/latest/download/lee-su-threads-firefox-v{version}-signed.xpi
```

Firefox will automatically check for updates via the `updates.json` manifest.

### Distribution Channels

- **Chrome**: Unsigned `.zip` uploaded to Chrome Web Store manually
- **Firefox**: Self-distributed signed `.xpi` via GitHub Releases with auto-updates

## Questions?

If you have questions about the release process or need help setting up credentials, please open an issue.
