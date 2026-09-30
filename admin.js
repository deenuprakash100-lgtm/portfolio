let supabaseClient = null;

let siteContent = null;

let projects = [];

let editingProjectId = null;


/* =========================================================
   HELPERS
   ========================================================= */

const $ = id => document.getElementById(id);


function configured() {

  const config = window.SUPABASE_CONFIG;

  return Boolean(
    config &&
    config.url &&
    config.key &&
    !config.url.includes("YOUR-PROJECT-REF") &&
    !config.key.includes("YOUR-SUPABASE-PUBLISHABLE-KEY")
  );
}


function showMessage(message, type = "success") {

  const adminMessage = $("adminMessage");
  const loginMessage = $("loginMessage");

  const box =
    $("loginPage").classList.contains("hidden")
      ? adminMessage
      : loginMessage;

  if (!box) return;

  box.textContent = message;

  box.className =
    `message ${type}`;

  box.classList.remove("hidden");
}


function escapeHtml(value) {

  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}


function parseJSON(id, fallback = []) {

  const value = $(id).value.trim();

  if (!value) {
    return fallback;
  }

  try {

    return JSON.parse(value);

  } catch (error) {

    showMessage(
      `Invalid JSON in ${id}.`,
      "error"
    );

    throw error;
  }
}


/* =========================================================
   SUPABASE
   ========================================================= */

function initSupabase() {

  if (!configured()) {

    showMessage(
      "Open supabase-config.js and add your Supabase URL and publishable key.",
      "error"
    );

    return false;
  }

  if (!window.supabase) {

    showMessage(
      "Supabase library failed to load.",
      "error"
    );

    return false;
  }

  supabaseClient =
    window.supabase.createClient(
      window.SUPABASE_CONFIG.url,
      window.SUPABASE_CONFIG.key,
      {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true
        }
      }
    );

  return true;
}


/* =========================================================
   LOGIN
   ========================================================= */

async function checkLogin() {

  const {
    data: { user },
    error
  } = await supabaseClient.auth.getUser();

  if (error) {

    console.warn(error);

    showLogin();

    return;
  }

  if (user) {

    showAdmin(user);

    await loadContent();

  } else {

    showLogin();
  }
}


function showLogin() {

  $("loginPage")
    .classList
    .remove("hidden");

  $("adminPage")
    .classList
    .add("hidden");
}


function showAdmin(user) {

  $("loginPage")
    .classList
    .add("hidden");

  $("adminPage")
    .classList
    .remove("hidden");

  $("adminEmail")
    .textContent =
    user.email || "";
}


async function login(event) {

  event.preventDefault();

  const email =
    $("loginEmail")
      .value
      .trim();

  const password =
    $("loginPassword")
      .value;

  $("loginButton")
    .disabled = true;

  $("loginButton")
    .textContent = "Signing in...";

  const {
    data,
    error
  } =
    await supabaseClient.auth.signInWithPassword({
      email,
      password
    });

  $("loginButton")
    .disabled = false;

  $("loginButton")
    .textContent = "Sign In";

  if (error) {

    showMessage(
      error.message,
      "error"
    );

    return;
  }

  showAdmin(data.user);

  await loadContent();
}


async function logout() {

  await supabaseClient.auth.signOut();

  showLogin();
}


/* =========================================================
   LOAD CONTENT
   ========================================================= */

async function loadContent() {

  showMessage(
    "Loading portfolio content..."
  );


  const {
    data: siteRow,
    error: siteError
  } =
    await supabaseClient
      .from("portfolio_content")
      .select("content")
      .eq("id", "main")
      .maybeSingle();


  if (siteError) {

    showMessage(
      siteError.message,
      "error"
    );

    return;
  }


  siteContent =
    siteRow?.content || {
      profile: {},
      stats: [],
      about: {},
      skills: [],
      experience: [],
      contact: {},
      social: {}
    };


  fillForms();


  const {
    data: projectRows,
    error: projectError
  } =
    await supabaseClient
      .from("portfolio_projects")
      .select("*")
      .order("sort_order", {
        ascending: true
      });


  if (projectError) {

    showMessage(
      projectError.message,
      "error"
    );

    return;
  }


  projects =
    projectRows || [];


  renderProjects();


  showMessage(
    "Portfolio content loaded.",
    "success"
  );
}


/* =========================================================
   FILL FORMS
   ========================================================= */

function fillForms() {

  const profile =
    siteContent.profile || {};

  $("profileName").value =
    profile.name || "";

  $("profileRole").value =
    profile.role || "";

  $("profileEyebrow").value =
    profile.eyebrow || "";

  $("profileTitle1").value =
    profile.titleLine1 || "";

  $("profileTitle2").value =
    profile.titleLine2 || "";

  $("profileSubtitle").value =
    profile.subtitle || "";

  $("profileDescription").value =
    profile.description || "";

  $("profileImageUrl").value =
    profile.profileImageUrl ||
    "assets/profile.jpg";

  $("resumeUrl").value =
    profile.resumeUrl ||
    "assets/resume.pdf";


  const stats =
    siteContent.stats || [];

  for (
    let i = 0;
    i < 4;
    i++
  ) {

    $("statValue" + i).value =
      stats[i]?.value || "";

    $("statLabel" + i).value =
      stats[i]?.label || "";
  }


  const about =
    siteContent.about || {};

  $("aboutParagraphs").value =
    (about.paragraphs || [])
      .join("\n\n");

  $("aboutBullets").value =
    (about.bullets || [])
      .join("\n");

  $("focusTags").value =
    (about.focusTags || [])
      .join(", ");

  $("educationJson").value =
    JSON.stringify(
      about.education || [],
      null,
      2
    );


  $("skillsJson").value =
    JSON.stringify(
      siteContent.skills || [],
      null,
      2
    );


  $("experienceJson").value =
    JSON.stringify(
      siteContent.experience || [],
      null,
      2
    );


  const contact =
    siteContent.contact || {};

  $("phone").value =
    contact.phone ||
    "8367418575";

  $("whatsapp").value =
    contact.whatsapp ||
    "8074167158";

  $("email").value =
    contact.email ||
    "deenuprakash100@gmail.com";


  const social =
    siteContent.social || {};

  $("linkedin").value =
    social.linkedin || "";

  $("github").value =
    social.github || "";
}


/* =========================================================
   COLLECT SITE CONTENT
   ========================================================= */

function collectSiteContent() {

  const updated =
    structuredClone(
      siteContent || {}
    );


  updated.profile = {

    ...(updated.profile || {}),

    name:
      $("profileName")
        .value
        .trim(),

    role:
      $("profileRole")
        .value
        .trim(),

    eyebrow:
      $("profileEyebrow")
        .value
        .trim(),

    titleLine1:
      $("profileTitle1")
        .value
        .trim(),

    titleLine2:
      $("profileTitle2")
        .value
        .trim(),

    subtitle:
      $("profileSubtitle")
        .value
        .trim(),

    description:
      $("profileDescription")
        .value
        .trim(),

    profileImageUrl:
      $("profileImageUrl")
        .value
        .trim(),

    resumeUrl:
      $("resumeUrl")
        .value
        .trim()
  };


  updated.stats =
    [0, 1, 2, 3]
      .map(i => ({

        value:
          $("statValue" + i)
            .value
            .trim(),

        label:
          $("statLabel" + i)
            .value
            .trim()

      }));


  updated.about = {

    ...(updated.about || {}),

    paragraphs:
      $("aboutParagraphs")
        .value
        .split(/\n\s*\n/)
        .map(x => x.trim())
        .filter(Boolean),

    bullets:
      $("aboutBullets")
        .value
        .split("\n")
        .map(x => x.trim())
        .filter(Boolean),

    education:
      parseJSON(
        "educationJson",
        []
      ),

    focusTags:
      $("focusTags")
        .value
        .split(",")
        .map(x => x.trim())
        .filter(Boolean)
  };


  updated.skills =
    parseJSON(
      "skillsJson",
      []
    );


  updated.experience =
    parseJSON(
      "experienceJson",
      []
    );


  updated.contact = {

    phone:
      $("phone")
        .value
        .trim(),

    whatsapp:
      $("whatsapp")
        .value
        .trim(),

    email:
      $("email")
        .value
        .trim()

  };


  updated.social = {

    linkedin:
      $("linkedin")
        .value
        .trim(),

    github:
      $("github")
        .value
        .trim()

  };


  return updated;
}


/* =========================================================
   SAVE SITE CONTENT
   ========================================================= */

async function saveSiteContent(event) {

  event.preventDefault();

  let content;

  try {

    content =
      collectSiteContent();

  } catch {

    return;
  }


  const {
    error
  } =
    await supabaseClient
      .from("portfolio_content")
      .upsert(
        {
          id: "main",
          content,
          updated_at:
            new Date()
              .toISOString()
        },
        {
          onConflict: "id"
        }
      );


  if (error) {

    showMessage(
      error.message,
      "error"
    );

    return;
  }


  siteContent =
    content;


  showMessage(
    "Portfolio content saved successfully.",
    "success"
  );
}


/* =========================================================
   PROJECT FORM
   ========================================================= */

function clearProjectForm() {

  editingProjectId = null;

  $("projectId").value = "";

  $("projectTitle").value = "";

  $("projectDescription").value = "";

  $("projectTools").value = "";

  $("projectProblem").value = "";

  $("projectSolution").value = "";

  $("projectFeatures").value = "";

  $("projectResults").value = "";

  $("projectImageUrl").value = "";

  $("projectDemoNote").value = "";

  $("projectSortOrder").value =
    projects.length;

  $("projectDemo").checked =
    true;

  $("projectPublished").checked =
    true;

  $("cancelProject")
    .classList
    .add("hidden");
}


function fillProjectForm(project) {

  editingProjectId =
    project.id;

  $("projectId").value =
    project.id;

  $("projectTitle").value =
    project.title || "";

  $("projectDescription").value =
    project.description || "";

  $("projectTools").value =
    (project.tools || [])
      .join(", ");

  $("projectProblem").value =
    project.problem || "";

  $("projectSolution").value =
    project.solution || "";

  $("projectFeatures").value =
    (project.features || [])
      .join("\n");

  $("projectResults").value =
    project.results || "";

  $("projectImageUrl").value =
    project.image_url || "";

  $("projectDemoNote").value =
    project.demo_data_note || "";

  $("projectSortOrder").value =
    project.sort_order || 0;

  $("projectDemo").checked =
    Boolean(project.demo);

  $("projectPublished").checked =
    Boolean(project.published);

  $("cancelProject")
    .classList
    .remove("hidden");
}


/* =========================================================
   SAVE PROJECT
   ========================================================= */

async function saveProject(event) {

  event.preventDefault();


  const payload = {

    title:
      $("projectTitle")
        .value
        .trim(),

    description:
      $("projectDescription")
        .value
        .trim(),

    tools:
      $("projectTools")
        .value
        .split(",")
        .map(x => x.trim())
        .filter(Boolean),

    problem:
      $("projectProblem")
        .value
        .trim(),

    solution:
      $("projectSolution")
        .value
        .trim(),

    features:
      $("projectFeatures")
        .value
        .split("\n")
        .map(x => x.trim())
        .filter(Boolean),

    results:
      $("projectResults")
        .value
        .trim(),

    image_url:
      $("projectImageUrl")
        .value
        .trim(),

    demo_data_note:
      $("projectDemoNote")
        .value
        .trim(),

    sort_order:
      Number(
        $("projectSortOrder")
          .value || 0
      ),

    demo:
      $("projectDemo").checked,

    published:
      $("projectPublished").checked

  };


  let result;


  if (editingProjectId) {

    result =
      await supabaseClient
        .from("portfolio_projects")
        .update(payload)
        .eq(
          "id",
          editingProjectId
        )
        .select()
        .single();

  } else {

    result =
      await supabaseClient
        .from("portfolio_projects")
        .insert(payload)
        .select()
        .single();

  }


  if (result.error) {

    showMessage(
      result.error.message,
      "error"
    );

    return;
  }


  clearProjectForm();

  await loadContent();


  showMessage(
    "Project saved successfully.",
    "success"
  );
}


/* =========================================================
   PROJECT LIST
   ========================================================= */

function renderProjects() {

  const list =
    $("projectList");

  list.innerHTML = "";


  if (!projects.length) {

    list.innerHTML = `
      <div class="card">
        <h3>No projects</h3>
        <p>Add your first project above.</p>
      </div>
    `;

    return;
  }


  projects.forEach(project => {

    const item =
      document.createElement(
        "div"
      );

    item.className =
      "project-item";


    item.innerHTML = `

      <div>

        <h3>
          ${escapeHtml(
            project.title
          )}
        </h3>

        <p>
          ${escapeHtml(
            project.description || ""
          )}
        </p>

      </div>

      <div class="project-actions">

        <button
          class="button"
          data-edit
        >
          Edit
        </button>

        <button
          class="button button-danger"
          data-delete
        >
          Delete
        </button>

      </div>

    `;


    item
      .querySelector("[data-edit]")
      .addEventListener(
        "click",
        () => {

          fillProjectForm(
            project
          );

          switchSection(
            "projects"
          );

          window.scrollTo({
            top: 0,
            behavior: "smooth"
          });

        }
      );


    item
      .querySelector("[data-delete]")
      .addEventListener(
        "click",
        () =>
          deleteProject(
            project.id
          )
      );


    list.appendChild(
      item
    );

  });
}


/* =========================================================
   DELETE PROJECT
   ========================================================= */

async function deleteProject(id) {

  const confirmed =
    window.confirm(
      "Delete this project?"
    );

  if (!confirmed) {
    return;
  }


  const {
    error
  } =
    await supabaseClient
      .from("portfolio_projects")
      .delete()
      .eq("id", id);


  if (error) {

    showMessage(
      error.message,
      "error"
    );

    return;
  }


  clearProjectForm();

  await loadContent();


  showMessage(
    "Project deleted.",
    "success"
  );
}


/* =========================================================
   NAVIGATION
   ========================================================= */

function switchSection(
  sectionName
) {

  document
    .querySelectorAll(
      ".sidebar-button"
    )
    .forEach(button => {

      button.classList.toggle(
        "active",
        button.dataset.section ===
          sectionName
      );

    });


  document
    .querySelectorAll(
      ".admin-section"
    )
    .forEach(section => {

      section.classList.toggle(
        "active",
        section.id ===
          `section-${sectionName}`
      );

    });

}


/* =========================================================
   EVENTS
   ========================================================= */

document.addEventListener(
  "DOMContentLoaded",
  async () => {

    if (!initSupabase()) {
      return;
    }


    $("loginForm")
      .addEventListener(
        "submit",
        login
      );


    $("logoutButton")
      .addEventListener(
        "click",
        logout
      );


    $("reloadButton")
      .addEventListener(
        "click",
        loadContent
      );


    $("profileForm")
      .addEventListener(
        "submit",
        saveSiteContent
      );


    $("aboutForm")
      .addEventListener(
        "submit",
        saveSiteContent
      );


    $("statsForm")
      .addEventListener(
        "submit",
        saveSiteContent
      );


    $("skillsForm")
      .addEventListener(
        "submit",
        saveSiteContent
      );


    $("experienceForm")
      .addEventListener(
        "submit",
        saveSiteContent
      );


    $("contactForm")
      .addEventListener(
        "submit",
        saveSiteContent
      );


    $("projectForm")
      .addEventListener(
        "submit",
        saveProject
      );


    $("cancelProject")
      .addEventListener(
        "click",
        clearProjectForm
      );


    document
      .querySelectorAll(
        ".sidebar-button"
      )
      .forEach(button => {

        button.addEventListener(
          "click",
          () =>
            switchSection(
              button.dataset.section
            )
        );

      });


    await checkLogin();

  }
);
