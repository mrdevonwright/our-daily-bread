"use client";

export function XTimeline() {
  return (
    <div className="max-w-xl mx-auto rounded-2xl border border-wheat/20 bg-white overflow-hidden shadow-sm">
      {/* Header */}
      <div className="flex items-center gap-3 px-6 py-4 border-b border-wheat/10">
        <div className="w-9 h-9 rounded-full bg-black flex items-center justify-center shrink-0">
          {/* X logo */}
          <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white" aria-hidden="true">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.253 5.622 5.912-5.622Zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
        </div>
        <div className="text-left">
          <p className="font-semibold text-foreground text-sm leading-tight">Our Daily Bread</p>
          <p className="text-muted-foreground text-xs">@OurDailyBreadC</p>
        </div>
        <a
          href="https://x.com/OurDailyBreadC"
          target="_blank"
          rel="noopener noreferrer"
          className="ml-auto bg-black text-white text-xs font-semibold px-4 py-1.5 rounded-full hover:bg-neutral-800 transition-colors"
        >
          Follow
        </a>
      </div>

      {/* CTA body */}
      <div className="px-6 py-8 text-center">
        <p className="text-muted-foreground text-sm leading-relaxed mb-5">
          Follow along as we document the movement — baker stories, scripture,
          loaves fresh out of the oven, and the communities being transformed.
        </p>
        <a
          href="https://x.com/OurDailyBreadC"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-black text-white text-sm font-semibold px-6 py-2.5 rounded-full hover:bg-neutral-800 transition-colors"
        >
          <svg viewBox="0 0 24 24" className="w-4 h-4 fill-white shrink-0" aria-hidden="true">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.253 5.622 5.912-5.622Zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
          View our posts on X
        </a>
      </div>

      {/* Hashtag footer */}
      <div className="px-6 py-3 bg-wheat/5 border-t border-wheat/10 text-center">
        <p className="text-xs text-muted-foreground">
          Share your loaves with{" "}
          <a
            href="https://x.com/search?q=%23OurDailyBreadMovement"
            target="_blank"
            rel="noopener noreferrer"
            className="text-wheat font-semibold hover:underline"
          >
            #OurDailyBreadMovement
          </a>
        </p>
      </div>
    </div>
  );
}
