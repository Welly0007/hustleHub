// Helper Functions
function countBy(jobs, key) {
    const count = jobs.reduce((acc, job) => {
        const value = job[key];
        if (value && value !== "none") {
            acc[value] = (acc[value] || 0) + 1;
        }
        return acc;
    }, {});
    
    return count;
}

function safeParseInt(str, fallback) {
    const num = parseInt(str);
    return isNaN(num) ? fallback : num;
}

function createOption(parent, text, value, selectedValue) {
    const option = document.createElement("option");
    option.text = text;
    option.value = value;
    if (value == selectedValue) option.selected = true;
    parent.appendChild(option);
}

function createCheckBox(parent, text, value) {
    const checkBox = document.createElement("input");
    const listItem = document.createElement("li");
    const label = document.createElement("label");

    checkBox.type = "checkbox";
    checkBox.value = value;

    label.appendChild(checkBox);
    label.appendChild(document.createTextNode(` ${text}`));
    
    listItem.appendChild(label);
    parent.appendChild(listItem);
}

function buildExpOptions(select, label, start, end, selectedValue) {
    select.innerHTML = "";
    createOption(select, label, "none", selectedValue);
    for (let i = start; i <= end; i++) {
        createOption(select, i, i, selectedValue);
    }
}

function updateExpOptions() {
    const minExpSelect = document.getElementById("min-experience");
    const maxExpSelect = document.getElementById("max-experience");

    const min = safeParseInt(minExpSelect.value, 0);
    const max = safeParseInt(maxExpSelect.value, 15);

    buildExpOptions(minExpSelect, "Min", 0, max - 1, minExpSelect.value);
    buildExpOptions(maxExpSelect, "Max", min + 1, 15, maxExpSelect.value);
}

// Checkbox List With Show More
function createCheckboxList(jobs, containerId, key) {
    const batchSize = 4;
    const labels = countBy(jobs, key);
    const container = document.getElementById(containerId);
    const total = Object.values(labels).reduce((sum, count) => sum + count, 0);

    container.innerText = "";
    createCheckBox(container, `All (${total})`, "none");

    const state = { start: 0, end: batchSize };
    
    renderList(containerId, labels, state.start, state.end);
    addToggleBtn(jobs, containerId, labels, total, state, batchSize);
    
}

function renderList(containerId, labels, start, end) {
    const container = document.getElementById(containerId);
    Object.entries(labels).slice(start, end).forEach(([label, num]) => {
        createCheckBox(container, `${label} (${num})`, label);
    });
}

function removeFromList(container, end) {
    while (container.children.length > 4) {
        container.removeChild(container.lastElementChild);
    }
}

function addToggleBtn(jobs, containerId, labels, total, state, batchSize) {
    const container = document.getElementById(containerId);
    const btnLi = document.createElement("li");
    const btn = document.createElement("button");
    btn.className = "toggleCheckBoxes";

    const fullyExpanded = () => state.end >= total;
    btn.textContent = fullyExpanded() ? "Show less" : "Show more";

    btn.addEventListener("click", () => {

        if (fullyExpanded()) {
            removeFromList(container, state.end);
            state.start = 0;
            state.end = 4;
        }
        else {
            state.start = fullyExpanded() ? batchSize : Math.min(state.start + batchSize, total);
            state.end = fullyExpanded() ? batchSize : Math.min(state.end + batchSize, total);
            container.removeChild(btnLi);
            renderList(containerId, labels, state.start,state.end);
        }
        
        setupFilters(jobs);
        addToggleBtn(jobs, containerId, labels, total, state, batchSize);
    });

    btnLi.appendChild(btn);
    container.appendChild(btnLi);
    
}

function uniqueValues(jobs, key) {
    return [...new Set(jobs.flatMap(job => job[key]))].filter(v => v && v !== "none");
}

function addCheckBoxes(id, items) {
    const list = document.getElementById(id);
    list.innerHTML = "";
    items.forEach(item => createCheckBox(list, item, item));
}

function addOptions(id, items, allLabel) {
    const menu = document.getElementById(id);
    menu.innerHTML = "";
    createOption(menu, allLabel, "none");
    items.forEach(item => createOption(menu, item, item.toLowerCase()));
}

function clearAllFilters(jobs) {
    const clearFiltersBtn = document.getElementById("clear-filters");

    clearFiltersBtn.addEventListener("click", () => {
        const checkboxes = document.querySelectorAll('.filter-options input[type="checkbox"]');
        const selectOptions = document.querySelectorAll('.filter-options select');

        checkboxes.forEach(cb => cb.checked = false);

        selectOptions.forEach(select => select.value = "none");

        displayFilters(jobs);
        displayJobs(jobs);

        document.getElementById("numberOfSelectedFilters").textContent = "0 filters selected";
    });

    
}

// Display Functions
function displayFilters(jobs) {
    addCheckBoxes("workplace-list", uniqueValues(jobs, "workplace"));
    addOptions("countryValues", uniqueValues(jobs, "country"), "All Countries");
    addCheckBoxes("career-level-list", uniqueValues(jobs, "career_level"));

    // Min & Max exp filter
    const minExpSelect = document.getElementById("min-experience");
    const maxExpSelect = document.getElementById("max-experience");

    buildExpOptions(minExpSelect, "Min", 0, 15, "none");
    buildExpOptions(maxExpSelect, "Max", 0, 15, "none");

    minExpSelect.addEventListener("change", updateExpOptions);
    maxExpSelect.addEventListener("change", updateExpOptions);

    // Job category filter
    createCheckboxList(jobs, "job-category-list", "category", { batchSize: 4, showMoreEnabled: true });
    
    // Job type filter
    createCheckboxList(jobs, "job-type-list", "job_type", { batchSize: 4, showMoreEnabled: true });
}

function displayJobs(jobs) {
    const container = document.getElementById("job-cards");
    container.textContent = "";
    const template = document.getElementById("job-card");

    jobs.forEach(job => {
        const card = template.content.cloneNode(true);
        const content = card.querySelector(".job-card-content");

        content.querySelector(".jobTitle").textContent = job.title;
        content.querySelector(".jobCompany").append(job.company);
        content.querySelector(".jobPostTime").append(job.posted);
        content.querySelector(".jobSalary").append(job.salary);
        content.querySelector(".jobStatus").append(job.status);
        content.querySelector(".jobExperience").append(`${job.experience}+ years`);
        content.querySelector(".jobCreator").append(job.created_by);
        content.querySelector(".job-meta .jobType").textContent = job.job_type;
        content.querySelector(".job-meta .jobPlace").textContent = job.workplace;

        const tags = content.querySelector(".job-tags");
        job.tags.forEach(tag => {
            const span = document.createElement("span");
            span.textContent = tag;
            tags.appendChild(span);
        });

        content.querySelector(".btn-details").setAttribute("href", job.details_link);
        card.querySelector(".Company-logo").setAttribute("src", job.logo);

        container.appendChild(card);
    });
}
