import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

const supabaseUrl = "https://ownsemlvxsjlflbbqbgi.supabase.co";
const supabaseKey = "sb_publishable_vp8K_9e3hEdvRd4_6-6UMA_RYFCbfyj";

const supabase = createClient(supabaseUrl, supabaseKey);

const loginForm = document.getElementById("login-form");
const loginMessage = document.getElementById("login-message");

const loginSection = document.getElementById("login-section");
const dashboardSection = document.getElementById("dashboard-section");

loginForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    loginMessage.textContent = "Logging in...";

    const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password
    });

    if (error) {
        loginMessage.textContent = error.message;
        return;
    }

    loginSection.style.display = "none";
    dashboardSection.style.display = "block";
});

document.getElementById("logout-button").addEventListener("click", async function () {
    await supabase.auth.signOut();

    loginSection.style.display = "block";
    dashboardSection.style.display = "none";
});
