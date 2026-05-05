import { create } from 'zustand';
import type {
  ResumeData,
  PersonalInfo,
  Education,
  Skill,
  Project,
  Experience,
  Certification,
  Achievement,
  TemplateName,
  AppView,
} from './types';

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

interface AppState {
  // View
  currentView: AppView;
  setCurrentView: (view: AppView) => void;

  // Form step
  currentStep: number;
  setCurrentStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;

  // Resume data
  resumeData: ResumeData;

  // Personal info
  updatePersonalInfo: (data: Partial<PersonalInfo>) => void;

  // Education
  addEducation: () => void;
  updateEducation: (id: string, data: Partial<Education>) => void;
  removeEducation: (id: string) => void;

  // Skills
  addSkill: () => void;
  updateSkill: (id: string, data: Partial<Skill>) => void;
  removeSkill: (id: string) => void;

  // Projects
  addProject: () => void;
  updateProject: (id: string, data: Partial<Project>) => void;
  removeProject: (id: string) => void;

  // Experience
  addExperience: () => void;
  updateExperience: (id: string, data: Partial<Experience>) => void;
  removeExperience: (id: string) => void;

  // Certifications
  addCertification: () => void;
  updateCertification: (id: string, data: Partial<Certification>) => void;
  removeCertification: (id: string) => void;

  // Achievements
  addAchievement: () => void;
  updateAchievement: (id: string, data: Partial<Achievement>) => void;
  removeAchievement: (id: string) => void;

  // Template
  selectedTemplate: TemplateName;
  setSelectedTemplate: (template: TemplateName) => void;

  // AI
  aiSuggestion: string | null;
  setAiSuggestion: (suggestion: string | null) => void;
  isAiLoading: boolean;
  setIsAiLoading: (loading: boolean) => void;
}

const emptyPersonalInfo: PersonalInfo = {
  fullName: '',
  jobTitle: '',
  email: '',
  phone: '',
  location: '',
  website: '',
  linkedin: '',
  github: '',
  summary: '',
};

const emptyEducation = (): Education => ({
  id: generateId(),
  degree: '',
  institution: '',
  location: '',
  startDate: '',
  endDate: '',
  gpa: '',
  description: '',
});

const emptySkill = (): Skill => ({
  id: generateId(),
  name: '',
  level: 'intermediate',
  category: 'Technical',
});

const emptyProject = (): Project => ({
  id: generateId(),
  name: '',
  description: '',
  technologies: '',
  link: '',
  startDate: '',
  endDate: '',
  highlights: '',
});

const emptyExperience = (): Experience => ({
  id: generateId(),
  company: '',
  position: '',
  location: '',
  startDate: '',
  endDate: '',
  current: false,
  description: '',
});

const emptyCertification = (): Certification => ({
  id: generateId(),
  name: '',
  issuer: '',
  date: '',
  credentialId: '',
  url: '',
});

const emptyAchievement = (): Achievement => ({
  id: generateId(),
  title: '',
  description: '',
  date: '',
  category: 'Professional',
});

export const useAppStore = create<AppState>((set) => ({
  // View
  currentView: 'landing',
  setCurrentView: (view) => set({ currentView: view }),

  // Form step
  currentStep: 0,
  setCurrentStep: (step) => set({ currentStep: step }),
  nextStep: () => set((state) => ({ currentStep: Math.min(state.currentStep + 1, 6) })),
  prevStep: () => set((state) => ({ currentStep: Math.max(state.currentStep - 1, 0) })),

  // Resume data
  resumeData: {
    personalInfo: emptyPersonalInfo,
    education: [],
    skills: [],
    projects: [],
    experience: [],
    certifications: [],
    achievements: [],
    selectedTemplate: 'modern',
  },

  // Personal info
  updatePersonalInfo: (data) =>
    set((state) => ({
      resumeData: {
        ...state.resumeData,
        personalInfo: { ...state.resumeData.personalInfo, ...data },
      },
    })),

  // Education
  addEducation: () =>
    set((state) => ({
      resumeData: {
        ...state.resumeData,
        education: [...state.resumeData.education, emptyEducation()],
      },
    })),
  updateEducation: (id, data) =>
    set((state) => ({
      resumeData: {
        ...state.resumeData,
        education: state.resumeData.education.map((e) =>
          e.id === id ? { ...e, ...data } : e
        ),
      },
    })),
  removeEducation: (id) =>
    set((state) => ({
      resumeData: {
        ...state.resumeData,
        education: state.resumeData.education.filter((e) => e.id !== id),
      },
    })),

  // Skills
  addSkill: () =>
    set((state) => ({
      resumeData: {
        ...state.resumeData,
        skills: [...state.resumeData.skills, emptySkill()],
      },
    })),
  updateSkill: (id, data) =>
    set((state) => ({
      resumeData: {
        ...state.resumeData,
        skills: state.resumeData.skills.map((s) =>
          s.id === id ? { ...s, ...data } : s
        ),
      },
    })),
  removeSkill: (id) =>
    set((state) => ({
      resumeData: {
        ...state.resumeData,
        skills: state.resumeData.skills.filter((s) => s.id !== id),
      },
    })),

  // Projects
  addProject: () =>
    set((state) => ({
      resumeData: {
        ...state.resumeData,
        projects: [...state.resumeData.projects, emptyProject()],
      },
    })),
  updateProject: (id, data) =>
    set((state) => ({
      resumeData: {
        ...state.resumeData,
        projects: state.resumeData.projects.map((p) =>
          p.id === id ? { ...p, ...data } : p
        ),
      },
    })),
  removeProject: (id) =>
    set((state) => ({
      resumeData: {
        ...state.resumeData,
        projects: state.resumeData.projects.filter((p) => p.id !== id),
      },
    })),

  // Experience
  addExperience: () =>
    set((state) => ({
      resumeData: {
        ...state.resumeData,
        experience: [...state.resumeData.experience, emptyExperience()],
      },
    })),
  updateExperience: (id, data) =>
    set((state) => ({
      resumeData: {
        ...state.resumeData,
        experience: state.resumeData.experience.map((e) =>
          e.id === id ? { ...e, ...data } : e
        ),
      },
    })),
  removeExperience: (id) =>
    set((state) => ({
      resumeData: {
        ...state.resumeData,
        experience: state.resumeData.experience.filter((e) => e.id !== id),
      },
    })),

  // Certifications
  addCertification: () =>
    set((state) => ({
      resumeData: {
        ...state.resumeData,
        certifications: [...state.resumeData.certifications, emptyCertification()],
      },
    })),
  updateCertification: (id, data) =>
    set((state) => ({
      resumeData: {
        ...state.resumeData,
        certifications: state.resumeData.certifications.map((c) =>
          c.id === id ? { ...c, ...data } : c
        ),
      },
    })),
  removeCertification: (id) =>
    set((state) => ({
      resumeData: {
        ...state.resumeData,
        certifications: state.resumeData.certifications.filter((c) => c.id !== id),
      },
    })),

  // Achievements
  addAchievement: () =>
    set((state) => ({
      resumeData: {
        ...state.resumeData,
        achievements: [...state.resumeData.achievements, emptyAchievement()],
      },
    })),
  updateAchievement: (id, data) =>
    set((state) => ({
      resumeData: {
        ...state.resumeData,
        achievements: state.resumeData.achievements.map((a) =>
          a.id === id ? { ...a, ...data } : a
        ),
      },
    })),
  removeAchievement: (id) =>
    set((state) => ({
      resumeData: {
        ...state.resumeData,
        achievements: state.resumeData.achievements.filter((a) => a.id !== id),
      },
    })),

  // Template
  selectedTemplate: 'modern',
  setSelectedTemplate: (template) => set({ selectedTemplate: template }),

  // AI
  aiSuggestion: null,
  setAiSuggestion: (suggestion) => set({ aiSuggestion: suggestion }),
  isAiLoading: false,
  setIsAiLoading: (loading) => set({ isAiLoading: loading }),
}));
