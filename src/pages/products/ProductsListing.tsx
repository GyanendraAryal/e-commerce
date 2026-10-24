import { useEffect, useState } from "react";
import { Grid, List } from "lucide-react";
import { api } from "../../api";
import { useSearchParams } from "react-router-dom";
import BreadCrumb from "../../components/BreadCrumb";
import ProductCard, { type ProductSummary } from "../../components/ProductCard";
import ProductsListingSkeleton from "../../skeletons/ProductsListingSkeleton";

type SubCategory = {
  id: number;
  title: string;
  parentId: number;
  createdAt: string;
  updatedAt: string;
};

type Category = {
  id: number;
  title: string;
  parentId: number;
  createdAt: string;
  updatedAt: string;
  subCategories: SubCategory[];
};

function ProductsListing() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<ProductSummary[]>([]);
  const [perPage, setPerPage] = useState(25);
  const [categoryIds, setCategoryIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [categoryError, setCategoryError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [layout, setLayout] = useState<"grid" | "list">("grid");
  const [searchParams, setSearchParams] = useSearchParams();
  const sort = searchParams.get("sort") || "";
  const searchTerm = searchParams.get("q") || "";

  useEffect(() => {
    let active = true;
    api
      .get("/categories")
      .then((res) => {
        if (active) setCategories(res.data.data);
      })
      .catch(() => {
        if (active) setCategoryError(true);
      });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    let active = true;
    const params = new URLSearchParams({
      q: searchTerm,
      limit: String(perPage),
      page: "1",
      sort,
      categoryIds: categoryIds.join(","),
    });
    api
      .get(`/products?${params.toString()}`)
      .then((res) => {
        if (active) {
          setProducts(res.data.data.products);
          setError(null);
        }
      })
      .catch(() => {
        if (active) setError("We couldn't load products. Please try again.");
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });
    return () => {
      active = false;
    };
  }, [perPage, categoryIds, searchTerm, sort, retryCount]);

  const sortHandler = (sortValue: string) => {
    setIsLoading(true);
    const newParams = new URLSearchParams(searchParams);
    if (sortValue) newParams.set("sort", sortValue);
    else newParams.delete("sort");
    setSearchParams(newParams);
  };

  const updateCategory = (value: string, checked: boolean) => {
    setIsLoading(true);
    setCategoryIds((previous) =>
      checked
        ? [...new Set([...previous, value])]
        : previous.filter((id) => id !== value),
    );
  };

  return (
    <>
      <BreadCrumb title="Products" paths={[{ title: "Products" }]} />
      <section className="mx-auto max-w-7xl px-4 py-8 sm:py-12">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="font-josefin text-primary-dark text-2xl font-bold sm:text-3xl">
              Products &amp; accessories
            </h1>
            <p className="text-primary-dark/70 mt-2 text-sm" aria-live="polite">
              {isLoading
                ? "Loading products..."
                : `${products.length} products shown`}
            </p>
          </div>
          <div className="flex flex-wrap items-end gap-3">
            <div>
              <label
                htmlFor="per-page"
                className="mb-1 block text-sm font-semibold"
              >
                Per page
              </label>
              <select
                id="per-page"
                value={perPage}
                onChange={(event) => {
                  setIsLoading(true);
                  setPerPage(Number(event.target.value));
                }}
                className="border-primary-dark/20 min-h-11 rounded-md border bg-white px-3"
              >
                <option value={25}>25</option>
                <option value={10}>10</option>
                <option value={4}>4</option>
              </select>
            </div>
            <div>
              <label
                htmlFor="product-sort"
                className="mb-1 block text-sm font-semibold"
              >
                Sort by
              </label>
              <select
                id="product-sort"
                value={sort}
                onChange={(event) => sortHandler(event.target.value)}
                className="border-primary-dark/20 min-h-11 max-w-full rounded-md border bg-white px-3"
              >
                <option value="">Recommended</option>
                <option value="latest">Latest</option>
                <option value="oldest">Oldest</option>
                <option value="priceAsc">Price: low to high</option>
                <option value="priceDesc">Price: high to low</option>
              </select>
            </div>
            <div className="flex items-center gap-1">
              <span className="sr-only">Product layout</span>
              <button
                type="button"
                aria-label="Grid view"
                aria-pressed={layout === "grid"}
                onClick={() => setLayout("grid")}
                className={`flex min-h-11 min-w-11 items-center justify-center rounded-md ${
                  layout === "grid"
                    ? "bg-primary text-white"
                    : "text-primary-dark hover:bg-dark-white"
                }`}
              >
                <Grid size={19} aria-hidden="true" />
              </button>
              <button
                type="button"
                aria-label="List view"
                aria-pressed={layout === "list"}
                onClick={() => setLayout("list")}
                className={`flex min-h-11 min-w-11 items-center justify-center rounded-md ${
                  layout === "list"
                    ? "bg-primary text-white"
                    : "text-primary-dark hover:bg-dark-white"
                }`}
              >
                <List size={19} aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-[240px_minmax(0,1fr)]">
          <aside className="bg-dark-white rounded-xl p-5">
            <h2 className="font-josefin text-primary-dark text-xl font-bold">
              Categories
            </h2>
            {categoryError ? (
              <p role="alert" className="mt-3 text-sm text-red-700">
                Categories are unavailable right now.
              </p>
            ) : (
              <ul className="mt-4 space-y-3">
                {categories.map((category) => (
                  <li key={category.id}>
                    <label className="flex min-h-11 cursor-pointer items-center gap-2 font-semibold">
                      <input
                        type="checkbox"
                        value={category.id}
                        checked={categoryIds.includes(String(category.id))}
                        onChange={(event) =>
                          updateCategory(
                            event.target.value,
                            event.target.checked,
                          )
                        }
                        className="accent-primary size-4"
                      />
                      <span className="capitalize">{category.title}</span>
                    </label>
                    {category.subCategories.map((subCategory) => (
                      <label
                        key={subCategory.id}
                        className="ml-5 flex min-h-11 cursor-pointer items-center gap-2 text-sm"
                      >
                        <input
                          type="checkbox"
                          value={subCategory.id}
                          checked={categoryIds.includes(String(subCategory.id))}
                          onChange={(event) =>
                            updateCategory(
                              event.target.value,
                              event.target.checked,
                            )
                          }
                          className="accent-primary size-4"
                        />
                        <span>{subCategory.title}</span>
                      </label>
                    ))}
                  </li>
                ))}
                {categories.length === 0 && !categoryError && (
                  <li className="text-primary-dark/70 text-sm">
                    No categories available.
                  </li>
                )}
              </ul>
            )}
          </aside>

          <div className="min-w-0">
            {error ? (
              <div
                role="alert"
                className="rounded-lg border border-red-200 bg-red-50 p-6 text-red-800"
              >
                <p>{error}</p>
                <button
                  type="button"
                  onClick={() => {
                    setIsLoading(true);
                    setRetryCount((count) => count + 1);
                  }}
                  className="mt-3 min-h-11 font-bold underline"
                >
                  Retry
                </button>
              </div>
            ) : isLoading ? (
              <ProductsListingSkeleton />
            ) : (
              <ProductCard products={products} layout={layout} />
            )}
          </div>
        </div>
      </section>
    </>
  );
}

export default ProductsListing;
