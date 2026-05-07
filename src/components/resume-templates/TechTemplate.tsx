'use client';

import { ResumeData } from '@/lib/types';

function formatDate(date: string, current?: boolean): string {
  if (!date) return '';
  if (current) return `${formatDate(date)} - Present`;
  const d = new Date(date);
  if (isNaN(d.getTime())) return date;
  return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
}

const SKILL_LEVEL_COLORS: Record<string, string> = {
  beginner: 'text-gray-500',
  intermediate: 'text-blue-400',
  advanced: 'text-[#3fb950]',
  expert: 'text-[#f0883e]',
};

const SKILL_LEVEL_BG: Record<string, string> = {
  beginner: 'bg-gray-800/60 border-gray-700',
  intermediate: 'bg-blue-950/40 border-blue-800/50',
  advanced: 'bg-green-950/40 border-green-800/50',
  expert: 'bg-orange-950/40 border-orange-800/50',
};

export default function TechTemplate({ data }: { data: ResumeData }) {
  const { personalInfo, education, skills, projects, experience, certifications, achievements } = data;

  // Group skills by category
  const skillsByCategory = skills.reduce<Record<string, typeof skills>>((acc, skill) => {
    const cat = skill.category || 'Other';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(skill);
    return acc;
  }, {});

  return (
    <div className="bg-[#0d1117] text-gray-300 shadow-lg mx-auto max-w-[210mm] min-h-[297mm] aspect-[210/297] print:shadow-none print:max-w-none print:min-h-0 print:aspect-auto font-mono">
      <div className="flex h-full">
        {/* ── Left Sidebar ── */}
        <aside className="w-[30%] bg-[#161b22] p-5 print:p-3 flex-shrink-0 border-r border-gray-800 overflow-hidden">
          {/* Profile / Identity */}
          <section className="mb-5">
            {personalInfo.fullName && (
              <>
                <div className="mb-1">
                  <span className="text-[#3fb950]">$</span>{' '}
                  <span className="text-[#79c0ff]">whoami</span>
                </div>
                <p className="text-base font-bold text-gray-100 leading-tight pl-4">
                  <span className="text-[#3fb950]">&gt;</span> {personalInfo.fullName.toLowerCase().replace(/\s+/g, '_')}
                </p>
              </>
            )}
            {personalInfo.jobTitle && (
              <p className="text-[11px] text-gray-500 mt-1.5 pl-4">{'// '}{personalInfo.jobTitle}</p>
            )}
          </section>

          <hr className="border-gray-800 mb-4" />

          {/* Contact */}
          <section className="mb-5">
            <h2 className="text-[11px] font-semibold text-[#8b949e] mb-2.5">
              <span className="text-[#3fb950]">{'// '}</span>CONTACT
            </h2>
            <ul className="space-y-2 text-[11px]">
              {personalInfo.email && (
                <li className="flex items-start gap-1.5 break-all">
                  <span className="text-[#3fb950] flex-shrink-0 mt-px">{'>'}</span>
                  <span className="text-gray-400">{'email:'}</span>{' '}
                  <span className="text-[#79c0ff]">{personalInfo.email}</span>
                </li>
              )}
              {personalInfo.phone && (
                <li className="flex items-start gap-1.5">
                  <span className="text-[#3fb950] flex-shrink-0 mt-px">{'>'}</span>
                  <span className="text-gray-400">{'phone:'}</span>{' '}
                  <span className="text-[#79c0ff]">{personalInfo.phone}</span>
                </li>
              )}
              {personalInfo.location && (
                <li className="flex items-start gap-1.5">
                  <span className="text-[#3fb950] flex-shrink-0 mt-px">{'>'}</span>
                  <span className="text-gray-400">{'location:'}</span>{' '}
                  <span className="text-[#79c0ff]">{personalInfo.location}</span>
                </li>
              )}
              {personalInfo.website && (
                <li className="flex items-start gap-1.5 break-all">
                  <span className="text-[#3fb950] flex-shrink-0 mt-px">{'>'}</span>
                  <span className="text-gray-400">{'web:'}</span>{' '}
                  <span className="text-[#3fb950]">{personalInfo.website}</span>
                </li>
              )}
              {personalInfo.linkedin && (
                <li className="flex items-start gap-1.5 break-all">
                  <span className="text-[#3fb950] flex-shrink-0 mt-px">{'>'}</span>
                  <span className="text-gray-400">{'linkedin:'}</span>{' '}
                  <span className="text-[#3fb950]">{personalInfo.linkedin}</span>
                </li>
              )}
              {personalInfo.github && (
                <li className="flex items-start gap-1.5 break-all">
                  <span className="text-[#3fb950] flex-shrink-0 mt-px">{'>'}</span>
                  <span className="text-gray-400">{'github:'}</span>{' '}
                  <span className="text-[#3fb950]">{personalInfo.github}</span>
                </li>
              )}
            </ul>
          </section>

          <hr className="border-gray-800 mb-4" />

          {/* Skills */}
          {skills.length > 0 && (
            <section className="mb-5">
              <h2 className="text-[11px] font-semibold text-[#8b949e] mb-2.5">
                <span className="text-[#3fb950]">{'// '}</span>SKILLS
              </h2>
              {Object.entries(skillsByCategory).map(([category, items]) => (
                <div key={category} className="mb-3">
                  <p className="text-[10px] text-gray-600 mb-1.5">
                    {/* category as a type definition */}
                    <span className="text-[#ff7b72]">type</span>{' '}
                    <span className="text-[#ffa657]">{category.replace(/\s+/g, '')}</span>{' '}
                    <span className="text-gray-600">{'= {'}</span>
                  </p>
                  <div className="flex flex-wrap gap-1 pl-2">
                    {items.map((skill) => (
                      <span
                        key={skill.id}
                        className={`inline-block text-[10px] px-1.5 py-0.5 rounded border ${SKILL_LEVEL_BG[skill.level] || SKILL_LEVEL_BG.beginner} ${SKILL_LEVEL_COLORS[skill.level] || SKILL_LEVEL_COLORS.beginner}`}
                      >
                        {skill.name}
                      </span>
                    ))}
                  </div>
                  <p className="text-[10px] text-gray-600 mt-0.5">{'}'}</p>
                </div>
              ))}
            </section>
          )}

          <hr className="border-gray-800 mb-4" />

          {/* Education */}
          {education.length > 0 && (
            <section className="mb-5">
              <h2 className="text-[11px] font-semibold text-[#8b949e] mb-2.5">
                <span className="text-[#3fb950]">{'// '}</span>EDUCATION
              </h2>
              <ul className="space-y-2.5">
                {education.map((edu) => (
                  <li key={edu.id}>
                    <p className="text-[11px] font-semibold text-gray-200 leading-tight">{edu.degree}</p>
                    <p className="text-[10px] text-gray-400 mt-0.5">{edu.institution}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      {(edu.startDate || edu.endDate) && (
                        <p className="text-[10px] text-gray-600">
                          {formatDate(edu.startDate)}{edu.endDate ? ` - ${formatDate(edu.endDate)}` : ''}
                        </p>
                      )}
                      {edu.gpa && (
                        <p className="text-[10px] text-gray-600">GPA: {edu.gpa}</p>
                      )}
                    </div>
                    {edu.description && (
                      <p className="text-[10px] text-gray-500 mt-0.5 leading-relaxed">{edu.description}</p>
                    )}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Certifications */}
          {certifications.length > 0 && (
            <section className="mb-5">
              <h2 className="text-[11px] font-semibold text-[#8b949e] mb-2.5">
                <span className="text-[#3fb950]">{'// '}</span>CERTIFICATIONS
              </h2>
              <ul className="space-y-2">
                {certifications.map((cert) => (
                  <li key={cert.id} className="bg-[#0d1117]/60 rounded px-2 py-1.5 border border-gray-800">
                    <p className="text-[11px] font-semibold text-gray-200 leading-tight">{cert.name}</p>
                    <p className="text-[10px] text-gray-500">{cert.issuer}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      {cert.date && (
                        <p className="text-[9px] text-gray-600">{formatDate(cert.date)}</p>
                      )}
                      {cert.credentialId && (
                        <p className="text-[9px] text-gray-600">ID: {cert.credentialId}</p>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Achievements */}
          {achievements.length > 0 && (
            <section className="mb-5">
              <h2 className="text-[11px] font-semibold text-[#8b949e] mb-2.5">
                <span className="text-[#3fb950]">{'// '}</span>ACHIEVEMENTS
              </h2>
              <ul className="space-y-2">
                {achievements.map((ach) => (
                  <li key={ach.id}>
                    <p className="text-[11px] font-semibold text-gray-200 leading-tight">{ach.title}</p>
                    {ach.description && (
                      <p className="text-[10px] text-gray-500 mt-0.5">{ach.description}</p>
                    )}
                    <div className="flex items-center gap-2 mt-0.5">
                      {ach.date && (
                        <p className="text-[9px] text-gray-600">{formatDate(ach.date)}</p>
                      )}
                      {ach.category && (
                        <span className="text-[9px] text-[#ffa657] uppercase tracking-wider">{ach.category}</span>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </aside>

        {/* ── Main Content ── */}
        <main className="w-[70%] p-5 print:p-3 flex-shrink-0 overflow-hidden">
          {/* Summary */}
          {personalInfo.summary && (
            <section className="mb-5">
              <h2 className="text-[11px] font-semibold text-[#8b949e] mb-2">
                <span className="text-[#3fb950]">{'// '}</span>ABOUT_ME
              </h2>
              <div className="bg-[#161b22] rounded border border-gray-800 p-3">
                <p className="text-[10px] text-gray-600 mb-1">
                  <span className="text-[#8b949e]">{'/**'}</span>
                </p>
                <p className="text-[11px] text-gray-400 leading-relaxed pl-2">
                  {personalInfo.summary}
                </p>
                <p className="text-[10px] text-gray-600 mt-1">
                  <span className="text-[#8b949e]">{'*/'}</span>
                </p>
              </div>
            </section>
          )}

          <hr className="border-gray-800 mb-4" />

          {/* Experience */}
          {experience.length > 0 && (
            <section className="mb-5">
              <h2 className="text-[11px] font-semibold text-[#8b949e] mb-2.5">
                <span className="text-[#3fb950]">{'// '}</span>EXPERIENCE
              </h2>
              <div className="space-y-3">
                {experience.map((exp) => (
                  <div key={exp.id}>
                    {/* Git commit style */}
                    <div className="flex items-start gap-2">
                      <span className="text-[#3fb950] text-[10px] font-semibold whitespace-nowrap mt-0.5">
                        commit
                      </span>
                      <span className="text-[#ffa657] text-[10px] mt-0.5 truncate">
                        {exp.id.slice(0, 7)}
                      </span>
                    </div>
                    <div className="flex items-baseline justify-between gap-2 mt-0.5">
                      <p className="text-[11px] text-gray-300 font-semibold leading-tight">
                        <span className="text-[#3fb950]">{exp.current ? '(main)' : '(detached)'}</span>{' '}
                        {exp.position}{' '}
                        <span className="text-gray-500">{'@'}</span>{' '}
                        <span className="text-[#79c0ff]">{exp.company}</span>
                        {exp.location && (
                          <span className="text-gray-600"> &middot; {exp.location}</span>
                        )}
                      </p>
                    </div>
                    <p className="text-[10px] text-gray-600 mt-0.5">
                      <span className="text-gray-500">Date:</span>{' '}
                      {formatDate(exp.startDate)} - {exp.current ? 'Present' : formatDate(exp.endDate)}
                    </p>
                    {exp.description && (
                      <div className="mt-1.5 bg-[#161b22] rounded border border-gray-800 p-2.5">
                        <p className="text-[10px] text-gray-400 leading-relaxed whitespace-pre-line">
                          {exp.description}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          <hr className="border-gray-800 mb-4" />

          {/* Projects */}
          {projects.length > 0 && (
            <section className="mb-5">
              <h2 className="text-[11px] font-semibold text-[#8b949e] mb-2.5">
                <span className="text-[#3fb950]">{'// '}</span>PROJECTS
              </h2>
              <div className="space-y-3">
                {projects.map((proj) => (
                  <div key={proj.id}>
                    <div className="flex items-baseline justify-between gap-2">
                      <p className="text-[11px] font-semibold text-gray-200 leading-tight">
                        <span className="text-[#3fb950]">$</span>{' '}
                        <span className="text-[#79c0ff]">cd</span>{' '}
                        <span className="text-[#ffa657]">{proj.name}</span>
                      </p>
                      {(proj.startDate || proj.endDate) && (
                        <p className="text-[10px] text-gray-600 whitespace-nowrap flex-shrink-0">
                          {formatDate(proj.startDate)}
                          {proj.endDate ? ` - ${formatDate(proj.endDate)}` : ''}
                        </p>
                      )}
                    </div>
                    {proj.link && (
                      <p className="text-[10px] text-[#3fb950] mt-0.5">
                        {'<'}{proj.link}{'>'}
                      </p>
                    )}
                    {proj.technologies && (
                      <div className="flex flex-wrap gap-1 mt-1">
                        {proj.technologies.split(',').map((tech, i) => (
                          <span
                            key={i}
                            className="inline-block text-[9px] px-1.5 py-0.5 rounded border border-gray-700 bg-[#161b22] text-[#3fb950]"
                          >
                            {tech.trim()}
                          </span>
                        ))}
                      </div>
                    )}
                    {proj.description && (
                      <div className="mt-1.5 bg-[#161b22] rounded border border-gray-800 p-2.5">
                        <p className="text-[10px] text-gray-400 leading-relaxed">
                          {proj.description}
                        </p>
                      </div>
                    )}
                    {proj.highlights && (
                      <div className="mt-1 pl-3 border-l-2 border-[#3fb950]/30">
                        <p className="text-[10px] text-gray-400 leading-relaxed">{proj.highlights}</p>
                      </div>
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
