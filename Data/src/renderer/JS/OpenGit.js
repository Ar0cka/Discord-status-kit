const ref = "https://github.com/Ar0cka";

const submitBtn = document.getElementById("githubBtn"); // или по id/class

function openGit() {
    window.open(ref, "_blank");
}

submitBtn?.addEventListener('click', openGit);