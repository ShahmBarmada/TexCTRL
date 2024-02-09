import type { MetaFunction } from "@remix-run/node";
import { NavLink, Outlet } from "@remix-run/react";

export const meta: MetaFunction = () => {
  return [{ title: "TexCTRL Inventories" }, { name: "TexCTRL Mokhmal" }];
};

export default function InvLayout() {
  return (
    <div className="bg-slate-800 flex flex-col h-full">
      <div className="px-8 h-12 text-white flex items-center justify-between gap-x-6">
        <NavLink to={"/dashboard/inventories"} className={"grow-0 w-48"}>
          <span className="font-[Oxygen] text-xl font-semibold">Inventories</span>
        </NavLink>
        <div className="flex gap-x-2 self-end grow">
          <NavLink
            to={"/"}
            className={({ isActive }) =>
              `rounded-t px-2 hover:bg-slate-600 ${
                isActive ? "bg-slate-600" : ""
              }`
            }
          >
            <span>Link 1</span>
          </NavLink>
          <NavLink
            to={"/"}
            className={({ isActive }) =>
              `rounded-t px-2 hover:bg-slate-600 ${
                isActive ? "bg-slate-600" : ""
              }`
            }
          >
            <span>Link 2</span>
          </NavLink>
          <NavLink
            to={"/"}
            className={({ isActive }) =>
              `rounded-t px-2 hover:bg-slate-600 ${
                isActive ? "bg-slate-600" : ""
              }`
            }
          >
            <span>Link 3</span>
          </NavLink>
          <NavLink
            to={"/"}
            className={({ isActive }) =>
              `rounded-t px-2 hover:bg-slate-600 ${
                isActive ? "bg-slate-600" : ""
              }`
            }
          >
            <span>Link 4</span>
          </NavLink>
          <NavLink
            to={"/"}
            className={({ isActive }) =>
              `rounded-t px-2 hover:bg-slate-600 ${
                isActive ? "bg-slate-600" : ""
              }`
            }
          >
            <span>Link 5</span>
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
      <div className="p-2 rounded-tl-lg bg-slate-100 grow">
        <Outlet />
      </div>
    </div>
  );
}
