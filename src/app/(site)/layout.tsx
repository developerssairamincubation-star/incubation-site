import { IntroProvider } from "@/components/providers/IntroProvider";
import { SmoothScroll } from "@/components/providers/SmoothScroll";
import { CustomCursor } from "@/components/ui/CustomCursor";

/**
 * Public-site chrome. Kept out of the root layout so /admin gets a plain,
 * form-friendly page — no custom cursor, smooth scrolling or intro.
 */
export default function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <CustomCursor />
      <IntroProvider>
        <SmoothScroll>{children}</SmoothScroll>
      </IntroProvider>
    </>
  );
}
