// "use client";

// import Link from "next/link";
// import { usePathname } from "next/navigation";
// import { useState } from "react";
// import clsx from "clsx";

// const navItems = [
//   { label: "Home", href: "/" },
//   { label: "Create", href: "/create" },
//   { label: "Pricing", href: "/pricing" },
//   { label: "Contact", href: "/contact" },
// ];

// export default function Header() {
//   const pathname = usePathname();
//   const [open, setOpen] = useState(false);

//   return (
//     <header className="sticky top-0 z-50 bg-white/70 backdrop-blur-lg border-b border-white/40 shadow-sm">
//       <nav className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        
//         {/* Brand */}
//         {/* <Link href="/" className="relative">
//           <span className="celebration-text text-2xl font-bold tracking-tight">
//             EverMomentStudio
//           </span>
//         </Link> */}

//               <Link href="/" className="relative group">
//         <span
//           className="
//             brand-glow
//             text-2xl
//             font-extrabold
//             tracking-tight
//             text-[#1f1f1f]
//             transition
//             duration-300
//             group-hover:opacity-90
//           "
//         >
//           EverMoment <span className="text-[#d4af37]">Studio</span>
//         </span>
//       </Link>



//         {/* Desktop Navigation */}
//         <div className="hidden md:flex items-center gap-8">
//           {navItems.map((item) => {
//             const isActive =
//               pathname === item.href ||
//               (item.href !== "/" && pathname.startsWith(item.href));

//             return (
//               <Link
//                 key={item.href}
//                 href={item.href}
//                 className={clsx(
//                   "relative text-sm font-medium py-1 transition-colors",
//                   "after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-full after:origin-left after:scale-x-0 after:bg-gray-900 after:transition-transform",
//                   isActive
//                     ? "text-gray-900 after:scale-x-100"
//                     : "text-gray-700 hover:text-gray-900 hover:after:scale-x-100"
//                 )}
//               >
//                 {item.label}
//               </Link>
//             );
//           })}
//         </div>

//         {/* Mobile Hamburger */}
//         <button
//           onClick={() => setOpen(!open)}
//           className="md:hidden flex flex-col gap-[5px]"
//           aria-label="Toggle menu"
//         >
//           <span
//             className={`h-[2px] w-6 bg-gray-900 transition ${
//               open ? "rotate-45 translate-y-[7px]" : ""
//             }`}
//           />
//           <span
//             className={`h-[2px] w-6 bg-gray-900 transition ${
//               open ? "opacity-0" : ""
//             }`}
//           />
//           <span
//             className={`h-[2px] w-6 bg-gray-900 transition ${
//               open ? "-rotate-45 -translate-y-[7px]" : ""
//             }`}
//           />
//         </button>
//       </nav>

//       {/* Mobile Menu */}
//       {open && (
//         <div className="md:hidden bg-white/90 backdrop-blur-lg border-t border-white/40 shadow-sm">
//           <div className="flex flex-col px-6 py-4 gap-4">
//             {navItems.map((item) => {
//               const isActive =
//                 pathname === item.href ||
//                 (item.href !== "/" && pathname.startsWith(item.href));

//               return (
//                 <Link
//                   key={item.href}
//                   href={item.href}
//                   onClick={() => setOpen(false)}
//                   className={clsx(
//                     "relative text-base font-medium py-1 transition-colors",
//                     "after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-full after:origin-left after:scale-x-0 after:bg-gray-900 after:transition-transform",
//                     isActive
//                       ? "text-gray-900 after:scale-x-100"
//                       : "text-gray-700 hover:text-gray-900 hover:after:scale-x-100"
//                   )}
//                 >
//                   {item.label}
//                 </Link>
//               );
//             })}
//           </div>
//         </div>
//       )}
//     </header>
//   );
// }



"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import clsx from "clsx";

const navItems = [
  { label: "Home", href: "/" },
  { label: "Create", href: "/create" },
  { label: "Pricing", href: "/pricing" },
  { label: "Contact", href: "/contact" },
];

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/70 backdrop-blur-lg border-b border-white/40 shadow-sm">
      <nav className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">

        {/* Brand */}
        <Link href="/" className="relative group">
          <span
            className="
              brand-glow
              text-2xl
              font-extrabold
              tracking-tight
              text-[#1f1f1f]
              transition
              duration-300
              group-hover:opacity-90
            "
          >
            EverMoment <span className="text-[#d4af37]">Studio</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/" && pathname.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                className={clsx(
                  "relative text-sm font-medium py-1 transition-all duration-300",
                  "after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-full after:origin-left after:scale-x-0 after:bg-[#d4af37] after:transition-transform after:duration-300",
                  isActive
                    ? "text-[#d4af37] after:scale-x-100"
                    : "text-gray-700 hover:text-[#d4af37] hover:after:scale-x-100"
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </div>

        {/* Mobile Hamburger */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden flex flex-col gap-[5px]"
          aria-label="Toggle menu"
        >
          <span
            className={`h-[2px] w-6 bg-gray-900 transition ${
              open ? "rotate-45 translate-y-[7px]" : ""
            }`}
          />
          <span
            className={`h-[2px] w-6 bg-gray-900 transition ${
              open ? "opacity-0" : ""
            }`}
          />
          <span
            className={`h-[2px] w-6 bg-gray-900 transition ${
              open ? "-rotate-45 -translate-y-[7px]" : ""
            }`}
          />
        </button>
      </nav>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden bg-white/90 backdrop-blur-lg border-t border-white/40 shadow-sm">
          <div className="flex flex-col px-6 py-4 gap-4">
            {navItems.map((item) => {
              const isActive =
                pathname === item.href ||
                (item.href !== "/" && pathname.startsWith(item.href));

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={clsx(
                    "relative text-base font-medium py-1 transition-all duration-300",
                    "after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-full after:origin-left after:scale-x-0 after:bg-[#d4af37] after:transition-transform after:duration-300",
                    isActive
                      ? "text-[#d4af37] after:scale-x-100"
                      : "text-gray-700 hover:text-[#d4af37] hover:after:scale-x-100"
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
}
