import './index.css'
import { Routes, Route } from 'react-router-dom'
import RequireAuth from './components/RequireAuth'
import PersistLogin from './components/PersistLogin'

const ROLES = { 'User': 2001, 'Editor': 1984, 'Admin': 5150 }

//routes
import Layout from './components/Layout'
import LayoutBlue from './components/LayoutBlue'
import Register from './components/Register'
import Login from './components/Login'
import Linkpage from './components/LinkPage'
import Unauthorized from './components/Unauthorized'
//protected
import Home from './components/Home'
import Editor from './components/Editor'
import Admin from './components/Admin'
import Lounge from './components/Lounge'
//404
import Missing from './components/Missing'
import AddProduct from './components/AddProduct'
import StoreFront from './components/StoreFront'
import SingleItemCard from './components/material-tailwind/SingleItemCard'

import { ToastContainer } from 'react-toastify';
import Orders from './components/Orders'

function App() {

  return (
    <>
      <ToastContainer />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="/" element={<LayoutBlue />}>
            {/* free routes */}
            <Route path='register' element={<Register />} />
            <Route path='login' element={<Login />} />
            <Route path='linkpage' element={<Linkpage />} />
            <Route path='unauthorized' element={<Unauthorized />} />
            {/* protected Routes */}
            <Route element={<PersistLogin />}>
              <Route element={<RequireAuth allowedRoles={[ROLES.User]} />}>
                <Route path="/" element={<Home />} />
              </Route>
              <Route element={<RequireAuth allowedRoles={[ROLES.Editor]} />}>
                <Route path="editor" element={<Editor />} />
              </Route>
              <Route element={<RequireAuth allowedRoles={[ROLES.Admin]} />}>
                <Route path="admin" element={<Admin />} />
              </Route>
            </Route>
            {/* catch all */}
            <Route path="*" element={<Missing />} />
          </Route>

          <Route element={<PersistLogin />}>
            <Route element={<RequireAuth allowedRoles={[ROLES.User]} />}>
              <Route path="storefront" element={<StoreFront />} />
              <Route path="products/:id" element={<SingleItemCard />} />
            </Route>
            <Route element={<RequireAuth allowedRoles={[ROLES.Editor, ROLES.Admin]} />}>
              <Route path="addproduct" element={<AddProduct />} />
              <Route path="lounge" element={<Lounge />} />
              <Route path="admin/api/orders" element={<Orders />} />

            </Route>
          </Route>

        </Route>
      </Routes>
    </>
  )
}

export default App
