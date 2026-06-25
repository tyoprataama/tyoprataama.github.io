import { createBrowserRouter, Navigate } from 'react-router-dom'
import RootLayout from './layouts/RootLayout.jsx'
import Home from './pages/Home.jsx'
import BlogList from './pages/BlogList.jsx'
import Article from './pages/Article.jsx'
import Admin from './pages/Admin.jsx'
import NotFound from './pages/NotFound.jsx'
import { AuthProvider } from './context/AuthContext.jsx'

// import.meta.env.BASE_URL comes from `base` in vite.config.js (e.g. "/portfolio/").
// React Router strips the trailing slash for its basename automatically.
const basename = import.meta.env.BASE_URL

export const router = createBrowserRouter(
  [
    {
      element: (
        <AuthProvider>
          <RootLayout />
        </AuthProvider>
      ),
      children: [
        { index: true, element: <Home /> },
        { path: 'blog', element: <BlogList /> },
        { path: 'blog/:slug', element: <Article /> },
        { path: 'admin', element: <Admin /> },
        { path: '404', element: <NotFound /> },
        { path: '*', element: <Navigate to="/404" replace /> },
      ],
    },
  ],
  { basename },
)
