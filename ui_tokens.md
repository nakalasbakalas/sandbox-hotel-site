# Sandbox Hotel — UI Design Tokens

Centralized reference for the design system used across the Sandbox Hotel website.

## Colors

### Brand Palette
| Token | Value | Usage |
|-------|-------|-------|
| `--copper` | `#A8652A` | Primary brand accent |
| `--copper2` | `#C4884E` | Lighter brand accent |
| `--champagne` | `#E8C9A0` | Warm highlight |
| `--champagne2` | `#F2D9B8` | Light warm highlight |
| `--bronze` | `#8B6914` | Reserved accent |
| `--olive` | `#5C6B55` | Reserved accent |
| `--slate` | `#4A5568` | Reserved accent |

### Semantic Colors — Dark Theme
| Token | Value | Usage |
|-------|-------|-------|
| `--bg0` | `#0A0B0D` | Main background |
| `--bg1` | `#111318` | Secondary background |
| `--paper` | `#0E1014` | Page surface |
| `--card` | `#15181C` | Card background |
| `--card2` | `#1B1F25` | Alternate card |
| `--ink` | `#F3EFE7` | Primary text |
| `--ink2` | `#FFFFFF` | High-contrast text |
| `--muted` | `#CDC4B7` | Secondary text |
| `--muted2` | `#AAA092` | Tertiary text |
| `--line` | `rgba(255,255,255,.08)` | Borders |

### Semantic Colors — Light Theme
| Token | Value | Usage |
|-------|-------|-------|
| `--bg0` | `#F5F0E8` | Main background |
| `--bg1` | `#FAF6EF` | Secondary background |
| `--paper` | `#FFFDF8` | Page surface |
| `--card` | `#FFFFFF` | Card background |
| `--card2` | `#FBF7F0` | Alternate card |
| `--ink` | `#2D2A26` | Primary text |
| `--ink2` | `#1A1815` | High-contrast text |
| `--muted` | `#6B645A` | Secondary text |
| `--muted2` | `#8A8279` | Tertiary text |
| `--line` | `rgba(45,36,24,.09)` | Borders |

## Typography

| Token | Value | Usage |
|-------|-------|-------|
| `--sans` | `"Manrope", "Segoe UI", sans-serif` | Body copy |
| `--display` | `"Fraunces", Georgia, serif` | Headlines |
| `--bodySize` | `clamp(15px, 1.05vw, 16.5px)` | Body text size |
| `--heroTitleSize` | `clamp(36px, 4.8vw, 64px)` | Hero headline |
| `--sectionTitleSize` | `clamp(26px, 2.6vw, 38px)` | Section headings |
| Line height | `1.65` | Body text |

## Spacing

| Token | Value | Usage |
|-------|-------|-------|
| `--gutter` | `clamp(16px, 2.8vw, 32px)` | Page side padding |
| `--sectionY` | `clamp(32px, 4.8vw, 56px)` | Section vertical margin |
| `--gridGap` | `clamp(14px, 2vw, 20px)` | Grid gaps |
| `--surfacePad` | `clamp(24px, 2.8vw, 32px)` | Card padding |
| `--surfacePadSm` | `clamp(18px, 2vw, 24px)` | Small card padding |
| `--contentTightGap` | `10px` | Tight content gap |
| `--contentStackGap` | `14px` | Stack content gap |

## Radius

| Token | Value | Usage |
|-------|-------|-------|
| `--radius` | `16px` | Cards, hero |
| `--radius2` | `12px` | Inner cards, inputs |
| `--btn-radius` | `10px` | Buttons |

## Shadows

| Token | Dark Value | Light Value |
|-------|-----------|-------------|
| `--shadow` | `0 28px 80px rgba(0,0,0,.42)` | `0 24px 56px rgba(59,43,22,.10)` |
| `--shadow2` | `0 18px 42px rgba(0,0,0,.28)` | `0 16px 28px rgba(59,43,22,.08)` |
| `--shadow3` | `0 10px 24px rgba(0,0,0,.18)` | `0 8px 18px rgba(59,43,22,.06)` |

## Buttons

| Variant | Background | Color | Border |
|---------|-----------|-------|--------|
| `.btn` | `rgba(255,255,255,.035)` | `--ink2` | `--line` |
| `.btn.primary` | Gradient copper → champagne | White | None |
| `.btn.secondary` | `rgba(255,255,255,.05)` | White | `rgba(255,255,255,.18)` |
| `.btn.hot` | Gradient champagne → copper | Dark | None |
| `.btn.ghost` | Transparent | `--ink2` | `--line` |

## Layout

| Property | Value |
|----------|-------|
| Max width | `1200px` |
| Nav height | `64px` (desktop) / `56px` (compact) |
| Button height | `44px` (desktop) / `42px` (compact) |
| Hero min height | `min(80vh, 720px)` |

## Breakpoints

| Device | Width | Density |
|--------|-------|---------|
| Desktop | > 980px | `comfortable` |
| Tablet | 640–980px | `compact` |
| Phone | < 640px | `compact` / `ultra-compact` |

## Focus States

| Token | Value |
|-------|-------|
| `--focus` | `0 0 0 3px rgba(168,101,42,.30)` |
