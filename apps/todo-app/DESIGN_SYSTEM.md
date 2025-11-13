# Design System

This project uses a comprehensive design system that provides consistent styling and theming across all components.

## Architecture

The design system consists of two main parts:

### 1. CSS Variables (`src/styles/app.css`)

- **Tailwind v4** with `@theme inline` configuration
- **HSL color values** for better browser compatibility
- **CSS custom properties** for dynamic theming
- **Plugin-based animations** with `@plugin "tailwindcss-animate"`

### 2. TypeScript Tokens (`src/design-system.ts`)

- **Type-safe design tokens** for use in components
- **Consistent spacing scale** (8px, 16px, 24px, 32px, 48px, 64px)
- **Typography system** with system fonts
- **Color palette** with semantic naming

## Color Palette

### Primary Colors

- **Background**: `#FFFFFF` (pure white)
- **Surface**: `#FAFBFC` (light gray)
- **Border**: `#E5E7EB` (medium gray)

### Text Hierarchy

- **Primary**: `#111827` (dark gray)
- **Secondary**: `#6B7280` (medium gray)
- **Tertiary**: `#9CA3AF` (light gray)

### Accent Color

- **Primary**: `#0066CC` (blue)
- **Hover**: `#0052A3` (darker blue)

## Usage Examples

### Using Design Tokens in Components

```tsx
import { colors, typography, spacing, radius } from "@/design-system";

function MyComponent() {
  return (
    <div
      style={{
        padding: spacing.lg,
        backgroundColor: colors.surface,
        borderRadius: radius.md,
        fontFamily: typography.fontFamily,
        color: colors.text.primary,
      }}
    >
      <h2
        style={{
          fontSize: typography.size.xl,
          fontWeight: typography.weight.semibold,
          color: colors.accent.primary,
        }}
      >
        Title
      </h2>
    </div>
  );
}
```

### Using Tailwind Classes

```tsx
function MyComponent() {
  return (
    <div className="p-4 bg-surface rounded-md text-primary">
      <h2 className="text-xl font-semibold text-accent">Title</h2>
    </div>
  );
}
```

## Spacing Scale

- `xs`: 8px (0.5rem)
- `sm`: 16px (1rem)
- `md`: 24px (1.5rem)
- `lg`: 32px (2rem)
- `xl`: 48px (3rem)
- `xxl`: 64px (4rem)

## Typography

### Font Family

```css
font-family:
  -apple-system, BlinkMacSystemFont, "SF Pro Display", "Inter", sans-serif;
```

### Font Sizes

- `xs`: 14px (0.875rem)
- `sm`: 16px (1rem)
- `md`: 18px (1.125rem)
- `lg`: 24px (1.5rem)
- `xl`: 32px (2rem)

### Font Weights

- `normal`: 400
- `medium`: 500
- `semibold`: 600

## Border Radius

- `sm`: 6px (0.375rem)
- `md`: 8px (0.5rem)
- `lg`: 12px (0.75rem)

## Shadows

- `sm`: Subtle shadow for cards
- `md`: Medium shadow for elevated elements
- `lg`: Large shadow for modals/popovers

## Best Practices

1. **Use design tokens** instead of hardcoded values
2. **Prefer Tailwind classes** for simple styling
3. **Use TypeScript tokens** for complex component logic
4. **Maintain consistent spacing** using the scale
5. **Follow the color hierarchy** for text and backgrounds
6. **Use semantic color names** (primary, secondary, accent) over hex values

## Component Integration

All shadcn/ui components are automatically themed using the CSS variables. The design system ensures:

- ✅ Consistent button styles
- ✅ Proper form field theming
- ✅ Card and layout consistency
- ✅ Accessible color contrast
- ✅ Responsive design patterns

## Customization

To customize the design system:

1. **Colors**: Update CSS variables in `src/styles/app.css`
2. **Spacing**: Modify values in `src/design-system.ts`
3. **Typography**: Adjust font settings in both files
4. **Components**: Use the design tokens in your component styles

The design system provides a solid foundation while remaining flexible for customization.
