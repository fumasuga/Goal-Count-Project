import Header from "@/components/layouts/header/header.component";
import CreateGoal from "@/components/layouts/goal/create";
import { GoalSkeleton } from "@/components/layouts/goal/goalSkeleton";
import { Suspense } from "react";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function AddGoal() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();
  if (!data || error) {
    redirect("/");
  }
  return (
    <>
      <Header />
      <main className="flex justify-center min-h-[700px] items-center p-[16px]">
        <CreateGoal />
      </main>
    </>
  );
}
