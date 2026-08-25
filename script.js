/* ==========================================================================
   DEENU PRAKASH PORTFOLIO — script.js
   Handles: mobile nav, scroll spy, reveal animations, animated counters,
   project data + modal, Chart.js dashboards, contact form validation,
   back-to-top button.
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initNav();
  initRevealAnimations();
  initCounters();
  initProjects();
  initCharts();
  initContactForm();
  initBackToTop();
});

/* --------------------------------------------------------------------------
   1. NAVIGATION: sticky shadow, mobile menu, active link on scroll
   -------------------------------------------------------------------------- */
function initNav() {
  const nav = document.getElementById('nav');
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');
  const links = Array.from(document.querySelectorAll('.nav__link'));
  const sections = links
    .map(link => document.querySelector(link.getAttribute('href')))
    .filter(Boolean);

  // Sticky shadow on scroll
  const onScroll = () => {
    nav.classList.toggle('is-scrolled', window.scrollY > 12);
    toggleBackToTop(window.scrollY > 500);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Mobile menu toggle
  navToggle.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('is-open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });

  // Close mobile menu when a link is clicked
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      nav.classList.remove('is-open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });

  // Active nav link via IntersectionObserver (scroll spy)
  if ('IntersectionObserver' in window && sections.length) {
    const spy = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const id = entry.target.id;
            links.forEach(link => {
              link.classList.toggle('is-active', link.getAttribute('href') === `#${id}`);
            });
          }
        });
      },
      { rootMargin: '-40% 0px -50% 0px', threshold: 0 }
    );
    sections.forEach(section => spy.observe(section));
  }
}

function toggleBackToTop(visible) {
  const btn = document.getElementById('backToTop');
  if (btn) btn.classList.toggle('is-visible', visible);
}

/* --------------------------------------------------------------------------
   2. SCROLL REVEAL ANIMATIONS
   -------------------------------------------------------------------------- */
function initRevealAnimations() {
  const revealEls = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window)) {
    revealEls.forEach(el => el.classList.add('is-visible'));
    return;
  }
  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );
  revealEls.forEach(el => observer.observe(el));
}

/* --------------------------------------------------------------------------
   3. ANIMATED KPI COUNTERS
   -------------------------------------------------------------------------- */
function initCounters() {
  const counters = document.querySelectorAll('.counter');
  if (!counters.length) return;

  const animateCounter = (el) => {
    const target = parseFloat(el.dataset.target);
    const suffix = el.dataset.suffix || '';
    const duration = 1400;
    const start = performance.now();

    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      const value = Math.round(target * eased);
      el.textContent = value + suffix;
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  if (!('IntersectionObserver' in window)) {
    counters.forEach(animateCounter);
    return;
  }

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.6 }
  );
  counters.forEach(el => observer.observe(el));
}

/* --------------------------------------------------------------------------
   4. PROJECTS — data, card rendering, modal
   -------------------------------------------------------------------------- */
const PROJECTS = [
  {
    id: 'sales-performance-dashboard',
    index: '01',
    title: 'Sales Performance Dashboard',
    description: 'An interactive dashboard for monitoring sales performance, payments, revenue, sales owners and key KPIs.',
    tools: ['Excel', 'JavaScript', 'Chart.js', 'HTML', 'CSS'],
    problem: 'Sales leadership needed a single, up-to-date view of revenue, payments and sales owner performance instead of piecing it together from multiple spreadsheets.',
    solution: 'Built a consolidated dashboard that pulls sales and payment records into one interactive view, with KPI cards, filters and charts that update as data changes.',
    features: ['KPI cards for revenue, payments and targets', 'Sales owner performance comparison', 'Payment tracking by status', 'Revenue analysis by period', 'Interactive charts with filters'],
    results: 'Gave the team a faster, more reliable way to check sales performance without manually compiling reports each week.',
    demo: true
  },
  {
    id: 'lead-management-dashboard',
    index: '02',
    title: 'Lead Management Dashboard',
    description: 'A dashboard designed to track lead assignments, lead stages, follow-up activities and overdue tasks.',
    tools: ['HTML', 'CSS', 'JavaScript', 'Google Sheets', 'Chart.js'],
    problem: 'Leads were spread across owners and stages with no easy way to spot overdue follow-ups or stalled leads.',
    solution: 'Created a lead tracking dashboard that groups leads by owner and stage, flags overdue follow-ups, and lets users filter by country, course and source.',
    features: ['Lead owner tracking', 'Lead stage analysis', 'Follow-up monitoring', 'Overdue task tracking', 'Country / course / source filters', 'Monthly analysis view'],
    results: 'Made it easier for the team to prioritize follow-ups and reduce leads slipping through the cracks.',
    demo: true
  },
  {
    id: 'weekly-sales-incentive-dashboard',
    index: '03',
    title: 'Weekly Sales Incentive Dashboard',
    description: 'A dashboard designed to calculate weekly sales incentives based on payment performance.',
    tools: ['Excel', 'JavaScript', 'Chart.js', 'HTML', 'CSS'],
    problem: 'Weekly incentive eligibility had to be calculated manually based on payment counts, which was time-consuming and error-prone.',
    solution: 'Built a rules-based dashboard where a sales owner becomes eligible for the weekly incentive once they complete 10 eligible payments during the week, with automatic ranking and eligibility status.',
    features: ['Sales owner name and profile photo', 'Weekly payment count', 'Eligibility status (10-payment rule)', 'Incentive status', 'Weekly ranking', 'Payment summary with date/week filters'],
    results: 'Simplified weekly incentive calculation and made eligibility transparent to the sales team.',
    demo: true,
    demoDataNote: 'Sample data only — created for demonstration purposes.'
  },
  {
    id: 'lead-audit-data-quality-dashboard',
    index: '04',
    title: 'Lead Audit & Data Quality Dashboard',
    description: 'A dashboard for monitoring lead follow-ups, overdue activities, task completion and data quality.',
    tools: ['Excel', 'Google Sheets', 'JavaScript', 'Chart.js'],
    problem: 'Data quality issues — missing tasks, overdue follow-ups and incomplete records — were hard to spot at scale.',
    solution: 'Designed an audit dashboard that summarizes total leads, completed and overdue follow-ups, leads with no task, and pending actions, with a sales owner comparison view.',
    features: ['Total leads overview', 'Completed vs. overdue follow-ups', 'No-task lead detection', 'Pending action tracking', 'Sales owner comparison', 'Audit summary view'],
    results: 'Helped catch data quality gaps early and kept CRM records more reliable for reporting.',
    demo: true
  },
  {
    id: 'payment-revenue-analysis',
    index: '05',
    title: 'Payment & Revenue Analysis',
    description: 'A project showing payment and revenue analysis across owners, countries and time periods.',
    tools: ['Excel', 'JavaScript', 'Chart.js', 'HTML', 'CSS'],
    problem: 'Revenue and payment trends were reviewed manually each month with no consistent visual breakdown.',
    solution: 'Built a payment and revenue analysis view with charts covering totals, breakdowns by sales owner and country, monthly trends and payment patterns.',
    features: ['Total payments and total revenue', 'Revenue by sales owner', 'Revenue by country', 'Monthly revenue trend', 'Payment trend analysis'],
    results: 'Made monthly revenue review faster and easier to present to stakeholders.',
    demo: true
  }
];

function initProjects() {
  const grid = document.getElementById('projectsGrid');
  if (!grid) return;

  grid.innerHTML = PROJECTS.map((p, i) => `
    <article class="project-card glass-card reveal" style="--reveal-delay:${(i % 2) * 0.08}s" data-project-id="${p.id}" tabindex="0" role="button" aria-haspopup="dialog" aria-label="View details for ${p.title}">
      <div class="project-card__top">
        <span class="project-card__index">${p.index}</span>
        <h3 class="project-card__title">${p.title}</h3>
        <p class="project-card__desc">${p.description}</p>
      </div>
      <div class="project-card__tags">
        ${p.tools.map(t => `<span>${t}</span>`).join('')}
      </div>
      <div class="project-card__footer">
        <span>View Details <i class="fa-solid fa-arrow-right"></i></span>
        <span class="project-card__demo-badge">${p.demo ? 'Demo Data' : ''}</span>
      </div>
    </article>
  `).join('');

  // Re-run reveal observer for newly injected cards
  initRevealAnimations();

  grid.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('click', () => openProjectModal(card.dataset.projectId));
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openProjectModal(card.dataset.projectId);
      }
    });
  });

  initModal();
}

function initModal() {
  const modal = document.getElementById('projectModal');
  const overlay = document.getElementById('modalOverlay');
  const closeBtn = document.getElementById('modalClose');

  const close = () => {
    modal.setAttribute('hidden', '');
    document.body.style.overflow = '';
  };

  overlay.addEventListener('click', close);
  closeBtn.addEventListener('click', close);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !modal.hasAttribute('hidden')) close();
  });

  window._closeProjectModal = close;
}

function openProjectModal(projectId) {
  const project = PROJECTS.find(p => p.id === projectId);
  if (!project) return;

  const modal = document.getElementById('projectModal');
  const body = document.getElementById('modalBody');

  body.innerHTML = `
    ${project.demo ? `<p class="demo-note"><i class="fa-solid fa-circle-info"></i> ${project.demoDataNote || 'Built with realistic demo data for portfolio presentation.'}</p>` : ''}
    <span class="modal-content__index">PROJECT ${project.index}</span>
    <h3 class="modal-content__title" id="modalTitle">${project.title}</h3>

    <div class="modal-content__section">
      <h4>Business Problem</h4>
      <p>${project.problem}</p>
    </div>
    <div class="modal-content__section">
      <h4>Solution</h4>
      <p>${project.solution}</p>
    </div>
    <div class="modal-content__section">
      <h4>Tools Used</h4>
      <div class="modal-content__tags">${project.tools.map(t => `<span>${t}</span>`).join('')}</div>
    </div>
    <div class="modal-content__section">
      <h4>Key Features</h4>
      <ul>${project.features.map(f => `<li>${f}</li>`).join('')}</ul>
    </div>
    <div class="modal-content__section">
      <h4>Results</h4>
      <p>${project.results}</p>
    </div>
    <div class="modal-content__section">
      <h4>Screenshots</h4>
      <div class="modal-content__shot"><i class="fa-solid fa-image"></i>&nbsp; Screenshot placeholder — add project screenshots to assets/project-images/</div>
    </div>

    <div class="modal-content__actions">
      <a href="https://github.com/deenuprakash" target="_blank" rel="noopener noreferrer" class="btn btn--ghost btn--sm">
        <i class="fa-brands fa-github"></i> GitHub
      </a>
      <a href="#" class="btn btn--primary btn--sm" onclick="return false;">
        <i class="fa-solid fa-arrow-up-right-from-square"></i> Live Demo
      </a>
    </div>
  `;

  modal.removeAttribute('hidden');
  document.body.style.overflow = 'hidden';
  document.getElementById('modalClose').focus();
}

/* --------------------------------------------------------------------------
   5. CHART.JS DASHBOARDS (demo data)
   -------------------------------------------------------------------------- */
function initCharts() {
  if (typeof Chart === 'undefined') return;

  Chart.defaults.color = '#9aa3c2';
  Chart.defaults.font.family = "'Inter', sans-serif";
  Chart.defaults.borderColor = 'rgba(148,163,209,0.12)';

  const gridOpts = { grid: { color: 'rgba(148,163,209,0.08)' }, ticks: { color: '#9aa3c2' } };

  // 1. Monthly Revenue (line)
  const revEl = document.getElementById('chartRevenue');
  if (revEl) {
    new Chart(revEl, {
      type: 'line',
      data: {
        labels: ['Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
        datasets: [{
          label: 'Revenue (₹L)',
          data: [8.2, 9.1, 8.7, 10.4, 11.6, 12.3],
          borderColor: '#4f7cff',
          backgroundColor: 'rgba(79,124,255,0.15)',
          tension: 0.4,
          fill: true,
          pointBackgroundColor: '#4f7cff',
          pointRadius: 4
        }]
      },
      options: chartBaseOptions(gridOpts)
    });
  }

  // 2. Sales Owner Performance (bar)
  const ownersEl = document.getElementById('chartOwners');
  if (ownersEl) {
    new Chart(ownersEl, {
      type: 'bar',
      data: {
        labels: ['Owner A', 'Owner B', 'Owner C', 'Owner D', 'Owner E'],
        datasets: [{
          label: 'Deals Closed',
          data: [24, 19, 27, 15, 22],
          backgroundColor: ['#4f7cff', '#a78bfa', '#38d9c9', '#4f7cff', '#a78bfa'],
          borderRadius: 8,
          maxBarThickness: 40
        }]
      },
      options: chartBaseOptions(gridOpts)
    });
  }

  // 3. Lead Funnel (bar, horizontal-style via indexAxis)
  const funnelEl = document.getElementById('chartFunnel');
  if (funnelEl) {
    new Chart(funnelEl, {
      type: 'bar',
      data: {
        labels: ['New Leads', 'Contacted', 'Qualified', 'Proposal', 'Won'],
        datasets: [{
          label: 'Leads',
          data: [520, 360, 210, 120, 68],
          backgroundColor: 'rgba(56,217,201,0.75)',
          borderRadius: 8
        }]
      },
      options: { ...chartBaseOptions(gridOpts), indexAxis: 'y' }
    });
  }

  // 4. Payment Trend (line, dual tone)
  const paymentsEl = document.getElementById('chartPayments');
  if (paymentsEl) {
    new Chart(paymentsEl, {
      type: 'line',
      data: {
        labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
        datasets: [{
          label: 'Payments Received',
          data: [32, 41, 38, 47],
          borderColor: '#a78bfa',
          backgroundColor: 'rgba(167,139,250,0.15)',
          tension: 0.4,
          fill: true,
          pointBackgroundColor: '#a78bfa',
          pointRadius: 4
        }]
      },
      options: chartBaseOptions(gridOpts)
    });
  }
}

function chartBaseOptions(gridOpts) {
  return {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#121b34',
        borderColor: 'rgba(148,163,209,0.2)',
        borderWidth: 1,
        padding: 10,
        titleFont: { family: "'JetBrains Mono', monospace", size: 11 },
        bodyFont: { family: "'Inter', sans-serif", size: 12 }
      }
    },
    scales: {
      x: gridOpts,
      y: gridOpts
    },
    animation: { duration: 900, easing: 'easeOutCubic' }
  };
}

/* --------------------------------------------------------------------------
   6. CONTACT FORM — client-side validation + mailto fallback
   -------------------------------------------------------------------------- */
function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  const fields = {
    name: { el: document.getElementById('cf-name'), err: document.getElementById('err-name') },
    email: { el: document.getElementById('cf-email'), err: document.getElementById('err-email') },
    subject: { el: document.getElementById('cf-subject'), err: document.getElementById('err-subject') },
    message: { el: document.getElementById('cf-message'), err: document.getElementById('err-message') }
  };

  const validators = {
    name: (v) => v.trim().length >= 2 || 'Please enter your name.',
    email: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) || 'Please enter a valid email address.',
    subject: (v) => v.trim().length >= 3 || 'Please add a short subject.',
    message: (v) => v.trim().length >= 10 || 'Message should be at least 10 characters.'
  };

  const validateField = (key) => {
    const { el, err } = fields[key];
    const result = validators[key](el.value);
    const row = el.closest('.form-row');
    if (result === true) {
      row.classList.remove('has-error');
      err.textContent = '';
      return true;
    }
    row.classList.add('has-error');
    err.textContent = result;
    return false;
  };

  Object.keys(fields).forEach(key => {
    fields[key].el.addEventListener('blur', () => validateField(key));
    fields[key].el.addEventListener('input', () => {
      if (fields[key].el.closest('.form-row').classList.contains('has-error')) {
        validateField(key);
      }
    });
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const allValid = Object.keys(fields).map(validateField).every(Boolean);
    const note = document.getElementById('formNote');

    if (!allValid) {
      note.textContent = 'Please fix the highlighted fields before sending.';
      note.style.color = '#f87171';
      return;
    }

    const name = fields.name.el.value.trim();
    const email = fields.email.el.value.trim();
    const subject = fields.subject.el.value.trim();
    const message = fields.message.el.value.trim();

    const mailBody = `Name: ${name}\nEmail: ${email}\n\n${message}`;
    const mailtoLink = `mailto:deenu.prakash@example.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(mailBody)}`;

    window.location.href = mailtoLink;

    note.textContent = 'Opening your email app with this message pre-filled...';
    note.style.color = '#34d399';
    form.reset();
  });
}

/* --------------------------------------------------------------------------
   7. BACK TO TOP BUTTON
   -------------------------------------------------------------------------- */
function initBackToTop() {
  const btn = document.getElementById('backToTop');
  if (!btn) return;
  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}
