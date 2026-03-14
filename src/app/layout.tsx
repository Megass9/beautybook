import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "BeautyBook — Güzellik Salonu Randevu Sistemi",
  description: "Güzellik salonunuz için akıllı randevu sistemi ve mini web sitesi. Müşterileriniz 7/24 online randevu alabilsin.",
  keywords: "güzellik salonu, randevu sistemi, online randevu, berber, kuaför",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr">
      <body>
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: "#1a1714",
              color: "#fdf8f2",
              borderRadius: "12px",
              fontSize: "14px",
            },
          }}
        />
      </body>
    </html>
  );
}
