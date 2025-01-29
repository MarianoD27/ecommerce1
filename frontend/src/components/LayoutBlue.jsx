import { Outlet } from "react-router-dom";

const LayoutBlue = () => {
  return (
    <section className='m-8 p-8 mx-auto bg-blue-900 w-[80%] rounded-xl min-h-[410px]'>
      <Outlet />
    </section>
  )
}

export default LayoutBlue