import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

const supabaseUrl = "https://ownsemlvxsjlflbbqbgi.supabase.co";
const supabaseKey = "sb_publishable_vp8K_9e3hEdvRd4_6-6UMA_RYFCbfyj";

const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true
    }
});

const loginSection = document.getElementById("login-section");
const dashboardSection = document.getElementById("dashboard-section");
const loginForm = document.getElementById("login-form");
const loginMessage = document.getElementById("login-message");
const logoutButton = document.getElementById("logout-button");

const articleForm = document.getElementById("article-form");
const articleMessage = document.getElementById("article-message");

// Show the correct screen
function showDashboard() {
    loginSection.style.display = "none";
    dashboardSection.style.display = "block";
}

function showLogin() {
    loginSection.style.display = "block";
    dashboardSection.style.display = "none";
}

// Check if already logged in when page loads
async function checkLogin() {
    const { data, error } = await supabase.auth.getSession();

    if (error) {
        console.error(error);
        showLogin();
        return;
    }

    if (data.session) {
        showDashboard();
    } else {
        showLogin();
    }
}

// LOGIN
loginForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    loginMessage.textContent = "Logging in...";

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password
    });

    if (error) {
        loginMessage.textContent = error.message;
        return;
    }

    if (data.session) {
        loginMessage.textContent = "";
        showDashboard();
    }
});

// LOGOUT
logoutButton.addEventListener("click", async function () {
    await supabase.auth.signOut();
    showLogin();
});

// PUBLISH ARTICLE
articleForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    articleMessage.textContent = "Publishing...";

    const title = document.getElementById("title").value;
    const author = document.getElementById("author").value;
    const category = document.getElementById("category").value;
    const excerpt = document.getElementById("excerpt").value;
    const content = document.getElementById("content").value;
    const image_url = document.getElementById("image_url").value;

    const slug = title
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");

    // Make sure we still have a login session
    const { data: sessionData } = await supabase.auth.getSession();

    if (!sessionData.session) {
        articleMessage.textContent = "Your login session has expired. Please log in again.";
        showLogin();
        return;
    }

    const { error } = await supabase
        .from("articles")
        .insert([
            {
                title: title,
                slug: slug,
                author: author,
                category: category,
                excerpt: excerpt,
                content: content,
                image_url: image_url,
                published: true
            }
        ]);

    if (error) {
        console.error(error);
        articleMessage.textContent = "Error: " + error.message;
        return;
    }

    articleMessage.textContent = "Article published successfully! 🎉";

    articleForm.reset();

    document.getElementById("author").value = "EcoLens";
});

// Watch for login/logout changes
supabase.auth.onAuthStateChange(function (event, session) {
    if (session) {
        showDashboard();
    } else {
        showLogin();
    }
});

// Start
checkLogin();
