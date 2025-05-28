
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/hooks/use-toast';
import { Project, Task } from '../types/database';
import { dbService } from '../services/databaseService';
import ProjectCard from '../components/ProjectCard';
import TaskCard from '../components/TaskCard';
import ProjectForm from '../components/ProjectForm';
import TaskForm from '../components/TaskForm';
import StatsCard from '../components/StatsCard';
import { 
  Plus, 
  Search, 
  FolderOpen, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  Database,
  GitBranch,
  Users,
  Activity
} from 'lucide-react';

const Index = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isProjectFormOpen, setIsProjectFormOpen] = useState(false);
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | undefined>();
  const [editingTask, setEditingTask] = useState<Task | undefined>();

  // Carregar dados iniciais
  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setProjects(dbService.getProjects());
    setTasks(dbService.getTasks());
  };

  // Handlers para Projetos
  const handleCreateProject = (projectData: any) => {
    dbService.createProject(projectData);
    loadData();
    toast({
      title: "Projeto criado",
      description: "O projeto foi criado com sucesso!",
    });
  };

  const handleUpdateProject = (projectData: any) => {
    if (editingProject) {
      dbService.updateProject(editingProject.id, projectData);
      loadData();
      setEditingProject(undefined);
      toast({
        title: "Projeto atualizado",
        description: "O projeto foi atualizado com sucesso!",
      });
    }
  };

  const handleDeleteProject = (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este projeto? Todas as tarefas relacionadas também serão removidas.')) {
      dbService.deleteProject(id);
      loadData();
      toast({
        title: "Projeto excluído",
        description: "O projeto foi excluído com sucesso!",
        variant: "destructive"
      });
    }
  };

  // Handlers para Tarefas
  const handleCreateTask = (taskData: any) => {
    dbService.createTask(taskData);
    loadData();
    toast({
      title: "Tarefa criada",
      description: "A tarefa foi criada com sucesso!",
    });
  };

  const handleUpdateTask = (taskData: any) => {
    if (editingTask) {
      dbService.updateTask(editingTask.id, taskData);
      loadData();
      setEditingTask(undefined);
      toast({
        title: "Tarefa atualizada",
        description: "A tarefa foi atualizada com sucesso!",
      });
    }
  };

  const handleDeleteTask = (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta tarefa?')) {
      dbService.deleteTask(id);
      loadData();
      toast({
        title: "Tarefa excluída",
        description: "A tarefa foi excluída com sucesso!",
        variant: "destructive"
      });
    }
  };

  // Filtrar dados por busca
  const filteredProjects = projects.filter(project =>
    project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredTasks = tasks.filter(task =>
    task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    task.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Estatísticas
  const projectStats = dbService.getProjectStats();
  const taskStats = dbService.getTaskStats();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Cabeçalho */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Database className="h-8 w-8 text-blue-600" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Sistema de Gerenciamento
            </h1>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl">
            Gerencie seus projetos e tarefas com eficiência. Modelo de dados robusto com operações CRUD completas.
          </p>
        </div>

        {/* Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Total de Projetos"
            value={projectStats.total}
            icon={FolderOpen}
            description="Projetos no sistema"
            color="text-blue-600"
          />
          <StatsCard
            title="Projetos Ativos"
            value={projectStats.active}
            icon={Activity}
            description="Em desenvolvimento"
            color="text-green-600"
          />
          <StatsCard
            title="Total de Tarefas"
            value={taskStats.total}
            icon={CheckCircle}
            description="Tarefas cadastradas"
            color="text-purple-600"
          />
          <StatsCard
            title="Em Progresso"
            value={taskStats.inProgress}
            icon={Clock}
            description="Tarefas sendo executadas"
            color="text-orange-600"
          />
        </div>

        {/* Controles */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Buscar projetos e tarefas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            <Button 
              onClick={() => setIsProjectFormOpen(true)}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Novo Projeto
            </Button>
            <Button 
              onClick={() => setIsTaskFormOpen(true)}
              variant="outline"
            >
              <Plus className="h-4 w-4 mr-2" />
              Nova Tarefa
            </Button>
          </div>
        </div>

        {/* Abas de Conteúdo */}
        <Tabs defaultValue="projects" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="projects" className="flex items-center gap-2">
              <FolderOpen className="h-4 w-4" />
              Projetos ({filteredProjects.length})
            </TabsTrigger>
            <TabsTrigger value="tasks" className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              Tarefas ({filteredTasks.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="projects">
            {filteredProjects.length === 0 ? (
              <div className="text-center py-12">
                <FolderOpen className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {searchTerm ? 'Nenhum projeto encontrado' : 'Nenhum projeto cadastrado'}
                </h3>
                <p className="text-gray-500 mb-4">
                  {searchTerm 
                    ? 'Tente ajustar sua busca ou criar um novo projeto.'
                    : 'Comece criando seu primeiro projeto.'
                  }
                </p>
                <Button 
                  onClick={() => setIsProjectFormOpen(true)}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Criar Primeiro Projeto
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProjects.map((project) => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    onEdit={(p) => {
                      setEditingProject(p);
                      setIsProjectFormOpen(true);
                    }}
                    onDelete={handleDeleteProject}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="tasks">
            {filteredTasks.length === 0 ? (
              <div className="text-center py-12">
                <CheckCircle className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {searchTerm ? 'Nenhuma tarefa encontrada' : 'Nenhuma tarefa cadastrada'}
                </h3>
                <p className="text-gray-500 mb-4">
                  {searchTerm 
                    ? 'Tente ajustar sua busca ou criar uma nova tarefa.'
                    : 'Comece criando sua primeira tarefa.'
                  }
                </p>
                <Button 
                  onClick={() => setIsTaskFormOpen(true)}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Criar Primeira Tarefa
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onEdit={(t) => {
                      setEditingTask(t);
                      setIsTaskFormOpen(true);
                    }}
                    onDelete={handleDeleteTask}
                  />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Rodapé com informações sobre Git */}
        <div className="mt-12 p-6 bg-white/60 backdrop-blur-sm rounded-lg border border-gray-200">
          <div className="flex items-center gap-3 mb-4">
            <GitBranch className="h-5 w-5 text-gray-600" />
            <h3 className="text-lg font-semibold text-gray-900">Controle de Versão</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-gray-600">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Modelo de Dados Implementado:</h4>
              <ul className="space-y-1">
                <li>• Entidades: Projects, Tasks, Users</li>
                <li>• Relacionamentos: One-to-Many (Project → Tasks)</li>
                <li>• Restrições: Validações e tipos TypeScript</li>
                <li>• Operações CRUD completas</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Práticas de Versionamento:</h4>
              <ul className="space-y-1">
                <li>• Commits frequentes com mensagens descritivas</li>
                <li>• Estrutura organizada em componentes</li>
                <li>• Separação de responsabilidades</li>
                <li>• Documentação de código integrada</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Modais */}
      <ProjectForm
        isOpen={isProjectFormOpen}
        onClose={() => {
          setIsProjectFormOpen(false);
          setEditingProject(undefined);
        }}
        onSubmit={editingProject ? handleUpdateProject : handleCreateProject}
        project={editingProject}
        title={editingProject ? 'Editar Projeto' : 'Novo Projeto'}
      />

      <TaskForm
        isOpen={isTaskFormOpen}
        onClose={() => {
          setIsTaskFormOpen(false);
          setEditingTask(undefined);
        }}
        onSubmit={editingTask ? handleUpdateTask : handleCreateTask}
        task={editingTask}
        projects={projects}
        title={editingTask ? 'Editar Tarefa' : 'Nova Tarefa'}
      />
    </div>
  );
};

export default Index;
