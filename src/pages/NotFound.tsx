import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <section className="flex min-h-[55vh] items-center justify-center px-4 py-16 text-center">
      <div className="max-w-xl">
        <p className="font-josefin text-secondary text-7xl font-bold sm:text-8xl">
          404
        </p>
        <h1 className="font-josefin text-primary-dark mt-4 text-3xl font-bold sm:text-4xl">
          We couldn't find that page
        </h1>
        <p className="text-primary-dark/75 mt-4 leading-7">
          The link may be out of date, or the page may have moved.
        </p>
        <Link
          to="/"
          className="bg-secondary hover:bg-secondary/90 mt-7 inline-flex min-h-11 items-center gap-2 rounded-md px-6 py-3 font-bold text-white"
        >
          <ArrowLeft size={18} aria-hidden="true" /> Back to home
        </Link>
      </div>
    </section>
  );
}
