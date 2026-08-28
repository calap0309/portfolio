import { ImageResponse } from "next/og";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

/**
 * Apple-style PNG icon (Section V): minimalist "C" monogram, bold, #1d1d1f,
 * on a rounded white tile. Crisp in both light and dark browser tabs.
 */
export default function Icon(): ImageResponse {
  const ink = "#1d1d1f";
  const white = "#ffffff";
  const radius = 15;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "transparent",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            height: "100%",
            background: white,
            borderRadius: radius,
            // Soft inner rounding so the monogram sits nicely inside the tile.
            boxShadow: `inset 0 0 0 1px rgba(0,0,0,0.02)`,
          }}
        >
          <div
            style={{
              fontSize: 54,
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
      </div>
    ),
    { ...size }
  );
}
