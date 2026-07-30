import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/cms/$type")({
  head: () => ({
    meta: [
      { title: "CMS — Admin" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: () => <Outlet />,
});
