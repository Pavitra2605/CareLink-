### Base / Background
| Name | Hex | Usage |
|------|-----|-------|
| Background Primary | `#F0EFF8` | Main page background |
| Background Secondary | `#E8E8F5` | Sections, alternating bg |
| Surface | `#FFFFFF` | Cards, modals, inputs |
| Surface Hover | `#F7F7FC` | Card hover, row hover |

### Amber / Warm Accent (From the gradient blob)
| Name | Hex | Usage |
|------|-----|-------|
| Amber Light | `#F2B866` | Gradient start, highlights |
| Amber Mid | `#E8A857` | Hero blob, banner |
| Amber Dark | `#C97D3A` | Gradient end, deep accent |
| Amber Glow | `rgba(232,168,87,0.25)` | Soft blur effects, glow |

### Text
| Name | Hex | Usage |
|------|-----|-------|
| Text Primary | `#1A1A1A` | Headings, bold text |
| Text Secondary | `#4A4A4A` | Body paragraphs |
| Text Muted | `#8A8A9A` | Captions, placeholders |
| Text Inverted | `#FFFFFF` | Text on dark buttons |

### Accent / Interactive (Indigo-Purple)
| Name | Hex | Usage |
|------|-----|-------|
| Accent Default | `#6B6BCC` | Links, focus rings, active nav |
| Accent Hover | `#5555BB` | Hover state |
| Accent Light | `#EEEEF9` | Accent bg chips, badges |
| Accent Muted | `rgba(107,107,204,0.15)` | Subtle tints, tag bg |

### Buttons
| Name | Hex | Usage |
|------|-----|-------|
| Button Primary Bg | `#1C1C1E` | Main CTA (dark pill) |
| Button Primary Text | `#FFFFFF` | Text on dark button |
| Button Secondary Bg | `#FFFFFF` | Outline button fill |
| Button Secondary Border | `#1C1C1E` | Outline button border |
| Button Secondary Text | `#1C1C1E` | Outline button text |

### Borders & Dividers
| Name | Hex | Usage |
|------|-----|-------|
| Border Default | `#DDDDE8` | Input borders, dividers |
| Border Focus | `#6B6BCC` | Input focus ring |
| Border Strong | `#C4C4D4` | Card borders if needed |

### Shadows
| Name | Value | Usage |
|------|-------|-------|
| Shadow Soft | `0 2px 12px rgba(0,0,0,0.06)` | Cards |
| Shadow Medium | `0 4px 24px rgba(0,0,0,0.10)` | Modals, dropdowns |
| Shadow Amber | `0 8px 32px rgba(201,125,58,0.18)` | Amber CTA glow |

### Status Colors
| Name | Hex | Usage |
|------|-----|-------|
| Success | `#2E9E6B` | Success states |
| Warning | `#E8A857` | Warnings (reuse amber) |
| Error | `#D94F4F` | Error messages |
| Info | `#6B6BCC` | Info (reuse accent) |

---

## 🖌️ Ready-to-Use CSS Variables

```css
:root {
  /* Backgrounds */
  --bg-primary: #F0EFF8;
  --bg-secondary: #E8E8F5;
  --surface: #FFFFFF;
  --surface-hover: #F7F7FC;

  /* Amber Gradient */
  --amber-light: #F2B866;
  --amber-mid: #E8A857;
  --amber-dark: #C97D3A;
  --amber-glow: rgba(232, 168, 87, 0.25);

  /* Text */
  --text-primary: #1A1A1A;
  --text-secondary: #4A4A4A;
  --text-muted: #8A8A9A;
  --text-inverted: #FFFFFF;

  /* Accent */
  --accent: #6B6BCC;
  --accent-hover: #5555BB;
  --accent-light: #EEEEF9;
  --accent-muted: rgba(107, 107, 204, 0.15);

  /* Buttons */
  --btn-primary-bg: #1C1C1E;
  --btn-primary-text: #FFFFFF;
  --btn-secondary-bg: #FFFFFF;
  --btn-secondary-border: #1C1C1E;

  /* Borders */
  --border: #DDDDE8;
  --border-focus: #6B6BCC;
  --border-strong: #C4C4D4;

  /* Shadows */
  --shadow-soft: 0 2px 12px rgba(0, 0, 0, 0.06);
  --shadow-medium: 0 4px 24px rgba(0, 0, 0, 0.10);
  --shadow-amber: 0 8px 32px rgba(201, 125, 58, 0.18);

  /* Status */
  --success: #2E9E6B;
  --error: #D94F4F;

  /* Gradients */
  --gradient-amber: linear-gradient(135deg, #F2B866, #C97D3A);
  --gradient-bg: linear-gradient(160deg, #F0EFF8, #E8E8F5);
  --gradient-blob: radial-gradient(ellipse at top, #E8A857 0%, transparent 70%);

  /* Spacing & Shape */
  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 16px;
  --radius-pill: 999px;
}
```