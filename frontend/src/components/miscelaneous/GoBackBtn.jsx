import { useNavigate } from 'react-router-dom'

const GoBackBtn = () => {
  const navigate = useNavigate()
  const goBack = () => navigate(-1)

  return (
    <button onClick={goBack} className='bg-blue-600 border border-white rounded-md px-8 self-auto'>Go Back</button>
  )
}

export default GoBackBtn
