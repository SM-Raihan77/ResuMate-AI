"use client"

import * as React from "react"
import Link from "next/link"
import { 
  Menu, 
  X, 
  Sparkles, 
  FileText, 
  CheckCircle, 
  Wand2 
} from "lucide-react"

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { Button } from "@/components/ui/button" // Imported Shadcn Button

const resumeFeatures: { title: string; href: string; description: string; icon: React.ReactNode }[] = [
  {
    title: "AI Resume Builder",
    href: "/resume/builder",
    description: "Build a professional, tailored resume in minutes with our AI engine.",
    icon: <Sparkles className="h-5 w-5 text-primary" />,
  },
  {
    title: "ATS Score Checker",
    href: "/resume/ats-check",
    description: "Scan your resume against job descriptions to optimize your ATS match rate.",
    icon: <CheckCircle className="h-5 w-5 text-ai-emerald" />, 
  },
  {
    title: "Resume Templates",
    href: "/resume/templates",
    description: "Browse our collection of recruiter-approved, ATS-friendly templates.",
    icon: <FileText className="h-5 w-5 text-ai-cyan" />, 
  },
]

const toolsFeatures: { title: string; href: string; description: string }[] = [
  {
    title: "Cover Letter Generator",
    href: "/tools/cover-letter",
    description: "Generate highly personalized cover letters instantly.",
  },
  {
    title: "LinkedIn Optimizer",
    href: "/tools/linkedin",
    description: "Get AI-driven suggestions to improve your LinkedIn profile visibility.",
  },
  {
    title: "Interview Prep AI",
    href: "/tools/interview",
    description: "Practice with our AI mock interviewer and get real-time feedback.",
  },
]

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b border-bg-coolgray bg-bg-offwhite">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        
        <div className="flex items-center gap-14">
          {/* Logo Section */}
          <Link href="/" className="flex items-center gap-2">
            <Wand2 className="h-6 w-6 text-primary" />
            <span className="text-xl font-medium text-slate-dark">
              Resumate<span className="text-primary">-AI</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex flex-1 items-center justify-center">
            <NavigationMenu>
              <NavigationMenuList>
                
                {/* Resume Dropdown */}
                <NavigationMenuItem>
                  {/* Added font-normal to make text thinner */}
                  <NavigationMenuTrigger className="font-normal text-slate-dark hover:text-primary bg-transparent">
                    Resume
                  </NavigationMenuTrigger>
                  {/* Moved border color here to override Shadcn's default black border */}
                  <NavigationMenuContent className="border-bg-coolgray">
                    <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-1 lg:w-[600px] bg-white">
                      {resumeFeatures.map((feature) => (
                        <ListItem
                          key={feature.title}
                          title={feature.title}
                          href={feature.href}
                          icon={feature.icon}
                        >
                          {feature.description}
                        </ListItem>
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                {/* Tools Dropdown */}
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="font-normal text-slate-dark hover:text-primary bg-transparent">
                    Tools
                  </NavigationMenuTrigger>
                  <NavigationMenuContent className="border-bg-coolgray">
                    <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[500px] bg-white">
                      {toolsFeatures.map((feature) => (
                        <ListItem
                          key={feature.title}
                          title={feature.title}
                          href={feature.href}
                        >
                          {feature.description}
                        </ListItem>
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                {/* Direct Links */}
                <NavigationMenuItem>
                  <NavigationMenuLink 
                    className={`${navigationMenuTriggerStyle()} font-normal text-slate-dark hover:text-primary bg-transparent cursor-pointer`} 
                    render={<Link href="/enterprise">Enterprise</Link>} 
                  />
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuLink 
                    className={`${navigationMenuTriggerStyle()} font-normal text-slate-dark hover:text-primary bg-transparent cursor-pointer`} 
                    render={<Link href="/pricing">Pricing</Link>} 
                  />
                </NavigationMenuItem>

              </NavigationMenuList>
            </NavigationMenu>
          </div>
        </div>

        {/* Desktop Call to Actions (Using Shadcn Button) */}
        <div className="hidden md:flex items-center gap-4">
          <Button variant="ghost" className="font-normal text-slate-dark hover:text-primary">
            <Link href="/auth/login">Log in</Link>
          </Button>
          <Button className="font-normal bg-primary text-white hover:bg-primary-accent">
            <Link href="/auth/register">Get Started</Link>
          </Button>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden p-2 text-slate-dark hover:text-primary transition-colors"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Navigation Menu (Animated & Thinner text) */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-bg-coolgray bg-bg-offwhite px-4 py-6 shadow-lg animate-in slide-in-from-top-4 fade-in-0 duration-300">
          <nav className="flex flex-col gap-4">
            {/* Added text-sm and font-normal for thinner/smaller text */}
            <Link href="/resume/builder" className="text-sm font-normal text-slate-dark hover:text-primary transition-colors">
              AI Resume Builder
            </Link>
            <Link href="/resume/ats-check" className="text-sm font-normal text-slate-dark hover:text-ai-cyan transition-colors">
              ATS Score Checker
            </Link>
            <Link href="/tools" className="text-sm font-normal text-slate-dark hover:text-primary transition-colors">
              All AI Tools
            </Link>
            <Link href="/enterprise" className="text-sm font-normal text-slate-dark hover:text-primary transition-colors">
              Enterprise
            </Link>
            <Link href="/pricing" className="text-sm font-normal text-slate-dark hover:text-primary transition-colors">
              Pricing
            </Link>
            
            <div className="mt-4 flex flex-col gap-3 pt-4 border-t border-bg-coolgray">
              <Button variant="outline" className="w-full font-normal border-slate-dark text-slate-dark">
                <Link href="/auth/login">Log in</Link>
              </Button>
              <Button className="w-full font-normal bg-primary text-white hover:bg-primary-accent">
                <Link href="/auth/register">Get Started</Link>
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}

function ListItem({
  title,
  children,
  href,
  icon,
  ...props
}: React.ComponentPropsWithoutRef<"li"> & { href: string; icon?: React.ReactNode }) {
  return (
    <li {...props}>
      <NavigationMenuLink 
        render={
          <Link 
            href={href} 
            className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-bg-coolgray focus:bg-bg-coolgray"
          >
            <div className="flex items-center gap-3">
              {icon && <div className="flex-shrink-0">{icon}</div>}
              <div className="flex flex-col gap-1">
                {/* Changed font-medium to font-normal */}
                <div className="text-sm font-normal text-slate-dark">{title}</div>
                <div className="line-clamp-2 text-xs font-normal text-[#475569]">{children}</div>
              </div>
            </div>
          </Link>
        } 
      />
    </li>
  )
}