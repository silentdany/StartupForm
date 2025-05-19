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

  console.log('Extension installed')
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
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  // Handle form fill requests
  if (message.action === 'fillForm') {
    // Forward the message to the active tab's content script
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]) {
        chrome.tabs.sendMessage(
          tabs[0].id,
          {
            action: 'fillForm',
            startup: message.startup,
            apiKey: message.apiKey,
          },
          (response) => {
            if (chrome.runtime.lastError) {
              sendResponse({
                success: false,
                message:
                  'Error communicating with content script: ' +
                  chrome.runtime.lastError.message,
              })
            } else {
              sendResponse(response)
            }
          }
        )
      } else {
        sendResponse({
          success: false,
          message: 'No active tab found',
        })
      }
    })
    return true // Will respond asynchronously
  }

  // Handle API key validation
  if (message.action === 'validateApiKey') {
    // Forward to content script for validation
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]) {
        chrome.tabs.sendMessage(
          tabs[0].id,
          {
            action: 'validateApiKey',
            apiKey: message.apiKey,
          },
          (response) => {
            if (chrome.runtime.lastError) {
              sendResponse({
                success: false,
                message:
                  'Error validating API key: ' +
                  chrome.runtime.lastError.message,
              })
            } else {
              sendResponse(response)
            }
          }
        )
      } else {
        sendResponse({
          success: false,
          message: 'No active tab found',
        })
      }
    })
    return true // Will respond asynchronously
  }

  // Handle startup data operations
  if (message.action === 'saveStartup' || message.action === 'deleteStartup') {
    // Access chrome.storage API
    chrome.storage.local[message.action === 'saveStartup' ? 'set' : 'remove'](
      {
        [message.action === 'saveStartup'
          ? `startup_${message.startup.id}`
          : message.startupId]: message.startup,
      },
      () => {
        if (chrome.runtime.lastError) {
          sendResponse({
            success: false,
            message: `Error ${message.action === 'saveStartup' ? 'saving' : 'deleting'} startup: ${chrome.runtime.lastError.message}`,
          })
        } else {
          sendResponse({
            success: true,
            message: `Startup ${message.action === 'saveStartup' ? 'saved' : 'deleted'} successfully`,
          })
        }
      }
    )
    return true // Will respond asynchronously
  }
})

// Handle tab updates
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url) {
    // Notify content script that page has loaded
    chrome.tabs
      .sendMessage(tabId, {
        action: 'pageLoaded',
        url: tab.url,
      })
      .catch(() => {
        // Ignore errors - content script might not be ready yet
      })
  }
})

// Handle extension updates
chrome.runtime.onUpdateAvailable.addListener((details) => {
  console.log('Update available:', details.version)
  // Optionally reload the extension
  // chrome.runtime.reload()
})
