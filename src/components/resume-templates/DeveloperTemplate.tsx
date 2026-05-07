'use client';

import { ResumeData } from '@/lib/types';

function formatDate(date: string, current?: boolean): string {
  if (!date) return '';
  if (current) return `${formatDate(date)} - Present`;
  const d = new Date(date);
  if (isNaN(d.getTime())) return date;
  return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
}

const LEVEL_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  beginner: { bg: 'bg-gray-100', text: 'text-gray-600', border: 'border-gray-300' },
  intermediate: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-300' },
  advanced: { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-400' },
  expert: { bg: 'bg-[#22c55e]', text: 'text-white', border: 'border-[#16a34a]' },
};

const TECH_COLORS = [
  { bg: 'bg-slate-100 text-slate-700 border-slate-200' },
  { bg: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  { bg: 'bg-teal-50 text-teal-700 border-teal-200' },
  { bg: 'bg-cyan-50 text-cyan-700 border-cyan-200' },
  { bg: 'bg-amber-50 text-amber-700 border-amber-200' },
  { bg: 'bg-rose-50 text-rose-700 border-rose-200' },
  { bg: 'bg-violet-50 text-violet-700 border-violet-200' },
  { bg: 'bg-orange-50 text-orange-700 border-orange-200' },
];

function ContributionBar({ startDate, endDate, current }: { startDate: string; endDate: string; current: boolean }) {
  if (!startDate) return null;
  const start = new Date(startDate);
  const end = current ? new Date() : (endDate ? new Date(endDate) : new Date());
  if (isNaN(start.getTime()) || isNaN(end.getTime())) return null;

  const diffMs = end.getTime() - start.getTime();
  const diffYears = diffMs / (1000 * 60 * 60 * 24 * 365.25);
  const years = Math.max(0.5, Math.min(diffYears, 10));
  const widthPercent = Math.min((years / 10) * 100, 100);
  const cellCount = Math.max(1, Math.round(years * 2));

  return (
    <div className="flex items-center gap-1.5 mt-1.5">
      <div className="flex gap-[3px]">
        {Array.from({ length: cellCount }).map((_, i) => (
          <div
            key={i}
            className="w-[8px] h-[8px] rounded-[2px]"
            style={{
              backgroundColor: i % 5 === 0 ? '#22c55e' : i % 3 === 0 ? '#4ade80' : '#86efac',
              opacity: 0.6 + (i / cellCount) * 0.4,
            }}
          />
        ))}
      </div>
      <span className="text-[9px] text-gray-400 font-mono">
        {diffYears.toFixed(1)}y
      </span>
    </div>
  );
}

export default function DeveloperTemplate({ data }: { data: ResumeData }) {
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
      {/* ── Dark Top Banner / Header ── */}
      <header className="bg-[#0f172a] px-6 pt-6 pb-5 print:px-4 print:pt-4 print:pb-4">
        {/* Terminal window chrome */}
        <div className="flex items-center gap-2 mb-4">
          <div className="w-3 h-3 rounded-full bg-[#ef4444]" />
          <div className="w-3 h-3 rounded-full bg-[#eab308]" />
          <div className="w-3 h-3 rounded-full bg-[#22c55e]" />
          <span className="ml-3 text-xs text-slate-500 font-mono">
            ~/resume/{personalInfo.fullName?.toLowerCase().replace(/\s+/g, '-')}
          </span>
        </div>

        {/* Name & Title */}
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[#22c55e] font-mono text-sm">&#x276F;</span>
            <h1 className="text-2xl font-bold text-white font-mono tracking-tight print:text-xl">
              {personalInfo.fullName}
            </h1>
          </div>
          {personalInfo.jobTitle && (
            <p className="text-[#22c55e] text-sm mt-1 ml-6 font-mono print:text-xs">
              {personalInfo.jobTitle}
            </p>
          )}
        </div>

        {/* Summary */}
        {personalInfo.summary && (
          <div className="mt-4 ml-6 bg-[#1e293b] rounded-lg border border-slate-700/50 p-3 print:p-2">
            <p className="text-[10px] text-slate-500 font-mono mb-1.5">
              <span className="text-[#22c55e]">{'/*'}</span>{' '}
              <span className="text-slate-400">summary</span>
            </p>
            <p className="text-xs text-slate-300 leading-relaxed font-sans print:text-[11px]">
              {personalInfo.summary}
            </p>
            <p className="text-[10px] text-slate-500 font-mono mt-1.5">
              <span className="text-[#22c55e]">{'*/'}</span>
            </p>
          </div>
        )}

        {/* Contact row */}
        <div className="mt-4 ml-6 flex flex-wrap gap-x-4 gap-y-1 text-[11px] font-sans">
          {personalInfo.email && (
            <span className="text-slate-400">
              <span className="text-[#22c55e] font-mono mr-1">✉</span>
              {personalInfo.email}
            </span>
          )}
          {personalInfo.phone && (
            <span className="text-slate-400">
              <span className="text-[#22c55e] font-mono mr-1">☰</span>
              {personalInfo.phone}
            </span>
          )}
          {personalInfo.location && (
            <span className="text-slate-400">
              <span className="text-[#22c55e] font-mono mr-1">◉</span>
              {personalInfo.location}
            </span>
          )}
          {personalInfo.website && (
            <span className="text-slate-400">
              <span className="text-[#22c55e] font-mono mr-1">⟁</span>
              {personalInfo.website}
            </span>
          )}
          {personalInfo.linkedin && (
            <span className="text-slate-400">
              <span className="text-[#22c55e] font-mono mr-1">in</span>
              {personalInfo.linkedin}
            </span>
          )}
          {personalInfo.github && (
            <span className="text-slate-400">
              <span className="text-[#22c55e] font-mono mr-1">&lt;/&gt;</span>
              {personalInfo.github}
            </span>
          )}
        </div>
      </header>

      {/* ── Body Content ── */}
      <div className="bg-gray-50 px-6 py-5 print:px-4 print:py-4 space-y-5 print:space-y-4 font-sans">
        {/* ── Skills: Tech Stack ── */}
        {skills.length > 0 && (
          <section>
            <h2 className="text-sm font-bold font-mono text-[#0f172a] flex items-center gap-2 mb-3 print:text-xs">
              <span className="text-[#22c55e]">$</span>
              <span>tech_stack</span>
              <span className="flex-1 h-px bg-gray-200" />
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {Object.entries(skillsByCategory).map(([category, items]) => (
                <div key={category}>
                  <p className="text-[10px] font-mono text-gray-500 uppercase tracking-wider mb-1.5">
                    <span className="text-[#22c55e]">&gt;</span> {category}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {items.map((skill) => {
                      const colors = LEVEL_COLORS[skill.level] || LEVEL_COLORS.beginner;
                      return (
                        <span
                          key={skill.id}
                          className={`inline-flex items-center text-[10px] px-2 py-0.5 rounded-md border font-mono ${colors.bg} ${colors.text} ${colors.border}`}
                        >
                          {skill.name}
                          {skill.level === 'expert' && (
                            <span className="ml-1 text-[8px] opacity-70">★</span>
                          )}
                        </span>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── Experience ── */}
        {experience.length > 0 && (
          <section>
            <h2 className="text-sm font-bold font-mono text-[#0f172a] flex items-center gap-2 mb-3 print:text-xs">
              <span className="text-[#22c55e]">$</span>
              <span>experience</span>
              <span className="flex-1 h-px bg-gray-200" />
            </h2>
            <div className="space-y-3">
              {experience.map((exp) => (
                <div
                  key={exp.id}
                  className="bg-white rounded-lg border border-gray-200 p-3 print:p-2"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <h3 className="text-xs font-bold text-[#0f172a] font-mono leading-tight print:text-[11px]">
                        {exp.position}
                      </h3>
                      <p className="text-[11px] text-[#22c55e] font-mono mt-0.5 print:text-[10px]">
                        {exp.company}
                        {exp.location && (
                          <span className="text-gray-400"> · {exp.location}</span>
                        )}
                      </p>
                    </div>
                    <span className="text-[10px] text-gray-400 font-mono whitespace-nowrap flex-shrink-0 mt-0.5">
                      {formatDate(exp.startDate, exp.current)}
                    </span>
                  </div>
                  <ContributionBar
                    startDate={exp.startDate}
                    endDate={exp.endDate}
                    current={exp.current}
                  />
                  {exp.description && (
                    <p className="text-[11px] text-gray-600 leading-relaxed mt-2 print:text-[10px] whitespace-pre-line">
                      {exp.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── Projects ── */}
        {projects.length > 0 && (
          <section>
            <h2 className="text-sm font-bold font-mono text-[#0f172a] flex items-center gap-2 mb-3 print:text-xs">
              <span className="text-[#22c55e]">$</span>
              <span>projects</span>
              <span className="flex-1 h-px bg-gray-200" />
            </h2>
            <div className="space-y-3">
              {projects.map((proj, projIdx) => (
                <div
                  key={proj.id}
                  className="bg-white rounded-lg border border-gray-200 overflow-hidden print:p-2"
                >
                  {/* Project header */}
                  <div className="px-3 pt-3 pb-2 flex items-start justify-between gap-2 print:px-2 print:pt-2">
                    <div className="min-w-0">
                      <h3 className="text-xs font-bold text-[#0f172a] font-mono leading-tight flex items-center gap-1.5 print:text-[11px]">
                        <span className="text-[#22c55e]">📁</span>
                        {proj.name}
                      </h3>
                      {(proj.startDate || proj.endDate) && (
                        <p className="text-[10px] text-gray-400 font-mono mt-0.5 print:text-[9px]">
                          {formatDate(proj.startDate)}{proj.endDate ? ` — ${formatDate(proj.endDate)}` : ''}
                        </p>
                      )}
                    </div>
                    {proj.link && (
                      <span className="text-[10px] text-[#22c55e] font-mono whitespace-nowrap flex-shrink-0 border border-[#22c55e]/30 rounded px-1.5 py-0.5 bg-[#22c55e]/5 print:text-[9px]">
                        {proj.link}
                      </span>
                    )}
                  </div>

                  {/* Tech labels */}
                  {proj.technologies && (
                    <div className="px-3 pb-2 flex flex-wrap gap-1 print:px-2">
                      {proj.technologies.split(',').map((tech, i) => {
                        const colorSet = TECH_COLORS[(projIdx + i) % TECH_COLORS.length];
                        return (
                          <span
                            key={i}
                            className={`text-[9px] px-1.5 py-[2px] rounded border font-mono ${colorSet.bg}`}
                          >
                            {tech.trim()}
                          </span>
                        );
                      })}
                    </div>
                  )}

                  {/* Description */}
                  {proj.description && (
                    <div className="px-3 pb-2 print:px-2">
                      <p className="text-[11px] text-gray-600 leading-relaxed print:text-[10px]">
                        {proj.description}
                      </p>
                    </div>
                  )}

                  {/* Highlights */}
                  {proj.highlights && (
                    <div className="px-3 pb-3 border-t border-gray-100 pt-2 bg-gray-50/50 print:px-2 print:pb-2">
                      <p className="text-[10px] text-gray-500 leading-relaxed font-mono print:text-[9px] whitespace-pre-line">
                        <span className="text-[#22c55e] mr-1">&gt;</span>
                        {proj.highlights}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── Education ── */}
        {education.length > 0 && (
          <section>
            <h2 className="text-sm font-bold font-mono text-[#0f172a] flex items-center gap-2 mb-3 print:text-xs">
              <span className="text-[#22c55e]">$</span>
              <span>education</span>
              <span className="flex-1 h-px bg-gray-200" />
            </h2>
            <div className="space-y-2">
              {education.map((edu) => (
                <div key={edu.id} className="bg-white rounded-lg border border-gray-200 p-3 print:p-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <h3 className="text-xs font-bold text-[#0f172a] font-mono leading-tight print:text-[11px]">
                        {edu.degree}
                      </h3>
                      <p className="text-[11px] text-[#22c55e] font-mono mt-0.5 print:text-[10px]">
                        {edu.institution}
                        {edu.location && (
                          <span className="text-gray-400"> · {edu.location}</span>
                        )}
                      </p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      {(edu.startDate || edu.endDate) && (
                        <p className="text-[10px] text-gray-400 font-mono whitespace-nowrap print:text-[9px]">
                          {formatDate(edu.startDate)}{edu.endDate ? ` — ${formatDate(edu.endDate)}` : ''}
                        </p>
                      )}
                      {edu.gpa && (
                        <p className="text-[10px] text-[#22c55e] font-mono print:text-[9px]">
                          GPA: {edu.gpa}
                        </p>
                      )}
                    </div>
                  </div>
                  {edu.description && (
                    <p className="text-[11px] text-gray-600 leading-relaxed mt-1.5 print:text-[10px]">
                      {edu.description}
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
            <h2 className="text-sm font-bold font-mono text-[#0f172a] flex items-center gap-2 mb-3 print:text-xs">
              <span className="text-[#22c55e]">$</span>
              <span>certifications</span>
              <span className="flex-1 h-px bg-gray-200" />
            </h2>
            <div className="space-y-2">
              {certifications.map((cert) => (
                <div key={cert.id} className="bg-white rounded-lg border border-gray-200 p-3 print:p-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <h3 className="text-xs font-bold text-[#0f172a] font-mono leading-tight print:text-[11px]">
                        {cert.name}
                      </h3>
                      <p className="text-[11px] text-gray-500 font-sans mt-0.5 print:text-[10px]">
                        {cert.issuer}
                      </p>
                    </div>
                    {cert.date && (
                      <span className="text-[10px] text-gray-400 font-mono whitespace-nowrap flex-shrink-0 print:text-[9px]">
                        {formatDate(cert.date)}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 mt-1">
                    {cert.credentialId && (
                      <p className="text-[9px] text-gray-400 font-mono">
                        ID: {cert.credentialId}
                      </p>
                    )}
                    {cert.url && (
                      <p className="text-[9px] text-[#22c55e] font-mono truncate">
                        {cert.url}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── Achievements ── */}
        {achievements.length > 0 && (
          <section>
            <h2 className="text-sm font-bold font-mono text-[#0f172a] flex items-center gap-2 mb-3 print:text-xs">
              <span className="text-[#22c55e]">$</span>
              <span>achievements</span>
              <span className="flex-1 h-px bg-gray-200" />
            </h2>
            <div className="space-y-2">
              {achievements.map((ach) => (
                <div key={ach.id} className="bg-white rounded-lg border border-gray-200 p-3 print:p-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <h3 className="text-xs font-bold text-[#0f172a] font-mono leading-tight print:text-[11px]">
                        {ach.title}
                      </h3>
                      {ach.description && (
                        <p className="text-[11px] text-gray-600 leading-relaxed mt-0.5 print:text-[10px]">
                          {ach.description}
                        </p>
                      )}
                    </div>
                    <div className="flex flex-col items-end gap-0.5 flex-shrink-0">
                      {ach.date && (
                        <span className="text-[9px] text-gray-400 font-mono print:text-[8px]">
                          {formatDate(ach.date)}
                        </span>
                      )}
                      {ach.category && (
                        <span className="text-[9px] text-[#22c55e] font-mono uppercase tracking-wider bg-[#22c55e]/5 border border-[#22c55e]/20 rounded px-1.5 py-[1px] print:text-[8px]">
                          {ach.category}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* ── Footer ── */}
      <footer className="bg-[#0f172a] px-6 py-2.5 print:px-4 print:py-2 flex items-center justify-between">
        <span className="text-[9px] text-slate-500 font-mono">
          <span className="text-[#22c55e]">●</span> Available for hire
        </span>
        <span className="text-[9px] text-slate-600 font-mono">
          generated with &lt;developer_template /&gt;
        </span>
      </footer>
    </div>
  );
}
