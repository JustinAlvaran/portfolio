import {
  ArrowUpRight,
  Award,
  CalendarDays,
  Code2,
  ExternalLink,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
} from "lucide-react";
import Image from "next/image";

import { PortfolioChat } from "@/components/portfolio-chat";
import { SocialIcons } from "@/components/social-icons";
import { TechLogoMarquee } from "@/components/tech-logo-marquee";
import { TestimonialStack } from "@/components/testimonial-stack";
import { ThemeToggle } from "@/components/theme-toggle";
import { TrackedLink } from "@/components/tracked-link";
import {
  education,
  buildGallery,
  experience,
  profile,
  projects,
  proofPoints,
  techGroups,
  timelineMilestones,
} from "@/lib/portfolio-data";

export default function Home() {
  return (
    <main className="portfolio-shell">
      <section className="profile-header" id="top">
        <div className="portrait-card">
          <Image
            alt="Justin Alvaran"
            fill
            priority
            sizes="(max-width: 620px) 128px, 160px"
            src="/profile.jpg"
          />
        </div>

        <div className="identity-block">
          <div className="name-line">
            <h1>{profile.name}</h1>
            <ShieldCheck size={18} />
          </div>
          <p className="location-line">
            <MapPin size={15} />
            {profile.location}
          </p>
          <p className="role-line">{profile.role}</p>

          <SocialIcons />
        </div>

        <div className="header-tools">
          <ThemeToggle />
          <div className="award-ribbon">
            <Award size={16} />
            2026 National Gold Medalist in AI &bull; WorldSkills ASEAN
          </div>
        </div>
      </section>

      <section className="portfolio-grid">
        <div className="main-column">
          <section className="panel about-panel">
            <h2>About</h2>
            {profile.about.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </section>

          <section className="panel stack-panel" id="stack">
            <div className="section-title">
              <h2>Tech Stack</h2>
            </div>
            <TechLogoMarquee />
          </section>

          <section className="panel projects-panel" id="work">
            <div className="section-title">
              <h2>Recent Projects</h2>
              <span>Selected</span>
            </div>
            <div className="project-list">
              {projects.map((project) => (
                <article key={project.name}>
                  <div>
                    <h3>{project.name}</h3>
                    <p>{project.summary}</p>
                    <span>{project.role}</span>
                  </div>
                  <strong>{project.result}</strong>
                  {project.links[0] && (
                    <TrackedLink
                      aria-label={`Visit ${project.name} live site`}
                      eventName="project_opened"
                      eventProperties={{
                        destination_domain: project.links[0].href.startsWith("http")
                          ? new URL(project.links[0].href).hostname
                          : "internal",
                        project_name: project.name,
                        project_type: project.type,
                      }}
                      href={project.links[0].href}
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      <ArrowUpRight size={16} />
                    </TrackedLink>
                  )}
                </article>
              ))}
            </div>
          </section>

          <section className="panel proof-panel">
            <div className="section-title">
              <h2>Proof Points</h2>
              <span>Resume signal</span>
            </div>
            <div className="proof-grid">
              {proofPoints.map((point) => (
                <div key={`${point.value}-${point.label}`}>
                  <strong>{point.value}</strong>
                  <span>{point.label}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="panel credentials-panel">
            <div className="section-title">
              <h2>Education & Credentials</h2>
              <span>Verified from resume</span>
            </div>
            {education.map((item) => (
              <article className="credential-row" key={`${item.school}-${item.detail}`}>
                <div>
                  <h3>{item.school}</h3>
                  <p>{item.detail}</p>
                </div>
                <span>{item.range}</span>
              </article>
            ))}
          </section>

          <section className="panel gallery-panel">
            <div className="section-title">
              <h2>Build Gallery</h2>
              <span>Selected snapshots</span>
            </div>
            <div className="gallery-track">
              {buildGallery.map((visual, index) => {
                const group = techGroups.find((item) => item.title === visual.title);
                const Icon = group?.icon ?? Award;
                return (
                  <div className="gallery-tile" key={visual.title}>
                    <Image
                      alt={visual.alt ?? `${visual.title} preview`}
                      fill
                      sizes="160px"
                      src={visual.image}
                    />
                    <div className="gallery-overlay" />
                    <Icon size={24} />
                    <strong>{visual.title}</strong>
                    <span>{visual.subtitle ?? group?.skills.slice(0, 3).join(" / ")}</span>
                    <i>{String(index + 1).padStart(2, "0")}</i>
                  </div>
                );
              })}
            </div>
          </section>
        </div>

        <aside className="side-column">
          <TestimonialStack />

          <section className="panel experience-panel" id="experience">
            <h2>Experience</h2>
            <div className="timeline-list">
              {experience.map((item) => (
                <article key={`${item.company}-${item.range}`}>
                  <span />
                  <div>
                    <h3>{item.title}</h3>
                    <p>{item.company}</p>
                  </div>
                  <small>{item.range}</small>
                </article>
              ))}
              {timelineMilestones.map((item) => (
                <article key={`${item.title}-${item.year}`}>
                  <span />
                  <div>
                    <h3>{item.title}</h3>
                    <p>{item.detail}</p>
                  </div>
                  <small>{item.year}</small>
                </article>
              ))}
            </div>
          </section>

          <section className="panel contact-panel">
            <h2>Contact</h2>
            <TrackedLink
              eventName="external_link_clicked"
              eventProperties={{
                destination_domain: "email",
                link_type: "email",
                placement: "contact_panel",
              }}
              href={`mailto:${profile.email}`}
            >
              <Mail size={15} />
              {profile.email}
            </TrackedLink>
            <TrackedLink
              eventName="external_link_clicked"
              eventProperties={{
                destination_domain: "phone",
                link_type: "phone",
                placement: "contact_panel",
              }}
              href={`tel:${profile.phone.replaceAll(" ", "")}`}
            >
              <Phone size={15} />
              {profile.phone}
            </TrackedLink>
            <TrackedLink
              eventName="external_link_clicked"
              eventProperties={{
                destination_domain: profile.github.startsWith("http")
                  ? new URL(profile.github).hostname
                  : "github.com",
                link_type: "github",
                placement: "contact_panel",
              }}
              href={profile.github}
              rel="noopener noreferrer"
              target="_blank"
            >
              <Code2 size={15} />
              GitHub
            </TrackedLink>
            <TrackedLink
              eventName="external_link_clicked"
              eventProperties={{
                destination_domain: profile.linkedin.startsWith("http")
                  ? new URL(profile.linkedin).hostname
                  : "linkedin.com",
                link_type: "linkedin",
                placement: "contact_panel",
              }}
              href={profile.linkedin}
              rel="noopener noreferrer"
              target="_blank"
            >
              <ExternalLink size={15} />
              LinkedIn
            </TrackedLink>
          </section>

          <section className="panel availability-panel">
            <CalendarDays size={18} />
            <h2>Available for focused engineering work.</h2>
            <p>
              Strong fit for Next.js builds, REST integrations, deployment
              workflows, and applied AI/ML prototypes.
            </p>
          </section>
        </aside>
      </section>

      <footer className="site-footer">
        <span>&copy; 2026 {profile.name}. All rights reserved.</span>
      </footer>

      <PortfolioChat />
    </main>
  );
}
