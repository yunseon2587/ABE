type ScorePoint = {
  date: string; // YYYY-MM-DD
  percent: number; // 0-100
  label: string; // hover 시 표시할 상세 텍스트
};

export function ScoreLineChart({ points }: { points: ScorePoint[] }) {
  if (points.length === 0) {
    return (
      <div className="flex h-40 items-center justify-center rounded-lg border border-neutral-200 bg-white text-sm text-neutral-400">
        아직 입력된 학교 시험 성적이 없습니다.
      </div>
    );
  }

  const width = 640;
  const height = 220;
  const paddingX = 36;
  const paddingTop = 16;
  const paddingBottom = 32;
  const plotWidth = width - paddingX * 2;
  const plotHeight = height - paddingTop - paddingBottom;

  const xStep = points.length > 1 ? plotWidth / (points.length - 1) : 0;
  const coords = points.map((p, i) => ({
    ...p,
    x: paddingX + (points.length > 1 ? i * xStep : plotWidth / 2),
    y: paddingTop + plotHeight * (1 - Math.max(0, Math.min(100, p.percent)) / 100),
  }));

  const linePath = coords
    .map((c, i) => `${i === 0 ? "M" : "L"}${c.x},${c.y}`)
    .join(" ");

  const gridValues = [0, 25, 50, 75, 100];

  return (
    <div className="overflow-x-auto rounded-lg border border-neutral-200 bg-white p-4">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full"
        style={{ minWidth: 480 }}
      >
        {gridValues.map((g) => {
          const y = paddingTop + plotHeight * (1 - g / 100);
          return (
            <g key={g}>
              <line
                x1={paddingX}
                y1={y}
                x2={width - paddingX}
                y2={y}
                stroke="#e5e5e5"
                strokeWidth={1}
              />
              <text x={paddingX - 8} y={y + 3} textAnchor="end" fontSize={10} fill="#a3a3a3">
                {g}
              </text>
            </g>
          );
        })}

        <path d={linePath} fill="none" stroke="#f472b6" strokeWidth={2} />

        {coords.map((c, i) => (
          <g key={i}>
            <circle cx={c.x} cy={c.y} r={4} fill="#f472b6" stroke="white" strokeWidth={1.5}>
              <title>{c.label}</title>
            </circle>
            <text
              x={c.x}
              y={height - paddingBottom + 18}
              textAnchor="middle"
              fontSize={10}
              fill="#737373"
            >
              {c.date.slice(5)}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}
