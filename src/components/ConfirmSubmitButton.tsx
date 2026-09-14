"use client";

export function ConfirmSubmitButton({
  children,
  message = "정말 삭제하시겠습니까?",
  className,
}: {
  children: React.ReactNode;
  message?: string;
  className?: string;
}) {
  return (
    <button
      type="submit"
      className={className}
      onClick={(e) => {
        if (!confirm(message)) {
          e.preventDefault();
        }
      }}
    >
      {children}
    </button>
  );
}
