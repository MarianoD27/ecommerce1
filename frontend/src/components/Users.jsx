import { useState, useEffect, useRef } from "react";
import useAxiosPrivate from '../hooks/useAxiosPrivate'
import { useLocation, useNavigate } from "react-router-dom";

const Users = () => {
  const [users, setUsers] = useState()
  const axiosPrivate = useAxiosPrivate()
  const navigate = useNavigate()
  const location = useLocation()

  const runOnce = useRef(false)
  useEffect(() => {
    let isMounted = true
    const controller = new AbortController()
    const getUsers = async () => {
      try {
        const response = await axiosPrivate.get('/api/customers', { signal: controller.signal })
        const userNames = response.data.map(user => user)
        console.log(`(Users.jsx GET) ${JSON.stringify(response.data.length)}`)
        isMounted && setUsers(userNames)
      } catch (error) {
        console.error(error);
        if (error.name !== 'CanceledError' && error.status !== 401) {
          navigate('/login', { state: { from: location }, replace: true })
        }
      }
    }
    if (runOnce.current) {
      getUsers()
    }
    return () => {
      isMounted = false
      controller.abort()
      runOnce.current = true
    }
  }, [])

  return (
    <article>
      <h2>Users List:</h2>
      {users?.length
        ? (
          <ul>{users.map(
            (user, i) => { return <li key={i}>{user.username} : {JSON.stringify(user.roles)}</li> }
          )}</ul>
        )
        : <p>No users to display</p>
      }
    </article>
  )
}

export default Users