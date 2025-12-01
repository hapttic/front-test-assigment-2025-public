# Setup Instructions

## Prerequisites
- Node.js (v18 or higher recommended)
- npm or yarn

## Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser to the URL shown in the terminal (typically http://localhost:5173)

## Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint for code quality checks

## Project Structure

```
├── public/              # Static assets
│   └── data.json       # Campaign metrics data
├── src/                # Source code
│   ├── components/     # React components (to be created)
│   ├── utils/          # Utility functions (to be created)
│   ├── types.ts        # TypeScript type definitions
│   ├── App.tsx         # Root component
│   ├── main.tsx        # Application entry point
│   └── index.css       # Global styles with Tailwind
├── index.html          # HTML template
└── package.json        # Dependencies and scripts
```

## Tech Stack

- **React 18** - UI library
- **TypeScript** - Type safety (strict mode enabled)
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework

## Development Notes

- TypeScript strict mode is enabled for maximum type safety
- Tailwind CSS is configured for rapid UI development
- All timestamps in data.json are UTC-based
