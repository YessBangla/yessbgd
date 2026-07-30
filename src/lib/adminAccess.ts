// Role-aware access helpers for the dashboard.
//
// Three dashboard personas, mapped onto the `app_role` enum:
//   admin      — full control panel
//   moderator  — operations desk (job applications + contact messages)
//   user       — content editor (pages, content, media)
//
// Every check is only a *view* filter: the database keeps enforcing the real
// rules through RLS policies, so hiding a card can never be the only guard.
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type DashboardRole = "admin" | "moderator" | "user";

export type Capability =
  | "pages"
  | "content"
  | "media"
  | "menus"
  | "settings"
  | "applications"
  | "messages"
  | "audit";

const CAPABILITIES: Record<DashboardRole, Capability[]> = {
  admin: ["pages", "content", "media", "menus", "settings", "applications", "messages", "audit"],
  moderator: ["applications", "messages"],
  user: ["pages", "content", "media"],
};

export const ROLE_LABEL: Record<DashboardRole, { en: string; bn: string; help: string }> = {
  admin: {
    en: "Administrator",
    bn: "অ্যাডমিনিস্ট্রেটর",
    help: "পুরো ড্যাশবোর্ডে সম্পূর্ণ অ্যাক্সেস।",
  },
  moderator: {
    en: "Operations",
    bn: "অপারেশন টিম",
    help: "চাকরির আবেদন ও যোগাযোগ বার্তা দেখাশোনা করেন।",
  },
  user: {
    en: "Content editor",
    bn: "কনটেন্ট এডিটর",
    help: "পেইজ, কনটেন্ট ও ছবি সম্পাদনা করেন।",
  },
};

/** Highest role held by the signed-in dashboard user. */
export function useDashboardRole() {
  const query = useQuery({
    queryKey: ["admin", "role"],
    staleTime: 60_000,
    queryFn: async (): Promise<{ role: DashboardRole; userId: string | null; email: string | null }> => {
      const { data: auth } = await supabase.auth.getUser();
      const user = auth.user;
      if (!user) return { role: "user", userId: null, email: null };
      const { data } = await supabase.from("user_roles").select("role").eq("user_id", user.id);
      const roles = (data ?? []).map((r) => r.role as DashboardRole);
      const role: DashboardRole = roles.includes("admin")
        ? "admin"
        : roles.includes("moderator")
          ? "moderator"
          : "user";
      return { role, userId: user.id, email: user.email ?? null };
    },
  });

  const role = query.data?.role ?? "user";
  return {
    role,
    userId: query.data?.userId ?? null,
    email: query.data?.email ?? null,
    isLoading: query.isLoading,
    can: (cap: Capability) => CAPABILITIES[role].includes(cap),
  };
}

export function roleCan(role: DashboardRole, cap: Capability) {
  return CAPABILITIES[role].includes(cap);
}

/* --------------------------------- profile -------------------------------- */

export type Profile = {
  id: string;
  full_name: string | null;
  phone: string | null;
  job_title: string | null;
  avatar_url: string | null;
  language: string;
  theme: string;
  items_per_page: number;
  notify_new_application: boolean;
  notify_new_message: boolean;
  created_at: string;
  updated_at: string;
};

export function useProfile() {
  const qc = useQueryClient();
  const query = useQuery({
    queryKey: ["admin", "profile"],
    staleTime: 60_000,
    queryFn: async (): Promise<Profile | null> => {
      const { data: auth } = await supabase.auth.getUser();
      const user = auth.user;
      if (!user) return null;
      const { data } = await supabase.from("profiles").select("*").eq("id", user.id).maybeSingle();
      if (data) return data as unknown as Profile;
      // Row missing (account created before profiles existed) — create it now.
      const { data: created } = await supabase
        .from("profiles")
        .insert({ id: user.id } as never)
        .select("*")
        .maybeSingle();
      return (created ?? null) as unknown as Profile | null;
    },
  });

  const save = async (patch: Partial<Profile>) => {
    const id = query.data?.id;
    if (!id) throw new Error("No profile loaded");
    const { error } = await supabase.from("profiles").update(patch as never).eq("id", id);
    if (error) throw error;
    await qc.invalidateQueries({ queryKey: ["admin", "profile"] });
  };

  return { profile: query.data ?? null, isLoading: query.isLoading, save };
}
