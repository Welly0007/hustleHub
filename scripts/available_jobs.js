// fetching the data form the json object
async function getJobs() {
    const response = await fetch('../scripts/jobs.json');
    const data = await response.json();
    return data; // This is your array of job objects
}

async function initPage() {
    const initialJobsArray = await getJobs();  // Waits here until fetch is done
    displayJobs(initialJobsArray);             // You can now safely use jobsArray
    setupFilters(initialJobsArray);            // Another example of dependent function
}

function setupFilters(jobsArray)
{
    
}