function getPreloadedJobs() {
    const raw = document.getElementById("preload")?.textContent || "[]";
    return JSON.parse(raw);
}

function sortById(arr) {
  return Array.isArray(arr) ? arr.slice().sort((a, b) => a.id - b.id) : [];
}

function isJobsUpToDate(serverJobs, localJobs) {
  return JSON.stringify(sortById(serverJobs)) === JSON.stringify(sortById(localJobs))
}

function setJobsInLocalStorage(jobs) {
  localStorage.setItem("jobs", JSON.stringify(jobs));
  localStorage.setItem("jobsTimeStamp", Date.now().toString());
}

function isJobsWithinLimits(maxTimeInHours = 1) {
  if (!localStorage.getItem("jobs")) return false;

    const rawTimestamp = localStorage.getItem("jobsTimeStamp");
    const ageInMs = Date.now() - parseInt(rawTimestamp, 10);
    maxTimeInHours = maxTimeInHours * 60 * 60 * 1000;

    if (ageInMs > maxTimeInHours) {
        localStorage.removeItem("jobs");
        localStorage.removeItem("jobsTimeStamp");
        return false;
    }

    return true;
}


async function initPage() {

    const localJobs = JSON.parse(localStorage.getItem("jobs") || "[]");
    const serverJobs = getPreloadedJobs();

    if (!isJobsWithinLimits() || !isJobsUpToDate(serverJobs, localJobs)) {
        setJobsInLocalStorage(serverJobs);
        localJobs = serverJobs;
    }

    displayJobs(localJobs);
    displayFilters(localJobs);
    clearAllFilters(localJobs);
    setupFilters(localJobs);
}

/* 2 – deep-compare server vs. cache */
function isJobsUpToDate(serverJobs, localJobs) {
  return (
    JSON.stringify(sortById(serverJobs)) ===
    JSON.stringify(sortById(localJobs))
  );
}

/* 3 – write to localStorage */
function setJobsInLocalStorage(jobs) {
  localStorage.setItem("jobs", JSON.stringify(jobs));
  localStorage.setItem("jobsTimeStamp", Date.now().toString());
}

/* 4 – TTL guard (default 1 h, change if you like) */
function isJobsWithinLimits(maxHours = 1) {
  const ts = Number(localStorage.getItem("jobsTimeStamp"));
  if (!ts) return false;
  const ageMs = Date.now() - ts;
  return ageMs <= maxHours * 60 * 60 * 1000;
}

/* ---------- data sources ---------- */

/* A) jobs *baked* into the Django template                             
   <script id="preload" type="application/json">{{ jobs_json|safe }}</script> */
function getPreloadedJobs() {
  try {
    const raw = document.getElementById("preload")?.textContent || "[]";
    return JSON.parse(raw);
  } catch {
    console.error("Malformed embedded jobs JSON");
    return [];
  }
}

/* B) (optional) fallback fetch — keep if you still have jobs.json on the server */
async function fetchJobsJson() {
  const res = await fetch("../scripts/jobs.json");
  return await res.json();
}

/* ---------- main ---------- */

async function initPage() {
  /* 1. what’s in localStorage right now */
  let localJobs = [];
  try {
    localJobs = JSON.parse(localStorage.getItem("jobs") || "[]");
  } catch {}

  /* 2. what the server just baked into the HTML */
  const serverJobs = getPreloadedJobs();

  /* 3. decide whether to refresh the cache */
  const freshEnough = isJobsWithinLimits();
  if (!freshEnough || !isJobsUpToDate(serverJobs, localJobs)) {
    // If the preload block is empty (edge case) fall back to fetch
    const finalJobs = serverJobs.length ? serverJobs : await fetchJobsJson();
    setJobsInLocalStorage(finalJobs);
    localJobs = finalJobs;
  }

  /* 4. finally render everything */
  displayJobs(localJobs);
  displayFilters(localJobs);
  clearAllFilters(localJobs);
  setupFilters(localJobs);
}


// Applying event listeners to all filters
function setupFilters(jobsArray) {
    const checkboxes = document.querySelectorAll('.filter-options input[type="checkbox"]');
    const selects = document.querySelectorAll('.filter-options select');

    checkboxes.forEach(cb => cb.addEventListener('change', () => {
        console.log("cb changed, calling applyFilters");
        applyFilters(jobsArray, checkboxes, selects);
    }));

    selects.forEach((select, idx) => {
        select.addEventListener('change', () => {
            applyFilters(jobsArray, checkboxes, selects);
        });
    });
    
}

function applyFilters(jobsArray, checkboxes, selects) {
    let filtered = [...jobsArray];

    const checkboxGroups = {};

    checkboxes.forEach(cb => {
        // console.log(cb);
        // console.log(cb.closest('.filter-group'));
        const groupId = cb.closest('.filter-group').id;
        if (cb.checked && cb.value != "none") {
            if (!checkboxGroups[groupId])
            {
                checkboxGroups[groupId] = [];
            }
            if (cb.checked) {
                checkboxGroups[groupId].push(cb.value);
            }
        }
        
    });
    // console.log("here are the groups", checkboxGroups);
  

    const selectedSelects = Array.from(selects).filter((select) => {
        return select.value != "none";
    }).map(select => select.value);

    const minExpSelect = document.getElementById("min-experience");
    const maxExpSelect = document.getElementById("max-experience");

    const minExp = minExpSelect.value !== "none" ? parseInt(minExpSelect.value) : null;
    const maxExp = maxExpSelect.value !== "none" ? parseInt(maxExpSelect.value) : null;
    const selectedCountry = document.getElementById("countryValues").value;


    filtered = filtered.filter(job => {
        const workplaceMatch = !checkboxGroups["workplace"] || checkboxGroups["workplace"].includes(job.workplace);
        const jobTypeMatch = !checkboxGroups["job-type"] || checkboxGroups["job-type"].includes(job.job_type);
        const careerLevelMatch = !checkboxGroups["career-level"] || checkboxGroups["career-level"].includes(job.career_level);
        const jobCategoryMatch = !checkboxGroups["job-category"] || checkboxGroups["job-category"].includes(job.category);
    
        let countryMatch = (selectedCountry ==="none" ? true : (job.country.map(c => c.toLowerCase()).includes(selectedCountry.toLowerCase())));
        let expRangeMatch = (minExp === null || parseInt(job.experience) >= minExp) && (maxExp === null || parseInt(job.experience) <= maxExp);
    
        return workplaceMatch && jobTypeMatch && careerLevelMatch && countryMatch && expRangeMatch && jobCategoryMatch;
    });
    

    // Calculating the number of filters applied
    let num = Object.keys(checkboxGroups).length + selectedSelects.length;

    displayJobs(filtered);
    let filtersCount = document.getElementById("numberOfSelectedFilters");
    filtersCount.textContent = ' ';
    filtersCount.textContent = num + " filters selected";
}

document.addEventListener("DOMContentLoaded", () => {
    initPage();
});

