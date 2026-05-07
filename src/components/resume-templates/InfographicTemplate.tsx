'use client';

import { ResumeData } from '@/lib/types';

function formatDate(date: string, current?: boolean): string {
  if (!date) return '';
  if (current) return `${formatDate(date)} - Present`;
  const d = new Date(date);
  if (isNaN(d.getTime())) return date;
  return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
}

const LEVEL_WIDTH: Record<string, string> = {
  beginner: 'w-1/4',
  intermediate: 'w-2/4',
  advanced: 'w-3/4',
  expert: 'w-full',
};

const TECH_COLORS = [
  'bg-teal-50 text-teal-700 border border-teal-100',
  'bg-cyan-50 text-cyan-700 border border-cyan-100',
  'bg-emerald-50 text-emerald-700 border border-emerald-100',
  'bg-sky-50 text-sky-700 border border-sky-100',
  'bg-amber-50 text-amber-700 border border-amber-100',
  'bg-rose-50 text-rose-700 border border-rose-100',
  'bg-violet-50 text-violet-700 border border-violet-100',
  'bg-orange-50 text-orange-700 border border-orange-100',
];

function getTechColor(index: number): string {
  return TECH_COLORS[index % TECH_COLORS.length];
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((part) => part.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

function computeYearsOfExperience(experience: ResumeData['experience']): number {
  let totalYears = 0;
  for (const exp of experience) {
    const start = exp.startDate ? new Date(exp.startDate) : null;
    const end = exp.current ? new Date() : exp.endDate ? new Date(exp.endDate) : null;
    if (start && end && !isNaN(start.getTime()) && !isNaN(end.getTime())) {
      const diffMs = end.getTime() - start.getTime();
      totalYears += Math.max(0, diffMs / (1000 * 60 * 60 * 24 * 365.25));
    }
  }
  return Math.round(totalYears);
}

export default function InfographicTemplate({ data }: { data: ResumeData }) {
  const { personalInfo, education, skills, projects, experience, certifications, achievements } = data;

  // Group skills by category
  const skillsByCategory = skills.reduce<Record<string, typeof skills>>((acc, skill) => {
    const cat = skill.category || 'Other';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(skill);
    return acc;
  }, {});

  const yearsOfExp = computeYearsOfExperience(experience);
  const projectCount = projects.length;
  const skillCount = skills.length;
  const certCount = certifications.length;

  // Count unique technologies across all projects
  const uniqueTechs = new Set<string>();
  projects.forEach((p) => {
    if (p.technologies) {
      p.technologies.split(',').forEach((t) => uniqueTechs.add(t.trim().toLowerCase()));
    }
  });
  const techCount = uniqueTechs.size;

  return (
    <div className="bg-white shadow-lg mx-auto max-w-[210mm] min-h-[297mm] aspect-[210/297] print:shadow-none print:max-w-none print:min-h-0 print:aspect-auto flex overflow-hidden">
      {/* ── Left Sidebar (~35%) ── */}
      <aside className="w-[35%] flex-shrink-0 bg-gradient-to-b from-teal-600 to-cyan-500 text-white p-6 print:p-4 flex flex-col overflow-y-auto relative">
        {/* Decorative circles */}
        <div className="absolute top-0 left-0 w-32 h-32 bg-white/5 rounded-full -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-12 right-0 w-24 h-24 bg-white/5 rounded-full translate-x-1/3" />

        {/* Avatar with initials */}
        <div className="flex flex-col items-center mb-5 relative z-10">
          <div className="w-24 h-24 rounded-full bg-white/20 backdrop-blur-sm border-2 border-white/40 flex items-center justify-center shadow-lg mb-3">
            {personalInfo.fullName ? (
              <span className="text-3xl font-bold text-white tracking-wide">
                {getInitials(personalInfo.fullName)}
              </span>
            ) : (
              <span className="text-3xl font-bold text-white/60">?</span>
            )}
          </div>
          {personalInfo.fullName && (
            <h1 className="text-lg font-extrabold text-center leading-tight tracking-tight">
              {personalInfo.fullName}
            </h1>
          )}
          {personalInfo.jobTitle && (
            <p className="text-xs font-medium text-white/80 mt-0.5 text-center">
              {personalInfo.jobTitle}
            </p>
          )}
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-white/20 mb-5 relative z-10" />

        {/* Contact Info */}
        {(personalInfo.email ||
          personalInfo.phone ||
          personalInfo.location ||
          personalInfo.website ||
          personalInfo.linkedin ||
          personalInfo.github) && (
          <div className="mb-5 relative z-10">
            <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/60 mb-3">
              Contact
            </h2>
            <div className="space-y-2.5">
              {personalInfo.email && (
                <ContactRow icon={<MailIcon />} label="Email" value={personalInfo.email} />
              )}
              {personalInfo.phone && (
                <ContactRow icon={<PhoneIcon />} label="Phone" value={personalInfo.phone} />
              )}
              {personalInfo.location && (
                <ContactRow icon={<MapIcon />} label="Location" value={personalInfo.location} />
              )}
              {personalInfo.website && (
                <ContactRow icon={<GlobeIcon />} label="Website" value={personalInfo.website} />
              )}
              {personalInfo.linkedin && (
                <ContactRow icon={<LinkedinIcon />} label="LinkedIn" value={personalInfo.linkedin} />
              )}
              {personalInfo.github && (
                <ContactRow icon={<GithubIcon />} label="GitHub" value={personalInfo.github} />
              )}
            </div>
          </div>
        )}

        {/* Stats Row */}
        <div className="grid grid-cols-2 gap-2 mb-5 relative z-10">
          {yearsOfExp > 0 && <StatCard value={`${yearsOfExp}`} label="Years Exp." />}
          {projectCount > 0 && <StatCard value={`${projectCount}`} label="Projects" />}
          {skillCount > 0 && <StatCard value={`${skillCount}`} label="Skills" />}
          {certCount > 0 && <StatCard value={`${certCount}`} label="Certs" />}
        </div>

        {/* Skills with progress bars */}
        {skills.length > 0 && (
          <div className="flex-1 relative z-10">
            <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/60 mb-3">
              Skills
            </h2>
            <div className="space-y-4">
              {Object.entries(skillsByCategory).map(([category, items]) => (
                <div key={category}>
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-white/50 mb-2">
                    {category}
                  </p>
                  <div className="space-y-2">
                    {items.map((skill) => (
                      <div key={skill.id}>
                        <div className="flex items-center justify-between mb-0.5">
                          <span className="text-[11px] text-white font-medium">{skill.name}</span>
                          <span className="text-[9px] uppercase tracking-wider text-white/50">
                            {skill.level}
                          </span>
                        </div>
                        <div className="h-2 w-full bg-white/15 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full bg-white/90 transition-all ${
                              LEVEL_WIDTH[skill.level] || LEVEL_WIDTH.intermediate
                            }`}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </aside>

      {/* ── Main Content Area (~65%) ── */}
      <main className="w-[65%] flex-shrink-0 p-6 print:p-4 overflow-y-auto text-gray-800">
        {/* Summary */}
        {personalInfo.summary && (
          <MainSection title="Profile">
            <p className="text-xs leading-relaxed text-gray-600">{personalInfo.summary}</p>
          </MainSection>
        )}

        {/* Experience – Timeline style */}
        {experience.length > 0 && (
          <MainSection title="Experience">
            <div className="relative ml-2">
              {/* Vertical timeline line */}
              <div className="absolute left-[7px] top-1.5 bottom-1.5 w-0.5 bg-teal-200 rounded-full" />

              <div className="space-y-4">
                {experience.map((exp, index) => (
                  <div key={exp.id} className="relative pl-6">
                    {/* Timeline dot */}
                    <div
                      className={`absolute left-0 top-1.5 w-[15px] h-[15px] rounded-full border-[3px] ${
                        exp.current
                          ? 'border-teal-500 bg-teal-100'
                          : 'border-cyan-400 bg-cyan-50'
                      } z-10`}
                    />

                    <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <h3 className="text-sm font-bold text-gray-900 leading-tight">
                            {exp.position}
                          </h3>
                          <p className="text-xs text-gray-600 mt-0.5">
                            {exp.company}
                            {exp.location && (
                              <span className="text-gray-400"> &middot; {exp.location}</span>
                            )}
                          </p>
                        </div>
                        <span className="inline-block text-[10px] font-medium bg-teal-50 text-teal-700 px-2 py-0.5 rounded-full whitespace-nowrap flex-shrink-0 border border-teal-100">
                          {formatDate(exp.startDate, exp.current)}
                        </span>
                      </div>
                      {exp.description && (
                        <p className="text-xs text-gray-600 mt-2 leading-relaxed whitespace-pre-line">
                          {exp.description}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </MainSection>
        )}

        {/* Education */}
        {education.length > 0 && (
          <MainSection title="Education">
            <div className="space-y-3">
              {education.map((edu) => (
                <div
                  key={edu.id}
                  className="bg-gray-50 rounded-xl p-3 border border-gray-100"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <h3 className="text-sm font-bold text-gray-900 leading-tight">
                        {edu.degree}
                      </h3>
                      <p className="text-xs text-gray-600 mt-0.5">
                        {edu.institution}
                        {edu.location && (
                          <span className="text-gray-400"> &middot; {edu.location}</span>
                        )}
                      </p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-[10px] font-medium text-gray-500 whitespace-nowrap">
                        {formatDate(edu.startDate)} - {formatDate(edu.endDate)}
                      </p>
                      {edu.gpa && (
                        <p className="text-[10px] text-teal-600 font-medium mt-0.5">
                          GPA: {edu.gpa}
                        </p>
                      )}
                    </div>
                  </div>
                  {edu.description && (
                    <p className="text-xs text-gray-600 mt-1.5 leading-relaxed">
                      {edu.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </MainSection>
        )}

        {/* Projects with colorful tech tags */}
        {projects.length > 0 && (
          <MainSection title="Projects">
            <div className="space-y-3">
              {projects.map((proj) => (
                <div
                  key={proj.id}
                  className="bg-gray-50 rounded-xl p-3 border border-gray-100"
                >
                  <div className="flex items-baseline justify-between gap-2">
                    <h3 className="text-sm font-bold text-gray-900 leading-tight">
                      {proj.name}
                      {proj.link && (
                        <span className="font-normal text-[11px] text-teal-600 ml-1.5">
                          {proj.link}
                        </span>
                      )}
                    </h3>
                    <p className="text-[10px] text-gray-400 whitespace-nowrap flex-shrink-0">
                      {formatDate(proj.startDate)}
                      {proj.endDate ? ` - ${formatDate(proj.endDate)}` : ''}
                    </p>
                  </div>

                  {/* Colorful tech badges */}
                  {proj.technologies && (
                    <div className="flex flex-wrap gap-1 mt-1.5">
                      {proj.technologies.split(',').map((tech, i) => (
                        <span
                          key={i}
                          className={`inline-block text-[10px] px-2 py-0.5 rounded-full font-medium ${getTechColor(i)}`}
                        >
                          {tech.trim()}
                        </span>
                      ))}
                    </div>
                  )}

                  {proj.description && (
                    <p className="text-xs text-gray-600 mt-1.5 leading-relaxed">
                      {proj.description}
                    </p>
                  )}
                  {proj.highlights && (
                    <p className="text-xs text-gray-600 mt-0.5 leading-relaxed">
                      {proj.highlights}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </MainSection>
        )}

        {/* Certifications */}
        {certifications.length > 0 && (
          <MainSection title="Certifications">
            <div className="space-y-2.5">
              {certifications.map((cert) => (
                <div
                  key={cert.id}
                  className="bg-gray-50 rounded-xl px-3 py-2.5 border border-gray-100"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-gray-900 leading-tight">{cert.name}</p>
                      <p className="text-[11px] text-gray-500 mt-0.5">{cert.issuer}</p>
                    </div>
                    {cert.date && (
                      <span className="text-[10px] text-gray-400 whitespace-nowrap flex-shrink-0">
                        {formatDate(cert.date)}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 mt-1">
                    {cert.credentialId && (
                      <p className="text-[10px] text-gray-400">
                        ID: {cert.credentialId}
                      </p>
                    )}
                    {cert.url && (
                      <p className="text-[10px] text-teal-600 font-medium truncate">
                        {cert.url}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </MainSection>
        )}

        {/* Achievements */}
        {achievements.length > 0 && (
          <MainSection title="Achievements">
            <div className="space-y-2.5">
              {achievements.map((ach) => (
                <div key={ach.id} className="flex items-start gap-2.5">
                  <div className="mt-1 w-2 h-2 rounded-full bg-gradient-to-br from-teal-400 to-cyan-400 flex-shrink-0 ring-2 ring-teal-100" />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-xs font-bold text-gray-900">{ach.title}</p>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        {ach.date && (
                          <p className="text-[10px] text-gray-400">{formatDate(ach.date)}</p>
                        )}
                        {ach.category && (
                          <span className="text-[9px] uppercase tracking-wider text-teal-600 font-semibold bg-teal-50 px-1.5 py-0.5 rounded-full border border-teal-100">
                            {ach.category}
                          </span>
                        )}
                      </div>
                    </div>
                    {ach.description && (
                      <p className="text-[11px] text-gray-600 mt-0.5 leading-relaxed">
                        {ach.description}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </MainSection>
        )}
      </main>
    </div>
  );
}

/* ── Main content section with colored underline header ── */
function MainSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mb-5">
      <h2 className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-900 mb-1 pb-1.5 border-b-2 border-teal-500">
        <span className="inline-block w-2 h-2 rounded-full bg-teal-500 flex-shrink-0" />
        {title}
      </h2>
      <div className="mt-2.5">{children}</div>
    </section>
  );
}

/* ── Contact row with icon and label in sidebar ── */
function ContactRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-2">
      <div className="mt-0.5 flex-shrink-0 w-5 h-5 flex items-center justify-center text-white/80">
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-[9px] uppercase tracking-widest text-white/40 font-semibold">{label}</p>
        <p className="text-[11px] text-white leading-tight break-all">{value}</p>
      </div>
    </div>
  );
}

/* ── Stat card for sidebar ── */
function StatCard({ value, label }: { value: string; label: string }) {
  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2 text-center border border-white/10">
      <p className="text-xl font-extrabold text-white leading-none">{value}</p>
      <p className="text-[9px] uppercase tracking-widest text-white/50 font-semibold mt-0.5">
        {label}
      </p>
    </div>
  );
}

/* ── Inline SVG icons (14×14 viewBox, stroke-based) ── */
function MailIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="M22 7l-10 6L2 7" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
    </svg>
  );
}

function MapIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function GlobeIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
    </svg>
  );
}

function LinkedinIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-4 0v7h-4v-7a6 6 0 016-6z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

function GithubIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 00-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0020 4.77 5.07 5.07 0 0019.91 1S18.73.65 16 2.48a13.38 13.38 0 00-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 005 4.77a5.44 5.44 0 00-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 009 18.13V22" />
    </svg>
  );
}
