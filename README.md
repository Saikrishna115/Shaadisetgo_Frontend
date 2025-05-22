# ShaadiSetGo Frontend

Frontend application for the ShaadiSetGo wedding services platform.

## Project Structure

```
shaadisetgo-frontend/
│
├── public/
│   └── index.html
│
├── src/
│   ├── assets/                # Static assets
│   ├── components/            # Reusable UI components
│   ├── layouts/               # Shared layout components
│   ├── pages/                 # Route-specific pages
│   ├── context/               # Context API files
│   ├── hooks/                 # Custom React hooks
│   ├── services/              # API handlers
│   ├── routes/                # Route definitions
│   ├── styles/                # Global styles
│   ├── utils/                 # Helper functions
│   ├── App.jsx               
│   └── main.jsx              
│
├── .env
├── .gitignore
├── package.json
└── README.md
```

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create a .env file in the root directory:
   ```
   VITE_API_URL=http://localhost:5000/api
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. For production build:
   ```bash
   npm run build
   ```

## Available Scripts

- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm run preview`: Preview production build
- `npm run lint`: Run ESLint
- `npm run format`: Format code with Prettier

## Features

- React 18 with Vite for fast development
- React Router v6 for routing
- Redux Toolkit for state management
- Tailwind CSS for styling
- React Query for API data fetching
- React Hook Form for form handling
- React Hot Toast for notifications
- Axios for API requests
- Protected routes with authentication

## Environment Variables

- `VITE_API_URL`: Backend API URL

## Contributing

1. Create a new branch for your feature
2. Make your changes
3. Submit a pull request

## License

This project is private and confidential. 