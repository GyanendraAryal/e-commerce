import { Link, useLocation } from "react-router-dom";

type BreadcrumbPath = {
  title: string;
  link?: string;
};

type BreadCrumbProps = {
  title: string;
  paths?: BreadcrumbPath[];
};

const BreadCrumb = ({ title, paths = [] }: BreadCrumbProps) => {
  const location = useLocation();
  const segments = location.pathname.split("/").filter(Boolean);
  const items =
    paths.length > 0
      ? paths
      : segments.map((segment, index) => ({
          title: decodeURIComponent(segment),
          link: `/${segments.slice(0, index + 1).join("/")}`,
        }));

  return (
    <div className="bg-dark-white">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:py-10 lg:py-12">
        <p className="font-josefin text-primary-dark text-3xl font-bold capitalize sm:text-4xl">
          {title}
        </p>
        <nav aria-label="Breadcrumb" className="mt-2">
          <ol className="flex flex-wrap items-center gap-2 text-sm">
            <li>
              <Link
                className="hover:text-secondary inline-flex min-h-11 items-center"
                to="/"
              >
                Home
              </Link>
            </li>
            {items.map((item, index) => (
              <li
                key={`${item.title}-${index}`}
                className="flex items-center gap-2"
              >
                <span aria-hidden="true" className="text-primary-dark/50">
                  /
                </span>
                {item.link && index < items.length - 1 ? (
                  <Link
                    className="hover:text-secondary inline-flex min-h-11 items-center capitalize"
                    to={item.link}
                  >
                    {item.title}
                  </Link>
                ) : (
                  <span
                    aria-current="page"
                    className="text-primary-dark/70 inline-flex min-h-11 items-center capitalize"
                  >
                    {item.title}
                  </span>
                )}
              </li>
            ))}
          </ol>
        </nav>
      </div>
    </div>
  );
};

export default BreadCrumb;
