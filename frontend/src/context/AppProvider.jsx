import { createContext, useState, useEffect } from "react";
const AppContext = createContext({})

import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";


export const AppProvider = ({ children }) => {
  //auth
  const [auth, setAuth] = useState({})
  const decoded = auth?.accessToken ? jwtDecode(auth.accessToken) : undefined
  const username = decoded?.UserInfo?.username || 'Login to start'
  //cart
  const [cartItems, setCartItems] = useState(localStorage.getItem('cartItems') ? JSON.parse(localStorage.getItem('cartItems')) : [])
  const addToCart = (item) => {
    const isItemInCart = cartItems.find((cartItem) => cartItem.item_id === item.item_id)
    if (isItemInCart) {
      setCartItems(
        cartItems.map((cartItem) =>
          cartItem.item_id === item.item_id
            ? { ...cartItem, quantity: cartItem.quantity + 1 } : cartItem)
      )
    } else {
      setCartItems([...cartItems, { ...item, quantity: 1 }])
      toast('New Item Added to Cart', {
        position: 'top-center',
      });

    }
  }
  const removeFromCart = (item) => {
    const isItemInCart = cartItems.find((cartItem) => cartItem.item_id === item.item_id)
    if (isItemInCart.quantity === 1) {
      setCartItems(cartItems.filter((cartItem) => cartItem.item_id !== item.item_id))
    } else {
      setCartItems(
        cartItems.map((cartItem) => cartItem.item_id === item.item_id
          ? { ...cartItem, quantity: cartItem.quantity - 1 }
          : cartItem)
      )
    }
  }
  const clearCart = () => {
    setCartItems([]);
  };
  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0)
  };
  const clearItem = (item) => {
    const isItemInCart = cartItems.find((cartItem) => cartItem.item_id === item.item_id)
    if (isItemInCart.quantity > 0) {
      setCartItems(cartItems.filter((cartItem) => cartItem.item_id !== item.item_id))
    }
  }
  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);
  useEffect(() => {
    const cartItems = localStorage.getItem("cartItems");
    if (cartItems) {
      setCartItems(JSON.parse(cartItems));
    }
  }, []);


  return (
    <AppContext.Provider value={{
      auth, setAuth, username,
      cartItems, addToCart, removeFromCart, clearCart, getCartTotal, clearItem
    }}>
      {children}
    </AppContext.Provider>
  )
}

export default AppContext