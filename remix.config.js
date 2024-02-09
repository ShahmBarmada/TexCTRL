/** @type {import('@remix-run/dev').AppConfig} */
export default {
  ignoredRouteFiles: ["**/.*"],
  serverModuleFormat: "esm",
  // publicPath: "/public/",
  // appDirectory: "app",
  // assetsBuildDirectory: "public/build",
  // serverBuildPath: "build/index.js",

  routes(defineRoutes) {
    return defineRoutes((route) => {
      route("/", "routes/home.tsx", { index: true });
      route("dashboard", "routes/dashboard/dashboard-layout.tsx", () => {
        route("", "routes/dashboard/dashboard.tsx", { index: true });

        route("admin", "routes/admin/admin-layout.tsx", () => {
          route("", "routes/admin/admin.tsx", { index: true });
        });

        route("settings", "routes/cfg/cfg-layout.tsx", () => {
          route("", "routes/cfg/cfg.tsx", { index: true });
        });

        route("accounts", "routes/acc/acc-layout.tsx", () => {
          route("", "routes/acc/acc.tsx", { index: true });
        });

        route("inventories", "routes/inv/inv-layout.tsx", () => {
          route("", "routes/inv/inv.tsx", { index: true });
        });

        route("operations", "routes/opr/opr-layout.tsx", () => {
          route("", "routes/opr/opr.tsx", { index: true });
        });

        route("partners", "routes/prt/prt-layout.tsx", () => {
          route("", "routes/prt/prt.tsx", { index: true });
        });

        route("products", "routes/prd/prd-layout.tsx", () => {
          route("", "routes/prd/prd.tsx", { index: true });
          route("classes", "routes/prd/prd-classes-layout.tsx", () => {
            route("", "routes/prd/prd-classes-index.tsx", { index: true }),
            route("new", "routes/prd/prd-classes-new.tsx"),
            route("view", "routes/prd/prd-classes-view.tsx"),
            route("edit", "routes/prd/prd-classes-edit.tsx");
          });
          route("mfts", "routes/prd/prd-mfts.tsx");
        });

        route("tasks", "routes/tsk/tsk-layout.tsx", () => {
          route("", "routes/tsk/tsk.tsx", { index: true });
        });
      });
    });
  },
};
