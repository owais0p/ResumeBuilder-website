'use client';

import { ResumeData } from '@/lib/types';

function formatDate(date: string, current?: boolean): string {
  if (!date) return '';
  if (current) return `${formatDate(date)} - Present`;
  const d = new Date(date);
  if (isNaN(d.getTime())) return date;
  return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
}

export default function ClassicTemplate({ data }: { data: ResumeData }) {
  const { personalInfo, education, skills, projects, experience, certifications, achievements } = data;

  // Group skills by category
  const skillsByCategory = skills.reduce<Record<string, typeof skills>>((acc, skill) => {
    const cat = skill.category || 'Other';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(skill);
    return acc;
  }, {});

  return (
    <div className="bg-white text-gray-900 shadow-lg mx-auto max-w-[210mm] min-h-[297mm] aspect-[210/297] print:shadow-none print:max-w-none print:min-h-0 print:aspect-auto">
      <div className="flex h-full">
        {/* ── Left Sidebar ── */}
        <aside className="w-[35%] bg-gray-50 p-6 print:p-4 flex-shrink-0 border-r border-gray-200">
          {/* Contact */}
          <section className="mb-6">
            <h2 className="font-serif text-xs font-bold uppercase tracking-widest text-gray-500 border-b border-gray-300 pb-1 mb-3">
              Contact
            </h2>
            <ul className="space-y-2 text-xs text-gray-700">
              {personalInfo.email && (
                <li className="break-all">
                  <span className="font-semibold text-gray-900">Email</span>
                  <br />
                  {personalInfo.email}
                </li>
              )}
              {personalInfo.phone && (
                <li>
                  <span className="font-semibold text-gray-900">Phone</span>
                  <br />
                  {personalInfo.phone}
                </li>
              )}
              {personalInfo.location && (
                <li>
                  <span className="font-semibold text-gray-900">Location</span>
                  <br />
                  {personalInfo.location}
                </li>
              )}
              {personalInfo.website && (
                <li className="break-all">
                  <span className="font-semibold text-gray-900">Website</span>
                  <br />
                  {personalInfo.website}
                </li>
              )}
              {personalInfo.linkedin && (
                <li className="break-all">
                  <span className="font-semibold text-gray-900">LinkedIn</span>
                  <br />
                  {personalInfo.linkedin}
                </li>
              )}
              {personalInfo.github && (
                <li className="break-all">
                  <span className="font-semibold text-gray-900">GitHub</span>
                  <br />
                  {personalInfo.github}
                </li>
              )}
            </ul>
          </section>

          {/* Skills */}
          {skills.length > 0 && (
            <section className="mb-6">
              <h2 className="font-serif text-xs font-bold uppercase tracking-widest text-gray-500 border-b border-gray-300 pb-1 mb-3">
                Skills
              </h2>
              {Object.entries(skillsByCategory).map(([category, items]) => (
                <div key={category} className="mb-3">
                  <h3 className="font-serif text-[10px] font-semibold uppercase tracking-wider text-gray-600 mb-1.5">
                    {category}
                  </h3>
                  <ul className="space-y-1 text-xs text-gray-700">
                    {items.map((skill) => (
                      <li key={skill.id} className="flex items-center justify-between">
                        <span>{skill.name}</span>
                        <span className="text-[10px] text-gray-400 capitalize">{skill.level}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </section>
          )}

          {/* Certifications */}
          {certifications.length > 0 && (
            <section className="mb-6">
              <h2 className="font-serif text-xs font-bold uppercase tracking-widest text-gray-500 border-b border-gray-300 pb-1 mb-3">
                Certifications
              </h2>
              <ul className="space-y-2.5 text-xs text-gray-700">
                {certifications.map((cert) => (
                  <li key={cert.id}>
                    <p className="font-semibold text-gray-900 leading-tight">{cert.name}</p>
                    <p className="text-gray-500">{cert.issuer}</p>
                    {cert.date && <p className="text-gray-400 text-[10px]">{formatDate(cert.date)}</p>}
                    {cert.credentialId && (
                      <p className="text-gray-400 text-[10px]">ID: {cert.credentialId}</p>
                    )}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Achievements */}
          {achievements.length > 0 && (
            <section className="mb-6">
              <h2 className="font-serif text-xs font-bold uppercase tracking-widest text-gray-500 border-b border-gray-300 pb-1 mb-3">
                Achievements
              </h2>
              <ul className="space-y-2.5 text-xs text-gray-700">
                {achievements.map((ach) => (
                  <li key={ach.id}>
                    <p className="font-semibold text-gray-900 leading-tight">{ach.title}</p>
                    {ach.description && <p className="text-gray-500 mt-0.5">{ach.description}</p>}
                    {ach.date && <p className="text-gray-400 text-[10px] mt-0.5">{formatDate(ach.date)}</p>}
                    {ach.category && (
                      <span className="inline-block mt-0.5 text-[9px] uppercase tracking-wider bg-gray-200 text-gray-600 px-1.5 py-0.5 rounded">
                        {ach.category}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </section>
          )}
        </aside>

        {/* ── Main Content ── */}
        <main className="w-[65%] p-6 print:p-4 flex-shrink-0 overflow-hidden">
          {/* Header */}
          <header className="mb-5 pb-4 border-b-2 border-gray-800">
            {personalInfo.fullName && (
              <h1 className="font-serif text-2xl font-bold text-gray-900 tracking-tight leading-tight">
                {personalInfo.fullName}
              </h1>
            )}
            {personalInfo.jobTitle && (
              <p className="font-serif text-sm text-gray-500 mt-0.5">{personalInfo.jobTitle}</p>
            )}
          </header>

          {/* Summary */}
          {personalInfo.summary && (
            <section className="mb-5">
              <h2 className="font-serif text-xs font-bold uppercase tracking-widest text-gray-500 border-b border-gray-300 pb-1 mb-2">
                Professional Summary
              </h2>
              <p className="text-xs leading-relaxed text-gray-700">{personalInfo.summary}</p>
            </section>
          )}

          {/* Experience */}
          {experience.length > 0 && (
            <section className="mb-5">
              <h2 className="font-serif text-xs font-bold uppercase tracking-widest text-gray-500 border-b border-gray-300 pb-1 mb-3">
                Professional Experience
              </h2>
              <div className="space-y-4">
                {experience.map((exp) => (
                  <div key={exp.id}>
                    <div className="flex items-baseline justify-between gap-2">
                      <div>
                        <h3 className="font-serif text-sm font-bold text-gray-900 leading-tight">
                          {exp.position}
                        </h3>
                        <p className="text-xs text-gray-600">
                          {exp.company}
                          {exp.location && <span className="text-gray-400"> &middot; {exp.location}</span>}
                        </p>
                      </div>
                      <p className="text-[10px] text-gray-400 whitespace-nowrap flex-shrink-0">
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
            </section>
          )}

          {/* Education */}
          {education.length > 0 && (
            <section className="mb-5">
              <h2 className="font-serif text-xs font-bold uppercase tracking-widest text-gray-500 border-b border-gray-300 pb-1 mb-3">
                Education
              </h2>
              <div className="space-y-3">
                {education.map((edu) => (
                  <div key={edu.id}>
                    <div className="flex items-baseline justify-between gap-2">
                      <div>
                        <h3 className="font-serif text-sm font-bold text-gray-900 leading-tight">
                          {edu.degree}
                        </h3>
                        <p className="text-xs text-gray-600">
                          {edu.institution}
                          {edu.location && <span className="text-gray-400"> &middot; {edu.location}</span>}
                        </p>
                      </div>
                      <p className="text-[10px] text-gray-400 whitespace-nowrap flex-shrink-0">
                        {formatDate(edu.startDate)} - {formatDate(edu.endDate)}
                      </p>
                    </div>
                    {edu.gpa && <p className="text-[10px] text-gray-500 mt-0.5">GPA: {edu.gpa}</p>}
                    {edu.description && (
                      <p className="text-xs text-gray-600 mt-0.5 leading-relaxed">{edu.description}</p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Projects */}
          {projects.length > 0 && (
            <section className="mb-5">
              <h2 className="font-serif text-xs font-bold uppercase tracking-widest text-gray-500 border-b border-gray-300 pb-1 mb-3">
                Projects
              </h2>
              <div className="space-y-3">
                {projects.map((proj) => (
                  <div key={proj.id}>
                    <div className="flex items-baseline justify-between gap-2">
                      <h3 className="font-serif text-sm font-bold text-gray-900 leading-tight">
                        {proj.name}
                        {proj.link && (
                          <span className="font-normal text-[10px] text-gray-400 ml-1.5">
                            {proj.link}
                          </span>
                        )}
                      </h3>
                      <p className="text-[10px] text-gray-400 whitespace-nowrap flex-shrink-0">
                        {formatDate(proj.startDate)}{proj.endDate ? ` - ${formatDate(proj.endDate)}` : ''}
                      </p>
                    </div>
                    {proj.technologies && (
                      <p className="text-[10px] text-gray-400 mt-0.5 italic">
                        Technologies: {proj.technologies}
                      </p>
                    )}
                    {proj.description && (
                      <p className="text-xs text-gray-600 mt-0.5 leading-relaxed">{proj.description}</p>
                    )}
                    {proj.highlights && (
                      <p className="text-xs text-gray-600 mt-0.5 leading-relaxed">{proj.highlights}</p>
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
