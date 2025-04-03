// Toggle between Attendee and Organizer
const attendeeOption = document.getElementById('attendee-option');
const organizerOption = document.getElementById('organizer-option');
const toggleBackground = document.querySelector('.toggle-background');
const organizerFields = document.getElementById('organizer-fields');

attendeeOption.addEventListener('click', () => {
    attendeeOption.classList.add('selected');
    organizerOption.classList.remove('selected');
    toggleBackground.style.transform = 'translateX(0)';
    organizerFields.classList.remove('show');
    
    // // Make organizer fields not required
    document.getElementById('org-name').required = false;
    document.getElementById('org-desc').required = false;
});

organizerOption.addEventListener('click', () => {
    organizerOption.classList.add('selected');
    attendeeOption.classList.remove('selected');
    toggleBackground.style.transform = 'translateX(120px)';
    organizerFields.classList.add('show');
    
    // Make organizer fields required
    document.getElementById('org-name').required = true;
    document.getElementById('org-desc').required = true;
});

// Toggle password visibility
const passwordField = document.getElementById('password');
const togglePassword = document.getElementById('toggle-password');

togglePassword.addEventListener('click', () => {
    const type = passwordField.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordField.setAttribute('type', type);
    
    // Change the eye icon
    if (type === 'text') {
        togglePassword.innerHTML = `
            <img src="/assets/close eye.png" style="opacity: 0.6;"  height="16px" width="17px"   alt="logo" />`;
    } else {
        togglePassword.innerHTML = `
            <img src="/assets/open eye.png" style="opacity: 0.8;"  height="18px" width="20px"   alt="logo" />`;
    }
});


// Form submission
const form = document.getElementById('registration-form');
form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Get form data
    const formData = new FormData(form);
    const userData = Object.fromEntries(formData.entries());

    
    // Add user type
    userType = document.getElementById('organizer-option').classList.contains('selected') ? 'ORGANIZER' : 'ATTENDEE';
    let originalButtonText = null;
    let submitButton = null;
    console.log("userData: ", userData);
    try {
        // Show loading state
        submitButton = form.querySelector('button[type="submit"]');
        originalButtonText = submitButton.textContent;
        submitButton.textContent = 'Signing up...';
        submitButton.disabled = true;
        console.log("userType :", userType)
        // Send data to server
        const response = await createUser(userType, userData);
        // Handle response
        if (response.ok) {
            const data = await response.json();
            console.log('Registration successful:', data);
            alert('Registration successful!');
            // Redirect to login or dashboard
            window.location.href = '/html/login.html';
        } else {
            const errorData = await response.json();
            console.error('Registration failed:', errorData);
            alert(`Registration failed: ${errorData.message || 'Please try again'}`);
        }
    } catch (error) {
        console.error('Error during registration:', error);
        alert('An error occurred during registration. Please try again.');
    } finally {
        // Reset button state
        submitButton.textContent = originalButtonText;
        submitButton.disabled = false;
    }
});