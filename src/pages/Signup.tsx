import { useForm } from "react-hook-form";
import BreadCrumb from "../components/BreadCrumb";
import axios from "axios";
import { api } from "../api";
import { ToastContainer, toast, Bounce } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";

type SignupForm = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  isSeller: boolean;
};

const Signup = () => {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<SignupForm>({
    defaultValues: {
      isSeller: false,
    },
  });

  const onSubmit = async (form: SignupForm) => {
    try {
      const res = await api.post("/signup", form);

      if (res.data.success) {
        toast.success("Account Created Successfully");

        reset();

        setTimeout(() => {
          navigate("/login");
        }, 1500);
      }
    } catch (error: unknown) {
      if (
        axios.isAxiosError<{
          errors?: { msg: string }[];
          msg?: string;
          message?: string;
        }>(error) &&
        error.response?.data.errors
      ) {
        error.response.data.errors.forEach((err) => {
          toast.error(err.msg);
        });
      } else {
        toast.error(
          (axios.isAxiosError<{ msg?: string; message?: string }>(error)
            ? error.response?.data.msg || error.response?.data.message
            : undefined) || "Signup Failed",
        );
      }
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
            title: "register",
            link: "/register",
          },
        ]}
      />

      <div className="font-lato container mx-auto flex items-center justify-center py-10 sm:py-14">
        <div className="shadow-primary/5 w-full max-w-md overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-xl">
          <div className="bg-dark-white px-6 py-8 text-center sm:px-10">
            <p className="text-secondary mb-2 text-sm font-bold tracking-[0.18em] uppercase">
              Welcome to Hekto
            </p>
            <h1 className="font-josefin text-primary-dark text-3xl font-bold">
              Create your account
            </h1>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              Join us to find products you’ll love.
            </p>
          </div>
          <form
            className="flex flex-col gap-4 p-6 sm:p-10"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="firstName"
                  className="text-primary-dark mb-2 block text-sm font-bold"
                >
                  First name
                </label>
                <input
                  id="firstName"
                  type="text"
                  autoComplete="given-name"
                  placeholder="First name"
                  className="focus:border-primary focus:ring-primary/10 w-full rounded-lg border border-slate-200 px-4 py-3 text-slate-800 transition outline-none placeholder:text-slate-400 focus:ring-4"
                  {...register("firstName", {
                    required: "First Name is required",
                  })}
                />
                {errors.firstName && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.firstName.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="lastName"
                  className="text-primary-dark mb-2 block text-sm font-bold"
                >
                  Last name
                </label>
                <input
                  id="lastName"
                  type="text"
                  autoComplete="family-name"
                  placeholder="Last name"
                  className="focus:border-primary focus:ring-primary/10 w-full rounded-lg border border-slate-200 px-4 py-3 text-slate-800 transition outline-none placeholder:text-slate-400 focus:ring-4"
                  {...register("lastName", {
                    required: "Last Name is required",
                  })}
                />
                {errors.lastName && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.lastName.message}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label
                htmlFor="email"
                className="text-primary-dark mb-2 block text-sm font-bold"
              >
                Email address
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                className="focus:border-primary focus:ring-primary/10 w-full rounded-lg border border-slate-200 px-4 py-3 text-slate-800 transition outline-none placeholder:text-slate-400 focus:ring-4"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^\S+@\S+$/i,
                    message: "Invalid email address",
                  },
                })}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="password"
                className="text-primary-dark mb-2 block text-sm font-bold"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                autoComplete="new-password"
                placeholder="At least 8 characters"
                className="focus:border-primary focus:ring-primary/10 w-full rounded-lg border border-slate-200 px-4 py-3 text-slate-800 transition outline-none placeholder:text-slate-400 focus:ring-4"
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 8,
                    message: "Password must be at least 8 characters",
                  },
                })}
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.password.message}
                </p>
              )}
            </div>

            <label className="flex cursor-pointer items-center gap-3 rounded-lg bg-slate-50 px-4 py-3 text-sm text-slate-600">
              <input
                type="checkbox"
                id="seller"
                className="accent-primary size-4"
                {...register("isSeller")}
              />
              <span>Register as a seller</span>
            </label>

            <button
              type="submit"
              disabled={isSubmitting}
              className={`mt-2 h-14 w-full rounded-lg font-bold text-white shadow-lg transition ${
                isSubmitting
                  ? "bg-secondary/50 cursor-not-allowed"
                  : "bg-secondary shadow-secondary/20 hover:bg-secondary/90 hover:-translate-y-0.5"
              }`}
            >
              {isSubmitting ? "Creating account..." : "Create account"}
            </button>

            <p className="mt-2 text-center text-sm text-slate-500">
              Already have an account?
              <Link
                to="/login"
                className="text-primary ml-1 inline-flex min-h-11 items-center font-bold hover:underline"
              >
                Log in
              </Link>
            </p>
          </form>
        </div>
      </div>
    </>
  );
};

export default Signup;
