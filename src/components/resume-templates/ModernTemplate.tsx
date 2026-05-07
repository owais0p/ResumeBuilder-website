'use client';

import { ResumeData } from '@/lib/types';

function formatDate(date: string, current?: boolean): string {
  if (!date) return '';
  if (current) return `${formatDate(date)} - Present`;
  const d = new Date(date);
  if (isNaN(d.getTime())) return date;
  return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
}

const SKILL_COLORS: Record<string, string> = {
  beginner: 'bg-teal-50 text-teal-700 border border-teal-200',
  intermediate: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
  advanced: 'bg-green-50 text-green-700 border border-green-200',
  expert: 'bg-lime-50 text-lime-700 border border-lime-200',
};

export default function ModernTemplate({ data }: { data: ResumeData }) {
  const { personalInfo, education, skills, projects, experience, certifications, achievements } = data;

  // Group skills by category
  const skillsByCategory = skills.reduce<Record<string, typeof skills>>((acc, skill) => {
    const cat = skill.category || 'Other';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(skill);
    return acc;
  }, {});

  return (
    <div className="bg-white text-gray-800 shadow-lg mx-auto max-w-[210mm] min-h-[297mm] aspect-[210/297] print:shadow-none print:max-w-none print:min-h-0 print:aspect-auto">
      <div className="p-8 print:p-5 flex flex-col h-full">
        {/* ── Header ── */}
        <header className="mb-6 pb-5 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
            <div>
              {personalInfo.fullName && (
                <h1 className="text-3xl font-bold text-gray-900 tracking-tight leading-none">
                  {personalInfo.fullName}
                </h1>
              )}
              {personalInfo.jobTitle && (
                <p className="text-base text-emerald-600 font-medium mt-1">{personalInfo.jobTitle}</p>
              )}
            </div>
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500">
              {personalInfo.email && <span>{personalInfo.email}</span>}
              {personalInfo.phone && <span>{personalInfo.phone}</span>}
              {personalInfo.location && <span>{personalInfo.location}</span>}
            </div>
          </div>
          {/* Links row */}
          <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-xs">
            {personalInfo.website && (
              <span className="text-emerald-600 hover:text-emerald-700">{personalInfo.website}</span>
            )}
            {personalInfo.linkedin && (
              <span className="text-emerald-600 hover:text-emerald-700">{personalInfo.linkedin}</span>
            )}
            {personalInfo.github && (
              <span className="text-emerald-600 hover:text-emerald-700">{personalInfo.github}</span>
            )}
          </div>
        </header>

        {/* ── Body (scrollable area) ── */}
        <div className="flex-1 overflow-hidden space-y-5">
          {/* Summary */}
          {personalInfo.summary && (
            <Section title="Summary">
              <p className="text-sm leading-relaxed text-gray-600">{personalInfo.summary}</p>
            </Section>
          )}

          {/* Experience */}
          {experience.length > 0 && (
            <Section title="Experience">
              <div className="space-y-4">
                {experience.map((exp) => (
                  <div key={exp.id} className="relative pl-4 border-l-2 border-emerald-200">
                    {/* Dot marker */}
                    <div className="absolute -left-[5px] top-1 w-2 h-2 rounded-full bg-emerald-500" />
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <h3 className="text-sm font-semibold text-gray-900">{exp.position}</h3>
                        <p className="text-sm text-gray-600">
                          {exp.company}
                          {exp.location && (
                            <span className="text-gray-400"> &middot; {exp.location}</span>
                          )}
                        </p>
                      </div>
                      <p className="text-[11px] text-gray-400 whitespace-nowrap flex-shrink-0 pt-0.5">
                        {formatDate(exp.startDate)} - {exp.current ? 'Present' : formatDate(exp.endDate)}
                      </p>
                    </div>
                    {exp.description && (
                      <p className="text-xs text-gray-600 mt-1 leading-relaxed whitespace-pre-line">
                        {exp.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </Section>
          )}

          {/* Education */}
          {education.length > 0 && (
            <Section title="Education">
              <div className="space-y-3">
                {education.map((edu) => (
                  <div key={edu.id}>
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <h3 className="text-sm font-semibold text-gray-900">{edu.degree}</h3>
                        <p className="text-sm text-gray-600">
                          {edu.institution}
                          {edu.location && (
                            <span className="text-gray-400"> &middot; {edu.location}</span>
                          )}
                        </p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-[11px] text-gray-400 whitespace-nowrap">
                          {formatDate(edu.startDate)} - {formatDate(edu.endDate)}
                        </p>
                        {edu.gpa && <p className="text-[11px] text-gray-400">GPA: {edu.gpa}</p>}
                      </div>
                    </div>
                    {edu.description && (
                      <p className="text-xs text-gray-600 mt-0.5 leading-relaxed">{edu.description}</p>
                    )}
                  </div>
                ))}
              </div>
            </Section>
          )}

          {/* Skills */}
          {skills.length > 0 && (
            <Section title="Skills">
              <div className="space-y-3">
                {Object.entries(skillsByCategory).map(([category, items]) => (
                  <div key={category}>
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400 mb-1.5">
                      {category}
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {items.map((skill) => (
                        <span
                          key={skill.id}
                          className={`inline-block text-xs px-2.5 py-0.5 rounded-full font-medium ${SKILL_COLORS[skill.level] || SKILL_COLORS.intermediate}`}
                        >
                          {skill.name}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </Section>
          )}

          {/* Projects */}
          {projects.length > 0 && (
            <Section title="Projects">
              <div className="space-y-3">
                {projects.map((proj) => (
                  <div key={proj.id}>
                    <div className="flex items-baseline justify-between gap-2">
                      <h3 className="text-sm font-semibold text-gray-900">
                        {proj.name}
                        {proj.link && (
                          <span className="font-normal text-[11px] text-emerald-600 ml-2">
                            {proj.link}
                          </span>
                        )}
                      </h3>
                      <p className="text-[11px] text-gray-400 whitespace-nowrap flex-shrink-0">
                        {formatDate(proj.startDate)}
                        {proj.endDate ? ` - ${formatDate(proj.endDate)}` : ''}
                      </p>
                    </div>
                    {proj.technologies && (
                      <div className="flex flex-wrap gap-1 mt-1">
                        {proj.technologies.split(',').map((tech, i) => (
                          <span
                            key={i}
                            className="inline-block text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100"
                          >
                            {tech.trim()}
                          </span>
                        ))}
                      </div>
                    )}
                    {proj.description && (
                      <p className="text-xs text-gray-600 mt-1 leading-relaxed">{proj.description}</p>
                    )}
                    {proj.highlights && (
                      <p className="text-xs text-gray-600 mt-0.5 leading-relaxed">{proj.highlights}</p>
                    )}
                  </div>
                ))}
              </div>
            </Section>
          )}

          {/* Certifications */}
          {certifications.length > 0 && (
            <Section title="Certifications">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {certifications.map((cert) => (
                  <div
                    key={cert.id}
                    className="bg-gray-50 rounded-lg px-3 py-2 border border-gray-100"
                  >
                    <p className="text-xs font-semibold text-gray-900 leading-tight">{cert.name}</p>
                    <p className="text-[11px] text-gray-500">{cert.issuer}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      {cert.date && (
                        <p className="text-[10px] text-gray-400">{formatDate(cert.date)}</p>
                      )}
                      {cert.credentialId && (
                        <p className="text-[10px] text-gray-400">ID: {cert.credentialId}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </Section>
          )}

          {/* Achievements */}
          {achievements.length > 0 && (
            <Section title="Achievements">
              <div className="space-y-2">
                {achievements.map((ach) => (
                  <div key={ach.id} className="flex items-start gap-2">
                    <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-gray-900">{ach.title}</p>
                      {ach.description && (
                        <p className="text-xs text-gray-600 mt-0.5">{ach.description}</p>
                      )}
                      <div className="flex items-center gap-2 mt-0.5">
                        {ach.date && (
                          <p className="text-[10px] text-gray-400">{formatDate(ach.date)}</p>
                        )}
                        {ach.category && (
                          <span className="text-[9px] uppercase tracking-wider text-emerald-600 font-medium">
                            {ach.category}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Section>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── Reusable Section wrapper with emerald left-border accent ── */
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-900 mb-2.5">
        <span className="inline-block w-3 h-3 rounded-sm bg-emerald-500 flex-shrink-0" />
        {title}
      </h2>
      {children}
    </section>
  );
}
