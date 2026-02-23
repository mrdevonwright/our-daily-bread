"use client";

import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";

interface PrintableSignProps {
  qrSvgHtml?: string;
}

export function PrintableSign({ qrSvgHtml }: PrintableSignProps) {
  const signRef = useRef<HTMLDivElement>(null);

  // Scale the QR SVG for the print version (override its intrinsic size)
  const qrPrintSection = qrSvgHtml
    ? `
    <div class="qr-section">
      <div class="qr-wrap">${qrSvgHtml}</div>
      <div class="qr-label">Scan to Pay</div>
    </div>`
    : "";

  function handlePrint() {
    const printWindow = window.open("", "_blank", "width=800,height=900");
    if (!printWindow) return;

    const signHtml = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8"/>
  <title>Our Daily Bread — Table Sign</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,600;0,700;1,400&family=Inter:wght@400;600&display=swap');
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      padding: 24px;
    }
    .sign {
      width: 5.5in;
      border: 4px solid #C8973A;
      border-radius: 16px;
      padding: 40px 48px;
      text-align: center;
      position: relative;
      background: #FFFDF6;
      font-family: 'Inter', sans-serif;
    }
    .sign::before {
      content: '';
      position: absolute;
      inset: 6px;
      border: 1.5px dashed #C8973A;
      border-radius: 12px;
      opacity: 0.4;
      pointer-events: none;
    }
    .loaves { font-size: 48px; margin-bottom: 4px; line-height: 1; }
    .brand {
      font-family: 'Lora', Georgia, serif;
      font-size: 13px;
      letter-spacing: 0.15em;
      text-transform: uppercase;
      color: #C8973A;
      font-weight: 600;
      margin-bottom: 20px;
    }
    .divider { border: none; border-top: 1.5px solid #E8D5B0; margin: 12px auto; width: 60%; }
    .headline {
      font-family: 'Lora', Georgia, serif;
      font-size: 38px;
      font-weight: 700;
      color: #2C1810;
      line-height: 1.1;
      margin-bottom: 6px;
    }
    .sub {
      font-family: 'Lora', Georgia, serif;
      font-size: 22px;
      font-weight: 400;
      color: #2C1810;
      margin-bottom: 4px;
    }
    .face { font-size: 52px; margin: 10px 0; line-height: 1; }
    .church-line {
      font-size: 14px;
      color: #6B5744;
      font-weight: 600;
      letter-spacing: 0.05em;
      text-transform: uppercase;
      margin-top: 16px;
    }
    .scripture {
      font-family: 'Lora', Georgia, serif;
      font-style: italic;
      font-size: 12px;
      color: #9E7A50;
      margin-top: 14px;
      padding-top: 12px;
      border-top: 1px solid #E8D5B0;
    }
    .qr-section {
      margin-top: 20px;
      padding-top: 16px;
      border-top: 1px solid #E8D5B0;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
    }
    .qr-wrap svg {
      width: 160px;
      height: 160px;
      display: block;
    }
    .qr-label {
      font-family: 'Inter', sans-serif;
      font-size: 13px;
      font-weight: 600;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      color: #C8973A;
    }
    @media print {
      body { padding: 0; }
      .sign { border-radius: 0; border-width: 3px; }
    }
  </style>
</head>
<body>
  <div class="sign">
    <div class="loaves">🌾</div>
    <div class="brand">Our Daily Bread</div>
    <hr class="divider"/>
    <div class="headline">Pay Whatever<br/>You Want!</div>
    <div class="sub">It all goes back to our church.</div>
    <div class="face">😊</div>
    <div class="church-line">Fresh Sourdough · Baked with Love</div>
    <div class="scripture">&ldquo;Give us this day our daily bread.&rdquo; &mdash; Matthew 6:11</div>
    ${qrPrintSection}
  </div>
  <script>
    window.onload = function() {
      setTimeout(function() { window.print(); }, 400);
    };
  </script>
</body>
</html>`;

    printWindow.document.write(signHtml);
    printWindow.document.close();
  }

  return (
    <div className="space-y-6">
      {/* Preview */}
      <div ref={signRef} className="mx-auto max-w-sm border-4 border-wheat rounded-2xl p-8 bg-cream relative text-center shadow-sm">
        {/* inner dashed border */}
        <div className="absolute inset-2 border border-dashed border-wheat/40 rounded-xl pointer-events-none" />

        <div className="text-5xl mb-1">🌾</div>
        <p className="text-xs tracking-[0.15em] uppercase font-semibold text-wheat mb-4">
          Our Daily Bread
        </p>
        <hr className="border-wheat/30 w-1/2 mx-auto mb-4" />

        <h3 className="font-serif text-4xl font-bold text-foreground leading-tight mb-2">
          Pay Whatever<br />You Want!
        </h3>
        <p className="font-serif text-lg text-foreground mb-2">
          It all goes back to our church.
        </p>
        <div className="text-5xl my-2">😊</div>
        <p className="text-xs uppercase tracking-widest font-semibold text-muted-foreground mt-3">
          Fresh Sourdough · Baked with Love
        </p>
        <p className="font-serif italic text-xs text-wheat/80 mt-3 pt-3 border-t border-wheat/20">
          &ldquo;Give us this day our daily bread.&rdquo; — Matthew 6:11
        </p>

        {/* QR code — shown when generated in Step 2 */}
        {qrSvgHtml ? (
          <div className="mt-4 pt-4 border-t border-wheat/20 flex flex-col items-center gap-2">
            <div
              className="w-28 h-28 [&_svg]:w-full [&_svg]:h-full"
              dangerouslySetInnerHTML={{ __html: qrSvgHtml }}
            />
            <p className="text-xs font-semibold uppercase tracking-widest text-wheat">
              Scan to Pay
            </p>
          </div>
        ) : (
          <div className="mt-4 pt-4 border-t border-wheat/20">
            <p className="text-xs text-muted-foreground/60 italic">
              QR code will appear here after Step 2
            </p>
          </div>
        )}
      </div>

      <div className="text-center space-y-2">
        <Button
          onClick={handlePrint}
          className="bg-wheat hover:bg-wheat-dark text-white gap-2 px-8"
          size="lg"
        >
          <Printer className="w-4 h-4" />
          {qrSvgHtml ? "Print Sign + QR" : "Print Sign"}
        </Button>
        <p className="text-xs text-muted-foreground">
          {qrSvgHtml
            ? "Prints your sign with QR code included · 5.5 inches wide"
            : "Opens a print-ready version in a new tab · Prints at 5.5 × 4 inches"}
        </p>
      </div>
    </div>
  );
}
