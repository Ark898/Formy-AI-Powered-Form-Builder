import Link from "next/link";

const Logo = (props: { url?: string; color?: string; compact?: boolean }) => {
  const { url = "/", compact = false } = props;
  return (
    <div className="flex items-center justify-center sm:justify-start">
      <Link
        href={url}
        aria-label="Formy home"
        className="group flex items-center gap-2.5"
      >
        <span className="relative grid h-9 w-9 shrink-0 place-items-center overflow-hidden rounded-[11px] bg-gradient-to-br from-primary via-violet-500 to-fuchsia-500 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.4),0_8px_18px_-8px_hsl(var(--primary)/0.9)] transition-transform duration-300 group-hover:-rotate-3 group-hover:scale-105">
          <span className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.55),transparent_55%)] opacity-70" />
          <svg
            viewBox="0 0 24 24"
            fill="none"
            className="relative h-5 w-5"
            aria-hidden="true"
          >
            <path
              d="M7 18V6.5A1.5 1.5 0 0 1 8.5 5H17"
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinecap="round"
            />
            <path
              d="M7 11.75H14"
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinecap="round"
            />
            <circle cx="17.4" cy="18.2" r="1.6" fill="currentColor" />
          </svg>
        </span>
        {!compact && (
          <span className="text-[22px] font-extrabold leading-none tracking-[-0.03em] text-foreground">
            Formy<span className="text-primary">.</span>
          </span>
        )}
      </Link>
    </div>
  );
};

export default Logo;
