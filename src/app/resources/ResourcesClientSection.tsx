"use client";

import { useState, useCallback } from "react";
import { PrintableSign } from "./PrintableSign";
import { QRCodeGenerator } from "./QRCodeGenerator";

export function ResourcesClientSection() {
  const [qrSvgHtml, setQrSvgHtml] = useState<string | null>(null);

  const handleQrChange = useCallback((svgHtml: string | null) => {
    setQrSvgHtml(svgHtml);
  }, []);

  return (
    <>
      {/* Printable Sign */}
      <section className="section-padding border-b border-wheat/20">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <span className="inline-block bg-wheat/10 text-wheat text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider mb-3">
              Step 1 · Print &amp; Display
            </span>
            <h2 className="font-serif text-3xl font-bold mb-2">
              Your Table Sign
            </h2>
            <p className="text-muted-foreground max-w-xl">
              {qrSvgHtml ? (
                <>
                  Your payment QR code is now included on the sign — buyers can
                  scan right from it. Print this and set it on your table.
                </>
              ) : (
                <>
                  Place this on your table next to the bread. The &ldquo;pay
                  whatever you want&rdquo; model removes the awkwardness and
                  usually results in more generous giving.{" "}
                  <span className="text-wheat font-medium">
                    Set up your payment QR code in Step 2 to include it here.
                  </span>
                </>
              )}
            </p>
          </div>
          <PrintableSign qrSvgHtml={qrSvgHtml ?? undefined} />
        </div>
      </section>

      {/* QR Code Generator */}
      <section className="section-padding border-b border-wheat/20 bg-cream/60">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <span className="inline-block bg-wheat/10 text-wheat text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider mb-3">
              Step 2 · Accept Payments
            </span>
            <h2 className="font-serif text-3xl font-bold mb-2">
              Payment QR Code
            </h2>
            <p className="text-muted-foreground max-w-xl">
              Enter your Venmo, Cash App, or Zelle handle and we&rsquo;ll
              generate a QR code your buyers can scan with their phone. It will
              automatically appear on your table sign above — print them
              together.
            </p>
          </div>
          <div className="bg-white rounded-2xl border border-wheat/20 shadow-sm p-8">
            <QRCodeGenerator onQrChange={handleQrChange} />
          </div>
        </div>
      </section>
    </>
  );
}
