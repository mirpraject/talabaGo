"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function UniversitiesPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/files");
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-500 font-medium">
      Yo&apos;naltirilmoqda...
    </div>
  );
}