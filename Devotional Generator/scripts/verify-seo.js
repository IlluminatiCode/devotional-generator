#!/usr/bin/env node
/**
 * SEO Verification Script
 * Run this to verify all SEO files and configurations are in place
 */

const fs = require('fs');
const path = require('path');

const checks = {
  passed: [],
  failed: [],
  warnings: [],
};

function checkFile(filePath, description) {
  const fullPath = path.join(process.cwd(), filePath);
  if (fs.existsSync(fullPath)) {
    checks.passed.push(`✓ ${description}: ${filePath}`);
    return true;
  } else {
    checks.failed.push(`✗ ${description}: ${filePath} NOT FOUND`);
    return false;
  }
}

function checkOptionalFile(filePath, description) {
  const fullPath = path.join(process.cwd(), filePath);
  if (fs.existsSync(fullPath)) {
    checks.passed.push(`✓ ${description}: ${filePath}`);
    return true;
  } else {
    checks.warnings.push(`⚠ ${description}: ${filePath} (create before deployment)`);
    return false;
  }
}

console.log('\n🔍 SEO Configuration Verification\n');
console.log('=' .repeat(50) + '\n');

// Core SEO Files
console.log('📄 Core SEO Files:');
checkFile('app/layout.tsx', 'Root layout with metadata');
checkFile('app/sitemap.ts', 'Sitemap generator');
checkFile('app/robots.ts', 'Robots.txt generator');
checkFile('app/manifest.ts', 'Web app manifest');

// SEO Libraries
console.log('\n📚 SEO Libraries:');
checkFile('lib/seo/schema.ts', 'Structured data schemas');
checkFile('lib/seo/metadata.ts', 'Metadata helpers');
checkFile('lib/seo/index.ts', 'SEO utilities');

// Components
console.log('\n🧩 SEO Components:');
checkFile('components/DevotionalJsonLd.tsx', 'JSON-LD component');

// Configuration
console.log('\n⚙️  Configuration:');
checkFile('next.config.ts', 'Next.js config');
checkFile('.env.local.example', 'Environment template');

// Required Images (should be created)
console.log('\n🖼️  Required Images:');
checkOptionalFile('public/og-image.png', 'Open Graph image (1200x630)');
checkOptionalFile('public/twitter-image.png', 'Twitter card image (1200x628)');
checkOptionalFile('public/logo.png', 'Site logo (512x512)');
checkOptionalFile('public/icon-192.png', 'PWA icon 192x192');
checkOptionalFile('public/icon-512.png', 'PWA icon 512x512');

// Environment Variables
console.log('\n🔐 Environment Variables:');
if (fs.existsSync('.env.local')) {
  const envContent = fs.readFileSync('.env.local', 'utf8');
  if (envContent.includes('NEXT_PUBLIC_SITE_URL')) {
    checks.passed.push('✓ NEXT_PUBLIC_SITE_URL configured');
  } else {
    checks.warnings.push('⚠ NEXT_PUBLIC_SITE_URL not set in .env.local');
  }
} else {
  checks.warnings.push('⚠ .env.local not found (copy from .env.local.example)');
}

// Print Results
console.log('\n' + '='.repeat(50));
console.log('\n✅ PASSED (' + checks.passed.length + '):');
checks.passed.forEach((msg) => console.log('  ' + msg));

if (checks.warnings.length > 0) {
  console.log('\n⚠️  WARNINGS (' + checks.warnings.length + '):');
  checks.warnings.forEach((msg) => console.log('  ' + msg));
}

if (checks.failed.length > 0) {
  console.log('\n❌ FAILED (' + checks.failed.length + '):');
  checks.failed.forEach((msg) => console.log('  ' + msg));
}

console.log('\n' + '='.repeat(50));

// Summary
if (checks.failed.length === 0) {
  console.log('\n🎉 SEO configuration is complete!');
  if (checks.warnings.length > 0) {
    console.log('⚠️  Create missing images before deployment.');
  }
  console.log('\n📋 Next steps:');
  console.log('  1. Create required images (see warnings above)');
  console.log('  2. Set NEXT_PUBLIC_SITE_URL in .env.local');
  console.log('  3. Run: npm run build');
  console.log('  4. Deploy to production');
  console.log('  5. Submit sitemap to Google Search Console\n');
} else {
  console.log('\n❌ SEO configuration incomplete. Fix failed checks above.\n');
  process.exit(1);
}
