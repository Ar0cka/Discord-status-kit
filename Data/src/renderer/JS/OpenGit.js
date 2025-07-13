const ref = "https://github.com/Ar0cka/Discord-status-kit";

const submitBtn = document.getElementById("githubBtn"); // или по id/class

function openGit() {
    window.open(ref, "_blank");
}

submitBtn?.addEventListener('click', openGit);