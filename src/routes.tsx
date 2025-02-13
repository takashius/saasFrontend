import Layout from './components/Layout'
import RootAuth from './components/RootAuth'
import Error404 from './pages/Error404'
import Home from './pages/Home'
import Users from './pages/Users'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import RecoverPassword from './pages/auth/RecoverPassword'
import RecoveryStep2 from './pages/auth/RecoveryStep2'
import QuotationDetails from './pages/QuotationDetails'
import ClientList from './pages/ClientList'
import ProductList from './pages/ProductList'
import ClientDetail from './pages/ClientDetail'
import GeneralSettings from './pages/settings/GeneralSettings'
import PDFSettings from './pages/settings/PDFSettings'
import EmailSettings from './pages/settings/EmailSettings'
import CompanySelection from './pages/settings/CompanySelection'
import ProtectedRoute from './components/ProtectedRoute'

export const routes = [
  {
    path: '/',
    element: <Layout />,
    errorElement: <Error404 />,
    children: [
      { path: '/', element: <Home />, protected: true },
      { path: '/users', element: <Users />, protected: true },
      { path: '/quotation/:id', element: <QuotationDetails />, protected: true },
      { path: '/clients', element: <ClientList />, protected: true },
      { path: '/client/:id', element: <ClientDetail />, protected: true },
      { path: '/products', element: <ProductList />, protected: true },
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
