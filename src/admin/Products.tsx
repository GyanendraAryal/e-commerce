import { Link } from "react-router-dom";

function Products() {
  return (
    <section>
      <h1 className="font-josefin text-primary-dark text-3xl font-bold">
        Products
      </h1>
      <div className="border-primary-dark/20 bg-dark-white mt-6 rounded-xl border border-dashed p-6 sm:p-8">
        <h2 className="font-josefin text-primary-dark text-xl font-bold">
          Product management is not connected yet
        </h2>
        <p className="text-primary-dark/75 mt-2 max-w-2xl leading-7">
          The admin product list and editing actions need a management API.
          Shoppers can continue to browse the public product catalog.
        </p>
        <Link
          to="/products"
          className="text-primary hover:text-secondary mt-4 inline-flex min-h-11 items-center font-bold"
        >
          View product catalog
        </Link>
      </div>
    </section>
  );
}

export default Products;
