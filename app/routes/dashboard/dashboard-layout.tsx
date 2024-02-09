import { Outlet, NavLink } from "@remix-run/react";
import { LinksFunction } from "@remix-run/node";
import styles from "./styles.css";
import faBase from "../../assets/fonts/FontAwesome/css/fontawesome.min.css";
import faSolid from "../../assets/fonts/FontAwesome/css/solid.min.css";
// import faBrands from "../assets/fonts/FontAwesome/css/brands.min.css";
// import faRegular from "../assets/fonts/FontAwesome/css/regular.min.css";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: styles },
  { rel: "stylesheet", href: faBase },
  { rel: "stylesheet", href: faSolid },
  // { rel: "stylesheet", href: faBrands },
  // { rel: "stylesheet", href: faRegular },
];

export default function DashboardLayout() {
  return (
    <div id="main-wrapper">
      <div
        id="side-header"
        className="p-2 bg-slate-800 text-white flex place-content-center"
      >
        <span className="text-2xl font-['Bungee']">TexCTRL</span>
      </div>
      <div id="side-content" className="p-2 pt-8 bg-slate-800 text-white">
        <div className="flex flex-col gap-y-1">
          <NavLink
            to="/dashboard"
            end
            className={({ isActive }) =>
              `rounded p-2 hover:bg-slate-600 ${
                isActive ? "font-bold bg-slate-600" : ""
              }`
            }
          >
            <span className="flex justify-between">
              <span className="icon-big">
                <i className="fa-solid fa-chart-simple text-2xl" />
              </span>
              Dashboard
            </span>
          </NavLink>
          <NavLink
            to="/dashboard/accounts"
            className={({ isActive }) =>
              `rounded p-2 hover:bg-slate-600 ${
                isActive ? "font-bold bg-slate-600" : ""
              }`
            }
          >
            <span className="flex justify-between">
              <span className="icon-big">
                <i className="fa-solid fa-scale-balanced text-2xl" />
              </span>
              Accounts
            </span>
          </NavLink>

          <NavLink
            to="/dashboard/inventories"
            className={({ isActive }) =>
              `rounded p-2 hover:bg-slate-600 ${
                isActive ? "font-bold bg-slate-600" : ""
              }`
            }
          >
            <span className="flex justify-between">
              <span className="icon-big">
                <i className="fa-solid fa-warehouse text-2xl" />
              </span>
              Inventories
            </span>
          </NavLink>

          <NavLink
            to="/dashboard/operations"
            className={({ isActive }) =>
              `rounded p-2 hover:bg-slate-600 ${
                isActive ? "font-bold bg-slate-600" : ""
              }`
            }
          >
            <span className="flex justify-between">
              <span className="icon-big">
                <i className="fa-solid fa-timeline text-2xl" />
              </span>
              Operations
            </span>
          </NavLink>

          <NavLink
            to="/dashboard/partners"
            className={({ isActive }) =>
              `rounded p-2 hover:bg-slate-600 ${
                isActive ? "font-bold bg-slate-600" : ""
              }`
            }
          >
            <span className="flex justify-between">
              <span className="icon-big">
                <i className="fa-solid fa-id-card text-2xl" />
              </span>
              Partners
            </span>
          </NavLink>

          <NavLink
            to="/dashboard/products"
            className={({ isActive }) =>
              `rounded p-2 hover:bg-slate-600 ${
                isActive ? "font-bold bg-slate-600" : ""
              }`
            }
          >
            <span className="flex justify-between">
              <span className="icon-big">
                <i className="fa-solid fa-boxes-packing text-2xl" />
              </span>
              Products
            </span>
          </NavLink>

          <NavLink
            to="/dashboard/tasks"
            className={({ isActive }) =>
              `rounded p-2 hover:bg-slate-600 ${
                isActive ? "font-bold bg-slate-600" : ""
              }`
            }
          >
            <span className="flex justify-between">
              <span className="icon-big">
                <i className="fa-solid fa-clipboard-list text-2xl" />
              </span>
              Tasks
            </span>
          </NavLink>

          <div className="h-px border border-white"></div>

          <NavLink
            to="/dashboard/admin"
            className={({ isActive }) =>
              `rounded p-2 hover:bg-slate-600 ${
                isActive ? "font-bold bg-slate-600" : ""
              }`
            }
          >
            <span className="flex justify-between">
              <span className="icon-big">
                <i className="fa-solid fa-user-tie text-2xl" />
              </span>
              Admin
            </span>
          </NavLink>

          <NavLink
            to="/dashboard/settings"
            className={({ isActive }) =>
              `rounded p-2 hover:bg-slate-600 ${
                isActive ? "font-bold bg-slate-600" : ""
              }`
            }
          >
            <span className="flex justify-between">
              <span className="icon-big">
                <i className="fa-solid fa-gears text-2xl" />
              </span>
              Settings
            </span>
          </NavLink>
        </div>
      </div>
      <div
        id="side-footer"
        className="p-2 bg-slate-800 text-white flex place-content-center"
      >
        Xahm
      </div>
      <div id="main-content" className="bg-slate-800">
        <Outlet />
      </div>
    </div>
  );
}
