"use client";

import { useMemo, useRef } from "react";
import { motion, useInView } from "framer-motion";
import type { ResumeData, Skill } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Mail,
  Phone,
  MapPin,
  Globe,
  Linkedin,
  Github,
  ExternalLink,
  Calendar,
  Briefcase,
  GraduationCap,
  Award,
  Code2,
  ChevronRight,
} from "lucide-react";

/* -------------------------------------------------------------------------- */
/*  Helpers                                                                    */
/* -------------------------------------------------------------------------- */

/** Skill-level → visual width percentage */
function skillWidth(level: Skill["level"]): number {
  const map: Record<Skill["level"], number> = {
    beginner: 25,
    intermediate: 50,
    advanced: 75,
    expert: 100,
  };
  return map[level];
}

/** Skill-level → colour token for the fill bar */
function skillColor(level: Skill["level"]): string {
  const map: Record<Skill["level"], string> = {
    beginner: "bg-emerald-300",
    intermediate: "bg-emerald-400",
    advanced: "bg-teal-500",
    expert: "bg-teal-600",
  };
  return map[level];
}

/** Format date string (e.g. "2023-01") into readable form */
function fmtDate(d: string): string {
  if (!d) return "";
  const [yr, mo] = d.split("-");
  if (!mo) return yr;
  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ];
  return `${months[parseInt(mo, 10) - 1]} ${yr}`;
}

/* -------------------------------------------------------------------------- */
/*  Animated wrapper – reveals on scroll                                       */
/* -------------------------------------------------------------------------- */

function FadeIn({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 28 }}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function StaggerContainer({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: 0.08 } },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function StaggerItem({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 22 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Section heading                                                            */
/* -------------------------------------------------------------------------- */

function SectionHeading({ icon: Icon, title }: { icon: React.ElementType; title: string }) {
  return (
    <FadeIn className="mb-10 flex items-center gap-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400">
        <Icon className="h-5 w-5" />
      </div>
      <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50 sm:text-3xl">
        {title}
      </h2>
      <Separator className="ml-2 mt-1 flex-1" />
    </FadeIn>
  );
}

/* -------------------------------------------------------------------------- */
/*  Main Component                                                             */
/* -------------------------------------------------------------------------- */

export default function PortfolioPreview({ data }: { data: ResumeData }) {
  const { personalInfo, education, skills, projects, experience, certifications, achievements } = data;

  // Group skills by category
  const skillsByCategory = useMemo(() => {
    const groups: Record<string, typeof skills> = {};
    for (const s of skills) {
      const cat = s.category || "Other";
      (groups[cat] ??= []).push(s);
    }
    return Object.entries(groups).sort(([a], [b]) => a.localeCompare(b));
  }, [skills]);

  return (
    <div className="min-h-screen bg-white text-slate-800 dark:bg-slate-950 dark:text-slate-200">
      {/* ================================================================== */}
      {/*  HERO                                                               */}
      {/* ================================================================== */}
      <header className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900">
        {/* Decorative blobs */}
        <div className="pointer-events-none absolute -top-32 -left-32 h-[420px] w-[420px] rounded-full bg-emerald-500/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-40 -right-40 h-[500px] w-[500px] rounded-full bg-teal-400/15 blur-3xl" />

        <div className="relative mx-auto max-w-5xl px-6 py-24 sm:py-32 md:py-40">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col items-center text-center"
          >
            {/* Avatar initials */}
            <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 text-3xl font-extrabold text-white shadow-lg shadow-emerald-500/30 sm:h-28 sm:w-28 sm:text-4xl">
              {personalInfo.fullName
                .split(" ")
                .map((w) => w[0])
                .join("")
                .toUpperCase()
                .slice(0, 2)}
            </div>

            <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl md:text-6xl">
              {personalInfo.fullName}
            </h1>
            <p className="mt-3 text-lg font-medium text-emerald-300 sm:text-xl">
              {personalInfo.jobTitle}
            </p>

            {personalInfo.summary && (
              <p className="mt-5 max-w-2xl text-base leading-relaxed text-slate-300 sm:text-lg">
                {personalInfo.summary}
              </p>
            )}

            {/* Contact links row */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              {personalInfo.email && (
                <ContactPill href={`mailto:${personalInfo.email}`} icon={Mail} label={personalInfo.email} />
              )}
              {personalInfo.phone && (
                <ContactPill href={`tel:${personalInfo.phone}`} icon={Phone} label={personalInfo.phone} />
              )}
              {personalInfo.location && (
                <ContactPill href="#" icon={MapPin} label={personalInfo.location} />
              )}
              {personalInfo.website && (
                <ContactPill href={personalInfo.website} icon={Globe} label="Website" external />
              )}
              {personalInfo.linkedin && (
                <ContactPill href={personalInfo.linkedin} icon={Linkedin} label="LinkedIn" external />
              )}
              {personalInfo.github && (
                <ContactPill href={personalInfo.github} icon={Github} label="GitHub" external />
              )}
            </div>
          </motion.div>
        </div>

        {/* Bottom fade */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-white dark:from-slate-950" />
      </header>

      {/* ================================================================== */}
      {/*  ABOUT ME                                                           */}
      {/* ================================================================== */}
      <section className="mx-auto max-w-5xl px-6 py-20" id="about">
        <SectionHeading icon={Globe} title="About Me" />
        <FadeIn>
          <Card className="border-none bg-gradient-to-br from-slate-50 to-emerald-50/50 shadow-none dark:from-slate-900 dark:to-emerald-950/20">
            <CardContent className="text-base leading-relaxed text-slate-600 dark:text-slate-300 sm:text-lg">
              {personalInfo.summary || "No summary provided."}
            </CardContent>
          </Card>
        </FadeIn>
      </section>

      {/* ================================================================== */}
      {/*  SKILLS                                                             */}
      {/* ================================================================== */}
      {skills.length > 0 && (
        <section className="mx-auto max-w-5xl px-6 py-20" id="skills">
          <SectionHeading icon={Code2} title="Skills" />
          <StaggerContainer className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
            {skillsByCategory.map(([category, items]) => (
              <StaggerItem key={category}>
                <Card className="h-full transition-shadow duration-300 hover:shadow-lg hover:shadow-emerald-500/5">
                  <CardHeader>
                    <CardTitle className="text-lg capitalize text-slate-800 dark:text-slate-100">
                      {category}
                    </CardTitle>
                    <CardDescription>{items.length} skill{items.length !== 1 ? "s" : ""}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex flex-col gap-4">
                    {items.map((skill) => (
                      <div key={skill.id}>
                        <div className="mb-1 flex items-center justify-between text-sm">
                          <span className="font-medium text-slate-700 dark:text-slate-300">{skill.name}</span>
                          <Badge
                            variant="secondary"
                            className="text-[10px] capitalize text-emerald-700 dark:text-emerald-400"
                          >
                            {skill.level}
                          </Badge>
                        </div>
                        <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
                          <motion.div
                            className={`h-full rounded-full ${skillColor(skill.level)}`}
                            initial={{ width: 0 }}
                            whileInView={{ width: `${skillWidth(skill.level)}%` }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
                          />
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </section>
      )}

      {/* ================================================================== */}
      {/*  EXPERIENCE TIMELINE                                                */}
      {/* ================================================================== */}
      {experience.length > 0 && (
        <section className="mx-auto max-w-5xl px-6 py-20" id="experience">
          <SectionHeading icon={Briefcase} title="Experience" />
          <div className="relative ml-4 border-l-2 border-emerald-300 dark:border-emerald-700 sm:ml-6">
            {experience.map((exp, idx) => (
              <FadeIn key={exp.id} delay={idx * 0.06} className="relative mb-12 pl-8 last:mb-0 sm:pl-10">
                {/* Dot */}
                <span className="absolute -left-[9px] top-1.5 h-4 w-4 rounded-full border-2 border-white bg-emerald-500 shadow-sm ring-2 ring-emerald-200 dark:border-slate-900 dark:ring-emerald-800 sm:-left-[11px] sm:h-5 sm:w-5" />

                <Card className="transition-shadow duration-300 hover:shadow-lg hover:shadow-emerald-500/5">
                  <CardHeader>
                    <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <CardTitle className="text-lg text-slate-800 dark:text-slate-100">
                          {exp.position}
                        </CardTitle>
                        <CardDescription className="text-base font-medium text-emerald-700 dark:text-emerald-400">
                          {exp.company}
                          {exp.location && (
                            <span className="ml-2 text-sm font-normal text-slate-500 dark:text-slate-400">
                              &middot; {exp.location}
                            </span>
                          )}
                        </CardDescription>
                      </div>
                      <div className="flex shrink-0 items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                        <Calendar className="h-3.5 w-3.5" />
                        {fmtDate(exp.startDate)} &mdash;{" "}
                        {exp.current ? "Present" : fmtDate(exp.endDate)}
                      </div>
                    </div>
                  </CardHeader>
                  {exp.description && (
                    <CardContent>
                      <p className="whitespace-pre-line text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                        {exp.description}
                      </p>
                    </CardContent>
                  )}
                </Card>
              </FadeIn>
            ))}
          </div>
        </section>
      )}

      {/* ================================================================== */}
      {/*  PROJECTS                                                           */}
      {/* ================================================================== */}
      {projects.length > 0 && (
        <section className="mx-auto max-w-5xl px-6 py-20" id="projects">
          <SectionHeading icon={Code2} title="Projects" />
          <StaggerContainer className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((proj) => (
              <StaggerItem key={proj.id}>
                <Card className="group flex h-full flex-col overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-emerald-500/10">
                  {/* Accent top bar */}
                  <div className="h-1 w-full bg-gradient-to-r from-emerald-400 to-teal-500" />
                  <CardHeader className="flex-1">
                    <CardTitle className="text-lg text-slate-800 dark:text-slate-100">
                      {proj.name}
                    </CardTitle>
                    <CardDescription className="line-clamp-3 text-sm leading-relaxed">
                      {proj.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex flex-col gap-3">
                    {/* Technologies */}
                    {proj.technologies && (
                      <div className="flex flex-wrap gap-1.5">
                        {proj.technologies.split(",").map((t) => (
                          <Badge
                            key={t.trim()}
                            variant="outline"
                            className="border-emerald-200 text-[11px] text-emerald-700 dark:border-emerald-800 dark:text-emerald-400"
                          >
                            {t.trim()}
                          </Badge>
                        ))}
                      </div>
                    )}
                    {/* Highlights */}
                    {proj.highlights && (
                      <ul className="mt-1 space-y-1 text-xs text-slate-500 dark:text-slate-400">
                        {proj.highlights.split("\n").map((h, i) => (
                          <li key={i} className="flex items-start gap-1.5">
                            <ChevronRight className="mt-0.5 h-3 w-3 shrink-0 text-emerald-500" />
                            <span>{h}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </CardContent>
                  <CardFooter className="flex items-center justify-between text-xs text-slate-400 dark:text-slate-500">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {fmtDate(proj.startDate)}
                      {proj.endDate && proj.endDate !== proj.startDate
                        ? ` – ${fmtDate(proj.endDate)}`
                        : ""}
                    </span>
                    {proj.link && (
                      <a
                        href={proj.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 font-medium text-emerald-600 transition-colors hover:text-emerald-500 dark:text-emerald-400"
                      >
                        View
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    )}
                  </CardFooter>
                </Card>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </section>
      )}

      {/* ================================================================== */}
      {/*  EDUCATION                                                          */}
      {/* ================================================================== */}
      {education.length > 0 && (
        <section className="mx-auto max-w-5xl px-6 py-20" id="education">
          <SectionHeading icon={GraduationCap} title="Education" />
          <StaggerContainer className="grid gap-6 sm:grid-cols-2">
            {education.map((edu) => (
              <StaggerItem key={edu.id}>
                <Card className="h-full transition-shadow duration-300 hover:shadow-lg hover:shadow-emerald-500/5">
                  <CardHeader>
                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400">
                        <GraduationCap className="h-5 w-5" />
                      </div>
                      <div className="min-w-0">
                        <CardTitle className="text-lg text-slate-800 dark:text-slate-100">
                          {edu.degree}
                        </CardTitle>
                        <CardDescription className="text-sm font-medium text-emerald-700 dark:text-emerald-400">
                          {edu.institution}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="flex flex-col gap-2 text-sm text-slate-600 dark:text-slate-300">
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 dark:text-slate-400">
                      {edu.location && (
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {edu.location}
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {fmtDate(edu.startDate)} &mdash; {fmtDate(edu.endDate)}
                      </span>
                    </div>
                    {edu.gpa && (
                      <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                        GPA: {edu.gpa}
                      </p>
                    )}
                    {edu.description && (
                      <p className="mt-1 text-sm leading-relaxed">{edu.description}</p>
                    )}
                  </CardContent>
                </Card>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </section>
      )}

      {/* ================================================================== */}
      {/*  CERTIFICATIONS & ACHIEVEMENTS                                      */}
      {/* ================================================================== */}
      {(certifications.length > 0 || achievements.length > 0) && (
        <section className="mx-auto max-w-5xl px-6 py-20" id="certifications">
          <SectionHeading icon={Award} title="Certifications &amp; Achievements" />

          <div className="grid gap-10 lg:grid-cols-2">
            {/* Certifications */}
            {certifications.length > 0 && (
              <FadeIn>
                <h3 className="mb-4 text-lg font-semibold text-slate-700 dark:text-slate-200">
                  Certifications
                </h3>
                <StaggerContainer className="space-y-4">
                  {certifications.map((cert) => (
                    <StaggerItem key={cert.id}>
                      <Card className="transition-shadow duration-300 hover:shadow-md">
                        <CardContent className="flex items-start gap-4 py-4">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-teal-100 text-teal-700 dark:bg-teal-950 dark:text-teal-400">
                            <Award className="h-4 w-4" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="font-semibold text-slate-800 dark:text-slate-100">
                              {cert.name}
                            </p>
                            <p className="text-sm text-slate-500 dark:text-slate-400">
                              {cert.issuer}
                              {cert.date && (
                                <span className="ml-2">
                                  &middot; {fmtDate(cert.date)}
                                </span>
                              )}
                            </p>
                            {cert.credentialId && (
                              <p className="mt-0.5 text-xs text-slate-400 dark:text-slate-500">
                                ID: {cert.credentialId}
                              </p>
                            )}
                            {cert.url && (
                              <a
                                href={cert.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mt-1 inline-flex items-center gap-1 text-xs font-medium text-emerald-600 transition-colors hover:text-emerald-500 dark:text-emerald-400"
                              >
                                View Credential
                                <ExternalLink className="h-3 w-3" />
                              </a>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </StaggerItem>
                  ))}
                </StaggerContainer>
              </FadeIn>
            )}

            {/* Achievements */}
            {achievements.length > 0 && (
              <FadeIn delay={0.1}>
                <h3 className="mb-4 text-lg font-semibold text-slate-700 dark:text-slate-200">
                  Achievements
                </h3>
                <StaggerContainer className="space-y-4">
                  {achievements.map((ach) => (
                    <StaggerItem key={ach.id}>
                      <Card className="transition-shadow duration-300 hover:shadow-md">
                        <CardContent className="flex items-start gap-4 py-4">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400">
                            <Award className="h-4 w-4" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="font-semibold text-slate-800 dark:text-slate-100">
                              {ach.title}
                            </p>
                            {ach.description && (
                              <p className="mt-0.5 text-sm text-slate-600 dark:text-slate-300">
                                {ach.description}
                              </p>
                            )}
                            <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-400 dark:text-slate-500">
                              {ach.date && (
                                <span className="flex items-center gap-1">
                                  <Calendar className="h-3 w-3" />
                                  {fmtDate(ach.date)}
                                </span>
                              )}
                              {ach.category && (
                                <Badge
                                  variant="secondary"
                                  className="text-[10px] text-emerald-700 dark:text-emerald-400"
                                >
                                  {ach.category}
                                </Badge>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </StaggerItem>
                  ))}
                </StaggerContainer>
              </FadeIn>
            )}
          </div>
        </section>
      )}

      {/* ================================================================== */}
      {/*  CONTACT / FOOTER                                                   */}
      {/* ================================================================== */}
      <footer className="border-t border-slate-200 bg-gradient-to-b from-slate-50 to-white dark:border-slate-800 dark:from-slate-900 dark:to-slate-950">
        <section className="mx-auto max-w-5xl px-6 py-20" id="contact">
          <SectionHeading icon={Mail} title="Get In Touch" />
          <FadeIn>
            <div className="flex flex-col items-center text-center">
              <p className="max-w-xl text-base leading-relaxed text-slate-600 dark:text-slate-300">
                I&apos;m always open to new opportunities, collaborations, and conversations. Feel free to
                reach out through any of the channels below.
              </p>

              <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                {personalInfo.email && (
                  <Button asChild variant="outline" size="lg" className="gap-2">
                    <a href={`mailto:${personalInfo.email}`}>
                      <Mail className="h-4 w-4" />
                      {personalInfo.email}
                    </a>
                  </Button>
                )}
                {personalInfo.phone && (
                  <Button asChild variant="outline" size="lg" className="gap-2">
                    <a href={`tel:${personalInfo.phone}`}>
                      <Phone className="h-4 w-4" />
                      {personalInfo.phone}
                    </a>
                  </Button>
                )}
                {personalInfo.linkedin && (
                  <Button asChild variant="outline" size="lg" className="gap-2">
                    <a href={personalInfo.linkedin} target="_blank" rel="noopener noreferrer">
                      <Linkedin className="h-4 w-4" />
                      LinkedIn
                    </a>
                  </Button>
                )}
                {personalInfo.github && (
                  <Button asChild variant="outline" size="lg" className="gap-2">
                    <a href={personalInfo.github} target="_blank" rel="noopener noreferrer">
                      <Github className="h-4 w-4" />
                      GitHub
                    </a>
                  </Button>
                )}
                {personalInfo.website && (
                  <Button asChild variant="outline" size="lg" className="gap-2">
                    <a href={personalInfo.website} target="_blank" rel="noopener noreferrer">
                      <Globe className="h-4 w-4" />
                      Website
                    </a>
                  </Button>
                )}
              </div>
            </div>
          </FadeIn>
        </section>

        {/* Copyright */}
        <Separator />
        <div className="mx-auto max-w-5xl px-6 py-6 text-center text-xs text-slate-400 dark:text-slate-500">
          &copy; {new Date().getFullYear()} {personalInfo.fullName}. All rights reserved.
        </div>
      </footer>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  ContactPill – small pill used in hero & contact                           */
/* -------------------------------------------------------------------------- */

function ContactPill({
  href,
  icon: Icon,
  label,
  external = false,
}: {
  href: string;
  icon: React.ElementType;
  label: string;
  external?: boolean;
}) {
  const shared =
    "inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3.5 py-1.5 text-xs font-medium text-white/90 backdrop-blur-sm transition-colors hover:bg-white/20";

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={shared}>
        <Icon className="h-3.5 w-3.5" />
        {label}
      </a>
    );
  }

  return (
    <a href={href} className={shared}>
      <Icon className="h-3.5 w-3.5" />
      {label}
    </a>
  );
}
