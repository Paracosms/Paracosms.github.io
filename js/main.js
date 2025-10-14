// scripts all pages should have

// parallax
{
let bg1 = document.querySelector(".bg1");
let bg2 = document.querySelector(".bg2");
let x1 = 0;
let x2 = window.innerWidth; // second background starts immediately off-screen
const speed = 0.3;

function animate() {
    x1 -= speed;
    x2 -= speed;

    // move background to the right once no longer visible
    if (x1 <= -window.innerWidth) {
        x1 = x2 + window.innerWidth;
    }
    if (x2 <= -window.innerWidth) {
        x2 = x1 + window.innerWidth;
    }

    bg1.style.left = `${x1}px`;
    bg2.style.left = `${x2}px`;

    requestAnimationFrame(animate);
}

animate();
}

// back button
{
    let backButton = document.getElementById("backButton");

    backButton.addEventListener("mousedown", function() {
        // make button go down
        backButton.style.transform = "translate(0, 2vh)";

    });

    backButton.addEventListener("mouseup", function() {
        backButton.style.transform = "translate(0, -2vh)";
        window.history.back();
    });

    backButton.addEventListener("mouseenter", function() {
        backButton.src = "../images/lightbulbExtendedHover.png";
        backButton.style.transform = "translate(0, 1vh)";
        document.getElementById("backText").classList.add("show");
    });

    backButton.addEventListener("mouseleave", function() {
        backButton.src = "../images/lightbulbExtended.png"; // original image
        backButton.style.transform = "translate(0, -1vh)";
        document.getElementById("backText").classList.remove("show");
    });

}