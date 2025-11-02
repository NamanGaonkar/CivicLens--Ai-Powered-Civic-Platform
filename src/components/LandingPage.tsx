import { motion } from "framer-motion";
import Particles from "./Particles";
import { 
  MapPin, 
  Camera, 
  Brain, 
  BarChart3, 
  Users, 
  Globe,
  ArrowRight,
  CheckCircle,
  Star,
  Sparkles,
  MessageSquare
} from "lucide-react";
// AI chatbot is shown only on the dashboard now

interface LandingPageProps {
  onGetStarted: () => void;
  isAuthenticated?: boolean;
}

export function LandingPage({ onGetStarted, isAuthenticated = false }: LandingPageProps) {
  const features = [
    {
      icon: <Camera className="w-8 h-8" />,
      title: "AI-Powered Image Analysis",
      description: "Upload photos and let our AI automatically categorize and prioritize civic issues",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: <MapPin className="w-8 h-8" />,
      title: "Real-time Location Tracking",
      description: "Precise GPS coordinates and interactive maps for accurate issue reporting",
      color: "from-green-500 to-emerald-500"
    },
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: "Advanced Analytics Dashboard",
      description: "Comprehensive insights and trends to help city officials make data-driven decisions",
      color: "from-purple-500 to-violet-500"
    },
    {
      icon: <Brain className="w-8 h-8" />,
      title: "Smart Prioritization",
      description: "Machine learning algorithms automatically assess urgency and route issues efficiently",
      color: "from-orange-500 to-red-500"
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Community Engagement",
      description: "Upvoting, commenting, and collaborative problem-solving for better communities",
      color: "from-pink-500 to-rose-500"
    },
    {
      icon: <MessageSquare className="w-8 h-8" />,
      title: "AI Chat Assistant",
      description: "Upload images and ask questions - our AI helps you understand issues and solutions",
      color: "from-cyan-500 to-blue-500"
    }
  ];

  const stats = [
    { number: "10K+", label: "Issues Resolved", icon: <CheckCircle className="w-6 h-6" /> },
    { number: "50+", label: "Cities Connected", icon: <Globe className="w-6 h-6" /> },
    { number: "24/7", label: "Support", icon: <Sparkles className="w-6 h-6" /> },
    { number: "4.9★", label: "User Rating", icon: <Star className="w-6 h-6" /> }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-red-100 to-blue-50 relative overflow-hidden">
      {/* Background gradient with Material UI theme */}
      <div className="absolute inset-0 -z-30">
        <div className="absolute inset-0 bg-gradient-to-br from-sky-50 via-blue-50 to-slate-100"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(14,165,233,0.15),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,rgba(30,58,138,0.1),transparent_50%)]"></div>
      </div>
      
      {/* Particle background (uses dynamic import of ogl) */}
      <Particles particleCount={220} particleSpread={12} speed={0.12} className="-z-20" />
      
      {/* Animated Background */}
      <div className="absolute inset-0 -z-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(100,200,255,0.1),rgba(255,255,255,0))]"></div>
        {/* Floating Particles */}
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-white/20 rounded-full"
            animate={{
              x: [0, 100, 0],
              y: [0, -100, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              delay: Math.random() * 5,
            }}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>

      {/* Top Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-6 lg:px-8 py-6 backdrop-blur-lg">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          {/* Logo on the left */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center space-x-2"
          >
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-red-600 to-blue-900 flex items-center justify-center shadow-lg transition-all">
              <span className="text-white font-bold text-lg">C</span>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-red-600 to-blue-900 bg-clip-text text-transparent">CivicLens</span>
          </motion.div>

          {/* Get started and Demo buttons on the right */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="flex space-x-3"
          >
            <motion.button
              onClick={onGetStarted}
              className="px-6 py-2 bg-gradient-to-r from-sky-500 to-blue-600 text-white font-semibold rounded-lg text-sm shadow-lg hover:shadow-sky-400/50 transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {isAuthenticated ? "Go to Dashboard" : "Get started"}
            </motion.button>

            {isAuthenticated && (
              <button className="px-6 py-2 border-2 border-blue-300 text-slate-900 rounded-lg bg-white/80 hover:bg-white backdrop-blur-md text-sm font-semibold transition-all shadow-sm">
                Watch demo
              </button>
            )}
          </motion.div>
        </div>
      </nav>

      <div className="relative z-10 pt-24">
        {/* Hero Section - Centered */}
        <section className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            {/* Interactive Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              whileHover={{ scale: 1.05 }}
              className="inline-flex items-center space-x-2 bg-sky-200/40 backdrop-blur-xl border border-sky-300/60 rounded-full px-6 py-3 mb-8 cursor-pointer hover:bg-sky-200/60 transition-all shadow-lg"
            >
              <Sparkles className="w-4 h-4 text-sky-600" />
              <span className="text-slate-900 font-medium">Revolutionizing Civic Engagement</span>
              <motion.div
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <ArrowRight className="w-4 h-4 text-sky-600" />
              </motion.div>
            </motion.div>

            {/* Main Heading - Centered */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mb-8"
            >
              <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-black leading-tight mb-6">
                <span className="bg-gradient-to-r from-red-600 via-blue-900 to-black bg-clip-text text-transparent">
                  CivicLens
                </span>
              </h1>
              <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-slate-900 leading-relaxed max-w-3xl mx-auto px-2">
                Transform how your city reports and resolves civic issues. From image analysis to real-time maps—powered by AI.
              </p>
            </motion.div>

            {/* Interactive CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-4 mb-12 px-4 sm:px-0 w-full"
            >
                {!isAuthenticated ? (
                  <>
                    <motion.button
                      onClick={onGetStarted}
                      className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-red-600 to-blue-900 text-white font-bold rounded-lg sm:rounded-xl text-base sm:text-lg shadow-xl transition-all group"
                      whileHover={{ scale: 1.05, y: -5 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <span className="flex items-center justify-center space-x-2">
                        <span>Start Now</span>
                        <ArrowRight className="w-4 sm:w-5 h-4 sm:h-5 group-hover:translate-x-1 transition-transform" />
                      </span>
                    </motion.button>

                    <motion.button
                      className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 border-2 border-red-300 text-slate-900 font-bold rounded-lg sm:rounded-xl text-base sm:text-lg bg-white/70 hover:bg-white transition-all group backdrop-blur-md shadow-lg"
                      whileHover={{ scale: 1.05, y: -5 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <span className="flex items-center space-x-2">
                        <span>Watch Demo</span>
                        <motion.div
                          animate={{ rotate: [0, 360] }}
                          transition={{ duration: 3, repeat: Infinity }}
                        >
                          <Sparkles className="w-5 h-5" />
                        </motion.div>
                      </span>
                    </motion.button>
                  </>
                ) : (
                  <motion.button
                    onClick={onGetStarted}
                    className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-red-600 to-blue-900 text-white font-bold rounded-lg sm:rounded-xl text-base sm:text-lg shadow-xl transition-all"
                    whileHover={{ scale: 1.03 }}
                  >
                    Go to Dashboard
                  </motion.button>
                )}
            </motion.div>

            {/* Video Section - Civic Sense */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="max-w-2xl mx-auto mt-12"
            >
              <motion.div
                className="relative w-full rounded-2xl shadow-2xl border-2 border-sky-300/50 hover:border-sky-400/70 transition-all overflow-hidden bg-black"
                whileHover={{ scale: 1.02, y: -5 }}
                transition={{ type: "spring", stiffness: 300 }}
                style={{ paddingBottom: "56.25%" }}
              >
                <iframe
                  className="absolute top-0 left-0 w-full h-full"
                  src="https://www.youtube.com/embed/zNR5ZB3ApdU"
                  title="Why India Lacks Civic Sense"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </motion.div>
              <p className="text-center text-slate-900 mt-4 text-sm">Understanding civic responsibility and how platforms like CivicLens drive change</p>
            </motion.div>
          </motion.div>
        </section>

        {/* Features Section */}
        <section className="py-24 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-5xl font-bold bg-gradient-to-r from-red-600 to-blue-900 bg-clip-text text-transparent mb-6">
                Powerful Features for
                <span className="text-slate-800"> Modern Cities</span>
              </h2>
              <p className="text-xl text-slate-900 max-w-3xl mx-auto">
                Discover how CivicLens revolutionizes civic engagement with cutting-edge AI and real-time analytics
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ 
                    scale: 1.05, 
                    rotateY: 5,
                    boxShadow: "0 25px 50px rgba(14, 165, 233, 0.2)"
                  }}
                  className="group relative"
                >
                  <div className="bg-white backdrop-blur-xl border-2 border-sky-200 p-4 sm:p-6 md:p-8 h-full rounded-2xl relative overflow-hidden shadow-lg hover:shadow-sky-300/50 transition-all duration-300">
                    {/* Gradient Background */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>
                    
                    {/* Icon */}
                    <motion.div
                      className={`inline-flex p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-gradient-to-br ${feature.color} text-white mb-4 sm:mb-6 shadow-lg`}
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.6 }}
                    >
                      <span className="text-5 sm:text-6 md:text-8 w-6 h-6 sm:w-8 sm:h-8">{feature.icon}</span>
                    </motion.div>
                    
                    {/* Content */}
                    <h3 className="text-lg sm:text-xl md:text-2xl font-bold bg-gradient-to-r from-red-600 to-blue-900 bg-clip-text text-transparent mb-2 sm:mb-4 group-hover:opacity-80 transition-all duration-300">
                      {feature.title}
                    </h3>
                    <p className="text-sm sm:text-base text-slate-700 leading-relaxed group-hover:text-slate-900 transition-colors duration-300">
                      {feature.description}
                    </p>
                    
                    {/* Hover Effect */}
                    <motion.div
                      className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"
                    ></motion.div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto text-center"
          >
            <div className="bg-gradient-to-br from-red-50 to-blue-50 backdrop-blur-xl border-2 border-red-200 p-12 rounded-3xl relative overflow-hidden shadow-2xl">
              {/* Background Animation */}
              <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 to-blue-900/10"></div>
              
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute -top-10 -right-10 w-40 h-40 bg-gradient-to-r from-red-500/30 to-blue-900/30 rounded-full blur-xl"
              ></motion.div>
              
              <div className="relative z-10">
                <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-red-600 to-blue-900 bg-clip-text text-transparent mb-6 sm:mb-8 px-4 sm:px-0">
                  Ready to Transform Your Community?
                </h2>
                
                <motion.button
                  onClick={onGetStarted}
                  className="group relative w-full sm:w-auto px-6 sm:px-10 py-3 sm:py-5 bg-gradient-to-r from-sky-500 to-blue-600 text-white font-bold rounded-2xl text-base sm:text-lg md:text-xl shadow-xl hover:shadow-sky-400/50"
                  whileHover={{ 
                    scale: 1.05, 
                    boxShadow: "0 25px 50px rgba(14, 165, 233, 0.3)",
                  }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="flex items-center space-x-3">
                    <span>Start Your Journey</span>
                    <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-blue-900 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity -z-10"></div>
                </motion.button>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Footer */}
        <footer className="py-8 sm:py-12 px-4 sm:px-6 lg:px-8 border-t-2 border-sky-300 bg-white/50 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="flex items-center justify-center space-x-2 mb-4">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                >
                  <Sparkles className="w-5 sm:w-6 h-5 sm:h-6 text-sky-600" />
                </motion.div>
                <span className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-sky-600 to-blue-700 bg-clip-text text-transparent">
                  CivicLens
                </span>
              </div>
              
              <p className="text-slate-900 text-sm sm:text-base mb-4">
                Empowering communities through intelligent civic engagement
              </p>
              
              <motion.p 
                className="text-slate-900 text-xs sm:text-sm"
                whileHover={{ scale: 1.05 }}
              >
                Made by{" "}
                <span className="bg-gradient-to-r from-sky-600 to-blue-700 bg-clip-text text-transparent font-semibold">
                  Naman Gaonkar
                </span>
              </motion.p>
            </motion.div>
          </div>
        </footer>
      </div>

        {/* Mobile-only sticky report CTA - helps users reach reporting flow on small screens */}
        <div className="sm:hidden fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50">
          <button
            onClick={onGetStarted}
            aria-label="Report an issue"
            className="w-[92%] mx-auto px-4 py-3 bg-gradient-to-r from-red-600 to-blue-900 text-white font-bold rounded-xl shadow-2xl flex items-center justify-center space-x-3"
          >
            <MapPin className="w-5 h-5" />
            <span>Report an Issue</span>
          </button>
        </div>

        {/* AI chatbot removed from landing page - available in dashboard only */}
    </div>
  );
}
