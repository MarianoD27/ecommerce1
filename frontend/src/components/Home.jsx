import { Link } from 'react-router-dom'
import LogoutBtn from './miscelaneous/LogoutBtn'

const Home = () => {

  return (
    <div className='flex flex-col items-center justify-between text-xl min-h-[400px]'>
      <h1 className='text-3xl'>Home</h1>
      <p>You&apos;re now Logged In!</p>
      <Link to='storefront' className='underline font-semibold'>Go to the Store</Link>
      <Link to='lounge' className='underline font-semibold'>Go to the Lounge </Link>
      <Link to='editor' className='underline font-semibold'>Go to the Editor page</Link>
      <Link to='admin' className='underline font-semibold'>Go to the Admin page</Link>
      <Link to='linkpage' className='underline font-semibold'>Go to the Links page</Link>

      <LogoutBtn />
    </div>
  )
}

export default Home