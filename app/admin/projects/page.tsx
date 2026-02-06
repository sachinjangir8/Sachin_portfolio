'use client';

import { useEffect, useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { apiRequest } from '@/lib/api';
import toast from 'react-hot-toast';
import { FiPlus, FiEdit, FiTrash2, FiEye, FiEyeOff } from 'react-icons/fi';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { DeleteModal } from '@/components/admin/DeleteModal';

interface Project {
  _id: string;
  title: string;
  description: string;
  techStack: string[];
  category: string;
  categoryName?: string;
  isPublished: boolean;
  createdAt: string;
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [processedProjects, setProcessedProjects] = useState<Project[]>([]);
  
  // Modal State
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<{ id: string; title: string } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchCategories();
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const data = await apiRequest<{ projects: Project[] }>('/api/admin/projects');
      setProjects(data.projects);
    } catch (error) {
      toast.error('Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  // Process projects with category names
  useEffect(() => {
    if (categories.length > 0 && projects.length > 0) {
      const projectsWithCategoryNames = projects.map(project => ({
        ...project,
        categoryName: categories.find(cat => cat._id === project.category)?.name || 'No Category'
      }));
      setProcessedProjects(projectsWithCategoryNames);
    } else {
      setProcessedProjects(projects);
    }
  }, [categories, projects]);

  const fetchCategories = async () => {
    try {
      const data = await apiRequest<{ categories: any[] }>('/api/admin/categories');
      setCategories(data.categories);
    } catch (error) {
      console.error('Failed to load categories');
    }
  };

  const confirmDelete = (id: string, title: string) => {
    setProjectToDelete({ id, title });
    setIsDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!projectToDelete) return;
    
    setIsDeleting(true);
    try {
      await apiRequest(`/api/admin/projects/${projectToDelete.id}`, { method: 'DELETE' });
      toast.success('Project deleted successfully!');
      fetchProjects();
      setIsDeleteModalOpen(false);
      setProjectToDelete(null);
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete project');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleTogglePublish = async (project: Project) => {
    try {
      await apiRequest(`/api/admin/projects/${project._id}`, {
        method: 'PUT',
        body: JSON.stringify({ isPublished: !project.isPublished }),
      });
      toast.success(`Project ${project.isPublished ? 'unpublished' : 'published'}`);
      fetchProjects();
    } catch (error: any) {
      toast.error(error.message || 'Failed to update project');
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="px-4 py-6 sm:px-0">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Projects</h1>
          <Link
            href="/admin/projects/new"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 shadow-sm"
          >
            <FiPlus className="mr-2 h-4 w-4" />
            New Project
          </Link>
        </div>

        <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {processedProjects.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                    No projects found. Create your first project!
                  </td>
                </tr>
              ) : (
                processedProjects.map((project) => (
                  <motion.tr
                    key={project._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">{project.title}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1">
                        {project.description}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {project.categoryName || project.category || 'No Category'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          project.isPublished
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                            : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                        }`}
                      >
                        {project.isPublished ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => handleTogglePublish(project)}
                          className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                          title={project.isPublished ? 'Unpublish' : 'Publish'}
                        >
                          {project.isPublished ? (
                            <FiEyeOff className="h-5 w-5" />
                          ) : (
                            <FiEye className="h-5 w-5" />
                          )}
                        </button>
                        <Link
                          href={`/admin/projects/${project._id}`}
                          className="inline-flex items-center px-3 py-1 text-sm font-medium rounded-md text-primary-600 hover:text-primary-900 dark:text-primary-400 bg-primary-50 hover:bg-primary-100 dark:bg-primary-900/20 dark:hover:bg-primary-900/30 transition-colors"
                          title="Edit project"
                        >
                          <FiEdit className="h-4 w-4 mr-1" />
                          Edit
                        </Link>
                        <button
                          onClick={() => confirmDelete(project._id, project.title)}
                          className="inline-flex items-center px-3 py-1 text-sm font-medium rounded-md text-red-600 hover:text-red-900 dark:text-red-400 bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/30 transition-colors"
                          title={`Delete ${project.title}`}
                        >
                          <FiTrash2 className="h-4 w-4 mr-1" />
                          Delete
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <DeleteModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={handleDelete}
          title="Delete Project"
          message={`Are you sure you want to delete "${projectToDelete?.title}"? This action cannot be undone.`}
          isDeleting={isDeleting}
        />
      </div>
    </AdminLayout>
  );
}
