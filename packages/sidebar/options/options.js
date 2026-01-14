const sidebarToggle = "_execute_sidebar_action";

// Update UI and set value of textbox
async function updateUI() {
  try {
    const commands = await browser.commands.getAll();
    for (const command of commands) {
      if (command.name === sidebarToggle) {
        document.querySelector("#shortcut").value = command.shortcut;
      }
    }
  } catch (error) {
    console.error("Error updating UI:", error);
  }
}

// Update shortcut to value of textbox
async function updateShortcut() {
  try {
    await browser.commands.update({
      name: sidebarToggle,
      shortcut: document.querySelector("#shortcut").value,
    });
    // Provide visual feedback
    const statusElement = document.querySelector("#status");
    if (statusElement) {
      statusElement.textContent = "Shortcut updated successfully!";
      setTimeout(() => {
        statusElement.textContent = "";
      }, 2000);
    }
  } catch (error) {
    console.error("Error updating shortcut:", error);
    // Show error message
    const statusElement = document.querySelector("#status");
    if (statusElement) {
      statusElement.textContent = "Error updating shortcut. Please try again.";
      setTimeout(() => {
        statusElement.textContent = "";
      }, 2000);
    }
  }
}

// Reset shortcut and update textbox
async function resetShortcut() {
  try {
    await browser.commands.reset(sidebarToggle);
    await updateUI();
    // Provide visual feedback
    const statusElement = document.querySelector("#status");
    if (statusElement) {
      statusElement.textContent = "Shortcut reset successfully!";
      setTimeout(() => {
        statusElement.textContent = "";
      }, 2000);
    }
  } catch (error) {
    console.error("Error resetting shortcut:", error);
  }
}

// Initialize event listeners
function initEventListeners() {
  document.querySelector("#update").addEventListener("click", updateShortcut);
  document.querySelector("#reset").addEventListener("click", resetShortcut);
}

// Update UI and set up event listeners on page load
document.addEventListener("DOMContentLoaded", () => {
  updateUI();
  initEventListeners();
});
