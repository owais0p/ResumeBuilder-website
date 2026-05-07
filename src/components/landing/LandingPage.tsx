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
/*  Scroll-spy hook                                                    */
/* ------------------------------------------------------------------ */

const NAV_SECTIONS = [
  { label: 'Features', id: 'features' },
  { label: 'Templates', id: 'templates' },
  { label: 'How It Works', id: 'how-it-works' },
] as const;

function useActiveSection(sectionIds: readonly { id: string }[]) {
  const [activeId, setActiveId] = useState('');

  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    sectionIds.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiveId(id);
        },
        { rootMargin: '-30% 0px -60% 0px' },
      );
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, [sectionIds]);

  return activeId;
}

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
  { icon: LayoutTemplate, value: 12, suffix: '+', label: 'Templates' },
  { icon: Star, value: 4.9, suffix: '★', label: 'User Rating', isDecimal: true },
  { icon: Zap, value: 30, suffix: 's', label: 'Avg Build Time' },
];

const features = [
  {
    icon: Sparkles,
    title: 'AI-Powered Editing',
    description: 'Let AI refine bullet points, optimize keywords, and tailor content for each role you apply to.',
    gradient: 'from-emerald-600 to-teal-500',
    span: 'md:col-span-2',
  },
  {
    icon: LayoutTemplate,
    title: '12 Beautiful Templates',
    description: 'From Classic to Developer — pick the style that matches your industry and personality.',
    gradient: 'from-teal-600 to-emerald-500',
    span: 'md:col-span-1',
  },
  {
    icon: Download,
    title: 'PDF Export',
    description: 'Export a pixel-perfect PDF ready for emails, applications, and printing.',
    gradient: 'from-green-600 to-emerald-500',
    span: 'md:col-span-1',
  },
  {
    icon: Globe,
    title: 'Portfolio Page',
    description: 'Auto-generate a stunning portfolio page you can share with a single link.',
    gradient: 'from-emerald-500 to-green-400',
    span: 'md:col-span-1',
  },
  {
    icon: Shield,
    title: 'ATS-Friendly',
    description: 'All templates are tested to pass Applicant Tracking Systems with flying colors.',
    gradient: 'from-teal-500 to-cyan-500',
    span: 'md:col-span-1',
  },
  {
    icon: Wand2,
    title: 'Step-by-Step Wizard',
    description: 'An intuitive guided flow walks you through every section — no guesswork.',
    gradient: 'from-emerald-600 to-green-500',
    span: 'md:col-span-1',
  },
  {
    icon: Smartphone,
    title: 'Mobile Friendly',
    description: 'Build and preview your resume on any device, anytime, anywhere.',
    gradient: 'from-green-500 to-teal-400',
    span: 'md:col-span-1',
  },
  {
    icon: Palette,
    title: 'Dark Mode',
    description: 'Full dark mode support for comfortable editing day and night.',
    gradient: 'from-teal-700 to-emerald-600',
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
    description: 'Browse 12 unique templates, customize colors and layout with live preview.',
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
    category: 'Corporate',
    badge: 'Popular',
    layout: 'single',
  },
  {
    key: 'modern',
    name: 'Modern',
    description: 'Clean lines with bold accent colors for tech roles.',
    color: 'from-emerald-600 to-teal-700',
    accent: '#059669',
    category: 'Tech',
    badge: 'Popular',
    layout: 'sidebar',
  },
  {
    key: 'creative',
    name: 'Creative',
    description: 'Eye-catching design for designers and creatives.',
    color: 'from-violet-600 to-purple-700',
    accent: '#7c3aed',
    category: 'Creative',
    badge: 'Popular',
    layout: 'split',
  },
  {
    key: 'executive',
    name: 'Executive',
    description: 'Premium navy & gold for senior leadership.',
    color: 'from-blue-900 to-slate-900',
    accent: '#1e3a5f',
    category: 'Corporate',
    layout: 'sidebar',
  },
  {
    key: 'minimalist',
    name: 'Minimalist',
    description: 'Stripped-back elegance that lets content shine.',
    color: 'from-gray-700 to-gray-900',
    accent: '#374151',
    category: 'Minimal',
    layout: 'single',
  },
  {
    key: 'tech',
    name: 'Tech',
    description: 'GitHub-inspired dark theme for developers.',
    color: 'from-zinc-800 to-zinc-950',
    accent: '#18181b',
    category: 'Tech',
    badge: 'New',
    layout: 'terminal',
  },
  {
    key: 'infographic',
    name: 'Infographic',
    description: 'Visual timeline with progress bars and icons.',
    color: 'from-teal-500 to-emerald-600',
    accent: '#14b8a6',
    category: 'Creative',
    layout: 'bars',
  },
  {
    key: 'academic',
    name: 'Academic',
    description: 'Serif typography with burgundy accents for researchers.',
    color: 'from-rose-800 to-red-900',
    accent: '#6B1D2A',
    category: 'Academic',
    badge: 'New',
    layout: 'single',
  },
  {
    key: 'freelancer',
    name: 'Freelancer',
    description: 'Warm amber design with featured work cards.',
    color: 'from-amber-400 to-orange-500',
    accent: '#f59e0b',
    category: 'Freelance',
    badge: 'New',
    layout: 'cards',
  },
  {
    key: 'corporate',
    name: 'Corporate',
    description: 'Formal charcoal header with steel blue accents.',
    color: 'from-gray-700 to-slate-800',
    accent: '#3b6b96',
    category: 'Corporate',
    layout: 'header',
  },
  {
    key: 'elegant',
    name: 'Elegant',
    description: 'Rose gold design with timeline layout.',
    color: 'from-rose-300 to-amber-200',
    accent: '#e8a0b4',
    category: 'Elegant',
    badge: 'New',
    layout: 'split',
  },
  {
    key: 'developer',
    name: 'Developer',
    description: 'Terminal-inspired with dark banner and green highlights.',
    color: 'from-slate-800 to-gray-900',
    accent: '#22c55e',
    category: 'Tech',
    badge: 'New',
    layout: 'terminal',
  },
];

/* ------------------------------------------------------------------ */
/*  Template Mockup (different mini-layouts per template)              */
/* ------------------------------------------------------------------ */

function TemplateMockup({ layout }: { layout: string }) {
  const o = 'opacity-20 text-white'; // base class
  return (
    <div className="absolute inset-0 p-3">
      {layout === 'sidebar' && (
        <div className={`flex h-full gap-1.5 ${o}`}>
          <div className="w-1/4 flex flex-col gap-1.5">
            <div className="h-6 w-full rounded-sm bg-white/60" />
            <div className="flex-1 rounded-sm bg-white/30" />
            <div className="h-3 w-full rounded-sm bg-white/20" />
            <div className="h-3 w-3/4 rounded-sm bg-white/20" />
            <div className="h-3 w-5/6 rounded-sm bg-white/20" />
          </div>
          <div className="flex-1 flex flex-col gap-1.5">
            <div className="h-2 w-14 rounded-sm bg-white/70" />
            <div className="h-1 w-20 rounded-sm bg-white/40 mb-1" />
            <div className="h-[1px] w-full bg-white/20 mb-1" />
            <div className="h-1.5 w-full rounded-sm bg-white/30" />
            <div className="h-1.5 w-4/5 rounded-sm bg-white/30" />
            <div className="h-1.5 w-3/5 rounded-sm bg-white/30" />
            <div className="h-[1px] w-full bg-white/20 my-1" />
            <div className="h-1.5 w-full rounded-sm bg-white/30" />
            <div className="h-1.5 w-3/4 rounded-sm bg-white/30" />
          </div>
        </div>
      )}
      {layout === 'split' && (
        <div className={`flex h-full gap-1.5 ${o}`}>
          <div className="w-[30%] flex flex-col gap-1.5">
            <div className="h-8 w-full rounded-sm bg-white/50" />
            <div className="h-2 w-full rounded-sm bg-white/30" />
            <div className="h-2 w-3/4 rounded-sm bg-white/30" />
          </div>
          <div className="flex-1 flex flex-col gap-1">
            <div className="h-2 w-16 rounded-sm bg-white/60" />
            <div className="h-1.5 w-full rounded-sm bg-white/25" />
            <div className="h-1.5 w-5/6 rounded-sm bg-white/25" />
            <div className="mt-1 h-2 w-12 rounded-sm bg-white/60" />
            <div className="h-1.5 w-full rounded-sm bg-white/25" />
            <div className="h-1.5 w-4/5 rounded-sm bg-white/25" />
            <div className="h-1.5 w-3/5 rounded-sm bg-white/25" />
            <div className="mt-1 h-2 w-10 rounded-sm bg-white/60" />
            <div className="h-1.5 w-full rounded-sm bg-white/25" />
          </div>
        </div>
      )}
      {layout === 'terminal' && (
        <div className={`flex flex-col h-full gap-1.5 ${o}`}>
          <div className="flex gap-1">
            <div className="h-1.5 w-1.5 rounded-full bg-red-400/60" />
            <div className="h-1.5 w-1.5 rounded-full bg-yellow-400/60" />
            <div className="h-1.5 w-1.5 rounded-full bg-green-400/60" />
          </div>
          <div className="h-2 w-24 rounded-sm bg-white/50 font-mono" />
          <div className="h-1 w-32 rounded-sm bg-emerald-300/40" />
          <div className="h-1 w-20 rounded-sm bg-emerald-300/30" />
          <div className="h-1 w-28 rounded-sm bg-emerald-300/20" />
          <div className="mt-1 h-2 w-16 rounded-sm bg-white/50 font-mono" />
          <div className="h-1 w-full rounded-sm bg-emerald-300/40" />
          <div className="h-1 w-4/5 rounded-sm bg-emerald-300/30" />
          <div className="h-1 w-3/5 rounded-sm bg-emerald-300/20" />
          <div className="mt-1 flex gap-1">
            <div className="h-2 w-8 rounded-sm bg-emerald-400/30" />
            <div className="h-2 w-10 rounded-sm bg-emerald-400/25" />
            <div className="h-2 w-6 rounded-sm bg-emerald-400/20" />
          </div>
        </div>
      )}
      {layout === 'header' && (
        <div className={`flex flex-col h-full gap-1.5 ${o}`}>
          <div className="h-6 w-full rounded-sm bg-white/50" />
          <div className="flex gap-2 items-center">
            <div className="h-2.5 w-16 rounded-sm bg-white/60" />
            <div className="h-1 w-24 rounded-sm bg-white/40" />
          </div>
          <div className="h-[1px] w-full bg-white/20" />
          <div className="h-1.5 w-full rounded-sm bg-white/25" />
          <div className="h-1.5 w-5/6 rounded-sm bg-white/25" />
          <div className="h-1.5 w-4/5 rounded-sm bg-white/25" />
          <div className="h-[1px] w-full bg-white/20 my-0.5" />
          <div className="h-1.5 w-full rounded-sm bg-white/25" />
          <div className="h-1.5 w-3/4 rounded-sm bg-white/25" />
          <div className="h-1.5 w-5/6 rounded-sm bg-white/25" />
        </div>
      )}
      {layout === 'bars' && (
        <div className={`flex flex-col h-full gap-1.5 ${o}`}>
          <div className="h-2 w-16 rounded-sm bg-white/60" />
          <div className="h-1.5 w-full rounded-sm bg-white/30" />
          <div className="h-1.5 w-4/5 rounded-sm bg-white/30" />
          <div className="mt-1 flex items-end gap-1.5">
            <div className="h-4 w-2/5 rounded-sm bg-white/40" />
            <div className="h-3 w-1/3 rounded-sm bg-white/30" />
            <div className="h-5 w-1/4 rounded-sm bg-white/50" />
          </div>
          <div className="mt-1 h-2 w-12 rounded-sm bg-white/60" />
          <div className="h-1.5 w-full rounded-sm bg-white/30" />
          <div className="h-1.5 w-3/4 rounded-sm bg-white/30" />
          <div className="h-1.5 w-5/6 rounded-sm bg-white/30" />
        </div>
      )}
      {layout === 'cards' && (
        <div className={`flex flex-col h-full gap-1.5 ${o}`}>
          <div className="h-2 w-14 rounded-sm bg-white/60" />
          <div className="h-1.5 w-20 rounded-sm bg-white/40" />
          <div className="mt-1 grid grid-cols-2 gap-1">
            <div className="h-8 rounded-sm bg-white/25 border border-white/15" />
            <div className="h-8 rounded-sm bg-white/25 border border-white/15" />
            <div className="h-8 rounded-sm bg-white/25 border border-white/15" />
            <div className="h-8 rounded-sm bg-white/25 border border-white/15" />
          </div>
          <div className="mt-1 flex gap-1">
            <div className="h-2 w-8 rounded-full bg-white/30" />
            <div className="h-2 w-6 rounded-full bg-white/30" />
            <div className="h-2 w-10 rounded-full bg-white/30" />
          </div>
        </div>
      )}
      {layout === 'single' && (
        <div className={`flex flex-col h-full gap-1.5 ${o}`}>
          <div className="h-2.5 w-18 rounded-sm bg-white/60" />
          <div className="h-1.5 w-28 rounded-sm bg-white/40 mb-0.5" />
          <div className="h-[1px] w-full bg-white/20 mb-1" />
          <div className="h-1.5 w-full rounded-sm bg-white/30" />
          <div className="h-1.5 w-4/5 rounded-sm bg-white/30" />
          <div className="h-1.5 w-3/5 rounded-sm bg-white/30" />
          <div className="h-[1px] w-full bg-white/20 my-1" />
          <div className="h-1.5 w-full rounded-sm bg-white/30" />
          <div className="h-1.5 w-3/4 rounded-sm bg-white/30" />
          <div className="h-1.5 w-5/6 rounded-sm bg-white/30" />
          <div className="h-1.5 w-2/3 rounded-sm bg-white/30" />
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function LandingPage() {
  const { setCurrentView, setSelectedTemplate } = useAppStore();
  const heroRef = useRef<HTMLElement>(null);
  const activeSection = useActiveSection(NAV_SECTIONS);
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
            {NAV_SECTIONS.map(({ label, id }) => {
              const isActive = activeSection === id;
              return (
                <a
                  key={id}
                  href={`#${id}`}
                  className={`rounded-lg px-3 py-2 text-sm transition-colors ${
                    isActive
                      ? 'font-semibold text-emerald-700 dark:text-emerald-400'
                      : 'font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-white'
                  }`}
                  style={isActive ? { boxShadow: 'inset 0 -2px 0 0 currentColor' } : undefined}
                >
                  {label}
                </a>
              );
            })}
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button
              variant="outline"
              size="sm"
              className="hidden rounded-full border-emerald-300 bg-transparent px-4 text-sm font-semibold text-emerald-700 transition-all hover:border-emerald-400 hover:bg-emerald-50 hover:text-emerald-800 active:scale-95 dark:border-emerald-700 dark:text-emerald-400 dark:hover:border-emerald-600 dark:hover:bg-emerald-950/40 dark:hover:text-emerald-300 sm:inline-flex"
              onClick={() => setCurrentView('builder')}
            >
              Get Started
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="rounded-full border-emerald-300 bg-transparent px-4 text-sm font-semibold text-emerald-700 transition-all hover:border-emerald-400 hover:bg-emerald-50 hover:text-emerald-800 active:scale-95 dark:border-emerald-700 dark:text-emerald-400 dark:hover:border-emerald-600 dark:hover:bg-emerald-950/40 dark:hover:text-emerald-300 sm:hidden"
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
                className="mx-auto max-w-xl text-lg leading-[1.6] text-gray-600 lg:mx-0 dark:text-gray-400"
                variants={fadeIn}
                initial="hidden"
                animate="visible"
                custom={0.25}
              >
                Create professional, ATS-optimized resumes and stunning portfolios — no design skills needed. Let AI handle the heavy lifting so you can focus on landing your dream job.
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
          <div className="rounded-2xl border border-gray-200/60 bg-white/60 p-6 shadow-xl shadow-gray-200/40 backdrop-blur-2xl dark:border-white/10 dark:bg-white/[0.04] dark:shadow-black/20 sm:p-8">
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
              Templates for{' '}
              <span className="bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">
                Every Style
              </span>
            </h2>
            <p className="mt-4 text-lg text-gray-500 dark:text-gray-400">
              From corporate to creative, academic to tech — find the design that tells your story best.
            </p>
          </motion.div>

          {/* Category pills */}
          <div className="mb-10 flex flex-wrap items-center justify-center gap-2">
            {['All', 'Corporate', 'Tech', 'Creative', 'Minimal', 'Academic', 'Freelance', 'Elegant'].map((cat) => (
              <button
                key={cat}
                className="rounded-full border border-gray-200 bg-white px-4 py-1.5 text-xs font-medium text-gray-600 transition-all hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700 dark:border-gray-700 dark:bg-slate-800 dark:text-gray-300 dark:hover:border-emerald-700 dark:hover:bg-emerald-900/20 dark:hover:text-emerald-400 first:border-emerald-400 first:bg-emerald-50 first:text-emerald-700 dark:first:border-emerald-600 dark:first:bg-emerald-900/30 dark:first:text-emerald-400"
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Featured large card */}
          <div className="mb-8 grid gap-4 lg:grid-cols-2">
            {templateShowcase.slice(0, 2).map((t, i) => (
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
                <div className="relative overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all duration-300 hover:shadow-2xl hover:shadow-gray-300/40 hover:-translate-y-1 dark:border-gray-800 dark:bg-slate-900 dark:hover:shadow-black/30">
                  <div className="flex">
                    {/* Mini resume preview */}
                    <div className={`relative w-1/2 min-h-[180px] bg-gradient-to-br ${t.color} overflow-hidden`}>
                      {/* Mockup layout */}
                      <TemplateMockup layout={t.layout} />
                      {/* Badge */}
                      {t.badge && (
                        <div className="absolute top-3 left-3">
                          <span className={`rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider ${
                            t.badge === 'Popular'
                              ? 'bg-amber-400 text-amber-900'
                              : 'bg-emerald-400 text-emerald-900'
                          }`}>
                            {t.badge}
                          </span>
                        </div>
                      )}
                      {/* Category tag */}
                      <div className="absolute bottom-3 left-3">
                        <span className="rounded-md bg-white/15 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-white/80 backdrop-blur-sm">
                          {t.category}
                        </span>
                      </div>
                    </div>
                    {/* Info */}
                    <div className="flex flex-col justify-center p-5 flex-1">
                      <span className="mb-1 text-[10px] font-semibold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
                        {t.category}
                      </span>
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1.5">{t.name}</h3>
                      <p className="text-sm leading-relaxed text-gray-500 dark:text-gray-400 mb-3">{t.description}</p>
                      <div className="flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400 transition-all group-hover:gap-2">
                        Use this template
                        <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Grid of remaining templates */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {templateShowcase.slice(2).map((t, i) => (
              <motion.div
                key={t.name}
                className="group cursor-pointer"
                variants={scaleIn}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                custom={(i + 2) * 0.06}
                onClick={() => {
                  setSelectedTemplate(t.key);
                  setCurrentView('builder');
                }}
              >
                <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all duration-300 hover:shadow-xl hover:shadow-gray-300/30 hover:-translate-y-0.5 dark:border-gray-800 dark:bg-slate-900 dark:hover:shadow-black/20">
                  {/* Template preview */}
                  <div className={`relative h-44 bg-gradient-to-br ${t.color} overflow-hidden`}>
                    <TemplateMockup layout={t.layout} />
                    {/* Badge */}
                    {t.badge && (
                      <div className="absolute top-2.5 left-2.5">
                        <span className={`rounded-full px-2 py-0.5 text-[8px] font-bold uppercase tracking-wider shadow-sm ${
                          t.badge === 'Popular'
                            ? 'bg-amber-400 text-amber-900'
                            : 'bg-emerald-400 text-emerald-900'
                        }`}>
                          {t.badge}
                        </span>
                      </div>
                    )}
                    {/* Category tag */}
                    <div className="absolute bottom-2.5 left-2.5">
                      <span className="rounded-md bg-black/20 px-2 py-0.5 text-[8px] font-semibold uppercase tracking-wider text-white/80 backdrop-blur-sm">
                        {t.category}
                      </span>
                    </div>
                    {/* Hover CTA */}
                    <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-all duration-300 group-hover:bg-black/30">
                      <div className="flex items-center gap-1.5 rounded-full bg-white/90 px-3.5 py-2 text-xs font-semibold text-gray-900 opacity-0 shadow-lg transition-all duration-300 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 dark:bg-slate-800/90 dark:text-white">
                        Use Template
                        <ArrowRight className="h-3 w-3" />
                      </div>
                    </div>
                  </div>
                  <div className="px-4 py-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">{t.name}</h3>
                        <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400 line-clamp-1">{t.description}</p>
                      </div>
                      <div className="h-2.5 w-2.5 rounded-full border-2 border-white/50 shadow-sm transition-colors group-hover:bg-emerald-500 group-hover:border-emerald-400" style={{ backgroundColor: t.accent }} />
                    </div>
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
                  className="gap-2 rounded-full border-white/60 bg-white/15 px-8 text-base font-semibold text-white shadow-sm backdrop-blur-sm transition-all hover:bg-white/25 hover:border-white/80 hover:shadow-md"
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
              {/* Social icons */}
              <div className="mt-5 flex items-center gap-3">
                {[
                  { label: 'X / Twitter', path: 'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z' },
                  { label: 'LinkedIn', path: 'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z' },
                  { label: 'GitHub', path: 'M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z' },
                ].map((social) => (
                  <a
                    key={social.label}
                    href="#"
                    aria-label={social.label}
                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-400 transition-all hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-600 dark:border-gray-700 dark:bg-slate-800 dark:text-gray-500 dark:hover:border-emerald-700 dark:hover:bg-emerald-900/20 dark:hover:text-emerald-400"
                  >
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d={social.path} />
                    </svg>
                  </a>
                ))}
              </div>
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
