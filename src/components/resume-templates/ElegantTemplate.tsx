'use client';

import { ResumeData } from '@/lib/types';

function formatDate(date: string, current?: boolean): string {
  if (!date) return '';
  if (current) return `${formatDate(date)} - Present`;
  const d = new Date(date);
  if (isNaN(d.getTime())) return date;
  return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
}

export default function ElegantTemplate({ data }: { data: ResumeData }) {
  const { personalInfo, education, skills, projects, experience, certifications, achievements } = data;

  const skillsByCategory = skills.reduce<Record<string, typeof skills>>((acc, skill) => {
    const cat = skill.category || 'Other';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(skill);
    return acc;
  }, {});

  const levelColor: Record<string, string> = {
    beginner: 'bg-rose-50 text-rose-400 border-rose-200',
    intermediate: 'bg-rose-50 text-rose-500 border-rose-200',
    advanced: 'bg-rose-100 text-rose-600 border-rose-300',
    expert: 'bg-rose-200 text-rose-800 border-rose-400',
  };

  return (
    <div className="bg-white text-gray-900 shadow-lg mx-auto max-w-[210mm] min-h-[297mm] aspect-[210/297] print:shadow-none print:max-w-none print:min-h-0 print:aspect-auto">
      {/* ── Decorative Header ── */}
      <header className="relative bg-gradient-to-br from-rose-50 via-white to-amber-50 border-b border-rose-200/60 print:border-rose-200">
        {/* Delicate top accent line */}
        <div className="h-[3px] bg-gradient-to-r from-transparent via-rose-300 to-amber-200" />
        <div className="px-8 pt-8 pb-6 print:px-6 print:pt-6 print:pb-5">
          {personalInfo.fullName && (
            <h1 className="font-[Georgia,serif] text-3xl font-bold tracking-wide text-gray-900 print:text-2xl">
              {personalInfo.fullName}
            </h1>
          )}
          {personalInfo.jobTitle && (
            <p className="font-[Georgia,serif] text-sm text-rose-400 mt-1 tracking-widest uppercase print:text-xs">
              {personalInfo.jobTitle}
            </p>
          )}
          {/* Thin ornamental line */}
          <div className="mt-3 flex items-center gap-2">
            <div className="flex-1 h-[1px] bg-gradient-to-r from-rose-300 to-transparent" />
            <span className="text-rose-300 text-[10px]">&#9670;</span>
            <div className="flex-1 h-[1px] bg-gradient-to-l from-rose-300 to-transparent" />
          </div>
          {/* Summary in header */}
          {personalInfo.summary && (
            <p className="mt-3 text-xs leading-relaxed text-gray-600 max-w-3xl print:text-[11px]">
              {personalInfo.summary}
            </p>
          )}
        </div>
      </header>

      {/* ── Two-Column Body ── */}
      <div className="flex">
        {/* ── Left Sidebar (30%) ── */}
        <aside className="w-[30%] flex-shrink-0 p-6 print:p-4 print:text-[11px]">
          {/* Sidebar border accent */}
          <div className="border-r border-rose-100 pr-5 print:pr-4 h-full space-y-7">

            {/* Contact */}
            {personalInfo.email && (
              <section>
                <h2 className="font-[Georgia,serif] text-[11px] font-bold uppercase tracking-[0.2em] text-rose-400 mb-3 flex items-center gap-2">
                  <span className="h-[1px] w-3 bg-rose-300" />
                  Contact
                </h2>
                <ul className="space-y-2.5 text-xs text-gray-600 print:text-[11px]">
                  {personalInfo.email && (
                    <li className="break-all">
                      <span className="block text-[10px] uppercase tracking-wider text-gray-400 mb-0.5">Email</span>
                      <span className="text-gray-700">{personalInfo.email}</span>
                    </li>
                  )}
                  {personalInfo.phone && (
                    <li>
                      <span className="block text-[10px] uppercase tracking-wider text-gray-400 mb-0.5">Phone</span>
                      <span className="text-gray-700">{personalInfo.phone}</span>
                    </li>
                  )}
                  {personalInfo.location && (
                    <li>
                      <span className="block text-[10px] uppercase tracking-wider text-gray-400 mb-0.5">Location</span>
                      <span className="text-gray-700">{personalInfo.location}</span>
                    </li>
                  )}
                  {personalInfo.website && (
                    <li className="break-all">
                      <span className="block text-[10px] uppercase tracking-wider text-gray-400 mb-0.5">Website</span>
                      <span className="text-gray-700">{personalInfo.website}</span>
                    </li>
                  )}
                  {personalInfo.linkedin && (
                    <li className="break-all">
                      <span className="block text-[10px] uppercase tracking-wider text-gray-400 mb-0.5">LinkedIn</span>
                      <span className="text-gray-700">{personalInfo.linkedin}</span>
                    </li>
                  )}
                  {personalInfo.github && (
                    <li className="break-all">
                      <span className="block text-[10px] uppercase tracking-wider text-gray-400 mb-0.5">GitHub</span>
                      <span className="text-gray-700">{personalInfo.github}</span>
                    </li>
                  )}
                </ul>
              </section>
            )}

            {/* Skills */}
            {skills.length > 0 && (
              <section>
                <h2 className="font-[Georgia,serif] text-[11px] font-bold uppercase tracking-[0.2em] text-rose-400 mb-3 flex items-center gap-2">
                  <span className="h-[1px] w-3 bg-rose-300" />
                  Skills
                </h2>
                {Object.entries(skillsByCategory).map(([category, items]) => (
                  <div key={category} className="mb-4 last:mb-0">
                    <h3 className="font-[Georgia,serif] text-[10px] font-semibold uppercase tracking-wider text-gray-500 mb-2">
                      {category}
                    </h3>
                    <div className="flex flex-wrap gap-1.5">
                      {items.map((skill) => (
                        <span
                          key={skill.id}
                          className={`inline-block text-[10px] px-2.5 py-0.5 rounded-full border font-medium print:text-[9px] ${levelColor[skill.level] || 'bg-rose-50 text-rose-500 border-rose-200'}`}
                        >
                          {skill.name}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </section>
            )}

            {/* Certifications */}
            {certifications.length > 0 && (
              <section>
                <h2 className="font-[Georgia,serif] text-[11px] font-bold uppercase tracking-[0.2em] text-rose-400 mb-3 flex items-center gap-2">
                  <span className="h-[1px] w-3 bg-rose-300" />
                  Certifications
                </h2>
                <ul className="space-y-3">
                  {certifications.map((cert) => (
                    <li key={cert.id} className="relative pl-3 border-l-2 border-rose-200">
                      <p className="font-[Georgia,serif] text-xs font-semibold text-gray-800 leading-tight print:text-[11px]">
                        {cert.name}
                      </p>
                      <p className="text-[10px] text-gray-500 mt-0.5">{cert.issuer}</p>
                      {cert.date && (
                        <p className="text-[10px] text-rose-400 mt-0.5">{formatDate(cert.date)}</p>
                      )}
                      {cert.credentialId && (
                        <p className="text-[9px] text-gray-400 mt-0.5">ID: {cert.credentialId}</p>
                      )}
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* Achievements */}
            {achievements.length > 0 && (
              <section>
                <h2 className="font-[Georgia,serif] text-[11px] font-bold uppercase tracking-[0.2em] text-rose-400 mb-3 flex items-center gap-2">
                  <span className="h-[1px] w-3 bg-rose-300" />
                  Achievements
                </h2>
                <ul className="space-y-2.5">
                  {achievements.map((ach) => (
                    <li key={ach.id} className="relative pl-3 border-l-2 border-amber-200">
                      <p className="font-[Georgia,serif] text-xs font-semibold text-gray-800 leading-tight print:text-[11px]">
                        {ach.title}
                      </p>
                      {ach.description && (
                        <p className="text-[10px] text-gray-500 mt-0.5 leading-relaxed">{ach.description}</p>
                      )}
                      {ach.date && (
                        <p className="text-[10px] text-rose-400 mt-0.5">{formatDate(ach.date)}</p>
                      )}
                      {ach.category && (
                        <span className="inline-block mt-1 text-[9px] uppercase tracking-wider bg-rose-50 text-rose-400 px-2 py-0.5 rounded-full border border-rose-200">
                          {ach.category}
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </div>
        </aside>

        {/* ── Main Content (70%) ── */}
        <main className="w-[70%] flex-shrink-0 p-6 print:p-4 pl-7 print:pl-5 overflow-hidden">
          {/* ── Experience (Timeline) ── */}
          {experience.length > 0 && (
            <section className="mb-7">
              <h2 className="font-[Georgia,serif] text-[11px] font-bold uppercase tracking-[0.2em] text-rose-400 mb-4 flex items-center gap-2">
                <span className="h-[1px] w-3 bg-rose-300" />
                Professional Experience
              </h2>
              <div className="relative pl-6 border-l-2 border-rose-100">
                {experience.map((exp, index) => (
                  <div key={exp.id} className="relative mb-6 last:mb-0">
                    {/* Timeline dot */}
                    <div className="absolute -left-[calc(0.375rem+6px+6px)] top-1 w-2.5 h-2.5 rounded-full border-2 border-rose-300 bg-white" />
                    {/* Connecting line for non-last items */}
                    {index < experience.length - 1 && (
                      <div className="absolute -left-[calc(0.375rem+6px+4px)] top-3.5 w-0.5 h-[calc(100%-4px)] bg-rose-50" />
                    )}
                    <div className="flex items-baseline justify-between gap-2">
                      <div>
                        <h3 className="font-[Georgia,serif] text-sm font-bold text-gray-900 leading-tight print:text-[13px]">
                          {exp.position}
                        </h3>
                        <p className="text-xs text-gray-600 print:text-[11px]">
                          <span className="font-medium">{exp.company}</span>
                          {exp.location && <span className="text-gray-400"> &middot; {exp.location}</span>}
                        </p>
                      </div>
                      <p className="text-[10px] text-rose-400 whitespace-nowrap flex-shrink-0 font-medium print:text-[9px]">
                        {formatDate(exp.startDate, exp.current)}
                        {!exp.current && exp.endDate && ` - ${formatDate(exp.endDate)}`}
                      </p>
                    </div>
                    {exp.description && (
                      <p className="text-xs text-gray-600 mt-1.5 leading-relaxed whitespace-pre-line print:text-[11px]">
                        {exp.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* ── Education (Timeline) ── */}
          {education.length > 0 && (
            <section className="mb-7">
              <h2 className="font-[Georgia,serif] text-[11px] font-bold uppercase tracking-[0.2em] text-rose-400 mb-4 flex items-center gap-2">
                <span className="h-[1px] w-3 bg-rose-300" />
                Education
              </h2>
              <div className="relative pl-6 border-l-2 border-rose-100">
                {education.map((edu, index) => (
                  <div key={edu.id} className="relative mb-5 last:mb-0">
                    {/* Timeline dot */}
                    <div className="absolute -left-[calc(0.375rem+6px+6px)] top-1 w-2.5 h-2.5 rounded-full border-2 border-rose-300 bg-white" />
                    {index < education.length - 1 && (
                      <div className="absolute -left-[calc(0.375rem+6px+4px)] top-3.5 w-0.5 h-[calc(100%-4px)] bg-rose-50" />
                    )}
                    <div className="flex items-baseline justify-between gap-2">
                      <div>
                        <h3 className="font-[Georgia,serif] text-sm font-bold text-gray-900 leading-tight print:text-[13px]">
                          {edu.degree}
                        </h3>
                        <p className="text-xs text-gray-600 print:text-[11px]">
                          <span className="font-medium">{edu.institution}</span>
                          {edu.location && <span className="text-gray-400"> &middot; {edu.location}</span>}
                        </p>
                      </div>
                      <p className="text-[10px] text-rose-400 whitespace-nowrap flex-shrink-0 font-medium print:text-[9px]">
                        {formatDate(edu.startDate)} - {formatDate(edu.endDate)}
                      </p>
                    </div>
                    {edu.gpa && (
                      <p className="text-[10px] text-gray-500 mt-1">
                        GPA: <span className="font-medium">{edu.gpa}</span>
                      </p>
                    )}
                    {edu.description && (
                      <p className="text-xs text-gray-600 mt-1 leading-relaxed print:text-[11px]">{edu.description}</p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* ── Projects ── */}
          {projects.length > 0 && (
            <section className="mb-7">
              <h2 className="font-[Georgia,serif] text-[11px] font-bold uppercase tracking-[0.2em] text-rose-400 mb-4 flex items-center gap-2">
                <span className="h-[1px] w-3 bg-rose-300" />
                Projects
              </h2>
              <div className="relative pl-6 border-l-2 border-rose-100">
                {projects.map((proj, index) => (
                  <div key={proj.id} className="relative mb-5 last:mb-0">
                    <div className="absolute -left-[calc(0.375rem+6px+6px)] top-1 w-2.5 h-2.5 rounded-full border-2 border-amber-200 bg-white" />
                    {index < projects.length - 1 && (
                      <div className="absolute -left-[calc(0.375rem+6px+4px)] top-3.5 w-0.5 h-[calc(100%-4px)] bg-rose-50" />
                    )}
                    <div className="flex items-baseline justify-between gap-2">
                      <h3 className="font-[Georgia,serif] text-sm font-bold text-gray-900 leading-tight print:text-[13px]">
                        {proj.name}
                      </h3>
                      {(proj.startDate || proj.endDate) && (
                        <p className="text-[10px] text-rose-400 whitespace-nowrap flex-shrink-0 font-medium print:text-[9px]">
                          {formatDate(proj.startDate)}{proj.endDate ? ` - ${formatDate(proj.endDate)}` : ''}
                        </p>
                      )}
                    </div>
                    {proj.link && (
                      <p className="text-[10px] text-gray-400 mt-0.5 print:text-[9px]">{proj.link}</p>
                    )}
                    {proj.technologies && (
                      <div className="flex flex-wrap gap-1 mt-1.5">
                        {proj.technologies.split(',').map((tech, i) => (
                          <span
                            key={i}
                            className="text-[9px] px-2 py-0.5 rounded-full bg-amber-50 text-amber-600 border border-amber-200 font-medium"
                          >
                            {tech.trim()}
                          </span>
                        ))}
                      </div>
                    )}
                    {proj.description && (
                      <p className="text-xs text-gray-600 mt-1.5 leading-relaxed print:text-[11px]">{proj.description}</p>
                    )}
                    {proj.highlights && (
                      <p className="text-xs text-gray-600 mt-1 leading-relaxed print:text-[11px]">{proj.highlights}</p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}
        </main>
      </div>

      {/* ── Delicate Bottom Accent ── */}
      <div className="h-[2px] bg-gradient-to-r from-transparent via-rose-300 to-amber-200 print:h-[1px]" />
    </div>
  );
}
