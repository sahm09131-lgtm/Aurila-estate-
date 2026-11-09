import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "Aurelia Estates — Property, considered.", template: "%s | Aurelia Estates" },
  description: "A considered way to discover exceptional homes. Explore the Aurelia Estates illustrative property catalogue.",
  openGraph: {
    title: "Aurelia Estates — Property, considered.",
    description: "A considered way to discover exceptional homes.",
    type: "website"
  }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
