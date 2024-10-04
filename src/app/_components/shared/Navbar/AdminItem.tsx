"use client";

import { usePathname } from "next/navigation";
import React from "react";

export default function AdminItem() {
  const pathname = usePathname();
  const klassName = decodeURIComponent(pathname.split("/")[3] ?? "");
  
  const paths = new Map<string | RegExp, React.ReactNode>([
    [
      // /admin/klass/*
      /^\/admin\/klass\/.+$/,
      <>
        <h1 className="text-xl">Admin Panel - Klass: {klassName}</h1>
      </>,
    ],
    [
      "/admin",
      <>
        <h1 className="text-xl">Admin Panel</h1>
      </>,
    ],
  ]);

  for (const [path, element] of paths.entries()) {
    if (typeof path === "string" ? pathname === path : path.test(pathname)) {
      return element;
    }
  }

  return null;
}