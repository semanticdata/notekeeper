// Constant for sidebar toggle command name
const sidebarToggle = "_execute_sidebar_action";

// Update UI and set value of textbox
async function updateUI() {
  let commands = await browser.commands.getAll();
  for (command of commands) {
    if (command.name === sidebarToggle) {
      document.querySelector("#shortcut").value = command.shortcut;
    }
  }
}

// Toggles Sidebar with new Action Button
function openSidebar() {
  browser.sidebarAction.toggle();
}

// Listen for clicks on the browser action (toolbar icon)
browser.browserAction.onClicked.addListener(openSidebar);

// Initialize UI when DOM is ready
document.addEventListener("DOMContentLoaded", updateUI);
