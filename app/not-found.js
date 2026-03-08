import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-6 text-center px-4">
      <svg
        width="80"
        height="80"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="2" opacity="0.5" />
        <path d="M8 8l8 8M16 8l-8 8" stroke="white" strokeWidth="2" strokeLinecap="round" />
      </svg>

      <div>
        <h1 className="text-6xl font-extrabold mb-2">404</h1>
        <p className="text-xl opacity-80">Sayfa bulunamadı</p>
      </div>

      <Link
        href="/"
        className="px-6 py-3 rounded-lg font-bold text-lg"
        style={{
          backgroundColor: "rgba(255,255,255,0.2)",
          transition: "background-color 0.2s",
        }}
      >
        Ana Sayfaya Dön
      </Link>
    </div>
  );
}
