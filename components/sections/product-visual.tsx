import type { FlavorKey, SizeKey } from "@/lib/products";

const dimensions: Record<SizeKey, { width: number; height: number }> = {
  spark: { width: 142, height: 58 },
  power: { width: 170, height: 68 },
  beast: { width: 202, height: 78 }
};

export function ProductVisual({
  flavorKey,
  sizeKey
}: {
  flavorKey: FlavorKey;
  sizeKey: SizeKey;
}) {
  const { width, height } = dimensions[sizeKey];
  const isDates = flavorKey === "dates-delight";
  const barId = `${flavorKey}-${sizeKey}`;
  const fillA = isDates ? "#8d5524" : "#6f3922";
  const fillB = isDates ? "#c7792f" : "#3c1f16";
  const accent = isDates ? "#f3c85b" : "#b8db6c";

  return (
    <svg
      aria-hidden="true"
      className="product-svg"
      height={height}
      role="img"
      viewBox={`0 0 ${width} ${height}`}
      width={width}
    >
      <defs>
        <linearGradient id={`${barId}-fill`} x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stopColor={fillA} />
          <stop offset="100%" stopColor={fillB} />
        </linearGradient>
        <linearGradient id={`${barId}-shine`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="rgba(255,255,255,0.28)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0)" />
        </linearGradient>
      </defs>
      <rect fill={`url(#${barId}-fill)`} height={height - 8} rx="8" width={width - 8} x="4" y="4" />
      <rect
        fill={`url(#${barId}-shine)`}
        height={(height - 8) / 2}
        rx="8"
        width={width - 8}
        x="4"
        y="4"
      />
      {[0.22, 0.4, 0.58, 0.76].map((stop) => (
        <line
          key={stop}
          stroke="rgba(0,0,0,0.24)"
          strokeWidth="1.4"
          x1={Math.round(width * stop)}
          x2={Math.round(width * stop)}
          y1="5"
          y2={height - 5}
        />
      ))}
      <text
        fill={accent}
        fontFamily="Impact, sans-serif"
        fontSize={sizeKey === "beast" ? 18 : 15}
        textAnchor="middle"
        x={width / 2}
        y={height / 2 + 6}
      >
        FUELBAR
      </text>
    </svg>
  );
}
