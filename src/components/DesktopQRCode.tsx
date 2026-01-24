"use client";

import { QRCodeCanvas } from "qrcode.react";

export default function DesktopQRCode() {
  return (
    <div className="p-3 bg-white dark:bg-gray-900 rounded-lg shadow-md flex flex-col items-center">
      <QRCodeCanvas
        value="https://faistasortieatoulouse.online"
        size={170}
        includeMargin
      />
      <p className="text-xs mt-2 text-gray-600 dark:text-gray-300">
        Scanner pour ouvrir l'app
      </p>
    </div>
  );
}
