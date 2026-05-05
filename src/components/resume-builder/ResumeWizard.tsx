'use client';

import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User,
  GraduationCap,
  Code2,
  FolderGit2,
  Briefcase,
  Award,
  Eye,
  ChevronLeft,
  ChevronRight,
  Plus,
  Trash2,
  Sparkles,
  FileText,
  Palette,
} from 'lucide-react';

import { useAppStore } from '@/lib/store';
import type { TemplateName } from '@/lib/types';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';

/* ─── Constants ─────────────────────────────────────────────────────── */

const STEPS = [
  { label: 'Personal Info', icon: User },
  { label: 'Education', icon: GraduationCap },
  { label: 'Skills', icon: Code2 },
  { label: 'Projects', icon: FolderGit2 },
  { label: 'Experience', icon: Briefcase },
  { label: 'Certifications', icon: Award },
  { label: 'Review', icon: Eye },
] as const;

const TOTAL_STEPS = STEPS.length;

const SKILL_LEVELS = ['beginner', 'intermediate', 'advanced', 'expert'] as const;

const SKILL_CATEGORIES = [
  'Technical',
  'Programming Languages',
  'Frameworks',
  'Tools & Platforms',
  'Soft Skills',
  'Languages',
  'Other',
] as const;

const ACHIEVEMENT_CATEGORIES = [
  'Professional',
  'Academic',
  'Open Source',
  'Community',
  'Competition',
  'Publication',
  'Other',
] as const;

/* ─── Animation Variants ────────────────────────────────────────────── */

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 300 : -300,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction > 0 ? -300 : 300,
    opacity: 0,
  }),
};

/* ─── Reusable Helpers ──────────────────────────────────────────────── */

function SectionCard({
  title,
  icon: Icon,
  children,
  onAdd,
  addLabel = 'Add',
}: {
  title: string;
  icon: React.ElementType;
  children: React.ReactNode;
  onAdd?: () => void;
  addLabel?: string;
}) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon className="h-5 w-5 text-emerald-600" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            {title}
          </h3>
        </div>
        {onAdd && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onAdd}
            className="border-emerald-300 text-emerald-700 hover:bg-emerald-50 hover:text-emerald-800 dark:border-emerald-700 dark:text-emerald-400 dark:hover:bg-emerald-950"
          >
            <Plus className="mr-1 h-4 w-4" />
            {addLabel}
          </Button>
        )}
      </div>
      {children}
    </div>
  );
}

function RemoveButton({ onClick, disabled }: { onClick: () => void; disabled?: boolean }) {
  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      onClick={onClick}
      disabled={disabled}
      className="h-8 w-8 p-0 text-red-400 hover:bg-red-50 hover:text-red-600 dark:text-red-500 dark:hover:bg-red-950 dark:hover:text-red-400"
    >
      <Trash2 className="h-4 w-4" />
    </Button>
  );
}

/* ─── Step 0: Personal Info ─────────────────────────────────────────── */

function PersonalInfoStep() {
  const { resumeData, updatePersonalInfo } = useAppStore();
  const { personalInfo: info } = resumeData;

  return (
    <div className="space-y-6">
      <div className="mb-2">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          Personal Information
        </h2>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Start with the basics. This information appears at the top of your resume.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        {/* Name */}
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="fullName">Full Name</Label>
          <Input
            id="fullName"
            placeholder="John Doe"
            value={info.fullName}
            onChange={(e) => updatePersonalInfo({ fullName: e.target.value })}
          />
        </div>

        {/* Job Title */}
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="jobTitle">Job Title</Label>
          <Input
            id="jobTitle"
            placeholder="Senior Software Engineer"
            value={info.jobTitle}
            onChange={(e) => updatePersonalInfo({ jobTitle: e.target.value })}
          />
        </div>

        {/* Email */}
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="john@example.com"
            value={info.email}
            onChange={(e) => updatePersonalInfo({ email: e.target.value })}
          />
        </div>

        {/* Phone */}
        <div className="space-y-2">
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            type="tel"
            placeholder="+1 (555) 123-4567"
            value={info.phone}
            onChange={(e) => updatePersonalInfo({ phone: e.target.value })}
          />
        </div>

        {/* Location */}
        <div className="space-y-2">
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            placeholder="San Francisco, CA"
            value={info.location}
            onChange={(e) => updatePersonalInfo({ location: e.target.value })}
          />
        </div>

        {/* Website */}
        <div className="space-y-2">
          <Label htmlFor="website">Website</Label>
          <Input
            id="website"
            type="url"
            placeholder="https://johndoe.com"
            value={info.website}
            onChange={(e) => updatePersonalInfo({ website: e.target.value })}
          />
        </div>

        {/* LinkedIn */}
        <div className="space-y-2">
          <Label htmlFor="linkedin">LinkedIn</Label>
          <Input
            id="linkedin"
            placeholder="linkedin.com/in/johndoe"
            value={info.linkedin}
            onChange={(e) => updatePersonalInfo({ linkedin: e.target.value })}
          />
        </div>

        {/* GitHub */}
        <div className="space-y-2">
          <Label htmlFor="github">GitHub</Label>
          <Input
            id="github"
            placeholder="github.com/johndoe"
            value={info.github}
            onChange={(e) => updatePersonalInfo({ github: e.target.value })}
          />
        </div>

        {/* Summary */}
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="summary">Professional Summary</Label>
          <Textarea
            id="summary"
            placeholder="A brief summary of your professional background, key strengths, and career objectives..."
            rows={4}
            value={info.summary}
            onChange={(e) => updatePersonalInfo({ summary: e.target.value })}
            className="resize-none"
          />
        </div>
      </div>
    </div>
  );
}

/* ─── Step 1: Education ─────────────────────────────────────────────── */

function EducationStep() {
  const { resumeData, addEducation, updateEducation, removeEducation } = useAppStore();
  const { education } = resumeData;

  return (
    <div className="space-y-6">
      <div className="mb-2">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Education</h2>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Add your educational background, starting with the most recent.
        </p>
      </div>

      <SectionCard title="Education History" icon={GraduationCap} onAdd={addEducation} addLabel="Add Education">
        {education.length === 0 && (
          <div className="rounded-lg border border-dashed border-gray-300 dark:border-gray-700 p-8 text-center">
            <GraduationCap className="mx-auto h-10 w-10 text-gray-300 dark:text-gray-600" />
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              No education entries yet. Click &quot;Add Education&quot; to get started.
            </p>
          </div>
        )}
        {education.map((edu, index) => (
          <Card key={edu.id} className="overflow-hidden border-gray-200 dark:border-gray-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 border-b border-gray-100 dark:border-gray-800 py-3">
              <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Education #{index + 1}
              </CardTitle>
              <RemoveButton onClick={() => removeEducation(edu.id)} disabled={education.length <= 1} />
            </CardHeader>
            <CardContent className="pt-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Degree</Label>
                  <Input
                    placeholder="B.S. Computer Science"
                    value={edu.degree}
                    onChange={(e) => updateEducation(edu.id, { degree: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Institution</Label>
                  <Input
                    placeholder="MIT"
                    value={edu.institution}
                    onChange={(e) => updateEducation(edu.id, { institution: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Location</Label>
                  <Input
                    placeholder="Cambridge, MA"
                    value={edu.location}
                    onChange={(e) => updateEducation(edu.id, { location: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>GPA</Label>
                  <Input
                    placeholder="3.8 / 4.0"
                    value={edu.gpa}
                    onChange={(e) => updateEducation(edu.id, { gpa: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Start Date</Label>
                  <Input
                    placeholder="Sep 2018"
                    value={edu.startDate}
                    onChange={(e) => updateEducation(edu.id, { startDate: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>End Date</Label>
                  <Input
                    placeholder="Jun 2022"
                    value={edu.endDate}
                    onChange={(e) => updateEducation(edu.id, { endDate: e.target.value })}
                  />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label>Description</Label>
                  <Textarea
                    placeholder="Relevant coursework, honors, activities..."
                    rows={3}
                    value={edu.description}
                    onChange={(e) => updateEducation(edu.id, { description: e.target.value })}
                    className="resize-none"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </SectionCard>
    </div>
  );
}

/* ─── Step 2: Skills ────────────────────────────────────────────────── */

function SkillsStep() {
  const { resumeData, addSkill, updateSkill, removeSkill } = useAppStore();
  const { skills } = resumeData;

  return (
    <div className="space-y-6">
      <div className="mb-2">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Skills</h2>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Showcase your technical and soft skills with proficiency levels.
        </p>
      </div>

      <SectionCard title="Skills List" icon={Code2} onAdd={addSkill} addLabel="Add Skill">
        {skills.length === 0 && (
          <div className="rounded-lg border border-dashed border-gray-300 dark:border-gray-700 p-8 text-center">
            <Code2 className="mx-auto h-10 w-10 text-gray-300 dark:text-gray-600" />
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              No skills added yet. Click &quot;Add Skill&quot; to begin.
            </p>
          </div>
        )}
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {skills.map((skill) => (
            <Card key={skill.id} className="border-gray-200 dark:border-gray-800">
              <CardContent className="pt-4 pb-4 space-y-3">
                <div className="flex items-start justify-between">
                  <span className="text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                    Skill
                  </span>
                  <RemoveButton onClick={() => removeSkill(skill.id)} disabled={skills.length <= 1} />
                </div>
                <Input
                  placeholder="e.g., React"
                  value={skill.name}
                  onChange={(e) => updateSkill(skill.id, { name: e.target.value })}
                />
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label className="text-xs">Level</Label>
                    <Select
                      value={skill.level}
                      onValueChange={(val) =>
                        updateSkill(skill.id, {
                          level: val as typeof skill.level,
                        })
                      }
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        {SKILL_LEVELS.map((level) => (
                          <SelectItem key={level} value={level}>
                            {level.charAt(0).toUpperCase() + level.slice(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs">Category</Label>
                    <Select
                      value={skill.category}
                      onValueChange={(val) => updateSkill(skill.id, { category: val })}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        {SKILL_CATEGORIES.map((cat) => (
                          <SelectItem key={cat} value={cat}>
                            {cat}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}

/* ─── Step 3: Projects ──────────────────────────────────────────────── */

function ProjectsStep() {
  const { resumeData, addProject, updateProject, removeProject } = useAppStore();
  const { projects } = resumeData;

  return (
    <div className="space-y-6">
      <div className="mb-2">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Projects</h2>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Highlight your best work and personal projects.
        </p>
      </div>

      <SectionCard title="Projects" icon={FolderGit2} onAdd={addProject} addLabel="Add Project">
        {projects.length === 0 && (
          <div className="rounded-lg border border-dashed border-gray-300 dark:border-gray-700 p-8 text-center">
            <FolderGit2 className="mx-auto h-10 w-10 text-gray-300 dark:text-gray-600" />
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              No projects yet. Click &quot;Add Project&quot; to showcase your work.
            </p>
          </div>
        )}
        {projects.map((proj, index) => (
          <Card key={proj.id} className="overflow-hidden border-gray-200 dark:border-gray-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 border-b border-gray-100 dark:border-gray-800 py-3">
              <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Project #{index + 1}
              </CardTitle>
              <RemoveButton onClick={() => removeProject(proj.id)} disabled={projects.length <= 1} />
            </CardHeader>
            <CardContent className="pt-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2 sm:col-span-2">
                  <Label>Project Name</Label>
                  <Input
                    placeholder="AI Resume Builder"
                    value={proj.name}
                    onChange={(e) => updateProject(proj.id, { name: e.target.value })}
                  />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label>Description</Label>
                  <Textarea
                    placeholder="Describe what the project does, your role, and the impact..."
                    rows={3}
                    value={proj.description}
                    onChange={(e) => updateProject(proj.id, { description: e.target.value })}
                    className="resize-none"
                  />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label>Technologies</Label>
                  <Input
                    placeholder="React, TypeScript, Node.js, PostgreSQL"
                    value={proj.technologies}
                    onChange={(e) => updateProject(proj.id, { technologies: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Project Link</Label>
                  <Input
                    type="url"
                    placeholder="https://github.com/user/project"
                    value={proj.link}
                    onChange={(e) => updateProject(proj.id, { link: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label>Start Date</Label>
                    <Input
                      placeholder="Jan 2024"
                      value={proj.startDate}
                      onChange={(e) => updateProject(proj.id, { startDate: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>End Date</Label>
                    <Input
                      placeholder="Mar 2024"
                      value={proj.endDate}
                      onChange={(e) => updateProject(proj.id, { endDate: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label>Highlights</Label>
                  <Textarea
                    placeholder="Key achievements, metrics, or notable features (one per line)..."
                    rows={3}
                    value={proj.highlights}
                    onChange={(e) => updateProject(proj.id, { highlights: e.target.value })}
                    className="resize-none"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </SectionCard>
    </div>
  );
}

/* ─── Step 4: Experience ────────────────────────────────────────────── */

function ExperienceStep() {
  const { resumeData, addExperience, updateExperience, removeExperience } = useAppStore();
  const { experience } = resumeData;

  return (
    <div className="space-y-6">
      <div className="mb-2">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Work Experience</h2>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          List your professional experience, most recent first.
        </p>
      </div>

      <SectionCard title="Experience" icon={Briefcase} onAdd={addExperience} addLabel="Add Experience">
        {experience.length === 0 && (
          <div className="rounded-lg border border-dashed border-gray-300 dark:border-gray-700 p-8 text-center">
            <Briefcase className="mx-auto h-10 w-10 text-gray-300 dark:text-gray-600" />
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              No experience entries yet. Click &quot;Add Experience&quot; to begin.
            </p>
          </div>
        )}
        {experience.map((exp, index) => (
          <Card key={exp.id} className="overflow-hidden border-gray-200 dark:border-gray-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 border-b border-gray-100 dark:border-gray-800 py-3">
              <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Experience #{index + 1}
              </CardTitle>
              <RemoveButton onClick={() => removeExperience(exp.id)} disabled={experience.length <= 1} />
            </CardHeader>
            <CardContent className="pt-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Company</Label>
                  <Input
                    placeholder="Google"
                    value={exp.company}
                    onChange={(e) => updateExperience(exp.id, { company: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Position</Label>
                  <Input
                    placeholder="Software Engineer"
                    value={exp.position}
                    onChange={(e) => updateExperience(exp.id, { position: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Location</Label>
                  <Input
                    placeholder="Mountain View, CA"
                    value={exp.location}
                    onChange={(e) => updateExperience(exp.id, { location: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Start Date</Label>
                  <Input
                    placeholder="Jan 2022"
                    value={exp.startDate}
                    onChange={(e) => updateExperience(exp.id, { startDate: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <div className="flex-1 space-y-2">
                      <Label>End Date</Label>
                      <Input
                        placeholder="Dec 2023"
                        value={exp.endDate}
                        onChange={(e) => updateExperience(exp.id, { endDate: e.target.value })}
                        disabled={exp.current}
                      />
                    </div>
                    <div className="flex items-center gap-2 pt-5">
                      <Checkbox
                        id={`current-${exp.id}`}
                        checked={exp.current}
                        onCheckedChange={(checked) =>
                          updateExperience(exp.id, {
                            current: checked === true,
                            endDate: checked === true ? 'Present' : '',
                          })
                        }
                        className="data-[state=checked]:bg-emerald-600 data-[state=checked]:border-emerald-600"
                      />
                      <Label htmlFor={`current-${exp.id}`} className="text-sm cursor-pointer whitespace-nowrap">
                        Current
                      </Label>
                    </div>
                  </div>
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label>Description</Label>
                  <Textarea
                    placeholder="Describe your responsibilities, achievements, and impact. Use bullet points for readability..."
                    rows={5}
                    value={exp.description}
                    onChange={(e) => updateExperience(exp.id, { description: e.target.value })}
                    className="resize-none"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </SectionCard>
    </div>
  );
}

/* ─── Step 5: Certifications & Achievements ─────────────────────────── */

function CertificationsStep() {
  const {
    resumeData,
    addCertification,
    updateCertification,
    removeCertification,
    addAchievement,
    updateAchievement,
    removeAchievement,
  } = useAppStore();
  const { certifications, achievements } = resumeData;

  return (
    <div className="space-y-8">
      <div className="mb-2">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          Certifications & Achievements
        </h2>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Add your professional certifications and notable achievements.
        </p>
      </div>

      {/* Certifications */}
      <SectionCard
        title="Certifications"
        icon={Award}
        onAdd={addCertification}
        addLabel="Add Certification"
      >
        {certifications.length === 0 && (
          <div className="rounded-lg border border-dashed border-gray-300 dark:border-gray-700 p-6 text-center">
            <Award className="mx-auto h-8 w-8 text-gray-300 dark:text-gray-600" />
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              No certifications added yet.
            </p>
          </div>
        )}
        {certifications.map((cert, index) => (
          <Card key={cert.id} className="overflow-hidden border-gray-200 dark:border-gray-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 border-b border-gray-100 dark:border-gray-800 py-3">
              <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Certification #{index + 1}
              </CardTitle>
              <RemoveButton onClick={() => removeCertification(cert.id)} />
            </CardHeader>
            <CardContent className="pt-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Certification Name</Label>
                  <Input
                    placeholder="AWS Solutions Architect"
                    value={cert.name}
                    onChange={(e) => updateCertification(cert.id, { name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Issuing Organization</Label>
                  <Input
                    placeholder="Amazon Web Services"
                    value={cert.issuer}
                    onChange={(e) => updateCertification(cert.id, { issuer: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Date Obtained</Label>
                  <Input
                    placeholder="Mar 2024"
                    value={cert.date}
                    onChange={(e) => updateCertification(cert.id, { date: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Credential ID</Label>
                  <Input
                    placeholder="ABC-12345"
                    value={cert.credentialId}
                    onChange={(e) => updateCertification(cert.id, { credentialId: e.target.value })}
                  />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label>Credential URL</Label>
                  <Input
                    type="url"
                    placeholder="https://credly.com/badges/..."
                    value={cert.url}
                    onChange={(e) => updateCertification(cert.id, { url: e.target.value })}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </SectionCard>

      <Separator />

      {/* Achievements */}
      <SectionCard
        title="Achievements"
        icon={Sparkles}
        onAdd={addAchievement}
        addLabel="Add Achievement"
      >
        {achievements.length === 0 && (
          <div className="rounded-lg border border-dashed border-gray-300 dark:border-gray-700 p-6 text-center">
            <Sparkles className="mx-auto h-8 w-8 text-gray-300 dark:text-gray-600" />
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              No achievements added yet.
            </p>
          </div>
        )}
        {achievements.map((ach) => (
          <Card key={ach.id} className="overflow-hidden border-gray-200 dark:border-gray-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 border-b border-gray-100 dark:border-gray-800 py-3">
              <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Achievement
              </CardTitle>
              <RemoveButton onClick={() => removeAchievement(ach.id)} />
            </CardHeader>
            <CardContent className="pt-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Title</Label>
                  <Input
                    placeholder="First Place – Hackathon 2024"
                    value={ach.title}
                    onChange={(e) => updateAchievement(ach.id, { title: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Date</Label>
                  <Input
                    placeholder="Oct 2024"
                    value={ach.date}
                    onChange={(e) => updateAchievement(ach.id, { date: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select
                    value={ach.category}
                    onValueChange={(val) => updateAchievement(ach.id, { category: val })}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {ACHIEVEMENT_CATEGORIES.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label>Description</Label>
                  <Textarea
                    placeholder="Briefly describe the achievement..."
                    rows={3}
                    value={ach.description}
                    onChange={(e) => updateAchievement(ach.id, { description: e.target.value })}
                    className="resize-none"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </SectionCard>
    </div>
  );
}

/* ─── Step 6: Review & Template Selection ───────────────────────────── */

/* -- Mini template previews ------------------------------------------------- */

function ClassicPreview() {
  return (
    <div className="h-full w-full rounded-md bg-white p-3 text-[7px] leading-tight shadow-sm border border-gray-200 font-serif overflow-hidden">
      <div className="border-b-2 border-gray-800 pb-1.5 mb-1.5">
        <div className="text-[10px] font-bold text-gray-900">Jane Doe</div>
        <div className="text-[6px] text-gray-500">Software Engineer &bull; jane@email.com</div>
      </div>
      <div className="mb-1.5">
        <div className="text-[7px] font-bold uppercase tracking-wider text-gray-700 border-b border-gray-300 pb-0.5 mb-0.5">
          Experience
        </div>
        <div className="text-[6px] text-gray-400">Google &mdash; Senior Engineer</div>
        <div className="mt-0.5 h-1 bg-gray-100 rounded-sm" />
      </div>
      <div className="mb-1.5">
        <div className="text-[7px] font-bold uppercase tracking-wider text-gray-700 border-b border-gray-300 pb-0.5 mb-0.5">
          Education
        </div>
        <div className="text-[6px] text-gray-400">MIT &mdash; B.S. Computer Science</div>
        <div className="mt-0.5 h-1 bg-gray-100 rounded-sm" />
      </div>
      <div>
        <div className="text-[7px] font-bold uppercase tracking-wider text-gray-700 border-b border-gray-300 pb-0.5 mb-0.5">
          Skills
        </div>
        <div className="flex flex-wrap gap-0.5 mt-0.5">
          <span className="bg-gray-100 text-gray-600 px-1 rounded-sm">React</span>
          <span className="bg-gray-100 text-gray-600 px-1 rounded-sm">TypeScript</span>
          <span className="bg-gray-100 text-gray-600 px-1 rounded-sm">Python</span>
        </div>
      </div>
    </div>
  );
}

function ModernPreview() {
  return (
    <div className="h-full w-full rounded-md bg-white p-3 text-[7px] leading-tight shadow-sm border border-gray-200 overflow-hidden">
      <div className="flex items-start gap-2 mb-2">
        <div className="h-6 w-6 rounded-full bg-emerald-500 flex items-center justify-center text-white text-[8px] font-bold">
          JD
        </div>
        <div>
          <div className="text-[10px] font-bold text-gray-900">Jane Doe</div>
          <div className="text-[6px] text-emerald-600 font-medium">Senior Software Engineer</div>
        </div>
      </div>
      <div className="mb-1.5">
        <div className="text-[7px] font-semibold text-gray-800 mb-0.5">Experience</div>
        <div className="text-[6px] text-gray-400">Google &mdash; Senior Engineer</div>
        <div className="mt-0.5 h-1 bg-emerald-100 rounded-sm" />
      </div>
      <div className="mb-1.5">
        <div className="text-[7px] font-semibold text-gray-800 mb-0.5">Education</div>
        <div className="text-[6px] text-gray-400">MIT &mdash; B.S. Computer Science</div>
        <div className="mt-0.5 h-1 bg-emerald-100 rounded-sm" />
      </div>
      <div>
        <div className="text-[7px] font-semibold text-gray-800 mb-0.5">Skills</div>
        <div className="flex flex-wrap gap-0.5 mt-0.5">
          <span className="bg-emerald-50 text-emerald-700 px-1 rounded-sm">React</span>
          <span className="bg-emerald-50 text-emerald-700 px-1 rounded-sm">TypeScript</span>
          <span className="bg-emerald-50 text-emerald-700 px-1 rounded-sm">Python</span>
        </div>
      </div>
    </div>
  );
}

function CreativePreview() {
  return (
    <div className="h-full w-full rounded-md bg-gray-900 p-3 text-[7px] leading-tight shadow-sm overflow-hidden">
      <div className="flex items-start gap-2 mb-2">
        <div className="h-6 w-6 rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-white text-[8px] font-bold">
          JD
        </div>
        <div>
          <div className="text-[10px] font-bold text-white">Jane Doe</div>
          <div className="text-[6px] text-violet-400 font-medium">Senior Software Engineer</div>
        </div>
      </div>
      <div className="mb-1.5">
        <div className="text-[7px] font-semibold text-violet-300 mb-0.5 uppercase tracking-wider">
          Experience
        </div>
        <div className="text-[6px] text-gray-400">Google &mdash; Senior Engineer</div>
        <div className="mt-0.5 h-0.5 bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-full" />
      </div>
      <div className="mb-1.5">
        <div className="text-[7px] font-semibold text-violet-300 mb-0.5 uppercase tracking-wider">
          Education
        </div>
        <div className="text-[6px] text-gray-400">MIT &mdash; B.S. Computer Science</div>
        <div className="mt-0.5 h-0.5 bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-full" />
      </div>
      <div>
        <div className="text-[7px] font-semibold text-violet-300 mb-0.5 uppercase tracking-wider">
          Skills
        </div>
        <div className="flex flex-wrap gap-0.5 mt-0.5">
          <span className="bg-violet-500/20 text-violet-300 px-1 rounded-sm">React</span>
          <span className="bg-fuchsia-500/20 text-fuchsia-300 px-1 rounded-sm">TypeScript</span>
          <span className="bg-violet-500/20 text-violet-300 px-1 rounded-sm">Python</span>
        </div>
      </div>
    </div>
  );
}

/* -- Template card ---------------------------------------------------------- */

const TEMPLATE_META: {
  name: TemplateName;
  label: string;
  description: string;
  Preview: React.FC;
}[] = [
  {
    name: 'classic',
    label: 'Classic',
    description: 'Traditional layout with serif fonts, clean borders, and timeless design.',
    Preview: ClassicPreview,
  },
  {
    name: 'modern',
    label: 'Modern',
    description: 'Clean minimal design with sans-serif typography and emerald accents.',
    Preview: ModernPreview,
  },
  {
    name: 'creative',
    label: 'Creative',
    description: 'Bold dark theme with gradient accents and geometric styling.',
    Preview: CreativePreview,
  },
];

function TemplateSelection() {
  const { selectedTemplate, setSelectedTemplate } = useAppStore();

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-1">
        <Palette className="h-5 w-5 text-emerald-600" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Choose a Template
        </h3>
      </div>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
        Select a template that matches your professional style.
      </p>
      <div className="grid gap-4 sm:grid-cols-3">
        {TEMPLATE_META.map((tpl) => {
          const isSelected = selectedTemplate === tpl.name;
          return (
            <button
              key={tpl.name}
              type="button"
              onClick={() => setSelectedTemplate(tpl.name)}
              className={`group relative rounded-xl border-2 p-3 text-left transition-all duration-200 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 dark:focus:ring-offset-gray-950 ${
                isSelected
                  ? 'border-emerald-500 bg-emerald-50/50 shadow-sm dark:bg-emerald-950/30'
                  : 'border-gray-200 hover:border-gray-300 dark:border-gray-800 dark:hover:border-gray-700'
              }`}
            >
              {isSelected && (
                <div className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-white">
                  <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              )}
              {/* Mini preview */}
              <div className="aspect-[8.5/11] w-full mb-3 pointer-events-none">
                <tpl.Preview />
              </div>
              <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                {tpl.label}
              </h4>
              <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                {tpl.description}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* -- Review summary --------------------------------------------------------- */

function ReviewSummary() {
  const { resumeData } = useAppStore();
  const { personalInfo, education, skills, projects, experience, certifications, achievements } =
    resumeData;

  const hasContent = (val: string) => val.trim().length > 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-1">
        <FileText className="h-5 w-5 text-emerald-600" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Resume Summary
        </h3>
      </div>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
        Review all the information you&apos;ve entered before generating your resume.
      </p>

      {/* Personal Info */}
      <Card className="border-gray-200 dark:border-gray-800">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-emerald-600" />
            <CardTitle className="text-sm font-semibold">Personal Information</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2 text-sm sm:grid-cols-2">
            {hasContent(personalInfo.fullName) && (
              <div>
                <span className="text-gray-500 dark:text-gray-400">Name:</span>{' '}
                <span className="font-medium text-gray-900 dark:text-gray-100">
                  {personalInfo.fullName}
                </span>
              </div>
            )}
            {hasContent(personalInfo.jobTitle) && (
              <div>
                <span className="text-gray-500 dark:text-gray-400">Title:</span>{' '}
                <span className="font-medium text-gray-900 dark:text-gray-100">
                  {personalInfo.jobTitle}
                </span>
              </div>
            )}
            {hasContent(personalInfo.email) && (
              <div>
                <span className="text-gray-500 dark:text-gray-400">Email:</span>{' '}
                <span className="font-medium text-gray-900 dark:text-gray-100">
                  {personalInfo.email}
                </span>
              </div>
            )}
            {hasContent(personalInfo.phone) && (
              <div>
                <span className="text-gray-500 dark:text-gray-400">Phone:</span>{' '}
                <span className="font-medium text-gray-900 dark:text-gray-100">
                  {personalInfo.phone}
                </span>
              </div>
            )}
            {hasContent(personalInfo.location) && (
              <div>
                <span className="text-gray-500 dark:text-gray-400">Location:</span>{' '}
                <span className="font-medium text-gray-900 dark:text-gray-100">
                  {personalInfo.location}
                </span>
              </div>
            )}
            {hasContent(personalInfo.website) && (
              <div>
                <span className="text-gray-500 dark:text-gray-400">Website:</span>{' '}
                <span className="font-medium text-gray-900 dark:text-gray-100">
                  {personalInfo.website}
                </span>
              </div>
            )}
            {hasContent(personalInfo.linkedin) && (
              <div>
                <span className="text-gray-500 dark:text-gray-400">LinkedIn:</span>{' '}
                <span className="font-medium text-gray-900 dark:text-gray-100">
                  {personalInfo.linkedin}
                </span>
              </div>
            )}
            {hasContent(personalInfo.github) && (
              <div>
                <span className="text-gray-500 dark:text-gray-400">GitHub:</span>{' '}
                <span className="font-medium text-gray-900 dark:text-gray-100">
                  {personalInfo.github}
                </span>
              </div>
            )}
          </div>
          {hasContent(personalInfo.summary) && (
            <div className="mt-3 text-sm">
              <span className="text-gray-500 dark:text-gray-400">Summary:</span>
              <p className="mt-1 text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                {personalInfo.summary}
              </p>
            </div>
          )}
          {!hasContent(personalInfo.fullName) && !hasContent(personalInfo.jobTitle) && (
            <p className="text-sm text-gray-400 italic">No personal information added yet.</p>
          )}
        </CardContent>
      </Card>

      {/* Education */}
      <Card className="border-gray-200 dark:border-gray-800">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <GraduationCap className="h-4 w-4 text-emerald-600" />
            <CardTitle className="text-sm font-semibold">
              Education{' '}
              {education.length > 0 && (
                <Badge variant="secondary" className="ml-1 text-xs">
                  {education.length}
                </Badge>
              )}
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          {education.length === 0 ? (
            <p className="text-sm text-gray-400 italic">No education entries.</p>
          ) : (
            <div className="space-y-2">
              {education.map((edu) => (
                <div key={edu.id} className="rounded-md bg-gray-50 dark:bg-gray-900 p-2.5 text-sm">
                  <div className="font-medium text-gray-900 dark:text-gray-100">
                    {edu.degree || 'Untitled Degree'}
                  </div>
                  <div className="text-gray-500 dark:text-gray-400 text-xs">
                    {[edu.institution, edu.location].filter(Boolean).join(' · ') || 'No details'}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Skills */}
      <Card className="border-gray-200 dark:border-gray-800">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Code2 className="h-4 w-4 text-emerald-600" />
            <CardTitle className="text-sm font-semibold">
              Skills{' '}
              {skills.length > 0 && (
                <Badge variant="secondary" className="ml-1 text-xs">
                  {skills.length}
                </Badge>
              )}
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          {skills.length === 0 ? (
            <p className="text-sm text-gray-400 italic">No skills added.</p>
          ) : (
            <div className="flex flex-wrap gap-1.5">
              {skills
                .filter((s) => hasContent(s.name))
                .map((skill) => (
                  <Badge
                    key={skill.id}
                    variant="outline"
                    className="border-emerald-300 text-emerald-700 dark:border-emerald-800 dark:text-emerald-400"
                  >
                    {skill.name}
                    <span className="ml-1 text-[10px] text-gray-400 capitalize">
                      ({skill.level})
                    </span>
                  </Badge>
                ))}
              {skills.filter((s) => hasContent(s.name)).length === 0 && (
                <p className="text-sm text-gray-400 italic">No named skills yet.</p>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Projects */}
      <Card className="border-gray-200 dark:border-gray-800">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <FolderGit2 className="h-4 w-4 text-emerald-600" />
            <CardTitle className="text-sm font-semibold">
              Projects{' '}
              {projects.length > 0 && (
                <Badge variant="secondary" className="ml-1 text-xs">
                  {projects.length}
                </Badge>
              )}
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          {projects.length === 0 ? (
            <p className="text-sm text-gray-400 italic">No projects added.</p>
          ) : (
            <div className="space-y-2">
              {projects.map((proj) => (
                <div key={proj.id} className="rounded-md bg-gray-50 dark:bg-gray-900 p-2.5 text-sm">
                  <div className="font-medium text-gray-900 dark:text-gray-100">
                    {proj.name || 'Untitled Project'}
                  </div>
                  {proj.technologies && (
                    <div className="flex flex-wrap gap-1 mt-1">
                      {proj.technologies.split(',').map(
                        (tech, i) =>
                          tech.trim() && (
                            <Badge key={i} variant="secondary" className="text-[10px]">
                              {tech.trim()}
                            </Badge>
                          )
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Experience */}
      <Card className="border-gray-200 dark:border-gray-800">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Briefcase className="h-4 w-4 text-emerald-600" />
            <CardTitle className="text-sm font-semibold">
              Experience{' '}
              {experience.length > 0 && (
                <Badge variant="secondary" className="ml-1 text-xs">
                  {experience.length}
                </Badge>
              )}
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          {experience.length === 0 ? (
            <p className="text-sm text-gray-400 italic">No experience entries.</p>
          ) : (
            <div className="space-y-2">
              {experience.map((exp) => (
                <div key={exp.id} className="rounded-md bg-gray-50 dark:bg-gray-900 p-2.5 text-sm">
                  <div className="font-medium text-gray-900 dark:text-gray-100">
                    {exp.position || 'Untitled Position'}
                  </div>
                  <div className="text-gray-500 dark:text-gray-400 text-xs">
                    {[exp.company, exp.location, exp.current ? 'Present' : exp.endDate]
                      .filter(Boolean)
                      .join(' · ') || 'No details'}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Certifications & Achievements */}
      <Card className="border-gray-200 dark:border-gray-800">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Award className="h-4 w-4 text-emerald-600" />
            <CardTitle className="text-sm font-semibold">
              Certifications & Achievements
              {(certifications.length > 0 || achievements.length > 0) && (
                <Badge variant="secondary" className="ml-1 text-xs">
                  {certifications.length + achievements.length}
                </Badge>
              )}
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          {certifications.length === 0 && achievements.length === 0 ? (
            <p className="text-sm text-gray-400 italic">No certifications or achievements.</p>
          ) : (
            <div className="space-y-2">
              {certifications.map((cert) => (
                <div key={cert.id} className="rounded-md bg-gray-50 dark:bg-gray-900 p-2.5 text-sm">
                  <div className="font-medium text-gray-900 dark:text-gray-100">
                    {cert.name || 'Untitled Certification'}
                  </div>
                  <div className="text-gray-500 dark:text-gray-400 text-xs">
                    {[cert.issuer, cert.date].filter(Boolean).join(' · ') || 'No details'}
                  </div>
                </div>
              ))}
              {achievements.map((ach) => (
                <div key={ach.id} className="rounded-md bg-gray-50 dark:bg-gray-900 p-2.5 text-sm">
                  <div className="font-medium text-gray-900 dark:text-gray-100">
                    {ach.title || 'Untitled Achievement'}
                  </div>
                  <div className="text-gray-500 dark:text-gray-400 text-xs">
                    {[ach.category, ach.date].filter(Boolean).join(' · ') || 'No details'}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function ReviewStep() {
  return (
    <div className="space-y-8">
      <div className="mb-2">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          Review & Template Selection
        </h2>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Verify your resume data and pick a template style.
        </p>
      </div>

      <ReviewSummary />
      <Separator />
      <TemplateSelection />
    </div>
  );
}

/* ─── Main Wizard Component ─────────────────────────────────────────── */

const STEP_COMPONENTS: React.FC[] = [
  PersonalInfoStep,
  EducationStep,
  SkillsStep,
  ProjectsStep,
  ExperienceStep,
  CertificationsStep,
  ReviewStep,
];

export default function ResumeWizard() {
  const { currentStep, setCurrentStep, nextStep, prevStep, setCurrentView } = useAppStore();

  const [direction, setDirection] = React.useState(0);

  const progressPercent = useMemo(() => {
    return ((currentStep + 1) / TOTAL_STEPS) * 100;
  }, [currentStep]);

  function goToStep(targetStep: number) {
    setDirection(targetStep > currentStep ? 1 : -1);
    setCurrentStep(targetStep);
  }

  function handleNext() {
    if (currentStep === TOTAL_STEPS - 1) {
      // On the final step, "Next" generates the preview
      setCurrentView('preview');
      return;
    }
    setDirection(1);
    nextStep();
  }

  function handlePrev() {
    setDirection(-1);
    prevStep();
  }

  const StepComponent = STEP_COMPONENTS[currentStep];

  return (
    <div className="mx-auto flex min-h-screen max-w-4xl flex-col bg-gray-50/50 dark:bg-gray-950">
      {/* ── Top Header ─────────────────────────────────────────── */}
      <header className="sticky top-0 z-30 border-b border-gray-200 bg-white/80 backdrop-blur-lg dark:border-gray-800 dark:bg-gray-950/80">
        <div className="px-4 py-4 sm:px-6">
          {/* Title row */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 shadow-sm">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                  AI Resume Builder
                </h1>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Step {currentStep + 1} of {TOTAL_STEPS}
                </p>
              </div>
            </div>
            <div className="hidden sm:flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
              <FileText className="h-3.5 w-3.5" />
              <span>{progressPercent.toFixed(0)}% complete</span>
            </div>
          </div>

          {/* Progress bar */}
          <Progress
            value={progressPercent}
            className="h-2 [&>div]:bg-gradient-to-r [&>div]:from-emerald-500 [&>div]:to-teal-500"
          />

          {/* Step labels */}
          <nav className="mt-3 flex gap-1 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-hide">
            {STEPS.map((step, idx) => {
              const Icon = step.icon;
              const isActive = idx === currentStep;
              const isCompleted = idx < currentStep;

              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => goToStep(idx)}
                  className={`group flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300'
                      : isCompleted
                        ? 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100 dark:bg-emerald-950/30 dark:text-emerald-400 dark:hover:bg-emerald-900/30'
                        : 'text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800 dark:hover:text-gray-300'
                  }`}
                >
                  <Icon
                    className={`h-3.5 w-3.5 ${
                      isActive
                        ? 'text-emerald-600 dark:text-emerald-400'
                        : isCompleted
                          ? 'text-emerald-500'
                          : 'text-gray-300 dark:text-gray-600'
                    }`}
                  />
                  <span className="hidden sm:inline">{step.label}</span>
                  <span className="sm:hidden">{idx + 1}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </header>

      {/* ── Main Content ───────────────────────────────────────── */}
      <main className="flex-1 overflow-y-auto">
        <div className="px-4 py-8 sm:px-6">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={currentStep}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                type: 'spring',
                stiffness: 350,
                damping: 30,
              }}
            >
              <StepComponent />
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* ── Bottom Navigation ──────────────────────────────────── */}
      <footer className="sticky bottom-0 z-30 border-t border-gray-200 bg-white/80 backdrop-blur-lg dark:border-gray-800 dark:bg-gray-950/80">
        <div className="flex items-center justify-between px-4 py-4 sm:px-6">
          <Button
            type="button"
            variant="outline"
            onClick={handlePrev}
            disabled={currentStep === 0}
            className="gap-1.5"
          >
            <ChevronLeft className="h-4 w-4" />
            Back
          </Button>

          <div className="flex items-center gap-2">
            {currentStep === TOTAL_STEPS - 1 && (
              <Button
                type="button"
                variant="outline"
                onClick={() => setCurrentView('preview')}
                className="gap-1.5 border-emerald-300 text-emerald-700 hover:bg-emerald-50 hover:text-emerald-800 dark:border-emerald-700 dark:text-emerald-400 dark:hover:bg-emerald-950"
              >
                <Eye className="h-4 w-4" />
                Preview Resume
              </Button>
            )}

            <Button
              type="button"
              onClick={handleNext}
              className="gap-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-sm hover:from-emerald-700 hover:to-teal-700"
            >
              {currentStep === TOTAL_STEPS - 1 ? (
                <>
                  Generate Resume
                  <Sparkles className="h-4 w-4" />
                </>
              ) : (
                <>
                  Next
                  <ChevronRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </div>
      </footer>
    </div>
  );
}
