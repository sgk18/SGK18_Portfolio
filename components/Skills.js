import {
  FaHtml5,
  FaCss3Alt,
  FaJs,
  FaReact,
  FaGitAlt,
  FaGithub,
  FaFigma,
  FaBootstrap,
  FaPython,
  FaDatabase,
  FaFileExcel,
  FaBrain,
  FaServer
} from "react-icons/fa";

import { SiNextdotjs, SiTailwindcss, SiC } from "react-icons/si";
import { motion } from "framer-motion";

export default function Skills() {
  const skillCategories = [
    {
      title: "Frontend Development",
      skills: [
        { name: "HTML5", icon: <FaHtml5 className="text-orange-500" /> },
        { name: "CSS3", icon: <FaCss3Alt className="text-blue-500" /> },
        { name: "JavaScript (ES6+)", icon: <FaJs className="text-yellow-400" /> },
        { name: "React", icon: <FaReact className="text-cyan-400" /> }, // Changed to cyan for neon theme
        { name: "Next.js", icon: <SiNextdotjs className="text-white" /> },
        { name: "Responsive Design", icon: <span className="text-2xl">📱</span> },
      ],
    },
    {
      title: "Styling & UI",
      skills: [
        { name: "Tailwind CSS", icon: <SiTailwindcss className="text-cyan-400" /> },
        { name: "Bootstrap", icon: <FaBootstrap className="text-purple-600" /> },
        { name: "Figma", icon: <FaFigma className="text-pink-400" /> },
      ],
    },
    {
      title: "Backend & Programming",
      skills: [
        { name: "Python", icon: <FaPython className="text-blue-300" /> },
        { name: "C", icon: <SiC className="text-blue-500" /> },
        { name: "SQL (Basic)", icon: <FaDatabase className="text-gray-400" /> },
        { name: "REST API Basics", icon: <FaServer className="text-green-400" /> },
      ],
    },
    {
      title: "Tools & Platforms",
      skills: [
        { name: "Git", icon: <FaGitAlt className="text-red-500" /> },
        { name: "GitHub", icon: <FaGithub className="text-white" /> },
        { name: "Excel", icon: <FaFileExcel className="text-green-500" /> },
      ],
    },
    {
      title: "AI & Emerging Tech",
      skills: [
        { name: "Prompt Engineering", icon: <span>🤖</span> },
        { name: "AI-assisted Development", icon: <FaBrain className="text-pink-500" /> },
      ],
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1 },
  };

  return (
    <section id="skills" className="section bg-background relative overflow-hidden">
        {/* Background Decorative Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
            <div className="absolute top-[10%] left-[5%] w-64 h-64 bg-primary/5 rounded-full blur-3xl"></div>
            <div className="absolute bottom-[10%] right-[5%] w-80 h-80 bg-accent/5 rounded-full blur-3xl"></div>
        </div>

      <div className="container mx-auto px-6 relative z-10">
        <h2 className="section-title mb-16 text-transparent bg-clip-text bg-gradient-to-r from-primary via-purple-500 to-accent animate-gradient-x">
            System Capabilities
        </h2>

        <div className="space-y-16">
          {skillCategories.map((category, idx) => (
            <div key={idx} className="relative">
                <div className="flex items-center gap-4 mb-8">
                    <div className="h-8 w-1 bg-gradient-to-b from-primary to-transparent rounded-full"></div>
                    <h3 className="text-3xl font-bold text-white tracking-wider uppercase font-mono">
                        {category.title}
                    </h3>
                    <div className="flex-grow h-[1px] bg-gradient-to-r from-primary/50 to-transparent"></div>
                </div>

              <motion.div
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.1 }}
              >
                {category.skills.map((skill, index) => (
                  <motion.div
                    key={index}
                    variants={itemVariants}
                    whileHover={{
                      scale: 1.05,
                      boxShadow: "0 0 20px rgba(0, 243, 255, 0.4)",
                      borderColor: "rgba(0, 243, 255, 0.8)"
                    }}
                    className="relative group p-4 rounded-xl border border-white/5 bg-surface/50 backdrop-blur-md overflow-hidden transition-all duration-300"
                  >
                    {/* Hover Gradient Background */}
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    
                    <div className="relative z-10 flex items-center gap-4">
                        <div className="p-3 rounded-lg bg-black/40 border border-white/5 group-hover:border-primary/50 transition-colors duration-300">
                            <span className="text-3xl filter drop-shadow-[0_0_5px_rgba(255,255,255,0.3)] group-hover:drop-shadow-[0_0_8px_rgba(0,243,255,0.6)] transition-all duration-300">
                                {skill.icon}
                            </span>
                        </div>
                        <span className="text-lg font-semibold text-text-primary group-hover:text-primary transition-colors duration-300 font-mono tracking-tight">
                            {skill.name}
                        </span>
                    </div>

                    {/* Corner Accents */}
                    <div className="absolute top-0 right-0 p-2 opacity-50 group-hover:opacity-100 transition-opacity">
                        <div className="w-2 h-2 border-t border-r border-primary"></div>
                    </div>
                    <div className="absolute bottom-0 left-0 p-2 opacity-50 group-hover:opacity-100 transition-opacity">
                        <div className="w-2 h-2 border-b border-l border-primary"></div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
