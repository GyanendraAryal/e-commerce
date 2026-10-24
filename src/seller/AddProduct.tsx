import React from "react";

function AddProduct() {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  return (
    <div className="container py-10 font-lato sm:py-14">
      <section className="mx-auto max-w-3xl overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-xl shadow-primary/5">
        <div className="border-b border-slate-100 bg-dark-white px-6 py-7 sm:px-10">
          <p className="mb-2 text-sm font-bold uppercase tracking-[0.18em] text-secondary">
            Seller workspace
          </p>
          <h1 className="font-josefin text-3xl font-bold text-primary-dark sm:text-4xl">
            Add a product
          </h1>
          <p className="mt-2 text-sm leading-6 text-slate-500 sm:text-base">
            Add the details shoppers need to discover your product.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 p-6 sm:p-10">
          <div>
            <label
              htmlFor="title"
              className="mb-2 block text-sm font-bold text-primary-dark"
            >
              Product name
            </label>
            <input
              id="title"
              name="title"
              type="text"
              placeholder="e.g. Everyday cotton shirt"
              className="w-full rounded-lg border border-slate-200 px-4 py-3 text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-primary focus:ring-4 focus:ring-primary/10"
            />
          </div>

          <div>
            <label
              htmlFor="description"
              className="mb-2 block text-sm font-bold text-primary-dark"
            >
              Description
            </label>
            <textarea
              id="description"
              name="description"
              rows={4}
              placeholder="Describe the product, its features, and what makes it special."
              className="w-full resize-y rounded-lg border border-slate-200 px-4 py-3 text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-primary focus:ring-4 focus:ring-primary/10"
            />
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <label
                htmlFor="price"
                className="mb-2 block text-sm font-bold text-primary-dark"
              >
                Price
              </label>
              <input
                id="price"
                name="price"
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00"
                className="w-full rounded-lg border border-slate-200 px-4 py-3 text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-primary focus:ring-4 focus:ring-primary/10"
              />
            </div>
            <div>
              <label
                htmlFor="stock"
                className="mb-2 block text-sm font-bold text-primary-dark"
              >
                Stock quantity
              </label>
              <input
                id="stock"
                name="stock"
                type="number"
                min="0"
                step="1"
                placeholder="0"
                className="w-full rounded-lg border border-slate-200 px-4 py-3 text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-primary focus:ring-4 focus:ring-primary/10"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="categoryId"
              className="mb-2 block text-sm font-bold text-primary-dark"
            >
              Category ID
            </label>
            <input
              id="categoryId"
              name="categoryId"
              type="number"
              min="1"
              placeholder="Enter the category ID"
              className="w-full rounded-lg border border-slate-200 px-4 py-3 text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-primary focus:ring-4 focus:ring-primary/10"
            />
          </div>

          <div>
            <label
              htmlFor="images"
              className="mb-2 block text-sm font-bold text-primary-dark"
            >
              Product images
            </label>
            <input
              id="images"
              name="images"
              type="file"
              accept="image/*"
              multiple
              className="block w-full cursor-pointer rounded-lg border border-dashed border-slate-300 bg-slate-50 text-sm text-slate-500 file:mr-4 file:cursor-pointer file:border-0 file:bg-primary/10 file:px-4 file:py-3 file:font-bold file:text-primary hover:border-primary/50"
            />
            <p className="mt-2 text-xs text-slate-500">
              You can select more than one image.
            </p>
          </div>

          <div className="flex justify-end border-t border-slate-100 pt-6">
            <button
              type="submit"
              className="w-full rounded-lg bg-secondary px-7 py-3.5 font-bold text-white shadow-lg shadow-secondary/20 transition hover:-translate-y-0.5 hover:bg-secondary/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary sm:w-auto"
            >
              Create product
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}

export default AddProduct;
