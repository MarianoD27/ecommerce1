import { Typography } from "@material-tailwind/react";
import { Link } from "react-router-dom";
const links = [{ name: "Company", path: '/' }, { name: "Company", path: '/' }, { name: "Company", path: '/' }, { name: "Company", path: '/' }, { name: "Company", path: '/' }, { name: "Company", path: '/' }];
const currentYear = new Date().getFullYear();

export function Footer() {
  return (
    <footer className="px-8 pt-10 pb-4">
      <div className="container mx-auto flex flex-col items-center">
        <div className="flex flex-wrap items-center justify-center gap-8 pb-4">
          {links.map((link, index) => (
            <ul key={index}>
              <Link to={link.path}>
                <li>
                  <Typography
                    as="p"
                    href="#"
                    color="white"
                    className="font-medium !text-gray-500 transition-colors hover:!text-gray-900"
                  >
                    {link.name}
                  </Typography>
                </li>
              </Link>
            </ul>
          ))}
        </div>
        <Typography
          color="blue-gray"
          className="mt-6 !text-sm !font-normal text-gray-500"
        >
          Copyright &copy; {currentYear} Material Tailwind
        </Typography>
      </div>
    </footer>
  );
}
export default Footer;