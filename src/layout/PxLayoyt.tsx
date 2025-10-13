import { Outlet } from "react-router-dom";

export default function PxLayout() {
  return (
    <>
      <main className="px-6">
        <Outlet />
      </main>
    </>
  );
}
