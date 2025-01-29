import axios from "../api/axios";
import useAppContext from "./useAppContext";

const useRefreshToken = () => {
  const { setAuth } = useAppContext()

  const refresh = async () => {

    const response = await axios.get('/api/refresh', { withCredentials: true })
    setAuth(prev => {
      return {
        ...prev,
        roles: response.data.roles,
        accessToken: response.data.accessToken,
      }
    })
    console.log(`(useRefreshToken.jsx) token refreshed`)
    // console.log(`uRT: ${JSON.stringify(response)}`)
    return response.data.accessToken
  }

  return refresh;
}

export default useRefreshToken