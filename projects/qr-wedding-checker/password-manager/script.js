// === USER AUTH ===

const authForm = document.getElementById("auth-form");
const loginBtn = document.getElementById("login-btn");
const authMsg = document.getElementById("auth-message");
const authSection = document.getElementById("auth-section");
const managerSection = document.getElementById("manager-section");

// Check if user is registered
const storedUser = JSON.parse(localStorage.getItem("user"));

authForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const username = document.getElementById("auth-username").value;
  const password = document.getElementById("auth-password").value;

  if (!storedUser) {
    // First time setup: Register
    const newUser = { username, password };
    localStorage.setItem("user", JSON.stringify(newUser));
    authMsg.textContent = "Account created! You are now logged in.";
    showManager();
  } else {
    // Login flow
    if (storedUser.username === username && storedUser.password === password) {
      authMsg.textContent = "Login successful.";
      showManager();
    } else {
      authMsg.textContent = "Incorrect username or password.";
    }
  }
});

function showManager() {
  authSection.style.display = "none";
  managerSection.style.display = "block";
  displayPasswords();
}

// === PASSWORD MANAGER ===

document.getElementById("password-form").addEventListener("submit", function (e) {
  e.preventDefault();

  const site = document.getElementById("site-name").value;
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  const entry = {
    id: Date.now(),
    site,
    username,
    password
  };

  savePassword(entry);
  displayPasswords();
  this.reset();
});

document.getElementById("generate-password").addEventListener("click", () => {
  const password = generatePassword(12);
  document.getElementById("password").value = password;
});

function generatePassword(length = 12) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }
  return result;
}

function savePassword(entry) {
  const existing = JSON.parse(localStorage.getItem("passwords") || "[]");
  existing.push(entry);
  localStorage.setItem("passwords", JSON.stringify(existing));
}

function displayPasswords() {
  const container = document.getElementById("password-list");
  container.innerHTML = "";

  const data = JSON.parse(localStorage.getItem("passwords") || "[]");

  data.forEach(item => {
    const div = document.createElement("div");
    div.className = "password-entry";
    div.innerHTML = `
      <strong>${item.site}</strong><br/>
      Username: ${item.username}<br/>
      Password: ${item.password}<br/>
      <button onclick="deletePassword(${item.id})">Delete</button>
    `;
    container.appendChild(div);
  });
}

function deletePassword(id) {
  let data = JSON.parse(localStorage.getItem("passwords") || "[]");
  data = data.filter(item => item.id !== id);
  localStorage.setItem("passwords", JSON.stringify(data));
  displayPasswords();
}
