"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { AuroraBackground } from "@/components/ui/aurora-background"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation"
import { Eye, EyeOff } from "lucide-react"
import AnimatedTooltipPreview from "@/components/ui/animated-tooltip-demo"

export function LandingPage() {
  const [showSignup, setShowSignup] = useState(false)
  const [showLogin, setShowLogin] = useState(false)
  const [showForgotPassword, setShowForgotPassword] = useState(false)
  const router = useRouter()

  return (
    <AuroraBackground className="overflow-auto">
      <div className="relative mx-auto flex max-w-7xl flex-col items-center justify-center py-10">
        <Navbar onSignupClick={() => setShowSignup(true)} onLoginClick={() => setShowLogin(true)} />
        <div className="absolute inset-y-0 left-0 h-full w-px bg-neutral-200/80 dark:bg-neutral-800/80">
          <div className="absolute top-0 h-40 w-px bg-gradient-to-b from-transparent via-blue-500 to-transparent" />
        </div>
        <div className="absolute inset-y-0 right-0 h-full w-px bg-neutral-200/80 dark:bg-neutral-800/80">
          <div className="absolute h-40 w-px bg-gradient-to-b from-transparent via-blue-500 to-transparent" />
        </div>
        <div className="absolute inset-x-0 bottom-0 h-px w-full bg-neutral-200/80 dark:bg-neutral-800/80">
          <div className="absolute mx-auto h-px w-40 bg-gradient-to-r from-transparent via-blue-500 to-transparent" />
        </div>

        {showSignup ? (
          <SignupForm
            onClose={() => setShowSignup(false)}
            onSuccess={() => router.push("/dashboard")}
            onLoginClick={() => {
              setShowSignup(false)
              setShowLogin(true)
            }}
          />
        ) : showLogin ? (
          <LoginForm
            onClose={() => setShowLogin(false)}
            onSuccess={() => router.push("/dashboard")}
            onForgotPassword={() => {
              setShowLogin(false)
              setShowForgotPassword(true)
            }}
            onSignupClick={() => {
              setShowLogin(false)
              setShowSignup(true)
            }}
          />
        ) : showForgotPassword ? (
          <ForgotPasswordForm
            onClose={() => setShowForgotPassword(false)}
            onBackToLogin={() => {
              setShowForgotPassword(false)
              setShowLogin(true)
            }}
          />
        ) : (
          <HeroContent onSignupClick={() => setShowSignup(true)} />
        )}

        <Footer />
      </div>
    </AuroraBackground>
  )
}

function Navbar({ onSignupClick, onLoginClick }: { onSignupClick: () => void; onLoginClick: () => void }) {
  return (
    <nav className="flex w-full items-center justify-between border-t border-b border-neutral-200 px-4 py-4 dark:border-neutral-800">
      <div className="flex items-center gap-2">
        <div className="size-7 rounded-full bg-gradient-to-br from-blue-500 to-violet-500" />
        <h1 className="text-base font-bold md:text-2xl">Humane</h1>
      </div>
      <div className="flex items-center gap-2">
        <button
          className="px-4 py-2 text-sm font-medium text-black transition-colors hover:text-blue-600 dark:text-white dark:hover:text-blue-400"
          onClick={onLoginClick}
        >
          Sign in
        </button>
        <button
          className="px-8 py-2 rounded-full bg-gradient-to-b from-blue-500 to-blue-600 text-white focus:ring-2 focus:ring-blue-400 hover:shadow-xl transition duration-200"
          onClick={onSignupClick}
        >
          Create an account
        </button>
      </div>
    </nav>
  )
}

function HeroContent({ onSignupClick }: { onSignupClick: () => void }) {
  return (
    <div className="px-4 py-10 md:py-20">
      <h1 className="relative z-10 mx-auto max-w-4xl text-center text-2xl font-bold text-slate-700 md:text-4xl lg:text-7xl dark:text-slate-300">
        {"Make your posts sound more human, not corporate".split(" ").map((word, index) => (
          <motion.span
            key={index}
            initial={{ opacity: 0, filter: "blur(4px)", y: 10 }}
            animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
            transition={{
              duration: 0.3,
              delay: index * 0.1,
              ease: "easeInOut",
            }}
            className="mr-2 inline-block"
          >
            {word}
          </motion.span>
        ))}
      </h1>
      <motion.p
        initial={{
          opacity: 0,
        }}
        animate={{
          opacity: 1,
        }}
        transition={{
          duration: 0.3,
          delay: 0.8,
        }}
        className="relative z-10 mx-auto max-w-xl py-4 text-center text-lg font-normal text-neutral-600 dark:text-neutral-400"
      >
        With Humane, you can transform your corporate-sounding LinkedIn posts into authentic, relatable content that
        resonates with your audience. Say goodbye to cringe-worthy jargon.
      </motion.p>
      <motion.div
        initial={{
          opacity: 0,
        }}
        animate={{
          opacity: 1,
        }}
        transition={{
          duration: 0.3,
          delay: 1,
        }}
        className="relative z-10 mt-8 flex flex-wrap items-center justify-center"
      >
        <button
          className="px-8 py-4 rounded-full bg-gradient-to-b from-blue-500 to-blue-600 text-white focus:ring-2 focus:ring-blue-400 hover:shadow-xl transition duration-200"
          onClick={onSignupClick}
        >
          Get Started Free
        </button>
      </motion.div>
      <motion.div
        initial={{
          opacity: 0,
          y: 10,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.3,
          delay: 1.2,
        }}
        className="relative z-10 mt-20 rounded-3xl border border-neutral-200 bg-neutral-100 p-4 shadow-md dark:border-neutral-800 dark:bg-neutral-900"
      >
        <div className="w-full overflow-hidden rounded-xl border border-gray-300 dark:border-gray-700">
          <img
            src="/placeholder.svg?height=500&width=1000"
            alt="Humane app preview"
            className="aspect-[16/9] h-auto w-full object-cover"
            height={500}
            width={1000}
          />
        </div>
      </motion.div>
    </div>
  )
}

function SignupForm({
  onClose,
  onSuccess,
  onLoginClick,
}: { onClose: () => void; onSuccess: () => void; onLoginClick: () => void }) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      // Mock credentials for the user
      console.log("Account created with:")
      console.log("Email:", email)
      console.log("Password:", password)
      console.log("Name:", name)

      onSuccess()
    }, 1500)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="w-full max-w-md px-4 py-10"
    >
      <div className="shadow-input mx-auto w-full max-w-md rounded-none bg-white p-4 md:rounded-2xl md:p-8 dark:bg-black">
        <h2 className="text-xl font-bold text-neutral-800 dark:text-neutral-200">Create your account</h2>
        <p className="mt-2 max-w-sm text-sm text-neutral-600 dark:text-neutral-300">
          Get started with Humane for free. No credit card required.
        </p>

        <form className="my-8" onSubmit={handleSubmit}>
          <div className="flex w-full flex-col space-y-2 mb-4">
            <Label htmlFor="name">Full Name</Label>
            <Input id="name" placeholder="John Doe" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div className="flex w-full flex-col space-y-2 mb-4">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              placeholder="john@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="flex w-full flex-col space-y-2 mb-8">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
                placeholder="••••••••"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full px-8 py-4 rounded-full bg-gradient-to-b from-blue-500 to-blue-600 text-white focus:ring-2 focus:ring-blue-400 hover:shadow-xl transition duration-200"
            disabled={isLoading}
          >
            {isLoading ? "Creating account..." : "Create account"}
          </button>

          <div className="my-8 h-[1px] w-full bg-gradient-to-r from-transparent via-neutral-300 to-transparent dark:via-neutral-700" />

          <div className="text-center text-sm text-muted-foreground">
            By creating an account, you agree to our Terms of Service and Privacy Policy.
          </div>
          <button
            type="button"
            className="w-full mt-4 text-sm text-center text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
            onClick={onLoginClick}
          >
            Already have an account? Sign in
          </button>
        </form>
      </div>
    </motion.div>
  )
}

function LoginForm({
  onClose,
  onSuccess,
  onForgotPassword,
  onSignupClick,
}: {
  onClose: () => void
  onSuccess: () => void
  onForgotPassword: () => void
  onSignupClick: () => void
}) {
  const [email, setEmail] = useState("demo@humane.ai")
  const [password, setPassword] = useState("password123")
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      // Mock credentials for the user
      console.log("Logged in with:")
      console.log("Email:", email)
      console.log("Password:", password)

      onSuccess()
    }, 1500)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="w-full max-w-md px-4 py-10"
    >
      <div className="shadow-input mx-auto w-full max-w-md rounded-none bg-white p-4 md:rounded-2xl md:p-8 dark:bg-black">
        <h2 className="text-xl font-bold text-neutral-800 dark:text-neutral-200">Welcome back</h2>
        <p className="mt-2 max-w-sm text-sm text-neutral-600 dark:text-neutral-300">Sign in to your Humane account</p>

        <form className="my-8" onSubmit={handleSubmit}>
          <div className="flex w-full flex-col space-y-2 mb-4">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              placeholder="john@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="flex w-full flex-col space-y-2 mb-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
          <div className="mb-8 text-right">
            <button
              type="button"
              className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
              onClick={onForgotPassword}
            >
              Forgot password?
            </button>
          </div>

          <button
            type="submit"
            className="w-full px-8 py-4 rounded-full bg-gradient-to-b from-blue-500 to-blue-600 text-white focus:ring-2 focus:ring-blue-400 hover:shadow-xl transition duration-200"
            disabled={isLoading}
          >
            {isLoading ? "Signing in..." : "Sign in"}
          </button>

          <div className="my-8 h-[1px] w-full bg-gradient-to-r from-transparent via-neutral-300 to-transparent dark:via-neutral-700" />

          <button
            type="button"
            className="w-full text-sm text-center text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
            onClick={onSignupClick}
          >
            Don't have an account? Sign up
          </button>
        </form>
      </div>
    </motion.div>
  )
}

function ForgotPasswordForm({ onClose, onBackToLogin }: { onClose: () => void; onBackToLogin: () => void }) {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      setIsSubmitted(true)
      console.log("Password reset requested for:", email)
    }, 1500)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="w-full max-w-md px-4 py-10"
    >
      <div className="shadow-input mx-auto w-full max-w-md rounded-none bg-white p-4 md:rounded-2xl md:p-8 dark:bg-black">
        <h2 className="text-xl font-bold text-neutral-800 dark:text-neutral-200">Reset your password</h2>
        <p className="mt-2 max-w-sm text-sm text-neutral-600 dark:text-neutral-300">
          {isSubmitted
            ? "Check your email for a link to reset your password."
            : "Enter your email address and we'll send you a link to reset your password."}
        </p>

        {!isSubmitted ? (
          <form className="my-8" onSubmit={handleSubmit}>
            <div className="flex w-full flex-col space-y-2 mb-8">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="john@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="w-full px-8 py-4 rounded-full bg-gradient-to-b from-blue-500 to-blue-600 text-white focus:ring-2 focus:ring-blue-400 hover:shadow-xl transition duration-200"
              disabled={isLoading}
            >
              {isLoading ? "Sending..." : "Send reset link"}
            </button>

            <div className="mt-4 text-center">
              <button
                type="button"
                className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                onClick={onBackToLogin}
              >
                Back to sign in
              </button>
            </div>
          </form>
        ) : (
          <div className="my-8">
            <div className="mb-8 text-center text-sm text-neutral-600 dark:text-neutral-300">
              We've sent a password reset link to <span className="font-medium">{email}</span>. Please check your email.
            </div>
            <button
              className="w-full px-8 py-4 rounded-full bg-gradient-to-b from-blue-500 to-blue-600 text-white focus:ring-2 focus:ring-blue-400 hover:shadow-xl transition duration-200"
              onClick={onBackToLogin}
            >
              Back to sign in
            </button>
          </div>
        )}
      </div>
    </motion.div>
  )
}

function Footer() {
  return (
    <footer className="w-full mt-20 border-t border-neutral-200 py-8 dark:border-neutral-800">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center justify-center space-y-6">
          <AnimatedTooltipPreview />
          <div className="text-center text-sm text-neutral-500 dark:text-neutral-400">
            <p>© {new Date().getFullYear()} Humane. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  )
}
