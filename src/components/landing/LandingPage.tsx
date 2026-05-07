'use client';

import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';
import {
  FileText,
  Sparkles,
  Download,
  Globe,
  Wand2,
  Smartphone,
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  Rocket,
  Star,
  Users,
  LayoutTemplate,
  Zap,
  GraduationCap,
  Award,
  BarChart3,
  Shield,
  Palette,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useAppStore } from '@/lib/store';

/* ------------------------------------------------------------------ */
/*  Animation variants                                                 */
/* ------------------------------------------------------------------ */

const fadeIn = {
  hidden: { opacity: 0 },
  visible: (d: number = 0) => ({
    opacity: 1,
    transition: { duration: 0.6, delay: d, ease: 'easeOut' as const },
  }),
};

const slideUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (d: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.65,
      delay: d,
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
    },
  }),
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: (d: number = 0) => ({
    opacity: 1,
    scale: 1,
    transition: { duration: 0.55, delay: d, ease: 'easeOut' as const },
  }),
};

const staggerContainer = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
  },
};

/* ------------------------------------------------------------------ */
/*  Animated Counter Hook                                              */
/* ------------------------------------------------------------------ */

function StatCounter({ icon: Icon, value, suffix, label, isDecimal }: {
  icon: React.ComponentType<{ className?: string }>;
  value: number;
  suffix: string;
  label: string;
  isDecimal?: boolean;
}) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });

  useEffect(() => {
    if (!isInView) return;
    const end = isDecimal ? Math.round(value * 10) : value;
    let startTime: number | null = null;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / 2000, 1);
      setCount(Math.floor(progress * end));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [isInView, value, isDecimal]);

  const displayValue = isDecimal ? (count / 10).toFixed(1) : count.toLocaleString();

  return (
    <div ref={ref} className="flex flex-col items-center text-center">
      <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 dark:bg-emerald-900/30">
        <Icon className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
      </div>
      <div className="text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl dark:text-white">
        {displayValue}
        <span className="text-emerald-600 dark:text-emerald-400">{suffix}</span>
      </div>
      <div className="mt-1 text-xs font-medium text-gray-500 dark:text-gray-400">{label}</div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

const stats = [
  { icon: FileText, value: 10000, suffix: '+', label: 'Resumes Created' },
  { icon: LayoutTemplate, value: 50, suffix: '+', label: 'Templates' },
  { icon: Star, value: 4.9, suffix: '★', label: 'User Rating', isDecimal: true },
  { icon: Zap, value: 30, suffix: 's', label: 'Avg Build Time' },
];

const features = [
  {
    icon: Sparkles,
    title: 'AI-Powered Editing',
    description: 'Let AI refine bullet points, optimize keywords, and tailor content for each role you apply to.',
    gradient: 'from-emerald-500 to-teal-500',
    span: 'md:col-span-2',
  },
  {
    icon: LayoutTemplate,
    title: '7 Beautiful Templates',
    description: 'From Classic to Infographic — pick the style that matches your industry.',
    gradient: 'from-amber-500 to-orange-500',
    span: 'md:col-span-1',
  },
  {
    icon: Download,
    title: 'PDF Export',
    description: 'Export a pixel-perfect PDF ready for emails, applications, and printing.',
    gradient: 'from-violet-500 to-purple-500',
    span: 'md:col-span-1',
  },
  {
    icon: Globe,
    title: 'Portfolio Page',
    description: 'Auto-generate a stunning portfolio page you can share with a single link.',
    gradient: 'from-sky-500 to-cyan-500',
    span: 'md:col-span-1',
  },
  {
    icon: Shield,
    title: 'ATS-Friendly',
    description: 'All templates are tested to pass Applicant Tracking Systems with flying colors.',
    gradient: 'from-rose-500 to-pink-500',
    span: 'md:col-span-1',
  },
  {
    icon: Wand2,
    title: 'Step-by-Step Wizard',
    description: 'An intuitive guided flow walks you through every section — no guesswork.',
    gradient: 'from-emerald-500 to-cyan-500',
    span: 'md:col-span-1',
  },
  {
    icon: Smartphone,
    title: 'Mobile Friendly',
    description: 'Build and preview your resume on any device, anytime, anywhere.',
    gradient: 'from-indigo-500 to-violet-500',
    span: 'md:col-span-1',
  },
  {
    icon: Palette,
    title: 'Dark Mode',
    description: 'Full dark mode support for comfortable editing day and night.',
    gradient: 'from-slate-500 to-gray-600',
    span: 'md:col-span-1',
  },
];

const steps = [
  {
    step: 1,
    title: 'Fill Your Details',
    description: 'Enter your experience, education, skills, and projects. Our AI helps you write compelling copy.',
  },
  {
    step: 2,
    title: 'Choose a Template',
    description: 'Browse 7 professional templates, customize colors and layout with live preview.',
  },
  {
    step: 3,
    title: 'Download & Share',
    description: 'Export as PDF or publish your portfolio online with one click.',
  },
];

const templateShowcase = [
  {
    key: 'classic',
    name: 'Classic',
    description: 'Traditional, timeless design perfect for corporate roles.',
    color: 'from-slate-600 to-slate-800',
    accent: '#475569',
  },
  {
    key: 'modern',
    name: 'Modern',
    description: 'Clean lines with bold accent colors for tech roles.',
    color: 'from-emerald-600 to-teal-700',
    accent: '#059669',
  },
  {
    key: 'creative',
    name: 'Creative',
    description: 'Eye-catching design for designers and creatives.',
    color: 'from-violet-600 to-purple-700',
    accent: '#7c3aed',
  },
  {
    key: 'executive',
    name: 'Executive',
    description: 'Premium navy & gold for senior leadership.',
    color: 'from-blue-900 to-slate-900',
    accent: '#1e3a5f',
  },
  {
    key: 'minimalist',
    name: 'Minimalist',
    description: 'Stripped-back elegance that lets content shine.',
    color: 'from-gray-700 to-gray-900',
    accent: '#374151',
  },
  {
    key: 'tech',
    name: 'Tech',
    description: 'GitHub-inspired dark theme for developers.',
    color: 'from-zinc-800 to-zinc-950',
    accent: '#18181b',
  },
  {
    key: 'infographic',
    name: 'Infographic',
    description: 'Visual timeline with progress bars and icons.',
    color: 'from-teal-500 to-emerald-600',
    accent: '#14b8a6',
  },
];

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function LandingPage() {
  const { setCurrentView, setSelectedTemplate } = useAppStore();
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });
  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <div className="relative min-h-screen overflow-hidden bg-white dark:bg-slate-950 text-gray-900 dark:text-gray-100">
      {/* ================================================================ */}
      {/*  GLASSMORPHISM STICKY NAVIGATION                                 */}
      {/* ================================================================ */}
      <nav className="sticky top-0 z-50 w-full border-b border-gray-200/80 bg-white/80 backdrop-blur-xl pt-[env(safe-area-inset-top)] dark:border-gray-800/80 dark:bg-slate-950/80">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-center gap-2"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 shadow-sm">
              <FileText className="h-4 w-4 text-white" />
            </div>
            <span className="text-lg font-bold tracking-tight">
              <span className="bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent dark:from-emerald-400 dark:to-teal-400">
                Resume
              </span>
              <span className="text-gray-900 dark:text-white">AI</span>
            </span>
          </button>

          {/* Center links (hidden on mobile) */}
          <div className="hidden items-center gap-1 md:flex">
            {['Features', 'Templates', 'How It Works'].map((label) => (
              <a
                key={label}
                href={`#${label.toLowerCase().replace(/\s+/g, '-')}`}
                className="rounded-lg px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-white"
              >
                {label}
              </a>
            ))}
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button
              size="sm"
              className="hidden rounded-full bg-gradient-to-r from-emerald-600 to-teal-500 px-4 text-sm font-semibold shadow-sm sm:inline-flex hover:shadow-md"
              onClick={() => setCurrentView('builder')}
            >
              Get Started
            </Button>
            <Button
              size="sm"
              className="rounded-full bg-gradient-to-r from-emerald-600 to-teal-500 px-4 text-sm font-semibold shadow-sm sm:hidden"
              onClick={() => setCurrentView('builder')}
            >
              Start
            </Button>
          </div>
        </div>
      </nav>

      {/* ================================================================ */}
      {/*  HERO SECTION                                                    */}
      {/* ================================================================ */}
      <section ref={heroRef} className="relative flex min-h-screen items-center overflow-hidden">
        {/* Ambient background blobs */}
        <div className="pointer-events-none absolute inset-0 -z-10">
          <motion.div
            className="absolute -top-40 left-1/2 h-[700px] w-[1000px] -translate-x-1/2 rounded-full bg-gradient-to-br from-emerald-200/50 via-teal-200/30 to-transparent blur-3xl dark:from-emerald-900/30 dark:via-teal-900/20"
            style={{ y: heroY }}
          />
          <motion.div
            className="absolute top-[60%] -right-40 h-[500px] w-[500px] rounded-full bg-gradient-to-br from-teal-200/40 to-emerald-100/20 blur-3xl dark:from-teal-900/20 dark:to-emerald-900/10"
            style={{ y: heroY }}
          />
          <motion.div
            className="absolute bottom-0 left-0 h-[400px] w-[600px] rounded-full bg-gradient-to-tr from-emerald-100/50 to-transparent blur-3xl dark:from-emerald-900/20"
            style={{ y: heroY }}
          />
          {/* Dot pattern */}
          <div
            className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]"
            style={{
              backgroundImage: 'radial-gradient(circle, #059669 1px, transparent 1px)',
              backgroundSize: '24px 24px',
            }}
          />
        </div>

        <motion.div
          className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
          style={{ opacity: heroOpacity }}
        >
          <div className="grid w-full grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
            {/* Left — copy */}
            <div className="flex flex-col gap-6 text-center lg:text-left sm:gap-8">
              <motion.div variants={fadeIn} initial="hidden" animate="visible" custom={0}>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-emerald-700 dark:border-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400">
                  <Sparkles className="h-3.5 w-3.5" />
                  Powered by AI
                </span>
              </motion.div>

              <motion.h1
                className="text-4xl leading-tight font-extrabold tracking-tight sm:text-5xl lg:text-6xl"
                variants={slideUp}
                initial="hidden"
                animate="visible"
                custom={0.1}
              >
                Build Your Dream{' '}
                <span className="bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-400 bg-clip-text text-transparent dark:from-emerald-400 dark:via-teal-300 dark:to-emerald-500">
                  Resume
                </span>{' '}
                in Minutes
              </motion.h1>

              <motion.p
                className="mx-auto max-w-xl text-lg leading-relaxed text-gray-600 lg:mx-0 dark:text-gray-400"
                variants={fadeIn}
                initial="hidden"
                animate="visible"
                custom={0.25}
              >
                Create professional, ATS-optimized resumes and stunning portfolios — no design skills needed. Let AI do the heavy lifting while you focus on landing your dream job.
              </motion.p>

              <motion.div
                className="flex flex-col items-center gap-4 sm:flex-row lg:justify-start"
                variants={slideUp}
                initial="hidden"
                animate="visible"
                custom={0.35}
              >
                <Button
                  size="lg"
                  className="group gap-2 rounded-full bg-gradient-to-r from-emerald-600 to-teal-500 px-8 text-base font-semibold shadow-lg shadow-emerald-500/25 transition-all hover:shadow-xl hover:shadow-emerald-500/30 hover:brightness-110"
                  onClick={() => setCurrentView('builder')}
                >
                  Get Started Free
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </Button>
                <Button
                  variant="ghost"
                  className="gap-2 rounded-full text-gray-600 hover:text-emerald-700 dark:text-gray-400 dark:hover:text-emerald-400"
                  onClick={() =>
                    document.getElementById('templates')?.scrollIntoView({ behavior: 'smooth' })
                  }
                >
                  <LayoutTemplate className="h-4 w-4" />
                  View Templates
                </Button>
              </motion.div>

              {/* Trust line */}
              <motion.div
                className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 pt-2 text-sm text-gray-500 lg:justify-start dark:text-gray-500"
                variants={fadeIn}
                initial="hidden"
                animate="visible"
                custom={0.5}
              >
                {['ATS-Friendly', '100% Free to Start', 'No Signup Walls'].map((label) => (
                  <span key={label} className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    {label}
                  </span>
                ))}
              </motion.div>
            </div>

            {/* Right — hero image + floating cards */}
            <motion.div
              className="relative flex items-center justify-center"
              variants={scaleIn}
              initial="hidden"
              animate="visible"
              custom={0.2}
            >
              {/* Decorative rings */}
              <div className="absolute h-[420px] w-[420px] rounded-full border border-emerald-200/40 lg:h-[520px] lg:w-[520px] dark:border-emerald-700/20" />
              <div className="absolute h-[340px] w-[340px] rounded-full border border-teal-200/30 lg:h-[440px] lg:w-[440px] dark:border-teal-700/15" />

              <div className="relative z-10 overflow-hidden rounded-2xl border border-gray-200/80 bg-white/60 shadow-2xl shadow-emerald-900/10 backdrop-blur-sm dark:border-gray-700/50 dark:bg-slate-800/60">
                <img
                  src="/hero.png"
                  alt="AI Resume Builder Preview"
                  className="h-auto w-full max-w-md object-cover lg:max-w-lg"
                />
              </div>

              {/* Floating score card 1 */}
              <motion.div
                className="absolute -left-4 top-8 z-20 rounded-xl border border-white/60 bg-white/90 px-4 py-3 shadow-lg backdrop-blur-sm dark:border-gray-700/50 dark:bg-slate-800/90 sm:-left-8"
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              >
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 dark:bg-emerald-900/40">
                    <Star className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-gray-900 dark:text-white">AI Score</div>
                    <div className="text-sm font-bold text-emerald-600 dark:text-emerald-400">95/100</div>
                  </div>
                </div>
              </motion.div>

              {/* Floating score card 2 */}
              <motion.div
                className="absolute -right-4 bottom-16 z-20 rounded-xl border border-white/60 bg-white/90 px-4 py-3 shadow-lg backdrop-blur-sm dark:border-gray-700/50 dark:bg-slate-800/90 sm:-right-8"
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
              >
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-100 dark:bg-amber-900/40">
                    <CheckCircle2 className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-gray-900 dark:text-white">ATS Status</div>
                    <div className="text-sm font-bold text-amber-600 dark:text-amber-400">Passed ✓</div>
                  </div>
                </div>
              </motion.div>

              {/* Floating score card 3 */}
              <motion.div
                className="absolute -bottom-2 left-8 z-20 rounded-xl border border-white/60 bg-white/90 px-4 py-3 shadow-lg backdrop-blur-sm dark:border-gray-700/50 dark:bg-slate-800/90 sm:left-12"
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
              >
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-100 dark:bg-violet-900/40">
                    <Sparkles className="h-4 w-4 text-violet-600 dark:text-violet-400" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-gray-900 dark:text-white">AI Enhanced</div>
                    <div className="text-sm font-bold text-violet-600 dark:text-violet-400">5 Suggestions</div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>

        {/* Scroll hint */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.5 }}
        >
          <ChevronRight className="h-5 w-5 rotate-90 animate-bounce text-emerald-400" />
        </motion.div>
      </section>

      {/* ================================================================ */}
      {/*  ANIMATED STATS BAR                                              */}
      {/* ================================================================ */}
      <section className="relative z-10">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-gray-200/80 bg-white/80 p-6 shadow-xl shadow-gray-200/50 backdrop-blur-xl dark:border-gray-700/50 dark:bg-slate-900/80 dark:shadow-black/20 sm:p-8">
            <div className="grid grid-cols-2 gap-6 lg:grid-cols-4 lg:gap-8">
              {stats.map((stat) => (
                <StatCounter key={stat.label} {...stat} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================ */}
      {/*  BENTO FEATURES GRID                                             */}
      {/* ================================================================ */}
      <section id="features" className="relative py-24 lg:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            className="mx-auto mb-16 max-w-2xl text-center"
            variants={slideUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            custom={0}
          >
            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-emerald-700 dark:border-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400 mb-4">
              Features
            </span>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Everything you need to{' '}
              <span className="bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">
                stand out
              </span>
            </h2>
            <p className="mt-4 text-lg text-gray-500 dark:text-gray-400">
              A complete toolkit designed to turn your experience into compelling career documents.
            </p>
          </motion.div>

          {/* Bento Grid */}
          <motion.div
            className="grid gap-4 sm:grid-cols-2 md:gap-5"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
          >
            {features.map((f, i) => {
              const Icon = f.icon;
              return (
                <motion.div
                  key={f.title}
                  className={`group relative overflow-hidden rounded-2xl border border-gray-100 bg-white p-6 sm:p-8 transition-all hover:shadow-lg hover:shadow-gray-200/50 dark:border-gray-800 dark:bg-slate-900 dark:hover:shadow-black/20 ${f.span}`}
                  variants={slideUp}
                  custom={i * 0.06}
                >
                  {/* Gradient top accent */}
                  <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${f.gradient} opacity-0 transition-opacity group-hover:opacity-100`} />

                  {/* Icon */}
                  <div className={`mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${f.gradient} text-white shadow-sm`}>
                    <Icon className="h-6 w-6" />
                  </div>

                  <h3 className="mb-2 text-lg font-semibold tracking-tight text-gray-900 dark:text-white">
                    {f.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-gray-500 dark:text-gray-400">
                    {f.description}
                  </p>

                  {/* Subtle hover background glow */}
                  <div className="pointer-events-none absolute -bottom-10 -right-10 h-40 w-40 rounded-full bg-gradient-to-br from-emerald-100/0 to-teal-100/0 blur-2xl transition-all group-hover:from-emerald-100/30 group-hover:to-teal-100/20 dark:group-hover:from-emerald-900/10 dark:group-hover:to-teal-900/10" />
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* ================================================================ */}
      {/*  TEMPLATE SHOWCASE                                               */}
      {/* ================================================================ */}
      <section id="templates" className="relative py-24 lg:py-32">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-transparent via-emerald-50/50 to-transparent dark:via-emerald-950/20" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            className="mx-auto mb-16 max-w-2xl text-center"
            variants={slideUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            custom={0}
          >
            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-emerald-700 dark:border-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400 mb-4">
              Templates
            </span>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              7 Professional{' '}
              <span className="bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">
                Templates
              </span>
            </h2>
            <p className="mt-4 text-lg text-gray-500 dark:text-gray-400">
              Choose the perfect design for your industry. Each template is ATS-friendly and fully customizable.
            </p>
          </motion.div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {templateShowcase.map((t, i) => (
              <motion.div
                key={t.name}
                className="group cursor-pointer"
                variants={scaleIn}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                custom={i * 0.08}
                onClick={() => {
                  setSelectedTemplate(t.key);
                  setCurrentView('builder');
                }}
              >
                <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white transition-all hover:shadow-xl hover:shadow-gray-200/50 dark:border-gray-800 dark:bg-slate-900 dark:hover:shadow-black/20">
                  {/* Template preview mockup */}
                  <div className={`relative h-44 bg-gradient-to-br ${t.color} p-4`}>
                    {/* Mock resume lines */}
                    <div className="absolute inset-0 p-5 opacity-20">
                      <div className="mb-3 h-3 w-1/2 rounded bg-white" />
                      <div className="mb-2 h-2 w-3/4 rounded bg-white" />
                      <div className="mb-4 h-2 w-2/3 rounded bg-white" />
                      <div className="mb-2 h-2 w-full rounded bg-white" />
                      <div className="mb-2 h-2 w-5/6 rounded bg-white" />
                      <div className="mb-4 h-2 w-4/5 rounded bg-white" />
                      <div className="mb-2 h-2 w-full rounded bg-white" />
                      <div className="mb-2 h-2 w-3/4 rounded bg-white" />
                      <div className="h-2 w-5/6 rounded bg-white" />
                    </div>
                    {/* Template name overlay */}
                    <div className="absolute bottom-3 left-4">
                      <span className="rounded-lg bg-black/20 px-2.5 py-1 text-xs font-semibold text-white backdrop-blur-sm">
                        {t.name}
                      </span>
                    </div>
                    {/* Hover overlay */}
                    <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-all group-hover:bg-black/20">
                      <ArrowRight className="h-6 w-6 text-white opacity-0 transition-all group-hover:opacity-100 group-hover:translate-x-1" />
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white">{t.name}</h3>
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{t.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            className="mt-12 text-center"
            variants={slideUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.4 }}
            custom={0.1}
          >
            <Button
              size="lg"
              className="group gap-2 rounded-full bg-gradient-to-r from-emerald-600 to-teal-500 px-8 text-base font-semibold shadow-lg shadow-emerald-500/25 transition-all hover:shadow-xl hover:shadow-emerald-500/30 hover:brightness-110"
              onClick={() => setCurrentView('builder')}
            >
              Try All Templates
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* ================================================================ */}
      {/*  HOW IT WORKS — Connected Timeline                                */}
      {/* ================================================================ */}
      <section id="how-it-works" className="relative py-24 lg:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            className="mx-auto mb-20 max-w-2xl text-center"
            variants={slideUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            custom={0}
          >
            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-emerald-700 dark:border-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400 mb-4">
              How It Works
            </span>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Three steps to your{' '}
              <span className="bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">
                perfect resume
              </span>
            </h2>
            <p className="mt-4 text-lg text-gray-500 dark:text-gray-400">
              No complicated setup. No design skills needed. Just you and your story.
            </p>
          </motion.div>

          <div className="relative grid gap-12 lg:grid-cols-3 lg:gap-8">
            {/* Connecting line */}
            <div className="absolute top-16 right-[16.67%] hidden h-0.5 w-[66.66%] bg-gradient-to-r from-emerald-300 via-teal-300 to-emerald-300 lg:block dark:from-emerald-700 dark:via-teal-700 dark:to-emerald-700" />

            {/* Traveling dot */}
            <motion.div
              className="absolute top-[58px] hidden h-3 w-3 rounded-full bg-white border-2 border-emerald-500 shadow-lg shadow-emerald-500/30 lg:block dark:border-emerald-400"
              animate={{ left: ['16.67%', '83.33%', '16.67%'] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
            />

            {steps.map((s, i) => (
              <motion.div
                key={s.step}
                className="relative flex flex-col items-center text-center"
                variants={slideUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                custom={i * 0.15}
              >
                {/* Step number */}
                <div className="relative z-10 mb-8 flex h-14 w-14 items-center justify-center rounded-full border-4 border-white bg-gradient-to-br from-emerald-600 to-teal-500 text-xl font-bold text-white shadow-lg shadow-emerald-500/20 dark:border-slate-900">
                  {s.step}
                </div>

                <h3 className="mb-3 text-xl font-semibold tracking-tight">{s.title}</h3>
                <p className="max-w-xs text-sm leading-relaxed text-gray-500 dark:text-gray-400">
                  {s.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ================================================================ */}
      {/*  FULL-WIDTH GRADIENT CTA                                          */}
      {/* ================================================================ */}
      <section className="relative py-24 lg:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-600 via-teal-600 to-emerald-700 px-6 py-16 text-center shadow-2xl shadow-emerald-500/20 sm:px-12 sm:py-20 lg:px-20"
            variants={scaleIn}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            {/* Background decorations */}
            <div className="pointer-events-none absolute inset-0">
              <div className="absolute -top-20 -right-20 h-60 w-60 rounded-full bg-white/10 blur-3xl" />
              <div className="absolute -bottom-20 -left-20 h-80 w-80 rounded-full bg-white/5 blur-3xl" />
              <div
                className="absolute inset-0 opacity-10"
                style={{
                  backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
                  backgroundSize: '20px 20px',
                }}
              />
            </div>

            <div className="relative z-10">
              <motion.div
                className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm"
                animate={{ y: [0, -5, 0], rotate: [0, 5, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              >
                <Rocket className="h-8 w-8 text-white" />
              </motion.div>
              <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
                Ready to Build Your Future?
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-lg text-emerald-100">
                Join thousands of professionals who&apos;ve already created stunning resumes with our AI-powered builder. It&apos;s free to start.
              </p>
              <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
                <Button
                  size="lg"
                  className="group gap-2 rounded-full bg-white px-8 text-base font-semibold text-emerald-700 shadow-lg transition-all hover:bg-emerald-50 hover:shadow-xl"
                  onClick={() => setCurrentView('builder')}
                >
                  Start Building Now
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="gap-2 rounded-full border-white/30 bg-white/10 px-8 text-base font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/20"
                  onClick={() =>
                    document.getElementById('templates')?.scrollIntoView({ behavior: 'smooth' })
                  }
                >
                  Browse Templates
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ================================================================ */}
      {/*  PROFESSIONAL 4-COLUMN FOOTER                                    */}
      {/* ================================================================ */}
      <footer className="border-t border-gray-100 bg-gray-50/80 dark:border-gray-800 dark:bg-slate-950/80">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {/* Brand */}
            <div className="sm:col-span-2 lg:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 shadow-sm">
                  <FileText className="h-4 w-4 text-white" />
                </div>
                <span className="text-lg font-bold">
                  <span className="bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent dark:from-emerald-400 dark:to-teal-400">
                    Resume
                  </span>
                  <span className="text-gray-900 dark:text-white">AI</span>
                </span>
              </div>
              <p className="text-sm leading-relaxed text-gray-500 dark:text-gray-400">
                AI-powered resume and portfolio builder. Create professional career documents in minutes.
              </p>
            </div>

            {/* Product */}
            <div>
              <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-900 dark:text-white">Product</h4>
              <ul className="space-y-3">
                {['Resume Builder', 'Portfolio Generator', 'AI Suggestions', 'PDF Export', 'Templates'].map((item) => (
                  <li key={item}>
                    <span className="text-sm text-gray-500 transition-colors hover:text-emerald-600 cursor-pointer dark:text-gray-400 dark:hover:text-emerald-400">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-900 dark:text-white">Resources</h4>
              <ul className="space-y-3">
                {['Resume Tips', 'Career Blog', 'Template Guide', 'FAQ', 'Tutorials'].map((item) => (
                  <li key={item}>
                    <span className="text-sm text-gray-500 transition-colors hover:text-emerald-600 cursor-pointer dark:text-gray-400 dark:hover:text-emerald-400">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-900 dark:text-white">Company</h4>
              <ul className="space-y-3">
                {['About Us', 'Contact', 'Privacy Policy', 'Terms of Service', 'Support'].map((item) => (
                  <li key={item}>
                    <span className="text-sm text-gray-500 transition-colors hover:text-emerald-600 cursor-pointer dark:text-gray-400 dark:hover:text-emerald-400">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-gray-200 pt-8 sm:flex-row dark:border-gray-800">
            <p className="text-sm text-gray-400">
              &copy; {new Date().getFullYear()} ResumeAI. All rights reserved.
            </p>
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <span className="text-xs text-gray-400 dark:text-gray-500">Toggle Theme</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
