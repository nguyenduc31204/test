import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Auth/Login'
import Products from './pages/admin/Product/Products'
import Categories from './pages/admin/Category/Categories'
import Orders from './pages/admin/Order/Orders'
import Reports from './pages/admin/Reports'
import Settings from './pages/admin/User/Settings'
import Logout from './pages/admin/Logout'
import Users from './pages/admin/User/Users'
import AddOrder from './pages/admin/Order/AddOder'
import Home from './pages/admin/Dashboard/Home'

const Root = () => {
  const isAuthenticated = !!localStorage.getItem('access_token')

  return isAuthenticated ? (
    <Navigate to="/dashboard" />
  ) : (
    <Navigate to="/login" />
  )
}


const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Root/>} />
        <Route path='/dashboard' element={<Home/>} />
        <Route path="/login" element={<Login/>} />
        <Route path="/products" element={<Products/>} />
        <Route path="/categories" element={<Categories/>} />
        <Route path="/orders" element={<Orders/>} />
        <Route path="/users" element={<Users/>} />
        <Route path="/reports" element={<Reports/>} />
        <Route path="/settings" element={<Settings/>} />
        <Route path="/logout" element={<Logout/>} />
        <Route path="/addorder" element={<AddOrder/>} />
      </Routes>
    </div>
  )
}

export default App
