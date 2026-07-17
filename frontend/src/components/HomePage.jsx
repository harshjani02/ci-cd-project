import React from "react";
import { useNavigate } from "react-router-dom";
import { CheckSquare, ListChecks, Moon, Filter, ShieldCheck, ArrowRight } from "lucide-react";

const features = [
  { icon: ListChecks, title: "Track Everything", desc: "Create, edit, and organize all your tasks in one place." },
  { icon: Filter, title: "Smart Filtering", desc: "Filter by priority — High, Medium, or Low — instantly." },
  { icon: Moon, title: "Dark & Light Mode", desc: "Switch themes to match your environment and preference." },
  { icon: ShieldCheck, title: "Secure & Private", desc: "JWT-based auth keeps your tasks safe and personal." },
];

const HomePage = () => {
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem("token");

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      {/* Navbar */}
      <header className="fixed top-0 w-full z-20 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-gray-100 dark:border-slate-800">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 text-white p-1.5 rounded-lg">
              <CheckSquare size={17} strokeWidth={2.5} />
            </div>
            <span className="font-bold text-gray-800 dark:text-white tracking-tight">TaskManager</span>
          </div>
          <div className="flex items-center gap-2">
            {isLoggedIn ? (
              <button
                onClick={() => navigate("/layout/allTasks")}
                className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
              >
                Go to Dashboard <ArrowRight size={15} />
              </button>
            ) : (
              <>
                <button
                  onClick={() => navigate("/login")}
                  className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 px-3 py-2 rounded-lg transition-colors"
                >
                  Sign In
                </button>
                <button
                  onClick={() => navigate("/signUp")}
                  className="text-sm font-medium bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Get Started
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero */}
      <main className="max-w-5xl mx-auto px-4 pt-32 pb-20 text-center">
        <div className="inline-flex items-center gap-2 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 text-xs font-semibold px-3 py-1.5 rounded-full mb-6 border border-indigo-100 dark:border-indigo-800">
          <CheckSquare size={13} /> Simple. Focused. Productive.
        </div>

        <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 dark:text-white leading-tight mb-5">
          Manage your tasks
          <br />
          <span className="text-indigo-600 dark:text-indigo-400">without the noise</span>
        </h1>

        <p className="text-base text-gray-500 dark:text-gray-400 max-w-xl mx-auto mb-8 leading-relaxed">
          A clean, fast task manager built for people who want to stay organized — not overwhelmed. Set priorities, track progress, and get things done.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          {isLoggedIn ? (
            <button
              onClick={() => navigate("/layout/allTasks")}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-3 rounded-xl transition-colors shadow-md shadow-indigo-200 dark:shadow-indigo-900"
            >
              Open Dashboard <ArrowRight size={17} />
            </button>
          ) : (
            <>
              <button
                onClick={() => navigate("/signUp")}
                className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-3 rounded-xl transition-colors shadow-md shadow-indigo-200 dark:shadow-indigo-900"
              >
                Start for free <ArrowRight size={17} />
              </button>
              <button
                onClick={() => navigate("/login")}
                className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 px-5 py-3 rounded-xl border border-gray-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-700 transition-colors"
              >
                Sign in to your account
              </button>
            </>
          )}
        </div>
      </main>

      {/* Features */}
      <section className="max-w-5xl mx-auto px-4 pb-24">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-gray-100 dark:border-slate-700/60 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
            >
              <div className="inline-flex p-2.5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl mb-3">
                <Icon size={20} className="text-indigo-600 dark:text-indigo-400" />
              </div>
              <h3 className="font-semibold text-gray-800 dark:text-white text-sm mb-1">{title}</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 dark:border-slate-800 py-6 text-center">
        <p className="text-xs text-gray-400 dark:text-gray-600">
          © {new Date().getFullYear()} TaskManager · Built with the MERN stack
        </p>
      </footer>
    </div>
  );
};

export default HomePage;
