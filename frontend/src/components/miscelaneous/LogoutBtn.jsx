import { useNavigate } from 'react-router-dom'
import useLogout from '../../hooks/useLogout'

const LogoutBtn = () => {
  const navigate = useNavigate()
  const logout = useLogout()

  const handleLogout = async () => {
    await logout()
    navigate('/linkpage')
  }

  return (
    <button onClick={() => handleLogout()} className='bg-red-700 hover:bg-red-600 active:bg-red-500 border transition p-2 px-20 mt-4 rounded-lg'>Log Out</button>
  )
}

export default LogoutBtn