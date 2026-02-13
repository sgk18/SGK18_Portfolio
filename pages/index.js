import Head from 'next/head'
import { useEffect, useState } from 'react'
import Particles from '@tsparticles/react'
import { loadFull } from 'tsparticles'

export default function Home() {
  const particlesInit = async (engine) => {
    await loadFull(engine)
  }

  const [formStatus, setFormStatus] = useState('')

  const handleFormSubmit = (e) => {
    e.preventDefault()
    // For now, just show a success message
    // In a real app, you'd send this to a backend
    setFormStatus('Thank you for your message! I\'ll get back to you soon.')
    e.target.reset()
    setTimeout(() => setFormStatus(''), 5000)
  }

  useEffect(() => {
    // Mobile Navigation Toggle
    const hamburger = document.querySelector(".hamburger");
    const navLinks = document.querySelector(".nav-links");
    const navLinksItems = document.querySelectorAll(".nav-links li");

    if (hamburger) {
      hamburger.addEventListener("click", () => {
        navLinks.classList.toggle("nav-active");
        hamburger.classList.toggle("toggle");
      });
    }

    // Close mobile menu when a link is clicked
    navLinksItems.forEach((item) => {
      item.addEventListener("click", () => {
        if (navLinks.classList.contains("nav-active")) {
          navLinks.classList.remove("nav-active");
          hamburger.classList.remove("toggle");
        }
      });
    });

    // Navbar Scroll Effect
    const navbar = document.getElementById("navbar");
    const handleScroll = () => {
      if (window.scrollY > 50) {
        navbar.classList.add("scrolled");
      } else {
        navbar.classList.remove("scrolled");
      }
    };
    window.addEventListener("scroll", handleScroll);

    // Smooth Scrolling for Anchor Links
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener("click", function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute("href"));
        if (target) {
          target.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      });
    });

    // Scroll Animations (Intersection Observer)
    const observerOptions = {
      threshold: 0.2,
      rootMargin: "0px 0px -50px 0px",
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    // Target elements for animation
    const sections = document.querySelectorAll(".section");
    const cards = document.querySelectorAll(
      ".project-card, .stat-card, .skill-category",
    );

    sections.forEach((section) => {
      section.classList.add("hidden-section");
      observer.observe(section);
    });

    cards.forEach((card, index) => {
      card.classList.add("hidden-card");
      card.style.transitionDelay = `${index * 100}ms`;
      observer.observe(card);
    });

    // Glitch effect enhancement
    const glitchText = document.querySelector(".glitch-text");
    if (glitchText) {
      glitchText.addEventListener("mouseover", () => {
        glitchText.style.animation = "none";
        void glitchText.offsetWidth;
        glitchText.style.animation =
          "glitch 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) both infinite";
      });

      glitchText.addEventListener("mouseout", () => {
        glitchText.style.animation = "fadeUp 0.8s forwards";
      });
    }

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <>
      <Head>
        <title>Suryachalam V M | Portfolio</title>
        <meta name="description" content="Portfolio of Surya VM - Web Developer & Creative Coder" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link
          href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;700&family=Outfit:wght@300;400;500;700&family=Space+Grotesk:wght@300;400;600;700&display=swap"
          rel="stylesheet"
        />
        <script src="https://kit.fontawesome.com/a076d05399.js" crossOrigin="anonymous"></script>
        <link rel="icon" href="/logo.png" type="image/png" />
      </Head>

      <nav className="navbar" id="navbar">
        <div className="container nav-content">
          <a href="#" className="logo">SGK18</a>
          <ul className="nav-links">
            <li><a href="#home">Home</a></li>
            <li><a href="#about">About</a></li>
            <li><a href="#skills">Skills</a></li>
            <li><a href="#projects">Projects</a></li>
            <li><a href="#contact">Contact</a></li>
          </ul>
          <div className="hamburger">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      </nav>

      <main>
        <section id="home" className="hero">
          <Particles
            id="tsparticles"
            init={particlesInit}
            options={{
              background: {
                color: {
                  value: "#050505",
                },
              },
              fpsLimit: 120,
              interactivity: {
                events: {
                  onClick: {
                    enable: true,
                    mode: "push",
                  },
                  onHover: {
                    enable: true,
                    mode: "repulse",
                  },
                  resize: true,
                },
                modes: {
                  push: {
                    quantity: 4,
                  },
                  repulse: {
                    distance: 200,
                    duration: 0.4,
                  },
                },
              },
              particles: {
                color: {
                  value: "#00f3ff",
                },
                links: {
                  color: "#00f3ff",
                  distance: 150,
                  enable: true,
                  opacity: 0.5,
                  width: 1,
                },
                collisions: {
                  enable: true,
                },
                move: {
                  direction: "none",
                  enable: true,
                  outModes: {
                    default: "bounce",
                  },
                  random: false,
                  speed: 2,
                  straight: false,
                },
                number: {
                  density: {
                    enable: true,
                    area: 800,
                  },
                  value: 80,
                },
                opacity: {
                  value: 0.5,
                },
                shape: {
                  type: "circle",
                },
                size: {
                  value: { min: 1, max: 5 },
                },
              },
              detectRetina: true,
            }}
          />
          <div className="container hero-content">
            <span className="greeting">Hello, I'm</span>
            <h1 className="glitch-text" data-text="Suryachalam V M">Suryachalam V M</h1>
            <p className="subtitle">Frontend Web Developer Intern | Fresher with hands-on experience building responsive websites using HTML, CSS, JavaScript, and Next.js.</p>
            <div className="cta-group">
              <a href="#projects" className="btn btn-primary">View Projects</a>
              <a href="#contact" className="btn btn-secondary">Contact Me</a>
            </div>
          </div>
          <div className="hero-bg-elements">
            <div className="circle c1"></div>
            <div className="circle c2"></div>
            <video className="hero-video" autoPlay muted loop playsInline>
              <source src="/Minimalist_Mathematical_Graph_Animation.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        </section>

        <section id="about" className="section">
          <div className="container">
            <h2 className="section-title">About Me</h2>
            <div className="about-grid">
              <div className="about-image">
                <img src="/profile.jpg" alt="Suryachalam V M" />
                <div className="img-overlay"></div>
              </div>
              <div className="about-text">
                <p>Frontend Web Developer fresher with hands-on experience building responsive websites using HTML, CSS, JavaScript, and Next.js. Led and contributed to real-world projects including official university websites and startup concepts. Actively seeking frontend or web development internship opportunities.</p>
                <div className="contact-info">
                  <p><strong>Location:</strong> Mahalakshmi layout, Bengaluru, 560086</p>
                  <p><strong>Phone:</strong> 9844588551</p>
                  <p><strong>Email:</strong> suryachalam18@gmail.com</p>
                  <p><strong>LinkedIn:</strong> <a href="https://www.linkedin.com/in/suryachalam/" target="_blank" rel="noopener noreferrer">Suryachalam V M</a></p>
                  <p><strong>GitHub:</strong> <a href="https://github.com/sgk18" target="_blank" rel="noopener noreferrer">sgk18</a></p>
                </div>
              </div>
              <div className="about-stats">
                <div className="stat-card">
                  <h3>Fresher</h3>
                  <p>Status</p>
                </div>
                <div className="stat-card">
                  <h3>10+</h3>
                  <p>Projects Completed</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="experience" className="section alt-bg">
          <div className="container">
            <h2 className="section-title">Experience</h2>
            <div className="experience-card">
              <div className="exp-header">
                <h3>Web Developer & Organising Committee Member</h3>
                <p className="company">Centre for Peace Praxis, CHRIST University · Part-time</p>
                <p className="location">Bangalore Urban, Karnataka, India | On-site</p>
                <p className="duration">Jul 2025 – Present</p>
              </div>
              <ul className="exp-details">
                <li>Developed and maintained the official website of the Centre for Peace Praxis using HTML5, CSS3, and responsive design principles.</li>
                <li>Improved website usability, layout, and mobile responsiveness to ensure cross-device compatibility.</li>
                <li>Collaborated with core committee members to support academic and peacebuilding events, including event planning and coordination.</li>
                <li>Used Git & GitHub for version control, collaboration, and code management.</li>
                <li>Worked closely with a team to implement updates and resolve UI-related issues efficiently.</li>
              </ul>
            </div>
          </div>
        </section>

        <section id="education" className="section">
          <div className="container">
            <h2 className="section-title">Education</h2>
            <div className="education-card">
              <div className="edu-logo">
                <i className="fas fa-university"></i>
              </div>
              <div className="edu-details">
                <h3>Christ University, Bangalore</h3>
                <p className="degree">Bachelor of Science - BS, Mathematics and Computer Science</p>
                <p className="duration">Jun 2025 - Mar 2029</p>
              </div>
            </div>
          </div>
        </section>

        <section id="skills" className="section alt-bg">
          <div className="container">
            <h2 className="section-title">Tech Stack</h2>
            <div className="skills-wrapper">
              <div className="skill-category">
                <h3>Frontend Web Development</h3>
                <div className="skill-tags">
                  <span className="tag">HTML5</span>
                  <span className="tag">CSS3</span>
                  <span className="tag">JavaScript (ES6+)</span>
                  <span className="tag">Next.js</span>
                  <span className="tag">Responsive Web Design</span>
                  <span className="tag">Web Application Development</span>
                </div>
              </div>
              <div className="skill-category">
                <h3>Tools & Technologies</h3>
                <div className="skill-tags">
                  <span className="tag">Git</span>
                  <span className="tag">GitHub</span>
                  <span className="tag">Figma</span>
                  <span className="tag">Bootstrap</span>
                  <span className="tag">Tailwind CSS</span>
                  <span className="tag">REST API Basics</span>
                </div>
              </div>
              <div className="skill-category">
                <h3>Programming & Other</h3>
                <div className="skill-tags">
                  <span className="tag">Python</span>
                  <span className="tag">C</span>
                  <span className="tag">SQL (Basic)</span>
                  <span className="tag">Excel</span>
                  <span className="tag">Prompt Engineering (Generative AI)</span>
                  <span className="tag">AI-assisted Development</span>
                  <span className="tag">Problem Solving</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="projects" className="section">
          <div className="container">
            <h2 className="section-title">Featured Projects</h2>
            <div className="projects-grid">
              <article className="project-card">
                <div className="project-image">
                  <img src="/cpp_logo.png" alt="Centre for Peace Praxis" />
                </div>
                <div className="project-info">
                  <h3>Centre for Peace Praxis – Official Website</h3>
                  <p>Web Developer & Team Lead at the Centre for Peace Praxis, CHRIST University, responsible for leading a student team to design and maintain the official website using HTML5 and CSS3. Built a responsive, user-friendly platform showcasing peacebuilding initiatives, workshops, events, and volunteering opportunities, and managed collaboration and version control using Git & GitHub.</p>
                  <div className="project-tags">
                    <span>HTML5</span>
                    <span>CSS3</span>
                    <span>Responsive Design</span>
                    <span>Git</span>
                    <span>GitHub</span>
                  </div>
                  <div className="project-links">
                    <a href="https://cpp-two-gamma.vercel.app/index.html#home" target="_blank" rel="noopener noreferrer" className="link-item">Demo</a>
                    <a href="#" className="link-item">Code</a>
                  </div>
                </div>
              </article>

              <article className="project-card">
                <div className="project-image">
                  <div className="img-placeholder"></div>
                </div>
                <div className="project-info">
                  <h3>Techleons 2026 – Unofficial Event Website</h3>
                  <p>Built a concept event website for Techleons 2026 as a self-initiated project to practice Next.js and modern frontend development. Designed a responsive, theme-based UI to structure event details, departments, and activities, helping me understand component-based architecture and routing.</p>
                  <div className="project-tags">
                    <span>Next.js</span>
                    <span>React</span>
                    <span>Responsive Design</span>
                  </div>
                  <div className="project-links">
                    <a href="#" className="link-item">Demo</a>
                    <a href="#" className="link-item">Code</a>
                  </div>
                </div>
              </article>

              <article className="project-card">
                <div className="project-image">
                  <div className="img-placeholder"></div>
                </div>
                <div className="project-info">
                  <h3>BottleStory – Custom Bottle Branding Website</h3>
                  <p>Built BottleStory, a startup-focused B2B branding website that offers customized plastic bottles for restaurants, corporate offices, events, and promotional campaigns. Designed a clean, professional, and conversion-focused interface to showcase branding benefits, customization options, use cases, and business workflow.</p>
                  <div className="project-tags">
                    <span>HTML</span>
                    <span>CSS</span>
                    <span>JavaScript</span>
                    <span>UI Design</span>
                  </div>
                  <div className="project-links">
                    <a href="#" className="link-item">Demo</a>
                    <a href="#" className="link-item">Code</a>
                  </div>
                </div>
              </article>

              <article className="project-card">
                <div className="project-image">
                  <div className="img-placeholder"></div>
                </div>
                <div className="project-info">
                  <h3>Green Cart – Sustainable E-Commerce Website</h3>
                  <p>Developed Green Cart, a concept eco-friendly e-commerce website promoting sustainable living and plastic-free alternatives. Designed a clean, responsive interface to showcase products, sustainability values, target audience, and business model.</p>
                  <div className="project-tags">
                    <span>HTML</span>
                    <span>CSS</span>
                    <span>JavaScript</span>
                    <span>E-commerce</span>
                  </div>
                  <div className="project-links">
                    <a href="#" className="link-item">Demo</a>
                    <a href="#" className="link-item">Code</a>
                  </div>
                </div>
              </article>

              <article className="project-card">
                <div className="project-image">
                  <div className="img-placeholder"></div>
                </div>
                <div className="project-info">
                  <h3>Portfolio</h3>
                  <p>Built a personal portfolio website to showcase projects, technical skills, and experience as a frontend developer, focusing on responsive design, usability, and clear project presentation.</p>
                  <div className="project-tags">
                    <span>Next.js</span>
                    <span>React</span>
                    <span>Responsive Design</span>
                  </div>
                  <div className="project-links">
                    <a href="/" className="link-item">Demo</a>
                    <a href="https://github.com/sgk18/SGK18_Portfolio" target="_blank" rel="noopener noreferrer" className="link-item">Code</a>
                  </div>
                </div>
              </article>
            </div>
          </div>
        </section>

        <section id="awards" className="section alt-bg">
          <div className="container">
            <h2 className="section-title">Awards</h2>
            <div className="awards-list">
              <div className="award-item">
                <h3>SEQUENCE 2025 MPL WINNER</h3>
              </div>
            </div>
          </div>
        </section>

        <section id="languages" className="section">
          <div className="container">
            <h2 className="section-title">Languages</h2>
            <div className="languages-grid">
              <div className="language-item">
                <h3>English</h3>
                <p>Full Professional Proficiency</p>
              </div>
              <div className="language-item">
                <h3>Kannada</h3>
                <p>Native or Bilingual Proficiency</p>
              </div>
              <div className="language-item">
                <h3>Tamil</h3>
                <p>Native or Bilingual Proficiency</p>
              </div>
              <div className="language-item">
                <h3>Hindi</h3>
                <p>Full Professional Proficiency</p>
              </div>
              <div className="language-item">
                <h3>French</h3>
                <p>Elementary Proficiency</p>
              </div>
              <div className="language-item">
                <h3>Japanese</h3>
                <p>Elementary Proficiency</p>
              </div>
            </div>
          </div>
        </section>

        <section id="contact" className="section contact-section">
          <div className="container">
            <h2 className="section-title">Get In Touch</h2>
            <p className="contact-subtitle">Have a project in mind or just want to say hi?</p>
            <div style={{marginBottom: '2rem'}}>
              <a href="mailto:suryachalam18@gmail.com" className="link-item" style={{fontSize: '1.2rem', color: 'var(--primary)'}}>suryachalam18@gmail.com</a>
            </div>
            <div className="contact-wrapper">
              <form className="contact-form" onSubmit={handleFormSubmit}>
                <div className="form-group">
                  <input type="text" placeholder="Name" required />
                </div>
                <div className="form-group">
                  <input type="email" placeholder="Email" required />
                </div>
                <div className="form-group">
                  <textarea placeholder="Message" rows="5" required></textarea>
                </div>
                <button type="submit" className="btn btn-primary">Send Message</button>
                {formStatus && <p style={{marginTop: '1rem', color: 'var(--primary)'}}>{formStatus}</p>}
              </form>
            </div>
          </div>
        </section>
      </main>

      <footer>
        <div className="container footer-content">
          <p>&copy; 2026 Suryachalam V M. All rights reserved.</p>
          <div className="social-links">
            <a href="https://github.com/sgk18" target="_blank" rel="noopener noreferrer">Github</a>
            <a href="https://www.linkedin.com/in/suryachalam/" target="_blank" rel="noopener noreferrer">LinkedIn</a>
          </div>
        </div>
      </footer>
    </>
  )
}