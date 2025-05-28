
import { Project, Task, User, CreateProjectInput, CreateTaskInput, UpdateProjectInput, UpdateTaskInput } from '../types/database';

// Simulação de um banco de dados em memória
class DatabaseService {
  private projects: Project[] = [];
  private tasks: Task[] = [];
  private users: User[] = [];

  constructor() {
    this.initializeData();
  }

  private initializeData() {
    // Dados iniciais para demonstração
    const sampleProjects: Project[] = [
      {
        id: '1',
        name: 'Sistema de E-commerce',
        description: 'Desenvolvimento de plataforma de vendas online',
        status: 'active',
        priority: 'high',
        estimatedHours: 120,
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date('2024-01-20')
      },
      {
        id: '2',
        name: 'App Mobile Delivery',
        description: 'Aplicativo para entrega de comida',
        status: 'in-progress',
        priority: 'medium',
        estimatedHours: 80,
        createdAt: new Date('2024-02-01'),
        updatedAt: new Date('2024-02-10')
      }
    ];

    const sampleTasks: Task[] = [
      {
        id: '1',
        title: 'Configurar banco de dados',
        description: 'Criar schema e tabelas iniciais',
        projectId: '1',
        status: 'completed',
        priority: 'high',
        assignee: 'João Silva',
        estimatedHours: 8,
        createdAt: new Date('2024-01-16'),
        updatedAt: new Date('2024-01-18'),
        dueDate: new Date('2024-01-25')
      },
      {
        id: '2',
        title: 'Implementar autenticação',
        description: 'Sistema de login e registro de usuários',
        projectId: '1',
        status: 'in-progress',
        priority: 'high',
        assignee: 'Maria Santos',
        estimatedHours: 12,
        createdAt: new Date('2024-01-19'),
        updatedAt: new Date('2024-01-22'),
        dueDate: new Date('2024-01-30')
      }
    ];

    this.projects = sampleProjects;
    this.tasks = sampleTasks;
  }

  // CRUD Operations for Projects
  createProject(input: CreateProjectInput): Project {
    const project: Project = {
      ...input,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.projects.push(project);
    console.log('Project created:', project);
    return project;
  }

  getProjects(): Project[] {
    return [...this.projects];
  }

  getProjectById(id: string): Project | undefined {
    return this.projects.find(project => project.id === id);
  }

  updateProject(id: string, input: UpdateProjectInput): Project | null {
    const index = this.projects.findIndex(project => project.id === id);
    if (index === -1) return null;

    this.projects[index] = {
      ...this.projects[index],
      ...input,
      updatedAt: new Date()
    };
    console.log('Project updated:', this.projects[index]);
    return this.projects[index];
  }

  deleteProject(id: string): boolean {
    const index = this.projects.findIndex(project => project.id === id);
    if (index === -1) return false;

    // Remover tarefas relacionadas
    this.tasks = this.tasks.filter(task => task.projectId !== id);
    this.projects.splice(index, 1);
    console.log('Project deleted:', id);
    return true;
  }

  // CRUD Operations for Tasks
  createTask(input: CreateTaskInput): Task {
    const task: Task = {
      ...input,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.tasks.push(task);
    console.log('Task created:', task);
    return task;
  }

  getTasks(): Task[] {
    return [...this.tasks];
  }

  getTasksByProject(projectId: string): Task[] {
    return this.tasks.filter(task => task.projectId === projectId);
  }

  getTaskById(id: string): Task | undefined {
    return this.tasks.find(task => task.id === id);
  }

  updateTask(id: string, input: UpdateTaskInput): Task | null {
    const index = this.tasks.findIndex(task => task.id === id);
    if (index === -1) return null;

    this.tasks[index] = {
      ...this.tasks[index],
      ...input,
      updatedAt: new Date()
    };
    console.log('Task updated:', this.tasks[index]);
    return this.tasks[index];
  }

  deleteTask(id: string): boolean {
    const index = this.tasks.findIndex(task => task.id === id);
    if (index === -1) return false;

    this.tasks.splice(index, 1);
    console.log('Task deleted:', id);
    return true;
  }

  // Métodos de busca e filtro
  searchProjects(query: string): Project[] {
    const lowercaseQuery = query.toLowerCase();
    return this.projects.filter(project =>
      project.name.toLowerCase().includes(lowercaseQuery) ||
      project.description.toLowerCase().includes(lowercaseQuery)
    );
  }

  searchTasks(query: string): Task[] {
    const lowercaseQuery = query.toLowerCase();
    return this.tasks.filter(task =>
      task.title.toLowerCase().includes(lowercaseQuery) ||
      task.description.toLowerCase().includes(lowercaseQuery)
    );
  }

  getProjectStats() {
    const total = this.projects.length;
    const active = this.projects.filter(p => p.status === 'active').length;
    const completed = this.projects.filter(p => p.status === 'completed').length;
    
    return { total, active, completed };
  }

  getTaskStats() {
    const total = this.tasks.length;
    const todo = this.tasks.filter(t => t.status === 'todo').length;
    const inProgress = this.tasks.filter(t => t.status === 'in-progress').length;
    const completed = this.tasks.filter(t => t.status === 'completed').length;
    
    return { total, todo, inProgress, completed };
  }
}

export const dbService = new DatabaseService();
