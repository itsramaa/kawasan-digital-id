

## Plan: Maximize Content & Sections Across All Landing Pages

### Current State
Each page has 2-4 sections. The Home page lacks demo/process content, About has no team section, Services lacks pricing/process, Portfolio is data-dependent, and Contact is minimal.

### New Sections Per Page

#### 1. LandingHome.tsx (add 4 new sections)
- **Trusted By / Client Logos**: Infinite scrolling marquee of client/partner logos (CSS-only marquee animation)
- **How It Works / Process**: 3-step horizontal process flow (Konsultasi → Pengembangan → Launch) with numbered circles and connecting lines
- **Live Demo Preview**: Interactive tabbed component showing before/after or device mockup previews (desktop/tablet/mobile) with animated device frames
- **FAQ Accordion**: Common questions using Radix Accordion component, styled with gradient borders

#### 2. AboutPage.tsx (add 3 new sections)
- **Team Section**: Grid of 4-6 team members with photo placeholders (gradient avatar circles), name, role, and social links. Hover effect reveals bio
- **Company Numbers / Achievements**: Horizontal stats bar with icons (Projects Delivered, Years Experience, Team Members, Technologies Used) using the animated counter hook
- **Tech Stack / Tools We Use**: Logo grid of technologies (React, TypeScript, Tailwind, Node.js, etc.) with subtle hover tooltips

#### 3. ServicesPage.tsx (add 3 new sections)
- **Process Timeline**: Horizontal 4-step process (Discovery → Design → Development → Deploy) with animated progress line
- **Pricing Comparison Table**: 3-tier pricing cards (Starter, Professional, Enterprise) with feature comparison checkmarks, "Populer" badge on middle tier
- **FAQ Section**: Service-specific questions using Accordion

#### 4. PortfolioPage.tsx (add 2 new sections)
- **Stats Banner**: Project count, technologies used, industries served (using counter animation)
- **CTA Section**: Bottom gradient CTA encouraging visitors to start their project

#### 5. ContactPage.tsx (add 2 new sections)
- **FAQ Before Form**: 3-4 common pre-sales questions using Accordion
- **Office Hours / Availability**: Card showing business hours, response time guarantee, and WhatsApp quick-contact button

### Interactive Components (pure CSS/React, no new deps)
- **Marquee**: CSS `@keyframes` scroll animation for client logos
- **Tabbed Device Preview**: useState toggle between desktop/tablet/mobile mockup frames
- **Accordion**: Use existing `@radix-ui/react-accordion` (already installed)
- **Animated counters**: Reuse existing `useCounter` hook from LandingHome

### Files to Modify
1. `src/pages/landing/LandingHome.tsx` -- add 4 sections
2. `src/pages/landing/AboutPage.tsx` -- add 3 sections (team, stats, tech stack)
3. `src/pages/landing/ServicesPage.tsx` -- add 3 sections (process, pricing, FAQ)
4. `src/pages/landing/PortfolioPage.tsx` -- add 2 sections
5. `src/pages/landing/ContactPage.tsx` -- add 2 sections
6. `src/index.css` -- add marquee keyframes

### Design Consistency
All new sections follow existing patterns: `RevealCard` for scroll animations, `glass-card` + `hover-lift` for cards, gradient icon containers, `gradient-text` for headings, consistent `max-w-7xl` containers, and the established color accent system (primary/secondary/accent/destructive).

