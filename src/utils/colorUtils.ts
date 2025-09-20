/**
 * Calculates whether a color is dark or light
 * @param color - CSS color string (hex, rgb, rgba, hsl, hsla, or named color)
 * @returns true if the color is dark, false if light
 */
export const isDarkColor = (color: string): boolean => {
  // Handle rgba, rgb, hsla, hsl formats
  const rgbaMatch = color.match(/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*([\d.]+)\s*)?\)/);
  if (rgbaMatch) {
    const r = parseInt(rgbaMatch[1]);
    const g = parseInt(rgbaMatch[2]);
    const b = parseInt(rgbaMatch[3]);
    const a = rgbaMatch[4] ? parseFloat(rgbaMatch[4]) : 1;
    
    // If alpha is 0 or very low, consider it light (transparent)
    if (a < 0.1) return false;
    
    // Calculate luminance
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance < 0.5;
  }
  
  // Handle hex colors
  const hexMatch = color.match(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/);
  if (hexMatch) {
    const hex = hexMatch[1];
    let r, g, b;
    
    if (hex.length === 3) {
      r = parseInt(hex[0] + hex[0], 16);
      g = parseInt(hex[1] + hex[1], 16);
      b = parseInt(hex[2] + hex[2], 16);
    } else {
      r = parseInt(hex.substring(0, 2), 16);
      g = parseInt(hex.substring(2, 4), 16);
      b = parseInt(hex.substring(4, 6), 16);
    }
    
    // Calculate luminance
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance < 0.5;
  }
  
  // Handle hsl colors
  const hslMatch = color.match(/hsla?\(\s*(\d+)\s*,\s*(\d+)%\s*,\s*(\d+)%\s*(?:,\s*([\d.]+)\s*)?\)/);
  if (hslMatch) {
    const l = parseInt(hslMatch[3]);
    const a = hslMatch[4] ? parseFloat(hslMatch[4]) : 1;
    
    // If alpha is 0 or very low, consider it light (transparent)
    if (a < 0.1) return false;
    
    return l < 50;
  }
  
  // Default fallback - assume it's dark
  return true;
};

/**
 * Returns appropriate text color (white or black) based on background color
 * @param backgroundColor - CSS background color string
 * @returns 'text-white' or 'text-black' class name
 */
export const getTextColorClass = (backgroundColor: string): string => {
  // For transparent or very transparent backgrounds, use white text
  if (backgroundColor.includes('transparent') || backgroundColor.includes('rgba') && backgroundColor.endsWith(', 0)')) {
    return 'text-white';
  }
  
  return isDarkColor(backgroundColor) ? 'text-white' : 'text-black';
};

/**
 * Returns appropriate text color value based on background color
 * @param backgroundColor - CSS background color string
 * @returns 'white' or 'black'
 */
export const getTextColor = (backgroundColor: string): string => {
  // For transparent or very transparent backgrounds, use white text
  if (backgroundColor.includes('transparent') || backgroundColor.includes('rgba') && backgroundColor.endsWith(', 0)')) {
    return 'white';
  }
  
  return isDarkColor(backgroundColor) ? 'white' : 'black';
};