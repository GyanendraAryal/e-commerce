import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../../api";
import { ShoppingCart, Package } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../redux/store";
import { setCount } from "../../redux/features/cartSlice";
import ProductReviews from "./DummyReviews";
import ProductDetailsSkeleton from "../../skeletons/ProductDetailsSkeleton";
import BreadCrumb from "../../components/BreadCrumb";

interface Category {
  id: number;
  title: string;
  parentId: number | null;
}

interface Product {
  id: number;
  title: string;
  categoryId: number;
  price: string;
  description: string;
  stock: number;
  isFeatured: boolean;
  userId: number;
  status: string;
  remarks: string | null;
  createdAt: string;
  updatedAt: string;
  category: Category;
  images: {
    id: number;
    image: string;
  }[];
}

const ProductDetails = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cartCount = useSelector((state: RootState) => state.cart.value.count);
  const [product, setProduct] = useState<Product | null>(null);
  const [loadedSlug, setLoadedSlug] = useState<string | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("description");
  const [activeImage, setActiveImage] = useState<string | null>(null);
  const [addingToCart, setAddingToCart] = useState(false);
  const [cartMessage, setCartMessage] = useState("");

  useEffect(() => {
    let active = true;
    if (!slug) return;
    api
      .get(`/products/${slug}`)
      .then((res) => {
        if (active) {
          setProduct(res.data.data);
          setActiveImage(res.data.data.images?.[0]?.image ?? null);
          setLoadError(null);
        }
      })
      .catch(() => {
        if (active) {
          setProduct(null);
          setLoadError("We couldn't load this product. Please try again.");
        }
      })
      .finally(() => {
        if (active) setLoadedSlug(slug);
      });
    return () => {
      active = false;
    };
  }, [slug]);

  const addToCart = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    if (!product) return;
    setAddingToCart(true);
    setCartMessage("");
    try {
      await api.post(
        "/carts",
        { productId: product.id },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      dispatch(setCount(cartCount + 1));
      setCartMessage("Product added to your cart.");
    } catch {
      setCartMessage(
        "We couldn't add this product to your cart. Please try again.",
      );
    } finally {
      setAddingToCart(false);
    }
  };

  if (loadedSlug !== slug) {
    return (
      <>
        <BreadCrumb
          title="Products Details"
          paths={[{ title: "Products" }, { title: "Product Details" }]}
        />

        <ProductDetailsSkeleton />
      </>
    );
  }

  if (!product) {
    return (
      <>
        <div
          role={loadError ? "alert" : "status"}
          className="mx-auto max-w-7xl px-4 py-20 text-center"
        >
          {loadError || "Product not found."}
        </div>
      </>
    );
  }

  return (
    <>
      <BreadCrumb
        title="Product Details"
        paths={[
          { title: "Products", link: "/products" },
          { title: product.title },
        ]}
      />
      <section className="mx-auto max-w-7xl px-4 py-10 sm:py-16">
        <div className="grid min-w-0 grid-cols-1 items-start gap-8 rounded-xl bg-white p-4 sm:p-6 lg:grid-cols-2 lg:gap-14 lg:p-10">
          {/* Images */}
          <div className="flex min-w-0 flex-col-reverse gap-4 sm:flex-row sm:gap-5">
            {/* Thumbnails */}
            <div className="flex min-w-0 flex-row gap-3 overflow-x-auto sm:flex-col sm:overflow-visible">
              {product.images.length > 0 ? (
                product.images.map((img) => (
                  <button
                    key={img.id}
                    type="button"
                    onClick={() => setActiveImage(img.image)}
                    aria-label={`Show image ${product.images.indexOf(img) + 1} of ${product.title}`}
                    aria-pressed={activeImage === img.image}
                    className={`size-16 shrink-0 overflow-hidden rounded-lg border sm:size-20 ${
                      activeImage === img.image
                        ? "border-secondary"
                        : "border-primary-dark/20"
                    }`}
                  >
                    <img
                      src={img.image}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  </button>
                ))
              ) : (
                <>
                  <div
                    aria-hidden="true"
                    className="border-primary-dark/10 bg-dark-white size-16 shrink-0 rounded-lg border sm:size-20"
                  />
                </>
              )}
            </div>

            {/* Main Image */}
            <div className="bg-dark-white flex min-h-64 min-w-0 flex-1 items-center justify-center overflow-hidden rounded-xl sm:min-h-96 lg:min-h-[500px]">
              {product.images.length > 0 ? (
                <img
                  src={activeImage || product.images[0].image}
                  alt={product.title}
                  className="h-full max-h-[500px] w-full object-contain"
                />
              ) : (
                <Package size={120} className="text-gray-300" />
              )}
            </div>
          </div>

          {/* Right Side */}
          <div className="flex min-w-0 flex-col justify-center">
            <h1 className="font-josefin text-primary-dark mt-2 text-3xl font-bold break-words capitalize sm:text-4xl">
              {product.title}
            </h1>

            <h2 className="text-primary-dark mt-4 text-2xl font-bold break-words sm:text-3xl">
              Rs. {product.price}
            </h2>

            <p className="font-josefin mt-6 leading-8 font-bold text-gray-500">
              {product.description}
            </p>
            <div className="mt-8 flex items-center gap-5">
              <button
                type="button"
                onClick={() => void addToCart()}
                disabled={product.stock < 1 || addingToCart}
                className="bg-secondary hover:bg-secondary/90 inline-flex min-h-11 items-center gap-2 rounded-md px-6 py-3 font-bold text-white disabled:cursor-not-allowed disabled:opacity-60"
              >
                {addingToCart ? "Adding..." : "Add to cart"}
                <ShoppingCart size={18} aria-hidden="true" />
              </button>
            </div>
            {cartMessage && (
              <p role="status" className="text-primary-dark mt-3 text-sm">
                {cartMessage}
              </p>
            )}

            <div className="mt-10 space-y-3 text-sm">
              <div className="flex">
                <span className="w-28 font-semibold">Category</span>
                <span className="text-gray-600 capitalize">
                  {product.category.title}
                </span>
              </div>

              <div className="flex">
                <span className="w-28 font-semibold">Stock</span>
                <span className="text-gray-600">{product.stock}</span>
              </div>

              <div className="flex">
                <span className="w-28 font-semibold">Status</span>
                <span className="text-gray-600 capitalize">
                  {product.status}
                </span>
              </div>

              <div className="flex">
                <span className="w-28 font-semibold">Featured</span>
                <span className="text-gray-600">
                  {product.isFeatured ? "Yes" : "No"}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 rounded-xl p-4 shadow-sm sm:p-8 lg:p-10">
          <div className="flex flex-wrap gap-x-5 border-b pb-2 sm:gap-x-10">
            <button
              type="button"
              onClick={() => setActiveTab("description")}
              className={`min-h-11 border-b-2 px-1 whitespace-nowrap transition-colors ${activeTab === "description" ? "border-secondary text-primary-dark font-semibold" : "hover:text-secondary border-transparent"}`}
              aria-pressed={activeTab === "description"}
            >
              Description
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("additional-information")}
              className={`min-h-11 border-b-2 px-1 whitespace-nowrap transition-colors ${activeTab === "additional-information" ? "border-secondary text-primary-dark font-semibold" : "hover:text-secondary border-transparent"}`}
              aria-pressed={activeTab === "additional-information"}
            >
              Additional Info
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("reviews")}
              className={`min-h-11 border-b-2 px-1 whitespace-nowrap transition-colors ${activeTab === "reviews" ? "border-secondary text-primary-dark font-semibold" : "hover:text-secondary border-transparent"}`}
              aria-pressed={activeTab === "reviews"}
            >
              Reviews
            </button>
          </div>

          {activeTab === "description" ? (
            <div className="mt-10">
              <h2 className="mb-6 text-2xl font-semibold">
                Product Description
              </h2>

              <p className="leading-8 text-gray-600">{product.description}</p>
            </div>
          ) : activeTab === "additional-information" ? (
            <div className="mt-10 overflow-hidden rounded-lg border border-gray-200">
              <table className="w-full text-left">
                <tbody>
                  <tr className="border-b">
                    <th className="w-1/3 bg-gray-50 px-6 py-4 font-semibold">
                      Product ID
                    </th>
                    <td className="px-6 py-4 text-gray-600">#{product.id}</td>
                  </tr>

                  <tr className="border-b">
                    <th className="bg-gray-50 px-6 py-4 font-semibold">
                      Category
                    </th>
                    <td className="px-6 py-4 text-gray-600 capitalize">
                      {product.category.title}
                    </td>
                  </tr>

                  <tr className="border-b">
                    <th className="bg-gray-50 px-6 py-4 font-semibold">
                      Price
                    </th>
                    <td className="px-6 py-4 text-gray-600">
                      Rs. {product.price}
                    </td>
                  </tr>

                  <tr className="border-b">
                    <th className="bg-gray-50 px-6 py-4 font-semibold">
                      Stock
                    </th>
                    <td className="px-6 py-4 text-gray-600">
                      {product.stock} Available
                    </td>
                  </tr>

                  <tr className="border-b">
                    <th className="bg-gray-50 px-6 py-4 font-semibold">
                      Status
                    </th>
                    <td className="px-6 py-4 text-gray-600 capitalize">
                      {product.status}
                    </td>
                  </tr>

                  <tr className="border-b">
                    <th className="bg-gray-50 px-6 py-4 font-semibold">
                      Featured
                    </th>
                    <td className="px-6 py-4 text-gray-600">
                      {product.isFeatured ? "Yes" : "No"}
                    </td>
                  </tr>

                  <tr className="border-b">
                    <th className="bg-gray-50 px-6 py-4 font-semibold">
                      Added On
                    </th>
                    <td className="px-6 py-4 text-gray-600">
                      {new Date(product.createdAt).toLocaleDateString()}
                    </td>
                  </tr>

                  <tr>
                    <th className="bg-gray-50 px-6 py-4 font-semibold">
                      Last Updated
                    </th>
                    <td className="px-6 py-4 text-gray-600">
                      {new Date(product.updatedAt).toLocaleDateString()}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          ) : activeTab === "reviews" ? (
            <ProductReviews />
          ) : (
            ""
          )}
        </div>
      </section>
    </>
  );
};

export default ProductDetails;
