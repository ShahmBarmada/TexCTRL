import type { MetaFunction } from "@remix-run/node";
import { NavLink, Outlet } from "@remix-run/react";

export const meta: MetaFunction = () => {
  return [{ title: "TexCTRL Products" }, { name: "TexCTRL Mokhmal" }];
};

export default function PrdLayout() {
  return (
    <div className="bg-slate-800 flex flex-col h-full">
      <div className="px-8 h-12 text-white flex items-center justify-between gap-x-6">
        <NavLink to={"/dashboard/products"} className={"grow-0 w-48"}>
          <span className="font-[Oxygen] text-xl font-semibold">Products</span>
        </NavLink>
        <div className="flex gap-x-2 self-end grow">
          <NavLink
            to={"/dashboard/products"}
            end
            className={({ isActive }) => `rounded-t px-2 hover:bg-slate-600 ${isActive ? "bg-slate-600" : ""}`}
          >
            <span>All Products</span>
          </NavLink>
          <NavLink
            to={"/dashboard/products/classes"}
            className={({ isActive }) => `rounded-t px-2 hover:bg-slate-600 ${isActive ? "bg-slate-600" : ""}`}
          >
            <span>Classes</span>
          </NavLink>
          <NavLink
            to={"/dashboard/products/mfts"}
            className={({ isActive }) => `rounded-t px-2 hover:bg-slate-600 ${isActive ? "bg-slate-600" : ""}`}
          >
            <span>Manufacturing Templates</span>
          </NavLink>
        </div>
        <div className="grow-0">
          <input
            id="headersearch"
            name="headersearch"
            type="search"
            placeholder="search ..."
            className="outline-none rounded p-1 w-72"
          />
        </div>
      </div>
      <div className="p-2 rounded-tl-lg bg-slate-100 grow flex">
        <Outlet />
      </div>
    </div>
  );
}
