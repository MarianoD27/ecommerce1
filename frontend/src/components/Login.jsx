/* eslint-disable react/no-unescaped-entities */
import { useRef, useState, useEffect } from 'react'
// import { faCheck, faTimes, faInfoCircle } from '@fortawesome/free-solid-svg-icons'
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Link, useNavigate, useLocation } from 'react-router-dom';

// custom hook
import useAppContext from '../hooks/useAppContext';
import useInput from '../hooks/useInput';
import useToggle from '../hooks/useToggle';

import axios from '../api/axios';
const LOGIN_URL = '/api/auth'


const Login = () => {
  // context
  const { setAuth } = useAppContext()
  //location and redirection stuff
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/'
  //ref to put focus
  const userRef = useRef()
  const errRef = useRef()
  //states
  const [user, resetUser, userAtts] = useInput('user', '')
  const [pwd, setPwd] = useState('')
  const [errMsg, setErrMsg] = useState('')
  const [check, toggleCheck] = useToggle('persist', false)

  useEffect(() => {
    userRef.current.focus()
  }, [])

  useEffect(() => {
    setErrMsg('')
  }, [user, pwd])

  const handleSubmit = async (e) => {
    e.preventDefault(); //so page doesn't reload

    try {
      const response = await axios.post(LOGIN_URL,
        JSON.stringify({ user, password: pwd }), { headers: { 'Content-Type': 'application/json' }, withCredentials: true }
      )
      console.log(JSON.stringify(response?.data))
      const accessToken = await response?.data?.accessToken
      setAuth({ user, accessToken })
      // resetUser();
      resetUser(); setPwd('');
      navigate(from, { replace: true })
    } catch (err) {
      if (!err?.response) { setErrMsg('No Server Response') } else if (err.response?.status === 400) { setErrMsg('Missing Username or Password') } else if (err.response?.status === 401) { setErrMsg("Unauthorized") } else { setErrMsg('Login Failed') }
      errRef.current.focus()
    }
  }



  return (
    <div className='flex flex-col md:flex-row gap-0 md:gap-12'>

      <section className='md:w-[50%] md:gap-2 flex flex-col'>
        <h2 className='capitalize text-2xl font-semibold text-center'>Welcome to <br />'E-Commerce Title Placeholder'</h2>
        <img src="logohorse.png" alt="logo" className='md:w-full md:max-w-[400px] max-w-[300px] w-auto md:mt-16 lg:mt-2 mx-auto' />
      </section>

      <section className='md:w-[50%]'>
        {/* Form Title */}
        <h1 className='text-center text-3xl font-bold mb-8'>Log In</h1>

        {/* Error Message */}
        <p ref={errRef} className={errMsg ? 'inline-block bg-red-500 p-2 w-full' : "hidden"} aria-live='assertive'>{errMsg}</p>

        <form onSubmit={handleSubmit} className='flex flex-col gap-2 lg:w-[80%] mx-auto'>
          {/* Username */}
          <label htmlFor="username">Username:</label>
          <input type="text" name='username' id='username' ref={userRef} autoComplete='off' {...userAtts} required className='text-black p-2 rounded-lg' />
          {/* Password */}
          <label htmlFor="password">Password:</label>
          <input type="password" name='password' id='password' onChange={(e) => setPwd(e.target.value)} value={pwd} required className='text-black p-2 rounded-lg' />

          {/* Submit Button */}
          <button disabled={!user || !pwd ? true : false} className='bg-blue-700 hover:bg-blue-600 active:bg-blue-500 border transition active:scale-95 p-2 px-40 mt-8 rounded-lg disabled:bg-slate-800/30 disabled:transition-none  disabled:active:scale-100 mx-auto'>Log In</button>

          {/* checkbox */}
          <div className=''>
            <label htmlFor="persist">Trust This Device</label>
            <input type="checkbox" id="persist" onChange={toggleCheck} checked={check} />
          </div>

          {/* Go to Sign Up */}
          <p className='mt-4'>Need an Account? <br />
            <span className='underline hover:text-blue-100 '>
              <Link to='/register'>
                Sign Up</Link>
            </span></p>
        </form>
      </section>
    </div>
  )
}

export default Login