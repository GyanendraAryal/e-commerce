import { useForm } from "react-hook-form";
import BreadCrumb from "../components/BreadCrumb";
import axios from "axios";
import { api } from "../api";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch } from "react-redux";
import { setUser } from "../redux/features/userSlice";

type LoginForm = {
  email: string;
  password: string;
};

// type LoginProps = {
//     setLoggedIn: (status: boolean) => void
// }
// { setLoggedIn }: LoginProps
const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>();

  const onSubmit = async (form: LoginForm) => {
    try {
      const res = await api.post("/login", form);

      if (res.data.msg) {
        // if (res.data.token) {
        // localStorage.setItem("token", res.data.token)
        // }
        if (res.data.token) {
          localStorage.setItem("token", res.data.token);
        }

        dispatch(setUser(res.data.user));
        toast.success("Login Successful");
        // setLoggedIn(true)
        if (res.data.user.isAdmin) {
          navigate("/admin/dashboard");
        } else {
          navigate("/");
        }
      }
    } catch (error: unknown) {
      toast.error(
        axios.isAxiosError<{ msg?: string; message?: string }>(error)
          ? error.response?.data.msg ||
              error.response?.data.message ||
              "Login Failed"
          : "Login Failed",
      );
    }
  };

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        theme="light"
        transition={Bounce}
      />

      <BreadCrumb
        title="My Account"
        paths={[
          {
            title: "login",
            link: "/login",
          },
        ]}
      />

      <div className="container mx-auto flex items-center justify-center py-10 sm:py-14">
        <div className="border-primary-dark/15 w-full max-w-md rounded-xl border bg-white p-6 shadow-sm sm:p-10">
          <form
            className="flex flex-col items-center gap-2"
            onSubmit={handleSubmit(onSubmit)}
          >
            <h1 className="font-josefin text-primary-dark text-3xl font-bold">
              Login
            </h1>

            <p className="font-lato mb-3 text-[17px] text-[#9096B2]">
              Please login using account details below.
            </p>

            <label htmlFor="login-email" className="w-full text-left font-bold">
              Email address
            </label>
            <input
              id="login-email"
              autoComplete="email"
              className="border-primary-dark/20 min-h-11 w-full rounded-md border p-3"
              placeholder="you@example.com"
              type="email"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^\S+@\S+\.\S+$/,
                  message: "Invalid email address",
                },
              })}
            />

            {errors.email && (
              <p className="self-start text-sm text-red-500">
                {errors.email.message}
              </p>
            )}

            <label
              htmlFor="login-password"
              className="w-full text-left font-bold"
            >
              Password
            </label>
            <input
              id="login-password"
              autoComplete="current-password"
              className="border-primary-dark/20 min-h-11 w-full rounded-md border p-3"
              type="password"
              placeholder="Password"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 8,
                  message: "Password must be at least 8 characters",
                },
              })}
            />

            {errors.password && (
              <p className="self-start text-sm text-red-500">
                {errors.password.message}
              </p>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className={`min-h-11 w-full rounded-md font-bold text-white ${
                isSubmitting
                  ? "bg-secondary/60 cursor-not-allowed"
                  : "bg-secondary hover:bg-secondary/90"
              }`}
            >
              {isSubmitting ? "Logging In..." : "Sign In"}
            </button>

            <p className="mt-4 text-[#9096B2]">
              Don't have an account?
              <Link
                to="/register"
                className="ml-1 inline-flex min-h-11 items-center hover:underline"
              >
                Create account
              </Link>
            </p>
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;
