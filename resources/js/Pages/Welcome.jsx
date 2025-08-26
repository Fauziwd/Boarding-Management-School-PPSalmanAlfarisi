import { Head, Link } from '@inertiajs/react';
import DarkModeToggle from '@/Components/DarkModeToggle';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiArrowRight, FiBook, FiUsers, FiActivity, FiAward, FiLayers, FiClock } from 'react-icons/fi';

export default function Welcome({ auth, laravelVersion, phpVersion }) {
  const [loaded, setLoaded] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);

  useEffect(() => {
    setLoaded(true);
    
    // Auto-rotate features/testimonials
    const interval = setInterval(() => {
      setActiveFeature(prev => (prev + 1) % 3);
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);

  const features = [
    {
      icon: <FiUsers className="text-4xl" />,
      title: 'Unified Data Management',
      description: 'Seamlessly manage student, teacher, and staff data in one integrated, easy-to-use system.'
    },
    {
      icon: <FiBook className="text-4xl" />,
      title: 'Digital Academic Tracking',
      description: 'Monitor academic progress and spiritual milestones, like Quran memorization, in real-time.'
    },
    {
      icon: <FiActivity className="text-4xl" />,
      title: 'Intelligent Analytics',
      description: 'Gain actionable insights into educational development with our powerful analytics dashboard.'
    }
  ];

  const testimonials = [
    {
      avatar: '👨‍🏫',
      name: 'Ahmad H.',
      role: 'Head Teacher',
      quote: "Pesment helps us manage our daily teaching activities effortlessly. The system is intuitive and the features are comprehensive."
    },
    {
      avatar: '👳',
      name: 'Ali R.',
      role: 'Student',
      quote: "I can now easily check my schedules and grades through the app. It really helps me stay organized with my studies and progress."
    },
    {
      avatar: '🧕',
      name: 'Siti N.',
      role: 'Administrator',
      quote: "Administration has become incredibly efficient with Pesment. We can generate reports in minutes, not hours."
    }
  ];

  // Educational floating elements
  const floatingElements = [
    { icon: <FiBook />, size: 'w-8 h-8', color: 'text-emerald-500', delay: 0 },
    { icon: <FiAward />, size: 'w-10 h-10', color: 'text-blue-500', delay: 0.5 },
    { icon: <FiLayers />, size: 'w-6 h-6', color: 'text-amber-500', delay: 1 },
    { icon: <FiClock />, size: 'w-9 h-9', color: 'text-purple-500', delay: 1.5 }
  ];

  return (
    <>
      <Head title="Pesment | The OS for Modern Educational Institutions" />
      <div className={`min-h-screen flex flex-col transition-colors duration-500 ${loaded ? 'opacity-100' : 'opacity-0'} bg-white dark:bg-gray-900`}>
        
        {/* Minimalist Blurred Background */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
          <div className="absolute inset-0 bg-[url('/img/classroom-pattern-light.png')] dark:bg-[url('/img/classroom-pattern-dark.png')] bg-fixed opacity-10 dark:opacity-10 blur-[1px]"></div>
          
          {/* Animated Educational Elements */}
          {floatingElements.map((element, index) => (
            <motion.div
              key={index}
              className={`absolute ${element.size} ${element.color} flex items-center justify-center`}
              initial={{
                opacity: 0,
                y: Math.random() * 100,
                x: Math.random() * 100
              }}
              animate={{
                opacity: [0.3, 0.7, 0.3],
                y: [Math.random() * 100, Math.random() * 100 + 50, Math.random() * 100],
                x: [Math.random() * 100, Math.random() * 100 + 50, Math.random() * 100]
              }}
              transition={{
                duration: 15 + Math.random() * 10,
                repeat: Infinity,
                ease: "easeInOut",
                delay: element.delay
              }}
            >
              {element.icon}
            </motion.div>
          ))}
        </div>

        {/* Header */}
        <motion.header 
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, type: 'spring' }}
          className="w-full bg-white/80 dark:bg-gray-900/80 text-gray-800 dark:text-white backdrop-blur-sm z-50 sticky top-0 border-b border-gray-100 dark:border-gray-800"
        >
          <div className="container mx-auto flex justify-between items-center px-6 py-4">
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="flex items-center space-x-3"
            >
              <div className="h-8 w-8 flex items-center justify-center rounded-lg bg-emerald-100 dark:bg-emerald-900/50">
                <FiBook className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
                Pesment
              </h1>
            </motion.div>
            <nav className="flex items-center space-x-4">
              <DarkModeToggle />
              {auth.user ? (
                <Link
                  href={route('dashboard')}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-all duration-300"
                >
                  Dashboard
                </Link>
              ) : (
                <>
                  <Link
                    href={route('login')}
                    className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-all duration-300 font-medium"
                  >
                    Log In
                  </Link>
                  <Link
                    href={route('register')}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-all duration-300 font-medium"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </nav>
          </div>
        </motion.header>

        {/* Hero Section */}
        <section className="flex-1 flex justify-center items-center py-20 relative z-10 px-4">
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl p-8 max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-8 border border-gray-100 dark:border-gray-700"
          >
            <div className="text-center lg:text-left space-y-6 flex-1">
              <motion.h2 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-white leading-tight"
              >
               Modern Education <br className="hidden md:block" /> <span className="text-emerald-600 dark:text-emerald-400">Management System</span>
              </motion.h2>
              
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-lg text-gray-600 dark:text-gray-300 max-w-lg mx-auto lg:mx-0"
              >
                Streamline your institution's operations with our intuitive platform designed for educators and administrators.
              </motion.p>
              
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4"
              >
                <Link
                  href={auth.user ? route('dashboard') : route('register')}
                  className="px-8 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-all duration-300 text-lg font-medium group flex items-center justify-center gap-2"
                >
                  <span>{auth.user ? 'Go to Dashboard' : 'Start Free Trial'}</span>
                  <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href="#features"
                  className="px-8 py-3 border border-emerald-600 dark:border-gray-600 text-emerald-600 dark:text-white rounded-lg hover:bg-emerald-50 dark:hover:bg-gray-700 transition-all duration-300 text-lg font-medium"
                >
                  Explore Features
                </Link>
              </motion.div>
            </div>
            
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.8, type: 'spring' }}
              className="flex-shrink-0"
            >
              <img
                src="/img/welcome.png"
                alt="Illustration of a modern school management system"
                className="w-full max-w-md transition-all duration-500 hover:scale-[1.02]"
                draggable="false"
              />
            </motion.div>
          </motion.div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 relative z-10">
          <div className="container mx-auto px-6">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="text-3xl font-bold text-center text-gray-800 dark:text-white mb-4"
            >
              Comprehensive Educational Tools
            </motion.h2>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-lg text-center text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-12"
            >
              Designed to meet all your institutional needs with simplicity and efficiency.
            </motion.p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -5 }}
                  className={`bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700 transition-all duration-300 cursor-default ${activeFeature === index ? 'ring-1 ring-emerald-500' : ''}`}
                  onClick={() => setActiveFeature(index)}
                >
                  <motion.div 
                    className="w-14 h-14 rounded-lg bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center mb-4"
                    whileHover={{ rotate: 10, scale: 1.1 }}
                  >
                    <div className="text-emerald-600 dark:text-emerald-400">
                      {feature.icon}
                    </div>
                  </motion.div>
                  <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">{feature.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300">{feature.description}</p>
                </motion.div>
              ))}
            </div>
            
            {/* Feature Carousel Indicators */}
            <div className="flex justify-center mt-8 gap-2">
              {features.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveFeature(index)}
                  className={`w-2 h-2 rounded-full transition-all ${activeFeature === index ? 'bg-emerald-600 w-4' : 'bg-gray-300 dark:bg-gray-600'}`}
                  aria-label={`Feature ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Testimonial Section */}
        <section className="py-20 bg-gray-50 dark:bg-gray-800/30 relative z-10">
          <div className="container mx-auto px-6">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="text-3xl font-bold text-center text-gray-800 dark:text-white mb-12"
            >
              Trusted by Educational Institutions
            </motion.h2>
            
            <div className="max-w-4xl mx-auto">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeFeature}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.5 }}
                  className="bg-white dark:bg-gray-800 p-8 rounded-xl border border-gray-100 dark:border-gray-700"
                >
                  <div className="flex items-center mb-6">
                    <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-gray-700 flex items-center justify-center text-2xl">
                      {testimonials[activeFeature].avatar}
                    </div>
                    <div className="ml-4">
                      <h4 className="font-semibold text-gray-800 dark:text-white">
                        {testimonials[activeFeature].name}
                      </h4>
                      <p className="text-gray-600 dark:text-gray-300 text-sm">
                        {testimonials[activeFeature].role}
                      </p>
                    </div>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 italic text-lg">
                    "{testimonials[activeFeature].quote}"
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 relative z-10">
          <div className="container mx-auto px-6 text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="bg-emerald-600 text-white rounded-2xl p-8 border border-emerald-700 dark:border-emerald-500"
            >
              <h2 className="text-3xl font-bold mb-4">Transform Your Institution Today</h2>
              <p className="text-lg mb-8 max-w-2xl mx-auto text-emerald-100">
                Join the growing number of schools benefiting from our platform.
              </p>
              <Link
                href={auth.user ? route('dashboard') : route('register')}
                className="inline-block px-8 py-3 bg-white text-emerald-600 rounded-lg hover:bg-gray-100 transition-all duration-300 text-lg font-medium"
              >
                {auth.user ? 'Go to Dashboard' : 'Get Started Now'}
              </Link>
            </motion.div>
          </div>
        </section>

        {/* Footer */}
        <footer className="w-full bg-gray-800 text-white py-12 relative z-50 border-t border-gray-700">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
              <div>
                <h3 className="text-xl font-bold mb-4 flex items-center">
                  <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-emerald-600 mr-2">
                    <FiBook className="text-white" />
                  </div>
                  Pesment
                </h3>
                <p className="text-gray-400">
                  The complete management solution for modern educational institutions.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Navigation</h4>
                <ul className="space-y-2">
                  <li><Link href="#" className="text-gray-400 hover:text-white transition">Home</Link></li>
                  <li><Link href="#features" className="text-gray-400 hover:text-white transition">Features</Link></li>
                  <li><Link href="#" className="text-gray-400 hover:text-white transition">About Us</Link></li>
                  <li><Link href="#" className="text-gray-400 hover:text-white transition">Contact</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Legal</h4>
                <ul className="space-y-2">
                  <li><Link href="#" className="text-gray-400 hover:text-white transition">Privacy Policy</Link></li>
                  <li><Link href="#" className="text-gray-400 hover:text-white transition">Terms & Conditions</Link></li>
                  <li><Link href="#" className="text-gray-400 hover:text-white transition">FAQ</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Contact Us</h4>
                <p className="text-gray-400 mb-2">
                  Jl. Nusa Indah No. 43, Surakarta, Indonesia
                </p>
                <p className="text-gray-400">
                  contact@pesment.com
                </p>
              </div>
            </div>
            <div className="border-t border-gray-700 pt-8">
              <p className="text-gray-400 text-center">
                &copy; {new Date().getFullYear()} Pesment. All rights reserved.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}