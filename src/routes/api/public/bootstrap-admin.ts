import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/public/bootstrap-admin")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const body = (await request.json()) as {
          token?: string;
          email?: string;
          password?: string;
        };
        if (!body.token || body.token !== process.env.BOOTSTRAP_TOKEN) {
          return new Response("Forbidden", { status: 403 });
        }
        if (!body.email || !body.password) {
          return new Response("Missing email/password", { status: 400 });
        }

        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

        const { data: created, error } = await supabaseAdmin.auth.admin.createUser({
          email: body.email,
          password: body.password,
          email_confirm: true,
        });

        let userId = created?.user?.id;
        if (error) {
          const { data: list } = await supabaseAdmin.auth.admin.listUsers();
          const found = list?.users?.find(
            (u) => u.email?.toLowerCase() === body.email!.toLowerCase(),
          );
          if (!found) return new Response(`Create failed: ${error.message}`, { status: 500 });
          userId = found.id;
          await supabaseAdmin.auth.admin.updateUserById(userId, {
            password: body.password,
            email_confirm: true,
          });
        }

        const { error: roleErr } = await supabaseAdmin
          .from("user_roles")
          .upsert({ user_id: userId!, role: "admin" }, { onConflict: "user_id,role" });
        if (roleErr) return new Response(`Role failed: ${roleErr.message}`, { status: 500 });

        return Response.json({ ok: true, userId });
      },
    },
  },
});
