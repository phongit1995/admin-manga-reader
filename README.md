# Manga Reader Admin Dashboard

A modern, feature-rich administrative dashboard for managing a manga reader social platform. Built with React, TypeScript, and Material UI.

![Admin Dashboard](https://i.imgur.com/example.png)

## Features

- **Modern UI** - Clean, responsive interface built with Material UI
- **Manga Management** - Upload, edit, and organize manga content
- **Chapter Management** - Manage individual chapters with image uploads
- **User Management** - View, edit, and moderate user accounts
- **Analytics Dashboard** - Track views, users, uploads, and engagement
- **Responsive Design** - Optimized for desktop and mobile devices

## Technology Stack

- **Frontend**: React 19, TypeScript
- **UI Framework**: Material UI 7
- **Routing**: React Router 7
- **State Management**: React Context API
- **Styling**: CSS-in-JS with Emotion
- **Build Tools**: Vite 6

## Getting Started

### Prerequisites

- Node.js 20.x or higher
- Yarn 1.22.x or npm 10.x

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/admin-manga-reader.git
cd admin-manga-reader
```

2. Install dependencies
```bash
yarn install
# or
npm install
```

3. Start the development server
```bash
yarn dev
# or
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## Project Structure

```
admin-manga-reader/
├── public/               # Static files
├── src/
│   ├── components/       # Reusable UI components
│   ├── layouts/          # Layout components
│   ├── pages/            # Page components
│   ├── routes/           # Routing configuration
│   ├── sections/         # Feature-specific components
│   ├── theme/            # Theme configuration
│   ├── utils/            # Utility functions
│   ├── App.tsx           # Main application component
│   └── main.tsx          # Entry point
├── .gitignore            # Git ignore file
├── index.html            # HTML template
├── package.json          # Project dependencies
├── tsconfig.json         # TypeScript configuration
└── vite.config.ts        # Vite configuration
```

## Key Features

### Dashboard Overview
- Statistics cards with key metrics
- Popular manga charts and tables
- Recent activities feed
- Quick action buttons

### Manga Management
- Comprehensive manga listing with search and filters
- Metadata editor for manga details
- Category and tag management
- Cover image uploads

### Chapter Management
- Chapter listing for each manga
- Bulk chapter uploads
- Page reordering and management
- Publishing controls

### User Management
- User listing with search and filters
- User profile editing
- Permission and role management
- Activity logs

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- Material UI for the component library
- Vite team for the build tooling
- All contributors and maintainers

---

Made with ❤️ by Phong Nguyen
