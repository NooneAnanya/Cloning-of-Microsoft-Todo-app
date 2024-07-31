const loginForm = document.getElementById('login-form');
const loginMessage = document.getElementById('login-message');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const loginError = document.getElementById('login-error');

loginForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const email = emailInput.value;
  const password = passwordInput.value;

  // Retrieve stored users (assuming they were previously stored during signup)
  const storedUsers = JSON.parse(localStorage.getItem('users')) || [];

  let foundUser = false;
  let errorMessage = '';

  for (const user of storedUsers) {
    if (user.email === email && user.password === password) {
      foundUser = true;
      break;
    }
  }

  if (foundUser) {
    localStorage.setItem('loggedInUser', email); // Set logged-in user in local storage
    loginMessage.textContent = 'Login successful! Redirecting to Home...';

    // Simulate redirection (replace with actual redirection logic)
    setTimeout(() => {
      window.location.href = 'Home.html'; // Redirect to home.html
    }, 1500); // Delay for 1.5 seconds for visual feedback
  } else {
    errorMessage = 'Invalid email or password.';
  }

  loginError.textContent = errorMessage;
  loginError.style.display = errorMessage ? 'block' : 'none';
});
