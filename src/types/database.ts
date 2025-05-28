
// Modelo de dados para o sistema de gerenciamento

export interface Project {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'completed' | 'on-hold';
  createdAt: Date;
  updatedAt: Date;
  priority: 'low' | 'medium' | 'high';
  estimatedHours?: number;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  projectId: string;
  status: 'todo' | 'in-progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  assignee?: string;
  createdAt: Date;
  updatedAt: Date;
  dueDate?: Date;
  estimatedHours?: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'developer';
  createdAt: Date;
  isActive: boolean;
}

// Tipos para formulários
export type CreateProjectInput = Omit<Project, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateProjectInput = Partial<CreateProjectInput>;
export type CreateTaskInput = Omit<Task, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateTaskInput = Partial<CreateTaskInput>;

// Tipos para filtros e ordenação
export interface ProjectFilters {
  status?: Project['status'];
  priority?: Project['priority'];
  search?: string;
}

export interface TaskFilters {
  status?: Task['status'];
  priority?: Task['priority'];
  projectId?: string;
  assignee?: string;
  search?: string;
}
