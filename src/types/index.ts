export const Role = {
  ADMIN: 'ADMIN',
  COLLABORATOR: 'COLLABORATOR',
  VISITOR: 'VISITOR',
} as const;

export type Role = typeof Role[keyof typeof Role];

export const PublicationType = {
  ARTICLE: 'ARTICLE',
  CONFERENCE: 'CONFERENCE',
  BOOK_CHAPTER: 'BOOK_CHAPTER',
  THESIS: 'THESIS',
  PATENT: 'PATENT',
  POSTER: 'POSTER',
} as const;

export type PublicationType = typeof PublicationType[keyof typeof PublicationType];

export const CourseLevel = {
  LICENCE: 'LICENCE',
  MASTER: 'MASTER',
  INGENIEUR: 'INGENIEUR',
  DOCTORAT: 'DOCTORAT',
} as const;

export type CourseLevel = typeof CourseLevel[keyof typeof CourseLevel];

export const SupervisionLevel = {
  INGENIEUR: 'INGENIEUR',
  MASTER_2: 'MASTER_2',
  DOCTORAT: 'DOCTORAT',
  POST_DOC: 'POST_DOC',
} as const;

export type SupervisionLevel = typeof SupervisionLevel[keyof typeof SupervisionLevel];

export const SupervisionStatus = {
  IN_PROGRESS: 'IN_PROGRESS',
  COMPLETED: 'COMPLETED',
  ABANDONED: 'ABANDONED',
} as const;

export type SupervisionStatus = typeof SupervisionStatus[keyof typeof SupervisionStatus];

// ==================== USER & AUTH ====================

export interface User {
  id: string;
  email: string;
  role: Role;
  createdAt: string;
  updatedAt: string;
  profile?: Profile;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    accessToken: string;
    refreshToken: string;
  };
}

export interface ChangePasswordData {
  oldPassword: string;
  newPassword: string;
}

export interface ForgotPasswordData {
  email: string;
}

export interface ResetPasswordData {
  token: string;
  newPassword: string;
}

// ==================== PROFILE ====================

export interface Profile {
  id: string;
  userId: string;
  fullName: string;
  title: string;
  bio: string;
  about?: string;
  photoUrl?: string;
  cvUrl?: string;
  specializations: string[];
  degrees: string[];
  institution?: string;
  department?: string;
  email?: string;
  phone?: string;
  officeLocation?: string;
  googleScholar?: string;
  researchGate?: string;
  orcid?: string;
  linkedin?: string;
  website?: string;
  createdAt: string;
  updatedAt: string;
  user?: User;
}

export interface ProfileFormData {
  fullName: string;
  title: string;
  bio: string;
  photo?: File;
  cv?: File;
  specializations: string[];
  degrees: string[];
  institution?: string;
  department?: string;
  email?: string;
  phone?: string;
  officeLocation?: string;
  googleScholar?: string;
  researchGate?: string;
  orcid?: string;
  linkedin?: string;
  website?: string;
}

// ==================== PUBLICATION ====================

export interface Publication {
  id: string;
  userId: string;
  title: string;
  abstract: string;
  authors: string[];
  journal?: string;
  conference?: string;
  publicationDate: string;
  year: number;
  volume?: string;
  issue?: string;
  pages?: string;
  publisher?: string;
  doi?: string;
  isbn?: string;
  issn?: string;
  pdfUrl?: string;
  type: PublicationType;
  keywords: string[];
  citations: number;
  slug: string;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
  user?: User;
  collaborators?: Collaborator[];
}

export interface PublicationFormData {
  title: string;
  abstract: string;
  authors: string[];
  journal?: string;
  conference?: string;
  publicationDate: string;
  year: number;
  volume?: string;
  issue?: string;
  pages?: string;
  publisher?: string;
  doi?: string;
  isbn?: string;
  issn?: string;
  pdf?: File;
  type: PublicationType;
  keywords: string[];
  citations: number;
  isPublished: boolean;
}

export interface PublicationFilters {
  type?: PublicationType;
  year?: number;
  keywords?: string;
  search?: string;
  page?: number;
  limit?: number;
}

// ==================== COURSE ====================

export interface Course {
  id: string;
  userId: string;
  title: string;
  code?: string;
  level: CourseLevel;
  description: string;
  credits?: number;
  hours?: number;
  semester?: string;
  syllabus?: string;
  objectives: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  user?: User;
}

export interface CourseFormData {
  title: string;
  code?: string;
  level: CourseLevel;
  description: string;
  credits?: number;
  hours?: number;
  semester?: string;
  syllabus?: string;
  objectives: string[];
  isActive: boolean;
}

// ==================== SUPERVISION ====================

export interface Supervision {
  id: string;
  userId: string;
  studentName: string;
  level: SupervisionLevel;
  topic: string;
  description?: string;
  startDate: string;
  endDate?: string;
  status: SupervisionStatus;
  thesisUrl?: string;
  publications: string[];
  createdAt: string;
  updatedAt: string;
  user?: User;
}

export interface SupervisionFormData {
  studentName: string;
  level: SupervisionLevel;
  topic: string;
  description?: string;
  startDate: string;
  endDate?: string;
  status: SupervisionStatus;
  thesisUrl?: string;
  publications: string[];
  thesis?: File | string;
}

// ==================== COLLABORATOR ====================

export interface Collaborator {
  id: string;
  userId: string;
  name: string;
  title?: string;
  institution: string;
  department?: string;
  country?: string;
  email?: string;
  website?: string;
  photoUrl?: string;
  researchArea?: string;
  googleScholar?: string;
  orcid?: string;
  createdAt: string;
  updatedAt: string;
  user?: User;
  publications?: Publication[];
  _count?: {
    publications: number;
  };
}

export interface CollaboratorFormData {
  name: string;
  title?: string;
  institution: string;
  department?: string;
  country?: string;
  email?: string;
  website?: string;
  photo?: File;
  researchArea?: string;
  googleScholar?: string;
  orcid?: string;
}

// ==================== CONTACT ====================

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  isRead: boolean;
  sentAt: string;
}

export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

// ==================== STATISTICS ====================

export interface Statistics {
  users: {
    total: number;
    admins: number;
    visitors: number;
  };
  publications: {
    total: number;
    published: number;
  };
  courses: {
    total: number;
  };
  supervisions: {
    total: number;
    active: number;
  };
  collaborators: {
    total: number;
  };
  messages: {
    unread: number;
  };
}

// ==================== API RESPONSES ====================

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

export interface PaginatedResponse<T = any> {
  success: boolean;
  message: string;
  data: {
    items: T[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
  };
}

// ==================== REDUX STATE ====================

export interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

export interface ProfileState {
  profile: Profile | null;
  loading: boolean;
  error: string | null;
}

export interface PublicationsState {
  publications: Publication[];
  currentPublication: Publication | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  } | null;
  loading: boolean;
  error: string | null;
}

export interface CoursesState {
  courses: Course[];
  currentCourse: Course | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  } | null;
  loading: boolean;
  error: string | null;
}

export interface SupervisionsState {
  supervisions: Supervision[];
  currentSupervision: Supervision | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  } | null;
  loading: boolean;
  error: string | null;
}

export interface CollaboratorsState {
  collaborators: Collaborator[];
  currentCollaborator: Collaborator | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  } | null;
  loading: boolean;
  error: string | null;
}

export interface ContactState {
  messages: ContactMessage[];
  currentMessage: ContactMessage | null;
  stats: {
    total: number;
    read: number;
    unread: number;
  } | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  } | null;
  loading: boolean;
  error: string | null;
}

export interface RootState {
  auth: AuthState;
  profile: ProfileState;
  publications: PublicationsState;
  courses: CoursesState;
  supervisions: SupervisionsState;
  collaborators: CollaboratorsState;
  contact: ContactState;
}
