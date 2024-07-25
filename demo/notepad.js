var timeoutId
const notes = document.getElementById('notes')
document.addEventListener('keyup', logKey)

const browser_type = getBrowser()

let browser_obj

if (browser_type === 'Chrome') {
  browser_obj = chrome
} else if (browser_type === 'Firefox') {
  browser_obj = typeof browser !== 'undefined' ? browser : chrome
} else {
  browser_obj = chrome
}

if (browser_obj.tabs && browser_obj.tabs.onActivated) {
  browser_obj.tabs.onActivated.addListener(tabOpen)
}

if (browser_obj.windows && browser_obj.windows.onFocusChanged) {
  browser_obj.windows.onFocusChanged.addListener(tabOpen)
}

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
  const data = {
    tab_note: document.querySelector('#notes').value
  }
  if (browser_type === 'Chrome') {
    chrome.storage.sync.set(data, function () {})
  } else if (browser_obj && browser_obj.storage && browser_obj.storage.sync) {
    browser_obj.storage.sync.set(data).catch((error) => {
      console.error('Error saving to storage: ', error)
    })
  } else {
    console.error('Storage sync API is not available.')
  }
}

function tabOpen(tab) {
  if (browser_type === 'Chrome') {
    chrome.storage.sync.get(['tab_note'], function (result) {
      if (typeof result.tab_note !== 'undefined') {
        document.querySelector('#notes').value = result.tab_note
      }
    })
  } else if (browser_obj && browser_obj.storage && browser_obj.storage.sync) {
    browser_obj.storage.sync
      .get(['tab_note'])
      .then((result) => {
        if (typeof result.tab_note !== 'undefined') {
          document.querySelector('#notes').value = result.tab_note
        }
      })
      .catch((error) => {
        console.error('Error retrieving from storage: ', error)
      })
  } else {
    console.error('Storage sync API is not available.')
  }
}

window.addEventListener('load', () => {
  tabOpen()
})
