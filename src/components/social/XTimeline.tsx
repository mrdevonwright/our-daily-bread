"use client";

import Script from "next/script";
import { useEffect } from "react";

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
  useEffect(() => {
    if (window.twttr?.widgets) {
      window.twttr.widgets.load();
    }
  }, []);

  return (
    <div className="max-w-xl mx-auto rounded-2xl overflow-hidden border border-wheat/20">
      <a
        className="twitter-timeline"
        data-theme="light"
        data-tweet-limit="6"
        data-chrome="noheader nofooter noborders transparent"
        data-dnt="true"
        href="https://twitter.com/OurDailyBreadC"
      >
        Posts from @OurDailyBreadC
      </a>
      <Script
        src="https://platform.twitter.com/widgets.js"
        strategy="afterInteractive"
        onLoad={() => {
          window.twttr?.widgets?.load();
        }}
      />
    </div>
  );
}
