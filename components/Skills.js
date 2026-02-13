import { FaHtml5, FaCss3Alt, FaJs, FaReact, FaGitAlt, FaGithub, FaFigma, FaBootstrap, FaPython, FaDatabase, FaFileExcel, FaBrain, FaServer } from 'react-icons/fa';
import { SiNextdotjs, SiTailwindcss, SiC } from 'react-icons/si';
import { motion } from 'framer-motion';

export default function Skills() {
  const skillCategories = [
    {
      title: 'Frontend Development',
      skills: [
        { name: 'HTML5', icon: <FaHtml5 className="text-orange-500" /> },
        { name: 'CSS3', icon: <FaCss3Alt className="text-blue-500" /> },
        { name: 'JavaScript (ES6+)', icon: <FaJs className="text-yellow-400" /> },
        { name: 'React', icon: <FaReact className="text-blue-400" /> },
        { name: 'Next.js', icon: <SiNextdotjs className="text-white" /> },
        { name: 'Responsive Design', icon: <span className="text-2xl">📱</span> },
      ],
    },
    {
      title: 'Styling & UI',
      skills: [
        { name: 'Tailwind CSS', icon: <SiTailwindcss className="text-cyan-400" /> },
        { name: 'Bootstrap', icon: <FaBootstrap className="text-purple-600" /> },
        { name: 'Figma', icon: <FaFigma className="text-purple-400" /> },
      ],
    },
    {
      title: 'Backend & Programming',
      skills: [
        { name: 'Python', icon: <FaPython className="text-blue-300" /> },
        { name: 'C', icon: <SiC className="text-blue-500" /> },
        { name: 'SQL (Basic)', icon: <FaDatabase className="text-gray-400" /> },
        { name: 'REST API Basics', icon: <FaServer className="text-green-400" /> },
      ],
    },
    {
      title: 'Tools & Platforms',
      skills: [
        { name: 'Git', icon: <FaGitAlt className="text-red-500" /> },
        { name: 'GitHub', icon: <FaGithub className="text-white" /> },
        { name: 'Excel', icon: <FaFileExcel className="text-green-500" /> },
      ],
    },
    {
      title: 'AI & Emerging Tech',
      skills: [
        { name: 'Prompt Engineering', icon: <span className="text-2xl">🤖</span> },
        { name: 'AI-assisted Development', icon: <FaBrain className="text-pink-500" /> },
      ],
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { x: -20, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1
    }
  };

  return (
    <section id="skills" className="section bg-background overflow-hidden relative">
      <div className="container mx-auto px-6">
        <h2 className="section-title">Skills</h2>
        
        <div className="flex flex-col space-y-12">
            {skillCategories.map((category, idx) => (
                <div key={idx} className="relative w-full">
                    <h3 className="text-2xl font-bold mb-6 text-text-primary border-l-4 border-primary pl-4">
                        {category.title}
                    </h3>
                    
                    {/* Horizontal Scrolling Row */}
                    <motion.div 
                        className="flex flex-row overflow-x-auto space-x-6 pb-4 no-scrollbar items-center w-full"
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.2 }}
                    >
                        {category.skills.map((skill, index) => (
                            <motion.div 
                                key={index} 
                                variants={itemVariants}
                                whileHover={{ y: -5, boxShadow: "0 5px 15px rgba(0, 243, 255, 0.2)" }}
                                className="flex-shrink-0 flex items-center p-4 space-x-3 border border-white/10 bg-surface/40 backdrop-blur-md rounded-xl min-w-[170px] hover:border-primary/50 transition-all duration-300 select-none cursor-pointer"
                            >
                                <div className="text-3xl p-2 bg-white/5 rounded-lg text-white">
                                    {skill.icon}
                                </div>
                                <span className="font-medium text-text-primary whitespace-nowrap">{skill.name}</span>
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
