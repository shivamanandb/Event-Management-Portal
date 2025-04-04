// DOM Elements
const editBtn = document.getElementById('editProfileBtn');
const viewSection = document.getElementById('viewProfileSection');
const editForm = document.getElementById('editForm');
const saveBtn = document.getElementById('saveChanges');
const cancelBtn = document.getElementById('cancelEdit');
const organizerSection = document.getElementById('organizerSection');
const organizerFormFields = document.getElementById('organizerFormFields');

// Form Elements
const editName = document.getElementById('editName');
const editEmail = document.getElementById('editEmail');
const editPhone = document.getElementById('editPhone');
const editOrgName = document.getElementById('editOrgName');
const editOrgDescription = document.getElementById('editOrgDescription');

// Display Elements
const displayName = document.getElementById('displayName');
const displayRole = document.getElementById('displayRole');
const displayFullName = document.getElementById('displayFullName');
const displayEmail = document.getElementById('displayEmail');
const displayPhone = document.getElementById('displayPhone');
const displayUserRole = document.getElementById('displayUserRole');
const displayOrgName = document.getElementById('displayOrgName');
const displayOrgDescription = document.getElementById('displayOrgDescription');

const userData = JSON.parse(localStorage.getItem('user'));

// Function to populate the display with user data
function populateUserData() {
    displayName.textContent = userData.name;
    displayRole.textContent = userData.role;
    displayFullName.textContent = userData.name;
    displayEmail.textContent = userData.email;
    displayPhone.textContent = userData.phoneNo;
    displayUserRole.textContent = userData.role;
    
    // Show/hide organizer fields based on role
    if (userData.role === "ORGANIZER") {
        organizerSection.style.display = "block";
        organizerFormFields.style.display = "block";
        displayOrgName.textContent = userData.organizationName;
        displayOrgDescription.textContent = userData.description;
    } else {
        organizerSection.style.display = "none";
        organizerFormFields.style.display = "none";
    }

    // Populate edit form
    editName.value = userData.name;
    editEmail.value = userData.email;
    editPhone.value = userData.phoneNo;
    editOrgName.value = userData.organizationName || "";
    editOrgDescription.value = userData.description || "";
}

// Show edit form
editBtn.addEventListener('click', () => {
    viewSection.style.display = 'none';
    editForm.style.display = 'block';
});

// Cancel edit
cancelBtn.addEventListener('click', () => {
    viewSection.style.display = 'block';
    editForm.style.display = 'none';
});

// Save changes
saveBtn.addEventListener('click', async() => {
    // Update user data object
    userData.name = editName.value ? editName.value : userData.name;
    userData.email = editEmail.value ? editEmail.value : userData.email;
    userData.phoneNo = editPhone.value ? editPhone.value : userData.phoneNo;
    
    if (userData.role == "ORGANIZER") {
        userData.organizationName = editOrgName.value ? editOrgName.value : userData.organizationName;
        userData.description = editOrgDescription.value ? editOrgDescription.value : userData.description;
    }
    
    // Update the display
    populateUserData();
    
    console.log('Updated user data:', userData);

    // sending data to backend
    const response = await updateData(userData);
    alert(response);

    if(response && !response.includes("Error") && !response.startsWith("Error")){
        console.log("response", response);
        await fetchCurrentUser(localStorage.getItem('token'));
        // Hide edit form, show view
        viewSection.style.display = 'block';
        editForm.style.display = 'none';
    }
});

// Load user data when page loads
document.addEventListener('DOMContentLoaded', () => {
    
    if(!localStorage.getItem('token')){
        window.location.href = '/html/login.html';
        return;
    }
    document.body.style.display = 'block';

    const token = localStorage.getItem('token');


    setupNavigation();
    populateUserData();
});