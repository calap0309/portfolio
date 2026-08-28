import { ImageResponse } from "next/og";

/**
 * Dynamically generated favicon (Section V) — a sharp, minimalist geometric
 * mark: a diagonal terracotta slash intersecting a near-black circle on
 * off-white. Rendered via Next.js' ImageResponse so it stays crisp in both
 * dark and light browser tabs.
 */
export function GET() {
  const size = { width: 32, height: 32 };
  const ink = "#18181b";
  const paper = "#fafaf8";
  const accent = "#c9694b";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: paper,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <svg
          width="28"
          height="28"
          viewBox="0 0 28 28"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle
            cx="14"
            cy="14"
            r="12"
            stroke={ink}
            strokeWidth="2"
            fill="none"
          />
          <line
            x1="6"
            y1="22"
            x2="22"
            y2="6"
            stroke={accent}
            strokeWidth="3.5"
            strokeLinecap="square"
          />
        </svg>
      </div>
    ),
    {
      ...size,
      headers: { "Content-Type": "image/x-icon" },
    }
  );
}
