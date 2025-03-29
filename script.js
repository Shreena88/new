document.addEventListener("DOMContentLoaded", function () {
    const navbar = document.querySelector(".navbar");
    const logo = document.getElementById("logo");
    const loginBtn = document.getElementById("loginBtn");
    const loginPopup = document.getElementById("loginPopup");
    const loginOverlay = document.getElementById("loginOverlay");
    let lastScrollTop = 0;

    // Scroll Down Function
    window.scrollToNextSection = function () {
        window.scrollBy({ top: window.innerHeight, behavior: 'smooth' });
    };

    // Hide Navbar on Scroll
    window.addEventListener("scroll", function () {
        let currentScroll = window.scrollY;
        navbar.classList.toggle("hidden", currentScroll > lastScrollTop && currentScroll > 50);
        logo.classList.toggle("hidden", currentScroll > lastScrollTop && currentScroll > 50);
        lastScrollTop = Math.max(currentScroll, 0);
    });

    // Toggle Login Popup
    loginBtn.addEventListener("click", function (event) {
        event.preventDefault();
        loginPopup.style.display = "block";
        loginOverlay.style.display = "block";
        document.body.classList.add("login-active");
    });

    // Hide Login Popup when clicking outside
    loginOverlay.addEventListener("click", function () {
        loginPopup.style.display = "none";
        loginOverlay.style.display = "none";
        document.body.classList.remove("login-active");
    });

    // Check if User is Logged In & Update UI
    let loggedInUser = localStorage.getItem("userLoggedIn");
    if (loggedInUser) {
        loginBtn.textContent = loggedInUser;
        loginBtn.classList.add("logged-in");
    }
});

// Toggle between Login & Register Forms
function toggleForm() {
    const loginForm = document.getElementById("loginForm");
    const registerForm = document.getElementById("registerForm");
    const formTitle = document.getElementById("formTitle");

    const isLoginVisible = loginForm.style.display !== "none";
    loginForm.style.display = isLoginVisible ? "none" : "block";
    registerForm.style.display = isLoginVisible ? "block" : "none";
    formTitle.innerText = isLoginVisible ? "Register" : "Log In";
}

// Register User
function register() {
    const username = document.getElementById("registerUsername").value.trim();
    const email = document.getElementById("registerMail").value.trim();
    const password = document.getElementById("registerPassword").value.trim();
    const message = document.getElementById("message");

    if (!username || !email || !password) {
        message.innerHTML = "Fields cannot be empty!";
        return;
    }

    let users = JSON.parse(localStorage.getItem("users")) || {};
    if (users[username]) {
        message.innerHTML = "Username already exists!";
        return;
    }

    users[username] = { email, password };
    localStorage.setItem("users", JSON.stringify(users));

    message.innerHTML = "Registration successful! Please log in.";
    message.style.color = "green";

    // Hide login popup after successful registration
    setTimeout(() => {
        document.getElementById("loginPopup").style.display = "none";
        document.getElementById("loginOverlay").style.display = "none";
        document.body.classList.remove("login-active");
    }, 1000);

    toggleForm();
}

// Login User
function login() {
    const username = document.getElementById("loginUsername").value.trim();
    const password = document.getElementById("loginPassword").value.trim();
    const message = document.getElementById("message");

    let users = JSON.parse(localStorage.getItem("users")) || {};

    if (users[username] && users[username].password === password) {
        localStorage.setItem("userLoggedIn", username);

        // Hide login popup after login
        document.getElementById("loginPopup").style.display = "none";
        document.getElementById("loginOverlay").style.display = "none";
        document.body.classList.remove("login-active");

        // Update Login Button to Username
        let loginBtn = document.getElementById("loginBtn");
        loginBtn.textContent = username;
        loginBtn.classList.add("logged-in");
    } else {
        message.innerHTML = "Invalid username or password!";
    }
}

// Upload & Process File
function uploadFile() {
    const fileInput = document.getElementById("fileInput");
    const uploadStatus = document.getElementById("uploadStatus");
    const flipCardInner = document.querySelector(".flip-card-inner");
    const progressBar = document.getElementById("progress-bar");
    const progressText = document.getElementById("progress-text");

    if (fileInput.files.length === 0) {
        uploadStatus.innerHTML = "Please select a file!";
        uploadStatus.style.color = "red";
        return;
    }

    let file = fileInput.files[0];
    uploadStatus.innerHTML = `Uploading: ${file.name}...`;
    uploadStatus.style.color = "black";

    progressBar.style.width = "0%";
    progressText.innerHTML = "0%";

    flipCardInner.style.transition = "transform 1.5s cubic-bezier(0.25, 1, 0.5, 1)";
    flipCardInner.style.transform = "rotateY(180deg)";

    setTimeout(() => {
        uploadStatus.innerHTML = "Upload Successful! Extracting...";
        startProgressBar();
    }, 1200);
}

// Start Progress Bar
function startProgressBar() {
    const progressBar = document.getElementById("progress-bar");
    const progressText = document.getElementById("progress-text");
    let extractionProgress = 0;

    let extractionInterval = setInterval(() => {
        extractionProgress += 5;
        progressBar.style.width = `${extractionProgress}%`;
        progressText.innerHTML = `${extractionProgress}%`;

        if (extractionProgress >= 100) {
            clearInterval(extractionInterval);
            setTimeout(() => {
                document.getElementById("uploadStatus").innerHTML = "Extraction Complete!";
                document.getElementById("uploadStatus").style.color = "green";
                showClaimInfo();
            }, 700);
        }
    }, 300);
}

// Show Claim Info
function showClaimInfo() {
    document.querySelector(".flip-card").style.display = "none";
    document.getElementById("claim-info-card").style.display = "flex";

    let fileInput = document.getElementById("fileInput");

    if (fileInput.files.length === 0) {
        updateClaimInfo("Unknown Document", "Failed to Process", "No document uploaded.");
        return;
    }

    let uploadedFile = fileInput.files[0];
    let fileName = uploadedFile.name;
    let fileType = uploadedFile.type;
    let docType = detectDocumentType(fileName, fileType);

    updateClaimInfo(docType, "Processing Completed", `
        <p><strong>File Name:</strong> ${fileName}</p>
        <p><strong>File Type:</strong> ${fileType || "Unknown"}</p>
        <p><strong>Upload Time:</strong> ${new Date().toLocaleString()}</p>
    `);
}

// Detect Document Type
function detectDocumentType(fileName, fileType) {
    if (fileName.toLowerCase().includes("aadhar")) return "Aadhar Card";
    if (fileName.toLowerCase().includes("passport")) return "Passport";
    if (fileName.toLowerCase().includes("pan")) return "PAN Card";
    if (fileType === "application/pdf") return "PDF Document";
    if (fileType.startsWith("image/")) return "Scanned Image";
    return "Unknown Document";
}

// Update Claim Info UI
function updateClaimInfo(docType, status, extractedData) {
    document.getElementById("docType").innerHTML = docType;
    document.getElementById("claimStatus").innerHTML = status;
    document.getElementById("extractedData").innerHTML = extractedData;
}

// Restart Upload
function restartUpload() {
    location.reload();
}

document.addEventListener("DOMContentLoaded", function () {
    const loginBtn = document.getElementById("loginBtn");

    // Ensure localStorage value is correctly checked
    if (localStorage.getItem("userLoggedIn") === "true") {
        loginBtn.textContent = "Log Out"; // Correct text
        loginBtn.addEventListener("click", function () {
            localStorage.removeItem("userLoggedIn");
            location.reload();
        });
    } else {
        loginBtn.textContent = "Log In";
        loginBtn.href = "LogIn.html";
    }
});
