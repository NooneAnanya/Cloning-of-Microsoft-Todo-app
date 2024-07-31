const signupForm = document.getElementById('signup-form');
const signupMessage = document.getElementById('signup-message');
const passwordInput = document.getElementById('password');
const confirmPasswordInput = document.getElementById('confirm-password');
const passwordError = document.getElementById('password-error');
const confirmPasswordError = document.getElementById('confirm-password-error');
const loadingIndicator = document.getElementById('loading');

signupForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const password = passwordInput.value;
  const confirmPassword = confirmPasswordInput.value;

  let isValid = true;

  // Clear previous error messages
  passwordError.textContent = '';
  confirmPasswordError.textContent = '';

  // Basic validation
  if (password !== confirmPassword) {
    confirmPasswordError.textContent = 'Passwords do not match.';
    isValid = false;
  }

  if (isValid) {
    // Show loading indicator
    loadingIndicator.style.display = 'block';

    // Simulate saving user data (replace with actual logic)
    const storedUsers = JSON.parse(localStorage.getItem('users')) || [];
    storedUsers.push({ name, email, password });
    localStorage.setItem('users', JSON.stringify(storedUsers));

    // Simulate successful signup
    setTimeout(() => {
      loadingIndicator.style.display = 'none';
      window.location.href = 'Login.html'; // Redirect to login page
    }, 1000); // 1 second delay for loading simulation
  }
});
