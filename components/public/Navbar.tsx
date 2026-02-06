'use client';

import Link from 'next/link';
import { ThemeToggle } from '@/components/shared/ThemeToggle';
import { motion, useScroll, useTransform } from 'framer-motion';
import { FiGithub, FiLinkedin, FiTwitter, FiFileText } from 'react-icons/fi';
import { useEffect, useState } from 'react';

interface Profile {
  githubLink?: string;
  linkedinLink?: string;
  twitterLink?: string;
  resumeLink?: string;
}

export function Navbar({ profile }: { profile?: Profile | null }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const { scrollY } = useScroll();
  
  // Transform for the nav container width/padding on scroll
  const navWidth = useTransform(scrollY, [0, 100], ["100%", "90%"]);
  const navTop = useTransform(scrollY, [0, 100], ["0px", "20px"]);
  const navRadius = useTransform(scrollY, [0, 100], ["0px", "50px"]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { href: '#projects', label: 'Projects' },
    { href: '#tech-stack', label: 'Stack' },
    { href: '#qualifications', label: 'Experience' },
    { href: '#about', label: 'About' },
  ];

  const socialLinks = [
    { href: profile?.githubLink, icon: <FiGithub className="h-5 w-5" />, label: 'GitHub' },
    { href: profile?.linkedinLink, icon: <FiLinkedin className="h-5 w-5" />, label: 'LinkedIn' },
    { href: profile?.twitterLink, icon: <FiTwitter className="h-5 w-5" />, label: 'Twitter' },
  ];

  return (
    <motion.div
      className="fixed z-50 left-0 right-0 flex justify-center pointer-events-none"
      style={{
        width: "100%",
        top: navTop,
      }}
    >
      <motion.nav
        style={{
          width: navWidth,
          borderRadius: navRadius,
        }}
        className={`pointer-events-auto transition-all duration-500 ease-in-out border border-transparent
          ${isScrolled 
            ? 'glass border-white/20 shadow-xl max-w-5xl bg-white/70 dark:bg-black/60' 
            : 'bg-transparent'
          }`}
      >
        <div className="px-6 sm:px-8">
          <div className="flex justify-between items-center h-16 md:h-20">
            {/* Logo */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex-shrink-0"
            >
              <Link href="/" className="group flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-primary-600 to-accent-500 flex items-center justify-center text-white font-bold text-xl group-hover:shadow-[0_0_20px_rgba(99,102,241,0.5)] transition-all duration-300">
                  P
                </div>
                <span className="text-xl font-heading font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300">
                  Portfolio
                </span>
              </Link>
            </motion.div>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center space-x-8">
              {navItems.map((item, index) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="relative text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors group"
                >
                  {item.label}
                  <span className="absolute -bottom-1 left-1/2 w-0 h-0.5 bg-primary-500 group-hover:w-full group-hover:left-0 transition-all duration-300 ease-out" />
                </Link>
              ))}
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-4">
               {/* Resume Button */}
              {profile?.resumeLink && (
                  <motion.a
                    href={profile.resumeLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="hidden lg:flex items-center px-4 py-2 text-sm font-medium text-white bg-gray-900 dark:bg-white dark:text-gray-900 rounded-full hover:shadow-lg hover:shadow-primary-500/20 transition-all duration-300"
                  >
                    <FiFileText className="mr-2 h-4 w-4" />
                    Resume
                  </motion.a>
              )}

              <div className="flex items-center gap-3 pl-4 border-l border-gray-200 dark:border-gray-800">
                  {socialLinks.filter(l => l.href).map((link, i) => (
                    <motion.a
                      key={i}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-500 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400 transition-colors"
                      whileHover={{ y: -2, rotate: 5 }}
                    >
                      {link.icon}
                    </motion.a>
                  ))}
                  <ThemeToggle />
              </div>
            </div>
          </div>
        </div>
      </motion.nav>
    </motion.div>
  );
}
