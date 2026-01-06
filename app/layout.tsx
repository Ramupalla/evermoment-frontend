import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import GlobalGlow from "@/components/GlobalGlow";

export const metadata: Metadata = {
  title: "EverMoment - Your moments, beautifully forever",
  description:
    "Turn your recorded videos into beautiful memories you can rewatch again and again.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased relative overflow-x-hidden">
        {/* 🌌 Global emotional background (fixed, behind all pages) */}
        <GlobalGlow />

        {/* App content layered above background */}
        <div className="relative z-10">
          <Header />
          <main>{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}

// import type { Metadata } from "next";
// import "./globals.css";
// import Header from "@/components/Header";
// import Footer from "@/components/Footer";
// import GlobalGlow from "@/components/GlobalGlow";
// // import ThemeProviderClient from "@/components/ThemeProviderClient";
// import ThemeProviderClient from "../components/ThemeProviderClient";


// export const metadata: Metadata = {
//   title: "EverMoment - Your moments, beautifully forever",
//   description:
//     "Turn your recorded videos into beautiful memories you can rewatch again and again.",
// };

// export default function RootLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   return (
//     <html lang="en" suppressHydrationWarning>
//       <body className="antialiased relative overflow-x-hidden">
//         <ThemeProviderClient>
//           <GlobalGlow />

//           <div className="relative z-10">
//             <Header />
//             <main>{children}</main>
//             <Footer />
//           </div>
//         </ThemeProviderClient>
//       </body>
//     </html>
//   );
// }
