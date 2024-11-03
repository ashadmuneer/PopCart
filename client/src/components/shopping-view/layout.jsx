import { Outlet } from "react-router-dom";
import ShoppingHeader from "./header";

function ShoppingLayout() {
  return (
    <div className="flex flex-col bg-white overflow-hidden">
      {/* Fixed Header */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <ShoppingHeader />
      </div>
      <main className="flex flex-col w-full mt-[64px]"> {/* Adjust margin-top according to header height */}
        <Outlet />
      </main>
    </div>
  );
}

export default ShoppingLayout;
