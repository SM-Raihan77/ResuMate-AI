
import Link from "next/link";
import { Sparkles, Mail } from "lucide-react";

import { Button } from "@/components/ui/button";

import { BsGithub } from "react-icons/bs";
import RegisterForm from "./RegisterForm";

export default function RegisterPage() {


  return (
    <div className="min-h-screen w-full grid lg:grid-cols-2 bg-background text-foreground">
      {/* LEFT COLUMN: Branding & Value Proposition */}
      <div className="relative hidden lg:flex flex-col justify-between p-12 overflow-hidden border-r border-white/5 bg-card-dark/50">
        {/* Subtle Cyber Yellow Glow Effect */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
          <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] rounded-full bg-[var(--yellow-glow)] blur-[120px]" />
        </div>

        {/* Logo */}
        <div className="flex items-center gap-2 font-bold text-2xl tracking-tight z-10">
          <Sparkles className="w-6 h-6 text-cyber-yellow" />
          <span>
            Resumate<span className="text-cyber-yellow">.ai</span>
          </span>
        </div>

        {/* Hero Copy */}
        <div className="z-10 max-w-lg">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6 leading-tight">
            Build your future, <br />
            <span className="text-cyber-yellow">one line at a time.</span>
          </h1>
          <p className="text-lg text-gray-400 mb-8">
            Join thousands of professionals using AI-driven insights to craft
            the perfect resume and land their dream roles.
          </p>

          <div className="flex items-center gap-4 text-sm font-medium text-gray-300">
            <div className="flex -space-x-3">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="w-10 h-10 rounded-full border-2 border-card-dark bg-gray-800"
                />
              ))}
            </div>
            <p>Trusted by 10,000+ job seekers</p>
          </div>
        </div>

        {/* Footer/Legal */}
        <div className="text-sm text-gray-500 z-10">
          © {new Date().getFullYear()} Resumate AI. All rights reserved.
        </div>
      </div>

      {/* RIGHT COLUMN: Registration Form */}
      <div className="flex flex-col justify-center items-center p-6 md:p-12 relative z-10">
        {/* Mobile Logo */}
        <div className="flex lg:hidden items-center gap-2 font-bold text-2xl tracking-tight mb-12">
          <Sparkles className="w-6 h-6 text-cyber-yellow" />
          <span>
            Resumate<span className="text-cyber-yellow">.ai</span>
          </span>
        </div>

        <div className="w-full max-w-md space-y-8 bg-card-dark p-8 rounded-2xl border border-[var(--card-border)] shadow-2xl">
          <div className="space-y-2 text-center">
            <h2 className="text-3xl font-bold tracking-tight">
              Create an account
            </h2>
            <p className="text-gray-400 text-sm">
              Enter your details below to get started
            </p>
          </div>

          <RegisterForm />

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-white/10" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card-dark px-2 text-gray-400">
                Or continue with
              </span>
            </div>
          </div>

          {/* Social Auth */}
          <div className="grid grid-cols-2 gap-4">
            <Button
              variant="outline"
              className="h-11 bg-background border-white/10 hover:bg-white/5 hover:text-white"
            >
              <BsGithub className="w-4 h-4 mr-2" />
              GitHub
            </Button>
            <Button
              variant="outline"
              className="h-11 bg-background border-white/10 hover:bg-white/5 hover:text-white"
            >
              <Mail className="w-4 h-4 mr-2" />
              Google
            </Button>
          </div>
        </div>

        <p className="mt-8 text-center text-sm text-gray-400">
          Already have an account?{" "}
          <Link
            href="/auth/login"
            className="font-semibold text-cyber-yellow hover:underline underline-offset-4"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
