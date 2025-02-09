"use server";
import { revalidatePath } from "next/cache";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
import { z } from "zod";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

const goalSchema = z.object({
  title: z.string().min(1, "please enter a title").max(25),
  description: z.string().min(1, "please enter a description").max(200),
  deadline: z
    .string()
    .refine((date) => !isNaN(Date.parse(date)), "invalid date format"),
});

// 新規目標登録
export async function addGoal(formData: FormData) {
  let redirectTo = "/error";
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (!user || error) {
      throw new Error("Unauthorized");
    }

    const userData = await prisma.user.findUnique({
      where: { auth_id: user?.id },
    });
    if (!userData) {
      throw new Error("Unauthorized");
    }
    const validated = goalSchema.safeParse({
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      deadline: formData.get("deadline"),
    });

    if (!validated.success) {
      console.error(validated.error.errors);
      throw new Error(
        validated.error.errors.map((error) => error.message).join(",")
      );
    }

    await prisma.goal.create({
      data: {
        title: validated.data.title,
        description: validated.data.description,
        deadline: new Date(validated.data.deadline),
        user_id: userData.id,
      },
    });

    redirectTo = "/goal";
  } catch (error) {
    if (error instanceof Error) {
      console.log(error.stack);
      console.log("Failed to create content interaction:", error);
    }
    console.log("Failed to create content interaction:", error);
  }

  revalidatePath("/", "layout");
  redirect(redirectTo);
}
