export interface Project {
  id: string;
  title: string;
  slug: string;
  description: string;
  coverImage: string | null;
  liveUrl: string | null;
  githubUrl: string | null;
  tags: string;
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
}

export interface ProjectFormData {
  title: string;
  slug: string;
  description: string;
  coverImage: string;
  liveUrl: string;
  githubUrl: string;
  tags: string[];
  featured: boolean;
}

export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}
