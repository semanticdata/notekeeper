// Export functionality for NoteKeeper
const exportEls = {
  exportButton: document.getElementById("export-button"),
  notes: document.getElementById("notes"),
  status: document.getElementById("save-status"),
};

// Generate timestamped filename: YYYYMMDDThhmm-notekeeper.txt
const generateFilename = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  
  return `${year}${month}${day}T${hours}${minutes}-notekeeper.txt`;
};

// Export notes to local file
const exportNotes = () => {
  const content = exportEls.notes.value;
  
  if (!content.trim()) {
    exportEls.status.textContent = "Nothing to export";
    setTimeout(() => {
      exportEls.status.textContent = "Ready";
    }, 2000);
    return;
  }

  try {
    const filename = generateFilename();
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    exportEls.status.textContent = "Exported";
    setTimeout(() => {
      exportEls.status.textContent = "Ready";
    }, 2000);
  } catch (error) {
    console.error("Export error:", error);
    exportEls.status.textContent = "Export failed";
    setTimeout(() => {
      exportEls.status.textContent = "Ready";
    }, 2000);
  }
};

// Initialize export functionality
if (exportEls.exportButton && exportEls.notes && exportEls.status) {
  exportEls.exportButton.addEventListener("click", exportNotes);
}
