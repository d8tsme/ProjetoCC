# Monochrome Theme & Layout Guide

This project now uses a monochrome (black/white/grayscale) design system and a fixed left navigation that matches the requested style.

## Key changes
- Universal font: Poppins (imported in `src/index.css`).
- Global color tokens (defined in `src/index.css`):
  - `--black`, `--black-700`, `--black-600`
  - `--gray-200`, `--gray-300`, `--white`
  - Aliases: `--color1`, `--color2`, `--color3`, `--color4`, `--color5` map to grayscale values to keep compatibility.
- Fixed left sidebar (`.sidebar`), with a `--sidebar-width` token (default 320px). Sidebar is a fixed left rounded column.
- The primary visual area is `.main-content` with a margin-left which takes into account the sidebar width.
- Buttons are subtle (outlined or muted), and primary buttons use an outline to avoid loud color accents.
- All components were updated to use monochrome styles: `Banner`, `Header`, `Button`, `Forms`, `Book cards`, etc.
- Login logo SVG updated to grayscale.

## How to run the project locally
1. From the project root folder, go to the website directory:

```powershell
cd Website\meu-site
```

2. Install dependencies (if needed):

```powershell
npm install
```

3. Start the development server:

```powershell
npm start
```

4. Open http://localhost:3000/ and navigate the app. The left navbar is a fixed element on larger screens.

## How to customize
- Spacing: adjust tokens `--space-xs`, `--space-sm`, `--space-md`, `--space-lg` in `src/index.css`.
- Sidebar width: `--sidebar-width` in `src/index.css`.
- Color tokens: adjust the `--black-700`, `--gray-300`, and alias tokens to fine tune contrast.

## Notes
- Some legacy CSS still references old `--color*` variables; these are preserved as aliases for compatibility.
- If you want the Login page to keep a filled CTA, adjust `Login.css` `.btn.primary` accordingly.

If you want further fine-grained adjustments (roundedness, exact pixel-perfect spacing to the mock), I can continue and make the sizes match the attached mock precisely. :rocket:
