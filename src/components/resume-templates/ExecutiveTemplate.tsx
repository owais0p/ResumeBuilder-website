'use client';

import { ResumeData } from '@/lib/types';

function formatDate(date: string, current?: boolean): string {
  if (!date) return '';
  if (current) return `${formatDate(date)} - Present`;
  const d = new Date(date);
  if (isNaN(d.getTime())) return date;
  return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
}

export default function ExecutiveTemplate({ data }: { data: ResumeData }) {
  const { personalInfo, education, skills, projects, experience, certifications, achievements } = data;

  // Group skills by category
  const skillsByCategory = skills.reduce<Record<string, typeof skills>>((acc, skill) => {
    const cat = skill.category || 'Other';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(skill);
    return acc;
  }, {});

  return (
    <div
      className="bg-white text-gray-900 shadow-lg mx-auto max-w-[210mm] min-h-[297mm] aspect-[210/297] print:shadow-none print:max-w-none print:min-h-0 print:aspect-auto"
      style={{ fontFamily: "'Helvetica Neue', Arial, sans-serif" }}
    >
      <div className="flex h-full">
        {/* ── Left Sidebar (Navy) ── */}
        <aside
          className="w-[30%] flex-shrink-0 p-6 print:p-4 flex flex-col"
          style={{ backgroundColor: '#1e3a5f' }}
        >
          {/* ── Name & Title at top of sidebar ── */}
          <div className="mb-6 pb-5" style={{ borderBottom: '1px solid rgba(201,168,76,0.4)' }}>
            {personalInfo.fullName && (
              <h1
                className="text-xl font-bold leading-tight tracking-tight"
                style={{
                  fontFamily: 'Georgia, "Times New Roman", serif',
                  color: '#ffffff',
                }}
              >
                {personalInfo.fullName}
              </h1>
            )}
            {personalInfo.jobTitle && (
              <p
                className="text-xs font-medium mt-1 tracking-wide uppercase"
                style={{ color: '#c9a84c' }}
              >
                {personalInfo.jobTitle}
              </p>
            )}
          </div>

          {/* ── Contact Information ── */}
          <section className="mb-6">
            <h2
              className="text-[10px] font-bold uppercase tracking-[0.2em] pb-1.5 mb-3"
              style={{
                fontFamily: 'Georgia, "Times New Roman", serif',
                color: '#c9a84c',
                borderBottom: '1px solid rgba(201,168,76,0.3)',
              }}
            >
              Contact
            </h2>
            <ul className="space-y-2.5">
              {personalInfo.email && (
                <li className="flex items-start gap-2">
                  <span className="mt-0.5 flex-shrink-0" style={{ color: '#c9a84c' }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="4" width="20" height="16" rx="2" />
                      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                    </svg>
                  </span>
                  <span className="text-[11px] break-all" style={{ color: 'rgba(255,255,255,0.85)' }}>
                    {personalInfo.email}
                  </span>
                </li>
              )}
              {personalInfo.phone && (
                <li className="flex items-start gap-2">
                  <span className="mt-0.5 flex-shrink-0" style={{ color: '#c9a84c' }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
                    </svg>
                  </span>
                  <span className="text-[11px]" style={{ color: 'rgba(255,255,255,0.85)' }}>
                    {personalInfo.phone}
                  </span>
                </li>
              )}
              {personalInfo.location && (
                <li className="flex items-start gap-2">
                  <span className="mt-0.5 flex-shrink-0" style={{ color: '#c9a84c' }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                  </span>
                  <span className="text-[11px]" style={{ color: 'rgba(255,255,255,0.85)' }}>
                    {personalInfo.location}
                  </span>
                </li>
              )}
              {personalInfo.website && (
                <li className="flex items-start gap-2">
                  <span className="mt-0.5 flex-shrink-0" style={{ color: '#c9a84c' }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10" />
                      <line x1="2" y1="12" x2="22" y2="12" />
                      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                    </svg>
                  </span>
                  <span className="text-[11px] break-all" style={{ color: 'rgba(255,255,255,0.85)' }}>
                    {personalInfo.website}
                  </span>
                </li>
              )}
              {personalInfo.linkedin && (
                <li className="flex items-start gap-2">
                  <span className="mt-0.5 flex-shrink-0" style={{ color: '#c9a84c' }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                      <rect width="4" height="12" x="2" y="9" />
                      <circle cx="4" cy="4" r="2" />
                    </svg>
                  </span>
                  <span className="text-[11px] break-all" style={{ color: 'rgba(255,255,255,0.85)' }}>
                    {personalInfo.linkedin}
                  </span>
                </li>
              )}
              {personalInfo.github && (
                <li className="flex items-start gap-2">
                  <span className="mt-0.5 flex-shrink-0" style={{ color: '#c9a84c' }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                      <path d="M9 18c-4.51 2-5-2-7-2" />
                    </svg>
                  </span>
                  <span className="text-[11px] break-all" style={{ color: 'rgba(255,255,255,0.85)' }}>
                    {personalInfo.github}
                  </span>
                </li>
              )}
            </ul>
          </section>

          {/* ── Skills ── */}
          {skills.length > 0 && (
            <section className="mb-6">
              <h2
                className="text-[10px] font-bold uppercase tracking-[0.2em] pb-1.5 mb-3"
                style={{
                  fontFamily: 'Georgia, "Times New Roman", serif',
                  color: '#c9a84c',
                  borderBottom: '1px solid rgba(201,168,76,0.3)',
                }}
              >
                Core Competencies
              </h2>
              {Object.entries(skillsByCategory).map(([category, items]) => (
                <div key={category} className="mb-3.5 last:mb-0">
                  <h3
                    className="text-[9px] font-semibold uppercase tracking-[0.15em] mb-2"
                    style={{
                      fontFamily: 'Georgia, "Times New Roman", serif',
                      color: 'rgba(255,255,255,0.6)',
                    }}
                  >
                    {category}
                  </h3>
                  <ul className="space-y-1.5">
                    {items.map((skill) => (
                      <li key={skill.id} className="flex items-center gap-2">
                        {/* Gold diamond bullet */}
                        <span
                          className="w-1.5 h-1.5 flex-shrink-0 rotate-45"
                          style={{ backgroundColor: '#c9a84c', opacity: 0.7 }}
                        />
                        <span className="text-[11px]" style={{ color: 'rgba(255,255,255,0.85)' }}>
                          {skill.name}
                        </span>
                        <span className="text-[9px] ml-auto capitalize" style={{ color: 'rgba(255,255,255,0.45)' }}>
                          {skill.level}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </section>
          )}

          {/* ── Certifications ── */}
          {certifications.length > 0 && (
            <section className="mb-6">
              <h2
                className="text-[10px] font-bold uppercase tracking-[0.2em] pb-1.5 mb-3"
                style={{
                  fontFamily: 'Georgia, "Times New Roman", serif',
                  color: '#c9a84c',
                  borderBottom: '1px solid rgba(201,168,76,0.3)',
                }}
              >
                Certifications
              </h2>
              <ul className="space-y-2.5">
                {certifications.map((cert) => (
                  <li key={cert.id}>
                    <p
                      className="text-[11px] font-semibold leading-tight"
                      style={{ color: '#ffffff' }}
                    >
                      {cert.name}
                    </p>
                    <p className="text-[10px]" style={{ color: 'rgba(255,255,255,0.6)' }}>
                      {cert.issuer}
                    </p>
                    {cert.date && (
                      <p className="text-[9px] mt-0.5" style={{ color: 'rgba(255,255,255,0.4)' }}>
                        {formatDate(cert.date)}
                      </p>
                    )}
                    {cert.credentialId && (
                      <p className="text-[9px]" style={{ color: 'rgba(255,255,255,0.4)' }}>
                        ID: {cert.credentialId}
                      </p>
                    )}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* ── Achievements (sidebar) ── */}
          {achievements.length > 0 && (
            <section className="mt-auto">
              <h2
                className="text-[10px] font-bold uppercase tracking-[0.2em] pb-1.5 mb-3"
                style={{
                  fontFamily: 'Georgia, "Times New Roman", serif',
                  color: '#c9a84c',
                  borderBottom: '1px solid rgba(201,168,76,0.3)',
                }}
              >
                Awards & Honors
              </h2>
              <ul className="space-y-2.5">
                {achievements.map((ach) => (
                  <li key={ach.id}>
                    <div className="flex items-start gap-2">
                      <span
                        className="mt-1 flex-shrink-0"
                        style={{ color: '#c9a84c' }}
                      >
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                        </svg>
                      </span>
                      <div>
                        <p
                          className="text-[11px] font-semibold leading-tight"
                          style={{ color: '#ffffff' }}
                        >
                          {ach.title}
                        </p>
                        {ach.description && (
                          <p className="text-[10px] mt-0.5" style={{ color: 'rgba(255,255,255,0.6)' }}>
                            {ach.description}
                          </p>
                        )}
                        {ach.date && (
                          <p className="text-[9px] mt-0.5" style={{ color: 'rgba(255,255,255,0.4)' }}>
                            {formatDate(ach.date)}
                          </p>
                        )}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </aside>

        {/* ── Main Content Area ── */}
        <main className="w-[70%] p-7 print:p-5 flex-shrink-0 overflow-hidden bg-white">
          {/* ── Gold accent top bar ── */}
          <div className="h-1 mb-6 -mt-7 -mx-7 print:-mt-5 print:-mx-5" style={{ backgroundColor: '#c9a84c' }} />

          {/* ── Executive Summary ── */}
          {personalInfo.summary && (
            <section className="mb-6">
              <div className="flex items-center gap-3 mb-2">
                <h2
                  className="text-xs font-bold uppercase tracking-[0.2em]"
                  style={{
                    fontFamily: 'Georgia, "Times New Roman", serif',
                    color: '#1e3a5f',
                  }}
                >
                  Executive Summary
                </h2>
                <div className="flex-1 h-px" style={{ backgroundColor: '#c9a84c', opacity: 0.5 }} />
              </div>
              <p className="text-[11px] leading-[1.7] text-gray-600">{personalInfo.summary}</p>
            </section>
          )}

          {/* ── Professional Experience ── */}
          {experience.length > 0 && (
            <section className="mb-6">
              <div className="flex items-center gap-3 mb-3">
                <h2
                  className="text-xs font-bold uppercase tracking-[0.2em]"
                  style={{
                    fontFamily: 'Georgia, "Times New Roman", serif',
                    color: '#1e3a5f',
                  }}
                >
                  Professional Experience
                </h2>
                <div className="flex-1 h-px" style={{ backgroundColor: '#c9a84c', opacity: 0.5 }} />
              </div>
              <div className="space-y-4">
                {experience.map((exp) => (
                  <div key={exp.id} className="relative">
                    {/* Left gold accent bar */}
                    <div
                      className="absolute left-0 top-0 bottom-0 w-0.5"
                      style={{ backgroundColor: '#c9a84c', opacity: 0.4 }}
                    />
                    <div className="pl-3">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <h3
                            className="text-[13px] font-bold leading-tight"
                            style={{
                              fontFamily: 'Georgia, "Times New Roman", serif',
                              color: '#1e3a5f',
                            }}
                          >
                            {exp.position}
                          </h3>
                          <p className="text-[11px] font-medium" style={{ color: '#c9a84c' }}>
                            {exp.company}
                            {exp.location && (
                              <span className="text-gray-400 font-normal"> &middot; {exp.location}</span>
                            )}
                          </p>
                        </div>
                        <p className="text-[10px] text-gray-400 whitespace-nowrap flex-shrink-0 pt-0.5 tracking-wide">
                          {formatDate(exp.startDate)} &ndash; {exp.current ? 'Present' : formatDate(exp.endDate)}
                        </p>
                      </div>
                      {exp.description && (
                        <p className="text-[11px] text-gray-600 mt-1.5 leading-[1.65] whitespace-pre-line">
                          {exp.description}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* ── Education ── */}
          {education.length > 0 && (
            <section className="mb-6">
              <div className="flex items-center gap-3 mb-3">
                <h2
                  className="text-xs font-bold uppercase tracking-[0.2em]"
                  style={{
                    fontFamily: 'Georgia, "Times New Roman", serif',
                    color: '#1e3a5f',
                  }}
                >
                  Education
                </h2>
                <div className="flex-1 h-px" style={{ backgroundColor: '#c9a84c', opacity: 0.5 }} />
              </div>
              <div className="space-y-3">
                {education.map((edu) => (
                  <div key={edu.id} className="relative">
                    <div
                      className="absolute left-0 top-0 bottom-0 w-0.5"
                      style={{ backgroundColor: '#c9a84c', opacity: 0.4 }}
                    />
                    <div className="pl-3">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <h3
                            className="text-[13px] font-bold leading-tight"
                            style={{
                              fontFamily: 'Georgia, "Times New Roman", serif',
                              color: '#1e3a5f',
                            }}
                          >
                            {edu.degree}
                          </h3>
                          <p className="text-[11px] text-gray-600">
                            {edu.institution}
                            {edu.location && (
                              <span className="text-gray-400"> &middot; {edu.location}</span>
                            )}
                          </p>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p className="text-[10px] text-gray-400 whitespace-nowrap">
                            {formatDate(edu.startDate)} &ndash; {formatDate(edu.endDate)}
                          </p>
                          {edu.gpa && <p className="text-[10px] text-gray-400">GPA: {edu.gpa}</p>}
                        </div>
                      </div>
                      {edu.description && (
                        <p className="text-[11px] text-gray-600 mt-1 leading-[1.65]">{edu.description}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* ── Projects ── */}
          {projects.length > 0 && (
            <section className="mb-6">
              <div className="flex items-center gap-3 mb-3">
                <h2
                  className="text-xs font-bold uppercase tracking-[0.2em]"
                  style={{
                    fontFamily: 'Georgia, "Times New Roman", serif',
                    color: '#1e3a5f',
                  }}
                >
                  Key Projects
                </h2>
                <div className="flex-1 h-px" style={{ backgroundColor: '#c9a84c', opacity: 0.5 }} />
              </div>
              <div className="space-y-3">
                {projects.map((proj) => (
                  <div key={proj.id} className="relative">
                    <div
                      className="absolute left-0 top-0 bottom-0 w-0.5"
                      style={{ backgroundColor: '#c9a84c', opacity: 0.4 }}
                    />
                    <div className="pl-3">
                      <div className="flex items-baseline justify-between gap-2">
                        <h3
                          className="text-[13px] font-bold leading-tight"
                          style={{
                            fontFamily: 'Georgia, "Times New Roman", serif',
                            color: '#1e3a5f',
                          }}
                        >
                          {proj.name}
                        </h3>
                        <p className="text-[10px] text-gray-400 whitespace-nowrap flex-shrink-0">
                          {formatDate(proj.startDate)}
                          {proj.endDate ? ` – ${formatDate(proj.endDate)}` : ''}
                        </p>
                      </div>
                      {proj.link && (
                        <p className="text-[10px] mt-0.5" style={{ color: '#c9a84c' }}>
                          {proj.link}
                        </p>
                      )}
                      {proj.technologies && (
                        <div className="flex flex-wrap gap-1.5 mt-1.5">
                          {proj.technologies.split(',').map((tech, i) => (
                            <span
                              key={i}
                              className="inline-block text-[9px] px-2 py-0.5 font-medium tracking-wide"
                              style={{
                                backgroundColor: 'rgba(30,58,95,0.06)',
                                color: '#1e3a5f',
                                border: '1px solid rgba(30,58,95,0.12)',
                              }}
                            >
                              {tech.trim()}
                            </span>
                          ))}
                        </div>
                      )}
                      {proj.description && (
                        <p className="text-[11px] text-gray-600 mt-1.5 leading-[1.65]">{proj.description}</p>
                      )}
                      {proj.highlights && (
                        <p className="text-[11px] text-gray-600 mt-1 leading-[1.65]">{proj.highlights}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* ── Achievements (main) — only shown if also in sidebar is empty; otherwise sidebar handles it ── */}
          {achievements.length === 0 && (
            <div />
          )}
        </main>
      </div>
    </div>
  );
}
