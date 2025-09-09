import { Head, Link } from '@inertiajs/react';
import DarkModeToggle from '@/Components/DarkModeToggle';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiArrowRight, FiBook, FiUsers, FiActivity, FiAward, FiLayers, FiClock, FiChevronRight, FiCheck, FiArrowUpRight } from 'react-icons/fi';

export default function Welcome({ auth, laravelVersion, phpVersion }) {
  const [loaded, setLoaded] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  useEffect(() => {
    setLoaded(true);
    
    // Auto-rotate features
    const featureInterval = setInterval(() => {
      setActiveFeature(prev => (prev + 1) % features.length);
    }, 5000);
    
    // Auto-rotate testimonials
    const testimonialInterval = setInterval(() => {
      setActiveTestimonial(prev => (prev + 1) % testimonials.length);
    }, 7000);
    
    return () => {
      clearInterval(featureInterval);
      clearInterval(testimonialInterval);
    };
  }, []);

  const features = [
    {
      icon: <FiUsers className="text-2xl" />,
      title: 'Unified Data Management',
      description: 'Seamlessly manage student, teacher, and staff data in one integrated, easy-to-use system.',
      benefits: ['Centralized database', 'Role-based access', 'Real-time updates']
    },
    {
      icon: <FiBook className="text-2xl" />,
      title: 'Digital Academic Tracking',
      description: 'Monitor academic progress and spiritual milestones, like Quran memorization, in real-time.',
      benefits: ['Progress analytics', 'Custom reporting', 'Performance insights']
    },
    {
      icon: <FiActivity className="text-2xl" />,
      title: 'Intelligent Analytics',
      description: 'Gain actionable insights into educational development with our powerful analytics dashboard.',
      benefits: ['Visual dashboards', 'Trend analysis', 'Predictive metrics']
    },
    {
      icon: <FiLayers className="text-2xl" />,
      title: 'Integrated Platform',
      description: 'All tools in one place for seamless educational management experience.',
      benefits: ['Single sign-on', 'Unified interface', 'Cross-platform sync']
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
    },
    {
      avatar: '👨‍💼',
      name: 'Rahman S.',
      role: 'School Director',
      quote: "The analytics capabilities have transformed how we make decisions about curriculum and student support."
    }
  ];

  // Stats data
  const stats = [
    { value: '200+', label: 'Institutions' },
    { value: '50k+', label: 'Active Users' },
    { value: '98%', label: 'Satisfaction Rate' },
    { value: '24/7', label: 'Support' }
  ];

  return (
    <>
      <Head title="Pesment | Modern Education Management System" />
      <div className={`min-h-screen flex flex-col transition-all duration-500 ${loaded ? 'opacity-100' : 'opacity-0'} bg-white dark:bg-gray-900`}>
        
        {/* Background with subtle gradient */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800"></div>
          <div className="absolute top-0 right-0 w-72 h-72 bg-emerald-100 dark:bg-emerald-900/20 rounded-full filter blur-3xl opacity-30 animate-pulse-slow"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-100 dark:bg-blue-900/20 rounded-full filter blur-3xl opacity-20 animate-pulse-slower"></div>
        </div>

        {/* Header */}
        <motion.header 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full bg-white/80 dark:bg-gray-900/80 text-gray-800 dark:text-white backdrop-blur-md z-50 sticky top-0 border-b border-gray-100 dark:border-gray-800"
        >
          <div className="container mx-auto flex justify-between items-center px-6 py-3">
            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="flex items-center space-x-2"
            >
              <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-emerald-500 text-white">
                <FiBook className="h-5 w-5" />
              </div>
              <h1 className="text-xl font-bold text-gray-800 dark:text-white">
                Pesment
              </h1>
            </motion.div>
            <nav className="flex items-center space-x-3">
              <DarkModeToggle />
              {auth.user ? (
                <Link
                  href={route('dashboard')}
                  className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-all duration-300 text-sm font-medium shadow-sm hover:shadow-md"
                >
                  Dashboard
                </Link>
              ) : (
                <>
                  <Link
                    href={route('login')}
                    className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-emerald-500 dark:hover:text-emerald-400 transition-all duration-300 font-medium text-sm"
                  >
                    Log In
                  </Link>
                  <Link
                    href={route('register')}
                    className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-all duration-300 text-sm font-medium shadow-sm hover:shadow-md"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </nav>
          </div>
        </motion.header>

        {/* Hero Section */}
        <section className="flex-1 flex justify-center items-center py-16 relative z-10 px-4">
          <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
              className="space-y-6 text-center md:text-left"
            >
              <motion.h1 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-white leading-tight"
              >
                Modern Education <span className="text-emerald-500 dark:text-emerald-400">Management</span> System
              </motion.h1>
              
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-lg text-gray-600 dark:text-gray-300 max-w-lg mx-auto md:mx-0"
              >
                Streamline your institution's operations with our intuitive platform designed for educators and administrators.
              </motion.p>
              
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start pt-2"
              >
                <Link
                  href={auth.user ? route('dashboard') : route('register')}
                  className="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-all duration-300 text-base font-medium group flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
                >
                  <span>{auth.user ? 'Go to Dashboard' : 'Start Free Trial'}</span>
                  <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href="#features"
                  className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-300 text-base font-medium flex items-center justify-center"
                >
                  Explore Features
                </Link>
              </motion.div>

              {/* Stats */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-8"
              >
                {stats.map((stat, index) => (
                  <div key={index} className="text-center md:text-left">
                    <div className="text-2xl font-bold text-emerald-500 dark:text-emerald-400">{stat.value}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</div>
                  </div>
                ))}
              </motion.div>
            </motion.div>
            
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.8, type: 'spring' }}
              className="flex justify-center"
            >
              <div className="relative">
                <div className="absolute -inset-4 bg-emerald-100 dark:bg-emerald-900/30 rounded-2xl rotate-3"></div>
                <img
                  src="/img/welcome.png"
                  alt="Education Management Dashboard"
                  className="relative w-full max-w-md rounded-xl shadow-xl transition-all duration-500 hover:scale-[1.02]"
                  draggable="false"
                />
              </div>
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-16 bg-gray-50 dark:bg-gray-800/20 relative z-10">
          <div className="container mx-auto px-6">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true, margin: "-100px" }}
              className="text-center max-w-3xl mx-auto mb-16"
            >
              <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">
                Comprehensive Educational Tools
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                Designed to meet all your institutional needs with simplicity and efficiency.
              </p>
            </motion.div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true, margin: "-50px" }}
                  whileHover={{ y: -5 }}
                  className={`bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700 transition-all duration-300 cursor-default shadow-sm hover:shadow-md ${activeFeature === index ? 'ring-2 ring-emerald-500' : ''}`}
                  onClick={() => setActiveFeature(index)}
                >
                  <div className="flex items-start gap-4">
                    <motion.div 
                      className="w-12 h-12 rounded-lg bg-emerald-500/10 flex items-center justify-center flex-shrink-0"
                      whileHover={{ rotate: 5, scale: 1.05 }}
                    >
                      <div className="text-emerald-500">
                        {feature.icon}
                      </div>
                    </motion.div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">{feature.title}</h3>
                      <p className="text-gray-600 dark:text-gray-300 mb-3">{feature.description}</p>
                      <ul className="space-y-1">
                        {feature.benefits.map((benefit, i) => (
                          <li key={i} className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                            <FiCheck className="text-emerald-500 mr-2" size={14} />
                            {benefit}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
            
            {/* Feature Carousel Indicators */}
            <div className="flex justify-center mt-10 gap-1">
              {features.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveFeature(index)}
                  className={`w-3 h-3 rounded-full transition-all ${activeFeature === index ? 'bg-emerald-500' : 'bg-gray-300 dark:bg-gray-600'}`}
                  aria-label={`Feature ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Testimonial Section */}
        <section className="py-16 relative z-10">
          <div className="container mx-auto px-6">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true, margin: "-100px" }}
              className="text-center max-w-3xl mx-auto mb-12"
            >
              <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">
                Trusted by Educational Institutions
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                Hear from our community of educators, administrators, and students.
              </p>
            </motion.div>
            
            <div className="max-w-4xl mx-auto">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTestimonial}
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                  transition={{ duration: 0.5 }}
                  className="bg-white dark:bg-gray-800 p-8 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm"
                >
                  <div className="flex flex-col sm:flex-row items-start gap-6">
                    <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-900/20 flex items-center justify-center text-2xl flex-shrink-0">
                      {testimonials[activeTestimonial].avatar}
                    </div>
                    <div>
                      <p className="text-gray-700 dark:text-gray-300 text-lg italic mb-6">
                        "{testimonials[activeTestimonial].quote}"
                      </p>
                      <div>
                        <h4 className="font-semibold text-gray-800 dark:text-white">
                          {testimonials[activeTestimonial].name}
                        </h4>
                        <p className="text-gray-600 dark:text-gray-400 text-sm">
                          {testimonials[activeTestimonial].role}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Testimonial navigation */}
              <div className="flex justify-center mt-8 gap-2">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveTestimonial(index)}
                    className={`w-2 h-2 rounded-full transition-all ${activeTestimonial === index ? 'bg-emerald-500 w-6' : 'bg-gray-300 dark:bg-gray-600'}`}
                    aria-label={`Testimonial ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-gray-50 dark:bg-gray-800/20 relative z-10">
          <div className="container mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true, margin: "-100px" }}
              className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-2xl p-10 shadow-lg"
            >
              <div className="max-w-3xl mx-auto text-center">
                <h2 className="text-3xl font-bold mb-4">Transform Your Institution Today</h2>
                <p className="text-lg mb-8 text-emerald-100">
                  Join the growing number of schools benefiting from our platform.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link
                    href={auth.user ? route('dashboard') : route('register')}
                    className="px-8 py-3 bg-white text-emerald-600 rounded-lg hover:bg-gray-50 transition-all duration-300 text-base font-medium shadow-md hover:shadow-lg"
                  >
                    {auth.user ? 'Go to Dashboard' : 'Get Started Now'}
                  </Link>
                  <Link
                    href="#"
                    className="px-8 py-3 border border-white/30 text-white rounded-lg hover:bg-white/10 transition-all duration-300 text-base font-medium"
                  >
                    Schedule a Demo
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Footer */}
        <footer className="w-full bg-gray-800 text-white py-12 relative z-50">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
              <div>
                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-emerald-500 mr-2">
                    <FiBook className="text-white" />
                  </div>
                  <h3 className="text-xl font-bold">Pesment</h3>
                </div>
                <p className="text-gray-400 text-sm">
                  The complete management solution for modern educational institutions.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-4 text-gray-200">Product</h4>
                <ul className="space-y-2">
                  <li><Link href="#features" className="text-gray-400 hover:text-white transition text-sm">Features</Link></li>
                  <li><Link href="#" className="text-gray-400 hover:text-white transition text-sm">Pricing</Link></li>
                  <li><Link href="#" className="text-gray-400 hover:text-white transition text-sm">Case Studies</Link></li>
                  <li><Link href="#" className="text-gray-400 hover:text-white transition text-sm">Demo</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-4 text-gray-200">Resources</h4>
                <ul className="space-y-2">
                  <li><Link href="#" className="text-gray-400 hover:text-white transition text-sm">Blog</Link></li>
                  <li><Link href="#" className="text-gray-400 hover:text-white transition text-sm">Documentation</Link></li>
                  <li><Link href="#" className="text-gray-400 hover:text-white transition text-sm">Support</Link></li>
                  <li><Link href="#" className="text-gray-400 hover:text-white transition text-sm">API</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-4 text-gray-200">Company</h4>
                <ul className="space-y-2">
                  <li><Link href="#" className="text-gray-400 hover:text-white transition text-sm">About Us</Link></li>
                  <li><Link href="#" className="text-gray-400 hover:text-white transition text-sm">Careers</Link></li>
                  <li><Link href="#" className="text-gray-400 hover:text-white transition text-sm">Contact</Link></li>
                  <li><Link href="#" className="text-gray-400 hover:text-white transition text-sm">Partners</Link></li>
                </ul>
              </div>
            </div>
            <div className="border-t border-gray-700 pt-8 flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-400 text-sm mb-4 md:mb-0">
                &copy; {new Date().getFullYear()} Pesment. All rights reserved.
              </p>
              <div className="flex space-x-4">
                <Link href="#" className="text-gray-400 hover:text-white transition text-sm">Terms</Link>
                <Link href="#" className="text-gray-400 hover:text-white transition text-sm">Privacy</Link>
                <Link href="#" className="text-gray-400 hover:text-white transition text-sm">Cookies</Link>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}