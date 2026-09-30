-- ============================================================
-- DEENU PRAKASH PORTFOLIO CMS
-- SUPABASE DATABASE
-- ============================================================


-- ============================================================
-- 1. ADMIN USERS
-- ============================================================

create table if not exists public.admin_users (

  user_id uuid
    primary key
    references auth.users(id)
    on delete cascade,

  created_at timestamptz
    not null
    default now()

);


-- ============================================================
-- 2. PORTFOLIO CONTENT
-- ============================================================

create table if not exists public.portfolio_content (

  id text
    primary key,

  content jsonb
    not null
    default '{}'::jsonb,

  updated_at timestamptz
    not null
    default now()

);


-- ============================================================
-- 3. PORTFOLIO PROJECTS
-- ============================================================

create table if not exists public.portfolio_projects (

  id uuid
    primary key
    default gen_random_uuid(),

  title text
    not null,

  description text,

  tools text[]
    not null
    default '{}',

  problem text,

  solution text,

  features text[]
    not null
    default '{}',

  results text,

  image_url text,

  demo_data_note text,

  sort_order integer
    not null
    default 0,

  demo boolean
    not null
    default true,

  published boolean
    not null
    default true,

  created_at timestamptz
    not null
    default now(),

  updated_at timestamptz
    not null
    default now()

);


-- ============================================================
-- 4. INDEX
-- ============================================================

create index if not exists
portfolio_projects_sort_idx

on public.portfolio_projects
(
  sort_order,
  created_at
);


-- ============================================================
-- 5. ENABLE RLS
-- ============================================================

alter table public.admin_users
enable row level security;

alter table public.portfolio_content
enable row level security;

alter table public.portfolio_projects
enable row level security;


-- ============================================================
-- 6. ADMIN CHECK FUNCTION
-- ============================================================

create schema if not exists private;


create or replace function private.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$

  select exists (

    select 1

    from public.admin_users

    where user_id =
      (select auth.uid())

  );

$$;


revoke all
on function private.is_admin()
from public;


grant execute
on function private.is_admin()
to authenticated;


-- ============================================================
-- 7. GRANTS
-- ============================================================

grant select
on public.portfolio_content
to anon, authenticated;


grant insert, update
on public.portfolio_content
to authenticated;


grant select
on public.portfolio_projects
to anon, authenticated;


grant insert,
      update,
      delete
on public.portfolio_projects
to authenticated;


-- ============================================================
-- 8. PORTFOLIO CONTENT POLICIES
-- ============================================================

drop policy if exists
"Public can read portfolio content"
on public.portfolio_content;


create policy
"Public can read portfolio content"

on public.portfolio_content

for select

to anon, authenticated

using (true);


drop policy if exists
"Admins can insert portfolio content"
on public.portfolio_content;


create policy
"Admins can insert portfolio content"

on public.portfolio_content

for insert

to authenticated

with check (
  (select private.is_admin())
);


drop policy if exists
"Admins can update portfolio content"
on public.portfolio_content;


create policy
"Admins can update portfolio content"

on public.portfolio_content

for update

to authenticated

using (
  (select private.is_admin())
)

with check (
  (select private.is_admin())
);


-- ============================================================
-- 9. PROJECT POLICIES
-- ============================================================

drop policy if exists
"Public can read published projects"
on public.portfolio_projects;


create policy
"Public can read published projects"

on public.portfolio_projects

for select

to anon

using (
  published = true
);


drop policy if exists
"Authenticated users can read projects"
on public.portfolio_projects;


create policy
"Authenticated users can read projects"

on public.portfolio_projects

for select

to authenticated

using (
  published = true
  or
  (select private.is_admin())
);


drop policy if exists
"Admins can insert projects"
on public.portfolio_projects;


create policy
"Admins can insert projects"

on public.portfolio_projects

for insert

to authenticated

with check (
  (select private.is_admin())
);


drop policy if exists
"Admins can update projects"
on public.portfolio_projects;


create policy
"Admins can update projects"

on public.portfolio_projects

for update

to authenticated

using (
  (select private.is_admin())
)

with check (
  (select private.is_admin())
);


drop policy if exists
"Admins can delete projects"
on public.portfolio_projects;


create policy
"Admins can delete projects"

on public.portfolio_projects

for delete

to authenticated

using (
  (select private.is_admin())
);


-- ============================================================
-- 10. INITIAL PORTFOLIO CONTENT
-- ============================================================

insert into public.portfolio_content
(
  id,
  content
)

values

(
  'main',

  '{
    "profile": {
      "name": "Deenu Prakash",
      "eyebrow": "Data Research Analyst · Simpliaxis",
      "role": "Data & Business Analyst",
      "titleLine1": "Data Analyst",
      "titleLine2": "Business Analyst",
      "subtitle": "Turning business data into actionable insights, dashboards and better decisions.",
      "description": "I specialize in sales analytics, CRM data, reporting, dashboards and business analysis — helping teams turn raw spreadsheets and CRM records into clear, decision-ready numbers.",
      "profileImageUrl": "assets/profile.jpg",
      "resumeUrl": "assets/resume.pdf"
    },

    "stats": [
      {
        "value": "2+",
        "label": "Years Experience"
      },
      {
        "value": "10K+",
        "label": "Records Analyzed"
      },
      {
        "value": "3+",
        "label": "Team Members Managed"
      },
      {
        "value": "Multiple",
        "label": "Dashboards Built"
      }
    ],

    "about": {
      "paragraphs": [
        "I am a Data Research Analyst and Business Analyst currently working at Simpliaxis, with over two years of experience turning sales, lead and CRM data into reports leadership can act on.",
        "I work extensively with Salesforce and LeadSquared to manage CRM data, audit leads and monitor follow-up activity. I build recurring sales and performance reports in Excel, Google Sheets and Power BI.",
        "I also care about data quality — validating, cleaning and auditing records before they reach a dashboard."
      ],

      "bullets": [
        "Data analysis & sales reporting",
        "CRM management & lead auditing",
        "Dashboard development & KPI reporting",
        "Incentive calculation & data quality"
      ],

      "education": [
        {
          "degree": "Master of Computer Applications (MCA)",
          "meta": "Postgraduate"
        },
        {
          "degree": "Bachelor of Computer Applications (BCA)",
          "meta": "Undergraduate"
        }
      ],

      "focusTags": [
        "Sales Analytics",
        "CRM Data",
        "Dashboards",
        "Business Reporting"
      ]
    },

    "skills": [
      {
        "category": "Data Analytics",
        "icon": "fa-chart-simple",
        "tags": [
          "Excel",
          "Advanced Excel",
          "SQL",
          "Power BI",
          "Google Sheets",
          "Data Cleaning",
          "Data Validation",
          "Data Analysis"
        ]
      },
      {
        "category": "CRM & Business Tools",
        "icon": "fa-users-gear",
        "tags": [
          "Salesforce",
          "LeadSquared",
          "CRM Data Management",
          "Lead Management",
          "Sales Reporting"
        ]
      },
      {
        "category": "Business Analysis",
        "icon": "fa-diagram-project",
        "tags": [
          "Requirements Gathering",
          "KPI Reporting",
          "Business Reporting",
          "Process Improvement",
          "Stakeholder Coordination",
          "Data Auditing"
        ]
      },
      {
        "category": "Technical",
        "icon": "fa-code",
        "tags": [
          "HTML",
          "CSS",
          "JavaScript",
          "Python Basics"
        ]
      }
    ],

    "experience": [
      {
        "role": "Data Research Analyst / Business Analyst",
        "company": "Simpliaxis",
        "date": "2024 – Present",
        "bullets": [
          "Analyze sales and lead data to support business decisions",
          "Manage CRM data across Salesforce and LeadSquared",
          "Prepare daily, weekly and monthly performance reports",
          "Build Excel and dashboard-based reporting for stakeholders",
          "Track sales KPIs and monitor follow-up activities",
          "Perform lead audits and validate data quality",
          "Calculate sales incentives based on payment performance",
          "Support operational requirements and coordinate with team members",
          "Manage and support a small team"
        ]
      }
    ],

    "contact": {
      "phone": "8367418575",
      "whatsapp": "8074167158",
      "email": "deenuprakash100@gmail.com"
    },

    "social": {
      "linkedin": "https://www.linkedin.com/in/deenu-prakash-venkatesulugari-22a6b6338",
      "github": "https://github.com/deenuprakash100-lgtm"
    }
  }'::jsonb

)

on conflict (id)

do update

set
  content = excluded.content,
  updated_at = now();


-- ============================================================
-- 11. AFTER CREATING YOUR AUTH USER
-- ============================================================
--
-- Example:
--
-- insert into public.admin_users (user_id)
-- values ('YOUR-SUPABASE-AUTH-USER-UUID');
--
-- ============================================================
