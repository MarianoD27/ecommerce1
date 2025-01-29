import { Link } from "react-router-dom"
import useAppContext from "../hooks/useAppContext"
import MegaMenuWithHover from "./material-tailwind/MegaMenuWithHover"


const Navbar = () => {
  const { username } = useAppContext()

  return (
    <div className='w-full bg-indigo-600'>
      <div className='w-full mx-auto justify-between items-center flex text-purple-950 '>
        {/* <Link to='/'><h1>MD&apos;s Registration</h1></Link>
        {username ? <h2>{username}</h2> : null}
        <Link to='/addproduct'><h2>Add Product</h2></Link> */}
        <MegaMenuWithHover />
      </div>
    </div >
  )
}

export default Navbar