import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-dark-white mt-auto">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:grid-cols-2 lg:grid-cols-4 lg:py-16">
        <div>
          <Link
            to="/"
            className="font-josefin text-primary-dark text-3xl font-bold"
          >
            Hekto
          </Link>
          <p className="text-primary-dark/75 mt-3 max-w-sm text-sm leading-6">
            Discover products for your everyday life.
          </p>
        </div>
        <div>
          <h2 className="font-josefin text-primary-dark text-lg font-bold">
            Explore
          </h2>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <Link
                className="hover:text-secondary inline-flex min-h-11 items-center"
                to="/shop"
              >
                Shop
              </Link>
            </li>
            <li>
              <Link
                className="hover:text-secondary inline-flex min-h-11 items-center"
                to="/products"
              >
                Products
              </Link>
            </li>
            <li>
              <Link
                className="hover:text-secondary inline-flex min-h-11 items-center"
                to="/blogs"
              >
                Journal
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h2 className="font-josefin text-primary-dark text-lg font-bold">
            Account
          </h2>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <Link
                className="hover:text-secondary inline-flex min-h-11 items-center"
                to="/login"
              >
                Log in
              </Link>
            </li>
            <li>
              <Link
                className="hover:text-secondary inline-flex min-h-11 items-center"
                to="/register"
              >
                Create account
              </Link>
            </li>
            <li>
              <Link
                className="hover:text-secondary inline-flex min-h-11 items-center"
                to="/contact"
              >
                Contact support
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h2 className="font-josefin text-primary-dark text-lg font-bold">
            Get in touch
          </h2>
          <p className="text-primary-dark/75 mt-3 text-sm leading-6">
            Questions about an order or product? Send us a note through our
            contact page.
          </p>
          <Link
            to="/contact"
            className="text-primary mt-3 inline-flex min-h-11 items-center font-bold hover:underline"
          >
            Contact us
          </Link>
          <p className="text-primary-dark/60 mt-2 text-xs">
            Social profiles have not been configured.
          </p>
        </div>
      </div>
      <div className="border-primary-dark/10 text-primary-dark/70 border-t px-4 py-4 text-center text-sm">
        © {new Date().getFullYear()} Hekto. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
