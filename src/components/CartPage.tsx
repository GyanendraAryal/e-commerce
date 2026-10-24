import { useCallback, useEffect, useState } from "react";
import type { FormEvent } from "react";
import { X, Minus, Plus, Package } from "lucide-react";
import axios from "axios";
import { api } from "../api";
import { useDispatch } from "react-redux";
import { setCount } from "../redux/features/cartSlice";
import CartSkeleton from "../skeletons/CartSkeleton";
import BreadCrumb from "./BreadCrumb";

type CartItem = {
  id: number;
  productId: number;
  name: string;
  price: number;
  qty: number;
  stock: number;
  img: string;
  sellerId: number;
  sellerName: string;
  shippingCharge: number;
};

type CartApiItem = {
  id: number;
  productId: number;
  quantity: number;
  product: {
    title: string;
    price: string;
    stock: number;
    images?: string[];
    user: {
      id: number;
      firstName: string;
      shipping_charge?: string | number;
    };
  };
};

type SellerShipping = {
  sellerId: number;
  shippingCharge: number;
};

export default function CartPage() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [orderError, setOrderError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    phone: "",
    address: "",
    secondaryAddress: "",
    paymentMode: "",
  });

  const fetchCarts = useCallback(() => {
    api
      .get("/carts", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        const mapped: CartItem[] = res.data.data.map(
          (cartItem: CartApiItem) => ({
            id: cartItem.id, // cart row id, used for update/remove
            productId: cartItem.productId,
            name: cartItem.product.title,
            price: parseFloat(cartItem.product.price),
            qty: cartItem.quantity,
            stock: cartItem.product.stock,
            img: cartItem.product.images?.[0] || "",
            sellerId: cartItem.product.user.id,
            sellerName: cartItem.product.user.firstName,
            shippingCharge: Number(cartItem.product.user.shipping_charge || 0),
          }),
        );
        const cartLength = res.data.data.length;
        dispatch(setCount(cartLength));
        setItems(mapped);
        // console.log("item length: ",items.length)
      })
      .catch((err: unknown) =>
        setError(
          err instanceof Error
            ? err.message
            : "We couldn't load your cart. Please try again.",
        ),
      )
      .finally(() => setLoading(false));
  }, [dispatch]);

  useEffect(() => {
    fetchCarts();
  }, [fetchCarts]);

  const updateQty = async (productId: number, id: number, quantity: number) => {
    const item = items.find((cartItem) => cartItem.id === id);
    if (!item) return;
    const nextQuantity = Math.min(item.stock, Math.max(1, quantity));
    try {
      await api.post(
        "/carts",
        {
          productId,
          quantity: nextQuantity,
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        },
      );
      setItems((previous) =>
        previous.map((cartItem) =>
          cartItem.id === id ? { ...cartItem, qty: nextQuantity } : cartItem,
        ),
      );
      setActionError(null);
    } catch {
      setActionError("We couldn't update that quantity. Please try again.");
    }
  };

  const removeItem = (id: number) => {
    setItems((prev) => prev.filter((it) => it.id !== id));
    dispatch(setCount(Math.max(0, items.length - 1)));
    setActionError(
      "The item was removed from this view only; saved-cart removal is not connected yet.",
    );
    // TODO: persist to backend, e.g.
    // axios.delete(`https://ecom-zb9o.vercel.app/api/carts/${id}`, { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } });
  };

  const clearCart = () => {
    setItems([]);
    dispatch(setCount(0));
    setActionError(
      "The cart was cleared from this view only; saved-cart removal is not connected yet.",
    );
  };

  const subtotal = items.reduce((sum, it) => sum + it.price * it.qty, 0);

  // Shipping: one flat charge per distinct seller in the cart

  // const shipping = Array.from(
  //   new Map(items.map((it) => [it.sellerName, it.shippingCharge])).values(),
  // ).reduce((sum, charge) => sum + charge, 0);

  const distinctSellers: SellerShipping[] = [];

  items.forEach((el) => {
    const exists = distinctSellers.find((seller) => {
      return seller.sellerId == el.sellerId;
    });
    if (!exists) {
      distinctSellers.push({
        sellerId: el.sellerId,
        shippingCharge: el.shippingCharge,
      });
    }
  });

  let shipping = 0;
  distinctSellers.forEach((el) => {
    shipping += el.shippingCharge;
  });

  const total = subtotal + shipping;

  const placeOrder = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setOrderError(null);
    setSubmitting(true);
    api
      .post(
        "/orders",
        {
          phone: formData.phone,
          paymentMode: formData.paymentMode,
          address: formData.address,
          secondaryAddress: formData.secondaryAddress || "",
          // products: [
          //   {
          //     productId: 1,
          //     quantity: 1,
          //   },
          // ],
          products: items.map((el) => {
            return {
              productId: el.productId,
              quantity: el.qty,
            };
          }),
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      )
      .then((res) => {
        // axios.post(
        //   "https://dev.khalti.com/api/v2/epayment/initiate/",
        //   {
        //     return_url: "http://example.com/",
        //     website_url: "https://example.com/",
        //     amount: "1000",
        //     purchase_order_id: "Order01",
        //     purchase_order_name: "test",
        //     customer_info: {
        //       name: "Ram Bahadur",
        //       email: "test@khalti.com",
        //       phone: "9800000001",
        //     },
        //   },
        //   {
        //     headers: {
        //       Authorization: "key a2d75bcf2a724cf6868a143deb6b8c2c",
        //       "Content-Type": "application/json",
        //     },
        //   },
        // );
        // similar to eswa: create form and append fiels for khalit

        // return;

        setSubmitting(true);
        const esewaData = res.data.data.esewa;
        const esewaForm = document.createElement("form");
        esewaForm.setAttribute(
          "action",
          "https://rc-epay.esewa.com.np/api/epay/main/v2/form",
        );
        esewaForm.setAttribute("method", "POST");

        Object.entries(esewaData).forEach(([key, value]) => {
          const input = document.createElement("input");
          input.setAttribute("type", "hidden");
          input.setAttribute("name", key);
          input.setAttribute("value", value as string);
          esewaForm.appendChild(input);
        });

        document.body.appendChild(esewaForm);
        esewaForm.submit();
      })
      .catch((err: unknown) => {
        setOrderError(
          axios.isAxiosError<{ msg?: string; message?: string }>(err)
            ? err.response?.data.msg ||
                err.response?.data.message ||
                "We couldn't place your order. Please try again."
            : "We couldn't place your order. Please try again.",
        );
      })
      .finally(() => setSubmitting(false));
  };

  if (loading) {
    return <CartSkeleton />;
  }

  if (error) {
    return (
      <div className="p-10 text-center text-red-500">
        Failed to load cart: {error}
      </div>
    );
  }

  return (
    <>
      <BreadCrumb title="Shopping Cart" paths={[{ title: "Shopping Cart" }]} />
      <div className="min-h-screen bg-white p-6 md:p-10">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 lg:grid-cols-[1fr_320px]">
          {/* Product table */}
          <div>
            <h1 className="font-josefin text-primary-dark mb-6 text-3xl font-bold">
              Shopping Cart
            </h1>
            {actionError && (
              <p
                role="status"
                className="mb-4 rounded-md bg-amber-50 p-3 text-sm text-amber-900"
              >
                {actionError}
              </p>
            )}
            <div className="hidden grid-cols-[2fr_1fr_1fr_1fr] pb-4 text-lg font-bold text-blue-900 sm:grid">
              <span>Product</span>
              <span>Price</span>
              <span>Quantity</span>
              <span className="text-right">Total</span>
            </div>

            <div className="divide-y divide-gray-200">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="grid grid-cols-2 items-center gap-x-3 gap-y-4 py-5 sm:grid-cols-[2fr_1fr_1fr_1fr] sm:gap-0"
                >
                  <div className="col-span-2 flex min-w-0 items-center gap-3 sm:col-span-1 sm:gap-4">
                    <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-md">
                      {item.img ? (
                        <img
                          src={item.img}
                          alt={item.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div
                          aria-hidden="true"
                          className="bg-dark-white text-primary/40 flex h-full w-full items-center justify-center"
                        >
                          <Package size={22} />
                        </div>
                      )}
                      <button
                        onClick={() => removeItem(item.id)}
                        type="button"
                        className="bg-primary-dark hover:bg-primary absolute top-0 left-0 flex size-11 items-center justify-center rounded-full text-white"
                        aria-label={`Remove ${item.name}`}
                      >
                        <X size={12} />
                      </button>
                    </div>
                    <div>
                      <p className="font-semibold break-words text-gray-800">
                        {item.name}
                      </p>
                      <p className="text-sm text-gray-400">
                        Sold by: {item.sellerName}
                      </p>
                    </div>
                  </div>

                  <span className="font-semibold text-blue-900">
                    <span className="mr-1 text-xs font-normal text-gray-500 sm:hidden">
                      Price
                    </span>
                    Rs. {item.price.toFixed(2)}
                  </span>

                  <div className="flex w-fit items-center gap-2 rounded bg-gray-100 px-2 py-1.5 text-gray-700 sm:gap-3 sm:px-3">
                    <button
                      onClick={() =>
                        updateQty(item.productId, item.id, item.qty - 1)
                      }
                      className="hover:text-primary-dark flex min-h-11 min-w-11 items-center justify-center"
                      type="button"
                      aria-label={`Decrease quantity for ${item.name}`}
                    >
                      <Minus size={14} />
                    </button>
                    <span className="w-4 text-center text-gray-700">
                      {item.qty}
                    </span>
                    <button
                      onClick={() =>
                        updateQty(item.productId, item.id, item.qty + 1)
                      }
                      className="hover:text-primary-dark flex min-h-11 min-w-11 items-center justify-center disabled:opacity-30"
                      type="button"
                      aria-label={`Increase quantity for ${item.name}`}
                      disabled={item.qty >= item.stock}
                    >
                      <Plus size={14} />
                    </button>
                  </div>

                  <span className="text-right font-semibold text-blue-900">
                    <span className="mr-1 text-xs font-normal text-gray-500 sm:hidden">
                      Total
                    </span>
                    Rs. {(item.price * item.qty).toFixed(2)}
                  </span>
                </div>
              ))}

              {items.length === 0 && (
                <p className="py-10 text-center text-gray-400">
                  Your cart is empty.
                </p>
              )}
            </div>

            <div className="mt-6 flex justify-between">
              <button className="bg-secondary hover:bg-secondary/90 min-h-11 rounded px-6 py-2.5 font-semibold text-white transition-colors">
                Update Cart
              </button>
              <button
                onClick={clearCart}
                type="button"
                className="bg-secondary hover:bg-secondary/90 min-h-11 rounded px-6 py-2.5 font-semibold text-white transition-colors"
              >
                Clear Cart
              </button>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            <div>
              <h2 className="mb-4 text-center text-lg font-bold text-blue-900 lg:text-left">
                Cart Totals
              </h2>
              <div className="space-y-4 rounded-lg bg-indigo-50 p-6">
                <div className="flex justify-between font-semibold text-blue-900">
                  <span>Subtotals:</span>
                  <span>Rs. {subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between border-t border-indigo-100 pt-4 font-semibold text-blue-900">
                  <span>shipping charge:</span>
                  <span>Rs. {shipping.toFixed(2)}</span>
                </div>
                <div className="flex justify-between border-t border-indigo-100 pt-4 font-semibold text-blue-900">
                  <span>Totals:</span>
                  <span>Rs. {total.toFixed(2)}</span>
                </div>
                <p className="flex items-center gap-2 text-sm text-gray-500">
                  <span className="inline-block h-2 w-2 rounded-full bg-green-500" />
                  Shipping & taxes calculated at checkout
                </p>
                {/* <button className="w-full rounded bg-green-500 py-3 font-semibold text-white transition-colors hover:bg-green-600">
                Proceed To Checkout
              </button> */}
              </div>
            </div>

            <div>
              <h2 className="mb-4 text-center text-lg font-bold text-blue-900 lg:text-left">
                Delivery Details
              </h2>
              <form
                onSubmit={placeOrder}
                className="space-y-5 rounded-lg bg-indigo-50 p-6"
              >
                <label
                  htmlFor="delivery-phone"
                  className="text-primary-dark block text-sm font-semibold"
                >
                  Phone number
                </label>
                <input
                  id="delivery-phone"
                  type="tel"
                  name="phone"
                  required
                  autoComplete="tel"
                  placeholder="Phone Number"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  className="focus:border-primary-dark min-h-11 w-full border-b border-gray-300 bg-transparent pb-2 text-gray-700 placeholder-gray-400 focus:outline-none"
                />

                <label
                  htmlFor="delivery-address"
                  className="text-primary-dark block text-sm font-semibold"
                >
                  Address
                </label>
                <input
                  id="delivery-address"
                  type="text"
                  name="address"
                  required
                  autoComplete="street-address"
                  placeholder="Address"
                  value={formData.address}
                  onChange={(e) =>
                    setFormData({ ...formData, address: e.target.value })
                  }
                  className="focus:border-primary-dark min-h-11 w-full border-b border-gray-300 bg-transparent pb-2 text-gray-700 placeholder-gray-400 focus:outline-none"
                />

                <label
                  htmlFor="delivery-address-secondary"
                  className="text-primary-dark block text-sm font-semibold"
                >
                  Secondary address (optional)
                </label>
                <input
                  id="delivery-address-secondary"
                  type="text"
                  name="secondaryAddress"
                  placeholder="Secondary Address (optional)"
                  value={formData.secondaryAddress}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      secondaryAddress: e.target.value,
                    })
                  }
                  className="focus:border-primary-dark min-h-11 w-full border-b border-gray-300 bg-transparent pb-2 text-gray-700 placeholder-gray-400 focus:outline-none"
                />

                <div className="space-y-2">
                  <p className="text-sm font-semibold text-blue-900">
                    Payment Mode
                  </p>
                  <fieldset className="flex gap-6">
                    <legend className="sr-only">Payment mode</legend>
                    <label className="flex min-h-11 cursor-pointer items-center gap-2">
                      <input
                        type="radio"
                        name="paymentMode"
                        value="cash"
                        checked={formData.paymentMode === "cash"}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            paymentMode: e.target.value,
                          })
                        }
                        className="accent-pink-500"
                      />
                      <span className="text-gray-700">Cash</span>
                    </label>
                    <label className="flex min-h-11 cursor-pointer items-center gap-2">
                      <input
                        type="radio"
                        name="paymentMode"
                        value="esewa"
                        checked={formData.paymentMode === "esewa"}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            paymentMode: e.target.value,
                          })
                        }
                        className="accent-pink-500"
                      />
                      <span className="text-gray-700">eSewa</span>
                    </label>
                  </fieldset>
                </div>

                {orderError && (
                  <p role="alert" className="text-sm font-medium text-red-700">
                    {orderError}
                  </p>
                )}
                <button
                  type="submit"
                  disabled={submitting || items.length === 0}
                  className="bg-secondary hover:bg-secondary/90 min-h-11 rounded px-6 py-2.5 font-semibold text-white transition-colors disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {submitting ? "Placing Order" : "Place Order"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
