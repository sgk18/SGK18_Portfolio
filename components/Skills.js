import { FaHtml5, FaCss3Alt, FaJs, FaReact, FaGitAlt, FaGithub, FaFigma, FaBootstrap, FaPython, FaDatabase, FaFileExcel, FaJava } from 'react-icons/fa';
import { SiNextdotjs, SiTailwindcss, SiC } from 'react-icons/si';

export default function Skills() {
  const skills = [
    { name: 'HTML5', icon: <FaHtml5 className="text-orange-500" /> },
    { name: 'CSS3', icon: <FaCss3Alt className="text-blue-500" /> },
    { name: 'JavaScript', icon: <FaJs className="text-yellow-400" /> },
    { name: 'React', icon: <FaReact className="text-blue-400" /> },
    { name: 'Next.js', icon: <SiNextdotjs className="text-white" /> },
    { name: 'Tailwind CSS', icon: <SiTailwindcss className="text-cyan-400" /> },
    { name: 'Bootstrap', icon: <FaBootstrap className="text-purple-600" /> },
    { name: 'Git', icon: <FaGitAlt className="text-red-500" /> },
    { name: 'GitHub', icon: <FaGithub className="text-white" /> },
    { name: 'Figma', icon: <FaFigma className="text-purple-400" /> },
    { name: 'Python', icon: <FaPython className="text-blue-300" /> },
    { name: 'C', icon: <SiC className="text-blue-500" /> },
    { name: 'SQL', icon: <FaDatabase className="text-gray-400" /> },
    { name: 'Excel', icon: <FaFileExcel className="text-green-500" /> },
  ];

  // Duplicate skills to create seamless loop
  const marqueeSkills = [...skills, ...skills];

  return (
    <section id="skills" className="section bg-background overflow-hidden">
      <div className="container mx-auto px-6 mb-12">
        <h2 className="section-title">Skills</h2>
      </div>
         
      <div className="marquee-container w-full">
        <div className="marquee-content gap-8 py-4">
          {marqueeSkills.map((skill, index) => (
            <div key={index} className="glass-card flex items-center space-x-4 px-8 py-4 min-w-[200px] hover:border-primary transition-colors duration-300">
              <div className="text-3xl">
                {skill.icon}
              </div>
              <span className="font-bold text-xl text-text-secondary">{skill.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
