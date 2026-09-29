export const profile = {
  name: "Justin A. Alvaran",
  role: "Junior Software Engineer | AI/ML Practitioner",
  location: "Davao, Philippines",
  email: "justinalvaran053023@gmail.com",
  phone: "+63 991 669 2884",
  github: "https://github.com/JustinAlvaran",
  linkedin: "https://linkedin.com/in/justin-alvaran-a67627410",
  resume: "/justin-alvaran-resume.pdf",
  headline:
    "Two full years of production engineering experience with Next.js, TypeScript, PostgreSQL, and deployable AI systems.",
  intro:
    "I build responsive Next.js applications, REST API integrations, CI/CD pipelines, and deployable AI systems that move from model development to monitored production environments.",
  about: [
    "Junior Software Engineer with two full years of production engineering experience with Next.js, TypeScript, PostgreSQL, and deployable AI systems.",
    "My work spans Figma-to-code delivery, analytics instrumentation, CMS integrations, secure public forms, and automated cloud deployments on AWS and Vercel.",
    "On the AI/ML side, I build forecasting and computer-vision pipelines with explainability, validated inference APIs, and containerized deployment paths.",
  ],
};

export const proofPoints = [
  { value: "4", label: "production websites shipped" },
  { value: "30-40%", label: "page-load improvement" },
  { value: "98%", label: "CNN crack-detection accuracy" },
  { value: "0.85", label: "construction model R-squared" },
  { value: "50k", label: "infrastructure images trained" },
  { value: "<200ms", label: "CNN inference latency" },
];

export const navItems = [
  { href: "#work", label: "Work" },
  { href: "#stack", label: "Stack" },
  { href: "#experience", label: "Experience" },
  { href: "#chat", label: "Ask" },
];

type ProjectLink = {
  label: string;
  href: string;
};

type PortfolioProject = {
  name: string;
  year: string;
  type: string;
  role: string;
  summary: string;
  details: string;
  result: string;
  signal: string;
  palette: "green" | "red" | "amber";
  links: ProjectLink[];
};

export const projects: PortfolioProject[] = [
  {
    name: "Flood Classification & Edge AI",
    year: "2026",
    type: "AI Pipeline / Edge Deployment",
    role: "Python, PyTorch, ONNX, OpenVINO, Streamlit",
    summary:
      "TESDA National Skills Competition 2026 Gold Medal Project: End-to-end flood classification pipeline deployed to the edge.",
    details:
      "Preprocessed 2,000+ hydrological sensor records with 7% minority class imbalance, trained an MLP neural network achieving 95.76% accuracy and 0.9411 Macro F1 on held-out test data. Exported to ONNX and compiled to OpenVINO IR for standalone real-time edge alerts.",
    result: "95.76% accuracy (Gold Medal)",
    signal: "ONNX + OpenVINO IR Edge Engine",
    palette: "green",
    links: [],
  },
  {
    name: "UrbanGrid App",
    year: "2026",
    type: "AI infrastructure",
    role: "Python, FastAPI, Docker, Streamlit",
    summary:
      "Smart-city AI pipeline for energy-demand forecasting and infrastructure crack detection.",
    details:
      "Engineered IoT forecasting features, compared Random Forest, XGBoost, and SVM models with cross-validation, trained a ResNet50 crack-detection CNN, and deployed monitored FastAPI inference services with Docker and Streamlit.",
    result: "98% validation accuracy",
    signal: "50,000 images + Grad-CAM",
    palette: "green",
    links: [],
  },
  {
    name: "AI Water Meter",
    year: "2026",
    type: "Developer Observability / Extension",
    role: "TypeScript, React, Tailwind CSS, Supabase, Jest, Chrome Extension MV3",
    summary:
      "Real-time AI carbon, energy, and water footprint tracker and dashboard.",
    details:
      "Designed and built a Chrome/Edge Manifest V3 extension tracking token count and API telemetry in real-time. Built content script observers chunking updates to a floating React sidebar, designed telemetry gauges (latency, throughput, GPU equivalents) linked to a Supabase real-time backend, and achieved 100% test coverage with Jest.",
    result: "Real-time tracking (<200ms)",
    signal: "Telemetry + Mascot animations",
    palette: "amber",
    links: [],
  },
  {
    name: "LoopCI",
    year: "2026",
    type: "DevOps / Incident Response",
    role: "TypeScript, React, Node.js, Express, Jest, GitHub Webhooks, Docker",
    summary:
      "Evidence-based failure classification and repair planning platform for CI/CD builds.",
    details:
      "Created a monorepo platform that intercepts GitHub Actions failures via signed webhooks. Built a policy and classification engine that matches errors against an Engineering Memory Engine to pinpoint root cause, confidence, and owner. Integrated Slack, Teams, Jira, and SMTP routers, and deployed a React/Vite dashboard to track incident queues.",
    result: "94% classification confidence",
    signal: "Engineering Memory Engine v1",
    palette: "red",
    links: [],
  },
];

export const techGroupContent = [
  {
    title: "Frontend Systems",
    accent: "var(--signal-green)",
    skills: ["Next.js 15", "React 19", "TypeScript", "Tailwind CSS", "Zod"],
    proof: "Figma to responsive production components and runtime schema validation.",
  },
  {
    title: "Backend APIs",
    accent: "var(--signal-red)",
    skills: ["FastAPI", "Supabase", "PostgreSQL", "Node.js", "Express.js"],
    proof: "REST APIs, database migrations, real-time data, and protected routes.",
  },
  {
    title: "AI / ML",
    accent: "var(--signal-amber)",
    skills: ["Claude Code", "TensorFlow", "PyTorch", "scikit-learn", "LangChain", "LangGraph"],
    proof: "Forecasting, transfer learning, RAG, agentic workflows, and model explainability.",
  },
  {
    title: "Cloud + DevOps",
    accent: "var(--signal-green)",
    skills: ["AWS", "Microsoft Azure", "Docker", "GitLab CI/CD", "Claude Code"],
    proof: "OIDC pipelines, multi-environment deployments, AI developer workflows, and containers.",
  },
  {
    title: "Data + Modeling",
    accent: "var(--signal-red)",
    skills: ["PostgreSQL", "Supabase", "pandas", "NumPy", "XGBoost", "SQL"],
    proof: "Structured preprocessing, relational schemas, cross-validation, and tuning.",
  },
  {
    title: "Delivery + Analytics",
    accent: "var(--signal-amber)",
    skills: ["GTM", "GA4", "Mixpanel", "Directus CMS", "reCAPTCHA Enterprise"],
    proof: "Behavior analytics, automated content refreshes, input validation, and bot protection.",
  },
];

export const capabilityContent = [
  {
    label: "Product UI",
    copy: "Responsive pages, component systems, accessible interactions, and mobile QA.",
  },
  {
    label: "Systems Glue",
    copy: "REST integrations, CMS pipelines, deployment workflows, and automation logic.",
  },
  {
    label: "AI Delivery",
    copy: "Applied ML services that explain results and plug into real dashboards.",
  },
  {
    label: "Assistant UX",
    copy: "Bounded chat experiences with server-side rules, privacy notes, and rate limits.",
  },
];

export const experience = [
  {
    company: "Cornerstone International Technologies (CITC)",
    title: "Junior Software Engineer",
    range: "Aug 2024 to Sep 2026",
    points: [
      "Shipped 4 production web applications with Next.js 15, TypeScript, and Tailwind CSS, translating Figma designs into reusable UI components and improving page-load performance by 30-40% through code splitting and image optimization.",
      "Architected GitLab CI/CD pipelines with OIDC authentication to automate secure deployments to AWS S3 and CloudFront across multi-tier environments.",
      "Integrated Directus CMS with Next.js via REST APIs and SSG, implementing incremental static regeneration to automate nightly content refreshes.",
      "Configured Express.js middleware with Google reCAPTCHA Enterprise to defend public-facing forms against automated bot traffic.",
    ],
  },
  {
    company: "General Contractors",
    title: "Junior AI/ML Engineer (Contract)",
    range: "Nov 2025 to May 2026",
    points: [
      "Developed and trained an XGBoost regression model using Python, achieving R² = 0.85 on a cleaned dataset of 1,000+ historical construction records.",
      "Engineered data pipeline scripts with Pandas and NumPy to extract features from materials, labor costs, and project timelines.",
      "Deployed the model as a containerized microservice with FastAPI async endpoints on AWS and Azure, securing API inputs via Pydantic schema validation.",
    ],
  },
  {
    company: "CIRCA",
    title: "Forward Deployed Engineer Intern",
    range: "Aug 2026 to Sep 2026",
    points: [
      "Built and integrated API systems with TypeScript and Express.js, enabling service-to-service communication and RESTful endpoints.",
      "Orchestrated data pipelines using Kubeflow in a production distributed architecture, improving data processing reliability.",
    ],
  },
  {
    company: "Kinetrexa Software Private Limited",
    title: "AI & Machine Learning Intern",
    range: "Jul 2026 to Aug 2026",
    points: [
      "Developed end-to-end ML pipelines with NumPy, XGBoost, and Kubeflow, covering data collection, preprocessing, model training, hyperparameter tuning, and performance evaluation.",
      "Used MLflow for version-controlled experiments, streamlining iteration and improving model performance.",
    ],
  },
  {
    company: "Brinicle AI",
    title: "AI/ML Engineering Intern",
    range: "Jun 2026 to Jul 2026",
    points: [
      "Built and evaluated classification and regression models with Python, scikit-learn, and TensorFlow/Keras.",
      "Created data-preprocessing pipelines, feature-engineering steps, and model-evaluation metrics on validation data.",
    ],
  },
  {
    company: "BookMI",
    title: "Growth Intern (Technology)",
    range: "Jan 2026 to Mar 2026",
    points: [
      "Contributed to product development workflows by writing and debugging code, documenting features, and testing using Git, GitLab CI/CD, and PostgreSQL within agile sprint cycles.",
    ],
  },
];

export const timelineMilestones = [
  {
    title: "TESDA National Skills Competition",
    detail: "Gold Medalist (AI, Skill 53) | WorldSkills ASEAN Candidate",
    year: "Sep 2026",
  },
];

export const testimonials = [
  {
    avatar: "/portfolio-visuals/testimonial-ava.jpg",
    background: "/portfolio-visuals/web-build.jpg",
    id: 1,
    testimonial:
      "Justin is strongest when frontend, backend, and deployment work need to connect cleanly.",
    author: "Ava M. - Project collaborator",
  },
  {
    avatar: "/portfolio-visuals/testimonial-ben.jpg",
    background: "/portfolio-visuals/code-workspace.jpg",
    id: 2,
    testimonial:
      "He keeps the build practical: responsive UI, API wiring, and enough testing to trust the flow.",
    author: "Ben R. - Project collaborator",
  },
  {
    avatar: "/portfolio-visuals/testimonial-cai.jpg",
    background: "/portfolio-visuals/ai-network.jpg",
    id: 3,
    testimonial:
      "His AI/ML work is not just a demo. He thinks about data, explainability, and deployment paths.",
    author: "Cai T. - Technical proof note",
  },
];

export const buildGallery = [
  {
    alt: "WorldSkills feature story about Justin Alvaran competing in artificial intelligence",
    image: "/competition/ai-spotlight.jpg",
    subtitle: "Official RSO XI feature",
    title: "AI Competitor Spotlight",
  },
  {
    alt: "Justin Alvaran recognized as the 2026 Philippine National Skills Competition artificial intelligence gold medalist",
    image: "/competition/ai-gold-medalist.jpg",
    subtitle: "National gold medalist",
    title: "WorldSkills Gold",
  },
  {
    alt: "Official gallery of 2026 Philippine National Skills Competition competitors including Justin Alvaran",
    image: "/competition/competitor-gallery.jpg",
    subtitle: "Artificial Intelligence",
    title: "Gallery of Competitors",
  },
  {
    image: "/portfolio-visuals/code-workspace.jpg",
    title: "Frontend Systems",
  },
  {
    image: "/portfolio-visuals/cloud-systems.jpg",
    title: "Cloud + DevOps",
  },
  {
    image: "/portfolio-visuals/data-dashboard.jpg",
    title: "Data + Modeling",
  },
  {
    image: "/portfolio-visuals/web-build.jpg",
    title: "Backend APIs",
  },
  {
    image: "/portfolio-visuals/ai-network.jpg",
    title: "AI / ML",
  },
];

export const education = [
  {
    school: "University of Immaculate Conception",
    detail: "Bachelor of Science in Computer Science (Undergraduate)",
    range: "Davao, Philippines | 2023 - 2026",
  },
  {
    school: "TESDA WorldSkills Artificial Intelligence",
    detail:
      "Gold Medalist at the 2026 Philippine National Skills Competition in Artificial Intelligence, representing the Philippines at WorldSkills ASEAN",
    range: "National Gold Medalist | 2026",
  },
  {
    school: "Microsoft Certified",
    detail: "Azure AI Engineer Associate (AI-102)",
    range: "Certification",
  },
  {
    school: "Amazon Web Services (AWS)",
    detail: "Generative AI for Executives",
    range: "Certification",
  },
  {
    school: "Anthropic Certified",
    detail: "Claude Code 101 & AI Fluency",
    range: "Certification",
  },
];

export const hostingOptions = [
  {
    name: "Vercel Hobby",
    url: "https://vercel.com/pricing",
    verdict: "Best fit for this Next.js portfolio and your connected GitHub/Vercel setup.",
  },
  {
    name: "Cloudflare Pages",
    url: "https://pages.cloudflare.com/",
    verdict: "Excellent free static hosting and custom-domain support.",
  },
  {
    name: "Netlify",
    url: "https://www.netlify.com/pricing/",
    verdict: "Friendly free hosting with deploy previews and simple forms.",
  },
  {
    name: "GitHub Pages",
    url: "https://docs.github.com/en/pages",
    verdict: "Free and simple, but static-only and less natural for a Next.js chat route.",
  },
];

export const chatSuggestions = [
  "What kind of projects has Justin built?",
  "Which stack is strongest for Justin?",
  "Can Justin deploy a Next.js app to AWS?",
  "How do I contact Justin?",
];
