export type MakeupStatus = "unscheduled" | "scheduled" | "done";

export function getMakeupStatus(
  makeupDate: string | null,
  today: string = new Date().toISOString().slice(0, 10)
): MakeupStatus {
  if (!makeupDate) return "unscheduled";
  return makeupDate >= today ? "scheduled" : "done";
}

export const MAKEUP_STATUS_LABEL: Record<MakeupStatus, string> = {
  unscheduled: "보강 미정",
  scheduled: "보강 예정",
  done: "보강 완료",
};
