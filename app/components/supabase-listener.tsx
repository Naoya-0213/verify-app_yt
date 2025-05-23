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

  return <Navigation session={session} />;
};
