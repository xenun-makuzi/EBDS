document.addEventListener('DOMContentLoaded', () => {
    // 1. Check if a puppy name was passed in the URL
    const params = new URLSearchParams(window.location.search);
    const puppyName = params.get('puppy');
    
    if (puppyName) {
        const puppyInput = document.getElementById('target-puppy');
        puppyInput.value = puppyName;
        // Make it look intentional
        puppyInput.style.backgroundColor = "#fdfbf9";
    }

    // 2. Handle Form Submission
    const form = document.getElementById('adoption-form');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // In a real scenario, you'd use a service like Formspree or EmailJS here
        alert("Thank you! Your application has been submitted. We will contact you shortly.");
        window.location.href = "index.html"; 
    });
});