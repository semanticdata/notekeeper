var timeoutId
const notes = document.getElementById('notes')
document.addEventListener('keyup', logKey)

const browser_type = getBrowser()
if (browser_type === 'Chrome') {
  var browser_obj = chrome
} else {
  var browser_obj = browser
}

browser_obj.tabs.onActivated.addListener(tabOpen)
browser_obj.windows.onFocusChanged.addListener(tabOpen)

function logKey(e) {
  clearTimeout(timeoutId)
  timeoutId = setTimeout(function () {
    saveToDB()
  }, 10)
}

function getBrowser() {
  if (typeof chrome !== 'undefined') {
    if (typeof browser !== 'undefined') {
      return 'Firefox'
    } else {
      return 'Chrome'
    }
  } else {
    return 'Edge'
  }
}

function saveToDB() {
  data = {
    tab_note: document.querySelector('#notes').value
  }
  if (browser_type === 'Chrome') {
    chrome.storage.sync.set(data, function () {})
  } else {
    browser_obj.storage.sync.set(data)
  }
}

function tabOpen(tab) {
  if (browser_type === 'Chrome') {
    chrome.storage.sync.get(['tab_note'], function (result) {
      if (typeof result.tab_note !== 'undefined') {
        document.querySelector('#notes').value = result.tab_note
      }
    })
  } else {
    browser_obj.storage.sync.get(['tab_note']).then((result) => {
      if (typeof result.tab_note !== 'undefined') {
        document.querySelector('#notes').value = result.tab_note
      }
    })
  }
}

window.addEventListener('load', () => {
  tabOpen()
})
