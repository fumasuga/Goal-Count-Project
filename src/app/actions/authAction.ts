"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/utils/supabase/server";
import { z } from "zod";

type State = {
  errors?: {
    name?: string[];
    email?: string[];
  };
  message: string | null;
};

const UserSchema = z.object({
  email: z.string().min(1, "please enter a email").max(50),
  password: z.string().min(1, "please enter a password").max(200),
});

export async function login(prevState: State, formData: FormData) {
  const supabase = await createClient();

  const validatedFields = UserSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to Login",
    };
  }

  const { email, password } = validatedFields.data;
  console.log(email, password);
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    return {
      message: "Database Error: Failed to Login",
    };
  }

  revalidatePath("/", "layout");
  redirect("/goal");
}

export async function signup(prevState: State, formData: FormData) {
  const supabase = await createClient();

  const validatedFields = UserSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to Create User",
    };
  }

  const { email, password } = validatedFields.data;

  const { error } = await supabase.auth.signUp({ email, password });

  if (error) {
    return {
      message: "Database Error: Failed to Create User",
    };
  }

  revalidatePath("/", "layout");
  redirect("/");
}

export async function signout() {
  const supabase = await createClient();

  await supabase.auth.signOut();

  revalidatePath("/", "layout");
  redirect("/");
}
