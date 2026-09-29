import {
  education,
  experience,
  profile,
  projects,
  proofPoints,
  techGroupContent,
} from "@/lib/portfolio-content";

export type RagDocument = {
  id: string;
  title: string;
  category: "profile" | "skills" | "project" | "experience" | "education" | "proof";
  content: string;
  source: string;
};

const skillDocuments: RagDocument[] = techGroupContent.map((group) => ({
  id: `skills-${group.title.toLowerCase().replaceAll(/[^a-z0-9]+/g, "-")}`,
  title: group.title,
  category: "skills",
  source: "resume: technical skills",
  content: `${group.title}. Skills: ${group.skills.join(", ")}. Evidence: ${group.proof}`,
}));

const projectDocuments: RagDocument[] = projects.map((project) => ({
  id: `project-${project.name.toLowerCase().replaceAll(/[^a-z0-9]+/g, "-")}`,
  title: project.name,
  category: "project",
  source: "resume: projects",
  content: `${project.name} (${project.year}). Type: ${project.type}. Role and stack: ${project.role}. Summary: ${project.summary} Details: ${project.details} Result: ${project.result}. Links: ${
    project.links.map((link) => `${link.label} ${link.href}`).join(", ") || "no public link listed"
  }.`,
}));

const experienceDocuments: RagDocument[] = experience.map((item) => ({
  id: `experience-${item.company.toLowerCase().replaceAll(/[^a-z0-9]+/g, "-")}`,
  title: `${item.title} at ${item.company}`,
  category: "experience",
  source: "resume: experience",
  content: `${item.title}, ${item.company}, ${item.range}. ${item.points.join(" ")}`,
}));

const educationDocuments: RagDocument[] = education.map((item, index) => ({
  id: `education-${item.school.toLowerCase().replaceAll(/[^a-z0-9]+/g, "-")}-${index}`,
  title: `${item.school} - ${item.detail}`,
  category: "education",
  source: "resume: education and awards",
  content: `${item.school}. ${item.detail}. ${item.range}.`,
}));

export const ragDocuments: RagDocument[] = [
  {
    id: "profile-summary",
    title: "Profile summary",
    category: "profile",
    source: "resume: header and summary",
    content: `${profile.name} is a ${profile.role} based in ${profile.location}. ${profile.headline} ${profile.intro}`,
  },
  {
    id: "contact-links",
    title: "Contact and links",
    category: "profile",
    source: "resume: contact",
    content: `Contact Justin through email ${profile.email}, phone ${profile.phone}, GitHub ${profile.github}, and LinkedIn ${profile.linkedin}.`,
  },
  {
    id: "proof-points",
    title: "Proof points",
    category: "proof",
    source: "resume: achievements",
    content: proofPoints
      .map((point) => `${point.value} ${point.label}`)
      .join(". "),
  },
  ...skillDocuments,
  ...projectDocuments,
  ...experienceDocuments,
  ...educationDocuments,
];
