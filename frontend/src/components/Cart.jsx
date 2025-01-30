/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useRef } from "react";
import useAppContext from "../hooks/useAppContext";
import PropTypes from 'prop-types'
import { useNavigate, useLocation } from "react-router-dom";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { toast } from "react-toastify";
import { Button, Modal } from "flowbite-react";
import { HiOutlineExclamationCircle } from "react-icons/hi";

const PRODUCTS_URL = 'api/store/products'
const ORDERS_URL = '/api/store/orders'

const Cart = ({ showModal, toggle }) => {

  const navigate = useNavigate()
  const location = useLocation()

  Cart.propTypes = {
    showModal: PropTypes.bool,
    toggle: PropTypes.func
  }

  const { cartItems, addToCart, removeFromCart, clearCart, getCartTotal, clearItem, username } = useAppContext()

  const handleNavigateItem = (id) => {
    toggle()
    navigate(`/products/${id}`, { state: { from: location }, replace: true })
  }

  //confirmation screen
  const [openModal, setOpenModal] = useState(false);

  //post to the db
  const axiosPrivate = useAxiosPrivate()
  const handleSendOrder = async () => {
    const response = await axiosPrivate.post(ORDERS_URL, JSON.stringify({ cartItems, username }), {
      headers: { 'Content-Type': 'application/json' },
      withCredentials: true
    });
    console.log(response);
    if (response.status === 201) {
      toast('New Order Sent', {
        position: 'top-center',
      })
    }
    setOpenModal(false)
    toggle()
    clearCart()
    navigate(`/storefront`, { state: { from: location }, replace: true })
  }

  //get ids
  const runOnce = useRef(false)
  const [dbItems, setDbItems] = useState([])
  useEffect(() => {
    let isMounted = true
    const controller = new AbortController()
    const getIds = async () => {
      try {
        const ids = await axiosPrivate.get(PRODUCTS_URL)
        const ids2 = ids.data.map(prod => prod.item_id)
        // isMounted && setDbItems(ids2)
        console.log(ids2);
        for (const item of cartItems) {
          if (!ids2.includes(item.item_id)) {
            clearItem(item)
            toast('An item from the card does not exist', {
              position: 'top-center',
            })
            setOpenModal(false)
            toggle()
          } else {
            console.log(`cart item checked: ${item.item_id}`);
          }
        }
      } catch (error) {
        console.error(error);
        if (error.name !== 'CanceledError' && error.status !== 401) {
          navigate('/login', { state: { from: location }, replace: true })
        }
      }
    }
    if (runOnce.current) {
      getIds()
    }
    return () => {
      isMounted = false
      controller.abort()
      runOnce.current = true
    }
  }, [])


  return (
    showModal === true && (
      <div className="backdrop-blur fixed h-auto top-0 bottom-0 left-0 right-0 place-content-center">
        <section className="py-4 antialiased bg-gray-900 md:py-8 rounded-xl w-[90%] max-h-[90%] mx-auto my-auto scrollbar-webkit overflow-y-scroll">
          <div className="mx-auto max-w-screen-xl px-4 2xl:px-0" >
            <h2 className="text-xl font-semibold text-white sm:text-2xl">Shopping Cart</h2>
            <div className="mt-2 sm:mt-4 md:gap-6 lg:flex lg:items-start xl:gap-8">

              {/* card holder maybe?? */}
              <div className="mx-auto w-full flex-none lg:max-w-2xl xl:max-w-4xl">
                <div className="space-y-6">

                  {/* card maybe */}
                  {cartItems.map((item) => (
                    <div key={item.item_id} className="rounded-lg borderp-4 shadow-sm border-gray-700 bg-gray-800 md:p-6 p-4">
                      <div className="space-y-4 md:flex md:items-center md:justify-between md:gap-6 md:space-y-0">
                        <a href="#" className="w-20 shrink-0 md:order-1">
                          <img className="h-20 w-20 object-cover" src={item.img_url ? item.img_url : './logohorse.png'} alt={item.name} />
                        </a>

                        <label htmlFor="counter-input" className="sr-only">Choose quantity:</label>
                        <div className="flex items-center justify-between md:order-3 md:justify-end">
                          <div className="flex items-center">
                            <button type="button" onClick={() => removeFromCart(item)} className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-md border focus:outline-none focus:ring-2 border-gray-600 bg-gray-700 hover:bg-gray-600 focus:ring-gray-700">
                              <svg className="h-2.5 w-2.5 text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 2">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h16" />
                              </svg>
                            </button>
                            <button className="w-10 shrink-0 border-0 bg-transparent text-center text-sm font-medium focus:outline-none focus:ring-0 text-white">{item.quantity}</button>
                            <button type="button" onClick={() => addToCart(item)} className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-md border focus:outline-none focus:ring-2 border-gray-600 bg-gray-700 hover:bg-gray-600 focus:ring-gray-700">
                              <svg className="h-2.5 w-2.5 text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 18">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 1v16M1 9h16" />
                              </svg>
                            </button>
                          </div>
                          <div className="text-end md:order-4 md:w-32 mr-8 md:mr-0">
                            <p className="text-base font-bold text-white">${item.price * item.quantity}</p>
                          </div>
                        </div>

                        <div className="w-full min-w-0 flex-1 space-y-4 md:order-2 md:max-w-md">

                          <button onClick={() => handleNavigateItem(item.item_id)} className="text-base font-medium hover:underline text-white">{item.name}</button>

                          <div className="flex items-center gap-4">
                            <button type="button" className="inline-flex items-center text-sm font-medium hover:underline text-gray-400 hover:text-white">
                              <svg className="me-1.5 h-5 w-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12.01 6.001C6.5 1 1 8 5.782 13.001L12.011 20l6.23-7C23 8 17.5 1 12.01 6.002Z" />
                              </svg>
                              Add to Favorites
                            </button>

                            <button type="button" className="inline-flex items-center text-sm font-medium text-red-600 hover:underline dark:text-red-500" onClick={() => clearItem(item)}>
                              <svg className="me-1.5 h-5 w-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18 17.94 6M18 18 6.06 6" />
                              </svg>
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

                </div>
              </div>

              {/* right column? */}
              <div className="mx-auto mt-6 max-w-4xl flex-1 space-y-6 lg:mt-0 lg:w-full">
                <div className="space-y-4 rounded-lg border p-4 shadow-sm border-gray-700 bg-gray-800 sm:p-6">
                  <p className="text-xl font-semibold text-white">Order summary</p>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <dl className="flex items-center justify-between gap-4">
                        <dt className="text-base font-normal text-gray-400">Price</dt>
                        <dd className="text-base font-medium text-white">${getCartTotal()}</dd>
                      </dl>

                      <dl className="flex items-center justify-between gap-4">
                        <dt className="text-base font-normal text-gray-400">Savings</dt>
                        <dd className="text-base font-medium text-green-600">-$00.00</dd>
                      </dl>

                      <dl className="flex items-center justify-between gap-4">
                        <dt className="text-base font-normal text-gray-400">Store Pickup</dt>
                        <dd className="text-base font-medium text-white">$0</dd>
                      </dl>

                      <dl className="flex items-center justify-between gap-4">
                        <dt className="text-base font-normal text-gray-400">Tax</dt>
                        <dd className="text-base font-medium text-white">$0</dd>
                      </dl>
                    </div>

                    <dl className="flex items-center justify-between gap-4 border-t pt-2 border-gray-700">
                      <dt className="text-base font-bold text-white">Total</dt>
                      <dd className="text-base font-bold text-white">${getCartTotal()}.00</dd>
                    </dl>
                  </div>

                  <button className="flex w-full items-center justify-center rounded-lg px-5 py-2.5 text-sm font-medium text-white  focus:outline-none focus:ring-4 bg-primary-600 hover:bg-primary-700 focus:ring-primary-800" disabled={cartItems.length === 0 && true} onClick={() => setOpenModal(true)}>{cartItems.length === 0 ? "Cart is empty" : "Proceed to Checkout"}</button>

                  <div className="flex items-center justify-center gap-2">
                    <span className="text-sm font-normal text-gray-400"> or </span>
                    <button onClick={() => toggle()} className="inline-flex items-center gap-2 text-sm font-medium underline hover:no-underline text-primary-500">
                      Continue Shopping
                      <svg className="h-5 w-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 12H5m14 0-4 4m4-4-4-4" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section >
        <Modal show={openModal} size="md" onClose={() => setOpenModal(false)} popup>
          <Modal.Header />
          <Modal.Body>
            <div className="text-center">
              <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
              <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                Are you sure you want to confirm this operation?
              </h3>
              <div className="flex justify-center gap-4">
                <Button color="green" onClick={() => handleSendOrder()}>
                  {"Yes, I'm sure"}
                </Button>
                <Button color="gray" onClick={() => setOpenModal(false)}>
                  No, cancel
                </Button>
              </div>
            </div>
          </Modal.Body>
        </Modal>
      </div >

    )
  )
}

export default Cart



