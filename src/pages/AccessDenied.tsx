import { Link } from "react-router-dom";

export default function AccessDenied() {
  return (
    <section className="flex min-h-[55vh] items-center justify-center px-4 py-16 text-center">
      <div className="max-w-xl">
        <p className="font-josefin text-secondary text-6xl font-bold">403</p>
        <h1 className="font-josefin text-primary-dark mt-4 text-3xl font-bold">
          You don't have access to this page
        </h1>
        <p className="text-primary-dark/75 mt-4 leading-7">
          Sign in with an account that has permission, or return to the store.
        </p>
        <Link
          to="/"
          className="bg-secondary hover:bg-secondary/90 mt-7 inline-flex min-h-11 items-center justify-center rounded-md px-6 py-3 font-bold text-white"
        >
          Return to home
        </Link>
      </div>
    </section>
  );
}
