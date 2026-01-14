> [!NOTE]
> NoteKeeper v2 is now available as two separate extensions that sync notes with each other. Install both for the best experience!

<h1><img src="./shared/icon.svg" height="28px" width="28px" /> NoteKeeper</h1>

![Mozilla Add-on](https://img.shields.io/amo/v/newtab-notes@semanticdata) ![Add-on rating](https://img.shields.io/amo/rating/newtab-notes@semanticdata) ![Add-on downloads](https://img.shields.io/amo/dw/newtab-notes@semanticdata) ![Add-on users](https://img.shields.io/amo/users/newtab-notes@semanticdata) ![License](https://img.shields.io/github/license/semanticdata/firefox-new-tab-notes)

[NoteKeeper](https://addons.mozilla.org/en-US/firefox/addon/notekeeper/) replaces the new tab page with a simple text editor. Your notes auto-save and sync across devices via Firefox Sync. The companion [NoteKeeper Sidebar](https://addons.mozilla.org/en-US/firefox/addon/notekeeper-sidebar/) extension adds a sidebar editor that syncs with the new tab version.

<a href="https://addons.mozilla.org/en-US/firefox/addon/notekeeper/">
<img src="https://raw.githubusercontent.com/semanticdata/text-revealer-firefox-extension/master/firefox.png" alt="firefox addon" /></a>

## What it does

Both extensions share notes via Firefox Sync:

### NoteKeeper (New Tab)

- [x] Auto-saves as you type (debounced, not on every keystroke)
- [x] Syncs notes across devices via Firefox Sync
- [x] Dark/light theme, follows your system preference
- [x] Adjustable font size
- [x] Works offline

### NoteKeeper Sidebar (Companion)

- [x] All features of NoteKeeper
- [x] Opens in Firefox sidebar (Alt+Shift+N)
- [x] Syncs with NoteKeeper (notes appear in both extensions)
- [x] Keyboard shortcut customization

## Testing Checklist

NoteKeeper (New Tab):

- [x] Open new tab - should show NoteKeeper editor
- [ ] Type text - should auto-save (status shows "Saved")
- [x] Toggle theme - dark/light modes work
- [ ] Adjust font size - slider changes text size
- [ ] Refresh page - notes persist
- [ ] Check word count - updates as you type

NoteKeeper Sidebar:

- [ ] Press `Alt+Shift+N` - sidebar opens
- [ ] Type text in sidebar - should auto-save
- [x] Toggle theme in sidebar - works
- [ ] Adjust font size in sidebar - works
- [ ] Open extension options - keyboard shortcut config appears
- [ ] Change keyboard shortcut - saves successfully

Test Sync Between Extensions:

- [ ] Type in new tab → appears in sidebar
- [ ] Type in sidebar → appears in new tab
- [ ] Change theme in new tab → changes in sidebar
- [ ] Change font size in new tab → changes in sidebar
- [ ] Open two tabs - both sync notes
- [ ] Close/reopen new tab - notes restored
- [ ] Close/reopen sidebar - notes restored

Test Offline Mode:

- [ ] Disconnect internet
- [ ] Type in new tab - saves (to local storage)
- [ ] Type in sidebar - saves
- [ ] Reconnect internet - syncs to Firefox Sync
- [ ] Notes persist across devices

Test Cross-Tab Sync:

- [ ] Open multiple new tabs
- [ ] Type in one tab - updates others
- [ ] Switch between tabs - notes sync
- [ ] Open sidebar - notes match new tab

<!--
## Screenshots

| ![light-mode](./screenshot.png) | ![dark-mode](./screenshot-dark.png) |
| :-----------------------------: | :---------------------------------: |
-->

## Acknowledgments

This extension is based on [Tab Notes](https://github.com/nsht/tab_notes). It hadn't received updates in over 6 years last time I checked.

## License

Available under the [MIT License](./LICENSE).
