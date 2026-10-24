import ProductCardSkeleton from "./ProductCardSkeleton";

const ProductsListingSkeleton = () => {
  return (
    <div className="grid min-w-0 grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
      {[...Array(8)].map((_, index) => (
        <ProductCardSkeleton key={index} />
      ))}
    </div>
  );
};

export default ProductsListingSkeleton;
