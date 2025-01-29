import useAxiosPrivate from "../hooks/useAxiosPrivate";
import axios from "../api/axios";
import { useEffect, useState } from "react"
import useAppContext from "../hooks/useAppContext"
import { useNavigate, useLocation } from "react-router-dom"

import {
  Menu, MenuHandler, MenuList, MenuItem, Button, Card, Typography, CardHeader
} from "@material-tailwind/react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faDog, faHorse, faCat } from '@fortawesome/free-solid-svg-icons'
import { CursorArrowRaysIcon, ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/solid";


const PRODUCTS_URL = 'api/store/products'


const AddProduct = () => {

  const axiosPrivate = useAxiosPrivate()
  //location and redirection stuff
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/'

  //states
  const [productName, setProductName] = useState('')
  const [category, setCategory] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState(0)
  const { username } = useAppContext()
  // console.log(auth);
  const [errorMsg, setErrorMsg] = useState('')

  //cloudinary
  const cloudName = 'deg3q4rj0'
  const uploadPreset = 'firstAttempt'
  const [imageSelected, setImageSelected] = useState('')
  const [imgPrev, setImgPrev] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const handleNewImage = (e) => {
    setImageSelected(e)
    setImgPrev(URL.createObjectURL(e))
  }

  //SAVE ITEM IN DB
  const handleDone = async () => {
    //upload image
    setIsLoading(true)
    try {
      const formData = new FormData()
      formData.append("file", imageSelected)
      formData.append("upload_preset", uploadPreset)
      const cloudinaryUpload = await axios.post(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, formData)
      console.log(cloudinaryUpload.data.url);
      //send to db
      const response = await axiosPrivate.post(PRODUCTS_URL, JSON.stringify({ user: username, name: productName, category, description, price, img_url: cloudinaryUpload.data.url }), {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true
      });
      console.log(response.data)
      //clear input fields
      setIsLoading(false)
      navigate('/', { replace: true })

    } catch (error) {
      console.error(error);
      if (!error?.response) {
        setErrorMsg("No server response")
      } else if (error.response?.status === 400) {
        setErrorMsg("Need to complete all fields")
      } else if (error.response?.status === 409) {
        setErrorMsg("Item already exists")
      } else { setErrorMsg("Request Failed") }
      setIsLoading(false)
    }
  }



  // miscelaneous of the design
  useEffect(() => { setErrorMsg('') }, [productName, category, description, price, imageSelected])

  const [openMenu, setOpenMenu] = useState(false);
  const menuItems = [
    {
      title: `Dogs`, icon: <FontAwesomeIcon icon={faDog} />, description: "", value: "dog"
    }, {
      title: `Cats`, icon: <FontAwesomeIcon icon={faCat} />, description: "", value: "cat"
    }, {
      title: "Horses", icon: <FontAwesomeIcon icon={faHorse} />, description: "", value: "horse",
    },];
  const [categoryIcon, setCategoryIcon] = useState()
  const handleCategory = (cat, icon) => {
    setCategory(cat); setCategoryIcon(icon)
  }

  return (
    <>
      <div className="bg-blue-600 m-2 h-screen flex p-4">

        <div className="lg:w-[50%] gap-8 flex flex-col items-center bg-blue-400 rounded-md p-4">

          {/* name */}
          <div className="flex flex-col items-center w-[70%]">
            <label htmlFor="productName" className="capitalize text-2xl mb-2">Product Name</label>
            <input type="text" id='productName' autoComplete="off" required onChange={(e) => { setProductName(e.target.value) }} className="text-black p-2 rounded-md text-2xl w-full" value={productName} />
          </div>

          {/* category */}

          <div className="block">
            <Menu open={openMenu} handler={setOpenMenu} allowHover>
              <MenuHandler>
                <Button
                  variant="text"
                  className="flex items-center gap-3 text-2xl font-normal text-white capitalize tracking-normal"
                >
                  Category{" "}
                  <ChevronDownIcon
                    strokeWidth={2.5}
                    className={`h-3.5 w-3.5 transition-transform`}
                  />
                </Button>
              </MenuHandler>
              <MenuList className="hidden w-[36rem] grid-cols-7 gap-3 overflow-visible lg:grid">
                <Card
                  color="gray"
                  shadow={false}
                  className="col-span-3 flex h-full w-full items-center justify-center rounded-2xl p-4"
                >
                  <CursorArrowRaysIcon strokeWidth={1} className="h-10 w-10" />
                  <Typography className="mt-5 text-center" variant="h5">
                    Choose One
                  </Typography>
                </Card>
                <ul className="col-span-4 flex w-full flex-col gap-1">
                  {menuItems.map(({ title, description, value, icon }) => (
                    <a href="#" key={title}>
                      <MenuItem onClick={() => handleCategory(value, icon)}>
                        <Typography variant="h6" color="blue-gray" className="mb-1">
                          {title} {icon}
                        </Typography>
                        <Typography
                          variant="small"
                          color="gray"
                          className="font-normal"
                        >
                          {description}
                        </Typography>
                      </MenuItem>
                    </a>
                  ))}
                </ul>
              </MenuList>
            </Menu>
          </div>
          <div className="w-full">
            <CardHeader variant="gradient" color="indigo" className="mb-4 grid h-28 place-items-center capitalize">
              <Typography variant="h3" color="white" className="flex items-center gap-2 justify-center text-3xl">
                {category ? category : "Choose Category "}{categoryIcon ? categoryIcon : <ChevronUpIcon className="h-10 w-10" />}
              </Typography>
            </CardHeader>
          </div>

          {/* description */}
          <div className="w-[80%] flex flex-col items-center">
            <label htmlFor="description" className="capitalize text-2xl mb-2">Product Description</label>
            <textarea name="description" id="description" onChange={(e) => { setDescription(e.target.value) }} value={description} placeholder="Enter description..." maxLength={255} className="text-black text-xl p-2 w-full rounded-md resize-none min-h-36" />
          </div>
        </div>

        <div className="lg:w-[50%] gap-8 flex flex-col items-center bg-blue-500  rounded-md p-4">
          {/* image */}
          <div className="flex flex-col items-center">
            <h2 className="capitalize text-2xl mb-2">Add an image</h2>
            <div className='w-[200px] h-[200px] bg-blue-200 rounded-lg'>
              <img src={imgPrev ? imgPrev : "vite.svg"} className="w-full h-full object-contain" />
            </div>
            <input type="file" onChange={(e) => { handleNewImage(e.target.files[0]) }} className="text-sm mx-auto bg-blue-400 rounded-xl" />
          </div>

          {/* price */}
          <div className="w-[50%] flex flex-col items-center">
            <label htmlFor="price" className="capitalize text-2xl mb-2">Enter Price</label>
            <div className="flex items-center justify-center bg-white border-2 border-green-600 rounded-lg">
              <h1 className="p-2 text-3xl text-green-600">$</h1>
              <input type="number" name="price" id="price" onChange={(e) => { setPrice(e.target.value) }} value={price} placeholder="$$$" className="text-black text-xl p-2 bg-transparent" />
            </div>
          </div>

          {/* PUBLISH */}
          <div className="w-full justify-center flex gap-8">
            <Button color="red" onClick={() => navigate(from, { replace: true })}>Cancel</Button>
            {isLoading ? (<Button color="yellow" onClick={() => handleDone()}>Uploading...</Button>) : (
              <Button color='green' onClick={() => handleDone()}>Publish Product</Button>
            )}
          </div>
          <p className={errorMsg ? 'inline-block bg-red-500 p-2 w-full' : "hidden"}>{errorMsg}</p>
        </div>
      </div >





    </>
  )
}

export default AddProduct

