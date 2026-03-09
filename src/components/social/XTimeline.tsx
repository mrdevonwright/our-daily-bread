"use client";

import { useEffect, useRef } from "react";

declare global {
  interface Window {
    twttr?: {
      widgets: {
        load: (el?: HTMLElement) => void;
      };
    };
  }
}

export function XTimeline() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.twttr?.widgets) {
      // Script already loaded — just reinitialize
      window.twttr.widgets.load(containerRef.current ?? undefined);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://platform.twitter.com/widgets.js";
    script.async = true;
    script.charset = "utf-8";
    script.onload = () => {
      window.twttr?.widgets.load(containerRef.current ?? undefined);
    };
    document.body.appendChild(script);
  }, []);

  return (
    <div ref={containerRef} className="max-w-xl mx-auto rounded-2xl border border-wheat/20 min-h-[400px]">
      <a
        className="twitter-timeline"
        data-theme="light"
        data-tweet-limit="6"
        data-chrome="noheader nofooter noborders"
        data-dnt="true"
        href="https://twitter.com/OurDailyBreadC"
      >
        Posts by @OurDailyBreadC
      </a>
    </div>
  );
}
