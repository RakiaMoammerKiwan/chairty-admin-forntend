# Bilingual Starter

Tired of setting up internationalization (i18n) and Right-To-Left (RTL) text support every time you start a new React project? This starter template has you covered.

**Bilingual Starter** is a clean, modern template designed to help you build bilingual (or multilingual) React applications quickly. It comes pre-configured with English and Arabic support, automatic RTL/LTR switching, and a professional look using Tailwind CSS v4.

**[Live Demo](https://bidi-starter.vercel.app/)**

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

---

# القالب ثنائي اللغة

هل سئمت من إعداد التدويل (i18n) ودعم النصوص من اليمين إلى اليسار (RTL) في كل مرة تبدأ فيها مشروع React جديد؟ هذا القالب جاهز لتلبية احتياجاتك.

**القالب ثنائي اللغة** هو قالب نظيف وحديث مصمم لمساعدتك في بناء تطبيقات React ثنائية اللغة (أو متعددة اللغات) بسرعة. يأتي مُعدًا مسبقًا لدعم اللغتين الإنجليزية والعربية، مع التبديل التلقائي بين النصوص من اليمين إلى اليسار (RTL) ومن اليسار إلى اليمين (LTR)، ومظهر احترافي باستخدام Tailwind CSS v4.

**[عرض مباشر](https://bidi-starter.vercel.app/)**

## الميزات

- **تطوير سريع:** مبني باستخدام Vite وReact وTypeScript.
- **تصميم حديث:** يستخدم Tailwind CSS v4 (مُعد عبر `@theme` في `index.css`).
- **جاهز للتدويل:** إعداد `react-i18next` مع ملفات JSON للغتين الإنجليزية والعربية.
- **تبديل تلقائي للاتجاه:** يتغير بين LTR وRTL بناءً على اللغة المختارة.
- **توجيه محلي:** يستخدم التوجيه المستند إلى عناوين URL (مثل `/en/about` و`/ar/about`).
- **خط جميل:** مُعد مسبقًا باستخدام خط "Cairo" من Google Fonts.
- **هيكل أساسي:** يتضمن تخطيطًا، شريط تنقل، صفحة رئيسية، وصفحة "حول" تعرض محتوى Markdown (`public/README.md`).
- **دعم Yarn:** يستخدم Yarn لإدارة الحزم.

## كيفية البدء 🚀

اتبع هذه الخطوات للبدء:

1. **استنساخ المستودع:**

```bash
git clone https://github.com/YounesElhjouji/react-vite-bidi-starter.git bilingual-starter
cd bilingual-starter
```

2. **تثبيت التبعيات:**

```bash
yarn install
```

3. **تشغيل خادم التطوير:**

```bash
yarn dev
```

يجب أن يعمل مشروعك الآن على `http://localhost:5173` (أو المنفذ المتاح التالي).

## كيف يعمل

- **اللغات:** أضف/حرر ملفات JSON الخاصة باللغات في `src/i18n`. يقوم ملف `i18n.ts` بتهيئة كل شيء. استخدم الخطاف `useTranslation` في مكوناتك.
- **التوجيه:** يتم تعريف المسارات في `src/App.tsx`. يتعامل المعامل `/:locale` مع اللغة في عنوان URL. يلتف مكون `Layout` حول الصفحات.
- **التصميم:** يتم إعداد Tailwind v4 في `src/index.css` باستخدام `@theme` لتعريف الخطوط المخصصة (`--font-cairo`) والألوان (`--color-beige`). قم بتطبيق فئات الأدوات مباشرة في مكوناتك (مثل `bg-beige` أو `font-cairo`).
- **RTL/LTR:** يتحقق مكون `Layout` من اللغة الحالية (`i18n.language`) ويضبط الخاصية `document.documentElement.dir` إلى `'rtl'` أو `'ltr'` تلقائيًا.

## هيكل المجلدات

```
/public
README.md # محتوى صفحة "حول"
/src
    /components # واجهة مستخدم قابلة لإعادة الاستخدام (شريط التنقل، التخطيط)
    /i18n # ملفات اللغات والإعدادات
    /pages # مكونات المسارات (الرئيسية، حول)
    App.tsx # إعداد التوجيه الرئيسي
    main.tsx # نقطة دخول التطبيق واستيراد التنسيقات
    index.css # إعداد Tailwind وتعريفات التصميم المخصصة وتنسيق Markdown
```

## التخصيص

- **إضافة لغات:** أنشئ ملف `xx.json` جديدًا في `src/i18n`، وقم باستيراده، وأضفه إلى `resources` في `src/i18n/i18n.ts`. قم بتحديث منطق مبدل اللغة إذا لزم الأمر.
- **تغيير الأنماط:** قم بتعديل الألوان والخطوط وما إلى ذلك في كتلة `@theme` داخل `src/index.css`.
- **تعديل المسارات:** قم بتحرير `src/App.tsx`.
- **تحديث صفحة "حول":** قم بتحرير ملف `public/README.md`.

## الرخصة

هذا المشروع مرخص بموجب رخصة MIT.
