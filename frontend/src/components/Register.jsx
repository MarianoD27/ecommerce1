/* eslint-disable react/no-unescaped-entities */
import { useRef, useState, useEffect } from 'react'
import { faCheck, faTimes, faInfoCircle } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import axios from '../api/axios';
import { Link, useNavigate } from 'react-router-dom';

const USER_REGEX = /^[a-zA-Z][a-zA-Z0-9-_]{3,23}$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%.]).{8,24}$/;
const REGISTER_URL = '/api/register'


const Register = () => {
  const userRef = useRef()  //set the focus on user input on load
  const errRef = useRef()  //if error focus on error

  const [user, setUser] = useState('')
  const [validName, setValidName] = useState(false)
  const [userFocus, setUserFocus] = useState(false)

  const [pwd, setPwd] = useState('')
  const [validPwd, setValidPwd] = useState(false)
  const [pwdFocus, setPwdFocus] = useState(false)

  const [matchPwd, setMatchPwd] = useState('')
  const [validMatch, setValidMatch] = useState(false)
  const [matchFocus, setMatchFocus] = useState(false)

  const [errorMsg, setErrorMsg] = useState('')
  const [success, setSuccess] = useState(false)

  //new
  const EMAIL_REGEX = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  const NAME_REGEX = /^[a-zA-Z]+$/;
  const [firstname, setFirstname] = useState('')
  const [validFistname, setValidFistname] = useState(false)
  const [lastname, setLastname] = useState('')
  const [validLastname, setValidLastname] = useState(false)
  const [email, setEmail] = useState('')
  const [validEmail, setValidEmail] = useState(false)

  const navigate = useNavigate();

  useEffect(() => {
    userRef.current.focus();  //sets the focus supposedly
  }, [])

  useEffect(() => {
    const result = USER_REGEX.test(user);
    console.log(result)
    console.log(user)
    setValidName(result)
  }, [user])

  useEffect(() => {
    const result = PWD_REGEX.test(pwd);
    console.log(result);
    console.log(pwd);
    setValidPwd(result);
    const match = pwd === matchPwd;
    setValidMatch(match)
  }, [pwd, matchPwd])

  useEffect(() => {
    const result = NAME_REGEX.test(firstname)
    console.log(firstname, result)
    setValidFistname(result)
  }, [firstname])

  useEffect(() => {
    const result = NAME_REGEX.test(lastname)
    console.log(lastname, result)
    setValidLastname(result)
  }, [lastname])

  useEffect(() => {
    const result = EMAIL_REGEX.test(email)
    console.log(email, result);
    setValidEmail(result)
  }, [email])


  useEffect(() => {
    setErrorMsg('');
  }, [user, pwd, matchPwd, firstname, lastname, email])

  const handleSubmit = async (e) => {
    e.preventDefault();
    //if button enabled with JS hack
    const v1 = USER_REGEX.test(user);
    const v2 = PWD_REGEX.test(pwd);
    const v3 = NAME_REGEX.test(firstname);
    const v4 = NAME_REGEX.test(lastname);
    if (!v1 || !v2 || !v3 || !v4) {
      setErrorMsg("Invalid Entry");
      return;
    }
    try {
      const response = await axios.post(REGISTER_URL, JSON.stringify({ user, password: pwd, firstname, lastname, email }), {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true
      });
      console.log(response.data)
      console.log(response.accessToken)
      console.log(JSON.stringify(response))
      setSuccess(true)
      //clear input fields
      setUser(''); setPwd(''); setMatchPwd(''); setFirstname(''); setLastname(''); setEmail('')
      navigate('/login', { replace: true })
    }
    catch (err) {
      if (!err?.response) {
        setErrorMsg("No server response")
      } else if (err.response?.status === 409) {
        setErrorMsg("Username Taken")
      } else { setErrorMsg("Registration Failed") }
      errRef.current.focus()
    }
  }


  return (
    <div className='flex flex-col md:flex-row gap-0 md:gap-12'>

      <section className='md:w-[50%] md:gap-12 flex flex-col'>
        <h2 className='capitalize text-2xl font-semibold text-center'>Welcome to <br />'E-Commerce Title Placeholder'</h2>
        <img src="logohorse.png" alt="logo" className='md:w-full md:max-w-full max-w-[300px] w-auto md:mt-16 lg:mt-2 mx-auto' />
      </section>

      <section className='md:w-[50%]'>
        {/* Form Title */}
        <h1 className='text-center text-3xl font-bold mb-4'>Register</h1>

        {
          success ? (<section>
            <h1 className='text-2xl font-bold'>Success!</h1>
            <p>
              <Link to='/login'>
                <a href='#' className='text-xl hover:text-blue-100 underline'>Sign In</a></Link>
            </p>
          </section>) : (<>

            {/* Form */}
            <form onSubmit={handleSubmit} className='flex flex-col gap-2 lg:w-[80%] mx-auto'>

              {/* Error Message */}
              <p ref={errRef} className={errorMsg ? 'inline-block bg-red-500 p-2 w-full' : "hidden"} aria-live='assertive'>{errorMsg}</p>

              {/* Username */}
              <label htmlFor="username">Username:
                <span className={validName ? 'text-xl ml-2 inline-block text-green-700' : 'hidden'}><FontAwesomeIcon icon={faCheck} /></span>
                <span className={validName || !user ? 'hidden' : 'text-xl ml-2 inline-block text-red-700'}><FontAwesomeIcon icon={faTimes} /></span>
              </label>
              <input type="text" id='username' ref={userRef} autoComplete='off' onChange={(e) => { setUser(e.target.value) }} value={user} required aria-invalid={validName ? "false" : "true"} aria-describedby='uidnote' onFocus={() => setUserFocus(true)} onBlur={() => setUserFocus(false)} className='text-black w-full p-2 rounded-lg' />
              <p id="uidnote" className={userFocus && user && !validName ? "inline-block my-2 p-2 rounded-lg bg-black w-full" : "hidden"}><FontAwesomeIcon icon={faInfoCircle} /> 4 to 24 characters.<br />Must begin with a letter.<br />Letters, numbers, underscores, hyphens allowed.</p>

              {/* firstname */}
              <label htmlFor="firstname">Firstname:
                <span className={validFistname ? 'text-xl ml-2 inline-block text-green-700' : 'hidden'}><FontAwesomeIcon icon={faCheck} /></span>
                <span className={validFistname || !firstname ? 'hidden' : 'text-xl ml-2 inline-block text-red-700'}><FontAwesomeIcon icon={faTimes} /></span>
              </label>
              <input type="text" id='firstname' autoComplete='off' onChange={(e) => { setFirstname(e.target.value) }} value={firstname} required className='text-black w-full p-2 rounded-lg' />

              {/* lastname */}
              <label htmlFor="lastname">Lastname:
                <span className={validLastname ? 'text-xl ml-2 inline-block text-green-700' : 'hidden'}><FontAwesomeIcon icon={faCheck} /></span>
                <span className={validLastname || !lastname ? 'hidden' : 'text-xl ml-2 inline-block text-red-700'}><FontAwesomeIcon icon={faTimes} /></span>
              </label>
              <input type="text" id='lastname' autoComplete='off' onChange={(e) => { setLastname(e.target.value) }} value={lastname} required className='text-black w-full p-2 rounded-lg' />

              {/* email */}
              <label htmlFor="email">Email:
                <span className={validEmail ? 'text-xl ml-2 inline-block text-green-700' : 'hidden'}><FontAwesomeIcon icon={faCheck} /></span>
                <span className={validEmail || !email ? 'hidden' : 'text-xl ml-2 inline-block text-red-700'}><FontAwesomeIcon icon={faTimes} /></span>
              </label>
              <input type="text" id='email' autoComplete='off' onChange={(e) => { setEmail(e.target.value) }} value={email} required className='text-black w-full p-2 rounded-lg' />

              {/* Password */}
              <label htmlFor="password">
                Password:
                <span className={validPwd ? 'text-xl ml-2 inline-block text-green-700' : 'hidden'}><FontAwesomeIcon icon={faCheck} /></span>
                <span className={validPwd || !pwd ? 'hidden' : 'text-xl ml-2 inline-block text-red-700'}><FontAwesomeIcon icon={faTimes} /></span>
              </label>
              <input type="password" id='password' onChange={(e) => setPwd(e.target.value)} required aria-invalid={validPwd ? "false" : "true"} aria-describedby='pwdnote' onFocus={() => setPwdFocus(true)} onBlur={() => setPwdFocus(false)} className='text-black w-full p-2 rounded-lg' />
              <p id="pwdnote" className={pwdFocus && !validPwd ? "inline-block my-2 p-2 rounded-lg bg-black w-full" : "translate-x-[5000px] absolute"}>
                <FontAwesomeIcon icon={faInfoCircle} /> 8 to 24 characters.<br />Must include uppercase and lowercase letters, a number and a special character. <br />Allowed special characters: <span aria-label='exclamation mark'>!</span><span aria-label='at symbol'>@</span><span aria-label='hashtag'>#</span><span aria-label='dollar sign'>$</span><span aria-label='percent'>%</span>
              </p>

              {/* Matching Password */}
              <label htmlFor='confirm_pwd'>Confirm Password:
                <span className={validMatch && matchPwd ? "text-xl ml-2 inline-block text-green-700" : "hidden"}><FontAwesomeIcon icon={faCheck} /></span>
                <span className={validMatch || !matchPwd ? "hidden" : "text-xl ml-2 inline-block text-red-700"}><FontAwesomeIcon icon={faTimes} /></span>
              </label>
              <input type='password' id='confirm_pwd' onChange={(e) => { setMatchPwd(e.target.value) }} required aria-invalid={validMatch ? "false" : "true"} aria-describedby='confirmnote' onFocus={() => setMatchFocus(true)} onBlur={() => setMatchFocus(false)} className='text-black w-full p-2 rounded-lg' />
              <p id='confirmnote' className={matchFocus && !validMatch ? "inline-block my-2 p-2 rounded-lg bg-black w-full" : "translate-x-[5000px] absolute"}>
                <FontAwesomeIcon icon={faInfoCircle} /> Must match the first password input field.
              </p>

              {/* Submit Button */}
              <button disabled={!validName || !validPwd || !validMatch || !validEmail || !validFistname || !validMatch ? true : false} className='bg-blue-700 hover:bg-blue-600 active:bg-blue-500 border transition active:scale-95 p-2 px-6 mt-8 rounded-lg disabled:bg-slate-800/30 disabled:transition-none disabled:active:scale-100'>Sign Up</button>

              {/* Go to Login */}
              <p className='mt-4'>Aleady registered? <br />
                <span className='underline hover:text-blue-100 '>
                  <Link to='/login'>
                    <a href="#">Sign In</a></Link>
                </span></p>
            </form>
          </>)
        }
      </section >
    </div >
  )
}

export default Register