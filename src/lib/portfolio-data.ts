import {
  Bot,
  BrainCircuit,
  Cloud,
  Code2,
  Cpu,
  Database,
  GitBranch,
  Globe2,
  Layers3,
  ShieldCheck,
  Sparkles,
  TerminalSquare,
} from "lucide-react";

import {
  capabilityContent,
  buildGallery,
  chatSuggestions,
  education,
  experience,
  hostingOptions,
  navItems,
  profile,
  projects,
  proofPoints,
  testimonials,
  techGroupContent,
  timelineMilestones,
} from "@/lib/portfolio-content";

export {
  buildGallery,
  chatSuggestions,
  education,
  experience,
  hostingOptions,
  navItems,
  profile,
  projects,
  proofPoints,
  testimonials,
  timelineMilestones,
};

const techIcons = [
  Layers3,
  TerminalSquare,
  BrainCircuit,
  Cloud,
  Database,
  ShieldCheck,
];

const capabilityIcons = [Globe2, GitBranch, Cpu, Bot];

export const techGroups = techGroupContent.map((group, index) => ({
  ...group,
  icon: techIcons[index],
}));

export const capabilityRows = capabilityContent.map((row, index) => ({
  ...row,
  icon: capabilityIcons[index],
}));

export const visualSignals = [
  { icon: Code2, label: "Typed UI", detail: "React + TypeScript" },
  { icon: Sparkles, label: "Applied ML", detail: "CNNs + forecasting" },
  { icon: Cloud, label: "Deployments", detail: "AWS + CI/CD" },
];
