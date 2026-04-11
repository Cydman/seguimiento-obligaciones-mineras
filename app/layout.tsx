import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Seguimiento de Obligaciones Mineras",
  description:
    "Aplicativo web para seguimiento de obligaciones de titulares frente a autoridad minera.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}