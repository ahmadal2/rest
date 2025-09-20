# Restaurant Video Intro Component

This document explains the implementation of the restaurant video intro component that serves as a loading page.

## Component Overview

The `RestaurantVideoIntro` component is a visually appealing intro animation that plays when the application loads. It features a sequence of food emojis with animated transitions and text descriptions.

## Features

1. **Animated Food Scenes**:
   - Pizza emoji with "Frisch gebacken" text
   - Fries emoji with "Knusprig frittiert" text
   - Burger emoji with "Perfekt gegrillt" text
   - Plate emoji with "Liebevoll serviert" text
   - Final welcome scene with "Willkommen bei DeliciousHub"

2. **Custom Animations**:
   - Slide in from left, right, and bottom
   - Zoom in animation
   - Fade in animation
   - Bouncing particles around food items
   - Animated background elements

3. **Progress Indicator**:
   - Dot-based progress indicator at the bottom
   - Active dots highlighted with white color
   - Inactive dots shown with reduced opacity

4. **Automatic Transition**:
   - After the final scene completes, automatically transitions to the main app
   - Smooth fade-out animation before transition
   - Skip intro button for manual transition

## Technical Implementation

### State Management
- `currentScene`: Tracks the current animation scene (0-4)
- `showText`: Controls text fade-in timing
- `fadeOut`: Triggers the final fade-out transition

### Animation Timing
- Each food scene lasts 2.5 seconds
- Final welcome scene lasts 3 seconds
- Text appears 0.5 seconds after scene starts
- 1-second fade-out transition at the end
- Automatic transition to main app after fade-out

### Custom CSS Animations
- Slide in from left with rotation and scaling
- Slide in from right with rotation and scaling
- Slide up with 3D rotation effect
- Zoom in with rotation
- Fade in with scaling

## Integration with App

The intro component is integrated into the main App component:
1. A new `showIntro` state controls whether to display the intro
2. When `showIntro` is true, the intro component is rendered
3. A "Skip Intro" button allows users to bypass the animation
4. After the intro completes, it automatically transitions to the main app
5. The `onIntroComplete` callback handles the transition to the main app

## Files Created/Modified

1. `src/components/RestaurantVideoIntro.tsx` - Main intro component
2. `src/docs/intro-component.md` - This documentation file
3. `src/App.tsx` - Integrated intro component (with existing import errors not related to our changes)

## Styling

The component uses:
- Warm gradient backgrounds (orange, red, pink)
- White text with drop shadows for readability
- Animated particles for visual interest
- Responsive design for all screen sizes
- Smooth transitions between scenes

## Customization

To customize the intro:
1. Modify the `scenes` array to change content
2. Adjust animation durations in the scene objects
3. Update emoji characters and text descriptions
4. Modify color schemes in the background divs
5. Adjust animation parameters in the CSS keyframes