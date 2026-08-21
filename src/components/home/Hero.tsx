"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { ArrowRight, Star, MapPin, ChevronDown, MessageCircle } from "lucide-react";
import { site } from "@/data/site";

const QUICK: { label: string; interest: string }[] = [
  { label: "ATV & Waterfalls", interest: "Water" },
  { label: "Cave Tubing", interest: "Water" },
  { label: "Maya Ruins", interest: "History" },
  { label: "Zip Lining", interest: "Adrenaline" },
  { label: "Wildlife", interest: "Wildlife" },
];

const headlineWords = ["Welcome", "to", "Wilder", "Belize"];
const headlinePhrase = "Adventures Tours and Transfers!";

const wordReveal = {
  hidden: { opacity: 0, y: 36, filter: "blur(14px)" },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      delay: 0.28 + i * 0.09,
      duration: 0.72,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  }),
};

const letterReveal = {
  hidden: { opacity: 0, y: 28, rotateX: -62, filter: "blur(5px)" },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    rotateX: 0,
    filter: "blur(0px)",
    transition: {
      delay: 0.72 + i * 0.022,
      duration: 0.58,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  }),
};

export function Hero() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [useCanvasVideo, setUseCanvasVideo] = useState(true);
  const reduce = useReducedMotion();
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 700], [0, 160]);
  const fade = useTransform(scrollY, [0, 420], [1, 0]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
    const isSafari = /^((?!chrome|android|crios|fxios).)*safari/i.test(navigator.userAgent);
    const shouldUseCanvas = isIOS || isSafari;
    setUseCanvasVideo(shouldUseCanvas);

    video.defaultMuted = true;
    video.muted = true;
    video.playsInline = true;
    video.setAttribute("muted", "");
    video.setAttribute("playsinline", "");
    video.setAttribute("webkit-playsinline", "");
    video.setAttribute("x-webkit-airplay", "deny");

    const playVideo = () => {
      if (!document.hidden) {
        window.requestAnimationFrame(() => {
          void video.play().catch(() => undefined);
        });
      }
    };

    playVideo();
    video.addEventListener("loadeddata", playVideo);
    video.addEventListener("canplay", playVideo);
    document.addEventListener("visibilitychange", playVideo);
    window.addEventListener("pageshow", playVideo);

    let frame = 0;

    if (shouldUseCanvas) {
      const canvas = canvasRef.current;
      const context = canvas?.getContext("2d");

      const resizeCanvas = () => {
        if (!canvas) return;
        const rect = canvas.getBoundingClientRect();
        const ratio = window.devicePixelRatio || 1;
        canvas.width = Math.max(1, Math.round(rect.width * ratio));
        canvas.height = Math.max(1, Math.round(rect.height * ratio));
      };

      const drawVideo = () => {
        if (canvas && context && video.readyState >= 2) {
          const videoRatio = video.videoWidth / video.videoHeight;
          const canvasRatio = canvas.width / canvas.height;
          let drawWidth = canvas.width;
          let drawHeight = canvas.height;
          let drawX = 0;
          let drawY = 0;

          if (videoRatio > canvasRatio) {
            drawWidth = canvas.height * videoRatio;
            drawX = (canvas.width - drawWidth) / 2;
          } else {
            drawHeight = canvas.width / videoRatio;
            drawY = (canvas.height - drawHeight) / 2;
          }

          context.drawImage(video, drawX, drawY, drawWidth, drawHeight);
        }

        frame = window.requestAnimationFrame(drawVideo);
      };

      resizeCanvas();
      window.addEventListener("resize", resizeCanvas);
      frame = window.requestAnimationFrame(drawVideo);

      return () => {
        window.cancelAnimationFrame(frame);
        window.removeEventListener("resize", resizeCanvas);
        video.removeEventListener("loadeddata", playVideo);
        video.removeEventListener("canplay", playVideo);
        document.removeEventListener("visibilitychange", playVideo);
        window.removeEventListener("pageshow", playVideo);
      };
    }

    return () => {
      window.cancelAnimationFrame(frame);
      video.removeEventListener("loadeddata", playVideo);
      video.removeEventListener("canplay", playVideo);
      document.removeEventListener("visibilitychange", playVideo);
      window.removeEventListener("pageshow", playVideo);
    };
  }, []);

  return (
    <section className="relative flex min-h-[100svh] items-center overflow-hidden">
      {/* Background */}
      <motion.div style={reduce ? undefined : { y }} className="absolute inset-0 z-0">
        <motion.div
          className="absolute inset-0"
          animate={reduce ? undefined : { scale: [1, 1.12] }}
          transition={{ duration: 22, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
        >
          <canvas
            ref={canvasRef}
            className={`absolute inset-0 h-full w-full ${useCanvasVideo ? "block" : "hidden"}`}
            aria-hidden="true"
          />
          <video
            ref={videoRef}
            className={`hero-background-video pointer-events-none absolute inset-0 h-full w-full object-cover ${useCanvasVideo ? "opacity-0" : "opacity-100"}`}
            autoPlay
            muted
            loop
            playsInline
            disablePictureInPicture
            disableRemotePlayback
            controlsList="nodownload nofullscreen noplaybackrate"
            preload="auto"
            tabIndex={-1}
            onLoadedMetadata={(event) => {
              event.currentTarget.defaultMuted = true;
              event.currentTarget.muted = true;
              event.currentTarget.setAttribute("muted", "");
              event.currentTarget.setAttribute("playsinline", "");
              event.currentTarget.setAttribute("webkit-playsinline", "");
              event.currentTarget.setAttribute("x-webkit-airplay", "deny");
              void event.currentTarget.play().catch(() => undefined);
            }}
            onCanPlay={(event) => {
              void event.currentTarget.play().catch(() => undefined);
            }}
            aria-hidden="true"
          >
            <source src="/images/belize-background-web.mp4" type="video/mp4" />
          </video>
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-b from-ink/70 via-ink/35 to-ink/85" />
        {/* <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-sand-50 to-transparent" /> smoke effect */}
      </motion.div>

      {/* Content */}
      <motion.div style={reduce ? undefined : { opacity: fade }} className="container-page relative z-10 w-full pb-24 pt-32 md:pb-28">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-4xl lg:max-w-5xl"
        >
          <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-white backdrop-blur ring-1 ring-white/20">
            <MapPin className="h-3.5 w-3.5 text-coral-300" /> {site.hero.kicker}
          </span>

          <h1
            aria-label="Welcome to Wilder Belize Adventures Tours and Transfers!"
            className="mt-6 font-display text-4xl font-extrabold leading-[0.98] text-white drop-shadow-sm sm:text-6xl md:text-7xl lg:text-[4.5rem] xl:text-[5.2rem]"
          >
            <span aria-hidden="true" className="block overflow-hidden pb-1">
              {headlineWords.map((word, i) => (
                <motion.span
                  key={word}
                  custom={i}
                  initial={reduce ? false : "hidden"}
                  animate={reduce ? undefined : "show"}
                  variants={wordReveal}
                  className="inline-block will-change-transform"
                >
                  {word}
                  {i < headlineWords.length - 1 ? "\u00A0" : ""}
                </motion.span>
              ))}
            </span>
            <motion.span
              aria-hidden="true"
              initial={reduce ? false : { opacity: 0.9 }}
              animate={reduce ? undefined : { opacity: 1, textShadow: ["0 0 0 rgba(255,165,79,0)", "0 0 22px rgba(255,165,79,0.28)", "0 0 0 rgba(255,165,79,0)"] }}
              transition={{ delay: 1.25, duration: 4.8, repeat: Infinity, ease: "easeInOut" }}
              className="block origin-left overflow-hidden pb-2 pt-1 [perspective:900px]"
            >
              {headlinePhrase.split(" ").map((word, wordIndex, wordsArr) => {
                let charOffset = 0;
                for (let w = 0; w < wordIndex; w++) {
                  charOffset += wordsArr[w].length + 1;
                }
                return (
                  <span key={wordIndex} className="inline-block whitespace-nowrap">
                    {word.split("").map((char, charIndex) => {
                      const globalIndex = charOffset + charIndex;
                      return (
                        <motion.span
                          key={`${char}-${charIndex}`}
                          custom={globalIndex}
                          initial={reduce ? false : "hidden"}
                          animate={reduce ? undefined : "show"}
                          variants={letterReveal}
                          className="inline-block bg-gradient-to-r from-coral-300 via-gold-300 to-lagoon-200 bg-[length:220%_220%] bg-clip-text text-transparent animate-gradient will-change-transform"
                        >
                          {char}
                        </motion.span>
                      );
                    })}
                    {wordIndex < wordsArr.length - 1 && <span className="inline-block">&nbsp;</span>}
                  </span>
                );
              })}
            </motion.span>
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/85 md:text-xl">{site.hero.subheadline}</p>

          <div className="mt-9 flex flex-wrap items-center gap-3">
            <Link href="/tours" className="btn btn-primary h-13 px-7 text-base">
              {site.hero.ctaPrimary} <ArrowRight className="h-5 w-5" />
            </Link>
            <Link href="/build-your-route" className="btn glass h-13 px-7 text-base text-white hover:bg-white hover:text-ink">
              <MessageCircle className="h-5 w-5" /> Build a custom route
            </Link>
          </div>

          {/* Quick chips */}
          <div className="mt-8 flex flex-wrap gap-2">
            {QUICK.map((q) => (
              <Link key={q.label} href={`/tours?interest=${encodeURIComponent(q.interest)}`} className="rounded-full bg-white/10 px-3.5 py-1.5 text-xs font-semibold text-white/90 ring-1 ring-white/15 backdrop-blur transition hover:bg-coral-500 hover:ring-coral-500">
                {q.label}
              </Link>
            ))}
          </div>

          {/* Trust row */}
          <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
            <div className="flex items-center gap-2">
              <div className="flex">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-gold-400 text-gold-400" />
                ))}
              </div>
              <span className="text-sm font-semibold text-white">5.0 on Tripadvisor</span>
            </div>
            <div className="h-8 w-px bg-white/20" />
            <div className="text-sm text-white/85"><span className="font-bold text-white">5,000+</span> travelers guided</div>
            <div className="h-8 w-px bg-white/20" />
            <div className="text-sm text-white/85"><span className="font-bold text-white">8+</span> years in the wild</div>
          </div>
        </motion.div>
      </motion.div>

      {/* Scroll cue */}
      <motion.div
        style={reduce ? undefined : { opacity: fade }}
        className="absolute inset-x-0 bottom-6 flex justify-center"
        aria-hidden
      >
        <span className="flex flex-col items-center gap-1 text-xs font-medium uppercase tracking-widest text-white/70">
          Scroll
          <ChevronDown className="h-4 w-4 animate-bounce" />
        </span>
      </motion.div>
    </section>
  );
}
