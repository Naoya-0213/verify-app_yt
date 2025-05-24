// この middleware 関数は Next.js の ミドルウェア機能（ページ遷移やAPIリクエスト前に実行される処理）
// を使って、Supabaseのログイン情報（セッション）を確認する仕組み

// 	•	ログインしてるか確認したり
// 	•	認証情報をサーバー側で使えるようにしたり

// Next.js のミドルウェア内で Supabase の認証情報（セッション）を使うためのクライアントを作る関数
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";


import { NextResponse } from "next/server";

import type { NextRequest } from "next/server";
import type { Database } from "@/lib/database.types";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient<Database>({ req, res });
  await supabase.auth.getSession();
  return res;
}
