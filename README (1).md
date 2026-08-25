# Deenu Prakash — Data Analyst / Business Analyst Portfolio

A premium, dark, analytics-dashboard-inspired portfolio website built with plain **HTML5, CSS3 and JavaScript (ES6+)** — no frameworks, no build step. Just open `index.html`.

## 📁 Project Structure

```
portfolio/
│
├── index.html              # All page content and structure
├── style.css                # Design system + all styling
├── script.js                 # Interactivity, charts, animations
├── assets/
│   ├── resume.pdf            # ⚠️ Placeholder — replace with your real resume
│   └── project-images/       # ⚠️ Empty — add real project screenshots here
└── README.md                  # This file
```

There is no `assets/profile.jpg` file included. The hero section is coded to
try loading `assets/profile.jpg`, and automatically falls back to a clean
"DP" monogram avatar if the file is missing — so the site looks polished
either way. **Once you add a real photo, drop it in at `assets/profile.jpg`
and it will appear automatically — no code changes needed.**

## ✏️ What You Should Personalize Before Publishing

| Item | Where | What to do |
|---|---|---|
| Profile photo | `assets/profile.jpg` | Add a professional headshot (square image, at least 400×400px) |
| Resume | `assets/resume.pdf` | Replace the placeholder PDF with your real resume, keeping the filename `resume.pdf` |
| LinkedIn / GitHub / Email | `index.html` (search for `deenu-prakash`, `deenuprakash`, `deenu.prakash@example.com`) | Replace with your real links and email address |
| Certifications | `index.html` → Certifications section | Replace placeholder org/year/link text with your real certificates |
| Project screenshots | `assets/project-images/` | Add real dashboard screenshots; see the `README.txt` inside that folder |
| Live demo / GitHub links per project | `script.js` → `PROJECTS` array and the modal's action buttons | Point to your actual repos/demos if you publish the dashboards separately |

Everything else (experience, skills, stats, project descriptions) reflects
the information you provided and does not need to change unless your
details change.

## 🧩 Features Implemented

- Sticky, glassmorphism navigation bar with mobile hamburger menu
- Scroll-spy active navigation state
- Animated hero section with a live-styled "analytics" visual (not a stock photo)
- Animated KPI counters (2+ years, 10K+ records, 3+ team members, multiple dashboards)
- About, Skills, Experience (timeline), Projects, Analytics Showcase, Certifications, Education, Resume CTA and Contact sections
- 5 project cards, each opening a detail modal (problem, solution, tools, features, results)
- 4 live Chart.js dashboards with clearly labeled demo data
- Contact form with client-side validation and a `mailto:` fallback (no backend/server involved)
- Back-to-top button, scroll reveal animations, and `prefers-reduced-motion` support
- Fully responsive from 1920px down to 360px, with no horizontal scrolling
- Semantic HTML, alt text, visible focus states, and a skip-to-content link for accessibility

## 🚀 Deploying to GitHub Pages (Beginner-Friendly)

### 1. Create a GitHub repository
1. Go to [github.com](https://github.com) and log in.
2. Click the **+** icon (top right) → **New repository**.
3. Name it something like `portfolio` or `deenu-prakash-portfolio`.
4. Keep it **Public** (required for free GitHub Pages).
5. Click **Create repository**.

### 2. Upload your files
**Option A — using the GitHub website (easiest):**
1. On your new repository page, click **Add file → Upload files**.
2. Drag in `index.html`, `style.css`, `script.js`, `README.md`, and the whole `assets` folder.
3. Scroll down and click **Commit changes**.

**Option B — using Git from your computer:**
```bash
git init
git add .
git commit -m "Initial portfolio commit"
git branch -M main
git remote add origin https://github.com/<your-username>/<your-repo-name>.git
git push -u origin main
```

### 3. Enable GitHub Pages
1. In your repository, go to **Settings**.
2. In the left sidebar, click **Pages**.
3. Under **Build and deployment → Source**, select **Deploy from a branch**.

### 4. Select the main branch
1. Under **Branch**, choose **main** and folder **/(root)**.
2. Click **Save**.

### 5. Open your live portfolio URL
1. Wait 1–2 minutes for GitHub to build the site.
2. Refresh the **Pages** settings page — you'll see a message like:
   > Your site is live at `https://<your-username>.github.io/<your-repo-name>/`
3. Open that link — your portfolio is now live and shareable with recruiters.

Any time you push new changes to the `main` branch, GitHub Pages will
automatically redeploy your site within a minute or two.

---

Built with HTML, CSS & JavaScript.
