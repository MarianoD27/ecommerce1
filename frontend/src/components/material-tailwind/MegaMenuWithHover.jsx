import React from "react";
import { Navbar, Collapse, Typography, IconButton, List, ListItem, Menu, MenuHandler, MenuList, MenuItem, } from "@material-tailwind/react";
import { ChevronDownIcon, Bars3Icon, XMarkIcon, } from "@heroicons/react/24/outline";
import { Bars4Icon, GlobeAmericasIcon, NewspaperIcon, PhoneIcon, RectangleGroupIcon, SquaresPlusIcon, SunIcon, TagIcon, UserGroupIcon, } from "@heroicons/react/24/solid";
import { Link } from "react-router-dom";

const navListMenuItems = [
  {
    title: "Products", description: "Find the perfect solution for your needs.", icon: RectangleGroupIcon, path: '/storefront'
  },
  {
    title: "Sell Product", description: "Find the perfect solution for your needs.", icon: SquaresPlusIcon, path: '/addproduct'
  },
  {
    title: "About Us", description: "Meet and learn about our dedication", icon: UserGroupIcon, path: '/aboutus'
  },
  {
    title: "Lounge", description: "Find the perfect solution for your needs.", icon: Bars4Icon, path: '/lounge'
  },
  {
    title: "Links Page", description: "Learn how we can help you achieve your goals.", icon: SunIcon, path: '/linkpage'
  },
  {
    title: "Support", description: "Reach out to us for assistance or inquiries", icon: GlobeAmericasIcon, path: '/support'
  },
  {
    title: "Contact", description: "Find the perfect solution for your needs.", icon: PhoneIcon, path: '/contact'
  },
  {
    title: "News", description: "Read insightful articles, tips, and expert opinions.", icon: NewspaperIcon, path: '/news'
  },
  {
    title: "Special Offers", description: "Explore limited-time deals and bundles", icon: TagIcon, path: '/specialoffers'
  },
];

function NavListMenu() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const renderItems = navListMenuItems.map(
    ({ icon, title, description, path }, key) => (
      <Link to={path} key={key}>
        <MenuItem className="flex items-center gap-3 rounded-lg hover:bg-purple-500">
          <div className="flex items-center justify-center rounded-lg !bg-blue-gray-50 p-2 "> {/*!bg-blue-gray-50*/}
            {" "}
            {React.createElement(icon, {
              strokeWidth: 2,
              className: "h-6 text-gray-900 w-6",
            })}
          </div>
          <div>
            <Typography
              variant="h6"
              color="white"
              className="flex items-center text-sm font-bold"
            >
              {title}
            </Typography>
            <Typography
              variant="paragraph"
              className="text-xs !font-medium text-white lg:text-blue-gray-500"
            >
              {description}
            </Typography>
          </div>
        </MenuItem>
      </Link>
    ),
  );

  return (
    <React.Fragment>
      <Menu
        open={isMenuOpen}
        handler={setIsMenuOpen}
        offset={{ mainAxis: 20 }}
        placement="bottom"
        allowHover={true}
      >
        <MenuHandler>
          <Typography as="div" variant="small" className="font-medium">
            <ListItem
              className="flex items-center gap-2 py-2 pr-4 font-medium text-white"
              selected={isMenuOpen || isMobileMenuOpen}
              onClick={() => setIsMobileMenuOpen((cur) => !cur)}
            >
              Resources
              <ChevronDownIcon
                strokeWidth={2.5}
                className={`hidden h-3 w-3 transition-transform lg:block ${isMenuOpen ? "rotate-180" : ""
                  }`}
              />
              <ChevronDownIcon
                strokeWidth={2.5}
                className={`block h-3 w-3 transition-transform lg:hidden ${isMobileMenuOpen ? "rotate-180" : ""
                  }`}
              />
            </ListItem>
          </Typography>
        </MenuHandler>
        <MenuList className="hidden max-w-screen-xl rounded-xl lg:block">
          <ul className="grid grid-cols-3 gap-y-2 outline-none outline-0">
            {renderItems}
          </ul>
        </MenuList>
      </Menu>
      <div className="block lg:hidden">
        <Collapse open={isMobileMenuOpen}>{renderItems}</Collapse>
      </div>
    </React.Fragment>
  );
}

function NavList() {
  return (
    <List className="mt-4 mb-6 p-0 lg:mt-0 lg:mb-0 lg:flex-row lg:p-1">
      <Link to='/'>
        <Typography
          as="h1"
          variant="small"
          color="white"
          className="font-medium"
        >
          <ListItem className="flex items-center gap-2 py-2 pr-4">
            Home
          </ListItem>
        </Typography>
      </Link>
      <NavListMenu />
      <Link to='/contact' >
        <Typography
          as="h1"
          variant="small"
          color="white"
          className="font-medium"
        >
          <ListItem className="flex items-center gap-2 py-2 pr-4">
            Contact Us
          </ListItem>
        </Typography>
      </Link>
    </List>
  );
}

export default function MegaMenuWithHover() {
  const [openNav, setOpenNav] = React.useState(false);

  React.useEffect(() => {
    window.addEventListener(
      "resize",
      () => window.innerWidth >= 960 && setOpenNav(false),
    );
  }, []);

  return (
    <Navbar className="w-full px-4 py-0 bg-indigo-600 border-indigo-600">
      <div className="flex max-w-screen-xl mx-auto items-center justify-between text-white">
        <Typography
          as="a"
          href="#"
          variant="h6"
          className="mr-4 cursor-pointer py-1.5 lg:ml-2"
        >
          E-Commerce by MD
        </Typography>
        <div className="hidden lg:block">
          <NavList />
        </div>
        <IconButton
          variant="text"
          color="white"
          className="lg:hidden"
          onClick={() => setOpenNav(!openNav)}
        >
          {openNav ? (
            <XMarkIcon className="h-6 w-6" strokeWidth={2} />
          ) : (
            <Bars3Icon className="h-6 w-6" strokeWidth={2} />
          )}
        </IconButton>
      </div>
      <Collapse open={openNav}>
        <NavList />
      </Collapse>
    </Navbar>
  );
}



