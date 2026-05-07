'use client';

import { ResumeData } from '@/lib/types';

function formatDate(date: string, current?: boolean): string {
  if (!date) return '';
  if (current) return `${formatDate(date)} - Present`;
  const d = new Date(date);
  if (isNaN(d.getTime())) return date;
  return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
}

export default function CorporateTemplate({ data }: { data: ResumeData }) {
  const { personalInfo, education, skills, projects, experience, certifications, achievements } = data;

  // Group skills by category
  const skillsByCategory = skills.reduce<Record<string, typeof skills>>((acc, skill) => {
    const cat = skill.category || 'Other';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(skill);
    return acc;
  }, {});

  const accentColor = '#3b6b96'; // steel blue
  const darkColor = '#2d2d2d'; // charcoal
  const midGray = '#555555';
  const lightGray = '#888888';
  const borderGray = '#d4d4d4';
  const bgLight = '#f7f8fa';

  return (
    <div
      className="bg-white text-gray-900 shadow-lg mx-auto max-w-[210mm] min-h-[297mm] aspect-[210/297] print:shadow-none print:max-w-none print:min-h-0 print:aspect-auto"
      style={{ fontFamily: "'Helvetica Neue', Arial, sans-serif" }}
    >
      {/* ═══════════════════════════════════════════════════════════
          HEADER BAR
          ═══════════════════════════════════════════════════════════ */}
      <header
        className="px-8 py-5 print:px-6 print:py-4"
        style={{ backgroundColor: darkColor }}
      >
        <div className="flex items-center justify-between gap-4 flex-wrap">
          {/* Name & Title */}
          <div className="min-w-0">
            {personalInfo.fullName && (
              <h1
                className="text-xl font-bold tracking-tight leading-tight"
                style={{ color: '#ffffff' }}
              >
                {personalInfo.fullName}
              </h1>
            )}
            {personalInfo.jobTitle && (
              <p
                className="text-xs font-medium mt-0.5 tracking-wide uppercase"
                style={{ color: accentColor }}
              >
                {personalInfo.jobTitle}
              </p>
            )}
          </div>

          {/* Contact Info — horizontal line */}
          <nav className="flex items-center gap-5 flex-wrap text-[11px]" style={{ color: 'rgba(255,255,255,0.75)' }}>
            {personalInfo.email && (
              <span className="flex items-center gap-1.5 whitespace-nowrap">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="4" width="20" height="16" rx="2" />
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                </svg>
                {personalInfo.email}
              </span>
            )}
            {personalInfo.phone && (
              <span className="flex items-center gap-1.5 whitespace-nowrap">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
                {personalInfo.phone}
              </span>
            )}
            {personalInfo.location && (
              <span className="flex items-center gap-1.5 whitespace-nowrap">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                {personalInfo.location}
              </span>
            )}
            {personalInfo.website && (
              <span className="flex items-center gap-1.5 whitespace-nowrap">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="2" y1="12" x2="22" y2="12" />
                  <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                </svg>
                {personalInfo.website}
              </span>
            )}
            {personalInfo.linkedin && (
              <span className="flex items-center gap-1.5 whitespace-nowrap">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                  <rect width="4" height="12" x="2" y="9" />
                  <circle cx="4" cy="4" r="2" />
                </svg>
                {personalInfo.linkedin}
              </span>
            )}
            {personalInfo.github && (
              <span className="flex items-center gap-1.5 whitespace-nowrap">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                  <path d="M9 18c-4.51 2-5-2-7-2" />
                </svg>
                {personalInfo.github}
              </span>
            )}
          </nav>
        </div>
      </header>

      {/* ═══════════════════════════════════════════════════════════
          SINGLE-COLUMN BODY
          ═══════════════════════════════════════════════════════════ */}
      <main className="px-8 py-6 print:px-6 print:py-4">

        {/* ── Professional Summary ── */}
        {personalInfo.summary && (
          <section className="mb-5">
            <SectionHeading title="Professional Summary" accentColor={accentColor} darkColor={darkColor} />
            <p className="text-[11px] leading-[1.75]" style={{ color: midGray }}>
              {personalInfo.summary}
            </p>
          </section>
        )}

        {/* ── Professional Experience ── */}
        {experience.length > 0 && (
          <section className="mb-5">
            <SectionHeading title="Professional Experience" accentColor={accentColor} darkColor={darkColor} />
            <div className="space-y-4">
              {experience.map((exp) => (
                <div key={exp.id}>
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <h3 className="text-[13px] font-bold leading-tight" style={{ color: darkColor }}>
                        {exp.position}
                      </h3>
                      <p className="text-[11px] font-medium" style={{ color: accentColor }}>
                        {exp.company}
                        {exp.location && (
                          <span style={{ color: lightGray }}> &middot; {exp.location}</span>
                        )}
                      </p>
                    </div>
                    <p className="text-[10px] whitespace-nowrap flex-shrink-0 pt-0.5 tracking-wide" style={{ color: lightGray }}>
                      {formatDate(exp.startDate, exp.current) || formatDate(exp.startDate)}
                    </p>
                  </div>
                  {exp.description && (
                    <p className="text-[11px] mt-1.5 leading-[1.65] whitespace-pre-line" style={{ color: midGray }}>
                      {exp.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── Key Achievements ── */}
        {achievements.length > 0 && (
          <section className="mb-5">
            <SectionHeading title="Key Achievements" accentColor={accentColor} darkColor={darkColor} />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {achievements.map((ach) => (
                <div
                  key={ach.id}
                  className="flex items-start gap-3 p-3 rounded"
                  style={{ backgroundColor: bgLight, borderLeft: `3px solid ${accentColor}` }}
                >
                  {/* Metric / Number Highlight */}
                  <span
                    className="flex-shrink-0 w-9 h-9 rounded flex items-center justify-center text-[11px] font-bold"
                    style={{ backgroundColor: accentColor, color: '#ffffff' }}
                  >
                    {extractMetric(ach.title)}
                  </span>
                  <div className="min-w-0">
                    <p className="text-[11px] font-semibold leading-tight" style={{ color: darkColor }}>
                      {ach.title}
                    </p>
                    {ach.description && (
                      <p className="text-[10px] mt-0.5 leading-[1.6]" style={{ color: lightGray }}>
                        {ach.description}
                      </p>
                    )}
                    {(ach.date || ach.category) && (
                      <div className="flex items-center gap-2 mt-1">
                        {ach.category && (
                          <span className="text-[9px] font-medium uppercase tracking-wide px-1.5 py-0.5 rounded" style={{ backgroundColor: 'rgba(59,107,150,0.1)', color: accentColor }}>
                            {ach.category}
                          </span>
                        )}
                        {ach.date && (
                          <span className="text-[9px]" style={{ color: lightGray }}>
                            {formatDate(ach.date)}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── Education ── */}
        {education.length > 0 && (
          <section className="mb-5">
            <SectionHeading title="Education" accentColor={accentColor} darkColor={darkColor} />
            <div className="space-y-3">
              {education.map((edu) => (
                <div key={edu.id}>
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <h3 className="text-[13px] font-bold leading-tight" style={{ color: darkColor }}>
                        {edu.degree}
                      </h3>
                      <p className="text-[11px]" style={{ color: midGray }}>
                        {edu.institution}
                        {edu.location && (
                          <span style={{ color: lightGray }}> &middot; {edu.location}</span>
                        )}
                      </p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-[10px] whitespace-nowrap" style={{ color: lightGray }}>
                        {formatDate(edu.startDate)} – {formatDate(edu.endDate)}
                      </p>
                      {edu.gpa && (
                        <p className="text-[10px] font-medium" style={{ color: accentColor }}>
                          GPA: {edu.gpa}
                        </p>
                      )}
                    </div>
                  </div>
                  {edu.description && (
                    <p className="text-[11px] mt-1 leading-[1.65]" style={{ color: midGray }}>
                      {edu.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── Skills ── */}
        {skills.length > 0 && (
          <section className="mb-5">
            <SectionHeading title="Core Competencies" accentColor={accentColor} darkColor={darkColor} />
            <div className="space-y-3">
              {Object.entries(skillsByCategory).map(([category, items]) => (
                <div key={category}>
                  <h4
                    className="text-[10px] font-semibold uppercase tracking-[0.12em] mb-1.5"
                    style={{ color: accentColor }}
                  >
                    {category}
                  </h4>
                  <div className="flex flex-wrap gap-x-5 gap-y-1.5">
                    {items.map((skill) => (
                      <span key={skill.id} className="flex items-center gap-1.5">
                        <span
                          className="w-1 h-1 rounded-full flex-shrink-0"
                          style={{ backgroundColor: accentColor }}
                        />
                        <span className="text-[11px]" style={{ color: midGray }}>
                          {skill.name}
                        </span>
                        {/* Skill level indicator dots */}
                        <span className="flex items-center gap-0.5 ml-0.5">
                          {(['beginner', 'intermediate', 'advanced', 'expert'] as const).map((lvl) => (
                            <span
                              key={lvl}
                              className="inline-block w-1.5 h-1.5 rounded-sm"
                              style={{
                                backgroundColor:
                                  ['beginner', 'intermediate', 'advanced', 'expert'].indexOf(skill.level) >=
                                  ['beginner', 'intermediate', 'advanced', 'expert'].indexOf(lvl)
                                    ? accentColor
                                    : borderGray,
                              }}
                            />
                          ))}
                        </span>
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── Projects ── */}
        {projects.length > 0 && (
          <section className="mb-5">
            <SectionHeading title="Notable Projects" accentColor={accentColor} darkColor={darkColor} />
            <div className="space-y-3">
              {projects.map((proj) => (
                <div key={proj.id}>
                  <div className="flex items-baseline justify-between gap-3">
                    <h3 className="text-[13px] font-bold leading-tight" style={{ color: darkColor }}>
                      {proj.name}
                    </h3>
                    <p className="text-[10px] whitespace-nowrap flex-shrink-0" style={{ color: lightGray }}>
                      {formatDate(proj.startDate)}
                      {proj.endDate ? ` – ${formatDate(proj.endDate)}` : ''}
                    </p>
                  </div>
                  {proj.link && (
                    <p className="text-[10px] mt-0.5" style={{ color: accentColor }}>
                      {proj.link}
                    </p>
                  )}
                  {proj.technologies && (
                    <div className="flex flex-wrap gap-1.5 mt-1.5">
                      {proj.technologies.split(',').map((tech, i) => (
                        <span
                          key={i}
                          className="inline-block text-[9px] px-2 py-0.5 font-medium tracking-wide rounded-sm"
                          style={{
                            backgroundColor: bgLight,
                            color: midGray,
                            border: `1px solid ${borderGray}`,
                          }}
                        >
                          {tech.trim()}
                        </span>
                      ))}
                    </div>
                  )}
                  {proj.description && (
                    <p className="text-[11px] mt-1.5 leading-[1.65]" style={{ color: midGray }}>
                      {proj.description}
                    </p>
                  )}
                  {proj.highlights && (
                    <p className="text-[11px] mt-1 leading-[1.65]" style={{ color: midGray }}>
                      {proj.highlights}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── Certifications ── */}
        {certifications.length > 0 && (
          <section>
            <SectionHeading title="Certifications" accentColor={accentColor} darkColor={darkColor} />
            <div className="space-y-2.5">
              {certifications.map((cert) => (
                <div key={cert.id} className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className="text-[11px] font-semibold leading-tight" style={{ color: darkColor }}>
                      {cert.name}
                    </p>
                    <p className="text-[10px]" style={{ color: midGray }}>
                      {cert.issuer}
                      {cert.credentialId && (
                        <span style={{ color: lightGray }}> &middot; ID: {cert.credentialId}</span>
                      )}
                    </p>
                  </div>
                  {cert.date && (
                    <p className="text-[10px] whitespace-nowrap flex-shrink-0" style={{ color: lightGray }}>
                      {formatDate(cert.date)}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

      </main>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────────
   Reusable Section Heading — uppercase label + thin horizontal rule
   ────────────────────────────────────────────────────────────────── */
function SectionHeading({ title, accentColor, darkColor }: { title: string; accentColor: string; darkColor: string }) {
  return (
    <div className="flex items-center gap-3 mb-3">
      <h2
        className="text-[11px] font-bold uppercase tracking-[0.18em] flex-shrink-0"
        style={{ color: darkColor }}
      >
        {title}
      </h2>
      <div className="flex-1 h-px" style={{ backgroundColor: accentColor, opacity: 0.3 }} />
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────────
   Helper: extract a leading number/percentage from an achievement
   title to display as a highlighted metric badge
   ────────────────────────────────────────────────────────────────── */
function extractMetric(title: string): string {
  const match = title.match(/(\d+%|\$[\d,.]+|\d+[\d,.]*\s*(?:x|X|%|K|M|B|million|billion|thousand|users|clients|projects|teams|revenue|growth|increase|decrease|reduction|improvement))/i);
  if (match) return match[0];
  // Fallback: first 2–3 chars
  return title.slice(0, 3).toUpperCase();
}
