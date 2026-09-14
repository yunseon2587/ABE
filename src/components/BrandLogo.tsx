export function BrandLogo({ size = "lg" }: { size?: "sm" | "lg" }) {
  const dimension = size === "lg" ? "h-40 w-40" : "h-9 w-9";
  const text = size === "lg" ? "text-base" : "text-[7px]";

  return (
    <div
      className={`${dimension} flex shrink-0 flex-col items-center justify-center rounded-full bg-pink-300 text-center font-black uppercase leading-[1.05] tracking-tight text-neutral-900`}
    >
      <span className={text}>Able</span>
      <span className={text}>English</span>
    </div>
  );
}
