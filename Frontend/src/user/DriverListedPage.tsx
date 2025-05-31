import  { Suspense, lazy } from "react";

const DriverList = lazy(() => import("../components/ListDrivers")); // Lazy import

const DriverListedPage = () => {
  return (
    <Suspense fallback={<p>Loading drivers...</p>}>
      <DriverList />
    </Suspense>
  );
};

export default DriverListedPage;
