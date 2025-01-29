import { useState, useEffect, useRef } from "react";
import useAxiosPrivate from '../hooks/useAxiosPrivate'
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import moment from 'moment'

import { Table } from "flowbite-react"
import { Chip, Button } from "@material-tailwind/react"

const ORDERS_URL = '/api/store/orders'

const Orders = () => {
  const [orders, setOrders] = useState()
  const axiosPrivate = useAxiosPrivate()
  const navigate = useNavigate()
  const location = useLocation()


  //fetch
  const runOnce = useRef(false)
  useEffect(() => {
    let isMounted = true
    const controller = new AbortController()
    const getOrders = async () => {
      try {
        const response = await axiosPrivate.get(ORDERS_URL, { signal: controller.signal })
        const rawOrders = response.data.map(order => order)
        const newMap = new Map()
        await rawOrders.forEach(item => {
          if (!newMap.has(item.order_id)) newMap.set(item.order_id, [])
          newMap.get(item.order_id).push(item)
        });
        const newOr = Array.from(newMap, ([name, value]) => ({ name, value }));
        // console.log(`(Orders.jsx GET) ${JSON.stringify(response.data)}`)
        isMounted && setOrders(newOr)
      } catch (error) {
        console.error(error);
        if (error.name !== 'CanceledError' && error.status !== 401) {
          navigate('/login', { state: { from: location }, replace: true })
        }
      }
    }
    if (runOnce.current) {
      getOrders()
    }
    return () => {
      isMounted = false
      controller.abort()
      runOnce.current = true
    }
  }, [])
  useEffect(() => {
    console.log(orders);
  }, [orders])

  //mark as done
  const markAsDone = async (id, i) => {
    const response = await axiosPrivate.put(ORDERS_URL, JSON.stringify({ id }), {
      headers: { 'Content-Type': 'application/json' },
      withCredentials: true
    });
    console.log(response);
    if (response.status === 204) {
      toast('Order Updated', {
        position: 'top-center',
      })
      orders[i].value[0].completed = !orders[i].value[0].completed
      setOrders([...orders])
      console.log(orders[i].value[0].completed);
    }
  }



  return (
    <div className="p-4">
      <h1 className="text-xl text-white p-2">Orders:</h1>

      <div className="overflow-x-auto">
        <Table>
          <Table.Head>
            <Table.HeadCell>Order ID</Table.HeadCell>
            <Table.HeadCell>Date</Table.HeadCell>
            <Table.HeadCell>Completed</Table.HeadCell>
            <Table.HeadCell>Buyer</Table.HeadCell>
            <Table.HeadCell>Edit</Table.HeadCell>
          </Table.Head>

          {orders && orders.map((order, i) => {
            return (
              <Table.Body className="divide-y" key={i}>
                <Table.Row className="border-gray-700 bg-gray-800 text-white whitespace-nowrap font-medium">
                  <Table.Cell>
                    {order.value[0].order_id}</Table.Cell>
                  <Table.Cell>{moment(order.value[0].order_date).format('MMMM Do YYYY')}</Table.Cell>
                  <Table.Cell>{order.value[0].completed
                    ? <Chip variant="ghost" color="green" size="sm" value="Completed" icon={<span className="mx-auto mt-1 block h-2 w-2 rounded-full bg-green-900 content-['']" />} className="w-fit text-gray-100" />
                    : <Chip variant="ghost" color="red" size="sm" value="OnGoing" icon={<span className="mx-auto mt-1 block h-2 w-2 rounded-full bg-red-900 content-['']" />} className="w-fit text-gray-100" />}
                  </Table.Cell>
                  <Table.Cell>{order.value[0].username}</Table.Cell>
                  <Table.Cell>
                    <Button onClick={() => (markAsDone(order.value[0].order_id, i))}>Done</Button>
                  </Table.Cell>
                </Table.Row>
                {order.value.map((item, index) => {
                  return <Table.Row key={index} className="text-white">
                    <Table.Cell>{item.name}</Table.Cell>
                    <Table.Cell>Q: {item.quantity}</Table.Cell>
                  </Table.Row>
                })}
              </Table.Body>
            )
          })}


        </Table>

      </div>
    </div>
  )
}

export default Orders