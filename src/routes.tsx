import Layout from './components/Layout'
import RootAuth from './components/RootAuth'
import Error404 from './pages/Error404'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import RecoverPassword from './pages/auth/RecoverPassword'
import RecoveryStep2 from './pages/auth/RecoveryStep2'
import ProductList from './pages/ProductList'
import GeneralSettings from './pages/settings/GeneralSettings'
import PDFSettings from './pages/settings/PDFSettings'
import EmailSettings from './pages/settings/EmailSettings'
import CompanySelection from './pages/settings/CompanySelection'
import ProtectedRoute from './components/ProtectedRoute'
import Dashboard from './pages/Dashboard'
import ProfileSettings from './pages/settings/ProfileSettings'
import Category from './pages/Category'

export const routes = [
  {
    path: '/',
    element: <Layout />,
    errorElement: <Error404 />,
    children: [
      { path: '/', element: <Dashboard />, protected: true },
      { path: '/products', element: <ProductList />, protected: true },
      { path: '/categories', element: <Category />, protected: true },
    ]
  },
  {
    path: '/settings',
    element: <Layout />,
    errorElement: <Error404 />,
    children: [
      { path: 'general', element: <GeneralSettings />, protected: true },
      { path: 'pdf', element: <PDFSettings />, protected: true },
      { path: 'email', element: <EmailSettings />, protected: true },
      { path: 'company', element: <CompanySelection />, protected: true },
      { path: 'profile', element: <ProfileSettings />, protected: true },
    ]
  },
  {
    path: '/',
    element: <RootAuth />,
    errorElement: <Error404 />,
    children: [
      { path: '/login', element: <Login />, protected: false },
      { path: '/register', element: <Register />, protected: false },
      { path: '/recover-password', element: <RecoverPassword />, protected: false },
      { path: '/recover-password/step2', element: <RecoveryStep2 />, protected: false },
    ]
  }
]

export const protectedRoutes = routes.map(route => {
  if (route.children) {
    route.children = route.children.map(child => {
      if (child.protected) {
        return {
          ...child,
          element: <ProtectedRoute element={child.element} path={child.path} />,
        }
      }
      return child
    })
  }
  return route
})
