'use client';

import { ResumeData } from '@/lib/types';

function formatDate(date: string, current?: boolean): string {
  if (!date) return '';
  if (current) return `${formatDate(date)} - Present`;
  const d = new Date(date);
  if (isNaN(d.getTime())) return date;
  return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
}

export default function MinimalistTemplate({ data }: { data: ResumeData }) {
  const { personalInfo, education, skills, projects, experience, certifications, achievements } = data;

  // Group skills by category
  const skillsByCategory = skills.reduce<Record<string, typeof skills>>((acc, skill) => {
    const cat = skill.category || 'Other';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(skill);
    return acc;
  }, {});

  // Contact items for horizontal line
  const contactItems = [
    personalInfo.email,
    personalInfo.phone,
    personalInfo.location,
    personalInfo.website,
    personalInfo.linkedin,
    personalInfo.github,
  ].filter(Boolean);

  return (
    <div className="bg-white text-gray-900 shadow-lg mx-auto max-w-[210mm] min-h-[297mm] aspect-[210/297] print:shadow-none print:max-w-none print:min-h-0 print:aspect-auto">
      <div className="px-12 py-14 sm:px-14 sm:py-16 flex flex-col h-full">
        {/* ── Header ── */}
        <header className="mb-8">
          {personalInfo.fullName && (
            <h1 className="text-4xl font-light tracking-tight text-gray-900 leading-none">
              {personalInfo.fullName}
            </h1>
          )}
          {personalInfo.jobTitle && (
            <p className="text-base font-light text-gray-500 mt-2 tracking-wide">
              {personalInfo.jobTitle}
            </p>
          )}
          {/* Contact line with bullet separators */}
          {contactItems.length > 0 && (
            <div className="mt-5 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-gray-500">
              {contactItems.map((item, idx) => (
                <span key={idx} className="flex items-center gap-x-2">
                  {idx > 0 && (
                    <span className="w-1 h-1 rounded-full bg-gray-300 flex-shrink-0" />
                  )}
                  <span>{item}</span>
                </span>
              ))}
            </div>
          )}
          {/* Hairline separator */}
          <div className="mt-8 border-t border-gray-200" />
        </header>

        {/* ── Body ── */}
        <div className="flex-1 space-y-7 overflow-hidden">
          {/* Summary */}
          {personalInfo.summary && (
            <section>
              <p className="text-sm leading-[1.8] text-gray-700 font-light">
                {personalInfo.summary}
              </p>
            </section>
          )}

          {/* Experience */}
          {experience.length > 0 && (
            <section>
              <SectionTitle>Experience</SectionTitle>
              <div className="mt-4 space-y-5">
                {experience.map((exp) => (
                  <div key={exp.id}>
                    <div className="flex items-baseline justify-between gap-4">
                      <div>
                        <h3 className="text-sm font-medium text-gray-900 tracking-wide">
                          {exp.position}
                        </h3>
                        <p className="text-sm text-gray-500 mt-0.5 font-light">
                          {exp.company}
                          {exp.location && (
                            <span className="text-gray-400"> · {exp.location}</span>
                          )}
                        </p>
                      </div>
                      <p className="text-[11px] text-gray-400 whitespace-nowrap flex-shrink-0 tracking-wide">
                        {formatDate(exp.startDate)} – {exp.current ? 'Present' : formatDate(exp.endDate)}
                      </p>
                    </div>
                    {exp.description && (
                      <p className="text-xs text-gray-600 mt-1.5 leading-[1.8] font-light whitespace-pre-line">
                        {exp.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Education */}
          {education.length > 0 && (
            <section>
              <SectionTitle>Education</SectionTitle>
              <div className="mt-4 space-y-4">
                {education.map((edu) => (
                  <div key={edu.id}>
                    <div className="flex items-baseline justify-between gap-4">
                      <div>
                        <h3 className="text-sm font-medium text-gray-900 tracking-wide">
                          {edu.degree}
                        </h3>
                        <p className="text-sm text-gray-500 mt-0.5 font-light">
                          {edu.institution}
                          {edu.location && (
                            <span className="text-gray-400"> · {edu.location}</span>
                          )}
                        </p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-[11px] text-gray-400 whitespace-nowrap tracking-wide">
                          {formatDate(edu.startDate)} – {formatDate(edu.endDate)}
                        </p>
                        {edu.gpa && (
                          <p className="text-[11px] text-gray-400 mt-0.5">GPA: {edu.gpa}</p>
                        )}
                      </div>
                    </div>
                    {edu.description && (
                      <p className="text-xs text-gray-600 mt-1 leading-[1.8] font-light">
                        {edu.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Skills */}
          {skills.length > 0 && (
            <section>
              <SectionTitle>Skills</SectionTitle>
              <div className="mt-4 space-y-3">
                {Object.entries(skillsByCategory).map(([category, items]) => (
                  <div key={category}>
                    <p className="text-[10px] uppercase tracking-[0.15em] text-gray-400 font-medium mb-2">
                      {category}
                    </p>
                    <p className="text-sm text-gray-700 font-light leading-relaxed">
                      {items.map((skill) => skill.name).join('  ·  ')}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Projects */}
          {projects.length > 0 && (
            <section>
              <SectionTitle>Projects</SectionTitle>
              <div className="mt-4 space-y-4">
                {projects.map((proj) => (
                  <div key={proj.id}>
                    <div className="flex items-baseline justify-between gap-4">
                      <h3 className="text-sm font-medium text-gray-900 tracking-wide">
                        {proj.name}
                        {proj.link && (
                          <span className="font-light text-[11px] text-gray-400 ml-2">
                            {proj.link}
                          </span>
                        )}
                      </h3>
                      <p className="text-[11px] text-gray-400 whitespace-nowrap flex-shrink-0 tracking-wide">
                        {formatDate(proj.startDate)}
                        {proj.endDate ? ` – ${formatDate(proj.endDate)}` : ''}
                      </p>
                    </div>
                    {proj.technologies && (
                      <p className="text-[11px] text-gray-400 mt-1 font-light italic">
                        {proj.technologies}
                      </p>
                    )}
                    {proj.description && (
                      <p className="text-xs text-gray-600 mt-1 leading-[1.8] font-light">
                        {proj.description}
                      </p>
                    )}
                    {proj.highlights && (
                      <p className="text-xs text-gray-600 mt-0.5 leading-[1.8] font-light">
                        {proj.highlights}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Certifications */}
          {certifications.length > 0 && (
            <section>
              <SectionTitle>Certifications</SectionTitle>
              <div className="mt-4 space-y-3">
                {certifications.map((cert) => (
                  <div key={cert.id}>
                    <div className="flex items-baseline justify-between gap-4">
                      <div>
                        <p className="text-sm font-medium text-gray-900 tracking-wide leading-tight">
                          {cert.name}
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5 font-light">{cert.issuer}</p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        {cert.date && (
                          <p className="text-[11px] text-gray-400 whitespace-nowrap">
                            {formatDate(cert.date)}
                          </p>
                        )}
                        {cert.credentialId && (
                          <p className="text-[11px] text-gray-400">ID: {cert.credentialId}</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Achievements */}
          {achievements.length > 0 && (
            <section>
              <SectionTitle>Achievements</SectionTitle>
              <div className="mt-4 space-y-3">
                {achievements.map((ach) => (
                  <div key={ach.id}>
                    <div className="flex items-baseline justify-between gap-4">
                      <p className="text-sm font-medium text-gray-900 tracking-wide">
                        {ach.title}
                      </p>
                      <div className="flex items-center gap-3 flex-shrink-0">
                        {ach.date && (
                          <p className="text-[11px] text-gray-400 whitespace-nowrap">
                            {formatDate(ach.date)}
                          </p>
                        )}
                        {ach.category && (
                          <span className="text-[10px] uppercase tracking-[0.12em] text-gray-400 font-medium">
                            {ach.category}
                          </span>
                        )}
                      </div>
                    </div>
                    {ach.description && (
                      <p className="text-xs text-gray-600 mt-0.5 leading-[1.8] font-light">
                        {ach.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── Minimalist section title with hairline underline ── */
function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-[11px] uppercase tracking-[0.2em] text-gray-400 font-medium pb-2 border-b border-gray-200">
      {children}
    </h2>
  );
}
