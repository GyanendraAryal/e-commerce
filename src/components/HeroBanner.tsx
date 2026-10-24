import { ArrowRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { Section } from "./ui";

export default function HeroBanner() {
  return (
    <Section className="bg-dark-white overflow-hidden py-10 sm:py-14 lg:py-20">
      <div className="grid items-center gap-10 md:grid-cols-2 md:gap-8">
        <div className="order-2 md:order-1">
          <p className="text-secondary mb-4 inline-flex items-center gap-2 font-bold">
            <Sparkles size={17} aria-hidden="true" />
            Find something you'll love
          </p>
          <h1 className="font-josefin text-primary-dark max-w-2xl text-4xl leading-tight font-bold sm:text-5xl lg:text-6xl">
            A little more you, in every detail.
          </h1>
          <p className="text-primary-dark/75 mt-5 max-w-xl text-base leading-7 sm:text-lg">
            Explore a considered collection of everyday finds, made easier to
            browse and shop.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/products"
              className="bg-secondary hover:bg-secondary/90 inline-flex min-h-11 items-center justify-center gap-2 rounded-md px-6 py-3 font-bold text-white transition-colors"
            >
              Explore products <ArrowRight size={18} aria-hidden="true" />
            </Link>
            <Link
              to="/shop"
              className="border-primary text-primary hover:bg-primary inline-flex min-h-11 items-center justify-center rounded-md border px-6 py-3 font-bold transition-colors hover:text-white"
            >
              Browse the shop
            </Link>
          </div>
        </div>
        <div className="order-1 flex min-h-64 items-center justify-center md:order-2 md:min-h-96">
          <div
            aria-hidden="true"
            className="from-secondary-light to-primary/25 relative flex aspect-square w-full max-w-md items-center justify-center rounded-full bg-gradient-to-br via-white"
          >
            <div className="absolute inset-[12%] rounded-full border border-white/80" />
            <div className="absolute inset-[23%] rounded-full border border-white/70" />
            <div className="shadow-primary/10 relative flex size-36 items-center justify-center rounded-3xl bg-white/80 shadow-xl sm:size-48">
              <span className="font-josefin text-primary text-4xl font-bold tracking-tight sm:text-5xl">
                H
              </span>
            </div>
            <span className="bg-secondary absolute top-[14%] right-[7%] size-5 rounded-full sm:size-7" />
            <span className="bg-primary absolute bottom-[11%] left-[12%] size-4 rounded-full sm:size-6" />
          </div>
        </div>
      </div>
    </Section>
  );
}
