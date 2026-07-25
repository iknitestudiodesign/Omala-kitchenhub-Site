import Link from "next/link";
import Image from "next/image";

export function BrandMark({ inverse = false }: { inverse?: boolean }) {
  return (
    <Link
      href="/"
      className={`brand-mark${inverse ? " brand-mark--inverse" : ""}`}
      aria-label="Ekoraa Kitchen Hub home"
    >
      <Image
        className="brand-logo"
        src="/brand/ekoraa-logo-horizontal.svg"
        alt=""
        width={720}
        height={180}
        priority
        unoptimized
      />
    </Link>
  );
}

export function BrandIcon({ className = "" }: { className?: string }) {
  return (
    <Image
      className={`brand-icon${className ? ` ${className}` : ""}`}
      src="/brand/ekoraa-kitchen-logomark.svg"
      alt=""
      width={385}
      height={464}
      aria-hidden="true"
      unoptimized
    />
  );
}
