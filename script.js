/* ============================================================
   SUPABASE PORTFOLIO CMS
   Add this section at the bottom of your existing script.js
   ============================================================ */

let portfolioSupabase = null;


/* ------------------------------------------------------------
   SUPABASE CONNECTION
   ------------------------------------------------------------ */

function getPortfolioSupabase() {

  if (
    !window.supabase ||
    !window.SUPABASE_CONFIG
  ) {
    return null;
  }

  const {
    url,
    key
  } = window.SUPABASE_CONFIG;

  if (
    !url ||
    !key ||
    url.includes("YOUR-PROJECT-REF") ||
    key.includes("YOUR-SUPABASE-PUBLISHABLE-KEY")
  ) {
    console.warn("Supabase configuration is missing.");
    return null;
  }

  if (!portfolioSupabase) {
    portfolioSupabase =
      window.supabase.createClient(
        url,
        key
      );
  }

  return portfolioSupabase;
}


/* ------------------------------------------------------------
   HTML ESCAPE
   ------------------------------------------------------------ */

function escapeCMS(value) {

  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}


/* ------------------------------------------------------------
   LOAD PORTFOLIO CONTENT FROM SUPABASE
   ------------------------------------------------------------ */

async function loadPortfolioCMS() {

  const supabase =
    getPortfolioSupabase();

  if (!supabase) {
    return;
  }

  try {

    /* ------------------------------------------
       SITE CONTENT
       ------------------------------------------ */

    const {
      data: site,
      error: siteError
    } = await supabase
      .from("portfolio_content")
      .select("content")
      .eq("id", "main")
      .maybeSingle();

    if (
      !siteError &&
      site &&
      site.content
    ) {
      applyPortfolioCMS(site.content);
    }


    /* ------------------------------------------
       PROJECTS
       ------------------------------------------ */

    const {
      data: projects,
      error: projectsError
    } = await supabase
      .from("portfolio_projects")
      .select("*")
      .eq("published", true)
      .order("sort_order", {
        ascending: true
      });

    if (
      !projectsError &&
      Array.isArray(projects)
    ) {
      renderCMSProjects(projects);
    }

  } catch (error) {

    console.warn(
      "Portfolio CMS load skipped:",
      error
    );

  }
}


/* ============================================================
   APPLY SITE CONTENT
   ============================================================ */

function applyPortfolioCMS(content) {

  const profile =
    content.profile || {};

  const contact =
    content.contact || {};

  const social =
    content.social || {};


  /* ----------------------------------------------------------
     NAME
     ---------------------------------------------------------- */

  const name =
    document.querySelector(
      ".nav__brand-text"
    );

  if (
    name &&
    profile.name
  ) {
    name.textContent =
      profile.name.toUpperCase();
  }


  /* ----------------------------------------------------------
     HERO GREETING
     ---------------------------------------------------------- */

  const greeting =
    document.querySelector(
      ".hero__greeting"
    );

  if (
    greeting &&
    profile.name
  ) {
    greeting.textContent =
      `Hi, I'm ${profile.name}`;
  }


  /* ----------------------------------------------------------
     HERO TITLE
     ---------------------------------------------------------- */

  const heroTitle =
    document.querySelector(
      ".hero__title"
    );

  if (
    heroTitle &&
    (
      profile.titleLine1 ||
      profile.titleLine2
    )
  ) {

    heroTitle.innerHTML = `
      ${escapeCMS(
        profile.titleLine1 ||
        "Data Analyst"
      )}
      <br>
      &amp;
      <span class="text-gradient">
        ${escapeCMS(
          profile.titleLine2 ||
          "Business Analyst"
        )}
      </span>
    `;
  }


  /* ----------------------------------------------------------
     HERO SUBTITLE
     ---------------------------------------------------------- */

  const subtitle =
    document.querySelector(
      ".hero__subtitle"
    );

  if (
    subtitle &&
    profile.subtitle
  ) {
    subtitle.textContent =
      profile.subtitle;
  }


  /* ----------------------------------------------------------
     HERO DESCRIPTION
     ---------------------------------------------------------- */

  const description =
    document.querySelector(
      ".hero__desc"
    );

  if (
    description &&
    profile.description
  ) {
    description.textContent =
      profile.description;
  }


  /* ----------------------------------------------------------
     PROFILE IMAGE
     ---------------------------------------------------------- */

  const profileImage =
    document.querySelector(
      ".profile-card__img"
    );

  if (
    profileImage &&
    profile.profileImageUrl
  ) {
    profileImage.src =
      profile.profileImageUrl;
  }


  /* ----------------------------------------------------------
     PROFILE ROLE
     ---------------------------------------------------------- */

  const role =
    document.querySelector(
      ".profile-card__role"
    );

  if (
    role &&
    profile.role
  ) {
    role.textContent =
      profile.role;
  }


  /* ----------------------------------------------------------
     RESUME
     ---------------------------------------------------------- */

  if (profile.resumeUrl) {

    document
      .querySelectorAll(
        'a[href*="resume"]'
      )
      .forEach(link => {

        link.href =
          profile.resumeUrl;

      });

  }


  /* ----------------------------------------------------------
     PHONE
     ---------------------------------------------------------- */

  const phone =
    String(
      contact.phone || ""
    ).replace(
      /\D/g,
      ""
    );

  if (phone) {

    document
      .querySelectorAll(
        'a[href^="tel:"]'
      )
      .forEach(link => {

        link.href =
          `tel:+91${phone.replace(
            /^91/,
            ""
          )}`;

      });

  }


  /* ----------------------------------------------------------
     WHATSAPP
     ---------------------------------------------------------- */

  const whatsapp =
    String(
      contact.whatsapp || ""
    ).replace(
      /\D/g,
      ""
    );

  if (whatsapp) {

    document
      .querySelectorAll(
        'a[href*="wa.me"]'
      )
      .forEach(link => {

        link.href =
          `https://wa.me/${whatsapp}`;

      });

  }


  /* ----------------------------------------------------------
     EMAIL
     ---------------------------------------------------------- */

  if (contact.email) {

    document
      .querySelectorAll(
        'a[href^="mailto:"]'
      )
      .forEach(link => {

        link.href =
          `mailto:${contact.email}`;

      });

  }


  /* ----------------------------------------------------------
     LINKEDIN
     ---------------------------------------------------------- */

  if (social.linkedin) {

    document
      .querySelectorAll(
        'a[aria-label*="LinkedIn"]'
      )
      .forEach(link => {

        link.href =
          social.linkedin;

      });

  }


  /* ----------------------------------------------------------
     GITHUB
     ---------------------------------------------------------- */

  if (social.github) {

    document
      .querySelectorAll(
        'a[aria-label*="GitHub"]'
      )
      .forEach(link => {

        link.href =
          social.github;

      });

  }


  /* ----------------------------------------------------------
     STATS
     ---------------------------------------------------------- */

  if (
    Array.isArray(
      content.stats
    )
  ) {

    const cards =
      document.querySelectorAll(
        ".stat-card"
      );

    content.stats
      .slice(
        0,
        cards.length
      )
      .forEach(
        (
          stat,
          index
        ) => {

          const card =
            cards[index];

          if (!card) {
            return;
          }

          const number =
            card.querySelector(
              ".stat-card__number"
            );

          const label =
            card.querySelector(
              ".stat-card__label"
            );


          if (number) {

            number.innerHTML = `
              <span class="counter-text">
                ${escapeCMS(
                  stat.value
                )}
              </span>
            `;

          }


          if (label) {

            label.textContent =
              stat.label || "";

          }

        }
      );

  }


  /* ----------------------------------------------------------
     ABOUT SECTION
     ---------------------------------------------------------- */

  if (content.about) {

    const about =
      content.about;

    const aboutText =
      document.querySelector(
        ".about__text"
      );


    if (
      aboutText &&
      Array.isArray(
        about.paragraphs
      )
    ) {

      let html =
        about.paragraphs
          .map(
            paragraph => `
              <p>
                ${escapeCMS(
                  paragraph
                )}
              </p>
            `
          )
          .join("");


      if (
        Array.isArray(
          about.bullets
        )
      ) {

        html += `
          <ul class="about__list">
            ${
              about.bullets
                .map(
                  bullet => `
                    <li>
                      <i class="fa-solid fa-check"></i>
                      ${escapeCMS(
                        bullet
                      )}
                    </li>
                  `
                )
                .join("")
            }
          </ul>
        `;

      }

      aboutText.innerHTML =
        html;

    }


    /* --------------------------------------------------------
       FOCUS TAGS
       -------------------------------------------------------- */

    if (
      Array.isArray(
        about.focusTags
      )
    ) {

      const focus =
        document.querySelector(
          ".focus-tags"
        );

      if (focus) {

        focus.innerHTML =
          about.focusTags
            .map(
              tag => `
                <span>
                  ${escapeCMS(tag)}
                </span>
              `
            )
            .join("");

      }

    }

  }

}


/* ============================================================
   RENDER CMS PROJECTS
   ============================================================ */

function renderCMSProjects(projects) {

  const grid =
    document.getElementById(
      "projectsGrid"
    );

  if (!grid) {
    return;
  }


  grid.innerHTML =
    projects
      .map(
        (
          project,
          index
        ) => `

          <article
            class="project-card glass-card reveal"
            data-project-id="${escapeCMS(
              project.id
            )}"
            tabindex="0"
            role="button"
            aria-haspopup="dialog"
          >

            <div class="project-card__top">

              <span class="project-card__index">
                ${String(
                  index + 1
                ).padStart(
                  2,
                  "0"
                )}
              </span>

              <h3 class="project-card__title">
                ${escapeCMS(
                  project.title
                )}
              </h3>

              <p class="project-card__desc">
                ${escapeCMS(
                  project.description
                )}
              </p>

            </div>


            <div class="project-card__tags">

              ${
                (project.tools || [])
                  .map(
                    tool => `
                      <span>
                        ${escapeCMS(tool)}
                      </span>
                    `
                  )
                  .join("")
              }

            </div>


            <div class="project-card__footer">

              <span>
                View Details
                <i class="fa-solid fa-arrow-right"></i>
              </span>

              <span
                class="project-card__demo-badge"
              >
                ${
                  project.demo
                    ? "Demo Data"
                    : ""
                }
              </span>

            </div>

          </article>
        `
      )
      .join("");


  /* ----------------------------------------------------------
     REVEAL ANIMATION
     ---------------------------------------------------------- */

  if (
    typeof initRevealAnimations ===
    "function"
  ) {
    initRevealAnimations();
  }


  /* ----------------------------------------------------------
     PROJECT CLICK EVENTS
     ---------------------------------------------------------- */

  grid
    .querySelectorAll(
      ".project-card"
    )
    .forEach(card => {

      const openProject =
        () => {
          openCMSProject(
            card.dataset.projectId
          );
        };


      card.addEventListener(
        "click",
        openProject
      );


      card.addEventListener(
        "keydown",
        event => {

          if (
            event.key === "Enter" ||
            event.key === " "
          ) {

            event.preventDefault();

            openProject();

          }

        }
      );

    });

}


/* ============================================================
   PROJECT DETAILS MODAL
   ============================================================ */

async function openCMSProject(projectId) {

  const supabase =
    getPortfolioSupabase();

  if (!supabase) {
    return;
  }


  const {
    data: project,
    error
  } = await supabase
    .from("portfolio_projects")
    .select("*")
    .eq(
      "id",
      projectId
    )
    .single();


  if (
    error ||
    !project
  ) {

    console.warn(
      "Project load error:",
      error
    );

    return;
  }


  const modal =
    document.getElementById(
      "projectModal"
    );

  const body =
    document.getElementById(
      "modalBody"
    );


  if (
    !modal ||
    !body
  ) {
    return;
  }


  let imageHTML = "";


  if (
    project.image_url
  ) {

    imageHTML = `
      <img
        src="${escapeCMS(
          project.image_url
        )}"
        alt="${escapeCMS(
          project.title
        )}"
        class="modal-content__shot-img"
      >
    `;

  } else {

    imageHTML = `
      <div
        class="modal-content__shot"
      >
        No project image added yet.
      </div>
    `;

  }


  body.innerHTML = `

    <span class="modal-content__index">
      PROJECT
    </span>

    <h3
      class="modal-content__title"
    >
      ${escapeCMS(
        project.title
      )}
    </h3>


    <div
      class="modal-content__section"
    >

      <h4>
        Business Problem
      </h4>

      <p>
        ${escapeCMS(
          project.problem
        )}
      </p>

    </div>


    <div
      class="modal-content__section"
    >

      <h4>
        Solution
      </h4>

      <p>
        ${escapeCMS(
          project.solution
        )}
      </p>

    </div>


    <div
      class="modal-content__section"
    >

      <h4>
        Tools
      </h4>

      <div
        class="modal-content__tags"
      >

        ${
          (project.tools || [])
            .map(
              tool => `
                <span>
                  ${escapeCMS(tool)}
                </span>
              `
            )
            .join("")
        }

      </div>

    </div>


    <div
      class="modal-content__section"
    >

      <h4>
        Features
      </h4>

      <ul>

        ${
          (project.features || [])
            .map(
              feature => `
                <li>
                  ${escapeCMS(
                    feature
                  )}
                </li>
              `
            )
            .join("")
        }

      </ul>

    </div>


    <div
      class="modal-content__section"
    >

      <h4>
        Results
      </h4>

      <p>
        ${escapeCMS(
          project.results
        )}
      </p>

    </div>


    <div
      class="modal-content__section"
    >

      <h4>
        Project Image
      </h4>

      ${imageHTML}

    </div>

  `;


  modal.removeAttribute(
    "hidden"
  );

  document.body.style.overflow =
    "hidden";
}


/* ============================================================
   START CMS AFTER PAGE LOAD
   ============================================================ */

document.addEventListener(
  "DOMContentLoaded",
  () => {

    loadPortfolioCMS();

  }
);
