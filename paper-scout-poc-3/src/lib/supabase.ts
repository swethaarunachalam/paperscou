import { supabase } from "@/integrations/supabase/client";

export const signUp = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${window.location.origin}/profile-setup`,
    },
  });
  return { data, error };
};

export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { data, error };
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  return { error };
};

export const createProfile = async (
  userId: string,
  email: string,
  domain: string,
  expertiseLevel: string,
  goal: string
) => {
  const { data, error } = await supabase
    .from("profiles")
    .insert([
      {
        user_id: userId,
        email,
        domain,
        expertise_level: expertiseLevel,
        goal,
      },
    ])
    .select()
    .single();
  return { data, error };
};

export const getProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", userId)
    .single();
  return { data, error };
};

export const updateProfile = async (
  userId: string,
  updates: {
    domain?: string;
    expertise_level?: string;
    goal?: string;
  }
) => {
  const { data, error } = await supabase
    .from("profiles")
    .update(updates)
    .eq("user_id", userId)
    .select()
    .single();
  return { data, error };
};

export const getPapers = async () => {
  const { data, error } = await supabase
    .from("papers")
    .select("*")
    .order("publication_date", { ascending: false });
  return { data, error };
};

export const submitFeedback = async (
  userId: string,
  paperId: string,
  isHelpful: boolean
) => {
  const { data, error } = await supabase
    .from("feedback")
    .upsert(
      [
        {
          user_id: userId,
          paper_id: paperId,
          is_helpful: isHelpful,
        },
      ],
      {
        onConflict: "user_id,paper_id",
      }
    )
    .select()
    .single();
  return { data, error };
};
