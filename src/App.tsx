import { Authenticated, Unauthenticated } from "convex/react";
import { SignInForm } from "./SignInForm";
import { SignOutButton } from "./SignOutButton";
import { Toaster } from "sonner";
import { Dashboard } from "./components/Dashboard";
import { ReportForm } from "./components/ReportForm";
import { LandingPage } from "./components/LandingPage";
import { AIChatbot } from "./components/AIChatbot";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin } from "lucide-react";

export default function App() {
  const [currentView, setCurrentView] = useState<"dashboard" | "report" | "landing">("landing");
  const [showAuth, setShowAuth] = useState(false);

  const handleGetStarted = () => {
    setShowAuth(true);
  };

  const handleBackToLanding = () => {
    setCurrentView("landing");
    setShowAuth(false);
  };

  return (
    <div className="min-h-screen">
      <Authenticated>
        <AnimatePresence mode="wait">
          {currentView === "landing" ? (
            <motion.div
              key="landing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <LandingPage onGetStarted={() => setCurrentView("dashboard")} isAuthenticated={true} />
            </motion.div>
          ) : (
            <motion.div
              key="app"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="min-h-screen bg-gradient-to-br from-red-800 via-black to-blue-900"
            >
              {/* Navigation */}
              <nav className="sticky top-0 z-50 backdrop-blur-xl bg-white/10 border-b border-white/20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="flex justify-between items-center h-16">
                    <div className="flex items-center space-x-8">
                      <motion.button
                        onClick={handleBackToLanding}
                        className="hover:scale-105 transition-transform"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <div className="bg-black/80 px-3 py-1 rounded-md">
                          <span className="text-2xl font-bold bg-gradient-to-r from-red-600 to-blue-900 bg-clip-text text-transparent">
                            CivicLens
                          </span>
                        </div>
                      </motion.button>
                      <div className="hidden md:flex space-x-4">
                        <motion.button
                          onClick={() => setCurrentView("dashboard")}
                          className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                            currentView === "dashboard"
                              ? "bg-white/20 text-white"
                              : "text-white/70 hover:text-white hover:bg-white/10"
                          }`}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          Dashboard
                        </motion.button>
                        <motion.button
                          onClick={() => setCurrentView("report")}
                          className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                            currentView === "report"
                              ? "bg-white/20 text-white"
                              : "text-white/70 hover:text-white hover:bg-white/10"
                          }`}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          Report Issue
                        </motion.button>
                      </div>
                    </div>
                    <SignOutButton />
                  </div>
                </div>
              </nav>

              {/* Main Content */}
              <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <AnimatePresence mode="wait">
                  {currentView === "dashboard" ? (
                    <motion.div
                      key="dashboard"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Dashboard />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="report"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                        <ReportForm onBack={() => setCurrentView("dashboard")} />
                    </motion.div>
                  )}
                </AnimatePresence>
                  {/* Chatbot: render only on the dashboard view (per original request) */}
                  {currentView === "dashboard" && <AIChatbot />}
              </main>

              {/* Mobile-only floating Report button (visible when nav links are hidden) */}
              {currentView !== "report" && (
                <div className="md:hidden fixed bottom-6 right-4 z-40">
                  <button
                    onClick={() => setCurrentView("report")}
                    aria-label="Report an issue"
                    className="w-14 h-14 rounded-full bg-gradient-to-r from-red-600 to-blue-900 text-white flex items-center justify-center shadow-2xl"
                  >
                    <MapPin className="w-6 h-6" />
                  </button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </Authenticated>

      <Unauthenticated>
        <AnimatePresence mode="wait">
          {!showAuth ? (
            <motion.div
              key="landing-unauth"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <LandingPage onGetStarted={handleGetStarted} isAuthenticated={false} />
            </motion.div>
          ) : (
            <motion.div
              key="auth"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.5 }}
              className="min-h-screen bg-gradient-to-br from-red-700 via-red-900 to-blue-900 flex items-center justify-center p-8"
            >
              <div className="w-full max-w-md">
                <motion.button
                  onClick={handleBackToLanding}
                  className="mb-8 text-white/70 hover:text-white transition-colors flex items-center space-x-2"
                  whileHover={{ x: -5 }}
                >
                  <span>←</span>
                  <span>Back to Landing</span>
                </motion.button>
                
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="text-center mb-8"
                >
                  <div className="inline-block bg-black/80 px-3 py-1 rounded-md mb-4">
                    <h1 className="text-5xl font-bold bg-gradient-to-r from-red-600 to-blue-900 bg-clip-text text-transparent">
                      CivicLens
                    </h1>
                  </div>
                  <p className="text-xl text-white/80">
                    AI-Powered Civic Engagement Platform
                  </p>
                  <p className="text-white/60 mt-2">
                    Sign in to start transforming your community
                  </p>
                </motion.div>
                
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  <SignInForm />
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Unauthenticated>

      <Toaster />
    </div>
  );
}
