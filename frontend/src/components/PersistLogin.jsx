import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import useRefreshToken from '../hooks/useRefreshToken'
import useAppContext from "../hooks/useAppContext";
import useLocalStorage from "../hooks/useLocalStorage";

import { Spinner } from "@material-tailwind/react";


const PersistLogin = () => {
  const [isLoading, setIsLoading] = useState(true)
  const refresh = useRefreshToken()
  const { auth } = useAppContext()
  const [persist] = useLocalStorage('persist', false)

  useEffect(() => {
    const verifyRefreshToken = async () => {
      try {
        await refresh()
      } catch (error) {
        console.error(error);
      }
      finally {
        setIsLoading(false)
      }
    }
    !auth?.accessToken ? verifyRefreshToken() : setIsLoading(false)
  }, [])

  return (
    <>
      {!persist
        ? <Outlet />
        : isLoading
          ? (<div className="w-full h-screen flex items-center justify-center">
            <Spinner className="h-36 w-36 text-white-900/50" />
          </div>)
          : <Outlet />}
    </>
  )
}

export default PersistLogin