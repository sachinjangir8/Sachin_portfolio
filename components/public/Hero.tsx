'use client';

import { motion } from 'framer-motion';
import { FiArrowDown, FiMail } from 'react-icons/fi';

interface Profile {
  name?: string;
  bio?: string;
  contactEmail?: string;
}

export function Hero({ profile }: { profile?: Profile | null }) {
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
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
  };

  return (
    <section className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden bg-background">
      {/* Premium Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Main Gradient Orb */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute -top-[20%] -left-[10%] w-[70vw] h-[70vw] rounded-full bg-gradient-radial from-primary-500/20 via-accent-500/10 to-transparent blur-3xl"
        />
        
        {/* Secondary Orb */}
        <motion.div
           animate={{
            scale: [1, 1.3, 1],
            x: [0, 50, 0],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute -bottom-[20%] -right-[10%] w-[60vw] h-[60vw] rounded-full bg-gradient-radial from-secondary-500/20 via-primary-500/10 to-transparent blur-3xl"
        />

        {/* Grid Pattern Overlay */}
         <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" style={{ opacity: 0.03 }}></div>
      </div>
      
      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="max-w-4xl mx-auto text-center relative z-10 px-6"
      >
        <motion.div variants={item} className="mb-6 inline-block">
          <span className="px-4 py-1.5 rounded-full border border-primary-500/30 bg-primary-500/10 text-primary-600 dark:text-primary-300 text-sm font-medium tracking-wide uppercase">
            Start Creating
          </span>
        </motion.div>

        <motion.h1
          variants={item}
          className="text-6xl md:text-8xl font-heading font-bold mb-8 tracking-tight"
        >
          <span className="block text-foreground">Hello, I'm</span>
          <span className="bg-gradient-to-r from-primary-500 via-accent-500 to-primary-500 bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient">
            {profile?.name || 'Full Stack Developer'}
          </span>
        </motion.h1>

        <motion.p
          variants={item}
          className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed"
        >
          {profile?.bio || 'Building modern web applications and data-driven solutions with precision and passion.'}
        </motion.p>
        
        <motion.div variants={item} className="flex flex-col sm:flex-row items-center justify-center gap-4">
          {profile?.contactEmail && (
            <motion.a
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              href={`mailto:${profile.contactEmail}`}
              className="px-8 py-4 bg-primary text-primary-foreground rounded-xl font-medium shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all duration-300 flex items-center gap-2"
            >
              <FiMail className="w-5 h-5" />
              Get In Touch
            </motion.a>
          )}
           <motion.a
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              href="#projects"
              className="px-8 py-4 bg-secondary text-secondary-foreground rounded-xl font-medium border border-border hover:bg-secondary/80 transition-all duration-300"
            >
              View Work
            </motion.a>
        </motion.div>

      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 1 }}
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <FiArrowDown className="h-6 w-6 text-muted-foreground" />
        </motion.div>
      </motion.div>
    </section>
  );
}
