import { ArrowRight, Search, ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";
import BreadCrumb from "../components/BreadCrumb";
import { Card, Section } from "../components/ui";

const shopLinks = [
  {
    icon: Search,
    title: "Browse products",
    description:
      "Explore the full catalog, compare product details, and narrow down your search.",
    to: "/products",
    action: "View all products",
  },
  {
    icon: ShoppingBag,
    title: "Find your next favorite",
    description:
      "Use product search and category filters to discover items in the store.",
    to: "/products",
    action: "Start exploring",
  },
];

export default function Shop() {
  return (
    <>
      <BreadCrumb title="Shop" paths={[{ title: "Shop" }]} />
      <Section>
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-secondary font-bold tracking-[0.15em] uppercase">
            The Hekto shop
          </p>
          <h1 className="font-josefin text-primary-dark mt-3 text-4xl font-bold sm:text-5xl">
            Find something for your everyday
          </h1>
          <p className="text-primary-dark/75 mt-5 text-lg leading-8">
            Browse the available collection, search by name, or filter products
            by category.
          </p>
          <Link
            to="/products"
            className="bg-secondary hover:bg-secondary/90 mt-7 inline-flex min-h-11 items-center gap-2 rounded-md px-6 py-3 font-bold text-white"
          >
            Browse products <ArrowRight size={18} aria-hidden="true" />
          </Link>
        </div>
        <div className="mt-12 grid gap-5 md:grid-cols-2">
          {shopLinks.map(({ icon: Icon, ...item }) => (
            <Card key={item.title} className="flex flex-col items-start">
              <Icon className="text-secondary" size={28} aria-hidden="true" />
              <h2 className="font-josefin mt-4 text-2xl font-bold">
                {item.title}
              </h2>
              <p className="text-primary-dark/75 mt-2 flex-1 leading-7">
                {item.description}
              </p>
              <Link
                to={item.to}
                className="text-primary hover:text-secondary mt-4 inline-flex min-h-11 items-center gap-2 font-bold"
              >
                {item.action} <ArrowRight size={18} aria-hidden="true" />
              </Link>
            </Card>
          ))}
        </div>
      </Section>
    </>
  );
}
