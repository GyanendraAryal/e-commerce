import { ArrowRight, FolderTree, Package } from "lucide-react";
import { Link } from "react-router-dom";

function Dashboard() {
  return (
    <section>
      <p className="text-secondary font-bold tracking-[0.15em] uppercase">
        Store administration
      </p>
      <h1 className="font-josefin text-primary-dark mt-2 text-3xl font-bold">
        Dashboard
      </h1>
      <p className="text-primary-dark/75 mt-3 max-w-2xl leading-7">
        Manage the store catalog. Summary metrics are not connected to the
        dashboard yet.
      </p>
      <div className="mt-8 grid gap-5 md:grid-cols-2">
        <Link
          to="/admin/products"
          className="group border-primary-dark/10 hover:border-primary hover:bg-dark-white flex min-h-36 items-center gap-4 rounded-xl border p-5 transition-colors"
        >
          <Package
            className="text-primary shrink-0"
            size={30}
            aria-hidden="true"
          />
          <span className="flex-1">
            <span className="font-josefin block text-xl font-bold">
              Products
            </span>
            <span className="text-primary-dark/70 mt-1 block text-sm">
              Open product management
            </span>
          </span>
          <ArrowRight
            className="text-primary group-hover:text-secondary"
            size={20}
            aria-hidden="true"
          />
        </Link>
        <Link
          to="/admin/categories"
          className="group border-primary-dark/10 hover:border-primary hover:bg-dark-white flex min-h-36 items-center gap-4 rounded-xl border p-5 transition-colors"
        >
          <FolderTree
            className="text-primary shrink-0"
            size={30}
            aria-hidden="true"
          />
          <span className="flex-1">
            <span className="font-josefin block text-xl font-bold">
              Categories
            </span>
            <span className="text-primary-dark/70 mt-1 block text-sm">
              Open category management
            </span>
          </span>
          <ArrowRight
            className="text-primary group-hover:text-secondary"
            size={20}
            aria-hidden="true"
          />
        </Link>
      </div>
    </section>
  );
}

export default Dashboard;
