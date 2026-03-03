

## Plan: Add Aesthetic Background Image Assets to All Landing Pages

### Current State
All landing pages use only CSS geometric shapes (FloatingElements) and blurred gradient circles. No actual image assets are used anywhere -- the backgrounds feel flat and code-generated.

### Approach
Add aesthetic, lightweight background images using two strategies:
1. **Inline SVG patterns** -- topography lines, wave shapes, grid patterns rendered as CSS `background-image` data URIs (zero network requests, tiny size)
2. **Curated stock photos from Unsplash** -- used as subtle section background images with dark/gradient overlays so text remains readable

### Changes

#### 1. `src/shared/components/common/BackgroundPatterns.tsx` (NEW)
Reusable components for SVG-based background patterns:
- `WavePattern` -- flowing wave SVG for hero sections
- `TopographyPattern` -- topographic contour lines
- `GridLinesPattern` -- subtle grid for tech sections
- `AbstractBlobPattern` -- organic blob shapes

Each accepts `className` and renders as an absolutely-positioned, pointer-events-none div with inline SVG as `background-image`.

#### 2. Each landing page gets section-specific image backgrounds:

| Page | Section | Background Treatment |
|---|---|---|
| **LandingHome** | Hero | Wave SVG pattern + Unsplash tech workspace photo (opacity 5%, blur) |
| **LandingHome** | Why Us | Topography SVG pattern |
| **LandingHome** | Services | Grid lines pattern |
| **LandingHome** | Portfolio showcase | Abstract gradient mesh |
| **AboutPage** | Hero | Unsplash team/office photo (opacity 5%, overlay) |
| **AboutPage** | Values | Organic blob SVG pattern |
| **AboutPage** | Timeline | Topography lines |
| **ServicesPage** | Hero | Unsplash code/development photo (opacity 5%, overlay) |
| **ServicesPage** | Tech Stack | Grid dots + circuit SVG pattern |
| **ServicesPage** | Add-ons | Subtle gradient mesh |
| **PortfolioPage** | Hero | Unsplash creative workspace photo (opacity 5%, overlay) |
| **PortfolioPage** | Projects grid | Subtle diagonal lines pattern |
| **ContactPage** | Hero | Unsplash office/cityscape photo (opacity 5%, overlay) |
| **ContactPage** | Form area | Minimal dot grid enhancement |

#### 3. `src/index.css` -- Add new CSS utilities
- `.bg-pattern-wave`, `.bg-pattern-topo`, `.bg-pattern-grid` -- SVG data URI backgrounds
- `.bg-image-overlay` -- standard overlay treatment for stock photos (gradient + blur + low opacity)

### Implementation Details
- Stock photos use Unsplash CDN with `w=1920&q=20&blur=20` params for tiny file size (~10-20KB each) and pre-blurred aesthetic
- All background images get `loading="lazy"` via CSS or img elements
- Overlays use `bg-gradient-to-b from-background/95 via-background/90 to-background/95` to ensure text readability
- FloatingElements remain on top of these backgrounds for layered depth

### Files to modify
1. **NEW** `src/shared/components/common/BackgroundPatterns.tsx`
2. `src/index.css` -- Add SVG pattern utilities
3. `src/pages/landing/LandingHome.tsx` -- Add background images to 4 sections
4. `src/pages/landing/AboutPage.tsx` -- Add background images to 3 sections
5. `src/pages/landing/ServicesPage.tsx` -- Add background images to 3 sections
6. `src/pages/landing/PortfolioPage.tsx` -- Add background images to 2 sections
7. `src/pages/landing/ContactPage.tsx` -- Add background images to 2 sections

### Performance
- SVG patterns are inline data URIs (~1-2KB each, no network requests)
- Stock photos use heavily compressed + blurred Unsplash URLs (~10-20KB each)
- All decorative, lazy-loaded, no layout shift
- Total added weight: ~100KB across all 5 pages

