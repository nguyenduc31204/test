import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Home from './pages/Dashboard/Home'
import Login from './pages/Auth/Login'
import Signup from './pages/Auth/Loout'
import Products from './pages/Products'
import Categories from './pages/Categories'
import Orders from './pages/Orders'
import Reports from './pages/Reports'
import Settings from './pages/Settings'
import Logout from './pages/Logout'
import Users from './pages/Users'
import AddOrder from './pages/AddOder'


const App = () => {
  return (
    <div>
      <Routes>
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
