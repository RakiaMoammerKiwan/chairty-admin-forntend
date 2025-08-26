# Bilingual Starter

Tired of setting up internationalization (i18n) and Right-To-Left (RTL) text support every time you start a new React project? This starter template has you covered.

**Bilingual Starter** is a clean, modern template designed to help you build bilingual (or multilingual) React applications quickly. It comes pre-configured with English and Arabic support, automatic RTL/LTR switching, and a professional look using Tailwind CSS v4.

## Features

- **Fast Development:** Built with Vite, React, and TypeScript.
- **Modern Styling:** Uses Tailwind CSS v4 (configured via `@theme` in `index.css`).
- **i18n Ready:** `react-i18next` setup with English & Arabic JSON files.
- **Automatic Bidi:** Switches between LTR and RTL based on the selected language.
- **Locale Routing:** Uses URL-based locales (e.g., `/en/about`, `/ar/about`).
- **Nice Typography:** Pre-configured with the Cairo font via Google Fonts.
- **Basic Structure:** Includes a Layout, Navbar, Home page, and an About page that renders Markdown (`public/README.md`).
- **Yarn Support:** Uses Yarn for package management.

## Getting Started 🚀

Follow these steps to get started:

1. **Clone the repo:**

   ```bash
   git clone https://github.com/YounesElhjouji/react-vite-bidi-starter.git bilingual-starter
   cd bilingual-starter
   ```

2. **Install dependencies:**

   ```bash
   yarn install
   ```

3. **Run the dev server:**

   ```bash
   yarn dev
   ```

   Your project should now be running at `http://localhost:5173` (or the next available port).

## How It Works

- **Languages:** Add/edit language JSON files in `src/i18n`. The `i18n.ts` file initializes everything. Use the `useTranslation` hook in your components.
- **Routing:** Routes are defined in `src/App.tsx`. The `/:locale` parameter handles the language in the URL. The `Layout` component wraps pages.
- **Styling:** Tailwind v4 is configured in `src/index.css` using `@theme` for custom fonts (`--font-cairo`) and colors (`--color-beige`). Apply utility classes directly in your components (like `bg-beige` or `font-cairo`).
- **RTL/LTR:** The `Layout` component checks the current language (`i18n.language`) and sets `document.documentElement.dir` to `'rtl'` or `'ltr'` automatically.

## Folder Structure

```
/public
README.md # Content for the About page
/src
/components # Reusable UI (Navbar, Layout)
/i18n # Language files (en.json, ar.json) & config (i18n.ts)
/pages # Route components (Home, About)
App.tsx # Main routing setup
main.tsx # App entry point, CSS/i18n imports
index.css # Tailwind v4 setup, custom @theme definitions, and markdown styling
```

## Customization

- **Add Languages:** Create a new `xx.json` file in `src/i18n`, import it, and add it to the `resources` in `src/i18n/i18n.ts`. Update the language switcher logic if needed.
- **Change Styles:** Modify colors, fonts, etc., in the `@theme` block within `src/index.css`.
- **Modify Routes:** Edit `src/App.tsx`.
- **Update About Page:** Edit the `public/README.md` file.

## License

This project is licensed under the MIT License.
