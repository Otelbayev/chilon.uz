"use client";

import Link from "next/link";
import Image from "next/image";

export default function Logo({
  size = 110,
  light = false,
}: {
  size?: number;
  light?: boolean;
}) {
  return (
    <Link href="/" className="flex items-center gap-2.5 group">
      <Image
        src="/logo.png"
        alt="Chilon"
        width={size}
        height={size}
        priority
        className="object-contain transition-transform duration-500 group-hover:scale-110"
        style={{ width: size, height: size }}
      />
    </Link>
  );
}
