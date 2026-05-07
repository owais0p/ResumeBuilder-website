'use client';

import { ResumeData } from '@/lib/types';

function formatDate(date: string, current?: boolean): string {
  if (!date) return '';
  if (current) return `${formatDate(date)} - Present`;
  const d = new Date(date);
  if (isNaN(d.getTime())) return date;
  return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
}

export default function AcademicTemplate({ data }: { data: ResumeData }) {
  const { personalInfo, education, skills, projects, experience, certifications, achievements } = data;

  // Group skills by category for Research Interests
  const skillsByCategory = skills.reduce<Record<string, typeof skills>>((acc, skill) => {
    const cat = skill.category || 'Other';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(skill);
    return acc;
  }, {});

  return (
    <div
      className="bg-white text-gray-900 shadow-lg mx-auto max-w-[210mm] min-h-[297mm] aspect-[210/297] print:shadow-none print:max-w-none print:min-h-0 print:aspect-auto"
      style={{ fontFamily: "'Times New Roman', 'Georgia', 'Palatino Linotype', serif" }}
    >
      <div className="p-10 print:p-6">
        {/* ── Header ── */}
        <header className="text-center mb-6">
          {personalInfo.fullName && (
            <h1 className="text-[22px] font-bold tracking-wide text-[#6B1D2A] leading-tight">
              {personalInfo.fullName}
            </h1>
          )}
          {personalInfo.jobTitle && (
            <p className="text-sm text-gray-600 mt-1 italic">
              {personalInfo.jobTitle}
            </p>
          )}
          {(personalInfo.email || personalInfo.phone || personalInfo.location || personalInfo.website) && (
            <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-0.5 mt-3 text-[11px] text-gray-500">
              {personalInfo.email && <span>{personalInfo.email}</span>}
              {personalInfo.email && personalInfo.phone && <span className="text-gray-300">|</span>}
              {personalInfo.phone && <span>{personalInfo.phone}</span>}
              {personalInfo.phone && personalInfo.location && <span className="text-gray-300">|</span>}
              {personalInfo.location && <span>{personalInfo.location}</span>}
              {personalInfo.location && personalInfo.website && <span className="text-gray-300">|</span>}
              {personalInfo.website && <span className="break-all">{personalInfo.website}</span>}
            </div>
          )}
          {(personalInfo.linkedin || personalInfo.github) && (
            <div className="flex flex-wrap items-center justify-center gap-x-3 mt-1 text-[11px] text-gray-500">
              {personalInfo.linkedin && <span className="break-all">{personalInfo.linkedin}</span>}
              {personalInfo.linkedin && personalInfo.github && <span className="text-gray-300">|</span>}
              {personalInfo.github && <span className="break-all">{personalInfo.github}</span>}
            </div>
          )}
        </header>

        <hr className="border-[#6B1D2A] mb-5" />

        {/* ── Summary ── */}
        {personalInfo.summary && (
          <>
            <section className="mb-5">
              <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-[#6B1D2A] mb-2">
                Research Summary
              </h2>
              <p className="text-[12px] leading-relaxed text-gray-700 text-justify">
                {personalInfo.summary}
              </p>
            </section>
            <hr className="border-gray-200 mb-5" />
          </>
        )}

        {/* ── Education ── */}
        {education.length > 0 && (
          <>
            <section className="mb-5">
              <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-[#6B1D2A] mb-3">
                Education
              </h2>
              <div className="space-y-4">
                {education.map((edu) => (
                  <div key={edu.id}>
                    <div className="flex items-baseline justify-between gap-2">
                      <div className="min-w-0">
                        <h3 className="text-[13px] font-bold text-gray-900 leading-tight">
                          {edu.degree}
                        </h3>
                        <p className="text-[12px] text-gray-600">
                          {edu.institution}
                          {edu.location && (
                            <span className="text-gray-400">, {edu.location}</span>
                          )}
                        </p>
                      </div>
                      <p className="text-[11px] text-gray-500 whitespace-nowrap flex-shrink-0 italic">
                        {formatDate(edu.startDate)} – {formatDate(edu.endDate)}
                      </p>
                    </div>
                    {edu.gpa && (
                      <p className="text-[11px] text-gray-500 mt-0.5">
                        GPA: {edu.gpa}
                      </p>
                    )}
                    {edu.description && (
                      <p className="text-[11px] text-gray-600 mt-1 leading-relaxed">
                        {edu.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </section>
            <hr className="border-gray-200 mb-5" />
          </>
        )}

        {/* ── Research Interests (Skills as tags) ── */}
        {skills.length > 0 && (
          <>
            <section className="mb-5">
              <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-[#6B1D2A] mb-3">
                Research Interests
              </h2>
              {Object.entries(skillsByCategory).map(([category, items]) => (
                <div key={category} className="mb-2">
                  <h3 className="text-[11px] font-semibold text-gray-600 mb-1.5">
                    {category}
                  </h3>
                  <div className="flex flex-wrap gap-1.5">
                    {items.map((skill) => (
                      <span
                        key={skill.id}
                        className="inline-block text-[10px] px-2 py-0.5 rounded-sm border border-[#6B1D2A]/30 text-[#6B1D2A] bg-[#6B1D2A]/5"
                      >
                        {skill.name}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </section>
            <hr className="border-gray-200 mb-5" />
          </>
        )}

        {/* ── Publications (Projects) ── */}
        {projects.length > 0 && (
          <>
            <section className="mb-5">
              <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-[#6B1D2A] mb-3">
                Selected Publications
              </h2>
              <div className="space-y-4">
                {projects.map((proj, idx) => (
                  <div key={proj.id}>
                    <div className="flex items-baseline gap-2">
                      <span className="text-[11px] text-gray-400 font-normal flex-shrink-0">
                        [{idx + 1}]
                      </span>
                      <div className="min-w-0">
                        <h3 className="text-[12px] font-bold text-gray-900 leading-tight">
                          {proj.name}
                        </h3>
                        {proj.description && (
                          <p className="text-[11px] text-gray-600 mt-0.5 leading-relaxed">
                            {proj.description}
                          </p>
                        )}
                        {proj.technologies && (
                          <p className="text-[11px] text-gray-500 mt-0.5 italic">
                            {proj.technologies}
                          </p>
                        )}
                        {proj.highlights && (
                          <p className="text-[11px] text-gray-600 mt-0.5 leading-relaxed">
                            {proj.highlights}
                          </p>
                        )}
                        {proj.link && (
                          <p className="text-[10px] text-[#6B1D2A] mt-0.5 break-all">
                            {proj.link}
                          </p>
                        )}
                        {(proj.startDate || proj.endDate) && (
                          <p className="text-[10px] text-gray-400 mt-0.5 italic">
                            {formatDate(proj.startDate)}
                            {proj.endDate ? ` – ${formatDate(proj.endDate)}` : ''}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
            <hr className="border-gray-200 mb-5" />
          </>
        )}

        {/* ── Experience ── */}
        {experience.length > 0 && (
          <>
            <section className="mb-5">
              <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-[#6B1D2A] mb-3">
                Academic &amp; Professional Experience
              </h2>
              <div className="space-y-4">
                {experience.map((exp) => (
                  <div key={exp.id}>
                    <div className="flex items-baseline justify-between gap-2">
                      <div className="min-w-0">
                        <h3 className="text-[13px] font-bold text-gray-900 leading-tight">
                          {exp.position}
                        </h3>
                        <p className="text-[12px] text-gray-600">
                          {exp.company}
                          {exp.location && (
                            <span className="text-gray-400">, {exp.location}</span>
                          )}
                        </p>
                      </div>
                      <p className="text-[11px] text-gray-500 whitespace-nowrap flex-shrink-0 italic">
                        {formatDate(exp.startDate)} – {exp.current ? 'Present' : formatDate(exp.endDate)}
                      </p>
                    </div>
                    {exp.description && (
                      <p className="text-[11px] text-gray-600 mt-1 leading-relaxed whitespace-pre-line">
                        {exp.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </section>
            <hr className="border-gray-200 mb-5" />
          </>
        )}

        {/* ── Certifications ── */}
        {certifications.length > 0 && (
          <>
            <section className="mb-5">
              <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-[#6B1D2A] mb-3">
                Certifications &amp; Licenses
              </h2>
              <ul className="space-y-3">
                {certifications.map((cert) => (
                  <li key={cert.id}>
                    <p className="text-[12px] font-bold text-gray-900 leading-tight">
                      {cert.name}
                    </p>
                    <p className="text-[11px] text-gray-600">
                      {cert.issuer}
                      {cert.date && (
                        <span className="text-gray-400"> ({formatDate(cert.date)})</span>
                      )}
                    </p>
                    {cert.credentialId && (
                      <p className="text-[10px] text-gray-500">Credential ID: {cert.credentialId}</p>
                    )}
                  </li>
                ))}
              </ul>
            </section>
            <hr className="border-gray-200 mb-5" />
          </>
        )}

        {/* ── Achievements / Honors ── */}
        {achievements.length > 0 && (
          <section className="mb-2">
            <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-[#6B1D2A] mb-3">
              Honors &amp; Awards
            </h2>
            <ul className="space-y-3">
              {achievements.map((ach) => (
                <li key={ach.id}>
                  <div className="flex items-baseline gap-2">
                    <p className="text-[12px] font-bold text-gray-900 leading-tight">
                      {ach.title}
                    </p>
                    {ach.date && (
                      <p className="text-[10px] text-gray-400 whitespace-nowrap flex-shrink-0 italic">
                        {formatDate(ach.date)}
                      </p>
                    )}
                  </div>
                  {ach.description && (
                    <p className="text-[11px] text-gray-600 mt-0.5">{ach.description}</p>
                  )}
                  {ach.category && (
                    <span className="inline-block mt-0.5 text-[9px] uppercase tracking-wider text-[#6B1D2A] border border-[#6B1D2A]/30 px-1.5 py-0.5 rounded-sm bg-[#6B1D2A]/5">
                      {ach.category}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </div>
  );
}
