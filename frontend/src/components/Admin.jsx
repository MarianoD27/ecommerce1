import Users from './Users'
import { Link } from 'react-router-dom'
import { useState } from 'react';
import { Accordion, AccordionHeader, AccordionBody, } from "@material-tailwind/react";
import { Button } from 'flowbite-react';

const Admin = () => {

  const [open, setOpen] = useState(0);
  const [alwaysOpen, setAlwaysOpen] = useState(true);
  const handleAlwaysOpen = () => setAlwaysOpen((cur) => !cur);

  return (
    <section>
      <h1>Admins Page</h1> <br />
      <p>You must have been assigned an Admin role.</p> <br />
      <Accordion open={alwaysOpen}>
        <AccordionHeader onClick={handleAlwaysOpen} className='text-white hover:bg-gray-400'>
          Users List
        </AccordionHeader>
        <AccordionBody className='text-white'>
          <Users />
        </AccordionBody>
      </Accordion>

      <Link to='/admin/api/orders'>
        <Button outline gradientDuoTone="pinkToOrange">
          Orders
        </Button>
      </Link>

      <br />
      <Link to='/' className='underline font-semibold'>Home</Link>
    </section>
  )
}

export default Admin