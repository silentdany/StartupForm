// Global variables
let currentStartup = null
let startups = []
let apiKey = ''
let personalInfo = {
  name: '',
  email: '',
}

// Theme handling
function setTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme)
  chrome.storage.local.set({ theme })
}

function initTheme() {
  chrome.storage.local.get('theme', ({ theme }) => {
    if (!theme) {
      // Check system preference
      if (
        window.matchMedia &&
        window.matchMedia('(prefers-color-scheme: dark)').matches
      ) {
        theme = 'dark'
      } else {
        theme = 'light'
      }
    }
    setTheme(theme)
  })

  // Listen for system theme changes
  if (window.matchMedia) {
    window
      .matchMedia('(prefers-color-scheme: dark)')
      .addEventListener('change', (e) => {
        setTheme(e.matches ? 'dark' : 'light')
      })
  }
}

// DOM Elements
const tabButtons = document.querySelectorAll('.tab-button')
const tabPanes = document.querySelectorAll('.tab-pane')
const startupItemsContainer = document.getElementById('startup-items')
const emptyStartupsContainer = document.getElementById('empty-startups')
const addStartupBtn = document.getElementById('add-startup-btn')
const addNewStartupBtn = document.getElementById('add-new-startup-btn')
const startupModal = document.getElementById('startup-modal')
const closeModalBtn = document.querySelector('.close')
const cancelBtn = document.getElementById('cancel-btn')
const startupForm = document.getElementById('startup-form')
const modalTitle = document.getElementById('modal-title')
const themeToggleBtn = document.getElementById('theme-toggle')

const startupSelect = document.getElementById('startup-select')
const fillFormBtn = document.getElementById('fill-form-btn')
const fillStatus = document.getElementById('fill-status')

const aiKeyInput = document.getElementById('ai-key')
const saveSettingsBtn = document.getElementById('save-settings-btn')
const settingsStatus = document.getElementById('settings-status')

const personalNameInput = document.getElementById('personal-name')
const personalEmailInput = document.getElementById('personal-email')

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  initTheme()
  loadStartups()
  loadSettings()
  setupEventListeners()
})

// Load saved startups from storage
function loadStartups() {
  chrome.storage.local.get(['startups'], (result) => {
    startups = result.startups || []
    updateStartupsList()
    updateStartupSelect()
  })
}

// Load settings from storage
function loadSettings() {
  chrome.storage.local.get(['apiKey', 'personalInfo'], (result) => {
    apiKey = result.apiKey || ''
    personalInfo = result.personalInfo || { name: '', email: '' }

    aiKeyInput.value = apiKey
    personalNameInput.value = personalInfo.name
    personalEmailInput.value = personalInfo.email
  })
}

// Set up event listeners
function setupEventListeners() {
  // Tab switching
  tabButtons.forEach((button) => {
    button.addEventListener('click', () => {
      tabButtons.forEach((btn) => btn.classList.remove('active'))
      tabPanes.forEach((pane) => pane.classList.remove('active'))

      button.classList.add('active')
      document
        .getElementById(button.getAttribute('data-tab'))
        .classList.add('active')
    })
  })

  // Add startup buttons
  addStartupBtn.addEventListener('click', openAddStartupModal)
  addNewStartupBtn.addEventListener('click', openAddStartupModal)

  // Modal controls
  closeModalBtn.addEventListener('click', closeModal)
  cancelBtn.addEventListener('click', closeModal)

  // Form submission
  startupForm.addEventListener('submit', handleStartupFormSubmit)

  // Fill form functionality
  startupSelect.addEventListener('change', () => {
    fillFormBtn.disabled = !startupSelect.value
  })
  fillFormBtn.addEventListener('click', handleFillForm)

  // Save settings
  saveSettingsBtn.addEventListener('click', handleSaveSettings)

  // Theme toggle handler
  themeToggleBtn.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme')
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark'
    setTheme(newTheme)
  })
}

// Update startups list in the UI
function updateStartupsList() {
  if (startups.length === 0) {
    emptyStartupsContainer.style.display = 'block'
    startupItemsContainer.style.display = 'none'
    return
  }

  emptyStartupsContainer.style.display = 'none'
  startupItemsContainer.style.display = 'block'

  startupItemsContainer.innerHTML = ''

  startups.forEach((startup, index) => {
    const item = document.createElement('div')
    item.classList.add('startup-item')
    item.dataset.index = index

    item.innerHTML = `
      <h3>${startup.name}</h3>
      <p>${startup.headline}</p>
      <div class="startup-actions">
        <button class="secondary-btn edit-btn" data-index="${index}">Edit</button>
        <button class="primary-btn delete-btn" data-index="${index}">Delete</button>
      </div>
    `

    startupItemsContainer.appendChild(item)

    // Add event listeners to the new buttons
    item.querySelector('.edit-btn').addEventListener('click', (e) => {
      e.stopPropagation()
      openEditStartupModal(parseInt(e.target.dataset.index))
    })

    item.querySelector('.delete-btn').addEventListener('click', (e) => {
      e.stopPropagation()
      deleteStartup(parseInt(e.target.dataset.index))
    })
  })
}

// Update startup select dropdown
function updateStartupSelect() {
  startupSelect.innerHTML = '<option value="">Select a startup</option>'

  startups.forEach((startup, index) => {
    const option = document.createElement('option')
    option.value = index
    option.textContent = startup.name
    startupSelect.appendChild(option)
  })

  // Auto-select first startup if available
  if (startups.length > 0) {
    startupSelect.value = '0'
    fillFormBtn.disabled = false
  } else {
    fillFormBtn.disabled = true
  }
}

// Open modal to add a new startup
function openAddStartupModal() {
  modalTitle.textContent = 'Add New Startup'
  startupForm.reset()
  currentStartup = null
  startupModal.style.display = 'block'
}

// Open modal to edit an existing startup
function openEditStartupModal(index) {
  modalTitle.textContent = 'Edit Startup'
  currentStartup = index

  const startup = startups[index]

  document.getElementById('startup-name').value = startup.name || ''
  document.getElementById('startup-url').value = startup.url || ''
  document.getElementById('startup-headline').value = startup.headline || ''
  document.getElementById('startup-short-description').value =
    startup.shortDescription || ''
  document.getElementById('startup-description').value =
    startup.description || ''
  document.getElementById('startup-features').value =
    featuresToText(startup.features) || ''
  document.getElementById('startup-tags').value = startup.tags || ''
  document.getElementById('startup-twitter').value =
    startup.socialMedia?.twitter || ''
  document.getElementById('startup-linkedin').value =
    startup.socialMedia?.linkedin || ''
  document.getElementById('startup-facebook').value =
    startup.socialMedia?.facebook || ''
  document.getElementById('startup-logo').value = startup.logo || ''
  document.getElementById('startup-screenshots').value =
    startup.screenshots?.join('\n') || ''

  startupModal.style.display = 'block'
}

// Close the modal
function closeModal() {
  startupModal.style.display = 'none'
}

// Format features text into an array
function formatFeatures(text) {
  if (!text) return []
  return text
    .split('\n')
    .map((line) => line.trim())
    .map((line) =>
      line.startsWith('-') || line.startsWith('•') ? line : `- ${line}`
    )
    .filter((line) => line.length > 1)
}

// Format features array back to text
function featuresToText(features) {
  if (!features || !features.length) return ''
  return features.join('\n')
}

// Handle startup form submission
function handleStartupFormSubmit(e) {
  e.preventDefault()

  const startup = {
    name: document.getElementById('startup-name').value,
    url: document.getElementById('startup-url').value,
    headline: document.getElementById('startup-headline').value,
    shortDescription: document.getElementById('startup-short-description')
      .value,
    description: document.getElementById('startup-description').value,
    features: formatFeatures(document.getElementById('startup-features').value),
    tags: document.getElementById('startup-tags').value,
    socialMedia: {
      twitter: document.getElementById('startup-twitter').value,
      linkedin: document.getElementById('startup-linkedin').value,
      facebook: document.getElementById('startup-facebook').value,
    },
    logo: document.getElementById('startup-logo').value,
    screenshots: document
      .getElementById('startup-screenshots')
      .value.split('\n')
      .filter((url) => url.trim() !== ''),
  }

  if (currentStartup !== null) {
    // Edit existing
    startups[currentStartup] = startup
  } else {
    // Add new
    startups.push(startup)
  }

  // Save to storage
  chrome.storage.local.set({ startups }, () => {
    updateStartupsList()
    updateStartupSelect()
    closeModal()
  })
}

// Delete a startup
function deleteStartup(index) {
  if (confirm('Are you sure you want to delete this startup?')) {
    startups.splice(index, 1)

    chrome.storage.local.set({ startups }, () => {
      updateStartupsList()
      updateStartupSelect()
    })
  }
}

// Handle fill form button click
function handleFillForm() {
  const startupIndex = parseInt(startupSelect.value)

  if (isNaN(startupIndex)) {
    showStatus(fillStatus, 'Please select a startup', 'error')
    return
  }

  showStatus(fillStatus, 'Attempting to fill form...', 'info')

  // Send message to content script
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(
      tabs[0].id,
      {
        action: 'fillForm',
        startup: startups[startupIndex],
        apiKey,
      },
      (response) => {
        if (chrome.runtime.lastError) {
          showStatus(
            fillStatus,
            'Error: Could not connect to page. Please refresh and try again.',
            'error'
          )
        } else if (response && response.success) {
          showStatus(fillStatus, 'Form filled successfully!', 'success')
        } else {
          showStatus(
            fillStatus,
            response?.message || 'Failed to fill form',
            'error'
          )
        }
      }
    )
  })
}

// Handle save settings button click
function handleSaveSettings() {
  apiKey = aiKeyInput.value.trim()
  personalInfo = {
    name: personalNameInput.value.trim(),
    email: personalEmailInput.value.trim(),
  }

  chrome.storage.local.set({ apiKey, personalInfo }, () => {
    showStatus(settingsStatus, 'Settings saved successfully!', 'success')
  })
}

// Show status message
function showStatus(element, message, type) {
  element.textContent = message
  element.className = 'status ' + type

  setTimeout(() => {
    element.textContent = ''
    element.className = 'status'
  }, 3000)
}
