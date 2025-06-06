"use server";

import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import type { Database } from "@/lib/database.types";
import { Navigation } from "./navigation";

// 認証状態の監視
export const SupabaseListener = async () => {
  const supabase = createServerComponentClient<Database>({ cookies });

  //   セッションの取得
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // プロフィールの取得
  let profile = null;
  if (session) {
    const { data: currentProfile } = await supabase
      .from("profiles") // テーブル指定
      .select("*") // すべてのカラムを取得
      .eq("id", session.user.id) // 条件：idが一致
      .single(); // 結果は1件だけ期待

    profile = currentProfile;

    // メールアドレスを変更した場合、プロフィールを更新
    if (currentProfile && currentProfile.email !== session.user.email) {
      const { data: updatedProfile } = await supabase
        .from("profiles")
        .update({ email: session.user.email })
        .match({ id: session.user.id })
        .select("*")
        .single();

      profile = updatedProfile;
    }
  }

  return <Navigation session={session} profile={profile} />;
};
