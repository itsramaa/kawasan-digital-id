

## Plan: Unify Storefront & Landing Page Design

**Goal**: Make both layouts visually consistent, using the Landing Page navbar style as the reference and the Storefront footer style as the reference.

### Key Differences to Resolve

| Element | Storefront (current) | Landing (reference) | Action |
|---------|---------------------|---------------------|--------|
| **Navbar logo** | Flat `bg-primary`, no gradient text | Gradient `from-primary to-secondary`, `.gradient-text` | Update Storefront to match Landing |
| **Navbar container** | Always `bg-card/80 backdrop-blur-lg` | Scroll-aware: transparent → solid | Update Storefront to match Landing |
| **Nav link style** | `bg-primary/10` active, `hover:bg-muted` | Underline animation (`after:` pseudo), no bg | Update Storefront to match Landing |
| **Max width** | `max-w-6xl` | `max-w-7xl` | Unify to `max-w-7xl` |
| **Footer** | Clean 4-col grid, `bg-card`, clear structure | Dark gradient `bg-sidebar-background`, decorative blurs | Update Landing footer to match Storefront's clean structure |

### Changes (2 files)

#### 1. `StorefrontLayout.tsx` -- Update Navbar to match Landing style
- Add scroll-aware background (transparent at top → solid on scroll)
- Logo: gradient icon (`from-primary to-secondary`) + `.gradient-text` on brand name
- Nav links: replace `bg-primary/10` active style with underline animation using `after:` pseudo-element
- CTA button: gradient style (`from-primary to-secondary`)
- Max width: `max-w-6xl` → `max-w-7xl`
- Mobile nav: add `backdrop-blur-xl` and match styling

#### 2. `LandingLayout.tsx` -- Update Footer to match Storefront style
- Replace dark gradient background with clean `bg-card border-t border-border`
- Use Storefront's 4-column grid structure (Brand, Services→Navigasi, Help→Layanan, Contact)
- Use `text-foreground` / `text-muted-foreground` instead of `sidebar-*` tokens
- Keep contact info (email, phone, address) but style them like Storefront's clean text links
- Keep social icons but adapt to light card background
- Add Storefront's email in bottom bar
- Max width stays `max-w-7xl` (consistent with Landing navbar)

