import { useForm } from "react-hook-form"
import BreadCrumb from "../components/BreadCrumb"
import axios from "axios"
import { ToastContainer, toast, Bounce } from "react-toastify"
import { Link, useNavigate } from "react-router-dom"

type SignupForm = {
    firstName: string
    lastName: string
    email: string
    password: string
    isSeller: boolean
}

const Signup = () => {
    const navigate = useNavigate()

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting }
    } = useForm<SignupForm>({
        defaultValues: {
            isSeller: false
        }
    })

    const onSubmit = async (form: SignupForm) => {
        try {
            console.log(form)

            const res = await axios.post(
                "https://ecom-zb9o.vercel.app/api/signup",
                form
            )

            if (res.data.success) {
                toast.success("Account Created Successfully")

                reset()

                setTimeout(() => {
                    navigate("/login")
                }, 1500)
            }
        } catch (error: unknown) {
            console.log(error)

            if (axios.isAxiosError<{
                errors?: { msg: string }[]
                msg?: string
                message?: string
            }>(error) && error.response?.data.errors) {
                error.response.data.errors.forEach((err) => {
                    toast.error(err.msg)
                })
            } else {
                toast.error(
                    (axios.isAxiosError<{ msg?: string; message?: string }>(error)
                        ? error.response?.data.msg || error.response?.data.message
                        : undefined) || "Signup Failed"
                )
            }
        }
    }

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
                        link: "/register"
                    }
                ]}
            />

            <div className="container mx-auto flex items-center justify-center py-10 font-lato sm:py-14">
                <div className="w-full max-w-md overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-xl shadow-primary/5">
                    <div className="bg-dark-white px-6 py-8 text-center sm:px-10">
                        <p className="mb-2 text-sm font-bold uppercase tracking-[0.18em] text-secondary">
                            Welcome to Hekto
                        </p>
                        <h1 className="font-josefin text-3xl font-bold text-primary-dark">
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
                                    className="mb-2 block text-sm font-bold text-primary-dark"
                                >
                                    First name
                                </label>
                                <input
                                    id="firstName"
                                    type="text"
                                    autoComplete="given-name"
                                    placeholder="First name"
                                    className="w-full rounded-lg border border-slate-200 px-4 py-3 text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-primary focus:ring-4 focus:ring-primary/10"
                                    {...register("firstName", {
                                        required: "First Name is required"
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
                                    className="mb-2 block text-sm font-bold text-primary-dark"
                                >
                                    Last name
                                </label>
                                <input
                                    id="lastName"
                                    type="text"
                                    autoComplete="family-name"
                                    placeholder="Last name"
                                    className="w-full rounded-lg border border-slate-200 px-4 py-3 text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-primary focus:ring-4 focus:ring-primary/10"
                                    {...register("lastName", {
                                        required: "Last Name is required"
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
                                className="mb-2 block text-sm font-bold text-primary-dark"
                            >
                                Email address
                            </label>
                            <input
                                id="email"
                                type="email"
                                autoComplete="email"
                                placeholder="you@example.com"
                                className="w-full rounded-lg border border-slate-200 px-4 py-3 text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-primary focus:ring-4 focus:ring-primary/10"
                                {...register("email", {
                                    required: "Email is required",
                                    pattern: {
                                        value: /^\S+@\S+$/i,
                                        message: "Invalid email address"
                                    }
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
                                className="mb-2 block text-sm font-bold text-primary-dark"
                            >
                                Password
                            </label>
                            <input
                                id="password"
                                type="password"
                                autoComplete="new-password"
                                placeholder="At least 8 characters"
                                className="w-full rounded-lg border border-slate-200 px-4 py-3 text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-primary focus:ring-4 focus:ring-primary/10"
                                {...register("password", {
                                    required: "Password is required",
                                    minLength: {
                                        value: 8,
                                        message:
                                            "Password must be at least 8 characters"
                                    }
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
                                className="size-4 accent-primary"
                                {...register("isSeller")}
                            />
                            <span>Register as a seller</span>
                        </label>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className={`mt-2 h-14 w-full rounded-lg font-bold text-white shadow-lg transition ${
                                isSubmitting
                                    ? "cursor-not-allowed bg-secondary/50"
                                    : "bg-secondary shadow-secondary/20 hover:-translate-y-0.5 hover:bg-secondary/90"
                            }`}
                        >
                            {isSubmitting
                                ? "Creating account..."
                                : "Create account"}
                        </button>

                        <p className="mt-2 text-center text-sm text-slate-500">
                            Already have an account?
                            <Link
                                to="/login"
                                className="ml-1 font-bold text-primary hover:underline"
                            >
                                Log in
                            </Link>
                        </p>
                    </form>
                </div>
            </div>
        </>
    )
}

export default Signup