"use client";

import { useEffect, useRef, useState } from "react";
import { Volume2, VolumeX, Music } from "lucide-react";

/**
 * Default calm ambient track — CC0 (public domain) "bee-hive-pad" by John
 * Bartmann, hosted on Wikimedia Commons. It resolves through Commons'
 * stable Special:FilePath redirect to the real .ogg file. Override with
 * NEXT_PUBLIC_AMBIENT_AUDIO_URL (any <audio>-supported URL or a local
 * /public/audio file) to use your own licensed track.
 */
const DEFAULT_AUDIO_URL =
  "https://commons.wikimedia.org/wiki/Special:FilePath/John_Bartmann_-_bee-hive-pad-master_(audio).ogg";

const LOW_VOLUME = 0.08;
const AUTOPLAY_TIMEOUT = 4000; // ms to wait before deciding autoplay was blocked

type PlayerState = "auto" | "playing" | "paused" | "blocked";

interface AudioSource {
  src: string;
  type?: string;
}

/**
 * Audio source list, most-preferred first.
 *
 * For full Safari support (which cannot decode OGG/Vorbis), set
 * NEXT_PUBLIC_AMBIENT_AUDIO_URL to a self-hosted MP3, e.g.
 * "/audio/calm.mp3" (placed in /public/audio/). That MP3 becomes the primary
 * source; the CC0 OGG pad is kept as an automatic fallback. Without the env
 * var, only the CC0 OGG default plays (Chrome/Firefox/Edge).
 */
function getAudioSources(): AudioSource[] {
  const envUrl =
    typeof process !== "undefined"
      ? process.env.NEXT_PUBLIC_AMBIENT_AUDIO_URL
      : undefined;

  const sources: AudioSource[] = [];
  if (envUrl) {
    sources.push({
      src: envUrl,
      type: envUrl.toLowerCase().endsWith(".mp3") ? "audio/mpeg" : undefined,
    });
  }
  sources.push({ src: DEFAULT_AUDIO_URL, type: "audio/ogg" });
  return sources;
}

/**
 * Calm background music + ambient aesthetic toggle.
 *
 * Tries to autoplay quietly on load (LOW_VOLUME). Browsers with strict
 * autoplay policies will reject the play() promise; when that's detected we
 * surface a small, hard-edged on/off toggle instead so the visitor can start
 * the audio on their own terms. The control is deliberately minimal — a
 * bordered square, no glass/glow — to match the brutalist identity.
 */
export function AmbientAudio() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [state, setState] = useState<PlayerState>("auto");

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    // Listen for user gestures that might unlock audio after an earlier block.
    const unlock = () => {
      if (audio.paused && state !== "playing") {
        try {
          audio.play();
        } catch {
          /* ignore */
        }
      }
    };
    window.addEventListener("pointerdown", unlock, { once: true });
    window.addEventListener("keydown", unlock, { once: true });
    return () => {
      window.removeEventListener("pointerdown", unlock);
      window.removeEventListener("keydown", unlock);
    };
  }, [state]);

  // Attempt low-volume autoplay on mount.
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = LOW_VOLUME;
    audio.loop = true;

    const attempt = audio
      .play()
      .then(() => {
        setState("playing");
      })
      .catch(() => {
        // Autoplay blocked — show the manual toggle.
        setState("blocked");
      });

    // Timed fallback: if play() never resolved (some engines stall), treat as
    // blocked and show the control rather than leaving the user stuck.
    const timer = window.setTimeout(() => {
      if (audio.paused) {
        setState("blocked");
      }
    }, AUTOPLAY_TIMEOUT);

    return () => {
      window.clearTimeout(timer);
      // Suppress the unhandled-rejection path when the component unmounts.
      attempt.catch(() => {});
    };
  }, []);

  const handleToggle = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      audio.volume = LOW_VOLUME;
      audio
        .play()
        .then(() => setState("playing"))
        .catch(() => setState("blocked"));
    } else {
      audio.pause();
      setState("paused");
    }
  };

  const showControl = state !== "auto";

  return (
    <>
      <audio
        ref={audioRef}
        preload="auto"
        loop
        crossOrigin="anonymous"
        className="hidden"
        aria-hidden
      >
        {getAudioSources().map((source, i) => (
          <source key={i} src={source.src} type={source.type} />
        ))}
      </audio>

      {showControl && (
        <button
          type="button"
          onClick={handleToggle}
          aria-pressed={state === "playing"}
          aria-label={state === "playing" ? "Pause background music" : "Play calm background music"}
          className="fixed bottom-5 right-5 z-50 inline-flex cursor-pointer items-center gap-2 border-2 border-nearblack bg-offwhite px-3 py-2 font-mono text-xs uppercase tracking-wide text-nearblack transition-transform duration-150 ease-out hover:text-terracotta active:scale-95"
        >
          <Music className="h-4 w-4" aria-hidden />
          {state === "playing" ? (
            <Volume2 className="h-4 w-4" aria-hidden />
          ) : (
            <VolumeX className="h-4 w-4" aria-hidden />
          )}
          <span className="hidden sm:inline">Sound</span>
        </button>
      )}
    </>
  );
}
