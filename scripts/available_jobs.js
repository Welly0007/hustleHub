// fetching the data form the json object
async function getJobs() {
    const response = await fetch('../scripts/jobs.json');
    const data = await response.json();
    return data; // This is your array of job objects
}

async function initPage() {
    const initialJobsArray = await getJobs();
    displayJobs(initialJobsArray);
    setupFilters(initialJobsArray);
}

function displayJobs(jobs) {
    const jobCardsContainer = document.getElementById("job-cards");
    jobCardsContainer.textContent = ' ';
    const JobCard = document.getElementById("job-card"); 
    // console.log("displayJobs called");

    jobs.forEach(element => {
        const tempCard = JobCard.content.cloneNode(true);

        // Add the values for the job card content
        const tempCardContent = tempCard.querySelector(".job-card-content");

        tempCardContent.querySelector(".jobTitle").textContent = element.title;
        tempCardContent.querySelector(".jobCompany").append(element.company);
        tempCardContent.querySelector(".jobPostTime").append(element.posted);
        tempCardContent.querySelector(".jobSalary").append(element.salary);
        tempCardContent.querySelector(".jobStatus").append(element.status);
        tempCardContent.querySelector(".jobExperience").append(element.experience + "+ years");
        tempCardContent.querySelector(".jobCreator").append(element.created_by);


        // Job meta data
        tempCardContent.querySelector(".job-meta .jobType").textContent = element.job_type;
        tempCardContent.querySelector(".job-meta .jobPlace").textContent = element.workplace;
        
        // Job Tags
        const jobTags = tempCardContent.querySelector(".job-tags");
        element.tags.forEach(tag => {
            const span = document.createElement("span");
            span.textContent = tag;
            jobTags.appendChild(span);
        });

        tempCardContent.querySelector(".btn-details").setAttribute("href", element.details_link);

        // Company Logo
        tempCard.querySelector(".Company-logo").setAttribute("src", element.logo);
    
        jobCardsContainer.appendChild(tempCard);

    });
}

// Applying event listeners to all filters
function setupFilters(jobsArray) {
    const checkboxes = document.querySelectorAll('.filter-options input[type="checkbox"]');
    const selects = document.querySelectorAll('.filter-options select');
    // console.log("selects NodeList:", selects);
    // console.log("Setup filters was called");
    // console.log(selects);

    checkboxes.forEach(cb => cb.addEventListener('change', () => {
        applyFilters(jobsArray, checkboxes, selects);
    }));

    selects.forEach((select, idx) => {
        // console.log(`Attaching listener to select #${idx}`, select);
        select.addEventListener('change', () => {
            applyFilters(jobsArray, checkboxes, selects);
        });
    });
    
    // console.log("Finished setting up filters");   

}

function applyFilters(jobsArray, checkboxes, selects) {
    let filtered = [...jobsArray];

    const selectedCheckboxes = Array.from(checkboxes)
    .filter(checkbox => checkbox.checked && checkbox.value !== "none")
    .map(checkbox => checkbox.value);
  

    const selectedSelects = Array.from(selects).filter((select) => {
        // console.log(select.value);
        return select.value != "none";
    }).map(select => select.value);

    const minExpSelect = document.getElementById("min-experience");
    const maxExpSelect = document.getElementById("max-experience");

    const minExp = minExpSelect.value !== "none" ? parseInt(minExpSelect.value) : null;
    const maxExp = maxExpSelect.value !== "none" ? parseInt(maxExpSelect.value) : null;
    const selectedCountry = document.getElementById("countryValues").value;
    // console.log("This is the min value", minExp);

    filtered = filtered.filter(job => {
        // Filter by workplace, job type, etc.
        let checkboxMatch = true;
        let selectMatch = true;

        // Filter based on checkbox tags (e.g., Entry Level, Full Time)
        if (selectedCheckboxes.length > 0) {
            checkboxMatch = selectedCheckboxes.some(filter =>
                job.tags.includes(filter) ||
                job.job_type === filter ||
                job.workplace === filter
            );
        }
        

        let countryMatch = (selectedCountry ==="none" ? true: (job.country.map(c => c.toLowerCase()).includes(selectedCountry.toLowerCase())));
        let minMatch = (minExp === null || parseInt(job.experience) >= minExp);
        let maxMatch = (maxExp === null || parseInt(job.experience) <= maxExp);
        // console.log("The job experience", parseInt(job.experience), " The minMatch ", minMatch);

        return checkboxMatch && countryMatch && minMatch && maxMatch;
    });

    // Calculating the number of filters applied
    let num = selectedCheckboxes.length + selectedSelects.length;
    // console.log("selected checkboxes", selectedCheckboxes);
    // console.log("selects", selectedSelects);

    displayJobs(filtered);
    let filtersCount = document.getElementById("numberOfSelectedFilters");
    filtersCount.textContent = ' ';
    filtersCount.textContent = num + " filters selected";
}

document.addEventListener("DOMContentLoaded", () => {
    initPage();
});