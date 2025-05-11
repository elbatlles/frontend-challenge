# Document Management Challenge

## 🧠 Reasoning & Ideas

The goal of this challenge was to create a lightweight document management UI using only native Web APIs, TypeScript, and Tailwind CSS, without frameworks like React. The key design decisions and architectural principles followed were:

- **Unidirectional data flow** using a central `DocumentStore` to manage application state.
- **Decoupled components**: Components like `<document-list>` and `<document-counter>` are passive. They render based on data and expose methods for updating the view.
- **Minimal DOM manipulation**: State changes trigger render methods, avoiding direct DOM mutations across components.
- **Tailwind CSS**: Extracted and applied utility classes to local CSS files via `@apply` for maintainability.
- **Event-driven** updates via a custom `subscribe()` implementation in the store.
- **Snapshot comparison** in `main.ts` to avoid unnecessary re-renders.

## 🚀 How to Run the Project

### 1. Install dependencies

Make sure you have Node.js installed. Then run:

```bash
npm install
```

### 2. Set up environment variables

Copy the example environment file and update the values:

```bash
cp .env.example .env
```

### 3. Start the development server

```bash
npm run dev
```

This will open the app in your browser (usually at http://localhost:5173).

## 🧪 How to Run the Tests

```bash
npm run test
```

Tests are written using [Vitest](https://vitest.dev) and [@testing-library/dom](https://testing-library.com/docs/dom-testing-library/intro/).

### Notes:

- Tests mock `documentStore` and call component methods like `renderList()` directly.
- State is reset between tests to avoid side effects.

## 📁 Project Structure

```
src/
├── components/
│   ├── DocumentList/
│   │   ├── DocumentList.ts
│   │   └── document-list.css
│   ├── DocumentCounter/
│   │   └── DocumentCounter.ts
├── stores/
│   └── DocumentStore.ts
├── types/
│   └── index.ts
├── main.ts
└── index.css
```

## ✅ Features Implemented

- Document listing in grid or list view
- Sorting by Title, Version or CreatedAt
- Adding new documents via form
- Notification counter for documents received via WebSocket

## 🏁 Optional Enhancements Considered

- Tailwind CSS-based styling with class extraction
