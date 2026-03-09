"use client";

import Script from "next/script";

export function XTimeline() {
  return (
    <div className="max-w-xl mx-auto">
      <a
        className="twitter-timeline"
        data-theme="light"
        data-tweet-limit="6"
        data-chrome="noheader nofooter noborders transparent"
        data-dnt="true"
        href="https://twitter.com/OurDailyBreadC"
      >
        Loading posts…
      </a>
      <Script
        src="https://platform.twitter.com/widgets.js"
        strategy="lazyOnload"
      />
    </div>
  );
}
