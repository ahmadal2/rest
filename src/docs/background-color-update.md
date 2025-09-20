# Background Color Update

This document explains the changes made to update the background color for the entire site.

## Changes Made

### 1. Updated CSS Variables (`src/index.css`)

Updated the following CSS variables to use the new gradient:
```css
--color-background: linear-gradient(135deg, #fff7f0, #ff9f4d);
--color-modern-background: linear-gradient(135deg, #fff7f0, #ff9f4d);
```

### 2. Updated Site Settings (`src/App.tsx`)

Updated the background property in the site settings:
```typescript
background: 'linear-gradient(135deg, #fff7f0, #ff9f4d)'
```

### 3. Updated JSX Background (`src/App.tsx`)

Updated the background in the JSX to use the requested gradient:
```jsx
<div className="fixed inset-0 -z-10" style={{ background: 'linear-gradient(135deg, #fff7f0, #ff9f4d)' }}>
```

## Color Details

The new background uses a warm gradient that transitions from:
- `#fff7f0` (a very light peach/orange) to
- `#ff9f4d` (a vibrant orange)

This creates a welcoming, warm atmosphere that's perfect for a restaurant website.

## Implementation Notes

1. The gradient is applied both through CSS variables and directly in the JSX to ensure consistency
2. The decorative elements and patterns are kept but with slightly increased opacity to work better with the new background
3. All components will automatically use the new background through the CSS variables

## Testing

The background has been tested to ensure:
- ✅ The gradient appears correctly across all modern browsers
- ✅ Text remains readable with the new background
- ✅ All components are visible and properly contrasted
- ✅ The background is consistent across all pages

## Files Modified

1. `src/index.css` - Updated CSS variables
2. `src/App.tsx` - Updated site settings and JSX background
3. `src/docs/background-color-update.md` - This documentation file