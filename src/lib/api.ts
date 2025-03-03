const API_URL = process.env.NEXT_PUBLIC_VERCEL_URL;

// 目標取得API呼び出し
export async function getGoals() {
  try {
    const res = await fetch(`${API_URL}/api/goal`, {
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error(`Failed to get goals. status code:${res.status}`);
    }
    const json = await res.json();
    console.log(json);
    return json;
  } catch (error) {
    console.error(error);
  }
}

// 目標削除API呼び出し
export async function deleteGoal(id: number) {
  try {
    const res = await fetch(`${API_URL}/api/goal`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: id }),
      credentials: "include",
    });
    if (!res.ok) {
      throw new Error(`Failed to delete goal. status code:${res.status}`);
    }
  } catch (error) {
    console.error(error);
  }
}
