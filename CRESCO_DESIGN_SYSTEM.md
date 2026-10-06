# CRESCO CN DESIGN SYSTEM SPECIFICATION
**Version:** 1.0.0  
**Target:** Cresco CN Faculty Portal & Shared Cross-Portal Ecosystem  
**Source Baseline:** Cresco CN Student Portal (`cresco-cn` production build)  
**Document Purpose:** Independent design system specification allowing the Faculty Portal (`Cresco-CN-KARE-Faculty`) to achieve pixel-perfect visual coherence with the Student Portal without sharing runtime application code.

---

## 1. Executive Summary & Brand Identity

The Cresco CN design language is an **immersive, tactile, education-first aesthetic** combining:
- **Clean Material/Editorial Foundations:** Built on emeralds, mints, and deep evergreen surfaces.
- **Electric Cyber/Network Accents:** Neon cyan (`#06B6D4`, `#06C8D9`), electric teal, and Amber/Gold (`#F59E0B`, `#FFC229`).
- **Tactile 3D Micro-Affordances:** Physical push states (`translate-y`, tactile bottom borders/shadows like `0 4px 0 0 #047857`), rounded pill chips, and subtle glow effects.
- **Glassmorphism & Depth:** Frosted backdrops (`backdrop-blur-xl`, `bg-white/80` or `bg-[#0a1813]/90`), multi-layered drop shadows, and high contrast typography.
- **Institutional Alignment:** Designed for Kalasalingam Academy of Research and Education (KLU / KARE) Computer Networks curriculum.

---

## 2. Reusable Design Tokens

### 2.1 CSS Custom Properties (`:root` / Light Theme)

```css
:root {
  /* Brand Core */
  --primary: #10b981;                      /* Emerald 500 */
  --primary-container: #059669;            /* Emerald 600 */
  --primary-fixed: #d1fae5;                /* Emerald 100 */
  --primary-fixed-dim: #a7f3d0;            /* Emerald 200 */
  --secondary: #047857;                    /* Emerald 700 */
  --secondary-container: #10b981;          /* Emerald 500 */
  --tertiary: #065f46;                     /* Emerald 800 */
  --tertiary-container: #064e3b;           /* Emerald 900 */
  --tertiary-fixed: #ecfdf5;               /* Emerald 50 */
  --tertiary-fixed-dim: #34d399;           /* Emerald 400 */

  /* Neutral & Surfaces */
  --background: #f0fdf4;                   /* Ultra-light mint page background */
  --bg-secondary: #dcfce7;
  --surface: #f6fbf8;                      /* Default canvas surface */
  --surface-container-lowest: #ffffff;     /* Card surface (elevated) */
  --surface-container-low: #f0fdf4;        /* Low contrast container */
  --surface-container: #dcfce7;            /* Medium container */
  --surface-container-high: #bbf7d0;       /* High container */
  --surface-container-highest: #86efac;    /* Highest container */
  --surface-tint: #10b981;

  /* Typography / Text */
  --text-primary: #062419;                 /* Deep evergreen charcoal (100% readable) */
  --text-secondary: #166534;               /* Medium emerald body text */
  --text-muted: #15803d;                   /* Subdued metadata / captions */
  --on-surface: #062419;
  --on-surface-variant: #166534;

  /* Borders & Outlines */
  --border: #bbf7d0;                       /* Standard container border */
  --border-subtle: #dcfce7;                /* Hairline separator */
  --outline: #15803d;
  --outline-variant: #bbf7d0;
  --border-neutral: #e5e0d8;               /* Warm institutional border */

  /* Cyber & Accent Colors */
  --accent: #06b6d4;                       /* Electric Cyan (Network / Packet accent) */
  --accent-cyan: #06c8d9;                  /* Vivid Liquid Cyan */
  --accent-amber: #f59e0b;                 /* Streak fire & XP gold */
  --accent-purple: #8b5cf6;                /* Instructor / Faculty Admin accent */

  /* Status Colors */
  --success: #16a34a;                      /* Pass, Complete, Live */
  --warning: #f59e0b;                      /* Warning, Pending, Streak */
  --error: #dc2626;                        /* Error, Disconnected, Absent */
  --info: #0284c7;                         /* RFC, Information, Help */

  /* Radii */
  --radius-xs: 6px;
  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 16px;
  --radius-xl: 20px;
  --radius-2xl: 24px;
  --radius-3xl: 32px;
  --radius-full: 9999px;

  /* Elevation & Shadows */
  --shadow-card: 0 2px 4px 0 rgba(6, 36, 25, 0.04), 0 1px 2px 0 rgba(6, 36, 25, 0.02);
  --shadow-elevated: 0 10px 25px -5px rgba(16, 185, 129, 0.12), 0 8px 10px -6px rgba(6, 36, 25, 0.04);
  --shadow-tactile: 0 4px 0 0 #047857;
  --shadow-tactile-primary: 0 4px 0 0 #047857, 0 10px 20px -2px rgba(16, 185, 129, 0.25);
  --shadow-tactile-success: 0 4px 0 0 #15803d;
  --shadow-glow-cyan: 0 0 24px -4px rgba(6, 182, 212, 0.45);
  --shadow-glow-emerald: 0 0 24px -4px rgba(16, 185, 129, 0.5);

  /* Typography Stacks */
  --font-headline: 'Outfit', system-ui, -apple-system, sans-serif;
  --font-body: 'Plus Jakarta Sans', 'DM Sans', system-ui, sans-serif;
  --font-mono: 'JetBrains Mono', ui-monospace, SFMono-Regular, monospace;
}
```

### 2.2 Dark Theme Tokens (`.dark`, `[data-theme="dark"]`, `html.dark`)

```css
html.dark,
body.dark,
[data-theme="dark"],
.dark {
  /* Brand Core Dark Variants */
  --primary: #10b981;
  --primary-container: #059669;
  --secondary: #059669;
  --tertiary: #34d399;

  /* Neutral & Surfaces */
  --background: #06100c;                   /* Obsidian emerald page ground */
  --bg-secondary: #0a1813;
  --surface: #081510;                      /* Dark canvas base */
  --surface-container-lowest: #0c1e17;     /* Dark elevated card surface */
  --surface-container-low: #11281f;        /* Nested container */
  --surface-container: #16362a;            /* Input background / tab active */
  --surface-container-high: #1c4435;
  --surface-container-highest: #235442;
  --surface-elevated: #11281f;

  /* Alternate Slate Dark (used in Modals / Login) */
  --surface-slate-dark: #0f172a;
  --surface-slate-card: #111827;
  --surface-slate-elevated: #1f2937;

  /* Typography / Text */
  --text-primary: #f0fdf4;                 /* Crisp mint-white (optimal contrast) */
  --text-secondary: #bbf7d0;               /* Subdued mint */
  --text-muted: #6ee7b7;                   /* Dim mint caption */
  --on-surface: #f0fdf4;
  --on-surface-variant: #bbf7d0;

  /* Borders & Outlines */
  --border: #1a4334;
  --border-subtle: #11281f;
  --outline: #6ee7b7;
  --outline-variant: #1a4334;

  /* Status Colors (Dark mode brightness calibrated) */
  --success: #22c55e;
  --warning: #fbbf24;
  --error: #ef4444;
  --info: #38bdf8;

  /* Elevation & Shadows */
  --shadow-card: 0 2px 4px 0 rgba(0, 0, 0, 0.4);
  --shadow-elevated: 0 10px 25px -5px rgba(0, 0, 0, 0.6);
  --shadow-tactile: 0 4px 0 0 #064e3b;
  --shadow-tactile-success: 0 4px 0 0 #166534;
  --shadow-glow-cyan: 0 0 28px rgba(6, 200, 217, 0.35);
  --shadow-glow-emerald: 0 0 28px rgba(16, 185, 129, 0.35);
}
```

---

## 3. Typography Hierarchy

### 3.1 Font Families

| Role | Font Family | Fallbacks | Source / Loading Spec |
| :--- | :--- | :--- | :--- |
| **Headline / Display** | `'Outfit'` | `system-ui, -apple-system, sans-serif` | Google Fonts (wght: 500, 600, 700, 800, 900) |
| **Body & UI Controls** | `'Plus Jakarta Sans'` / `'DM Sans'` | `system-ui, -apple-system, sans-serif` | Google Fonts (wght: 400, 500, 600, 700) |
| **Code, RFCs & Metrics** | `'JetBrains Mono'` | `ui-monospace, SFMono-Regular, monospace` | Google Fonts (wght: 400, 500, 600, 700) |
| **Display / Badges** | `'Sora'` | `sans-serif` | Google Fonts (wght: 700, 800) |

### 3.2 Scale & Weights

| Token / Usage | Font Size | Line Height | Tracking | Weight | Recommended CSS / Utility |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `Display Hero` | `32px – 40px` | `1.15` | `-0.03em` | `800` / `900` | `font-headline text-3xl sm:text-4xl font-black` |
| `H1 Page Title` | `24px – 30px` | `1.2` | `-0.025em`| `800` | `font-headline text-2xl sm:text-3xl font-extrabold` |
| `H2 Section Header`| `20px – 24px` | `1.25`| `-0.02em` | `700` | `font-headline text-xl sm:text-2xl font-bold` |
| `H3 Card Title` | `16px – 18px` | `1.3` | `-0.015em`| `700` | `font-headline text-base sm:text-lg font-bold` |
| `Body Large` | `15px` | `1.5` | `normal` | `400` / `500` | `font-body text-[15px] leading-relaxed` |
| `Body Base` | `14px` | `1.5` | `normal` | `400` / `500` | `font-body text-sm text-on-surface` |
| `Body Small` | `12px – 13px` | `1.4` | `normal` | `400` / `500` | `font-body text-xs text-on-surface-variant` |
| `Label / Eyebrow` | `10px – 11px` | `1.1` | `+0.08em` | `700` / `800` | `font-headline text-[10px] uppercase font-bold tracking-wider` |
| `Code Metric` | `12px – 14px` | `1.0` | `normal` | `700` | `font-mono text-xs sm:text-sm font-bold` |

---

## 4. Logo, Mascot & Institutional Brand Assets

### 4.1 Asset Inventory & Paths

| Asset Name | Canonical Repository Path | Recommended Usage in Faculty Portal |
| :--- | :--- | :--- |
| **Mascot Brand Mark** | `/assets/mascot/cresco-mascot.png` | App bar brand mark, avatar headers, celebration states |
| **Complete Logo (Light)** | `/assets/brand/cresco-logo-full.png` | Login header, landing headers, reports & certificates |
| **Complete Logo (Dark)** | `/assets/brand/cresco-logo-full-white.png`| Dark mode login views, dark report exports |
| **App Icon** | `/assets/brand/cresco-app-icon.png` | PWA manifest, browser tab, system notifications |
| **Favicon** | `/assets/brand/cresco-favicon.png` | Browser tab favicon (`192x192` PNG & SVG) |
| **Teacher Illustration** | `/cresco-teacher.png` (or `/assets/mascot/mascot-boss.png`) | Faculty portal hero illustration & teacher banner |
| **Wordmark** | `/assets/brand/cresco-wordmark-cn.png` | Footer signatures & copyright blocks |

### 4.2 Brand Typography Lockup

In headers and logos without the static PNG, the standard text lockup is:
```html
<div class="flex items-center gap-2.5">
  <!-- 44x44px Mascot Icon -->
  <div class="w-11 h-11 relative flex items-center justify-center shrink-0">
    <img
      src="/assets/mascot/cresco-mascot.png"
      alt="Cresco CN Mascot Logo"
      class="w-full h-full object-contain filter drop-shadow-[0_2px_8px_rgba(6,182,212,0.4)]"
    />
  </div>
  <!-- Typography Lockup -->
  <div class="flex flex-col">
    <span class="font-headline text-2xl font-black tracking-tight leading-none text-slate-900 dark:text-white flex items-center gap-1.5">
      CRESCO <span class="text-[#06B6D4] dark:text-[#22D3EE] font-black">CN</span>
    </span>
    <span class="text-[10px] font-mono text-cyan-600 dark:text-cyan-400 font-extrabold tracking-widest uppercase leading-none mt-1">
      FACULTY PORTAL • CS-4200
    </span>
  </div>
</div>
```

---

## 5. UI Component Specifications

### 5.1 App Header / Top Navigation Bar (Navbar)

- **Position & Dimensions:** `sticky top-0 z-30 w-full h-16 (64px)`.
- **Background:** `bg-surface-container-lowest/90 dark:bg-[#111827]/90` with `backdrop-blur-xl`.
- **Borders:** `border-b border-[#E5E0D8] dark:border-slate-800`.
- **Shadow:** `shadow-[0_1px_8px_rgba(0,0,0,0.04)]`.
- **Layout:** Max-width `1440px`, horizontal padding `pl-14 sm:pl-16 pr-4 sm:pr-6`.
- **Elements:**
  1. **Left:** Hamburger spacer/toggle button + Brand Logo lockup.
  2. **Center:** Quick Search Pill (`max-w-md`, rounded-xl, with ⌘K badge, icon, and placeholder: `Search students, assignments, question bank...`).
  3. **Right Controls:**
     - Theme Toggle Switch (tactile iOS pill with sun/moon).
     - Live Sync Status Pill (`REAL-TIME FIREBASE DB` with pulsing green dot).
     - Notification Bell (`p-2 rounded-xl`, with unread count badge in `bg-error`).
     - Instructor Profile Avatar with status indicator ring.

---

### 5.2 Navigation Sidebar (Floating Glassmorphic Drawer)

The Cresco portal uses a **floating glassmorphic sidebar drawer** triggered by a fixed hamburger button:

- **Trigger Button:**
  - Fixed at `top-3 left-3 sm:left-4 z-[55]`.
  - Dimensions: `w-10 h-10 sm:w-11 sm:h-11 rounded-2xl`.
  - Backdrop: `bg-white/80 dark:bg-[#0c1e17]/85 backdrop-blur-xl`.
  - Border: `border border-white/80 dark:border-emerald-500/25`.
  - Icon: Animated 3-bar morphing into an `X` when open.
- **Drawer Body:**
  - Position: `fixed top-3 bottom-3 left-3 sm:left-4 z-50`.
  - Width: `w-72 sm:w-80 max-w-[calc(100vw-1.5rem)]`.
  - Shape: `rounded-3xl` (24px radius).
  - Background: `bg-white/85 dark:bg-[#0a1813]/90 backdrop-blur-2xl`.
  - Border: `border border-white/70 dark:border-emerald-500/20 ring-1 ring-emerald-500/10`.
  - Shadow: `shadow-[0_20px_60px_-15px_rgba(6,36,25,0.22)] dark:shadow-[0_25px_65px_-10px_rgba(0,0,0,0.7)]`.
- **Backdrop Overlay:** `fixed inset-0 z-40 bg-slate-950/20 dark:bg-black/55 backdrop-blur-[3px]`.
- **Navigation Items:**
  - Height: `py-2.5 px-3 rounded-2xl`.
  - Item Content: Monospace index (`01`, `02`), Lucide icon (size 17, stroke 2.5), title label, optional badge.
  - Active Item: `bg-gradient-to-r from-emerald-500/18 to-teal-500/10 text-emerald-950 dark:text-emerald-200 border-l-[3px] border-emerald-500`.
  - Inactive Item: `text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-emerald-500/8`.

---

### 5.3 Buttons & Interactive Affordances

#### 1. Primary Tactile 3D Action Button (Signatures)
Used for primary calls-to-action (e.g., "Continue Course", "Publish Unit", "Save Changes"):
```css
.btn-tactile-primary {
  background-color: #059669;
  color: #ffffff;
  font-family: var(--font-headline);
  font-weight: 700;
  font-size: 14px;
  border-radius: 12px;
  padding: 12px 24px;
  box-shadow: 0 4px 0 0 #047857, 0 10px 20px rgba(16, 185, 129, 0.25);
  transition: all 150ms ease;
  cursor: pointer;
}
.btn-tactile-primary:hover {
  box-shadow: 0 2px 0 0 #047857, 0 6px 12px rgba(16, 185, 129, 0.2);
  transform: translateY(2px);
}
.btn-tactile-primary:active {
  box-shadow: 0 0 0 0 #047857;
  transform: translateY(4px);
}
```

#### 2. Shimmer Highlight Button
Used for standout feature buttons, live stream activations, and promotions:
- Border gradient: `from-emerald-500 via-teal-400 to-green-600`.
- Glowing pulse: `shadow-[0_0_24px_rgba(16,185,129,0.35)]`.
- Shimmer beam: 45° angled white linear gradient sweeping across on hover.

#### 3. Gooey Blob Button (`.c-button--gooey`)
Used for interactive simulation triggers:
- Uses SVG `#goo` blur and matrix filter.
- 3 floating liquid blob divs inside with 700ms ease transform translation on hover.

#### 4. Secondary Neutral / Outline Button
```css
.btn-outline {
  background-color: transparent;
  color: var(--on-surface-variant);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 10px 20px;
  font-weight: 600;
  font-size: 13px;
  transition: background-color 200ms ease, color 200ms ease;
}
.btn-outline:hover {
  background-color: var(--surface-container);
  color: var(--on-surface);
}
```

#### 5. Destructive / Danger Button
- Light: `text-red-600 hover:bg-red-50 border border-red-200 rounded-xl`.
- Dark: `text-red-400 hover:bg-red-500/10 border border-red-500/20 rounded-xl`.

---

### 5.4 Form Inputs & Controls

#### Text / Select / Number Inputs
```css
.input-base {
  width: 100%;
  padding: 10px 14px;
  border-radius: 12px;
  font-size: 13px;
  font-family: var(--font-body);
  transition: all 200ms ease;
  outline: none;
}

/* Light Mode Input */
.input-base {
  background-color: #ffffff;
  border: 1px solid #d1d5db; /* slate-300 */
  color: #0f172a;            /* slate-900 */
}
.input-base:focus {
  border-color: #10b981;    /* Emerald-500 */
  box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.15);
}

/* Dark Mode Input */
.dark .input-base {
  background-color: #111827; /* slate-900 */
  border: 1px solid #334155; /* slate-700 */
  color: #f8fafc;
}
.dark .input-base:focus {
  border-color: #06b6d4;    /* Cyan-400 */
  box-shadow: 0 0 0 3px rgba(6, 182, 212, 0.2);
}
```

#### Monospace / Code Inputs (Register numbers, IPs, Ports, Formulas)
- `font-family: var(--font-mono)`.
- Character tracking: tight font metric for clean alignment.

---

### 5.5 Cards & Containers

| Card Variant | Background (Light) | Background (Dark) | Border | Shadow / Glow |
| :--- | :--- | :--- | :--- | :--- |
| **Standard Content Card** | `#FFFFFF` | `#0C1E17` / `#1F2937` | `1px solid var(--border)` | `0 4px 16px -2px rgba(19, 27, 46, 0.06)` |
| **3D Hero Banner** | Conic Emerald (`#10b981` to `#059669`) | Deep Emerald gradient | Subtle white overlay `1px` | `0 12px 36px -6px rgba(16, 185, 129, 0.35)` |
| **Tactile Stat Metric Card** | `#FFFFFF` | `#0C1E17` | `1px solid var(--border)` | `0 4px 0 0 #ffdea8` (Amber) or `#bbf7d0` |
| **Glassmorphic Modal Card** | `rgba(255, 255, 255, 0.95)` | `rgba(14, 22, 38, 0.85)` | `1px solid rgba(56, 189, 248, 0.28)` | `0 10px 40px rgba(0,0,0,0.6), 0 0 35px rgba(6,200,217,0.18)` |
| **Callout / Alert Card** | `bg-cyan-500/10` | `bg-cyan-950/30` | `border border-cyan-500/25` | `shadow-xs` |

---

### 5.6 Badges, Chips & Progress Bars

#### Status Badges
- **Live / Stream Active:** `bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-300 rounded-full text-[10px] font-mono font-bold` with `w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse`.
- **Institution / KLU:** `bg-cyan-500/15 text-cyan-500 dark:text-cyan-400 border border-cyan-500/30 rounded-full text-[10px] font-mono font-bold px-2 py-0.5`.
- **Warning / Pending:** `bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30 rounded-full text-[10px] font-mono font-bold`.
- **Faculty / Instructor:** `bg-purple-500/15 text-purple-700 dark:text-purple-300 border border-purple-500/30 rounded-full text-[10px] font-mono font-bold`.

#### Progress Bars
- **Track:** Height `10px`–`14px`, `rounded-full`, background `var(--surface-container)` or `rgba(255,255,255,0.2)`.
- **Fill:** `bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400`.
- **Glow Accent:** `shadow-[0_0_12px_#ffba20]` or `shadow-[0_0_8px_rgba(16,185,129,0.5)]`.
- **Transition:** `transition-all duration-700 ease-out`.

---

## 6. Login View Visual Style (Blueprint for Faculty Portal)

The Student Portal features an iconic **deep cybernetic login aesthetic** that should be mirrored in the Faculty Portal:

1. **Page Backdrop:**
   - Deepest space obsidian: `#070D18`.
   - Dynamic canvas: `LiquidLines` wave animation in neon cyan (`#06c8d9`, wave speed `0.35`, wave frequency `46`, opacity `0.85`).
   - Radial vignette: `bg-radial-gradient from-transparent via-[#070D18]/30 to-[#070D18]/80`.
2. **Fixed Escape Navigation:**
   - Top-left button: `Back to Home (Esc)`.
   - Styling: `bg-[#0E1626]/85 border border-cyan-500/30 text-slate-200 rounded-xl px-4 py-2.5 backdrop-blur-md hover:-translate-x-0.5`.
3. **Card Container Dimensions:**
   - Width: `560px` (max `95vw`), minimum height: `520px`.
   - Border radius: `22px`.
   - Background: `rgba(14, 22, 38, 0.82)` with `backdrop-filter: blur(24px)`.
   - Borders: `1px solid rgba(56, 189, 248, 0.28)`.
   - Box shadow: `0px 10px 40px rgba(0, 0, 0, 0.6), 0 0 35px rgba(6, 200, 217, 0.18)`.
4. **Internal Layout (Desktop):**
   - **Left Column (66%):** Form fields, headers, error banners, and authentication submit buttons.
   - **Right Column (34%):** Academic coding mascot vector illustration (hidden below `640px` mobile breakpoint).
5. **Form Controls:**
   - Labels: `text-xs font-bold text-slate-300 flex items-center gap-1.5`.
   - Fields: `rounded-xl bg-slate-900/90 border border-slate-700 focus:border-cyan-400 text-white font-mono px-3.5 py-2.5`.
   - Password Toggle: `Eye` / `EyeOff` icon placed at `right-2.5 top-1/2 -translate-y-1/2`.
   - Primary Submit Button: `w-full py-2.5 rounded-xl bg-[#0284c7] hover:bg-[#0369a1] text-white text-xs font-bold shadow-md shadow-sky-600/30`.

---

## 7. Layout, Spacing & Responsive Grid Rules

### 7.1 Breakpoints

| Breakpoint | Minimum Width | Description |
| :--- | :--- | :--- |
| `sm` | `640px` | Small devices / Large mobiles |
| `md` | `768px` | Tablets (Bottom navigation hides; header tightens) |
| `lg` | `1024px` | Small laptops / Desktop |
| `xl` | `1280px` | Standard Desktop (12-column split grid activates) |
| `2xl` | `1536px` | Ultra-wide workstation monitors |

### 7.2 Main Layout Grid

The Cresco desktop dashboard employs an asymmetric **68% / 32% grid**:
```html
<div class="w-full max-w-7xl mx-auto pt-4 pb-16 px-4 sm:px-6 text-on-surface">
  <div class="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
    <!-- Main Content Area (approx 68%) -->
    <main class="xl:col-span-8 flex flex-col gap-8 min-w-0">
      <!-- Hero Banner & Action Cards -->
    </main>

    <!-- Tactical Rail / Analytics Sidebar (approx 32%) -->
    <aside class="xl:col-span-4 flex flex-col gap-6">
      <!-- Cohort Summary, Live Activity, Quick Links -->
    </aside>
  </div>
</div>
```

### 7.3 Mobile Navigation Strategy

- On screens `< 768px` (`md:hidden`), a fixed bottom navigation bar renders at `fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-[#1F2937]/95 backdrop-blur-md border-t border-[#E5E0D8] dark:border-slate-800`.
- Top header search bar collapses to a modal icon.
- Floating sidebar expands to `w-[calc(100vw-1.5rem)]`.

---

## 8. Motion, Keyframes & Animation System

The portal avoids jarring motion, opting for smooth, organic micro-interactions:

| Keyframe Name | Duration / Curve | Purpose |
| :--- | :--- | :--- |
| `octo-float` | `4s ease-in-out infinite` | Floating ambient mascot motion (`translateY -10px`) |
| `octo-bounce` | `1.8s ease-in-out infinite` | Energetic celebration and reward states |
| `octo-glow` | `3s ease-in-out infinite` | Cyan drop-shadow glow cycling (`drop-shadow 20px #06B6D4`) |
| `scaleUp` | `0.3s ease-out forwards` | Dropdowns, tooltips, and modal appearance |
| `fadeIn` | `0.4s ease-out forwards` | View routing and page content transitions |
| `beacon-pulse` | `2s ease-in-out infinite` | Live stream indicators and real-time status dots |
| `marquee` | `30s linear infinite` | Protocol and RFC marquee strip |

---

## 9. Iconography System

- **Primary Icon Library:** `lucide-react` (version `^0.546.0` or latest).
- **Icon Sizing Conventions:**
  - Header & toolbar icons: `size={16}` or `size={18}`.
  - Sidebar icons: `size={17}`, `strokeWidth={2}` (unselected) / `strokeWidth={2.5}` (selected).
  - Stat cards: `size={20}` or `size={24}`.
  - Buttons / inline labels: `size={14}`.
- **Secondary Icon Support:** `Material Symbols Outlined` (used for specialized hardware / network icons).

---

## 10. Implementation Guide for Faculty Portal (`Cresco-CN-KARE-Faculty`)

When developing the separate Faculty Portal, follow these steps to achieve exact visual parity:

1. **Include Google Fonts in `index.html`:**
   ```html
   <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@500;600;700;800;900&family=Plus+Jakarta+Sans:wght@400;500;600;700&family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&family=JetBrains+Mono:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Sora:wght@400;700;800&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
   ```
2. **Copy Brand Assets:** Ensure the files in `public/assets/brand/` and `public/assets/mascot/` are copied to the Faculty Portal's `public/` directory so all logo and image paths match exactly.
3. **Adopt Design Tokens:** Paste the `:root` and `.dark` variables from **Section 2** into `src/index.css`.
4. **Apply Consistent Structural Themes:**
   - Use the **tactile 3D button styling** for primary instructor actions (Grading, Exporting CSV, Creating Questions).
   - Use the **glassmorphic topbar and floating drawer sidebar** for institutional consistency.
   - Use **purple/indigo accents (`#8b5cf6`, `#6366f1`)** as the designated faculty role highlight, paired with the established emerald base.
5. **Maintain Dark/Light Mode Parity:** Support the same `ThemeToggleSwitch` using the `.dark` CSS class toggle on the `<html>` root.
