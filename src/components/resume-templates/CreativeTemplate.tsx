'use client';

import { ResumeData } from '@/lib/types';

function formatDate(date: string, current?: boolean): string {
  if (!date) return '';
  if (current) return `${formatDate(date)} - Present`;
  const d = new Date(date);
  if (isNaN(d.getTime())) return date;
  return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
}

const LEVEL_WIDTH: Record<string, string> = {
  beginner: 'w-1/4',
  intermediate: 'w-2/4',
  advanced: 'w-3/4',
  expert: 'w-full',
};

const LEVEL_COLORS: Record<string, string> = {
  beginner: 'bg-amber-400',
  intermediate: 'bg-sky-400',
  advanced: 'bg-violet-400',
  expert: 'bg-rose-400',
};

const GRADIENT_ACCENT = 'from-violet-500 via-fuchsia-500 to-pink-500';

export default function CreativeTemplate({ data }: { data: ResumeData }) {
  const { personalInfo, education, skills, projects, experience, certifications, achievements } = data;

  // Group skills by category
  const skillsByCategory = skills.reduce<Record<string, typeof skills>>((acc, skill) => {
    const cat = skill.category || 'Other';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(skill);
    return acc;
  }, {});

  return (
    <div className="bg-white shadow-lg mx-auto max-w-[210mm] min-h-[297mm] aspect-[210/297] print:shadow-none print:max-w-none print:min-h-0 print:aspect-auto flex flex-col overflow-hidden">
      {/* ── Gradient Header ── */}
      <header className={`bg-gradient-to-r ${GRADIENT_ACCENT} px-8 py-7 print:px-5 print:py-5 relative`}>
        {/* Geometric decorations */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/4" />
        <div className="absolute bottom-0 right-24 w-24 h-24 bg-white/10 rounded-lg rotate-12 translate-y-1/2" />
        <div className="absolute top-2 right-48 w-8 h-8 bg-white/20 rounded-full" />

        <div className="relative z-10">
          {personalInfo.fullName && (
            <h1 className="text-3xl font-extrabold text-white tracking-tight leading-none">
              {personalInfo.fullName}
            </h1>
          )}
          {personalInfo.jobTitle && (
            <p className="text-sm font-medium text-white/80 mt-1 tracking-wide">
              {personalInfo.jobTitle}
            </p>
          )}

          {/* Contact chips */}
          <div className="flex flex-wrap gap-2 mt-4">
            {personalInfo.email && (
              <ContactChip icon="✉">{personalInfo.email}</ContactChip>
            )}
            {personalInfo.phone && (
              <ContactChip icon="☎">{personalInfo.phone}</ContactChip>
            )}
            {personalInfo.location && (
              <ContactChip icon="📍">{personalInfo.location}</ContactChip>
            )}
            {personalInfo.website && (
              <ContactChip icon="🔗">{personalInfo.website}</ContactChip>
            )}
            {personalInfo.linkedin && (
              <ContactChip icon="in">{personalInfo.linkedin}</ContactChip>
            )}
            {personalInfo.github && (
              <ContactChip icon="⌥">{personalInfo.github}</ContactChip>
            )}
          </div>
        </div>
      </header>

      {/* ── Body ── */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar */}
        <aside className="w-[38%] bg-slate-900 text-slate-200 p-6 print:p-4 flex-shrink-0 overflow-y-auto">
          {/* Summary */}
          {personalInfo.summary && (
            <SidebarSection title="About Me">
              <p className="text-xs leading-relaxed text-slate-300">{personalInfo.summary}</p>
            </SidebarSection>
          )}

          {/* Skills */}
          {skills.length > 0 && (
            <SidebarSection title="Skills">
              <div className="space-y-3">
                {Object.entries(skillsByCategory).map(([category, items]) => (
                  <div key={category}>
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 mb-2">
                      {category}
                    </p>
                    <div className="space-y-2">
                      {items.map((skill) => (
                        <div key={skill.id}>
                          <div className="flex items-center justify-between mb-0.5">
                            <span className="text-xs text-slate-200">{skill.name}</span>
                            <span className="text-[9px] uppercase tracking-wider text-slate-500">
                              {skill.level}
                            </span>
                          </div>
                          <div className="h-1.5 w-full bg-slate-700 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${LEVEL_COLORS[skill.level] || LEVEL_COLORS.intermediate} ${
                                LEVEL_WIDTH[skill.level] || LEVEL_WIDTH.intermediate
                              }`}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </SidebarSection>
          )}

          {/* Certifications */}
          {certifications.length > 0 && (
            <SidebarSection title="Certifications">
              <div className="space-y-2.5">
                {certifications.map((cert) => (
                  <div
                    key={cert.id}
                    className="bg-slate-800 rounded-lg px-3 py-2 border border-slate-700/50"
                  >
                    <p className="text-xs font-semibold text-white leading-tight">{cert.name}</p>
                    <p className="text-[11px] text-slate-400">{cert.issuer}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      {cert.date && (
                        <p className="text-[10px] text-slate-500">{formatDate(cert.date)}</p>
                      )}
                      {cert.credentialId && (
                        <p className="text-[10px] text-slate-500">ID: {cert.credentialId}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </SidebarSection>
          )}

          {/* Achievements */}
          {achievements.length > 0 && (
            <SidebarSection title="Achievements">
              <div className="space-y-2.5">
                {achievements.map((ach) => (
                  <div key={ach.id} className="flex items-start gap-2">
                    <div className="mt-1 w-1.5 h-1.5 rounded-full bg-gradient-to-r from-violet-400 to-pink-400 flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-white">{ach.title}</p>
                      {ach.description && (
                        <p className="text-[11px] text-slate-400 mt-0.5">{ach.description}</p>
                      )}
                      <div className="flex items-center gap-2 mt-0.5">
                        {ach.date && (
                          <p className="text-[10px] text-slate-500">{formatDate(ach.date)}</p>
                        )}
                        {ach.category && (
                          <span className="text-[9px] uppercase tracking-wider text-violet-400 font-medium">
                            {ach.category}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </SidebarSection>
          )}
        </aside>

        {/* Main Content */}
        <main className="w-[62%] p-6 print:p-4 flex-shrink-0 overflow-y-auto text-gray-800">
          {/* Experience */}
          {experience.length > 0 && (
            <MainSection title="Experience">
              <div className="space-y-4">
                {experience.map((exp) => (
                  <div
                    key={exp.id}
                    className="bg-gray-50 rounded-xl p-3.5 border border-gray-100"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <h3 className="text-sm font-bold text-gray-900 leading-tight">
                          {exp.position}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {exp.company}
                          {exp.location && (
                            <span className="text-gray-400"> &middot; {exp.location}</span>
                          )}
                        </p>
                      </div>
                      <span className="inline-block text-[10px] font-medium bg-gradient-to-r from-violet-500 to-pink-500 text-white px-2 py-0.5 rounded-full whitespace-nowrap flex-shrink-0">
                        {formatDate(exp.startDate)} - {exp.current ? 'Present' : formatDate(exp.endDate)}
                      </span>
                    </div>
                    {exp.description && (
                      <p className="text-xs text-gray-600 mt-2 leading-relaxed whitespace-pre-line">
                        {exp.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </MainSection>
          )}

          {/* Education */}
          {education.length > 0 && (
            <MainSection title="Education">
              <div className="space-y-3">
                {education.map((edu) => (
                  <div
                    key={edu.id}
                    className="bg-gray-50 rounded-xl p-3.5 border border-gray-100"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <h3 className="text-sm font-bold text-gray-900 leading-tight">{edu.degree}</h3>
                        <p className="text-sm text-gray-600">
                          {edu.institution}
                          {edu.location && (
                            <span className="text-gray-400"> &middot; {edu.location}</span>
                          )}
                        </p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-[10px] font-medium text-gray-500 whitespace-nowrap">
                          {formatDate(edu.startDate)} - {formatDate(edu.endDate)}
                        </p>
                        {edu.gpa && (
                          <p className="text-[10px] text-gray-400 mt-0.5">GPA: {edu.gpa}</p>
                        )}
                      </div>
                    </div>
                    {edu.description && (
                      <p className="text-xs text-gray-600 mt-1.5 leading-relaxed">
                        {edu.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </MainSection>
          )}

          {/* Projects */}
          {projects.length > 0 && (
            <MainSection title="Projects">
              <div className="space-y-3">
                {projects.map((proj) => (
                  <div
                    key={proj.id}
                    className="bg-gray-50 rounded-xl p-3.5 border border-gray-100"
                  >
                    <div className="flex items-baseline justify-between gap-2">
                      <h3 className="text-sm font-bold text-gray-900 leading-tight">
                        {proj.name}
                        {proj.link && (
                          <span className="font-normal text-[11px] text-violet-500 ml-2">
                            {proj.link}
                          </span>
                        )}
                      </h3>
                      <p className="text-[10px] text-gray-400 whitespace-nowrap flex-shrink-0">
                        {formatDate(proj.startDate)}
                        {proj.endDate ? ` - ${formatDate(proj.endDate)}` : ''}
                      </p>
                    </div>
                    {proj.technologies && (
                      <div className="flex flex-wrap gap-1 mt-1.5">
                        {proj.technologies.split(',').map((tech, i) => (
                          <span
                            key={i}
                            className="inline-block text-[10px] px-2 py-0.5 rounded-full bg-violet-50 text-violet-700 border border-violet-100 font-medium"
                          >
                            {tech.trim()}
                          </span>
                        ))}
                      </div>
                    )}
                    {proj.description && (
                      <p className="text-xs text-gray-600 mt-1.5 leading-relaxed">
                        {proj.description}
                      </p>
                    )}
                    {proj.highlights && (
                      <p className="text-xs text-gray-600 mt-0.5 leading-relaxed">
                        {proj.highlights}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </MainSection>
          )}
        </main>
      </div>
    </div>
  );
}

/* ── Sidebar section (dark bg) ── */
function SidebarSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mb-5">
      <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-2.5 pb-1.5 border-b border-slate-700">
        {title}
      </h2>
      {children}
    </section>
  );
}

/* ── Main content section (light bg) ── */
function MainSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mb-5">
      <h2 className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-900 mb-3">
        <span className="inline-block w-1 h-5 rounded-full bg-gradient-to-b from-violet-500 to-pink-500 flex-shrink-0" />
        {title}
      </h2>
      {children}
    </section>
  );
}

/* ── Contact chip used in the gradient header ── */
function ContactChip({ icon, children }: { icon: string; children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1 bg-white/20 backdrop-blur-sm text-white text-[11px] px-2.5 py-1 rounded-full font-medium">
      <span className="text-xs">{icon}</span>
      <span className="truncate max-w-[180px]">{children}</span>
    </span>
  );
}
