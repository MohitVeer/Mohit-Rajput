-- CMS content schema: lets the admin edit Experience/Skills/Certifications/
-- Superbadges/Articles/Projects from the dashboard without a code deploy.
-- Public (anon) role gets read-only SELECT on all of these — this is the
-- same content already public in the compiled JS bundle today, so no new
-- exposure. Writes are restricted to the authenticated admin, matching the
-- existing analytics tables' "auth.role() = 'authenticated'" convention.

create table public.experience (
  id uuid primary key default gen_random_uuid(),
  role text not null,
  company text not null,
  period text not null,
  location text not null,
  bullets text[] not null default '{}',
  achievements text[] not null default '{}',
  clients text[] not null default '{}',
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.skill_groups (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  skills text[] not null default '{}',
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.cert_groups (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  logo text,
  -- array of {name, image, alt, fileUrl} — kept as jsonb rather than a
  -- child table since it's edited as a unit and rarely changes.
  certs jsonb not null default '[]'::jsonb,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.superbadges (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null,
  image text,
  url text not null,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.articles (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  summary text not null,
  url text not null,
  published_on text not null default 'LinkedIn',
  read_time text,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null,
  image text,
  tags text[] not null default '{}',
  live_url text,
  repo_url text,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.set_content_updated_at()
returns trigger
language plpgsql
as $fn$
begin
  new.updated_at = now();
  return new;
end;
$fn$;

create trigger set_updated_at before update on public.experience
  for each row execute function public.set_content_updated_at();
create trigger set_updated_at before update on public.skill_groups
  for each row execute function public.set_content_updated_at();
create trigger set_updated_at before update on public.cert_groups
  for each row execute function public.set_content_updated_at();
create trigger set_updated_at before update on public.superbadges
  for each row execute function public.set_content_updated_at();
create trigger set_updated_at before update on public.articles
  for each row execute function public.set_content_updated_at();
create trigger set_updated_at before update on public.projects
  for each row execute function public.set_content_updated_at();

alter table public.experience enable row level security;
alter table public.skill_groups enable row level security;
alter table public.cert_groups enable row level security;
alter table public.superbadges enable row level security;
alter table public.articles enable row level security;
alter table public.projects enable row level security;

do $$
declare
  t text;
begin
  foreach t in array array['experience', 'skill_groups', 'cert_groups', 'superbadges', 'articles', 'projects']
  loop
    execute format('drop policy if exists "public read %1$s" on public.%1$I', t);
    execute format('create policy "public read %1$s" on public.%1$I for select using (true)', t);

    execute format('drop policy if exists "admin write %1$s" on public.%1$I', t);
    execute format(
      'create policy "admin write %1$s" on public.%1$I for all using (auth.role() = ''authenticated'') with check (auth.role() = ''authenticated'')',
      t
    );
  end loop;
end $$;
insert into public.experience (role, company, period, location, bullets, achievements, clients, sort_order) values ($q$Salesforce Consultant$q$, $q$Wipro$q$, $q$Sep 2024 — Present$q$, $q$Greater Noida, India$q$, ARRAY[$q$Translated high-fidelity Figma and Adobe XD prototypes into pixel-perfect, production-ready Lightning Web Components across 2 enterprise portals — the exact workflow this role requires.$q$, $q$Applied SLDS design tokens and component patterns throughout to ensure a consistent, accessible, high-quality user experience.$q$, $q$Reduced LWC portal load time from ~3.2s to 1.5s (~50%) via cached Apex, reactive-property tuning and fewer DOM re-renders.$q$, $q$Accelerated delivery cycles from 10 → 6–7 days (~35%) with a reusable SLDS component library.$q$, $q$Enforced WCAG 2.1 AA across LWC UI — keyboard nav, semantic HTML, screen-reader parity.$q$, $q$Resolved 300+ production defects within SLA, sustaining 4.5+/5 CSAT.$q$, $q$Awarded Circle of Excellence for independently resolving high-impact production defects.$q$]::text[], ARRAY[$q$Circle of Excellence Award — resolving high-impact production defects and improving platform stability.$q$]::text[], ARRAY[$q$American Honda$q$, $q$St. James's Place$q$]::text[], 0);

insert into public.experience (role, company, period, location, bullets, achievements, clients, sort_order) values ($q$Developer$q$, $q$Mphasis Silverline$q$, $q$Aug 2022 — Sep 2024$q$, $q$Bengaluru, India$q$, ARRAY[$q$Delivered Apex, LWC, FlexCard, and OmniScript solutions across 5+ Financial Services and Health Cloud implementations for 8+ enterprise clients (Republic Finance, Arvest Bank, Wealth Enhancement Group, Peoples Bank, Teledoc, Five Star Bank, Beatport), improving user journey completion rates 20%.$q$, $q$Contributed to Foundry, a reusable component/OmniStudio accelerator, reducing implementation timelines 35% across 3 engagements and enabling pre-sales demos.$q$, $q$Designed reusable LWC/OmniStudio frameworks for 4 client-facing Experience Cloud portals using SLDS patterns, reducing per-portal development time approximately 30%.$q$, $q$Developed responsive AMPscript emails validated across Outlook, Gmail, and Apple Mail using Litmus, ensuring consistent rendering for Marketing Cloud campaigns.$q$, $q$Collaborated with solution architects and domain consultants to translate design intent into precise, accessible component implementations aligned with Financial Services and Health Cloud data models.$q$, $q$Maintained consistent SLDS styling and responsive design standards across 6+ concurrent client projects, ensuring cross-cloud UI consistency.$q$, $q$Received Measure of Excellence, Circle of Excellence and You Rock awards.$q$]::text[], ARRAY[$q$Measure of Excellence$q$, $q$Circle of Excellence$q$, $q$You Rock Awards$q$]::text[], ARRAY[$q$Republic Finance$q$, $q$Arvest Bank$q$, $q$Wealth Enhancement Group$q$, $q$Teledoc$q$, $q$Five Star Bank$q$, $q$Beatport$q$]::text[], 1);

insert into public.experience (role, company, period, location, bullets, achievements, clients, sort_order) values ($q$UI Developer$q$, $q$DJT Corporation & Investments$q$, $q$Nov 2021 — May 2022$q$, $q$Noida, India$q$, ARRAY[$q$Developed production web applications and full-page user experiences using React.js and Vue.js, building reusable frontend components with JavaScript, HTML5, CSS3, and Bootstrap 4.$q$, $q$Translated design concepts and UI requirements into responsive, interactive frontend interfaces, focusing on component reusability, cross-browser compatibility, usability, and consistent visual implementation.$q$, $q$Built frontend features for multiple client-facing web and e-commerce projects, working across different business requirements and adapting reusable UI patterns to individual product experiences.$q$, $q$Developed the Smart Cart web application using React.js, implementing frontend functionality supporting in-store product scanning and digital checkout workflows.$q$, $q$Worked on the House of Believe e-commerce storefront using Shopify, implementing and customizing the frontend experience to match brand requirements and responsive design expectations.$q$, $q$Integrated frontend applications with backend/API services where required, consuming application data and connecting UI components with business workflows.$q$, $q$Debugged frontend issues, performed usability testing, and resolved UI defects across browsers and devices to improve stability and overall user experience.$q$, $q$Collaborated with designers and other developers throughout the development lifecycle, translating requirements and visual designs into production-ready web interfaces.$q$]::text[], ARRAY[$q$Formal appreciation from MD and stakeholders for delivery on the House of Believe and DJT brand websites.$q$]::text[], ARRAY[$q$Deerika$q$, $q$House of Believe$q$, $q$DJT Corporation & Investments$q$, $q$Mall Fifty One$q$, $q$Pharma Aviorion$q$, $q$Smart Cart$q$]::text[], 2);

insert into public.experience (role, company, period, location, bullets, achievements, clients, sort_order) values ($q$Front-End Developer$q$, $q$Escade Technologies$q$, $q$Jan 2021 — Oct 2021$q$, $q$Aligarh, India$q$, ARRAY[$q$Developed production frontend features and complete responsive pages using React.js, JavaScript, HTML5, and CSS3, translating design mockups into functional and reusable user interfaces.$q$, $q$Built reusable React components and interactive UI elements while maintaining consistent layouts, responsive behavior, and cross-browser compatibility across multiple client projects.$q$, $q$Worked closely with design and development teams to translate visual requirements into production-ready frontend implementations while maintaining usability and visual consistency.$q$, $q$Implemented frontend interactions and application workflows using JavaScript and React.js, integrating UI components with application data and backend/API services where required.$q$, $q$Performed usability testing and frontend debugging to identify layout, interaction, and functional issues across development cycles.$q$, $q$Resolved UI defects and refined frontend implementations based on testing and stakeholder feedback, contributing to an approximately 30% reduction in reported UI issues.$q$]::text[], ARRAY[]::text[], ARRAY[]::text[], 3);

insert into public.skill_groups (title, skills, sort_order) values ($q$Salesforce$q$, ARRAY[$q$LWC$q$, $q$Apex$q$, $q$SOQL$q$, $q$OmniStudio / Vlocity$q$, $q$FlexCards$q$, $q$OmniScripts$q$, $q$DataRaptors$q$, $q$Experience Cloud$q$, $q$SLDS$q$, $q$Aura$q$, $q$Visualforce$q$, $q$Agentforce$q$, $q$Prompt Builder$q$, $q$Flows$q$]::text[], 0);

insert into public.skill_groups (title, skills, sort_order) values ($q$Frontend$q$, ARRAY[$q$React.js$q$, $q$Vue.js$q$, $q$Next.js$q$, $q$TypeScript$q$, $q$JavaScript (ES6+)$q$, $q$Node.js$q$, $q$HTML5$q$, $q$CSS3 / SCSS$q$, $q$Advanced CSS$q$, $q$Responsive Design$q$, $q$Complex Layouts$q$, $q$Animations$q$, $q$DOM Optimization$q$, $q$REST API Integration$q$, $q$Cross-Browser Compatibility$q$]::text[], 1);

insert into public.skill_groups (title, skills, sort_order) values ($q$UI / UX & Design-to-Code$q$, ARRAY[$q$Figma$q$, $q$Adobe XD$q$, $q$Design-to-Code$q$, $q$Pixel-Perfect UI$q$, $q$Design Systems$q$, $q$SLDS$q$, $q$Responsive UI$q$, $q$Accessibility$q$, $q$Component Design$q$]::text[], 2);

insert into public.skill_groups (title, skills, sort_order) values ($q$Marketing Cloud$q$, ARRAY[$q$Email Studio$q$, $q$AMPscript$q$, $q$Journey Builder$q$, $q$Cloud Pages$q$, $q$Data Extensions$q$, $q$Personalization$q$]::text[], 3);

insert into public.skill_groups (title, skills, sort_order) values ($q$DevOps & Tools$q$, ARRAY[$q$Git$q$, $q$GitHub$q$, $q$Gearset$q$, $q$SFDX CLI$q$, $q$VS Code$q$, $q$JIRA$q$, $q$Postman$q$, $q$NPM$q$, $q$Node.js$q$, $q$Litmus$q$]::text[], 4);

insert into public.skill_groups (title, skills, sort_order) values ($q$Delivery & Collaboration$q$, ARRAY[$q$Agile (Scrum)$q$, $q$Waterfall$q$, $q$Sprint Planning$q$, $q$Backlog Refinement$q$, $q$Sprint Reviews$q$, $q$Retrospectives$q$, $q$Requirement Gathering$q$, $q$Stakeholder Collaboration$q$, $q$Cross-functional Teams$q$]::text[], 5);

insert into public.cert_groups (title, logo, certs, sort_order) values ($q$Agentforce$q$, $q$/Salesforce Product Icons/agentforce-logo.png$q$, $q$[{"name":"Salesforce Certified AI Associate","image":"/Salesforce Icons/sf-cert-AI-Associate-rtd/High Res/2026-01_Badge_SF-Certified_AI-Associate_High-Res_RETIRED.png","alt":"Salesforce Certified AI Associate","fileUrl":"/Certifications/AI_Associate.pdf"}]$q$::jsonb, 0);

insert into public.cert_groups (title, logo, certs, sort_order) values ($q$Industry Solutions$q$, $q$/Salesforce Product Icons/industry-solutions-logo.png$q$, $q$[{"name":"Salesforce Certified OmniStudio Consultant","image":"/Salesforce Icons/sf-cert-OmniStudio-Consultant/High Res/2025-04_Badge_SF-Certified_Omnistudio-Con_High-Res.png","alt":"Salesforce Certified OmniStudio Consultant","fileUrl":"/Certifications/Omnistudio_Consultant.pdf"},{"name":"Salesforce Certified OmniStudio Developer","image":"/Salesforce Icons/sf-cert-OmniStudio-Developer/High Res/2025-04_Badge_SF-Certified_Omnistudio-Dev_High-Res.png","alt":"Salesforce Certified OmniStudio Developer","fileUrl":"/Certifications/Omnistudio_Developer.pdf"}]$q$::jsonb, 1);

insert into public.cert_groups (title, logo, certs, sort_order) values ($q$Marketing Cloud$q$, $q$/Salesforce Product Icons/marketing-cloud-logo.png$q$, $q$[{"name":"Salesforce Certified Marketing Cloud Email Specialist","image":"/Salesforce Icons/sf-cert-Marketing-Cloud-Email-Specialist/High Res/2021-03_Badge_SF-Certified_Marketing-Cloud-Email-Specialist_High-Res.png","alt":"Salesforce Certified Marketing Cloud Email Specialist","fileUrl":"/Certifications/Marketing_Cloud_Email_Specialist.pdf"},{"name":"Salesforce Certified Marketing Cloud Engagement Developer","image":"/Salesforce Icons/sf-cert-Marketing-Cloud-Engagement-Developer/High Res/2025-04_Badge_SF-Certified_MC-Eng-Dev_High-Res.png","alt":"Salesforce Certified Marketing Cloud Engagement Developer","fileUrl":"/Certifications/Marketing_Cloud_Engagement_Developer.pdf"},{"name":"Marketing Cloud Personalization Accredited Professional","image":"/Salesforce Icons/plc-marketing-cloud-personalization/High Res/2021-04_PLC-AP-Badge_MC-Personalization_High-Res.png","alt":"Marketing Cloud Personalization Accredited Professional","fileUrl":"/Certifications/Marketing_Cloud_Personalization.pdf"}]$q$::jsonb, 2);

insert into public.cert_groups (title, logo, certs, sort_order) values ($q$Salesforce Platform$q$, $q$/Salesforce Product Icons/salesforce-platform-logo.png$q$, $q$[{"name":"Salesforce Certified Platform Foundations","image":"/Salesforce Icons/sf-cert-associate-platform-foundations/High Res/2025-03_Badge_SF-Certified_Platform-Foundations_High-Res.png","alt":"Salesforce Certified Platform Foundations","fileUrl":"/Certifications/Platform_Foundations.pdf"},{"name":"Salesforce Certified Platform Developer I","image":"/Salesforce Icons/sf-cert-platform-developer-I/High Res/2025-04_Badge_SF-Certified_Plat-Dev_High-Res.png","alt":"Salesforce Certified Platform Developer I","fileUrl":"/Certifications/Platform_Developer.pdf"},{"name":"Salesforce Certified Platform User Experience Designer","image":"/Salesforce Icons/sf-cert-platform-ux-designer/High Res/2025-03_Badge_SF-Certified_Plat-UX-Dsgn_High-Res.png","alt":"Salesforce Certified Platform User Experience Designer","fileUrl":"/Certifications/Platform_User_Experience_Designer.pdf"}]$q$::jsonb, 3);

insert into public.superbadges (title, description, image, url, sort_order) values ($q$Superbadge: Agentforce Service$q$, $q$Customize an Agentforce Service Agent for customer inquiries and bookings.$q$, $q$/Superbadges/Agentforce Service.webp$q$, $q$https://www.salesforce.com/trailblazer/mrajputsl$q$, 0);

insert into public.superbadges (title, description, image, url, sort_order) values ($q$Superbadge: Prompt Builder Templates$q$, $q$Build Prompt Builder templates for AI-powered engagement.$q$, $q$/Superbadges/Prompt Builder Templates.webp$q$, $q$https://www.salesforce.com/trailblazer/mrajputsl$q$, 1);

insert into public.superbadges (title, description, image, url, sort_order) values ($q$Superbadge: Record-Triggered Flow$q$, $q$Automate processes for efficient, insightful record management.$q$, $q$/Superbadges/Record-Triggered Flow.webp$q$, $q$https://www.salesforce.com/trailblazer/mrajputsl$q$, 2);

insert into public.superbadges (title, description, image, url, sort_order) values ($q$Superbadge: User Experience Superbadge Unit$q$, $q$Design intuitive Salesforce user experiences with Lightning tools.$q$, $q$/Superbadges/User Experience Superbadge.webp$q$, $q$https://www.salesforce.com/trailblazer/mrajputsl$q$, 3);

insert into public.superbadges (title, description, image, url, sort_order) values ($q$Superbadge: Lightning Web Components Specialist$q$, $q$Build scalable Lightning Web Components for modern Salesforce apps.$q$, $q$/Superbadges/Lightning Web Components Specialist.webp$q$, $q$https://www.salesforce.com/trailblazer/mrajputsl$q$, 4);

insert into public.articles (title, summary, url, published_on, read_time, sort_order) values ($q$3.2 Seconds$q$, $q$That was our Experience Cloud portal load time when I stepped in — here's how we brought it down.$q$, $q$https://www.linkedin.com/pulse/32-seconds-mohit-rajput-d7prc$q$, $q$LinkedIn$q$, $q$4 min read$q$, 0);

insert into public.articles (title, summary, url, published_on, read_time, sort_order) values ($q$Welcome to SLDS 2: A New Era of Customization in Salesforce$q$, $q$Salesforce has launched SLDS 2 (Beta), bringing enhanced flexibility to Lightning Design System.$q$, $q$https://www.linkedin.com/pulse/welcome-slds-2-new-era-customization-salesforce-ui-mohit-rajput-g463c$q$, $q$LinkedIn$q$, $q$2 min read$q$, 1);

insert into public.articles (title, summary, url, published_on, read_time, sort_order) values ($q$Understanding Email Client Rendering: Why It Matters for Marketing Cloud$q$, $q$In today's digital world, email marketing is essential — and rendering consistency across clients makes or breaks it.$q$, $q$https://www.linkedin.com/pulse/understanding-email-client-rendering-why-matters-your-mohit-rajput-q3t3c$q$, $q$LinkedIn$q$, $q$4 min read$q$, 2);

insert into public.articles (title, summary, url, published_on, read_time, sort_order) values ($q$Personalizing Financial Websites with MCP$q$, $q$Personalization is a crucial aspect of engaging customers and building trust on financial services websites.$q$, $q$https://www.linkedin.com/pulse/personalizing-financial-websites-mcp-mohit-rajput-saozc$q$, $q$LinkedIn$q$, $q$2 min read$q$, 3);

insert into public.articles (title, summary, url, published_on, read_time, sort_order) values ($q$Elevating E-commerce with Salesforce Marketing Cloud Personalization$q$, $q$In today's hyper-connected world, personalization has become the key differentiator for e-commerce brands.$q$, $q$https://www.linkedin.com/pulse/elevating-e-commerce-salesforce-marketing-cloud-mohit-rajput-uchac$q$, $q$LinkedIn$q$, $q$5 min read$q$, 4);

insert into public.articles (title, summary, url, published_on, read_time, sort_order) values ($q$React on Salesforce Is Finally Real — But LWC Is Not Going Anywhere$q$, $q$Salesforce Multi-Framework now lets teams build React apps natively on the platform — an additional architectural choice alongside LWC, not a replacement for it.$q$, $q$https://www.linkedin.com/pulse/react-salesforce-finally-real-lwc-going-anywhere-mohit-rajput-sohtf/$q$, $q$LinkedIn$q$, $q$3 min read$q$, 5);
