import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { Database } from "@/lib/database.types";

// メインページ
export default async function Home() {
  const supabase = createServerComponentClient<Database>({
    cookies,
  });

  // セッションに取得
  const {
    data: { session },
  } = await supabase.auth.getSession();

  return (
    <div className="text-center text-x1">
      {session ? <div>ログイン済</div> : <div>未ログイン</div>}
    </div>
  );
}
