import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const ProductCardSkeleton = () => {
  return (
    <div className="min-w-0 rounded-lg bg-white p-4 shadow-sm">
      <Skeleton height={220} borderRadius={8} />

      <div className="mt-4">
        <Skeleton height={22} width="75%" />
      </div>

      <div className="mt-3">
        <Skeleton height={18} width="45%" />
      </div>

      <div className="mt-4 flex items-center justify-between">
        <Skeleton width={80} height={24} />
        <Skeleton circle width={36} height={36} />
      </div>
    </div>
  );
};

export default ProductCardSkeleton;
