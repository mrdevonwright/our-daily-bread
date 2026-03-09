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
        {/* Fallback shown until widget renders */}
        <div className="bg-cream border border-wheat/20 rounded-2xl p-8 text-center">
          <p className="font-serif text-lg font-semibold text-foreground mb-2">
            Follow us on X
          </p>
          <p className="text-sm text-muted-foreground mb-4">
            We post bread tips, movement updates, and community stories using{" "}
            <strong className="text-wheat">#OurDailyBreadMovement</strong>
          </p>
          <span className="inline-block bg-wheat text-white text-sm font-medium px-5 py-2 rounded-full">
            @OurDailyBreadC →
          </span>
        </div>
      </a>
      <Script
        src="https://platform.twitter.com/widgets.js"
        strategy="afterInteractive"
      />
    </div>
  );
}
