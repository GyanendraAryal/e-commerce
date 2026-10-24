import { useEffect, useState } from "react";
import { api } from "../api";
import { ChevronDown, ChevronUp, Package } from "lucide-react";
import BreadCrumb from "./BreadCrumb";
import OrdersSkeleton from "../skeletons/OrdersSkeleton";

type OrderItem = {
  id: number;
  productTitle: string;
  quantity: number;
  price: number | string;
};

type SubOrder = {
  id: number;
  status: string;
  seller: { firstName: string; lastName: string };
  subTotal: string;
  deliveryCharge: string;
  orderItems: OrderItem[];
};

type Order = {
  id: number;
  reference: string;
  createdAt: string;
  phone: string;
  address: string;
  secondaryAddress?: string;
  paymentMode: string;
  status: string;
  paymentStatus: string;
  subOrders: SubOrder[];
};

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-700 ring-1 ring-yellow-200",
  processing: "bg-blue-100 text-blue-700 ring-1 ring-blue-200",
  shipped: "bg-indigo-100 text-indigo-700 ring-1 ring-indigo-200",
  delivered: "bg-green-100 text-green-700 ring-1 ring-green-200",
  cancelled: "bg-red-100 text-red-700 ring-1 ring-red-200",
};

const paymentStatusColors: Record<string, string> = {
  paid: "bg-green-100 text-green-700 ring-1 ring-green-200",
  unpaid: "bg-red-100 text-red-700 ring-1 ring-red-200",
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<Record<number, boolean>>({});
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    let active = true;
    api
      .get("/orders", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        if (active) {
          setOrders(res.data.data);
          setError(null);
        }
      })
      .catch((err: unknown) => {
        if (active) {
          setError(
            err instanceof Error
              ? err.message
              : "We couldn't load your orders. Please try again.",
          );
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [retryCount]);

  const toggleExpand = (orderId: number) => {
    setExpanded((prev) => ({ ...prev, [orderId]: !prev[orderId] }));
  };

  const orderTotal = (order: Order) =>
    order.subOrders.reduce(
      (sum, sub) =>
        sum + parseFloat(sub.subTotal) + parseFloat(sub.deliveryCharge),
      0,
    );

  const orderItemCount = (order: Order) =>
    order.subOrders.reduce((sum, sub) => sum + sub.orderItems.length, 0);

  if (loading) {
    return <OrdersSkeleton />;
  }

  if (error) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-2 p-10 text-center">
        <p className="font-semibold text-red-500">Failed to load orders</p>
        <p className="text-sm text-gray-400">{error}</p>
        <button
          onClick={() => {
            setLoading(true);
            setRetryCount((count) => count + 1);
          }}
          className="mt-2 min-h-11 rounded-lg bg-red-50 px-4 py-2 text-sm font-semibold text-red-700 transition hover:bg-red-100"
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <>
      <BreadCrumb
        title="Orders"
        paths={[{ title: "orders", link: "/orders" }]}
      />
      <div className="min-h-screen bg-gray-50 p-6 md:p-10">
        <div className="mx-auto max-w-5xl">
          <h1 className="mb-8 text-center text-2xl font-bold tracking-tight text-blue-900 lg:text-left">
            My Orders
          </h1>

          {orders.length === 0 && (
            <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-gray-200 bg-white py-24 text-gray-400">
              <Package size={44} strokeWidth={1.5} />
              <p className="font-medium">You haven't placed any orders yet.</p>
            </div>
          )}

          <div className="space-y-5">
            {orders.map((order) => {
              const isOpen = !!expanded[order.id];
              return (
                <div
                  key={order.id}
                  className={`overflow-hidden rounded-2xl border bg-white shadow-sm transition-shadow duration-200 ${
                    isOpen
                      ? "border-indigo-200 shadow-md"
                      : "border-gray-200 hover:shadow-md"
                  }`}
                >
                  {/* Order header */}
                  <button
                    onClick={() => toggleExpand(order.id)}
                    type="button"
                    aria-expanded={isOpen}
                    className="flex min-h-11 w-full flex-col gap-4 p-5 text-left transition-colors sm:flex-row sm:items-center sm:justify-between sm:gap-3"
                  >
                    <div>
                      <p className="text-xs font-medium tracking-wide text-gray-400 uppercase">
                        Order Reference
                      </p>
                      <p className="font-semibold text-blue-900">
                        {order.reference}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs font-medium tracking-wide text-gray-400 uppercase">
                        Placed On
                      </p>
                      <p className="font-semibold text-blue-900">
                        {new Date(order.createdAt).toLocaleDateString(
                          undefined,
                          { year: "numeric", month: "short", day: "numeric" },
                        )}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs font-medium tracking-wide text-gray-400 uppercase">
                        Items
                      </p>
                      <p className="font-semibold text-blue-900">
                        {orderItemCount(order)}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs font-medium tracking-wide text-gray-400 uppercase">
                        Total
                      </p>
                      <p className="font-semibold text-blue-900">
                        Rs. {orderTotal(order).toFixed(2)}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${
                          statusColors[order.status] ||
                          "bg-gray-100 text-gray-700 ring-1 ring-gray-200"
                        }`}
                      >
                        {order.status}
                      </span>
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${
                          paymentStatusColors[order.paymentStatus] ||
                          "bg-gray-100 text-gray-700 ring-1 ring-gray-200"
                        }`}
                      >
                        {order.paymentStatus}
                      </span>
                      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gray-50 text-blue-900 transition-transform">
                        {isOpen ? (
                          <ChevronUp size={16} />
                        ) : (
                          <ChevronDown size={16} />
                        )}
                      </span>
                    </div>
                  </button>

                  {/* Order details */}
                  {isOpen && (
                    <div className="divide-y divide-gray-100 border-t border-gray-100 bg-gray-50/50 p-5">
                      <div className="grid grid-cols-1 gap-4 pb-5 text-sm text-gray-500 sm:grid-cols-3">
                        <div>
                          <p className="mb-0.5 text-xs font-semibold tracking-wide text-blue-900 uppercase">
                            Phone
                          </p>
                          <p>{order.phone}</p>
                        </div>
                        <div>
                          <p className="mb-0.5 text-xs font-semibold tracking-wide text-blue-900 uppercase">
                            Address
                          </p>
                          <p>
                            {order.address}
                            {order.secondaryAddress
                              ? `, ${order.secondaryAddress}`
                              : ""}
                          </p>
                        </div>
                        <div>
                          <p className="mb-0.5 text-xs font-semibold tracking-wide text-blue-900 uppercase">
                            Payment Mode
                          </p>
                          <p className="capitalize">{order.paymentMode}</p>
                        </div>
                      </div>

                      {order.subOrders.map((sub) => (
                        <div key={sub.id} className="py-5 first:pt-0">
                          <div className="mb-3 flex items-center justify-between">
                            <p className="text-sm font-semibold text-gray-700">
                              Sold by:{" "}
                              <span className="text-blue-900">
                                {sub.seller.firstName} {sub.seller.lastName}
                              </span>
                            </p>
                            <span
                              className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${
                                statusColors[sub.status] ||
                                "bg-gray-100 text-gray-700 ring-1 ring-gray-200"
                              }`}
                            >
                              {sub.status}
                            </span>
                          </div>

                          <div className="space-y-3 rounded-xl bg-white p-4 shadow-sm ring-1 ring-gray-100">
                            {sub.orderItems.map((item) => (
                              <div
                                key={item.id}
                                className="flex items-center justify-between text-sm"
                              >
                                <span className="text-gray-700">
                                  {item.productTitle}{" "}
                                  <span className="text-gray-400">
                                    x{item.quantity}
                                  </span>
                                </span>
                                <span className="font-semibold text-blue-900">
                                  Rs.{" "}
                                  {(Number(item.price) * item.quantity).toFixed(
                                    2,
                                  )}
                                </span>
                              </div>
                            ))}

                            <div className="flex justify-between border-t border-gray-100 pt-3 text-sm">
                              <span className="text-gray-500">
                                Delivery Charge
                              </span>
                              <span className="font-semibold text-blue-900">
                                Rs. {parseFloat(sub.deliveryCharge).toFixed(2)}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}

                      <div className="flex justify-between pt-5 text-base font-bold text-blue-900">
                        <span>Order Total</span>
                        <span>Rs. {orderTotal(order).toFixed(2)}</span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
