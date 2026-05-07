'use client';

import { ResumeData } from '@/lib/types';

function formatDate(date: string, current?: boolean): string {
  if (!date) return '';
  if (current) return `${formatDate(date)} - Present`;
  const d = new Date(date);
  if (isNaN(d.getTime())) return date;
  return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
}

export default function FreelancerTemplate({ data }: { data: ResumeData }) {
  const { personalInfo, education, skills, projects, experience, certifications, achievements } = data;

  // Group skills by category — categories serve as "Services"
  const skillsByCategory = skills.reduce<Record<string, typeof skills>>((acc, skill) => {
    const cat = skill.category || 'Other';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(skill);
    return acc;
  }, {});

  return (
    <div className="bg-white text-gray-900 shadow-lg mx-auto max-w-[210mm] min-h-[297mm] aspect-[210/297] print:shadow-none print:max-w-none print:min-h-0 print:aspect-auto">
      <div className="flex h-full font-sans">
        {/* ── Left Column (40%) ── */}
        <aside className="w-[40%] bg-amber-50 p-6 print:p-4 flex-shrink-0 border-r border-amber-200">
          {/* Contact */}
          <section className="mb-5">
            <h2 className="text-xs font-bold uppercase tracking-widest text-amber-700 border-b-2 border-amber-400 pb-1 mb-3">
              Get in Touch
            </h2>
            <ul className="space-y-2.5 text-xs text-gray-700">
              {personalInfo.email && (
                <li className="flex items-start gap-2 break-all">
                  <span className="mt-0.5 flex-shrink-0 w-4 h-4 rounded-full bg-amber-400 text-amber-900 flex items-center justify-center text-[9px] font-bold">
                    @
                  </span>
                  <span>{personalInfo.email}</span>
                </li>
              )}
              {personalInfo.phone && (
                <li className="flex items-start gap-2">
                  <span className="mt-0.5 flex-shrink-0 w-4 h-4 rounded-full bg-amber-400 text-amber-900 flex items-center justify-center text-[9px] font-bold">
                    ☎
                  </span>
                  <span>{personalInfo.phone}</span>
                </li>
              )}
              {personalInfo.location && (
                <li className="flex items-start gap-2">
                  <span className="mt-0.5 flex-shrink-0 w-4 h-4 rounded-full bg-amber-400 text-amber-900 flex items-center justify-center text-[9px] font-bold">
                    ◎
                  </span>
                  <span>{personalInfo.location}</span>
                </li>
              )}
              {personalInfo.website && (
                <li className="flex items-start gap-2 break-all">
                  <span className="mt-0.5 flex-shrink-0 w-4 h-4 rounded-full bg-amber-400 text-amber-900 flex items-center justify-center text-[9px] font-bold">
                    ⌘
                  </span>
                  <span>{personalInfo.website}</span>
                </li>
              )}
              {personalInfo.linkedin && (
                <li className="flex items-start gap-2 break-all">
                  <span className="mt-0.5 flex-shrink-0 w-4 h-4 rounded-full bg-amber-400 text-amber-900 flex items-center justify-center text-[9px] font-bold">
                    in
                  </span>
                  <span>{personalInfo.linkedin}</span>
                </li>
              )}
              {personalInfo.github && (
                <li className="flex items-start gap-2 break-all">
                  <span className="mt-0.5 flex-shrink-0 w-4 h-4 rounded-full bg-amber-400 text-amber-900 flex items-center justify-center text-[9px] font-bold">
                    ⌥
                  </span>
                  <span>{personalInfo.github}</span>
                </li>
              )}
            </ul>
          </section>

          {/* Skills & Services — Prominent section */}
          {skills.length > 0 && (
            <section className="mb-5">
              <h2 className="text-xs font-bold uppercase tracking-widest text-amber-700 border-b-2 border-amber-400 pb-1 mb-3">
                Skills &amp; Services
              </h2>
              {Object.entries(skillsByCategory).map(([category, items]) => (
                <div key={category} className="mb-3">
                  <h3 className="text-[10px] font-semibold uppercase tracking-wider text-amber-600 mb-1.5 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 inline-block flex-shrink-0" />
                    {category}
                  </h3>
                  <div className="flex flex-wrap gap-1">
                    {items.map((skill) => (
                      <span
                        key={skill.id}
                        className="inline-flex items-center text-[10px] text-gray-700 bg-white border border-amber-300 rounded-full px-2 py-0.5"
                      >
                        {skill.name}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </section>
          )}

          {/* Services Offering — unique to freelancer, derived from skill categories */}
          {skills.length > 0 && Object.keys(skillsByCategory).length > 0 && (
            <section className="mb-5">
              <h2 className="text-xs font-bold uppercase tracking-widest text-amber-700 border-b-2 border-amber-400 pb-1 mb-3">
                What I Offer
              </h2>
              <ul className="space-y-2">
                {Object.entries(skillsByCategory).map(([category, items]) => (
                  <li key={category} className="flex items-start gap-2">
                    <span className="mt-1 flex-shrink-0 w-2 h-2 rounded-full bg-orange-500 inline-block" />
                    <div>
                      <p className="text-xs font-semibold text-gray-800">{category}</p>
                      <p className="text-[10px] text-gray-500 leading-tight">
                        {items.map((s) => s.name).join(' · ')}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Certifications */}
          {certifications.length > 0 && (
            <section className="mb-5">
              <h2 className="text-xs font-bold uppercase tracking-widest text-amber-700 border-b-2 border-amber-400 pb-1 mb-3">
                Credentials
              </h2>
              <ul className="space-y-2.5 text-xs text-gray-700">
                {certifications.map((cert) => (
                  <li key={cert.id} className="bg-white/70 rounded-lg p-2 border border-amber-200">
                    <p className="font-semibold text-gray-900 leading-tight text-[11px]">{cert.name}</p>
                    <p className="text-gray-500 text-[10px]">{cert.issuer}</p>
                    {cert.date && (
                      <p className="text-gray-400 text-[10px]">{formatDate(cert.date)}</p>
                    )}
                    {cert.credentialId && (
                      <p className="text-gray-400 text-[10px]">ID: {cert.credentialId}</p>
                    )}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Availability Badge — creative touch using summary */}
          {personalInfo.summary && (
            <section className="mb-4">
              <div className="bg-gradient-to-r from-amber-400 to-orange-400 rounded-lg p-3 text-center">
                <p className="text-[10px] uppercase tracking-widest text-amber-900 font-bold mb-0.5">
                  Available for Projects
                </p>
                <p className="text-xs text-white font-medium leading-snug line-clamp-3">
                  {personalInfo.summary.length > 120
                    ? personalInfo.summary.slice(0, 120) + '…'
                    : personalInfo.summary}
                </p>
              </div>
            </section>
          )}
        </aside>

        {/* ── Right Column (60%) ── */}
        <main className="w-[60%] p-6 print:p-4 flex-shrink-0 overflow-hidden">
          {/* Header */}
          <header className="mb-5 pb-4 border-b-2 border-amber-400">
            {personalInfo.fullName && (
              <h1 className="text-2xl font-bold text-gray-900 tracking-tight leading-tight">
                {personalInfo.fullName}
              </h1>
            )}
            {personalInfo.jobTitle && (
              <p className="text-sm text-amber-600 font-medium mt-0.5">{personalInfo.jobTitle}</p>
            )}
            {personalInfo.summary && (
              <p className="text-xs leading-relaxed text-gray-600 mt-2">{personalInfo.summary}</p>
            )}
          </header>

          {/* Featured Work — visual cards for projects */}
          {projects.length > 0 && (
            <section className="mb-5">
              <h2 className="text-xs font-bold uppercase tracking-widest text-amber-700 border-b-2 border-amber-400 pb-1 mb-3">
                Featured Work
              </h2>
              <div className="space-y-3">
                {projects.map((proj, idx) => (
                  <div
                    key={proj.id}
                    className="bg-gradient-to-br from-gray-50 to-amber-50/50 border border-amber-200 rounded-lg p-3 relative overflow-hidden"
                  >
                    {/* Decorative accent bar */}
                    <div
                      className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-amber-400 to-orange-500"
                      style={{ opacity: 1 - idx * 0.15 }}
                    />
                    <div className="pl-2">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="text-sm font-bold text-gray-900 leading-tight">
                          {proj.name}
                        </h3>
                        <p className="text-[10px] text-gray-400 whitespace-nowrap flex-shrink-0 mt-0.5">
                          {formatDate(proj.startDate)}
                          {proj.endDate ? ` – ${formatDate(proj.endDate)}` : ''}
                        </p>
                      </div>
                      {proj.description && (
                        <p className="text-xs text-gray-600 mt-1 leading-relaxed">{proj.description}</p>
                      )}
                      {proj.technologies && (
                        <div className="flex flex-wrap gap-1 mt-1.5">
                          {proj.technologies.split(/[,;·]/).map((tech, i) => (
                            <span
                              key={i}
                              className="text-[9px] bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded-full font-medium"
                            >
                              {tech.trim()}
                            </span>
                          ))}
                        </div>
                      )}
                      {proj.highlights && (
                        <p className="text-xs text-gray-500 mt-1 leading-relaxed italic">
                          {proj.highlights}
                        </p>
                      )}
                      {proj.link && (
                        <p className="text-[10px] text-amber-600 mt-1 truncate">{proj.link}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Experience */}
          {experience.length > 0 && (
            <section className="mb-5">
              <h2 className="text-xs font-bold uppercase tracking-widest text-amber-700 border-b-2 border-amber-400 pb-1 mb-3">
                Work History
              </h2>
              <div className="space-y-4">
                {experience.map((exp) => (
                  <div key={exp.id}>
                    <div className="flex items-baseline justify-between gap-2">
                      <div>
                        <h3 className="text-sm font-bold text-gray-900 leading-tight">
                          {exp.position}
                        </h3>
                        <p className="text-xs text-gray-600">
                          {exp.company}
                          {exp.location && (
                            <span className="text-gray-400"> · {exp.location}</span>
                          )}
                        </p>
                      </div>
                      <p className="text-[10px] text-gray-400 whitespace-nowrap flex-shrink-0">
                        {formatDate(exp.startDate)} –{' '}
                        {exp.current ? 'Present' : formatDate(exp.endDate)}
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
            </section>
          )}

          {/* Client Testimonials — using achievements data */}
          {achievements.length > 0 && (
            <section className="mb-5">
              <h2 className="text-xs font-bold uppercase tracking-widest text-amber-700 border-b-2 border-amber-400 pb-1 mb-3">
                Testimonials &amp; Highlights
              </h2>
              <div className="space-y-3">
                {achievements.map((ach, idx) => (
                  <div
                    key={ach.id}
                    className="relative bg-white border border-amber-200 rounded-lg p-3"
                  >
                    {/* Quote mark */}
                    <span className="absolute top-1 left-2 text-2xl text-amber-300 font-serif leading-none select-none">
                      &ldquo;
                    </span>
                    <div className="pl-4">
                      {ach.description && (
                        <p className="text-xs text-gray-600 leading-relaxed italic">
                          {ach.description}
                        </p>
                      )}
                      <div className="flex items-center justify-between mt-1.5">
                        <p className="text-[11px] font-semibold text-gray-800">{ach.title}</p>
                        <div className="flex items-center gap-1.5">
                          {ach.date && (
                            <span className="text-[10px] text-gray-400">
                              {formatDate(ach.date)}
                            </span>
                          )}
                          {ach.category && (
                            <span className="text-[9px] uppercase tracking-wider bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded-full font-medium">
                              {ach.category}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Education */}
          {education.length > 0 && (
            <section className="mb-5">
              <h2 className="text-xs font-bold uppercase tracking-widest text-amber-700 border-b-2 border-amber-400 pb-1 mb-3">
                Education
              </h2>
              <div className="space-y-3">
                {education.map((edu) => (
                  <div key={edu.id}>
                    <div className="flex items-baseline justify-between gap-2">
                      <div>
                        <h3 className="text-sm font-bold text-gray-900 leading-tight">
                          {edu.degree}
                        </h3>
                        <p className="text-xs text-gray-600">
                          {edu.institution}
                          {edu.location && (
                            <span className="text-gray-400"> · {edu.location}</span>
                          )}
                        </p>
                      </div>
                      <p className="text-[10px] text-gray-400 whitespace-nowrap flex-shrink-0">
                        {formatDate(edu.startDate)} – {formatDate(edu.endDate)}
                      </p>
                    </div>
                    {edu.gpa && (
                      <p className="text-[10px] text-gray-500 mt-0.5">GPA: {edu.gpa}</p>
                    )}
                    {edu.description && (
                      <p className="text-xs text-gray-600 mt-0.5 leading-relaxed">
                        {edu.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}
        </main>
      </div>
    </div>
  );
}
