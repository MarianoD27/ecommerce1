import axios from "../api/axios";
import useAppContext from "./useAppContext";


const useLogout = () => {
  const { setAuth, clearCart } = useAppContext()

  const logout = async () => {
    setAuth({})
    clearCart()
    try {
      const response = await axios('/api/logout', { withCredentials: true })
    } catch (error) {
      console.error(error);
    }
  }

  return logout
}

export default useLogout