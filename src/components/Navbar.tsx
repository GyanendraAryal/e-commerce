import { useEffect, useState } from "react";
import { Menu, Phone, Search, ShoppingCart, User, X } from "lucide-react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import type { FormEvent } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../redux/store";
import { logout } from "../redux/features/userSlice";

const primaryLinks = [
  { label: "Home", to: "/" },
  { label: "Shop", to: "/shop" },
  { label: "Products", to: "/products" },
  { label: "Blogs", to: "/blogs" },
  { label: "Contact", to: "/contact" },
];

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((store: RootState) => store.user.value);
  const cartCount = useSelector((store: RootState) => store.cart.value.count);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (!menuOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [menuOpen]);

  const handleSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const query = searchTerm.trim();
    navigate(`/products${query ? `?q=${encodeURIComponent(query)}` : ""}`);
    setMenuOpen(false);
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
    setMenuOpen(false);
  };

  const linkClasses = ({ isActive }: { isActive: boolean }) =>
    `flex min-h-11 items-center rounded-md px-3 font-semibold transition-colors hover:text-secondary ${
      isActive ? "text-secondary" : "text-primary-dark"
    }`;

  return (
    <header className="relative z-30 bg-white">
      <div className="bg-primary text-white">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-x-5 gap-y-1 px-4 py-2 text-xs sm:text-sm">
          <div className="flex flex-wrap items-center gap-x-5 gap-y-1">
            <Link
              className="inline-flex min-h-11 items-center gap-2"
              to="/contact"
            >
              <Phone size={15} aria-hidden="true" />
              <span>Questions? Contact us</span>
            </Link>
          </div>
          <div className="flex items-center gap-3">
            {user ? (
              <>
                <span className="hidden sm:inline">
                  Hello, {user.firstName}
                </span>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="min-h-11 px-2 font-semibold underline-offset-4 hover:underline"
                >
                  Log out
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="inline-flex min-h-11 items-center gap-2 px-2 font-semibold hover:underline"
              >
                <User size={16} aria-hidden="true" />
                Log in
              </Link>
            )}
          </div>
        </div>
      </div>

      <div className="border-primary-dark/10 border-b shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3">
          <Link
            to="/"
            aria-label="Hekto home"
            className="font-josefin text-primary-dark shrink-0 text-3xl font-bold sm:text-4xl"
          >
            Hekto
          </Link>

          <nav
            aria-label="Main navigation"
            className="hidden items-center gap-1 lg:flex"
          >
            {primaryLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === "/"}
                className={linkClasses}
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </NavLink>
            ))}
            {user && (
              <>
                <NavLink to="/carts" className={linkClasses}>
                  Cart
                </NavLink>
                <NavLink to="/orders" className={linkClasses}>
                  Orders
                </NavLink>
              </>
            )}
            {user?.isSeller && (
              <NavLink to="/my-products" className={linkClasses}>
                My Products
              </NavLink>
            )}
          </nav>

          <form
            onSubmit={handleSearch}
            role="search"
            className="hidden max-w-xs min-w-0 flex-1 md:flex"
          >
            <label className="sr-only" htmlFor="site-search">
              Search products
            </label>
            <input
              id="site-search"
              type="search"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search products"
              className="border-primary-dark/20 min-w-0 flex-1 rounded-l-md border px-3 py-2 text-sm"
            />
            <button
              type="submit"
              aria-label="Search products"
              className="bg-secondary hover:bg-secondary/90 flex min-h-11 min-w-11 items-center justify-center rounded-r-md text-white"
            >
              <Search size={19} aria-hidden="true" />
            </button>
          </form>

          <div className="flex shrink-0 items-center gap-1">
            {user && (
              <Link
                to="/carts"
                aria-label={`Cart${cartCount ? `, ${cartCount} items` : ""}`}
                className="text-primary-dark hover:bg-dark-white relative flex min-h-11 min-w-11 items-center justify-center rounded-md"
              >
                <ShoppingCart size={20} aria-hidden="true" />
                {cartCount > 0 && (
                  <span className="bg-secondary absolute top-0 right-0 flex size-5 items-center justify-center rounded-full text-xs font-bold text-white">
                    {cartCount}
                  </span>
                )}
              </Link>
            )}
            <button
              type="button"
              aria-label={
                menuOpen ? "Close navigation menu" : "Open navigation menu"
              }
              aria-expanded={menuOpen}
              aria-controls="mobile-navigation"
              onClick={() => setMenuOpen((open) => !open)}
              className="text-primary-dark hover:bg-dark-white flex min-h-11 min-w-11 items-center justify-center rounded-md lg:hidden"
            >
              {menuOpen ? <X size={23} /> : <Menu size={23} />}
            </button>
          </div>
        </div>

        {menuOpen && (
          <nav
            id="mobile-navigation"
            aria-label="Mobile navigation"
            className="border-primary-dark/10 border-t bg-white px-4 py-3 shadow-lg lg:hidden"
          >
            <div className="mx-auto flex max-w-7xl flex-col">
              {primaryLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.to === "/"}
                  className={linkClasses}
                  onClick={() => setMenuOpen(false)}
                >
                  {link.label}
                </NavLink>
              ))}
              {user && (
                <>
                  <NavLink
                    to="/carts"
                    className={linkClasses}
                    onClick={() => setMenuOpen(false)}
                  >
                    Cart
                  </NavLink>
                  <NavLink
                    to="/orders"
                    className={linkClasses}
                    onClick={() => setMenuOpen(false)}
                  >
                    Orders
                  </NavLink>
                </>
              )}
              {user?.isSeller && (
                <NavLink
                  to="/my-products"
                  className={linkClasses}
                  onClick={() => setMenuOpen(false)}
                >
                  My Products
                </NavLink>
              )}
              <form onSubmit={handleSearch} role="search" className="mt-2 flex">
                <label className="sr-only" htmlFor="mobile-site-search">
                  Search products
                </label>
                <input
                  id="mobile-site-search"
                  type="search"
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder="Search products"
                  className="border-primary-dark/20 min-w-0 flex-1 rounded-l-md border px-3 py-2"
                />
                <button
                  type="submit"
                  aria-label="Search products"
                  className="bg-secondary flex min-h-11 min-w-11 items-center justify-center rounded-r-md text-white"
                >
                  <Search size={19} aria-hidden="true" />
                </button>
              </form>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Navbar;
