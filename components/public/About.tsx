'use client';

import { motion } from 'framer-motion';
import { FiUser, FiCode, FiCpu } from 'react-icons/fi';

interface Profile {
  name?: string;
  bio?: string;
}

export function About({ profile }: { profile?: Profile | null }) {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  return (
    <section id="about" className="py-24 px-4 bg-background relative overflow-hidden">
        {/* Decorative background element */}
        <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-primary/5 to-transparent pointer-events-none" />

      <motion.div 
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-100px" }}
        className="max-w-5xl mx-auto relative z-10"
      >
        <div className="flex flex-col md:flex-row items-start gap-12">
            
            {/* Left side: Heading and Highlights */}
            <div className="md:w-1/3 sticky top-24">
                 <motion.span variants={item} className="text-secondary font-medium tracking-wider uppercase text-sm mb-2 block">
                    Get to know me
                </motion.span>
                <motion.h2
                    variants={item}
                    className="text-4xl md:text-5xl font-heading font-bold text-foreground mb-8"
                >
                    About Me
                </motion.h2>
                
                <motion.div variants={item} className="flex flex-col gap-4">
                    <div className="flex items-center gap-4 p-4 rounded-xl bg-card border border-border/50 hover:border-primary/30 transition-colors shadow-sm">
                        <div className="p-3 rounded-lg bg-primary/10 text-primary">
                            <FiUser className="w-6 h-6" />
                        </div>
                        <div>
                            <h4 className="font-bold text-foreground">Experience</h4>
                            <p className="text-sm text-muted-foreground">Full Stack Development</p>
                        </div>
                    </div>
                     <div className="flex items-center gap-4 p-4 rounded-xl bg-card border border-border/50 hover:border-primary/30 transition-colors shadow-sm">
                        <div className="p-3 rounded-lg bg-accent/10 text-accent">
                            <FiCode className="w-6 h-6" />
                        </div>
                        <div>
                            <h4 className="font-bold text-foreground">Clean Code</h4>
                            <p className="text-sm text-muted-foreground">Modern Best Practices</p>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Right side: Bio */}
            <motion.div variants={item} className="md:w-2/3">
                <div className="glass p-8 md:p-10 rounded-3xl border border-white/20 dark:border-white/5 relative">
                     <span className="absolute -top-6 -right-6 text-9xl text-primary/5 font-serif leading-none select-none">"</span>
                    <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
                        {profile?.bio || 'Passionate full-stack developer with expertise in modern web technologies, data science, and user experience design. I build scalable applications and turn complex problems into elegant solutions.'}
                    </p>
                    <p className="mt-6 text-lg md:text-xl text-muted-foreground leading-relaxed">
                        I approach every project with a focus on details, performance, and user experience. My goal is to create digital products that not only look good but also function flawlessly.
                    </p>
                </div>
            </motion.div>
        
        </div>
      </motion.div>
    </section>
  );
}
