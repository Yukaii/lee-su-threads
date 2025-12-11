import * as esbuild from 'esbuild';
import { copyFile, mkdir, cp, readFile, writeFile } from 'fs/promises';
import { execSync } from 'child_process';

const isWatch = process.argv.includes('--watch');
const isDev = isWatch || process.env.NODE_ENV === 'development';

// Get version from git tags
function getGitVersion() {
  try {
    // Get the latest git tag (e.g., "v0.3.7" or "0.3.7")
    const tag = execSync('git describe --tags --abbrev=0', { encoding: 'utf-8' }).trim();
    // Remove 'v' prefix if present
    return tag.startsWith('v') ? tag.slice(1) : tag;
  } catch (error) {
    console.warn('Warning: Could not get git version, using manifest version');
    return null;
  }
}

// Increment the patch version (e.g., "0.3.7" -> "0.3.8")
function incrementVersion(version) {
  const parts = version.split('.');
  if (parts.length >= 3) {
    parts[2] = String(Number(parts[2]) + 1);
    return parts.join('.');
  }
  // If version format is unexpected, just append .1
  return `${version}.1`;
}

// Build JavaScript bundles (shared between Chrome and Firefox)
const buildOptions = {
  entryPoints: [
    'src/content.js',
    'src/popup.js',
    'src/background.js',
    'src/injected.js',
    'src/onboarding.js',
  ],
  bundle: true,
  outdir: 'dist/shared',
  format: 'iife',
  target: ['chrome90', 'firefox90'],
  sourcemap: true,
  minify: !isWatch,
};

// Copy static files to a specific browser directory
async function copyStaticFilesForBrowser(browser) {
  const distDir = `dist/${browser}`;

  // Ensure browser-specific dist directory exists
  await mkdir(distDir, { recursive: true });

  // Copy bundled JS files from shared directory
  await copyFile('dist/shared/content.js', `${distDir}/content.js`);
  await copyFile('dist/shared/popup.js', `${distDir}/popup.js`);
  await copyFile('dist/shared/background.js', `${distDir}/background.js`);
  await copyFile('dist/shared/injected.js', `${distDir}/injected.js`);
  await copyFile('dist/shared/onboarding.js', `${distDir}/onboarding.js`);

  if (!isWatch) {
    // Copy source maps in production builds
    await copyFile('dist/shared/content.js.map', `${distDir}/content.js.map`).catch(() => {});
    await copyFile('dist/shared/popup.js.map', `${distDir}/popup.js.map`).catch(() => {});
    await copyFile('dist/shared/background.js.map', `${distDir}/background.js.map`).catch(() => {});
    await copyFile('dist/shared/injected.js.map', `${distDir}/injected.js.map`).catch(() => {});
  }

  // Copy appropriate manifest (rename to manifest.json for both)
  const sourceManifest = browser === 'chrome' ? 'src/manifest.json' : 'src/manifest.firefox.json';
  const manifestContent = await readFile(sourceManifest, 'utf-8');
  const manifest = JSON.parse(manifestContent);

  // In development, use git tag version + 1 (e.g., "0.3.7" -> "0.3.8")
  if (isDev) {
    const gitVersion = getGitVersion();
    if (gitVersion) {
      manifest.version = incrementVersion(gitVersion);
    } else {
      // Fallback: increment manifest version
      manifest.version = incrementVersion(manifest.version);
    }
  }

  await writeFile(`${distDir}/manifest.json`, JSON.stringify(manifest, null, 2));

  // Copy HTML and CSS
  await copyFile('src/popup.html', `${distDir}/popup.html`);
  await copyFile('src/onboarding.html', `${distDir}/onboarding.html`);
  await copyFile('src/styles.css', `${distDir}/styles.css`);

  // Copy _locales directory recursively
  await cp('_locales', `${distDir}/_locales`, { recursive: true });

  // Copy icons directory
  await cp('icons', `${distDir}/icons`, { recursive: true });
}

async function copyStaticFiles() {
  // Build for both Chrome and Firefox
  await copyStaticFilesForBrowser('chrome');
  await copyStaticFilesForBrowser('firefox');

  console.log('✓ Static files copied to dist/chrome and dist/firefox');
}

async function build() {
  try {
    // First, build the JavaScript bundles to dist/shared
    if (isWatch) {
      const ctx = await esbuild.context(buildOptions);
      // Perform initial build before starting watch mode
      await ctx.rebuild();
      console.log('✓ Initial build complete');
      // Copy static files after initial build completes
      await copyStaticFiles();
      // Now start watching for changes
      await ctx.watch();
      console.log('👀 Watching for changes...');
    } else {
      await esbuild.build(buildOptions);
      console.log('✓ JavaScript bundles built');
      // Then copy static files and organize into browser-specific directories
      await copyStaticFiles();
      console.log('✓ Build complete');
    }
  } catch (error) {
    console.error('Build failed:', error);
    process.exit(1);
  }
}

build();
