import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cash Register",
  description: "A Cash Register App built with React and TypeScript",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <div className="mx-auto max-w-screen-md">{children}</div>
      </body>
    </html>
  );
}
