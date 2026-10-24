import { Link } from "react-router-dom";

export default function SellerProduct() {
  return (
    <section className="mx-auto max-w-3xl px-4 py-14 sm:py-20">
      <h1 className="font-josefin text-primary-dark text-3xl font-bold sm:text-4xl">
        My Products
      </h1>
      <div className="border-primary-dark/20 bg-dark-white mt-6 rounded-xl border border-dashed p-6 sm:p-8">
        <h2 className="font-josefin text-xl font-bold">
          Seller product management is not connected yet
        </h2>
        <p className="text-primary-dark/75 mt-2 leading-7">
          Product listing and editing need a seller management API. No products
          are shown here until that connection is available.
        </p>
        <Link
          to="/contact"
          className="text-primary hover:text-secondary mt-4 inline-flex min-h-11 items-center font-bold"
        >
          Contact support
        </Link>
      </div>
    </section>
  );
}
