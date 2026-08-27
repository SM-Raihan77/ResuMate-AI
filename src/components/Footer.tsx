'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Bot, 
  Mail, 
  Phone, 
  MapPin 
} from 'lucide-react';

export default function Footer(): React.JSX.Element {
  return (
    <footer className="bg-[#050608] text-white border-t border-white/[0.08] pt-16 pb-10 relative overflow-hidden">
      
      {/* Subtle ambient glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[500px] h-[150px] bg-[#FFE600]/4 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-white/[0.08]">
          
          {/* Brand Info */}
          <div className="lg:col-span-4 space-y-4">
            <Link href="/" className="flex items-center gap-2.5 group shrink-0">
              <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-[#FFE600] text-black shadow-[0_0_15px_rgba(255,230,0,0.3)]">
                <Bot className="w-4 h-4 stroke-[2.5]" />
              </div>
              <span className="font-extrabold text-xl tracking-tight text-white">
                ResuMate<span className="text-[#FFE600]">.AI</span>
              </span>
            </Link>

            <p className="text-gray-400 text-xs sm:text-sm leading-relaxed max-w-sm">
              Your AI-powered career growth partner. Resume analysis, job recommendations, interview prep, and personalized learning roadmaps.
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-3 pt-2">
              <Link 
                href="https://twitter.com" 
                target="_blank" 
                className="w-8 h-8 rounded-lg bg-[#121316] border border-white/[0.08] flex items-center justify-center text-gray-400 hover:text-[#FFE600] hover:border-[#FFE600]/40 transition-colors"
                aria-label="Twitter / X"
              >
                <svg className="w-3.5 h-3.5 fill-currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </Link>
              <Link 
                href="https://linkedin.com" 
                target="_blank" 
                className="w-8 h-8 rounded-lg bg-[#121316] border border-white/[0.08] flex items-center justify-center text-gray-400 hover:text-[#FFE600] hover:border-[#FFE600]/40 transition-colors"
                aria-label="LinkedIn"
              >
                <svg className="w-3.5 h-3.5 fill-currentColor" viewBox="0 0 24 24">
                  <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
                </svg>
              </Link>
              <Link 
                href="https://github.com" 
                target="_blank" 
                className="w-8 h-8 rounded-lg bg-[#121316] border border-white/[0.08] flex items-center justify-center text-gray-400 hover:text-[#FFE600] hover:border-[#FFE600]/40 transition-colors"
                aria-label="GitHub"
              >
                <svg className="w-3.5 h-3.5 fill-currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
                </svg>
              </Link>
            </div>
          </div>

          {/* Services Links */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-sm font-bold text-white">
              Services
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-gray-400">
              <li><Link href="#features" className="hover:text-[#FFE600] transition-colors">Features</Link></li>
              <li><Link href="#tools" className="hover:text-[#FFE600] transition-colors">Resume ATS Analysis</Link></li>
              <li><Link href="#tools" className="hover:text-[#FFE600] transition-colors">Career Chatbot</Link></li>
              <li><Link href="#tools" className="hover:text-[#FFE600] transition-colors">Learning Roadmaps</Link></li>
              <li><Link href="#" className="hover:text-[#FFE600] transition-colors">Blog & Resources</Link></li>
            </ul>
          </div>

          {/* Company Links */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-sm font-bold text-white">
              Company
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-gray-400">
              <li><Link href="#" className="hover:text-[#FFE600] transition-colors">About Us</Link></li>
              <li><Link href="#cta" className="hover:text-[#FFE600] transition-colors">Contact</Link></li>
              <li><Link href="#" className="hover:text-[#FFE600] transition-colors">Privacy Policy</Link></li>
              <li><Link href="#" className="hover:text-[#FFE600] transition-colors">Terms of Service</Link></li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-sm font-bold text-white">
              Contact
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm text-gray-400">
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#FFE600] shrink-0" />
                <span className="truncate">support@resumate.ai</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#FFE600] shrink-0" />
                <span>+1 (555) 019-2834</span>
              </li>
              <li className="flex items-center gap-2.5">
                <MapPin className="w-4 h-4 text-[#FFE600] shrink-0" />
                <span>San Francisco, CA</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-6 flex items-center justify-center text-xs text-gray-500">
          <p>© {new Date().getFullYear()} ResuMate AI. All Rights Reserved.</p>
        </div>

      </div>
    </footer>
  );
}