function getPreloadedJobs() {
    const raw = document.getElementById("preload")?.textContent || "[]";
    return JSON.parse(raw);
}

async function initPage() {

    const serverJobs = getPreloadedJobs();

    displayJobs(serverJobs);
    displayFilters(serverJobs);
    clearAllFilters(serverJobs);
    setupFilters(serverJobs);
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

