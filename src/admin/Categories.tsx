import { Link } from "react-router-dom";

function Categories() {
  return (
    <section>
      <h1 className="font-josefin text-primary-dark text-3xl font-bold">
        Categories
      </h1>
      <div className="border-primary-dark/20 bg-dark-white mt-6 rounded-xl border border-dashed p-6 sm:p-8">
        <h2 className="font-josefin text-primary-dark text-xl font-bold">
          Category management is not connected yet
        </h2>
        <p className="text-primary-dark/75 mt-2 max-w-2xl leading-7">
          The admin category list and editing actions need a management API.
          Customers can still browse the available categories from the product
          catalog.
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

export default Categories;
