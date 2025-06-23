import { Head, Link } from '@inertiajs/react';
import DarkModeToggle from '@/Components/DarkModeToggle';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiArrowRight, FiBook, FiUsers, FiActivity, FiClock } from 'react-icons/fi';

export default function Welcome({ auth, laravelVersion, phpVersion }) {
  const [loaded, setLoaded] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);

  useEffect(() => {
    setLoaded(true);
    
    // Auto-rotate features
    const interval = setInterval(() => {
      setActiveFeature(prev => (prev + 1) % 3);
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);

  const features = [
    {
      icon: <FiUsers className="text-4xl" />,
      title: 'Manajemen Data Terpadu',
      description: 'Kelola data santri, guru, dan staf dengan sistem terintegrasi yang mudah digunakan'
    },
    {
      icon: <FiBook className="text-4xl" />,
      title: 'Akademik Digital',
      description: 'Pantau perkembangan akademik dan hafalan Al-Quran secara real-time'
    },
    {
      icon: <FiActivity className="text-4xl" />,
      title: 'Analisis Cerdas',
      description: 'Dapatkan insight perkembangan pendidikan dengan dashboard analitik'
    }
  ];

  return (
    <>
      <Head title="Selamat Datang di Pesment" />
      <div className={`bg-gradient-to-br from-emerald-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 min-h-screen flex flex-col transition-colors duration-500 ${loaded ? 'opacity-100' : 'opacity-0'}`}>
        
        {/* Animated Background Elements */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
          <motion.div 
            className="absolute top-20 left-20 w-40 h-40 rounded-full bg-emerald-200/30 dark:bg-emerald-800/20 blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3]
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div 
            className="absolute bottom-20 right-20 w-60 h-60 rounded-full bg-blue-200/30 dark:bg-blue-800/20 blur-3xl"
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.2, 0.4, 0.2]
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2
            }}
          />
        </div>

        {/* Header */}
        <motion.header 
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, type: 'spring' }}
          className="w-full bg-white/80 dark:bg-gray-800/80 text-gray-800 dark:text-white shadow-lg backdrop-blur-md z-50 sticky top-0"
        >
          <div className="container mx-auto flex justify-between items-center px-6 py-4">
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="flex items-center space-x-3"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
              >
                <FiBook className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
              </motion.div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-blue-500 dark:from-emerald-400 dark:to-blue-400 bg-clip-text text-transparent">
                Pesment
              </h1>
            </motion.div>
            <nav className="flex items-center space-x-4">
              <DarkModeToggle />
              {auth.user ? (
                <Link
                  href={route('dashboard')}
                  className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-blue-500 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5"
                >
                  Dashboard
                </Link>
              ) : (
                <>
                  <Link
                    href={route('login')}
                    className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-all duration-300"
                  >
                    Masuk
                  </Link>
                  <Link
                    href={route('register')}
                    className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-blue-500 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5"
                  >
                    Daftar
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
            className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-3xl shadow-2xl p-8 max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-8 transition-all duration-500 hover:shadow-3xl"
          >
            <div className="text-center lg:text-left space-y-6 flex-1">
              <motion.h2 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-white leading-tight"
              >
                Sistem Manajemen <span className="bg-gradient-to-r from-emerald-600 to-blue-500 bg-clip-text text-transparent">Pesantren Modern</span>
              </motion.h2>
              
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-lg text-gray-600 dark:text-gray-300 max-w-lg mx-auto lg:mx-0"
              >
                Transformasi digital untuk pesantren dengan solusi terintegrasi yang memudahkan pengelolaan pendidikan, administrasi, dan spiritualitas.
              </motion.p>
              
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
              >
                <Link
                  href={auth.user ? route('dashboard') : route('register')}
                  className="px-8 py-4 bg-gradient-to-r from-emerald-600 to-blue-500 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 text-lg font-semibold group flex items-center justify-center gap-2"
                >
                  <span>{auth.user ? 'Mulai Sekarang' : 'Coba Gratis'}</span>
                  <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href="#features"
                  className="px-8 py-4 border-2 border-emerald-600 dark:border-gray-600 text-emerald-600 dark:text-white rounded-xl shadow-lg hover:bg-emerald-50 dark:hover:bg-gray-700 transition-all duration-300 text-lg font-semibold"
                >
                  Jelajahi Fitur
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
                alt="Ilustrasi Sistem Pesantren"
                className="w-full max-w-md transition-all duration-500 hover:scale-105"
                draggable="false"
              />
            </motion.div>
          </motion.div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm relative z-10">
          <div className="container mx-auto px-6">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="text-3xl font-bold text-center text-gray-800 dark:text-white mb-4"
            >
              Fitur Unggulan Kami
            </motion.h2>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-lg text-center text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-12"
            >
              Solusi lengkap untuk manajemen pesantren modern dengan teknologi terkini
            </motion.p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -10 }}
                  className={`bg-white dark:bg-gray-700 p-8 rounded-2xl shadow-lg transition-all duration-300 cursor-default ${activeFeature === index ? 'ring-2 ring-emerald-500 scale-[1.02]' : ''}`}
                  onClick={() => setActiveFeature(index)}
                >
                  <div className="text-emerald-600 dark:text-emerald-400 mb-4">
                    {feature.icon}
                  </div>
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
                  className={`w-3 h-3 rounded-full transition-all ${activeFeature === index ? 'bg-emerald-600 w-6' : 'bg-gray-300 dark:bg-gray-600'}`}
                  aria-label={`Feature ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Testimonial Section */}
        <section className="py-20 bg-gradient-to-r from-emerald-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 relative z-10">
          <div className="container mx-auto px-6">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="text-3xl font-bold text-center text-gray-800 dark:text-white mb-12"
            >
              Apa Kata Mereka?
            </motion.h2>
            
            <div className="max-w-4xl mx-auto">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeFeature}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.5 }}
                  className="bg-white dark:bg-gray-700 p-8 rounded-2xl shadow-lg"
                >
                  <div className="flex items-center mb-6">
                    <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-gray-600 flex items-center justify-center text-2xl">
                      {['👨‍🏫', '👳', '🧕'][activeFeature]}
                    </div>
                    <div className="ml-4">
                      <h4 className="font-semibold text-gray-800 dark:text-white">
                        {['Ustadz Ahmad', 'Santri Ali', 'Ibu Guru Siti'][activeFeature]}
                      </h4>
                      <p className="text-gray-600 dark:text-gray-300 text-sm">
                        {['Pengajar', 'Santri', 'Administrator'][activeFeature]}
                      </p>
                    </div>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 italic">
                    "{[
                      "Pesment sangat membantu dalam mengelola kegiatan belajar mengajar di pesantren kami. Sistemnya mudah digunakan dan fiturnya lengkap.",
                      "Sekarang bisa melihat jadwal dan nilai dengan mudah melalui aplikasi. Sangat membantu untuk belajar lebih teratur.",
                      "Administrasi menjadi lebih efisien dengan Pesment. Laporan bisa dibuat dalam hitungan menit."
                    ][activeFeature]}"
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
              className="bg-gradient-to-r from-emerald-600 to-blue-500 text-white rounded-3xl p-8 shadow-2xl"
            >
              <h2 className="text-3xl font-bold mb-4">Siap Transformasi Lembaga Anda Dengan Pesment?</h2>
              <p className="text-lg mb-8 max-w-2xl mx-auto text-emerald-100">
                Bergabunglah dengan ratusan sekolah yang telah menggunakan Pesment untuk manajemen yang lebih baik.
              </p>
              <Link
                href={auth.user ? route('dashboard') : route('register')}
                className="inline-block px-8 py-4 bg-white text-emerald-600 rounded-xl shadow-lg hover:bg-gray-100 transition-all duration-300 text-lg font-semibold"
              >
                {auth.user ? 'Buka Dashboard' : 'Daftar Sekarang'}
              </Link>
            </motion.div>
          </div>
        </section>

        {/* Footer */}
        <footer className="w-full bg-gray-800 text-white py-12 relative z-50">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
              <div>
                <h3 className="text-xl font-bold mb-4 flex items-center">
                  <FiBook className="mr-2 text-emerald-400" />
                  Pesment
                </h3>
                <p className="text-gray-400">
                  Solusi manajemen sekolah modern untuk manajemen sistem pendidikan pesantren yang lebih efisien dan terintegrasi.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Navigasi</h4>
                <ul className="space-y-2">
                  <li><Link href="#" className="text-gray-400 hover:text-white transition">Beranda</Link></li>
                  <li><Link href="#features" className="text-gray-400 hover:text-white transition">Fitur</Link></li>
                  <li><Link href="#" className="text-gray-400 hover:text-white transition">Tentang Kami</Link></li>
                  <li><Link href="#" className="text-gray-400 hover:text-white transition">Kontak</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Legal</h4>
                <ul className="space-y-2">
                  <li><Link href="#" className="text-gray-400 hover:text-white transition">Kebijakan Privasi</Link></li>
                  <li><Link href="#" className="text-gray-400 hover:text-white transition">Syarat & Ketentuan</Link></li>
                  <li><Link href="#" className="text-gray-400 hover:text-white transition">FAQ</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Hubungi Kami</h4>
                <p className="text-gray-400 mb-4">
                  Jl. Nusa indah No. 43, Surakarta
                </p>
                <p className="text-gray-400 mb-4">
                  fauziiwd@pesment.com
                </p>
                <div className="flex space-x-4">
                  <a href="#" className="text-gray-400 hover:text-white transition">
                    <span className="sr-only">Facebook</span>
                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                      <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                    </svg>
                  </a>
                  <a href="#" className="text-gray-400 hover:text-white transition">
                    <span className="sr-only">Instagram</span>
                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                      <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 3.807.058h.468c2.456 0 2.784-.011 3.807-.058.975-.045 1.504-.207 1.857-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-3.807v-.468c0-2.456-.011-2.784-.058-3.807-.045-.975-.207-1.504-.344-1.857a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                    </svg>
                  </a>
                  <a href="#" className="text-gray-400 hover:text-white transition">
                    <span className="sr-only">Twitter</span>
                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                    </svg>
                  </a>
                </div>
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