import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./material-tailwind/Footer";

const Layout = () => {

  return (
    <main className="w-full min-h-screen bg-gradient-to-br from-black to-deep-purple-900 text-white relative">
      <Navbar />
      <Outlet />
      <Footer />
    </main>
  )
}

export default Layout