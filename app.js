// CONFIG
const BIN_ID = "699289be43b1c97be9824f7f";
const MASTER_KEY = "$2a$10$BBRC77TElZJiVK11kI2LHeyCk.f1vAvTllgJEdYCGcOLlqPv51ICG";
const BIN_URL = `https://api.jsonbin.io/v3/b/${BIN_ID}`;

// ======================
// API
// ======================
export async function getUsers() {
  const res = await fetch(BIN_URL + "/latest", {
    headers: { "X-Master-Key": MASTER_KEY }
  });

  const data = await res.json();

  // Retornamos solo los usuarios, no metadata
  if (!data.record) return [];
  return data.record.map(u => ({
    id: u.id,
    username: u.username,
    password: u.password,
    active: u.active
  }));
}

export async function saveUsers(users) {
  await fetch(BIN_URL, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "X-Master-Key": MASTER_KEY
    },
    body: JSON.stringify(users)
  });
}

// ======================
// UI Helpers
// ======================
export function msg(text, color="white") {
  const el = document.getElementById("msg");
  el.innerText = text;
  el.style.color = color;
}

export function show(tab) {
  document.getElementById("login").classList.add("hidden");
  document.getElementById("register").classList.add("hidden");
  document.getElementById(tab).classList.remove("hidden");

  document.getElementById("t-login").classList.remove("active");
  document.getElementById("t-register").classList.remove("active");
  document.getElementById("t-"+tab).classList.add("active");
}

// ======================
// REGISTER
// ======================
export async function register() {
  const user = document.getElementById("r-user").value.trim();
  const pass = document.getElementById("r-pass").value.trim();
  if (!user || !pass) { msg("Fill all fields","red"); return; }

  const users = await getUsers();
  if (users.find(u => u.username === user)) { msg("User already exists","red"); return; }

  const newUser = { id: Date.now(), username: user, password: pass, active: false };
  users.push(newUser);
  await saveUsers(users);

  msg("Registered! Try Login.","white");
  show("login");
}

// ======================
// LOGIN
// ======================
export async function login() {
  const user = document.getElementById("l-user").value.trim();
  const pass = document.getElementById("l-pass").value.trim();
  if (!user || !pass) { msg("Fill all fields","red"); return; }

  const users = await getUsers();
  const u = users.find(x => x.username === user && x.password === pass);

  if (!u) { msg("Invalid login","red"); return; }

  // Guardamos solo info necesaria para dashboard
  localStorage.setItem("uid", u.id);
  localStorage.setItem("username", u.username);
  localStorage.setItem("active", u.active);
  location = "dashboard.html";
}

// ======================
// DESCARGAS AUTOMÁTICAS
// ======================
export function download(fileName) {
  const filePath = `Files/${fileName}`;
  const link = document.createElement('a');
  link.href = filePath;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}


