import { useState } from "react";
import { ShoppingCart } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../api";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../redux/store";
import { setCount } from "../redux/features/cartSlice";

export type ProductSummary = {
  id: number;
  title: string;
  price: string | number;
  description?: string;
  images?: Array<string | { image?: string }>;
};

type ProductCardProps = {
  products: ProductSummary[];
  layout?: "grid" | "list";
};

function ProductCard({ products, layout = "grid" }: ProductCardProps) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cartCount = useSelector((state: RootState) => state.cart.value.count);
  const [addingId, setAddingId] = useState<number | null>(null);
  const [message, setMessage] = useState("");

  const handleAddToCart = async (productId: number) => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    setAddingId(productId);
    setMessage("");
    try {
      await api.post(
        "/carts",
        { productId },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      dispatch(setCount(cartCount + 1));
      setMessage("Product added to your cart.");
    } catch {
      setMessage(
        "We couldn't add this product to your cart. Please try again.",
      );
    } finally {
      setAddingId(null);
    }
  };

  if (products.length === 0) {
    return (
      <p className="border-primary-dark/20 text-primary-dark/70 rounded-lg border border-dashed p-8 text-center">
        No products match your search. Try another term or clear your filters.
      </p>
    );
  }

  return (
    <div>
      {message && (
        <p role="status" className="text-primary-dark mb-4 text-sm font-medium">
          {message}
        </p>
      )}
      <ul
        className={
          layout === "grid"
            ? "grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3"
            : "grid grid-cols-1 gap-4"
        }
      >
        {products.map((product) => {
          const firstImage = product.images?.[0];
          const image =
            typeof firstImage === "string" ? firstImage : firstImage?.image;
          return (
            <li
              key={product.id}
              className={`border-primary-dark/10 overflow-hidden rounded-xl border bg-white shadow-sm transition-shadow hover:shadow-md ${
                layout === "list" ? "sm:flex" : ""
              }`}
            >
              <Link
                to={`/products/${product.id}`}
                className={`bg-dark-white block overflow-hidden ${
                  layout === "list"
                    ? "aspect-[4/3] sm:aspect-auto sm:w-56 sm:shrink-0"
                    : "aspect-[4/3]"
                }`}
              >
                {image ? (
                  <img
                    src={image}
                    alt={product.title}
                    loading="lazy"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div
                    role="img"
                    aria-label={`${product.title} image unavailable`}
                    className="font-josefin text-primary/40 flex h-full min-h-40 items-center justify-center text-4xl font-bold"
                  >
                    H
                  </div>
                )}
              </Link>
              <div className="flex min-w-0 flex-1 flex-col p-4">
                <div className="flex items-start justify-between gap-3">
                  <Link
                    to={`/products/${product.id}`}
                    className="font-josefin text-primary-dark hover:text-secondary inline-flex min-h-11 items-center text-lg font-bold"
                  >
                    {product.title}
                  </Link>
                  <span className="text-primary-dark shrink-0 font-bold">
                    Rs. {Number(product.price).toLocaleString()}
                  </span>
                </div>
                <p className="text-primary-dark/70 mt-2 line-clamp-3 text-sm leading-6">
                  {product.description || "View this product for more details."}
                </p>
                <div className="mt-auto flex flex-wrap items-center gap-2 pt-4">
                  <button
                    type="button"
                    onClick={() => void handleAddToCart(product.id)}
                    disabled={addingId === product.id}
                    className="bg-secondary hover:bg-secondary/90 inline-flex min-h-11 items-center gap-2 rounded-md px-4 py-2 text-sm font-bold text-white disabled:opacity-60"
                  >
                    <ShoppingCart size={17} aria-hidden="true" />
                    {addingId === product.id ? "Adding..." : "Add to cart"}
                  </button>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default ProductCard;
