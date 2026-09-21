'use client';

import React from 'react';
import { 
  Star, 
  Sparkles, 
  Briefcase, 
  FileText, 
  GitBranch, 
  DollarSign, 
  Award,
  ShieldCheck
} from 'lucide-react';

interface TestimonialItem {
  name: string;
  role: string;
  company: string;
  avatarText: string;
  quote: string;
  category: 'Resume Builder' | 'AI Analysis' | 'Mock Interview' | 'Learning Roadmap' | 'Compensation';
  rating: number;
  highlightTag: string;
  accent: 'amber' | 'emerald' | 'cyan' | 'purple' | 'rose' | 'blue';
}

const testimonials: TestimonialItem[] = [
  {
    name: 'Priya Sharma',
    role: 'Frontend Engineer',
    company: 'TechCorp',
    avatarText: 'PS',
    quote: 'The resume AI analysis was spot on! It identified phrasing gaps and missing ATS keywords that got me 4 callbacks in two weeks after months of silence.',
    category: 'AI Analysis',
    rating: 5,
    highlightTag: 'ATS Score: 98/100',
    accent: 'amber'
  },
  {
    name: 'Marcus Vance',
    role: 'DevOps Lead',
    company: 'CloudScale',
    avatarText: 'MV',
    quote: 'The learning roadmaps and interview simulations are game changers. The system design audio feedback helped me ace my staff-level loop with flying colors.',
    category: 'Learning Roadmap',
    rating: 5,
    highlightTag: 'Staff Promo',
    accent: 'cyan'
  },
  {
    name: 'Sarah Chen',
    role: 'Senior ML Engineer',
    company: 'DataLabs',
    avatarText: 'SC',
    quote: 'Interview practice with instant STAR feedback made me feel completely prepared. I went into the offer negotiation stage with absolute confidence.',
    category: 'Mock Interview',
    rating: 5,
    highlightTag: 'Hired @ DataLabs',
    accent: 'emerald'
  },
  {
    name: 'David Okafor',
    role: 'Full Stack Architect',
    company: 'GlobalInc',
    avatarText: 'DO',
    quote: 'ResuMate completely rebuilt my bullet points with quantified business metrics. Recruiters actually quoted my resume lines back to me in screenings.',
    category: 'Resume Builder',
    rating: 5,
    highlightTag: '4x Interview Rate',
    accent: 'purple'
  },
  {
    name: 'Amina Al-Mansoor',
    role: 'Engineering Director',
    company: 'FinTech Nova',
    avatarText: 'AA',
    quote: 'I used the compensation module before my executive negotiation. The AI script provided accurate counter-arguments that secured an additional $45k in equity.',
    category: 'Compensation',
    rating: 5,
    highlightTag: '+$45,000 Equity',
    accent: 'emerald'
  },
  {
    name: 'Elena Rostova',
    role: 'Product Designer',
    company: 'AI Solutions',
    avatarText: 'ER',
    quote: 'The live keyword matcher against real Job Descriptions gave me an unfair advantage. It highlighted design system terminology I had omitted.',
    category: 'AI Analysis',
    rating: 5,
    highlightTag: 'Top 1% Resume',
    accent: 'rose'
  },
  {
    name: 'Liam Gallagher',
    role: 'Backend Systems Dev',
    company: 'ScaleByte',
    avatarText: 'LG',
    quote: 'The voice mock interview pushed me on edge cases like distributed cache invalidation. When the actual interviewer asked the exact question, I nailed it.',
    category: 'Mock Interview',
    rating: 5,
    highlightTag: 'Offer Accepted',
    accent: 'blue'
  },
  {
    name: 'Kenji Takahashi',
    role: 'Cloud Solutions Architect',
    company: 'ApexCloud',
    avatarText: 'KT',
    quote: 'The automated skill gap blueprint saved me six months of random studying. Every milestone was directly mapped to Tier-1 hiring expectations.',
    category: 'Learning Roadmap',
    rating: 5,
    highlightTag: 'Roadmap Cleared',
    accent: 'amber'
  },
  {
    name: 'Sophie Dubois',
    role: 'Technical Product Manager',
    company: 'StripeFlow',
    avatarText: 'SD',
    quote: 'The AI resume optimizer transformed my wordy responsibilities into crisp, high-impact ROI statements that hiring leaders loved.',
    category: 'Resume Builder',
    rating: 5,
    highlightTag: 'Executive Fast-Track',
    accent: 'amber'
  },
  {
    name: 'Arjun Patel',
    role: 'Data Scientist',
    company: 'MetaByte',
    avatarText: 'AP',
    quote: 'The STAR framework scoring pinpointed where my behavioral answers dragged. The instant speech pacing tips made me sound 10x more authoritative.',
    category: 'Mock Interview',
    rating: 5,
    highlightTag: '96% STAR Score',
    accent: 'purple'
  },
  {
    name: 'Jessica Miller',
    role: 'Security Engineer',
    company: 'CyberShield',
    avatarText: 'JM',
    quote: 'No more generic resume templates. ResuMate exports cleanly structured LaTeX and PDF versions that sailed right through Greenhouse ATS filters.',
    category: 'Resume Builder',
    rating: 5,
    highlightTag: 'Zero ATS Errors',
    accent: 'blue'
  },
  {
    name: 'Tariq Hassan',
    role: 'Lead Infrastructure Engineer',
    company: 'GlobalInc',
    avatarText: 'TH',
    quote: 'The compensation calibrate tool gave me granular data down to city and tier. Negotiated my signing bonus from $15k up to $35k.',
    category: 'Compensation',
    rating: 5,
    highlightTag: '+$20k Signing Bonus',
    accent: 'purple'
  },
  {
    name: 'Lucas Ferreira',
    role: 'Distributed Systems Dev',
    company: 'AI Solutions',
    avatarText: 'LF',
    quote: 'The mock interview mode grilled me on Raft consensus, split-brain recovery, and Kafka partitions. Passed the Meta and Uber loops.',
    category: 'Mock Interview',
    rating: 5,
    highlightTag: 'Double FAANG Offer',
    accent: 'rose'
  },
  {
    name: 'Mateo Rossi',
    role: 'Mobile Lead (iOS/Swift)',
    company: 'AppVenture',
    avatarText: 'MR',
    quote: 'The skill tree guided me through Swift Concurrency and Clean Architecture milestones right in time for my senior promotion interview.',
    category: 'Learning Roadmap',
    rating: 5,
    highlightTag: 'Promotion Secured',
    accent: 'emerald'
  }
];

const accentStyles = {
  amber: {
    badge: 'bg-yellow-500/10 border-yellow-500/25 text-yellow-400',
    glow: 'bg-yellow-500/5',
    tag: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20',
    avatarRing: 'border-yellow-500/30 text-yellow-300'
  },
  emerald: {
    badge: 'bg-emerald-500/10 border-emerald-500/25 text-emerald-400',
    glow: 'bg-emerald-500/5',
    tag: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
    avatarRing: 'border-emerald-500/30 text-emerald-300'
  },
  cyan: {
    badge: 'bg-cyan-500/10 border-cyan-500/25 text-cyan-400',
    glow: 'bg-cyan-500/5',
    tag: 'text-cyan-400 bg-cyan-400/10 border-cyan-400/20',
    avatarRing: 'border-cyan-500/30 text-cyan-300'
  },
  purple: {
    badge: 'bg-purple-500/10 border-purple-500/25 text-purple-400',
    glow: 'bg-purple-500/5',
    tag: 'text-purple-400 bg-purple-400/10 border-purple-400/20',
    avatarRing: 'border-purple-500/30 text-purple-300'
  },
  rose: {
    badge: 'bg-rose-500/10 border-rose-500/25 text-rose-400',
    glow: 'bg-rose-500/5',
    tag: 'text-rose-400 bg-rose-400/10 border-rose-400/20',
    avatarRing: 'border-rose-500/30 text-rose-300'
  },
  blue: {
    badge: 'bg-blue-500/10 border-blue-500/25 text-blue-400',
    glow: 'bg-blue-500/5',
    tag: 'text-blue-400 bg-blue-400/10 border-blue-400/20',
    avatarRing: 'border-blue-500/30 text-blue-300'
  }
};

const categoryIcons = {
  'Resume Builder': FileText,
  'AI Analysis': Sparkles,
  'Mock Interview': Briefcase,
  'Learning Roadmap': GitBranch,
  'Compensation': DollarSign
};

function TestimonialCard({ item }: { item: TestimonialItem }): React.JSX.Element {
  const styles = accentStyles[item.accent];
  const IconComp = categoryIcons[item.category];

  return (
    <div className="w-[380px] flex-shrink-0 bg-[#0b0f19]/60 backdrop-blur-md border border-white/10 rounded-2xl p-6 transition-all duration-300 hover:-translate-y-2 hover:border-yellow-500/40 hover:shadow-[0_12px_40px_rgba(234,179,8,0.12)] relative overflow-hidden group flex flex-col justify-between cursor-default">
      {/* Accent ambient glow visible through glass */}
      <div 
        className={`absolute -top-16 -right-16 w-36 h-36 rounded-full blur-3xl pointer-events-none transition-opacity duration-300 group-hover:opacity-100 opacity-60 ${styles.glow}`} 
      />
      <div 
        className="absolute -bottom-16 -left-16 w-32 h-32 rounded-full bg-yellow-500/5 blur-2xl pointer-events-none opacity-40 group-hover:opacity-70 transition-opacity" 
      />

      <div className="relative z-10 space-y-3.5">
        {/* Top Header: Author + Highlight Tag */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            {/* Avatar Pill */}
            <div className={`w-10 h-10 rounded-xl bg-white/5 border ${styles.avatarRing} flex items-center justify-center font-bold text-xs flex-shrink-0 group-hover:scale-105 transition-transform shadow-inner`}>
              {item.avatarText}
            </div>
            <div className="min-w-0">
              <h4 className="text-sm font-bold text-white truncate group-hover:text-yellow-400 transition-colors">
                {item.name}
              </h4>
              <p className="text-xs text-slate-400 truncate">
                {item.role} <span className="text-slate-500">•</span> <span className="text-slate-300 font-medium">{item.company}</span>
              </p>
            </div>
          </div>

          {/* Highlight Badge */}
          <span className={`px-2.5 py-1 rounded-full text-[11px] font-semibold border flex-shrink-0 ${styles.tag}`}>
            {item.highlightTag}
          </span>
        </div>

        {/* Rating Stars & Feature Pill */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-1">
            {[...Array(item.rating)].map((_, i) => (
              <Star key={i} className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400 drop-shadow-[0_0_6px_rgba(250,204,21,0.4)]" />
            ))}
          </div>
          <div className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[11px] font-medium border ${styles.badge}`}>
            <IconComp className="w-3 h-3" />
            <span>{item.category}</span>
          </div>
        </div>

        {/* Quote Content */}
        <p className="text-slate-300 text-xs sm:text-sm leading-relaxed italic line-clamp-3 pt-1">
          &quot;{item.quote}&quot;
        </p>
      </div>

      {/* Bottom Verified Footer */}
      <div className="relative z-10 pt-3.5 mt-3.5 border-t border-white/[0.07] flex items-center justify-between text-[11px] text-slate-500">
        <span className="flex items-center gap-1.5 text-emerald-400/90 font-medium">
          <ShieldCheck className="w-3.5 h-3.5" />
          Verified Career Review
        </span>
        <span className="text-slate-500">
          Career Acceleration
        </span>
      </div>
    </div>
  );
}

export default function Testimonials(): React.JSX.Element {
  return (
    <section id="testimonials" className="py-20 lg:py-28 bg-transparent text-white relative overflow-hidden border-t border-white/[0.06]">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[550px] h-[550px] bg-yellow-500/3 rounded-full blur-[180px] pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 -translate-y-1/2 w-[500px] h-[500px] bg-amber-500/2 rounded-full blur-[180px] pointer-events-none" />

      {/* Section Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 mb-12 sm:mb-16">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-yellow-500/10 border border-yellow-500/25 text-yellow-400 text-xs font-semibold shadow-[0_0_20px_rgba(234,179,8,0.15)]">
            <Award className="w-3.5 h-3.5" />
            <span>Wall of Love & Verified Career Success</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white">
            Loved by <span className="text-yellow-400">Job Seekers & Engineers</span>
          </h2>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
            Explore real reviews from engineers, tech leads, and career changers who accelerated their hiring loops with ResuMate AI.
          </p>
        </div>
      </div>

      {/* Single Horizontal Row Infinite Scrolling Wall with Fade Edges */}
      <div className="relative w-full overflow-hidden group-pause py-4">
        {/* Left and Right Edge Gradient Masks */}
        <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-44 bg-gradient-to-r from-[#070913] via-[#070913]/90 to-transparent z-20 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-44 bg-gradient-to-l from-[#070913] via-[#070913]/90 to-transparent z-20 pointer-events-none" />

        {/* Single Infinite Marquee Track */}
        <div className="flex overflow-hidden">
          <div className="animate-marquee-track flex gap-6 pause-hover">
            {testimonials.map((item, idx) => (
              <TestimonialCard key={`review-a-${idx}`} item={item} />
            ))}
            {testimonials.map((item, idx) => (
              <TestimonialCard key={`review-b-${idx}`} item={item} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
