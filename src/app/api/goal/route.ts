import { createClient } from "@/utils/supabase/server";
import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

// データベースに接続する関数
export const prisma = new PrismaClient() as any;
export async function doConnect() {
  try {
    await prisma.$connect();
  } catch (error) {
    return Error("Failed to connect to database");
  } finally {
    await prisma.$disconnect();
  }
}

const goalSchema = z.object({
  title: z.string().min(1, "please enter a title").max(50),
  description: z.string().min(1, "please enter a description").max(200),
  deadline: z
    .string()
    .refine((date) => !isNaN(Date.parse(date)), "invalid date format"),
});

// 目標全件取得API
export const GET = async () => {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (!user || error) {
    return NextResponse.json(
      { message: "Error", error: "Unauthorized" },
      { status: 401 }
    );
  }

  const userData = await prisma.user.findUnique({
    where: { auth_id: user?.id }
  });
  if (!userData) {
    return NextResponse.json(
      { message: "Error", error: "Unauthorized" },
      { status: 404 }
    );
  }

  try {
    const goals = await prisma.goal.findMany({
      where: { user_id: userData.id },
      orderBy: { deadline: "asc" },
    });
    return NextResponse.json({ message: "Success", goals }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Error", error }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
};

// 目標削除API
export const DELETE = async (req: NextRequest) => {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (!user || error) {
    return NextResponse.json(
      { message: "Error", error: "Unauthorized" },
      { status: 401 }
    );
  }

  const userData = await prisma.user.findUnique({
    where: { auth_id: user?.id }
  });
  if (!userData) {
    return NextResponse.json(
      { message: "Error", error: "Unauthorized" },
      { status: 404 }
    );
  }

  const { id } = await req.json();
  if (!id) {
    return NextResponse.json(
      { message: "Error", error: "Invalid request" },
      { status: 400 }
    );
  }
  try {
    await prisma.goal.deleteMany({
      where: { id: id, user_id: userData.id },
    });
    return NextResponse.json({ message: "Success" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Error", error }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
};
