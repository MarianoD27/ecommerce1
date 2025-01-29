/* eslint-disable no-unused-vars */
import React from 'react'
import { Link } from 'react-router-dom'
import useAppContext from '../hooks/useAppContext'
import LogoutBtn from './miscelaneous/LogoutBtn'

const LinkPage = () => {

  const { auth } = useAppContext()



  return (
    <>
      <div className='flex flex-col items-center justify-between'>
        <h1>WELCUM</h1>
        {!auth.accessToken ?
          (<><Link to="/login"><button className='bg-blue-700 hover:bg-blue-600 active:bg-blue-500 border transition p-2 px-40 mt-4 rounded-lg'>Log In</button></Link>
            <Link to="/register"><button className='bg-blue-700 hover:bg-blue-600 active:bg-blue-500 border transition p-2 px-40 mt-4 rounded-lg'>Sign In</button></Link> </>)
          : <LogoutBtn />}
      </div>
      <div className='flex flex-col items-center mt-8'>
        <h1 className='mb-4'>LINKS</h1>
        <div className='flex flex-col font-semibold underline'>
          <Link to='/'>Home</Link>
          <Link to='/admin'>Admins</Link>
          <Link to='/editor'>Editors</Link>
          <Link to='/lounge'>Lounge</Link>
        </div>
      </div>
    </>
  )
}

export default LinkPage