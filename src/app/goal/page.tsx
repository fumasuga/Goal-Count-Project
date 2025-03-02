import Goal from "@/components/layouts/goal";
import { GoalSkeleton } from "@/components/layouts/goal/goalSkeleton";
import Header from "@/components/layouts/header/header.component";
import { AlertDialog } from "@/components/ui/alert-dialog";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { Suspense } from "react";

export default async function GoalList() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();
  if (!data || error) {
    redirect("/");
  }
  return (
    <>
      <Header />
      <main className="justify-center pt-[100px]">
        <Suspense fallback={<GoalSkeleton />}>
          <AlertDialog>
            <Goal />
          </AlertDialog>
        </Suspense>
      </main>
    </>
  );
}
