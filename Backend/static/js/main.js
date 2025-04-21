// Mobile Menu Toggle
const burger = document.querySelector('.burger');
const nav = document.querySelector('.nav-links');
const navLinks = document.querySelectorAll('.nav-links li');

burger.addEventListener('click', () => {
    // Toggle Nav
    nav.classList.toggle('nav-active');
    
    // Animate Links
    navLinks.forEach((link, index) => {
        if (link.style.animation) {
            link.style.animation = '';
        } else {
            link.style.animation = `navLinkFade 0.5s ease forwards ${index / 7 + 0.3}s`;
        }
    });
    
    // Burger Animation
    burger.classList.toggle('toggle');
});

// Smooth Scrolling for Anchor Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Newsletter Form Submission
const newsletterForm = document.getElementById('newsletter-form');
if (newsletterForm) {
    newsletterForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = newsletterForm.querySelector('input[type="email"]').value;
        
        try {
            const response = await fetch('/api/newsletter', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });
            
            const data = await response.json();
            
            if (response.ok) {
                alert(data.message);
                newsletterForm.reset();
            } else {
                alert(data.error || 'An error occurred');
            }
        } catch (error) {
            alert('Failed to submit newsletter subscription');
        }
    });
}

// Contact Form Submission
const contactForm = document.getElementById('contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = {
            name: contactForm.querySelector('[name="name"]').value,
            email: contactForm.querySelector('[name="email"]').value,
            subject: contactForm.querySelector('[name="subject"]').value,
            message: contactForm.querySelector('[name="message"]').value
        };
        
        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
            
            const data = await response.json();
            
            if (response.ok) {
                alert(data.message);
                contactForm.reset();
            } else {
                alert(data.error || 'An error occurred');
            }
        } catch (error) {
            alert('Failed to submit contact form');
        }
    });
}

// Scroll Animation
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe elements with animation class
document.querySelectorAll('.animate-on-scroll').forEach(element => {
    observer.observe(element);
});

// Document Analysis Form
const documentAnalysisForm = document.getElementById('document-analysis-form');
if (documentAnalysisForm) {
    documentAnalysisForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const fileInput = documentAnalysisForm.querySelector('input[type="file"]');
        const file = fileInput.files[0];
        
        if (!file) {
            alert('Please select a file');
            return;
        }
        
        const formData = new FormData();
        formData.append('file', file);
        
        try {
            const response = await fetch('/api/analyze', {
                method: 'POST',
                body: formData
            });
            
            const data = await response.json();
            
            if (response.ok) {
                // Display analysis results
                displayAnalysisResults(data);
            } else {
                alert(data.error || 'An error occurred during analysis');
            }
        } catch (error) {
            alert('Failed to analyze document');
        }
    });
}

// Display Analysis Results
function displayAnalysisResults(data) {
    const resultsContainer = document.getElementById('analysis-results');
    if (!resultsContainer) return;
    
    resultsContainer.innerHTML = '';
    
    // Create summary section first
    if (data.ai_analysis) {
        const summarySection = document.createElement('div');
        summarySection.className = 'result-section summary-section';
        
        const titleElement = document.createElement('h3');
        titleElement.textContent = 'Document Summary';
        
        const contentElement = document.createElement('div');
        contentElement.className = 'result-content summary-content';
        
        // Extract the first paragraph from AI analysis as the summary
        const summary = data.ai_analysis.split('\n')[0];
        contentElement.textContent = summary;
        
        summarySection.appendChild(titleElement);
        summarySection.appendChild(contentElement);
        resultsContainer.appendChild(summarySection);
    }
    
    // Create other result sections
    const sections = [
        { title: 'Document Type', content: data.document_type },
        { title: 'Key Dates', content: data.dates },
        { title: 'Monetary Values', content: data.monetary_values },
        { title: 'Document References', content: data.document_references },
        { title: 'Sections', content: data.sections },
        { title: 'Detailed Analysis', content: data.ai_analysis }
    ];
    
    sections.forEach(section => {
        if (section.content) {
            const sectionElement = document.createElement('div');
            sectionElement.className = 'result-section';
            
            const titleElement = document.createElement('h3');
            titleElement.textContent = section.title;
            
            const contentElement = document.createElement('div');
            contentElement.className = 'result-content';
            
            if (typeof section.content === 'string') {
                contentElement.textContent = section.content;
            } else if (Array.isArray(section.content)) {
                section.content.forEach(item => {
                    const itemElement = document.createElement('p');
                    itemElement.textContent = JSON.stringify(item);
                    contentElement.appendChild(itemElement);
                });
            } else if (typeof section.content === 'object') {
                Object.entries(section.content).forEach(([key, value]) => {
                    const itemElement = document.createElement('p');
                    itemElement.textContent = `${key}: ${JSON.stringify(value)}`;
                    contentElement.appendChild(itemElement);
                });
            }
            
            sectionElement.appendChild(titleElement);
            sectionElement.appendChild(contentElement);
            resultsContainer.appendChild(sectionElement);
        }
    });
} 