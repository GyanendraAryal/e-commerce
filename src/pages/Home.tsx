import HeroBanner from "../components/HeroBanner";
import {
  ArrowRight,
  Headphones,
  PackageCheck,
  ShoppingBag,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Card, Section } from "../components/ui";

function Home() {
  return (
    <div>
      <HeroBanner />
      <Section>
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-secondary font-bold tracking-[0.16em] uppercase">
            A simpler way to shop
          </p>
          <h2 className="font-josefin text-primary-dark mt-3 text-3xl font-bold sm:text-4xl">
            Made for finding your next favorite
          </h2>
          <p className="text-primary-dark/70 mt-4 leading-7">
            Browse the collection, compare details, and find the right fit for
            your day.
          </p>
        </div>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <Card>
            <ShoppingBag
              className="text-secondary"
              size={28}
              aria-hidden="true"
            />
            <h3 className="font-josefin mt-4 text-xl font-bold">
              Explore the collection
            </h3>
            <p className="text-primary-dark/70 mt-2 text-sm leading-6">
              Browse all available products and find something that suits you.
            </p>
          </Card>
          <Card>
            <PackageCheck
              className="text-secondary"
              size={28}
              aria-hidden="true"
            />
            <h3 className="font-josefin mt-4 text-xl font-bold">
              Keep track of orders
            </h3>
            <p className="text-primary-dark/70 mt-2 text-sm leading-6">
              Sign in to view your cart and follow your order details.
            </p>
          </Card>
          <Card className="sm:col-span-2 lg:col-span-1">
            <Headphones
              className="text-secondary"
              size={28}
              aria-hidden="true"
            />
            <h3 className="font-josefin mt-4 text-xl font-bold">
              We're here to help
            </h3>
            <p className="text-primary-dark/70 mt-2 text-sm leading-6">
              Reach out to us with a question about shopping or your order.
            </p>
          </Card>
        </div>
        <div className="mt-8 text-center">
          <Link
            to="/products"
            className="text-primary hover:text-secondary inline-flex min-h-11 items-center gap-2 font-bold"
          >
            View all products <ArrowRight size={18} aria-hidden="true" />
          </Link>
        </div>
      </Section>
    </div>
  );
}

export default Home;
