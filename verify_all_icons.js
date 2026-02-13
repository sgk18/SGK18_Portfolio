const fa = require('react-icons/fa');
const si = require('react-icons/si');

const faIcons = ['FaHtml5', 'FaCss3Alt', 'FaJs', 'FaReact', 'FaGitAlt', 'FaGithub', 'FaFigma', 'FaBootstrap', 'FaPython', 'FaDatabase', 'FaFileExcel', 'FaJava'];
const siIcons = ['SiNextdotjs', 'SiTailwindcss', 'SiC'];

console.log('--- FA Icons ---');
faIcons.forEach(icon => {
  console.log(`${icon}: ${!!fa[icon]}`);
});

console.log('\n--- SI Icons ---');
siIcons.forEach(icon => {
  console.log(`${icon}: ${!!si[icon]}`);
});
