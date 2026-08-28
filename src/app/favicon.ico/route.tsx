import { ImageResponse } from "next/og";

/**
 * Dynamically generated favicon (Section V) — an Apple-style minimalist
 * monogram: the letter "C" in SF Pro Display, bold, #1d1d1f, on a clean
 * white tile. Rendered via Next.js ImageResponse so it stays crisp in both
 * dark and light browser tabs.
 */
export function GET() {
  const size = { width: 32, height: 32 };
  const ink = "#1d1d1f";
  const white = "#ffffff";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: white,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            fontSize: 26,
            fontWeight: 700,
            color: ink,
            fontFamily:
              "-apple-system, BlinkMacSystemFont, 'SF Pro Display', Helvetica, Arial, sans-serif",
            lineHeight: 1,
          }}
        >
          C
        </div>
      </div>
    ),
    {
      ...size,
      headers: { "Content-Type": "image/x-icon" },
    }
  );
}
