import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import axios from "axios";
import { api } from "./api.ts";
import { setUser } from "./redux/features/userSlice.ts";
import { useDispatch } from "react-redux";
import { lazy, Suspense, useEffect, useState } from "react";
import type { ReactNode } from "react";
import ProtectedRoutes from "./pages/ProtectedRoutes.tsx";
import Layout from "./pages/Layout.tsx";

const Home = lazy(() => import("./pages/Home.tsx"));
const Login = lazy(() => import("./pages/Login.tsx"));
const Signup = lazy(() => import("./pages/Signup.tsx"));
const ProductsListing = lazy(
  () => import("./pages/products/ProductsListing.tsx"),
);
const ProductDetails = lazy(
  () => import("./pages/products/ProductDetails.tsx"),
);
const Cart = lazy(() => import("./components/CartPage.tsx"));
const Orders = lazy(() => import("./components/Orders.tsx"));
const Contact = lazy(() => import("./pages/Contact.tsx"));
const Blogs = lazy(() => import("./pages/Blogs.tsx"));
const Shop = lazy(() => import("./pages/Shop.tsx"));
const AdminLayout = lazy(() => import("./components/layout/AdminLayout.tsx"));
const Dashboard = lazy(() => import("./admin/Dashboard.tsx"));
const Categories = lazy(() => import("./admin/Categories.tsx"));
const Products = lazy(() => import("./admin/Products.tsx"));
const NotFound = lazy(() => import("./pages/NotFound.tsx"));
const AccessDenied = lazy(() => import("./pages/AccessDenied.tsx"));
const SellerProduct = lazy(() => import("./seller/SellerProduct.tsx"));

function Page({ children }: { children: ReactNode }) {
  return (
    <Suspense
      fallback={
        <p
          role="status"
          className="text-secondary flex min-h-48 items-center justify-center text-lg font-bold"
        >
          Loading page...
        </p>
      }
    >
      {children}
    </Suspense>
  );
}

function App() {
  const token = localStorage.getItem("token");
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(token ? true : false);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    if (token) {
      api
        .get("/auth/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          dispatch(setUser(res.data));
        })
        .catch((error: unknown) => {
          setAuthError(
            axios.isAxiosError<{ msg?: string; message?: string }>(error)
              ? error.response?.data.msg ||
                  error.response?.data.message ||
                  "We couldn't verify your sign-in. Please log in again."
              : "We couldn't verify your sign-in. Please log in again.",
          );
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [dispatch, token]);

  const router = createBrowserRouter([
    {
      // 7.47
      path: "admin",
      element: <ProtectedRoutes forAdmin={true} />,
      children: [
        {
          path: "",
          element: (
            <Page>
              <AdminLayout />
            </Page>
          ),
          children: [
            { index: true, element: <Navigate to="dashboard" replace /> },
            {
              path: "dashboard",
              element: (
                <Page>
                  <Dashboard />
                </Page>
              ),
            },
            {
              path: "categories",
              element: (
                <Page>
                  <Categories />
                </Page>
              ),
            },
            {
              path: "products",
              element: (
                <Page>
                  <Products />
                </Page>
              ),
            },
          ],
        },
      ],
    },
    {
      path: "/",
      element: <Layout />,
      children: [
        {
          path: "",
          element: (
            <Page>
              <Home />
            </Page>
          ),
        },
        {
          path: "login",
          element: (
            <Page>
              <Login />
            </Page>
          ),
        },
        {
          path: "register",
          element: (
            <Page>
              <Signup />
            </Page>
          ),
        },
        {
          path: "shop",
          element: (
            <Page>
              <Shop />
            </Page>
          ),
        },
        {
          path: "blogs",
          element: (
            <Page>
              <Blogs />
            </Page>
          ),
        },
        {
          path: "contact",
          element: (
            <Page>
              <Contact />
            </Page>
          ),
        },
        {
          path: "forbidden",
          element: (
            <Page>
              <AccessDenied />
            </Page>
          ),
        },
        {
          path: "products",
          children: [
            {
              path: "",
              element: (
                <Page>
                  <ProductsListing />
                </Page>
              ),
            },
            {
              path: ":slug",
              element: (
                <Page>
                  <ProductDetails />
                </Page>
              ),
            },
          ],
        },
        {
          path: "",
          element: <ProtectedRoutes />,
          children: [
            {
              path: "/carts",
              element: (
                <Page>
                  <Cart />
                </Page>
              ),
            },
            {
              path: "/orders",
              element: (
                <Page>
                  <Orders />
                </Page>
              ),
            },
          ],
        },
        {
          path: "",
          element: <ProtectedRoutes forSeller />,
          children: [
            {
              path: "my-products",
              element: (
                <Page>
                  <SellerProduct />
                </Page>
              ),
            },
          ],
        },
        {
          path: "*",
          element: (
            <Page>
              <NotFound />
            </Page>
          ),
        },
      ],
    },
    {
      path: "*",
      element: (
        <Page>
          <NotFound />
        </Page>
      ),
    },
  ]);

  return (
    <div>
      {isLoading ? (
        <p
          role="status"
          className="text-secondary flex min-h-screen items-center justify-center text-2xl font-bold sm:text-4xl"
        >
          Loading...
        </p>
      ) : (
        <>
          {authError && (
            <p
              role="alert"
              className="border-b border-red-200 bg-red-50 px-4 py-3 text-center text-sm text-red-800"
            >
              {authError}
            </p>
          )}
          <RouterProvider router={router} />
        </>
      )}
    </div>
  );
}

export default App;
