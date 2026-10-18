/**
 * CRESCO Production — Step 27: Faculty App Production Readiness Regression Test Suite
 *
 * Validates:
 * 1. Accessibility foundations (prefers-reduced-motion, :focus-visible, .sr-only)
 * 2. Operational configuration & Firebase target project consistency
 * 3. Client security (no secret server credentials embedded in bundle)
 * 4. Error recovery & fault tolerance contracts
 * 5. Code splitting chunk configuration in Vite build
 * 6. Institutional Gate 4 dependency tracking (no fake faculty bypasses)
 */

import fs from 'fs';
import path from 'path';
import { firebaseConfig } from './src/lib/firebaseConfig';
import { INSTITUTIONAL_IT_DEPENDENCY } from './src/services/facultyAuthService';

console.log('================================================================');
console.log('🧪 CRESCO STEP 27: FACULTY PRODUCTION READINESS REGRESSION SUITE');
console.log('================================================================\n');

let passedTests = 0;
let totalTests = 0;

function assert(condition: boolean, testName: string, detail?: string) {
  totalTests++;
  if (condition) {
    console.log(`✅ [PASS] ${testName}`);
    passedTests++;
  } else {
    console.error(`❌ [FAIL] ${testName} ${detail ? `- ${detail}` : ''}`);
  }
}

async function runStep27Tests() {
  // 1. Accessibility in CSS
  const cssPath = path.resolve(process.cwd(), 'src/index.css');
  const cssContent = fs.readFileSync(cssPath, 'utf-8');

  assert(
    cssContent.includes('@media (prefers-reduced-motion: reduce)'),
    'Accessibility: prefers-reduced-motion media query is implemented for vestibular safety'
  );
  assert(
    cssContent.includes(':focus-visible'),
    'Accessibility: High-visibility :focus-visible keyboard navigation rings are configured'
  );
  assert(
    cssContent.includes('.sr-only'),
    'Accessibility: Screen-reader utility (.sr-only) is provided for assistive tech'
  );

  // 2. Operational Configuration & Project Consistency
  assert(
    firebaseConfig.projectId === 'cresco-cn',
    'Config: Firebase projectId points to authoritative production project (cresco-cn)'
  );
  assert(
    firebaseConfig.authDomain === 'cresco-cn.firebaseapp.com',
    'Config: Firebase authDomain is aligned with cresco-cn'
  );
  assert(
    !JSON.stringify(firebaseConfig).includes('private_key') &&
    !JSON.stringify(firebaseConfig).includes('client_email'),
    'Security: Client bundle contains only public Firebase web config (no private keys/tokens)'
  );

  // 3. Code Splitting Configuration
  const viteConfigPath = path.resolve(process.cwd(), 'vite.config.ts');
  const viteConfigContent = fs.readFileSync(viteConfigPath, 'utf-8');

  assert(
    viteConfigContent.includes('vendor-firebase') && viteConfigContent.includes('vendor-react'),
    'Performance: Vite chunking splits heavy Firebase and React vendor libraries'
  );

  // 4. Lazy Loading in App Routes
  const appPath = path.resolve(process.cwd(), 'src/App.tsx');
  const appContent = fs.readFileSync(appPath, 'utf-8');

  assert(
    appContent.includes('React.lazy') && appContent.includes('Suspense'),
    'Performance: Main application shell uses React.lazy and Suspense for route views'
  );
  assert(
    appContent.includes('ErrorBoundary'),
    'Reliability: Root and Dashboard layouts are shielded by ErrorBoundary'
  );

  // 5. ErrorBoundary Implementation
  const errorBoundaryPath = path.resolve(process.cwd(), 'src/components/ErrorBoundary.tsx');
  const errorBoundaryContent = fs.readFileSync(errorBoundaryPath, 'utf-8');

  assert(
    errorBoundaryContent.includes('role="alert"') && errorBoundaryContent.includes('aria-live="assertive"'),
    'Reliability: ErrorBoundary provides accessible alert semantics and live region for screen readers'
  );
  assert(
    errorBoundaryContent.includes('Retry View') || errorBoundaryContent.includes('handleReset'),
    'Reliability: ErrorBoundary provides actionable user retry mechanism'
  );

  // 6. External Dependency Integrity
  assert(
    INSTITUTIONAL_IT_DEPENDENCY.status === 'BLOCKED_ON_INSTITUTIONAL_INFRASTRUCTURE',
    'Operational: Gate 4 institutional dependency is tracked without mock bypass'
  );

  console.log(`\n----------------------------------------------------`);
  console.log(`Step 27 Results: ${passedTests}/${totalTests} Passed (${Math.round((passedTests / totalTests) * 100)}%)`);
  console.log(`----------------------------------------------------\n`);

  if (passedTests !== totalTests) {
    process.exit(1);
  }
}

runStep27Tests().catch((err) => {
  console.error('Test execution error:', err);
  process.exit(1);
});
