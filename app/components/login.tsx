// ログインページ実装
"use client";

import { useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import Loading from "@/app/loading";
import * as z from "zod";
import type { Database } from "@/lib/database.types";
type Schema = z.infer<typeof schema>;

// 入力データの検証ツールを定義
const schema = z.object({
  email: z.string().email({ message: "メールアドレスの形式ではありません" }),
  password: z.string().min(6, { message: "6文字以上入力する必要があります" }),
});

// ログインページ
const Login = () => {
  const router = useRouter();
  const supabase = createClientComponentClient<Database>();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // react-hook-form連携
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    // 初期値
    defaultValues: { email: "", password: "" },
    // 入力値の検証
    resolver: zodResolver(schema),
  });

  //  送信
  const onSubmit: SubmitHandler<Schema> = async (data) => {
    // ローディング開始
    setLoading(true);

    try {
      // ログイン
      const { error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      //  エラーチェック
      if (error) {
        setMessage("エラーが発生しました" + error.message);
        return;
      }
    } catch (error) {
      setMessage("エラーが発生しました");
      return;
    } finally {
      setLoading(false);
      router.refresh();
    }
  };

  return (
    <div className="max-w-[400px] mx-auto">
      <div className="text-center font-bold text-xl mb-10">ログイン</div>
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* メールアドレス */}
        <div className="mb-3">
          <input
            type="email"
            className="border rounded-md w-full py-2 px-3 focus:outline-none focus:border-sky-500"
            placeholder="メールアドレス"
            id="email"
            {...register("email", { required: true })}
          />
          <div className="my-3 text-center text-sm text-red-500">
            {errors.email?.message}
          </div>
        </div>

        {/* パスワード */}
        <div className="mb-3">
          <input
            type="password"
            className="border rounded-md w-full py-2 px-3 focus:outline-none focus:border-sky-500"
            placeholder="パスワード"
            id="password"
            {...register("password", { required: true })}
          />
          <div className="my-3 text-center text-sm text-red-500">
            {errors.password?.message}
          </div>
        </div>

        {/* ログインボタン */}
        <div className="mb-5">
          {loading ? (
            <Loading />
          ) : (
            <button
              type="submit"
              className="font-bold bg-sky-500 hover:brightness-95 w-full rounded-full p-2 text-white"
            >
              ログイン
            </button>
          )}
        </div>
      </form>

      {/* ログインできなかったための表示 */}
      {message && (
        <div className="my-5 text-center text-sm text-red-500">{message}</div>
      )}

      {/* パスワード忘れた時の挙動 */}
      <div className="text-center text-sm mb-5">
        <Link href="/auth/reset-password" className="text-gray-500 font-bold">
          パスワードを忘れた方はこちら
        </Link>
      </div>

      {/* サインアップ用のリンク */}
      <div className="text-center text-sm mb-5">
        <Link href="/auth/signup" className="text-gray-500 font-bold">
          アカウントを作成する
        </Link>
      </div>
    </div>
  );
};

export default Login;
