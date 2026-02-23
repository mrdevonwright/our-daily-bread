"use client";

import { useState, useRef } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Printer, Download } from "lucide-react";

const PAYMENT_APPS = [
  {
    id: "venmo",
    label: "Venmo",
    emoji: "💜",
    placeholder: "your-username",
    hint: "Your Venmo username (without @)",
    buildUrl: (handle: string) => `https://venmo.com/u/${handle.replace(/^@/, "")}`,
  },
  {
    id: "cashapp",
    label: "Cash App",
    emoji: "💚",
    placeholder: "YourCashtag",
    hint: "Your $Cashtag (without $)",
    buildUrl: (handle: string) => `https://cash.app/$${handle.replace(/^\$/, "")}`,
  },
  {
    id: "zelle",
    label: "Zelle",
    emoji: "🟣",
    placeholder: "phone or email",
    hint: "The phone number or email linked to your Zelle account",
    buildUrl: (handle: string) => handle,
  },
  {
    id: "other",
    label: "Custom URL",
    emoji: "🔗",
    placeholder: "https://…",
    hint: "Paste any payment link or URL",
    buildUrl: (handle: string) => handle,
  },
];

export function QRCodeGenerator() {
  const [appId, setAppId] = useState("venmo");
  const [handle, setHandle] = useState("");
  const qrRef = useRef<HTMLDivElement>(null);

  const app = PAYMENT_APPS.find((a) => a.id === appId)!;
  const qrValue = handle.trim() ? app.buildUrl(handle.trim()) : "";

  function handlePrint() {
    if (!qrValue) return;
    const printWindow = window.open("", "_blank", "width=600,height=700");
    if (!printWindow) return;

    // Grab the SVG markup from the rendered QR component
    const svgEl = qrRef.current?.querySelector("svg");
    const svgHtml = svgEl ? svgEl.outerHTML : "";

    printWindow.document.write(`<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8"/>
  <title>Payment QR Code — Our Daily Bread</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,700;1,400&family=Inter:wght@400;600&display=swap');
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      display: flex; align-items: center; justify-content: center;
      min-height: 100vh; padding: 24px;
      font-family: 'Inter', sans-serif;
    }
    .card {
      text-align: center;
      border: 3px solid #C8973A;
      border-radius: 16px;
      padding: 32px 40px;
      max-width: 320px;
      background: #FFFDF6;
    }
    .card svg { width: 220px; height: 220px; margin: 0 auto 16px; display: block; }
    .brand { font-family: 'Lora', serif; font-size: 11px; letter-spacing: 0.15em; text-transform: uppercase; color: #C8973A; font-weight: 700; margin-bottom: 8px; }
    .title { font-family: 'Lora', serif; font-size: 20px; font-weight: 700; color: #2C1810; margin-bottom: 4px; }
    .sub { font-size: 13px; color: #6B5744; margin-bottom: 16px; }
    .url { font-size: 11px; color: #9E7A50; word-break: break-all; margin-top: 12px; padding-top: 12px; border-top: 1px solid #E8D5B0; font-style: italic; }
    @media print { body { padding: 0; } }
  </style>
</head>
<body>
  <div class="card">
    <div class="brand">Our Daily Bread</div>
    ${svgHtml}
    <div class="title">Scan to Pay</div>
    <div class="sub">Pay whatever you want — it all goes to the church!</div>
    <div class="url">${qrValue}</div>
  </div>
  <script>window.onload = function() { setTimeout(function() { window.print(); }, 400); };</script>
</body>
</html>`);
    printWindow.document.close();
  }

  function handleDownload() {
    if (!qrValue) return;
    const svgEl = qrRef.current?.querySelector("svg");
    if (!svgEl) return;
    const blob = new Blob([svgEl.outerHTML], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "our-daily-bread-qr.svg";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-6">
      {/* App selector */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {PAYMENT_APPS.map((a) => (
          <button
            key={a.id}
            onClick={() => { setAppId(a.id); setHandle(""); }}
            className={`flex flex-col items-center gap-1 rounded-xl border-2 py-3 px-2 text-sm font-medium transition-colors ${
              appId === a.id
                ? "border-wheat bg-wheat/10 text-wheat"
                : "border-border bg-white text-muted-foreground hover:border-wheat/50"
            }`}
          >
            <span className="text-2xl">{a.emoji}</span>
            {a.label}
          </button>
        ))}
      </div>

      {/* Handle input */}
      <div className="space-y-1.5">
        <Label htmlFor="handle">{app.label} handle</Label>
        <Input
          id="handle"
          placeholder={app.placeholder}
          value={handle}
          onChange={(e) => setHandle(e.target.value)}
          className="font-mono"
        />
        <p className="text-xs text-muted-foreground">{app.hint}</p>
      </div>

      {/* QR preview */}
      <div className="flex flex-col items-center gap-4">
        <div
          ref={qrRef}
          className={`rounded-2xl border-2 border-wheat/30 bg-white p-6 shadow-sm transition-opacity ${
            qrValue ? "opacity-100" : "opacity-30"
          }`}
        >
          <QRCodeSVG
            value={qrValue || "https://ourdailybread.club"}
            size={200}
            fgColor="#2C1810"
            bgColor="#FFFFFF"
            level="M"
          />
        </div>

        {qrValue && (
          <p className="text-xs text-center text-muted-foreground font-mono bg-muted px-3 py-1.5 rounded-lg break-all max-w-xs">
            {qrValue}
          </p>
        )}

        <div className="flex gap-3">
          <Button
            onClick={handlePrint}
            disabled={!qrValue}
            className="bg-wheat hover:bg-wheat-dark text-white gap-2"
          >
            <Printer className="w-4 h-4" />
            Print QR Card
          </Button>
          <Button
            onClick={handleDownload}
            disabled={!qrValue}
            variant="outline"
            className="border-wheat text-wheat hover:bg-wheat/10 gap-2"
          >
            <Download className="w-4 h-4" />
            Download SVG
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">
          Tip: laminate it or put it in a picture frame for durability.
        </p>
      </div>
    </div>
  );
}
