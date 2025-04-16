// fetching the data form the json object
async function getJobs() {
    const response = await fetch('../scripts/jobs.json');
    const data = await response.json();
    return data; // This is your array of job objects
}

async function initPage() {
    const initialJobsArray = await getJobs();  // Waits here until fetch is done
    displayJobs(initialJobsArray);             // You can now safely use jobsArray
    // setupFilters(initialJobsArray);            // Another example of dependent function
}

function displayJobs(jobs) {
    const jobCardsContainer = document.getElementById("job-cards");
    const JobCard = document.getElementById("job-card"); 

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

        // Link to job details
        tempCardContent.querySelector(".btn-details").setAttribute("href", element.details_link);

        // Company Logo
        tempCard.querySelector(".Company-logo").setAttribute("src", element.logo);
    
        jobCardsContainer.appendChild(tempCard);

    });
}

document.addEventListener("DOMContentLoaded", initPage);

function setupFilters(jobsArray)
{
    
}