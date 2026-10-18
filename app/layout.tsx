import type { Metadata, Viewport } from "next";
import { Playfair_Display, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "../context/AuthContext";
import PwaInstaller from "../components/PwaInstaller";

const playfairDisplay = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "600", "700", "800"],
  display: "swap",
});

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#090503" },
    { media: "(prefers-color-scheme: light)", color: "#090503" },
  ],
};

export const metadata: Metadata = {
  title: "PsikoWay",
  applicationName: "PsikoWay",
  description: "Psikoloji, bilim, zihin analizleri, kokoloji testleri ve düşüncelerinizi özgürce paylaşabileceğiniz etkileşimli topluluk forumu.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "PsikoWay",
  },
  other: {
    "mobile-web-app-capable": "yes",
    "apple-mobile-web-app-capable": "yes",
    "application-name": "PsikoWay",
    "apple-mobile-web-app-title": "PsikoWay",
  },
  icons: {
    icon: [
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    shortcut: ["/icon-192.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="tr"
      className={`${playfairDisplay.variable} ${plusJakartaSans.variable} antialiased`}
    >
      <body className="min-h-screen flex flex-col">
        <AuthProvider>
          {children}
          <PwaInstaller />
        </AuthProvider>
      </body>
    </html>
  );
}

