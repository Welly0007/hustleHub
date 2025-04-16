// fetching the data form the json object
async function getJobs() {
    const response = await fetch('../scripts/jobs.json');
    const data = await response.json();
    return data; // This is your array of job objects
}

async function initPage() {
    const initialJobsArray = await getJobs();  // Waits here until fetch is done
    displayJobs(initialJobsArray);             // You can now safely use jobsArray
    setupFilters(initialJobsArray);            // Another example of dependent function
}

function displayJobs(jobs) {
    const jobCardsContainer = document.getElementById("job-cards");
    jobCardsContainer.textContent = ' ';
    const JobCard = document.getElementById("job-card"); 
    console.log("displayJobs called");

    jobs.forEach(element => {
        const tempCard = JobCard.content.cloneNode(true);

        // Add the values for the job card content
        const tempCardContent = tempCard.querySelector(".job-card-content");

        tempCardContent.querySelector(".jobTitle").textContent = element.title;
        tempCardContent.querySelector(".jobCompany").append(element.company);
        tempCardContent.querySelector(".jobPostTime").append(element.posted);
        tempCardContent.querySelector(".jobSalary").append(element.salary);
        tempCardContent.querySelector(".jobStatus").append(element.status);
        tempCardContent.querySelector(".jobExperience").append(element.experience);
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
    console.log("selects NodeList:", selects);
    console.log("Setup filters was called");
    console.log(selects);

    checkboxes.forEach(cb => cb.addEventListener('change', () => {applyFilters(jobsArray, checkboxes, selects)}));
    selects.forEach(select => select.addEventListener('change', () => {
        console.log("Attached event listener to checkboxes and selects");
        applyFilters(jobsArray, checkboxes, selects)
    }));
    

}

function applyFilters(jobsArray, checkboxes, selects) {
    let filtered = [...jobsArray];

    // Get selected checkboxes
    const selectedCheckboxes = Array.from(checkboxes)
        .filter(cb => cb.checked)
        .map(cb => cb.parentElement.textContent.trim());

    const selectedSelects = Array.from(selects).filter((select) => {
        return select.value != "none";
    }).map(select => select.value);

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

        return checkboxMatch && selectMatch;
    });

    // Calculating the number of filters applied
    let num = selectedCheckboxes.length + selectedSelects.length;
    console.log("selected checkboxes", selectedCheckboxes);
    console.log("selects", selectedSelects);

    displayJobs(filtered);
    let filtersCount = document.getElementById("numberOfSelectedFilters");
    filtersCount.textContent = ' ';
    filtersCount.textContent = num + " filters selected";
}

document.addEventListener("DOMContentLoaded", () => {
    initPage();
});