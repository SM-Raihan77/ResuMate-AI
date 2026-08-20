// "use client";

// import Link from "next/link";
// import { usePathname, useRouter } from "next/navigation";
// import { useState, useEffect } from "react";
// // import { useAuth } from "@/providers/auth-provider";
// import {
//   Menu,
//   X,
//   Sparkles,
//   LogOut,
//   LayoutDashboard,
//   ChevronDown,
//   FileText,
//   TrendingUp,
//   MessageCircle,
//   Briefcase,
//   BookOpen,
//   BarChart3,
//   ArrowRight,
// } from "lucide-react";

// const publicLinks = [
//   { href: "/", label: "Home" },
//   { href: "/jobs", label: "Jobs" },
//   { href: "/blog", label: "Blog" },
//   { href: "/about", label: "About" },
//   { href: "/contact", label: "Contact" },
// ];

// const featureLinks = [
//   { href: "/resume/analyze", label: "Resume Analyzer", desc: "ATS scores & fixes", icon: FileText },
//   { href: "/recommendations", label: "Recommendations", desc: "AI-matched jobs", icon: TrendingUp },
//   { href: "/chat", label: "Career Chat", desc: "Talk to your AI mentor", icon: MessageCircle },
//   { href: "/interview", label: "Interview Prep", desc: "Practice & feedback", icon: Briefcase },
//   { href: "/roadmap", label: "Learning Roadmap", desc: "Personalized plans", icon: BookOpen },
//   { href: "/skills", label: "Skill Assessment", desc: "Find your gaps", icon: BarChart3 },
// ];

// function isActive(pathname: string, href: string) {
//   if (href === "/") return pathname === "/";
//   return pathname === href || pathname.startsWith(href + "/");
// }

// export default function Navbar() {
//   const pathname = usePathname();
//   const router = useRouter();
// //   const { isAuthenticated, user, logout } = useAuth();
//   const [open, setOpen] = useState(false);
//   const [scrolled, setScrolled] = useState(false);
//   const [featuresOpen, setFeaturesOpen] = useState(false);
//   const [userOpen, setUserOpen] = useState(false);
//   const [mounted, setMounted] = useState(false);

//   useEffect(() => {
//     setMounted(true);
//   }, []);

//   useEffect(() => {
//     const onScroll = () => setScrolled(window.scrollY > 12);
//     window.addEventListener("scroll", onScroll);
//     return () => window.removeEventListener("scroll", onScroll);
//   }, []);

// //   const showAuthed = mounted && isAuthenticated;

//   useEffect(() => {
//     setOpen(false);
//     setFeaturesOpen(false);
//     setUserOpen(false);
//   }, [pathname]);

// //   const initial = (user?.fullname || user?.email || "?").charAt(0).toUpperCase();

//   return (
//     <header
//       className={`sticky top-0 z-50 w-full transition-all duration-300 ${
//         scrolled
//           ? "bg-[#2d2d2d]/80 backdrop-blur-lg border-b border-[#444444]/70 shadow-[0_4px_24px_-12px_rgba(255,234,0,0.25)]"
//           : "bg-[#2d2d2d]/60 backdrop-blur-md border-b border-transparent"
//       }`}
//     >
//       <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
//         <Link href="/" className="group flex items-center gap-2.5">
//           <span className="relative grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-[#ffea00] via-[#ffd700] to-[#ffea00] text-[#1a1a1a] shadow-lg shadow-[#ffea00]/30 transition-transform group-hover:scale-105">
//             <Sparkles className="h-5 w-5" />
//             <span className="absolute inset-0 rounded-xl bg-gradient-to-br from-[#ffea00] to-[#ffd700] opacity-0 blur transition-opacity group-hover:opacity-60" />
//           </span>
//           <span className="text-lg font-extrabold tracking-tight text-[#e0e0e0]">
//             AI<span className="text-[#ffea00]">Career</span>
//             <span className="text-[#ffd700]">Mentor</span>
//           </span>
//         </Link>

//         <div className="hidden lg:flex items-center gap-1">
//           {publicLinks.map((l) => (
//             <Link
//               key={l.href}
//               href={l.href}
//               className={`relative px-3.5 py-2 text-sm font-medium rounded-lg transition-colors ${
//                 isActive(pathname, l.href)
//                   ? "text-[#ffea00]"
//                   : "text-[#aaaaaa] hover:text-[#ffea00]"
//               }`}
//             >
//               {l.label}
//               {isActive(pathname, l.href) && (
//                 <span className="absolute inset-x-3 -bottom-px h-0.5 rounded-full bg-gradient-to-r from-[#ffea00] to-[#ffd700]" />
//               )}
//             </Link>
//           ))}

//           <div
//             className="relative"
//             onMouseEnter={() => setFeaturesOpen(true)}
//             onMouseLeave={() => setFeaturesOpen(false)}
//           >
//             <button
//               className={`flex items-center gap-1 px-3.5 py-2 text-sm font-medium rounded-lg transition-colors ${
//                 pathname.startsWith("/resume") ||
//                 pathname.startsWith("/recommend") ||
//                 pathname.startsWith("/chat") ||
//                 pathname.startsWith("/interview") ||
//                 pathname.startsWith("/roadmap") ||
//                 pathname.startsWith("/skills")
//                   ? "text-[#ffea00]"
//                   : "text-[#aaaaaa] hover:text-[#ffea00]"
//               }`}
//             >
//               Features
//               <ChevronDown className={`h-4 w-4 transition-transform ${featuresOpen ? "rotate-180" : ""}`} />
//             </button>

//             <div
//               className={`absolute left-1/2 top-full z-50 mt-2 w-[34rem] -translate-x-1/2 transition-all duration-200 ${
//                 featuresOpen
//                   ? "visible opacity-100 translate-y-0"
//                   : "invisible opacity-0 -translate-y-1"
//               }`}
//             >
//               <div className="rounded-2xl border border-[#444444] bg-[#2d2d2d] p-3 shadow-2xl shadow-[#ffea00]/10">
//                 <div className="grid grid-cols-2 gap-1">
//                   {featureLinks.map((f) => {
//                     const Icon = f.icon;
//                     return (
//                       <Link
//                         key={f.href}
//                         href={f.href}
//                         className="group/item flex items-start gap-3 rounded-xl p-3 transition-colors hover:bg-[#333333]"
//                       >
//                         <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-[#333333] text-[#ffea00] transition-colors group-hover/item:bg-[#ffea00] group-hover/item:text-[#1a1a1a]">
//                           <Icon className="h-4.5 w-4.5" />
//                         </span>
//                         <span>
//                           <span className="block text-sm font-semibold text-[#e0e0e0]">{f.label}</span>
//                           <span className="block text-xs text-[#888888]">{f.desc}</span>
//                         </span>
//                       </Link>
//                     );
//                   })}
//                 </div>
//                 <Link
//                   href="/features"
//                   className="mt-1 flex items-center justify-center gap-1 rounded-xl bg-[#333333] py-2.5 text-sm font-medium text-[#ffea00] hover:bg-[#444444]"
//                 >
//                   View all features <ArrowRight className="h-4 w-4" />
//                 </Link>
//               </div>
//             </div>
//           </div>
//         </div>

//         <div className="hidden lg:flex items-center gap-2">
//           {/* {showAuthed ? (
//             <div className="relative" onMouseEnter={() => setUserOpen(true)} onMouseLeave={() => setUserOpen(false)}>
//               <button className="flex items-center gap-2 rounded-full border border-[#444444] py-1 pl-1 pr-2.5 hover:border-[#ffea00] transition-colors">
//                 {user?.avatar ? (
//                   <img
//                     src={user.avatar}
//                     alt={user?.fullname || "User"}
//                     referrerPolicy="no-referrer"
//                     className="h-8 w-8 rounded-full object-cover"
//                   />
//                 ) : (
//                   <span className="grid h-8 w-8 place-items-center rounded-full bg-gradient-to-br from-[#ffea00] to-[#ffd700] text-sm font-bold text-[#1a1a1a]">
//                     {initial}
//                   </span>
//                 )}
//                 <span className="text-sm font-medium text-[#aaaaaa] max-w-[8rem] truncate">
//                   {user?.fullname?.split(" ")[0] || "Account"}
//                 </span>
//                 <ChevronDown className="h-4 w-4 text-[#888888]" />
//               </button>
//               <div
//                 className={`absolute right-0 top-full z-50 mt-2 w-52 transition-all duration-200 ${
//                   userOpen ? "visible opacity-100 translate-y-0" : "invisible opacity-0 -translate-y-1"
//                 }`}
//               >
//                 <div className="rounded-xl border border-[#444444] bg-[#2d2d2d] p-1.5 shadow-2xl shadow-[#ffea00]/10">
//                   <Link
//                     href="/dashboard"
//                     className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-[#aaaaaa] hover:bg-[#333333] hover:text-[#ffea00]"
//                   >
//                     <LayoutDashboard className="h-4 w-4" /> Dashboard
//                   </Link>
//                   <button
//                     onClick={() => {
//                       logout();
//                       router.push("/");
//                     }}
//                     className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-red-400 hover:bg-[#333333]"
//                   >
//                     <LogOut className="h-4 w-4" /> Logout
//                   </button>
//                 </div>
//               </div>
//             </div>
//           ) : ( */}
//             <>
//               <Link
//                 href="/login"
//                 className="px-4 py-2 text-sm font-semibold text-[#aaaaaa] rounded-lg hover:bg-[#333333] transition-colors"
//               >
//                 Login
//               </Link>
//               <Link
//                 href="/register"
//                 className="group relative inline-flex items-center gap-1 overflow-hidden rounded-lg bg-gradient-to-r from-[#ffea00] to-[#ffd700] px-4 py-2 text-sm font-semibold text-[#1a1a1a] shadow-md shadow-[#ffea00]/30 transition-transform hover:scale-[1.03]"
//               >
//                 Get Started
//                 <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
//               </Link>
//             </>
//           {/* )} */}
//         </div>

//         <button
//           className="lg:hidden grid h-10 w-10 place-items-center rounded-lg text-[#aaaaaa] hover:bg-[#333333]"
//           onClick={() => setOpen(!open)}
//           aria-label="Toggle menu"
//         >
//           {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
//         </button>
//       </nav>

//       {open && (
//         <div className="lg:hidden border-t border-[#444444] bg-[#2d2d2d]/95 backdrop-blur-lg">
//           <div className="max-h-[calc(100vh-4rem)] overflow-y-auto px-4 py-4 space-y-1">
//             {publicLinks.map((l) => (
//               <Link
//                 key={l.href}
//                 href={l.href}
//                 className={`block rounded-lg px-3 py-2.5 text-sm font-medium ${
//                   isActive(pathname, l.href)
//                     ? "bg-[#333333] text-[#ffea00]"
//                     : "text-[#aaaaaa] hover:bg-[#333333]"
//                 }`}
//               >
//                 {l.label}
//               </Link>
//             ))}

//             <p className="px-3 pt-3 text-xs font-semibold uppercase tracking-wide text-[#666666]">
//               AI Features
//             </p>
//             {featureLinks.map((f) => {
//               const Icon = f.icon;
//               return (
//                 <Link
//                   key={f.href}
//                   href={f.href}
//                   className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-[#aaaaaa] hover:bg-[#333333]"
//                 >
//                   <Icon className="h-4 w-4 text-[#ffea00]" />
//                   {f.label}
//                 </Link>
//               );
//             })}

//             <div className="pt-3 border-t border-[#444444] flex flex-col gap-2 mt-2">
//               {/* {showAuthed ? (
//                 <>
//                   <div className="flex items-center gap-3 rounded-lg bg-[#333333] px-3 py-2.5">
//                     {user?.avatar ? (
//                       <img
//                         src={user.avatar}
//                         alt={user?.fullname || "User"}
//                         referrerPolicy="no-referrer"
//                         className="h-9 w-9 rounded-full object-cover"
//                       />
//                     ) : (
//                       <span className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-[#ffea00] to-[#ffd700] text-sm font-bold text-[#1a1a1a]">
//                         {initial}
//                       </span>
//                     )}
//                     <span className="text-sm font-medium text-white truncate">
//                       {user?.fullname || "Account"}
//                     </span>
//                   </div>
//                   <Link
//                     href="/dashboard"
//                     className="flex items-center justify-center gap-1 rounded-lg border border-[#444444] py-2.5 text-sm font-medium text-[#aaaaaa]"
//                   >
//                     <LayoutDashboard className="h-4 w-4" /> Dashboard
//                   </Link>
//                   <button
//                     onClick={() => {
//                       logout();
//                       router.push("/");
//                     }}
//                     className="flex items-center justify-center gap-1 rounded-lg bg-[#333333] py-2.5 text-sm font-medium text-red-400"
//                   >
//                     <LogOut className="h-4 w-4" /> Logout
//                   </button>
//                 </>
//               ) : ( */}
//                 <>
//                   <Link
//                     href="/login"
//                     className="rounded-lg border border-[#444444] py-2.5 text-center text-sm font-medium text-[#aaaaaa]"
//                   >
//                     Login
//                   </Link>
//                   <Link
//                     href="/register"
//                     className="rounded-lg bg-gradient-to-r from-[#ffea00] to-[#ffd700] py-2.5 text-center text-sm font-semibold text-[#1a1a1a]"
//                   >
//                     Get Started
//                   </Link>
//                 </>
//               {/* )} */}
//             </div>
//           </div>
//         </div>
//       )}
//     </header>
//   );
// }