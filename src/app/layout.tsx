import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import { IntroProvider } from "@/components/providers/IntroProvider";
import { SmoothScroll } from "@/components/providers/SmoothScroll";
import { CustomCursor } from "@/components/ui/CustomCursor";

// The whole site uses Montserrat — both weights and italic are loaded since
// several labels lean on font-style: italic.
const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "Sri Sairam Techno Incubator Foundation",
  description:
    "Incubation, labs, mentors and funding — on one engineering campus in Chennai. We help you go from first prototype to first customer.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${montserrat.variable} antialiased`}>
      <body>
        <CustomCursor />
        <IntroProvider>
          <SmoothScroll>{children}</SmoothScroll>
        </IntroProvider>
      </body>
    </html>
  );
}
