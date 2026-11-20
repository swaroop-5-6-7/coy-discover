import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata = {
  title: "coy. — Discover",
  description: "Find out if your crush likes you back",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${jakarta.className} bg-[#F8F7FC] text-[#18181B] antialiased`}>
        {children}
      </body>
    </html>
  );
}