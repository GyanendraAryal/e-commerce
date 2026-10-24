import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { ArrowRight, Mail, MessageCircle } from "lucide-react";
import BreadCrumb from "../components/BreadCrumb";
import { Button, Card, Section } from "../components/ui";

type ContactForm = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

type Feedback = {
  type: "success" | "error";
  message: string;
};

async function submitContactMessage(_form: ContactForm): Promise<void> {
  if (!_form.name || !_form.email || !_form.subject || !_form.message) {
    throw new Error("Please complete all of the contact form fields.");
  }
  throw new Error(
    "The contact form is not connected to a message service yet. Please contact the site owner to wire up a submission endpoint.",
  );
}

export default function Contact() {
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactForm>();

  const onSubmit = async (form: ContactForm) => {
    setFeedback(null);
    try {
      await submitContactMessage(form);
      setFeedback({
        type: "success",
        message: "Your message has been sent. We'll be in touch soon.",
      });
      reset();
    } catch (error) {
      setFeedback({
        type: "error",
        message:
          error instanceof Error
            ? error.message
            : "We couldn't send your message. Please try again later.",
      });
    }
  };

  const inputClasses =
    "w-full rounded-md border border-primary-dark/20 px-4 py-3 text-primary-dark placeholder:text-primary-dark/50";

  return (
    <>
      <BreadCrumb title="Contact" paths={[{ title: "Contact" }]} />
      <Section>
        <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:gap-14">
          <div>
            <p className="text-secondary font-bold tracking-[0.15em] uppercase">
              Get in touch
            </p>
            <h1 className="font-josefin text-primary-dark mt-2 text-3xl font-bold sm:text-4xl">
              We'd love to hear from you
            </h1>
            <p className="text-primary-dark/75 mt-4 max-w-2xl leading-7">
              Send us a question about a product, your order, or anything else
              we can help with.
            </p>

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="mt-8 space-y-5"
              noValidate
            >
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="contact-name"
                    className="mb-2 block font-bold"
                  >
                    Name
                  </label>
                  <input
                    id="contact-name"
                    autoComplete="name"
                    className={inputClasses}
                    aria-invalid={!!errors.name}
                    aria-describedby={
                      errors.name ? "contact-name-error" : undefined
                    }
                    {...register("name", {
                      required: "Please enter your name.",
                      minLength: {
                        value: 2,
                        message: "Name must be at least 2 characters.",
                      },
                    })}
                  />
                  {errors.name && (
                    <p
                      id="contact-name-error"
                      className="mt-1 text-sm text-red-700"
                    >
                      {errors.name.message}
                    </p>
                  )}
                </div>
                <div>
                  <label
                    htmlFor="contact-email"
                    className="mb-2 block font-bold"
                  >
                    Email
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    autoComplete="email"
                    className={inputClasses}
                    aria-invalid={!!errors.email}
                    aria-describedby={
                      errors.email ? "contact-email-error" : undefined
                    }
                    {...register("email", {
                      required: "Please enter your email address.",
                      pattern: {
                        value: /^\S+@\S+\.\S+$/,
                        message: "Please enter a valid email address.",
                      },
                    })}
                  />
                  {errors.email && (
                    <p
                      id="contact-email-error"
                      className="mt-1 text-sm text-red-700"
                    >
                      {errors.email.message}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label
                  htmlFor="contact-subject"
                  className="mb-2 block font-bold"
                >
                  Subject
                </label>
                <input
                  id="contact-subject"
                  className={inputClasses}
                  aria-invalid={!!errors.subject}
                  aria-describedby={
                    errors.subject ? "contact-subject-error" : undefined
                  }
                  {...register("subject", {
                    required: "Please enter a subject.",
                  })}
                />
                {errors.subject && (
                  <p
                    id="contact-subject-error"
                    className="mt-1 text-sm text-red-700"
                  >
                    {errors.subject.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="contact-message"
                  className="mb-2 block font-bold"
                >
                  Message
                </label>
                <textarea
                  id="contact-message"
                  rows={6}
                  className={`${inputClasses} resize-y`}
                  aria-invalid={!!errors.message}
                  aria-describedby={
                    errors.message ? "contact-message-error" : undefined
                  }
                  {...register("message", {
                    required: "Please enter a message.",
                    minLength: {
                      value: 10,
                      message: "Please enter at least 10 characters.",
                    },
                  })}
                />
                {errors.message && (
                  <p
                    id="contact-message-error"
                    className="mt-1 text-sm text-red-700"
                  >
                    {errors.message.message}
                  </p>
                )}
              </div>

              {feedback && (
                <p
                  role={feedback.type === "error" ? "alert" : "status"}
                  className={`rounded-md px-4 py-3 text-sm ${
                    feedback.type === "error"
                      ? "bg-red-50 text-red-800"
                      : "bg-green-50 text-green-800"
                  }`}
                >
                  {feedback.message}
                </p>
              )}
              <p className="text-primary-dark/70 text-sm">
                Message sending is not available until a contact endpoint is
                connected.
              </p>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Sending..." : "Send message"}
                <ArrowRight className="ml-2" size={18} aria-hidden="true" />
              </Button>
            </form>
          </div>

          <aside className="space-y-5" aria-label="Contact information">
            <Card className="bg-dark-white">
              <Mail className="text-secondary" size={26} aria-hidden="true" />
              <h2 className="font-josefin mt-4 text-xl font-bold">
                Contact details
              </h2>
              <p className="text-primary-dark/75 mt-2 leading-6">
                We don't have a verified support email or office address
                configured for this store yet. Use the message form and connect
                it to your preferred contact service to enable replies.
              </p>
            </Card>
            <Card>
              <MessageCircle
                className="text-secondary"
                size={26}
                aria-hidden="true"
              />
              <h2 className="font-josefin mt-4 text-xl font-bold">
                Need order help?
              </h2>
              <p className="text-primary-dark/75 mt-2 leading-6">
                Sign in to review your purchases and order details.
              </p>
              <Link
                to="/orders"
                className="text-primary hover:text-secondary mt-3 inline-flex min-h-11 items-center font-bold"
              >
                View my orders
              </Link>
            </Card>
          </aside>
        </div>
      </Section>
    </>
  );
}
