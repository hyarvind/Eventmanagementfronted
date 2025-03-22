function toggleTheme(toggleThemeBtn) {
  const currentModeText = toggleThemeBtn.querySelector(".theme-toggle-text");
  const themeToggleBtnBall = toggleThemeBtn.querySelector(
    ".theme-toggle-ball-container",
  );

  // Check user's preference on page load and apply the stored theme if available
  const userPreferredTheme = localStorage.getItem("theme");

  if (userPreferredTheme) {
    document.body.classList.add(userPreferredTheme);
  }

  toggleThemeBtn.addEventListener("click", () => {
    const manualTheme = localStorage.getItem("theme");

    if (manualTheme === "dark") {
      themeToggleBtnBall.classList.add("ballToggledToLightMode");
      themeToggleBtnBall.classList.remove("ballToggledToDarkMode");
      localStorage.setItem("theme", "light");
      currentModeText.innerText = "Light mode";
      document.body.classList.add("light");
      document.body.classList.remove("dark");
    } else {
      themeToggleBtnBall.classList.remove("ballToggledToLightMode");
      themeToggleBtnBall.classList.add("ballToggledToDarkMode");
      localStorage.setItem("theme", "dark");
      currentModeText.innerText = "Dark mode";
      document.body.classList.toggle("dark");
      document.body.classList.remove("light");
    }
  });
}

export default toggleTheme;
