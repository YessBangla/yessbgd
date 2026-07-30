import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/cms")({
  head: () => ({
    meta: [
      { title: "Content management — Admin" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: () => <Outlet />,
});
