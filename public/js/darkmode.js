// Dark Mode Toggle Functionality

// Check if user has a saved theme preference
const savedTheme = localStorage.getItem('theme') || 'light';

// Apply the saved theme on page load
document.addEventListener('DOMContentLoaded', function() {
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
        updateToggleButton();
    }
});

// Function to toggle dark mode
function toggleDarkMode() {
    const isDarkMode = document.body.classList.toggle('dark-mode');
    
    // Save user preference to localStorage
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    
    // Update the toggle button icon
    updateToggleButton();
}

// Function to update toggle button appearance
function updateToggleButton() {
    const toggleBtn = document.getElementById('themeToggleBtn');
    const isDarkMode = document.body.classList.contains('dark-mode');
    
    if (toggleBtn) {
        if (isDarkMode) {
            toggleBtn.innerHTML = '<i class="fa-solid fa-sun"></i>';
            toggleBtn.title = 'Switch to Light Mode';
        } else {
            toggleBtn.innerHTML = '<i class="fa-solid fa-moon"></i>';
            toggleBtn.title = 'Switch to Dark Mode';
        }
    }
}

// Initialize the toggle button
document.addEventListener('DOMContentLoaded', function() {
    updateToggleButton();
});
