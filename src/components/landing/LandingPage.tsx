'use client';

import { motion } from 'framer-motion';
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
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAppStore } from '@/lib/store';

/* ------------------------------------------------------------------ */
/*  Animation helpers                                                 */
/* ------------------------------------------------------------------ */

const fadeIn = {
  hidden: { opacity: 0 },
  visible: (delay: number = 0) => ({
    opacity: 1,
    transition: { duration: 0.6, delay, ease: 'easeOut' as const },
  }),
};

const slideUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (delay: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  }),
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: (delay: number = 0) => ({
    opacity: 1,
    scale: 1,
    transition: { duration: 0.55, delay, ease: 'easeOut' as const },
  }),
};

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

const features = [
  {
    icon: FileText,
    title: 'Resume Templates',
    description:
      'Choose from a curated library of ATS-friendly, professionally designed resume templates.',
  },
  {
    icon: Sparkles,
    title: 'AI-Powered Editing',
    description:
      'Let AI refine bullet points, optimize keywords, and tailor content for each role.',
  },
  {
    icon: Download,
    title: 'PDF Download',
    description:
      'Export a pixel-perfect PDF ready for emails, applications, and printing.',
  },
  {
    icon: Globe,
    title: 'Portfolio Generation',
    description:
      'Auto-generate a stunning portfolio page you can share with a single link.',
  },
  {
    icon: Wand2,
    title: 'Step-by-Step Wizard',
    description:
      'An intuitive guided flow walks you through every section — no guesswork.',
  },
  {
    icon: Smartphone,
    title: 'Mobile Friendly',
    description:
      'Build and preview your resume on any device, anytime, anywhere.',
  },
];

const steps = [
  {
    step: 1,
    title: 'Fill Your Details',
    description:
      'Enter your experience, education, skills, and projects. Our AI helps you write compelling copy.',
  },
  {
    step: 2,
    title: 'Choose Template',
    description:
      'Browse templates, customize colors and layout, then fine-tune every section with the live preview.',
  },
  {
    step: 3,
    title: 'Download & Share',
    description:
      'Export as PDF or publish your portfolio online with one click and share your unique link.',
  },
];

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function LandingPage() {
  const { setCurrentView } = useAppStore();

  return (
    <div className="relative min-h-screen overflow-hidden bg-white text-gray-900">
      {/* ---------- Ambient background blobs ---------- */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-32 left-1/2 h-[600px] w-[900px] -translate-x-1/2 rounded-full bg-gradient-to-br from-emerald-100/60 via-teal-100/40 to-transparent blur-3xl" />
        <div className="absolute top-[60%] -right-40 h-[400px] w-[400px] rounded-full bg-gradient-to-br from-teal-100/50 to-emerald-50/30 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-[300px] w-[500px] rounded-full bg-gradient-to-tr from-emerald-50/60 to-transparent blur-3xl" />
        {/* Subtle dot pattern overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              'radial-gradient(circle, #059669 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }}
        />
      </div>

      {/* ============================================================ */}
      {/*  HERO                                                        */}
      {/* ============================================================ */}
      <section className="relative flex min-h-screen items-center">
        <div className="mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-12 px-6 py-24 lg:grid-cols-2 lg:gap-16 lg:px-8">
          {/* Left — copy */}
          <div className="flex flex-col gap-8 text-center lg:text-left">
            <motion.div
              variants={fadeIn}
              initial="hidden"
              animate="visible"
              custom={0}
            >
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-emerald-700">
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
              AI Resume &amp;{' '}
              <span className="bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">
                Portfolio Builder
              </span>
            </motion.h1>

            <motion.p
              className="mx-auto max-w-xl text-lg leading-relaxed text-gray-600 lg:mx-0"
              variants={fadeIn}
              initial="hidden"
              animate="visible"
              custom={0.25}
            >
              Build professional, ATS-optimized resumes and stunning
              portfolios in minutes — no design skills needed. Let AI do the
              heavy lifting while you focus on landing your dream job.
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
                Get Started
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Button>

              <Button
                variant="ghost"
                className="gap-2 rounded-full text-gray-600 hover:text-emerald-700"
              >
                <FileText className="h-4 w-4" />
                View Templates
              </Button>
            </motion.div>

            {/* Trust line */}
            <motion.div
              className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 pt-2 text-sm text-gray-500 lg:justify-start"
              variants={fadeIn}
              initial="hidden"
              animate="visible"
              custom={0.5}
            >
              {['ATS-friendly', '100% Free to Start', 'No Signup Walls'].map(
                (label) => (
                  <span key={label} className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    {label}
                  </span>
                ),
              )}
            </motion.div>
          </div>

          {/* Right — hero image */}
          <motion.div
            className="relative flex items-center justify-center"
            variants={scaleIn}
            initial="hidden"
            animate="visible"
            custom={0.2}
          >
            {/* Decorative ring */}
            <div className="absolute h-[420px] w-[420px] rounded-full border border-emerald-200/60 lg:h-[520px] lg:w-[520px]" />
            <div className="absolute h-[340px] w-[340px] rounded-full border border-teal-200/40 lg:h-[440px] lg:w-[440px]" />

            <div className="relative z-10 overflow-hidden rounded-2xl border border-gray-200/80 bg-white/60 shadow-2xl shadow-emerald-900/10 backdrop-blur-sm">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/hero.png"
                alt="AI Resume Builder Preview"
                className="h-auto w-full max-w-md object-cover lg:max-w-lg"
              />
            </div>
          </motion.div>
        </div>

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

      {/* ============================================================ */}
      {/*  FEATURES                                                    */}
      {/* ============================================================ */}
      <section className="relative py-24 lg:py-32">
        {/* Accent divider */}
        <div className="mx-auto mb-16 h-px w-24 bg-gradient-to-r from-transparent via-emerald-400 to-transparent" />

        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          {/* Section header */}
          <motion.div
            className="mx-auto mb-16 max-w-2xl text-center"
            variants={slideUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            custom={0}
          >
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Everything you need to{' '}
              <span className="bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">
                stand out
              </span>
            </h2>
            <p className="mt-4 text-lg text-gray-500">
              A complete toolkit designed to turn your experience into
              compelling career documents.
            </p>
          </motion.div>

          {/* Grid */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f, i) => {
              const Icon = f.icon;
              return (
                <motion.div
                  key={f.title}
                  className="group relative rounded-2xl border border-gray-100 bg-white/70 p-8 backdrop-blur-sm transition-all hover:border-emerald-200 hover:shadow-lg hover:shadow-emerald-500/5"
                  variants={slideUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.2 }}
                  custom={i * 0.08}
                >
                  {/* Icon container */}
                  <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-50 to-teal-50 text-emerald-600 transition-colors group-hover:from-emerald-100 group-hover:to-teal-100">
                    <Icon className="h-6 w-6" />
                  </div>

                  <h3 className="mb-2 text-lg font-semibold tracking-tight text-gray-900">
                    {f.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-gray-500">
                    {f.description}
                  </p>

                  {/* Hover glow */}
                  <div className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity group-hover:opacity-100">
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-emerald-50/40 to-teal-50/30" />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  HOW IT WORKS                                                */}
      {/* ============================================================ */}
      <section className="relative py-24 lg:py-32">
        {/* Subtle background tint */}
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-transparent via-emerald-50/40 to-transparent" />

        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          {/* Section header */}
          <motion.div
            className="mx-auto mb-20 max-w-2xl text-center"
            variants={slideUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            custom={0}
          >
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              How it{' '}
              <span className="bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">
                works
              </span>
            </h2>
            <p className="mt-4 text-lg text-gray-500">
              Three simple steps from blank page to professional resume.
            </p>
          </motion.div>

          {/* Steps */}
          <div className="relative grid gap-12 lg:grid-cols-3 lg:gap-8">
            {/* Connecting line (desktop) */}
            <div className="absolute top-16 right-1/2 hidden h-0.5 w-full translate-x-1/2 bg-gradient-to-r from-emerald-300 via-teal-300 to-emerald-300 lg:block" />

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
                <div className="relative z-10 mb-8 flex h-14 w-14 items-center justify-center rounded-full border-4 border-white bg-gradient-to-br from-emerald-600 to-teal-500 text-xl font-bold text-white shadow-lg shadow-emerald-500/20">
                  {s.step}
                </div>

                <h3 className="mb-3 text-xl font-semibold tracking-tight">
                  {s.title}
                </h3>
                <p className="max-w-xs text-sm leading-relaxed text-gray-500">
                  {s.description}
                </p>
              </motion.div>
            ))}
          </div>

          {/* CTA */}
          <motion.div
            className="mt-20 text-center"
            variants={slideUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.4 }}
            custom={0.1}
          >
            <Button
              size="lg"
              className="group gap-2 rounded-full bg-gradient-to-r from-emerald-600 to-teal-500 px-10 text-base font-semibold shadow-lg shadow-emerald-500/25 transition-all hover:shadow-xl hover:shadow-emerald-500/30 hover:brightness-110"
              onClick={() => setCurrentView('builder')}
            >
              Start Building Your Resume
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  FOOTER                                                      */}
      {/* ============================================================ */}
      <footer className="border-t border-gray-100 bg-gray-50/60 py-10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 text-sm text-gray-400 sm:flex-row lg:px-8">
          <p>&copy; {new Date().getFullYear()} AI Resume &amp; Portfolio Builder. All rights reserved.</p>
          <div className="flex gap-6">
            <span className="cursor-pointer transition-colors hover:text-emerald-600">
              Privacy
            </span>
            <span className="cursor-pointer transition-colors hover:text-emerald-600">
              Terms
            </span>
            <span className="cursor-pointer transition-colors hover:text-emerald-600">
              Contact
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
