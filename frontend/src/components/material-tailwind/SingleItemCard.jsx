import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from "react-router-dom";
import useAppContext from '../../hooks/useAppContext';
import Cart from '../Cart';


import { Button, IconButton, Rating, Typography, Spinner } from "@material-tailwind/react";
import { HeartIcon } from "@heroicons/react/24/outline";
import { faCartShopping } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const PRODUCT_URL = '/api/store/products'

export function SingleItemCard() {

  //states
  const { id } = useParams()
  const [product, setProduct] = useState()
  const [noResponse, setNoResponse] = useState(false)
  const [disabledButton, setDisabledButton] = useState(false)

  //context
  const { cartItems, addToCart } = useAppContext()
  const handleAddToCart = (product) => {
    addToCart(product)
    setDisabledButton(true)
  }

  //modal
  const [showModal, setShowModal] = useState(false)
  const toggleModal = () => {
    setShowModal(prev => !prev)
  }

  //get products from items table
  const axiosPrivate = useAxiosPrivate()
  const navigate = useNavigate()
  const location = useLocation()
  const runOnce = useRef(false)
  useEffect(() => {
    let isMounted = true
    const controller = new AbortController()
    const getProduct = async () => {
      try {
        const response = await axiosPrivate.get(`${PRODUCT_URL}/${id}`, { signal: controller.signal })
        console.log(response.data[0]);
        const product = response.data[0]
        console.log(`(SingleItemCard.jsx GET) ${response.data?.length}`)
        isMounted && setProduct(product)
        if (isMounted && response?.data?.length === 0) { setNoResponse(true) }
      } catch (error) {
        console.error(error);
        if (error.name !== 'CanceledError' && error.status !== 401) {
          navigate('/login', { state: { from: location }, replace: true })
        }
      }
    }
    if (runOnce.current) {
      getProduct()
    }
    return () => {
      isMounted = false
      controller.abort()
      runOnce.current = true
    }
  }, [])



  return (
    <section className="py-16 px-8 relative">
      {product?.item_id
        ? (
          <div className="mx-auto container grid place-items-center grid-cols-1 md:grid-cols-2 ">
            <div className='md:w-[80%] md:h-[80%] w-[90%] h-[90%]'>
              <img
                src={product?.img_url ? product.img_url : './vite.svg'}
                alt="image"
                className="object-contain w-full max-h-full rounded-lg border-2 border-white bg-white/20"
              />
            </div>
            <div className='w-[80%]'>
              <Typography className="mb-4" variant="h3">
                {product.name}
              </Typography>
              <Typography variant="h3">${product.price}</Typography>
              <Typography className="!mt-4 text-base font-normal leading-[27px] !text-gray-300">
                {/* As we live, our hearts turn colder. Cause pain is what we go through
                as we become older. We get insulted by others, lose trust for those
                others. We get back stabbed by friends. It becomes harder for us to
                give others a hand. We get our heart broken by people we love, even
                that we give them all we have. Then we lose family over time. What
                else could rust the heart more over time? Blackgold. */}
                {product.description}
              </Typography>
              <div className="my-8 flex items-center gap-2">
                <Rating value={4} className="text-amber-500" />
                <Typography className="!text-sm font-bold !text-gray-700">
                  4.0/5 (100 reviews)
                </Typography>
              </div>
              <Typography color="white" variant="h6">
                Category
              </Typography>
              <div className="my-8 mt-3 flex items-center gap-2">
                <div className="px-2 rounded-md border border-blue-gray-600 bg-blue-gray-900 capitalize">{product.category}</div>
              </div>
              <div className="mb-4 flex w-full items-center gap-3 md:w-1/2 ">
                <Button color="gray" className="w-52" onClick={() => handleAddToCart(product)} disabled={disabledButton}>
                  {!disabledButton ? "Add to Cart" : "Open Cart"}
                </Button>
                <IconButton color="gray" variant="text" className="shrink-0">
                  <HeartIcon className="h-6 w-6" />
                </IconButton>
              </div>
            </div>
          </div>
        ) : noResponse
          ? <p className="p-2 ml-4 mt-8 bg-red-400 text-2xl w-fit">No product to display</p>
          : <div className="w-full h-screen flex items-center justify-center">
            <Spinner className="h-36 w-36 text-white-900/50" />
          </div>}

      <button className={`px-4 py-2 ${!showModal ? 'bg-gray-800' : 'bg-red-800'} text-white text-sm font-bold uppercase rounded hover:bg-gray-700 focus:outline-none absolute right-4 top-4`}
        onClick={toggleModal}
      ><FontAwesomeIcon icon={faCartShopping} />({cartItems.length})</button>
      <Cart showModal={showModal} toggle={toggleModal} />
    </section>
  );
}

export default SingleItemCard;