'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiGithub, FiExternalLink, FiFolder } from 'react-icons/fi';
import { apiRequest } from '@/lib/api';
import Image from 'next/image';

interface Project {
  _id: string;
  title: string;
  description: string;
  techStack: string[];
  category: string;
  liveDemoLink?: string;
  githubLink?: string;
  images: string[];
}

interface Category {
  _id: string;
  name: string;
  slug: string;
}

const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
  };

export function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [selectedCategory]);

  const fetchData = async () => {
    try {
      const [projectsData, categoriesData] = await Promise.all([
        apiRequest<{ projects: Project[] }>('/api/projects?published=true'),
        apiRequest<{ categories: Category[] }>('/api/categories'),
      ]);
      setProjects(projectsData.projects);
      setCategories(categoriesData.categories);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProjects = async () => {
    try {
      const url = selectedCategory === 'all'
        ? '/api/projects?published=true'
        : `/api/projects?published=true&category=${selectedCategory}`;
      const data = await apiRequest<{ projects: Project[] }>(url);
      setProjects(data.projects);
    } catch (error) {
      console.error('Failed to fetch projects:', error);
    }
  };

  // Only filter locally so we don't have flickering if we used client side filtering on the initial batch
  const filteredProjects = selectedCategory === 'all' 
    ? projects // if you want to rely on the server side fetch in useEffect, use that.
    : projects.filter(p => p.category === selectedCategory || selectedCategory === 'all'); // fallback

  if (loading) {
    return (
      <section id="projects" className="py-24 px-4 bg-background">
        <div className="max-w-7xl mx-auto flex justify-center items-center h-64">
           <div className="relative w-16 h-16">
            <motion.span
              className="absolute top-0 left-0 w-full h-full border-4 border-primary/30 rounded-full"
            />
            <motion.span
              className="absolute top-0 left-0 w-full h-full border-4 border-primary border-t-transparent rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="projects" className="py-32 px-4 bg-gradient-to-b from-background to-secondary/20">
      <motion.div 
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-100px" }}
        className="max-w-7xl mx-auto"
      >
        <div className="text-center mb-16">
          <motion.span variants={item} className="text-primary font-medium tracking-wider uppercase text-sm mb-2 block">
            Portfolio
          </motion.span>
          <motion.h2
            variants={item}
            className="text-4xl md:text-5xl font-heading font-bold text-foreground mb-6"
          >
            Featured Projects
          </motion.h2>
          <motion.p
            variants={item}
            className="text-muted-foreground text-lg max-w-2xl mx-auto"
          >
            A collection of work that demonstrates my technical capabilities and creative problem-solving.
          </motion.p>
        </div>

        <motion.div
          variants={item}
          className="flex flex-wrap justify-center gap-3 mb-16"
        >
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
              selectedCategory === 'all'
                ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/25 scale-105'
                : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
            }`}
          >
            All Works
          </button>
          {categories.map((category) => (
            <button
              key={category._id}
              onClick={() => setSelectedCategory(category._id)}
              className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
                selectedCategory === category._id
                  ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/25 scale-105'
                  : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
              }`}
            >
              {category.name}
            </button>
          ))}
        </motion.div>

        <motion.div 
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          <AnimatePresence mode='popLayout'>
            {projects.length === 0 ? (
              <motion.div 
                layout
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="col-span-full text-center py-20 flex flex-col items-center justify-center text-muted-foreground"
              >
                <FiFolder className="w-12 h-12 mb-4 opacity-20" />
                <p>No projects found in this category.</p>
              </motion.div>
            ) : (
              projects.map((project, index) => (
                <motion.div
                  layout
                  key={project._id}
                  variants={item}
                  initial="hidden"
                  animate="show"
                  exit="hidden"
                  className="group relative bg-card rounded-2xl overflow-hidden border border-border/50 hover:border-primary/50 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/5 hover:-translate-y-2 flex flex-col h-full"
                >
                  {/* Image Container */}
                  <div className="relative h-56 w-full overflow-hidden bg-muted">
                    {project.images && project.images.length > 0 ? (
                      <Image
                        src={project.images[0]}
                        alt={project.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                        unoptimized
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-muted-foreground/30">
                        <FiFolder className="w-12 h-12" />
                      </div>
                    )}
                    
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                      <div className="flex gap-3 translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                        {project.githubLink && (
                          <a
                            href={project.githubLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white hover:text-black transition-colors"
                            title="View Code"
                          >
                            <FiGithub className="w-5 h-5" />
                          </a>
                        )}
                        {project.liveDemoLink && (
                          <a
                            href={project.liveDemoLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white hover:text-black transition-colors"
                            title="Live Demo"
                          >
                            <FiExternalLink className="w-5 h-5" />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6 flex flex-col flex-grow">
                    <h3 className="text-xl font-heading font-bold text-card-foreground mb-3 group-hover:text-primary transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-muted-foreground text-sm line-clamp-3 mb-6 flex-grow">
                      {project.description}
                    </p>
                    
                    {/* Footer */}
                    <div className="flex flex-wrap gap-2 mt-auto pt-6 border-t border-border/50">
                      {project.techStack.map((tech, i) => (
                        <span
                          key={i}
                          className="px-2.5 py-1 text-xs font-medium bg-secondary text-secondary-foreground rounded-md"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </section>
  );
}
