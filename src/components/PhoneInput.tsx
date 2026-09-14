"use client";

import { useState } from "react";

function formatPhone(raw: string): string {
  const digits = raw.replace(/\D/g, "").slice(0, 11);
  if (digits.length < 4) return digits;
  if (digits.length < 8) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`;
}

export function PhoneInput({
  name,
  defaultValue,
  className,
  required,
}: {
  name: string;
  defaultValue?: string | null;
  className?: string;
  required?: boolean;
}) {
  const [value, setValue] = useState(formatPhone(defaultValue ?? ""));

  return (
    <input
      type="tel"
      name={name}
      value={value}
      onChange={(e) => setValue(formatPhone(e.target.value))}
      placeholder="010-0000-0000"
      inputMode="numeric"
      required={required}
      className={className}
    />
  );
}
