import { ImageResponse } from "next/og";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

export default function Icon(): ImageResponse {
  const accent = "#c9694b";
  const ink = "#18181b";
  const paper = "#fafaf8";

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
          position: "relative",
        }}
      >
        <svg
          width="48"
          height="48"
          viewBox="0 0 48 48"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle
            cx="24"
            cy="24"
            r="20"
            stroke={ink}
            strokeWidth="3"
            fill="none"
          />
          <line
            x1="10"
            y1="38"
            x2="38"
            y2="10"
            stroke={accent}
            strokeWidth="5"
            strokeLinecap="square"
          />
          <circle cx="24" cy="24" r="4" fill={ink} />
        </svg>
      </div>
    ),
    { ...size }
  );
}
