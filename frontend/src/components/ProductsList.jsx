/* eslint-disable react-hooks/exhaustive-deps */
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { useEffect, useState, useRef } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import useAppContext from "../hooks/useAppContext";

import Cart from "./Cart";

import { Card, CardHeader, CardBody, CardFooter, Typography, Button, ButtonGroup, Spinner } from "@material-tailwind/react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faX, faCartShopping, faCircleInfo } from '@fortawesome/free-solid-svg-icons'

const PRODUCTS_URL = 'api/store/products'

const ProductsList = () => {
  //states
  const [products, setProducts] = useState()
  const [productsFiltered, setProductsFiltered] = useState()
  const axiosPrivate = useAxiosPrivate()
  const navigate = useNavigate()
  const location = useLocation()

  //context
  const { cartItems, addToCart } = useAppContext()
  const handleAddToCart = (product, e) => {
    addToCart(product)
    e.currentTarget.disabled = true;
  }

  //modal
  const [showModal, setShowModal] = useState(false)
  const toggleModal = () => {
    setShowModal(prev => !prev)
  }

  //get products from items table
  const runOnce = useRef(false)
  useEffect(() => {
    let isMounted = true
    const controller = new AbortController()
    const getProducts = async () => {
      try {
        const response = await axiosPrivate.get(PRODUCTS_URL, { signal: controller.signal })
        const products = response.data.map(prod => prod)
        console.log(`(StoreFront.jsx GET) ${response.data?.length}`)
        isMounted && setProducts(products); setProductsFiltered(products)
      } catch (error) {
        console.error(error);
        if (error.name !== 'CanceledError' && error.status !== 401) {
          navigate('/login', { state: { from: location }, replace: true })
        }
      }
    }
    if (runOnce.current) {
      getProducts()
    }
    return () => {
      isMounted = false
      controller.abort()
      runOnce.current = true
    }
  }, [])

  const productsFilter = (category) => {
    // console.log(products);
    setProductsFiltered(products.filter(pro => pro.category === category))
  }

  //single item open 
  const handleOpenSingleItem = (id) => {
    console.log(`(ProductList) Chosen ${id}`);
    navigate(`/products/${id}`, { state: { from: location }, replace: false })
  }

  return (
    <>

      {/* <h2>Products List:</h2> */}
      <div className="w-full relative">
        <div className="flex w-max flex-col gap-4 mx-auto mt-8 p-4">
          <ButtonGroup variant="gradient">
            <Button onClick={() => productsFilter('dog')}>Dogs</Button>
            <Button onClick={() => productsFilter('cat')}>Cats</Button>
            <Button onClick={() => productsFilter('horse')}>Horses</Button>
            <Button onClick={() => setProductsFiltered(products)}><FontAwesomeIcon icon={faX} /></Button>
          </ButtonGroup>

        </div>
        {productsFiltered?.length
          ? (
            <div className="w-full flex flex-wrap p-2">
              {productsFiltered.slice().map(
                (prod) => {
                  return <div key={prod.item_id} className="mx-auto sm:mx-0 sm:basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/5 my-4">
                    <Card className="w-[90%]">
                      <CardHeader shadow={false} floated={false} className="h-56">
                        <p className="bg-white/55 text-end absolute capitalize rounded-lg m-1 px-1 border border-black/40 bottom-0 right-0 object-contain">{prod.category}</p>
                        <img
                          src={prod?.img_url ? prod.img_url : 'vite.svg'}
                          alt="card-image"
                          className="h-full w-full object-cover"
                        />
                      </CardHeader>
                      <CardBody>
                        <div className="mb-2 flex items-center justify-between">
                          <Typography color="blue-gray" className="font-medium">
                            {prod.name}
                          </Typography>
                          <Typography color="blue-gray" className="font-medium">
                            ${prod.price}
                          </Typography>
                        </div>
                        {/* <Typography
                          variant="small"
                          color="gray"
                          className="font-normal opacity-75 line-clamp-1"
                        >
                          {prod.description}
                        </Typography> */}
                      </CardBody>
                      <CardFooter className="pt-0 flex">
                        <Button
                          ripple={false}
                          fullWidth={true}
                          className="bg-blue-gray-900/10 text-blue-gray-900 shadow-none hover:scale-105 hover:shadow-none focus:scale-105 focus:shadow-none active:scale-100"
                          onClick={() => handleOpenSingleItem(prod.item_id)}
                        >
                          <FontAwesomeIcon icon={faCircleInfo} /> Info
                        </Button>
                        <Button
                          ripple={false}
                          fullWidth={true}
                          className="bg-blue-gray-900/10 text-blue-gray-900 shadow-none hover:scale-105 hover:shadow-none focus:scale-105 focus:shadow-none active:scale-100"
                          onClick={(e) => handleAddToCart(prod, e)}
                        >
                          <FontAwesomeIcon icon={faCartShopping} />
                        </Button>
                      </CardFooter>
                    </Card>
                  </div>
                }
              )}</div>
          )
          : productsFiltered
            ? <p className="p-2 ml-4 mt-8 bg-red-400 text-2xl w-fit">No products to display</p>
            : <div className="w-full h-screen flex items-center justify-center">
              <Spinner className="h-36 w-36 text-white-900/50" />
            </div>
        }

        <button className={`px-4 py-2 ${!showModal ? 'bg-gray-800' : 'bg-red-800'} text-white text-sm font-bold uppercase rounded-lg hover:bg-gray-700 focus:outline-none fixed right-4 top-20`}
          onClick={toggleModal}
        ><FontAwesomeIcon icon={faCartShopping} />({cartItems.length})
        </button>
      </div>
      <Cart showModal={showModal} toggle={toggleModal} />
    </>
  )
}

export default ProductsList