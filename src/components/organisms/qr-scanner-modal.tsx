"use client";

import { useEffect, useState, useRef } from "react";
import { Html5QrcodeScanner, Html5QrcodeScanType } from "html5-qrcode";
import { handleQRCheckInOut } from "@/lib/actions/attendance";
import { Button } from "@/components/atoms/button";

export function QRScannerModal({
  eventId,
  onClose,
}: {
  eventId: string;
  onClose: () => void;
}) {
  const [message, setMessage] = useState<string | null>(null);
  const isProcessingRef = useRef(false);

  useEffect(() => {
    let isScanning = true;
    let scanner: Html5QrcodeScanner | null = null;

    // We use a slight delay to prevent React 18 StrictMode from double-instantiating the scanner
    const initTimer = setTimeout(() => {
      scanner = new Html5QrcodeScanner(
        "qr-reader",
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
          supportedScanTypes: [Html5QrcodeScanType.SCAN_TYPE_CAMERA],
        },
        false,
      );
      scanner.render(onScanSuccess, onScanFailure);
    }, 100);

    async function onScanSuccess(decodedText: string) {
      if (isProcessingRef.current || !isScanning) return;
      try {
        isProcessingRef.current = true;
        const payload = JSON.parse(decodedText);

        if (payload.eventId !== eventId) {
          setMessage("Invalid QR: Event ID mismatch.");
          if (scanner) scanner.pause(true);
          setTimeout(() => {
            setMessage(null);
            isProcessingRef.current = false;
            if (isScanning && scanner) scanner.resume();
          }, 2000);
          return;
        }

        const result = await handleQRCheckInOut(
          payload.eventId,
          payload.memberId,
        );
        setMessage(`Success: ${result}`);

        if (scanner) scanner.pause(true);
        setTimeout(() => {
          setMessage(null);
          isProcessingRef.current = false;
          if (isScanning && scanner) scanner.resume();
        }, 2000);
      } catch (err) {
        setMessage(
          `Error: ${err instanceof Error ? err.message : String(err)}`,
        );
        if (scanner) scanner.pause(true);
        setTimeout(() => {
          setMessage(null);
          isProcessingRef.current = false;
          if (isScanning && scanner) scanner.resume();
        }, 2000);
      }
    }

    function onScanFailure() {
      // Ignore background scan failures
    }

    return () => {
      isScanning = false;
      clearTimeout(initTimer);
      if (scanner) {
        scanner.clear().catch(console.error);
      }
    };
  }, [eventId]);

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4 sm:p-6 bg-slate-900/40 backdrop-blur-sm">
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col">
        <div className="p-6">
          <h2 className="text-xl font-bold mb-4">Scan QR Code</h2>
          <div id="qr-reader" className="w-full"></div>
          {message && (
            <div
              className={`mt-4 p-3 rounded-lg text-center font-semibold text-white ${message.startsWith("Error") || message.startsWith("Invalid") ? "bg-destructive" : "bg-success"}`}
            >
              {message}
            </div>
          )}
        </div>
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end">
          <Button variant="secondary" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}
