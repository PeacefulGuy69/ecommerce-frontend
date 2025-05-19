document.addEventListener("DOMContentLoaded", () => {
    const signupForm = document.getElementById("signupForm");
    const loginForm = document.getElementById("loginForm");

    // Firebase configuration
    const firebaseConfig = {
        apiKey: "YOUR_API_KEY",
        authDomain: "YOUR_AUTH_DOMAIN",
        projectId: "YOUR_PROJECT_ID",
        storageBucket: "YOUR_STORAGE_BUCKET",
        messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
        appId: "YOUR_APP_ID"
    };
    firebase.initializeApp(firebaseConfig);
    const auth = firebase.auth();

    if (signupForm) {
        signupForm.addEventListener("submit", function(e) {
            e.preventDefault();
            const email = document.getElementById("signupEmail").value.trim();
            const password = document.getElementById("signupPassword").value;
            const confirmPassword = document.getElementById("signupConfirmPassword").value;

            if (password !== confirmPassword) {
                alert("Passwords do not match.");
                return;
            }

            auth.createUser ;WithEmailAndPassword(email, password)
                .then((userCredential) => {
                    alert("Signup successful!");
                    window.location.href = "login.html";
                })
                .catch((error) => {
                    alert("Signup failed: " + error.message);
                });
        });
    }

    if (loginForm) {
        loginForm.addEventListener("submit", function(e) {
            e.preventDefault();
            const email = document.getElementById("loginEmail").value.trim();
            const password = document.getElementById("loginPassword").value;

            auth.signInWithEmailAndPassword(email, password)
                .then((userCredential) => {
                    alert("Login successful!");
                    window.location.href = "index.html"; // Redirect to home page after login
                })
                .catch((error) => {
                    alert("Login failed: " + error.message);
                });
        });
    }

    // Check user authentication state
    auth.onAuthStateChanged((user) => {
        if (user) {
            const logoutBtn = document.getElementById("logoutBtn");
            if (logoutBtn) {
                logoutBtn.style.display = "block";
                logoutBtn.addEventListener("click", () => {
                    auth.signOut().then(() => {
                        alert("Logged out successfully.");
                        window.location.href = "login.html";
                    });
                });
            }
        }
    });
});
