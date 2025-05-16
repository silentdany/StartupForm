// Set up context menu
chrome.runtime.onInstalled.addListener(() => {
  // Create context menu item for input fields
  chrome.contextMenus.create({
    id: 'fillField',
    title: 'Fill field with startup data',
    contexts: ['editable'],
  })

  // Initialize storage if not present
  chrome.storage.local.get(['startups', 'apiKey'], (result) => {
    if (!result.startups) {
      chrome.storage.local.set({ startups: [] })
    }

    if (!result.apiKey) {
      chrome.storage.local.set({ apiKey: '' })
    }
  })
})

// Handle context menu clicks
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === 'fillField') {
    chrome.storage.local.get(['startups'], (result) => {
      const startups = result.startups || []

      if (startups.length === 0) {
        // No startups saved
        chrome.tabs.sendMessage(tab.id, {
          action: 'showNotification',
          message: 'No startups saved. Please add a startup first.',
        })
        return
      }

      // Show startup selector
      chrome.tabs.sendMessage(tab.id, {
        action: 'showStartupSelector',
        startups: startups.map((s) => ({ id: s.id, name: s.name })),
      })
    })
  }
})

// Listen for messages from content script
chrome.runtime.onMessage.addListener((message, sender) => {
  if (message.action === 'fillFieldWithStartup') {
    chrome.storage.local.get(['startups', 'apiKey'], (result) => {
      const startups = result.startups || []
      const apiKey = result.apiKey || ''

      const startup = startups.find((s) => s.id === message.startupId)

      if (startup) {
        chrome.tabs.sendMessage(sender.tab.id, {
          action: 'fillSingleField',
          startup,
          apiKey,
          fieldId: message.fieldId,
        })
      }
    })

    return true
  }
})
