import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

// Supabase connection
const supabaseUrl = "https://ownsemlvxsjlflbbqbgi.supabase.co";
const supabaseKey = "sb_publishable_vp8K_9e3hEdvRd4_6-6UMA_RYFCbfyj";

const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true
    }
});

// Page elements
const loginSection = document.getElementById("login-section");
const dashboardSection = document.getElementById("dashboard-section");

const loginForm = document.getElementById("login-form");
const loginMessage = document.getElementById("login-message");
const logoutButton = document.getElementById("logout-button");

const articleForm = document.getElementById("article-form");
const articleMessage = document.getElementById("article-message");


// -----------------------------
// SHOW DASHBOARD
// -----------------------------
function showDashboard() {
    loginSection.style.display = "none";
    dashboardSection.style.display = "block";
}


// -----------------------------
// SHOW LOGIN
// -----------------------------
function showLogin() {
    loginSection.style.display = "block";
    dashboardSection.style.display = "none";
}


// -----------------------------
// CHECK LOGIN
// -----------------------------
async function checkLogin() {
    const { data, error } = await supabase.auth.getSession();

    if (error) {
        console.error("Session error:", error);
        showLogin();
        return;
    }

    if (data.session) {
        showDashboard();
    } else {
        showLogin();
    }
}


// -----------------------------
// LOGIN
// -----------------------------
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
        console.error("Login error:", error);
        loginMessage.textContent = error.message;
        return;
    }

    if (data.session) {
        loginMessage.textContent = "";
        showDashboard();
    }
});


// -----------------------------
// LOGOUT
// -----------------------------
logoutButton.addEventListener("click", async function () {
    await supabase.auth.signOut();
    showLogin();
});


// -----------------------------
// PUBLISH ARTICLE
// -----------------------------
articleForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    articleMessage.textContent = "Publishing...";

    // Get article information
    const title = document.getElementById("title").value.trim();
    const author = document.getElementById("author").value.trim();
    const category = document.getElementById("category").value.trim();
    const excerpt = document.getElementById("excerpt").value.trim();
    const content = document.getElementById("content").value.trim();
    const image_url = document.getElementById("image_url").value.trim();

    // Make sure title exists
    if (!title) {
        articleMessage.textContent = "Please enter a title.";
        return;
    }

    // Create URL-friendly slug
    const slug = title
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");

    // Check login session
    const { data: sessionData, error: sessionError } =
        await supabase.auth.getSession();

    if (sessionError) {
        console.error("Session error:", sessionError);
        articleMessage.textContent = "Could not verify your login.";
        return;
    }

    if (!sessionData.session) {
        articleMessage.textContent =
            "Your login session has expired. Please log in again.";

        showLogin();
        return;
    }

    // Insert article into Supabase
    const { data, error } = await supabase
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
        ])
        .select();

    // Check for database error
    if (error) {
        console.error("Article publishing error:", error);

        articleMessage.textContent =
            "Error publishing article: " + error.message;

        return;
    }

    // Success
    console.log("Article published:", data);

    articleMessage.textContent =
        "Article published successfully! 🎉";

    // Clear form
    articleForm.reset();

    // Put EcoLens back into author field
    document.getElementById("author").value = "EcoLens";
});


// -----------------------------
// WATCH LOGIN STATE
// -----------------------------
supabase.auth.onAuthStateChange(function (event, session) {
    if (session) {
        showDashboard();
    } else {
        showLogin();
    }
});


// -----------------------------
// START
// -----------------------------
checkLogin();
