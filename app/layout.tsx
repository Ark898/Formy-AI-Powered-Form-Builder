import type { Metadata } from "next";
import { DM_Sans, Instrument_Serif } from "next/font/google";
import { Toaster } from "@/components/ui/toaster";
import { getAppUrl } from "@/lib/app-url";
import "./globals.css";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-display",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Formy.ai - AI-Powered Form Builder & Data Insights",
    template: "%s | Formy.ai"
  },
  description: "Create stunning, high-converting forms in seconds with Formy.ai's intuitive drag-and-drop builder and AI-guided suggestions. Master your data today.",
  keywords: [
    "AI form builder",
    "No-code forms",
    "Lead generation",
    "Survey software",
    "Next.js form generator",
    "Custom forms",
    "Smart surveys",
    "Form analytics"
  ],
  authors: [{ name: "Formy.ai Team" }],
  creator: "Formy.ai Team",
  publisher: "Formy.ai",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(getAppUrl()),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Formy.ai - The Future of Form Design",
    description: "Launch professional forms without writing a single line of code. Try the smartest form builder powered by AI.",
    url: getAppUrl(),
    siteName: "Formy.ai",
    images: [
      {
        url: "/images/form-bg.jpg",
        width: 1200,
        height: 630,
        alt: "Formy.ai Interface Preview",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Formy.ai - AI-Powered Form Builder",
    description: "Build beautiful, high-converting forms instantly. Smart, fast, and no-code.",
    images: ["/images/form-bg.jpg"],
    creator: "@formy_ai",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${dmSans.variable} ${instrumentSerif.variable} font-sans bg-background text-foreground antialiased`}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              "name": "Formy.ai",
              "operatingSystem": "Web",
              "applicationCategory": "BusinessApplication",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD"
              },
              "description": "Create stunning, high-converting forms in seconds with Formy.ai's intuitive drag-and-drop builder and AI-guided suggestions.",
              "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": "4.9",
                "ratingCount": "1200"
              }
            }),
          }}
        />
        {children}
        <Toaster />
      </body>
    </html>
  );
}
