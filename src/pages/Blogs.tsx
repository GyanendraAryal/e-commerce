import { ArrowRight, BookOpen, Search, ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";
import BreadCrumb from "../components/BreadCrumb";
import { Card, Section } from "../components/ui";

const articles = [
  {
    icon: Search,
    category: "Shopping guide",
    title: "A more thoughtful way to browse",
    excerpt:
      "Start with what matters to you, use product details to compare options, and take your time choosing.",
  },
  {
    icon: ShoppingBag,
    category: "Store guide",
    title: "Getting around the Hekto shop",
    excerpt:
      "Search for a product, filter the catalog by category, and open an item to see its full details.",
  },
  {
    icon: BookOpen,
    category: "Account guide",
    title: "Where to find your order details",
    excerpt:
      "Once you are signed in, your orders page brings together order status, delivery details, and items.",
  },
];

export default function Blogs() {
  return (
    <>
      <BreadCrumb title="Journal" paths={[{ title: "Journal" }]} />
      <Section>
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-secondary font-bold tracking-[0.15em] uppercase">
            The Hekto journal
          </p>
          <h1 className="font-josefin text-primary-dark mt-3 text-4xl font-bold sm:text-5xl">
            Guides for a better shop
          </h1>
          <p className="text-primary-dark/75 mt-5 leading-7">
            Helpful notes on finding products and using the store.
          </p>
        </div>
        <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {articles.map(({ icon: Icon, ...article }) => (
            <Card key={article.title} className="flex flex-col">
              <Icon className="text-secondary" size={27} aria-hidden="true" />
              <p className="text-secondary mt-5 text-sm font-bold tracking-wide uppercase">
                {article.category}
              </p>
              <h2 className="font-josefin text-primary-dark mt-2 text-xl font-bold">
                {article.title}
              </h2>
              <p className="text-primary-dark/75 mt-3 flex-1 leading-7">
                {article.excerpt}
              </p>
              <Link
                to="/products"
                className="text-primary hover:text-secondary mt-5 inline-flex min-h-11 items-center gap-2 font-bold"
              >
                Explore products <ArrowRight size={18} aria-hidden="true" />
              </Link>
            </Card>
          ))}
        </div>
      </Section>
    </>
  );
}
