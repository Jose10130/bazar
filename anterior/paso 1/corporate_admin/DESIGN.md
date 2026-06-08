---
name: Corporate Admin
colors:
  surface: '#f7f9fb'
  surface-dim: '#d8dadc'
  surface-bright: '#f7f9fb'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f4f6'
  surface-container: '#eceef0'
  surface-container-high: '#e6e8ea'
  surface-container-highest: '#e0e3e5'
  on-surface: '#191c1e'
  on-surface-variant: '#45474c'
  inverse-surface: '#2d3133'
  inverse-on-surface: '#eff1f3'
  outline: '#75777d'
  outline-variant: '#c5c6cd'
  surface-tint: '#545f73'
  primary: '#091426'
  on-primary: '#ffffff'
  primary-container: '#1e293b'
  on-primary-container: '#8590a6'
  inverse-primary: '#bcc7de'
  secondary: '#006c49'
  on-secondary: '#ffffff'
  secondary-container: '#6cf8bb'
  on-secondary-container: '#00714d'
  tertiary: '#330002'
  on-tertiary: '#ffffff'
  tertiary-container: '#5a0008'
  on-tertiary-container: '#ff5250'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d8e3fb'
  primary-fixed-dim: '#bcc7de'
  on-primary-fixed: '#111c2d'
  on-primary-fixed-variant: '#3c475a'
  secondary-fixed: '#6ffbbe'
  secondary-fixed-dim: '#4edea3'
  on-secondary-fixed: '#002113'
  on-secondary-fixed-variant: '#005236'
  tertiary-fixed: '#ffdad7'
  tertiary-fixed-dim: '#ffb3ad'
  on-tertiary-fixed: '#410004'
  on-tertiary-fixed-variant: '#930013'
  background: '#f7f9fb'
  on-background: '#191c1e'
  surface-variant: '#e0e3e5'
typography:
  headline-xl:
    fontFamily: Inter
    fontSize: 30px
    fontWeight: '700'
    lineHeight: 38px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-md:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.05em
  headline-xl-mobile:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  container-margin: 2rem
  gutter: 1.5rem
  section-gap: 2rem
  card-padding: 1.5rem
  mobile-margin: 1rem
---

## Brand & Style
This design system is built upon a **Corporate Modern** aesthetic, prioritizing clarity, efficiency, and a high level of perceived trust. It is designed for e-commerce administrators who require a stable and professional environment to manage high-volume data without cognitive fatigue.

The style leverages a "Clean Slate" philosophy: the interface recedes to the background, allowing data and actionable insights to take center stage. Key characteristics include:
- **Professionalism:** Using a deep navy palette for structural elements to evoke authority.
- **Precision:** High-contrast text and crisp alignments to ensure data readability.
- **Airy Composition:** Generous whitespace (negative space) to prevent the "dashboard clutter" common in legacy admin panels.
- **Soft Modernity:** Subverting strict corporate rigidity with subtle shadows and rounded corners to make the experience approachable.

## Colors
The color palette is functional and semantic, designed to guide the user's eye toward critical information and primary actions.

- **Primary (Slate 800):** Used exclusively for sidebar navigation and header accents to provide a strong structural frame.
- **Secondary (Emerald 500):** Reserved for "Positive Actions" such as "Add Product," "Complete Order," and successful status indicators.
- **Tertiary (Red 500):** Used strictly for "Negative Alerts," specifically stock-outs, overdue payments, and destructive actions (Delete/Cancel).
- **Surface & Background:** The main canvas is pure white (#ffffff), while the global background uses a very light neutral gray (#f8fafc) to provide subtle contrast for white cards.
- **Text:** Primary text uses Slate 900 for maximum legibility, while secondary labels use Slate 500.

## Typography
The design system utilizes **Inter** as its sole typeface to maintain a systematic, utilitarian feel. Inter’s tall x-height makes it exceptionally readable in data-heavy tables and dense forms.

- **Hierarchy:** We use a clear contrast in weights (700 for page titles, 400 for content) rather than excessive size variations to keep the interface compact.
- **Tracking:** Headlines use slightly negative letter spacing for a tighter, more "designed" look, while labels use increased tracking for legibility at small sizes.
- **Numeric Data:** For product prices and stock counts, use `font-feature-settings: 'tnum' on, 'lnum' on;` to ensure tabular figures align perfectly in columns.

## Layout & Spacing
The layout follows a **Fluid Grid** model with fixed breakpoints to ensure the interface feels native on any device.

- **Sidebar Navigation:** On desktop, a fixed-width (280px) sidebar anchors the primary navigation. On mobile, this transitions to a bottom navigation bar or a hidden off-canvas drawer.
- **Main Canvas:** Content is housed in a flexible container with a maximum width of 1440px to prevent lines of text from becoming too long on ultra-wide monitors.
- **The 8px Rule:** All spacing units (padding, margins, gaps) must be multiples of 8px to maintain a consistent visual rhythm.
- **Mobile Reflow:** On mobile devices, 3-column dashboard widgets stack vertically, and horizontal tables transition to a "Card List" view or include an explicit horizontal scroll with a frozen first column.

## Elevation & Depth
Depth is used sparingly to signify interactivity and separate the background from the content layers.

- **Card Surfaces:** Main content blocks use a "Soft Ambient" shadow (`0px 4px 6px -1px rgba(0, 0, 0, 0.1), 0px 2px 4px -1px rgba(0, 0, 0, 0.06)`).
- **Navigation:** The sidebar uses a tonal layer (Solid Slate 800) rather than a shadow to anchor the UI.
- **Interactive Elements:** Buttons and form inputs use a very subtle 1px border (#e2e8f0) that strengthens on hover.
- **Floating Modals:** For order details or stock edits, use a high-elevation shadow with a 20% backdrop blur (glassmorphism effect) on the overlay to maintain context.

## Shapes
The shape language is **Rounded**, moving away from harsh corners to create a more modern, friendly atmosphere without becoming overly "bubbly."

- **Standard Elements:** Buttons, input fields, and small cards use a 0.5rem (8px) radius.
- **Containers:** Large dashboard sections and tables use a 1rem (16px) radius for their outer containers.
- **Badges:** Stock status and category tags use a fully rounded (pill) shape to distinguish them from interactive buttons.

## Components
- **Buttons:** Primary buttons are Solid Emerald for "Save/Apply" and Solid Slate for general actions. They feature a subtle transition on hover (opacity 90%).
- **Data Tables:** Tables should have `border-collapse: separate` and `border-spacing: 0`. Row headers should be bold. Alternate row striping is not required; instead, use a 1px bottom border on rows.
- **Input Fields:** Use a light gray background (#f1f5f9) that turns white on focus, with a 2px Emerald border to indicate active state.
- **Stock Chips:**
    - *In Stock:* Green text on light green background.
    - *Low Stock:* Orange text on light orange background.
    - *Out of Stock:* White text on Red background.
- **Cards:** Dashboard cards must include a "Header" area with a title and an optional "Action" (e.g., "View All") to maintain consistent structure across the layout.