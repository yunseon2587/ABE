import { MAKEUP_STATUS_LABEL, type MakeupStatus } from "@/lib/makeup";

const STYLES: Record<MakeupStatus, string> = {
  unscheduled: "bg-neutral-100 text-neutral-600",
  scheduled: "bg-amber-100 text-amber-700",
  done: "bg-emerald-100 text-emerald-700",
};

export function MakeupStatusBadge({ status }: { status: MakeupStatus }) {
  return (
    <span className={`inline-block rounded px-2 py-0.5 text-xs font-semibold ${STYLES[status]}`}>
      {MAKEUP_STATUS_LABEL[status]}
    </span>
  );
}
