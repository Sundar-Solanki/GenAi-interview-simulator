// resumeData.js

const resume = {
  name: "Sundar Solanki",
  role: "Full Stack Web Developer",
  education: "B.Tech Computer Science (2026)",
  skills: [
    "JavaScript",
    "React.js",
    "Node.js",
    "Express.js",
    "MongoDB",
    "HTML",
    "CSS",
    "Git",
    "Docker (basic)"
  ]
};

const selfDescription = `
I am a MERN stack developer with strong interest in backend development.
I have experience building REST APIs using Node.js and Express, working with MongoDB databases, 
and implementing authentication using JWT.

I enjoy solving real-world problems, optimizing performance, and learning new technologies. 
Currently, I am exploring DevOps tools and AI integrations to build scalable applications.
`;

const jobDescription = `
Looking for a Full Stack / Backend Developer role where I can contribute to building scalable web applications.
I aim to work in a growth-oriented environment where I can enhance my skills in system design, 
cloud technologies, and DevOps practices.
`;

module.exports = {
  resume,
  selfDescription,
  jobDescription
};