# HustleHUB Website

HustleHUB is a job portal designed to connect job seekers with employers. The website currently consists of multiple pages, each with its own functionality and design.

## Pages and Features

### 1. **Home Page (`index.html`)**
   - **Hero Section**: A welcoming section with a background image and buttons for adding or finding jobs.
   - **Header**: Contains the website logo and navigation links to other pages.
   - **Footer**: Includes links to the Privacy Policy, Terms of Service, and Contact Us.

   **Styles**:
   - Shared styles are in `style.css`.
   - Hero section-specific styles are in `hero.css`.

### 2. **Jobs Page (`jobs.html`)**
   - **Filters Sidebar**: Allows users to filter jobs by workplace, country, career level, years of experience, job category, and job type.
   - **Job Listings**: Displays job cards with details such as job title, company, posted time, job type, and tags. Each job card includes a "Show Job Details" button.

   **Styles**:
   - Shared styles are in `style.css`.
   - Jobs page-specific styles are in `jobs.css`.

### 3. **Contact Page (`contact.html`)**
   - **Contact Form**: A form for users to get in touch with the website administrators.
   - **Header and Footer**: Shared across all pages.

   **Styles**:
   - Shared styles are in `style.css`.
   - Contact page-specific styles are in `contact.css`.

### 4. **Job Details Page (`job_details.html`)**
   - **Job Details Section**: Displays detailed information about a specific job.
   - **Header and Footer**: Shared across all pages.

   **Styles**:
   - Shared styles are in `style.css`.
   - Job details page-specific styles are in `job-details.css`.

## File Structure

```
project/
├── assets/                # Contains images and other assets
├── index.html             # Home page
├── jobs.html              # Jobs page
├── contact.html           # Contact page
├── job_details.html       # Job details page
├── style.css              # Shared styles (header, footer, variables, etc.)
├── hero.css               # Hero section styles
├── jobs.css               # Jobs page styles
├── contact.css            # Contact page styles
├── job-details.css        # Job details page styles
```

## How to Run

1. Open `index.html` in a browser to view the home page.
2. Navigate to other pages using the links in the header.

## Future Enhancements

- Add interactivity to the filters on the jobs page.
- Add sign in for admin and user
- add add job page
- Implement backend functionality for job submissions and applications.
- Enhance responsiveness for mobile devices.