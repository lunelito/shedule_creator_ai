"use client";

import useFetch from "@/db/hooks/useFetch";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type VerifyResponse = {
  message?: string;
  error?: string;
};

export default function VerifyPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");
  const [verified, setVerified] = useState<boolean | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("emailVerified");
      if (stored) setVerified(true);
    }
  }, []);

  useEffect(() => {
    if (!token) {
      router.replace("/");
    }
  }, [token, router]);

  const { data, error, isPending } = useFetch<VerifyResponse>(
    `/api/verify?token=${token}`
  );

  useEffect(() => {
    if (data?.message && !verified) {
      setVerified(true);
      localStorage.setItem("emailVerified", "true");
    }
  }, [data, verified]);

  return (
    <div className="text-white flex justify-center items-center h-screen bg-zinc-900">
      {isPending && <h1>Weryfikujemy Twój email...</h1>}

      {!isPending && data?.message && <h1>{data.message}</h1>}

      {!isPending && verified && !data?.message && (
        <h1>Email został już zweryfikowany </h1>
      )}
    </div>
  );
}
