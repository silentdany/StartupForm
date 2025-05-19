// Listen for messages from the popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'fillForm') {
    handleFormFill(message.startup, message.apiKey)
      .then((result) => sendResponse(result))
      .catch((error) =>
        sendResponse({ success: false, message: error.message })
      )

    // Return true to indicate we will send a response asynchronously
    return true
  }
})

// Handle form filling
async function handleFormFill(startup, apiKey) {
  try {
    if (!apiKey) {
      return {
        success: false,
        message: 'OpenAI API key is required. Please add it in the settings.',
      }
    }

    // Show the startup info panel
    showStartupInfoPanel(startup)

    // Get form fields on the page
    const formFields = analyzeFormFields()

    if (formFields.length === 0) {
      return {
        success: false,
        message: 'No form fields detected on this page.',
      }
    }

    // Use AI to determine which fields to fill with which data
    const aiMappings = await getAIMappings(formFields, startup, apiKey)

    // Fill the form fields based on AI mappings
    const filledFields = fillFormFields(aiMappings)

    return {
      success: true,
      message: `Successfully filled ${filledFields} fields.`,
    }
  } catch (error) {
    console.error('Error filling form:', error)
    return {
      success: false,
      message: `Error filling form: ${error.message}`,
    }
  }
}

// Analyze the form fields on the page
function analyzeFormFields() {
  // Get all input, textarea, and select elements
  const inputs = Array.from(
    document.querySelectorAll(
      'input:not([type="hidden"]):not([type="submit"]):not([type="button"]):not([type="reset"]):not([type="file"])'
    )
  )
  const textareas = Array.from(document.querySelectorAll('textarea'))
  const selects = Array.from(document.querySelectorAll('select'))

  const allFields = [...inputs, ...textareas, ...selects]

  // Extract information about each field
  const fields = allFields.map((field) => {
    const fieldObj = {
      element: field,
      id: field.id,
      name: field.name,
      type:
        field.tagName.toLowerCase() === 'input'
          ? field.type
          : field.tagName.toLowerCase(),
      placeholder: field.placeholder || '',
      label: getFieldLabel(field),
      value: field.value || '',
      options:
        field.tagName.toLowerCase() === 'select'
          ? Array.from(field.options).map((option) => option.textContent.trim())
          : [],
    }

    return fieldObj
  })

  return fields
}

// Get the label text for a field
function getFieldLabel(field) {
  // Try to find label by for attribute
  if (field.id) {
    const label = document.querySelector(`label[for="${field.id}"]`)
    if (label) return label.textContent.trim()
  }

  // Try to find label as parent
  let parentEl = field.parentElement
  while (parentEl && !['FORM', 'BODY'].includes(parentEl.tagName)) {
    if (parentEl.tagName === 'LABEL') {
      return parentEl.textContent.trim().replace(field.value, '').trim()
    }

    // Look for any text node siblings
    const siblings = Array.from(parentEl.childNodes)
    for (const sibling of siblings) {
      if (sibling.nodeType === Node.TEXT_NODE && sibling.textContent.trim()) {
        return sibling.textContent.trim()
      }
    }

    // Check for any heading or paragraph that could be a label
    const possibleLabels = parentEl.querySelectorAll(
      'h1, h2, h3, h4, h5, h6, p, span, div'
    )
    for (const possibleLabel of possibleLabels) {
      if (
        possibleLabel.textContent.trim() &&
        !possibleLabel.querySelector('input, textarea, select')
      ) {
        return possibleLabel.textContent.trim()
      }
    }

    parentEl = parentEl.parentElement
  }

  // If no label found, return empty string
  return ''
}

// Validate field content before filling
function validateFieldContent(fieldType, content) {
  if (!content) return false

  switch (fieldType) {
    case 'headline':
    case 'tagline':
    case 'title':
      // Headlines should be short and not contain newlines
      return content.length <= 120 && !content.includes('\n')
    case 'short_description':
      // Short descriptions should be concise
      return content.length <= 250 && !content.includes('\n')
    case 'description':
    case 'about':
    case 'bio':
      // Descriptions can be longer and have multiple lines
      return content.length > 0
    case 'features':
      // Features should be a list
      return Array.isArray(content) && content.length > 0
    case 'url':
    case 'website':
    case 'link':
      // URLs should look like URLs
      return content.startsWith('http') || content.startsWith('www.')
    case 'tags':
    case 'keywords':
      // Tags should be relatively short
      return content.length <= 200
    case 'name':
      // Names should be reasonable length
      return content.length > 0 && content.length <= 100
    case 'email':
      // Basic email validation
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(content)
    default:
      return true
  }
}

// Use OpenAI API to determine which fields to fill with which startup data
async function getAIMappings(formFields, startup, apiKey) {
  // Get personal info from storage
  const storage = await chrome.storage.local.get(['personalInfo'])
  const personalInfo = storage.personalInfo || { name: '', email: '' }

  const formFieldsInfo = formFields.map((field) => ({
    id: field.id,
    name: field.name,
    type: field.type,
    placeholder: field.placeholder,
    label: field.label,
    options: field.options,
  }))

  // Create a prompt for OpenAI
  const systemPrompt = `You are an AI assistant helping to automatically fill a form with startup information.
Given information about a startup and a list of form fields, determine which startup information should be filled into which form field.
Follow these strict rules:
1. Only match fields when you are highly confident about the match
2. Never put a full description in a headline/title/tagline field
3. Headlines/taglines must be short (max 120 chars) and single-line
4. Short descriptions must be concise (max 250 chars) and single-line
5. Use short description for fields marked as "brief", "short", or "summary"
6. Features should go into feature/benefit/capability fields
7. URLs must only go in URL/website fields
8. Match field types based on their characteristics:
   - headline/title/tagline: short, single-line text
   - short description: brief, single-line summary
   - description/about/bio: longer, multi-line text
   - features/benefits: bullet-pointed list
   - url/website/link: web addresses
   - tags/keywords: comma-separated list
   - name/full-name/contact-name: personal name
   - email/contact-email: email address
9. Only return a JSON object where the keys are the indices of the form fields and the values are the content to fill in.
10. If unsure about a match, do not include it in the response.`

  const userPrompt = `
Startup Information:
Name: ${startup.name}
URL: ${startup.url}
Headline/Tagline: ${startup.headline}
Short Description: ${startup.shortDescription}
Full Description: ${startup.description}
Features:
${startup.features?.map((f) => `${f}`).join('\n') || 'None provided'}
Tags: ${startup.tags}
Social Media:
- Twitter: ${startup.socialMedia.twitter}
- LinkedIn: ${startup.socialMedia.linkedin}
- Facebook: ${startup.socialMedia.facebook}
Logo URL: ${startup.logo}
Screenshots: ${JSON.stringify(startup.screenshots)}

Personal Information:
Contact Name: ${personalInfo.name}
Contact Email: ${personalInfo.email}

Form Fields (with index):
${formFieldsInfo
  .map(
    (field, index) =>
      `${index}: {
    id: "${field.id}",
    name: "${field.name}",
    type: "${field.type}",
    placeholder: "${field.placeholder}",
    label: "${field.label}",
    options: ${JSON.stringify(field.options)}
  }`
  )
  .join('\n')}

Return a JSON object mapping field indices to values. Only include fields you're confident about matching.
Example: { "0": "Startup Name", "3": "Description of the startup", ... }

Remember:
- Headlines/taglines must be short and single-line
- Short descriptions go in brief/summary fields
- Features go in feature/benefit/capability fields
- Never put full descriptions in headline or short description fields
- URLs only go in URL fields
- Personal name goes in name/contact fields
- Email goes in email/contact fields
- When in doubt, skip the field
`

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        temperature: 0.1, // Lower temperature for more conservative matching
        max_tokens: 1000,
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error?.message || 'Error from OpenAI API')
    }

    // Parse the response
    const content = data.choices[0].message.content

    // Extract JSON from the response
    let jsonMatches = content.match(/\{[\s\S]*\}/)
    if (!jsonMatches) {
      throw new Error('Could not parse AI response as JSON')
    }

    let mappings = JSON.parse(jsonMatches[0])

    // Validate and filter mappings
    const validatedMappings = {}
    for (const [index, value] of Object.entries(mappings)) {
      const fieldIndex = parseInt(index)
      const field = formFields[fieldIndex]

      // Determine field type from field properties
      let fieldType = 'text'
      const fieldProps = [
        field.id?.toLowerCase() || '',
        field.name?.toLowerCase() || '',
        field.label?.toLowerCase() || '',
        field.placeholder?.toLowerCase() || '',
      ]

      if (
        fieldProps.some(
          (prop) =>
            prop.includes('headline') ||
            prop.includes('tagline') ||
            prop.includes('title')
        )
      ) {
        fieldType = 'headline'
      } else if (
        fieldProps.some(
          (prop) =>
            (prop.includes('description') ||
              prop.includes('about') ||
              prop.includes('bio')) &&
            (prop.includes('short') ||
              prop.includes('brief') ||
              prop.includes('summary'))
        )
      ) {
        fieldType = 'short_description'
      } else if (
        fieldProps.some(
          (prop) =>
            prop.includes('description') ||
            prop.includes('about') ||
            prop.includes('bio')
        )
      ) {
        fieldType = 'description'
      } else if (
        fieldProps.some(
          (prop) =>
            prop.includes('url') ||
            prop.includes('website') ||
            prop.includes('link')
        )
      ) {
        fieldType = 'url'
      } else if (
        fieldProps.some(
          (prop) => prop.includes('tags') || prop.includes('keywords')
        )
      ) {
        fieldType = 'tags'
      } else if (
        fieldProps.some(
          (prop) =>
            prop.includes('name') ||
            (prop.includes('contact') && !prop.includes('email'))
        )
      ) {
        fieldType = 'name'
      } else if (
        fieldProps.some(
          (prop) => prop.includes('email') || prop.includes('contact-email')
        )
      ) {
        fieldType = 'email'
      } else if (
        fieldProps.some(
          (prop) =>
            prop.includes('features') ||
            prop.includes('benefits') ||
            prop.includes('capabilities') ||
            prop.includes('what-we-offer')
        )
      ) {
        fieldType = 'features'
      }

      // Only include if content is valid for the field type
      if (validateFieldContent(fieldType, value)) {
        validatedMappings[fieldIndex] = value
      }
    }

    return validatedMappings
  } catch (error) {
    console.error('Error with OpenAI API:', error)
    throw new Error(`AI mapping error: ${error.message}`)
  }
}

// Fill form fields based on the AI mappings
function fillFormFields(mappings) {
  const formFields = analyzeFormFields()
  let filledCount = 0

  for (const [index, value] of Object.entries(mappings)) {
    const field = formFields[index]
    if (!field || !field.element) continue

    const element = field.element

    // Fill field based on its type
    switch (element.tagName.toLowerCase()) {
      case 'input':
        switch (element.type.toLowerCase()) {
          case 'text':
          case 'url':
          case 'email':
          case 'tel':
          case 'password':
          case 'search':
          case 'number':
            element.value = value
            simulateInputEvent(element)
            filledCount++
            break

          case 'radio':
          case 'checkbox':
            if (
              (typeof value === 'boolean' && value) ||
              (typeof value === 'string' &&
                ['yes', 'true', 'on', '1'].includes(value.toLowerCase()))
            ) {
              element.checked = true
              simulateChangeEvent(element)
              filledCount++
            }
            break

          default:
            // Skip other input types
            break
        }
        break

      case 'textarea':
        element.value = value
        simulateInputEvent(element)
        filledCount++
        break

      case 'select':
        // Try to find an option that matches the value
        const options = Array.from(element.options)
        const lowerValue = value.toLowerCase()

        // Try exact match first, then partial match
        const exactMatch = options.find(
          (opt) => opt.textContent.toLowerCase() === lowerValue
        )
        if (exactMatch) {
          element.value = exactMatch.value
          simulateChangeEvent(element)
          filledCount++
        } else {
          const partialMatch = options.find(
            (opt) =>
              opt.textContent.toLowerCase().includes(lowerValue) ||
              lowerValue.includes(opt.textContent.toLowerCase())
          )
          if (partialMatch) {
            element.value = partialMatch.value
            simulateChangeEvent(element)
            filledCount++
          }
        }
        break
    }
  }

  return filledCount
}

// Simulate an input event
function simulateInputEvent(element) {
  const event = new Event('input', { bubbles: true })
  element.dispatchEvent(event)
}

// Simulate a change event
function simulateChangeEvent(element) {
  const event = new Event('change', { bubbles: true })
  element.dispatchEvent(event)
}

// Function to truncate text with ellipsis
function truncateText(text, maxLength) {
  if (text.length <= maxLength) return text
  return text.substr(0, maxLength).trim() + '...'
}

// Show startup information in a floating panel
function showStartupInfoPanel(startup) {
  // Remove existing panel if any
  const existingPanel = document.getElementById('startup-info-panel')
  if (existingPanel) {
    existingPanel.remove()
  }

  // Prepare description previews
  const maxPreviewLength = 100
  const isLongDescription = startup.description.length > maxPreviewLength
  const previewText = truncateText(startup.description, maxPreviewLength)

  // Create panel
  const panel = document.createElement('div')
  panel.id = 'startup-info-panel'
  panel.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    width: 300px;
    max-height: 80vh;
    overflow-y: auto;
    background: #131314;
    border: 1px solid #2a2a2b;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
    padding: 16px;
    font-family: -apple-system, system-ui, sans-serif;
    font-size: 14px;
    z-index: 999999;
    color: #e0e0e0;
  `

  // Add content
  panel.innerHTML = `
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
      <h3 style="margin: 0; color: #46A109; font-size: 16px;">Startup Information</h3>
      <button id="close-startup-panel" style="background: none; border: none; cursor: pointer; font-size: 18px; color: #e0e0e0;">&times;</button>
    </div>
    <div style="color: #e0e0e0;">
      <div class="copyable-field" data-value="${startup.name}" style="margin-bottom: 8px; cursor: pointer; padding: 4px; border-radius: 4px; transition: background-color 0.2s;">
        <strong>Name:</strong> ${startup.name}
      </div>
      <div class="copyable-field" data-value="${startup.url}" style="margin-bottom: 8px; cursor: pointer; padding: 4px; border-radius: 4px; transition: background-color 0.2s;">
        <strong>URL:</strong> <a href="${startup.url}" target="_blank" style="color: #46A109;">${startup.url}</a>
      </div>
      <div class="copyable-field" data-value="${startup.headline}" style="margin-bottom: 8px; cursor: pointer; padding: 4px; border-radius: 4px; transition: background-color 0.2s;">
        <strong>Headline:</strong> ${startup.headline}
      </div>
      <div class="copyable-field" data-value="${startup.shortDescription}" style="margin-bottom: 8px; cursor: pointer; padding: 4px; border-radius: 4px; transition: background-color 0.2s;">
        <strong>Short Description:</strong>
        <div style="margin-top: 4px; white-space: pre-wrap;">${startup.shortDescription}</div>
      </div>
      <div class="copyable-field description-field" data-value="${startup.description}" style="margin-bottom: 8px; cursor: pointer; padding: 4px; border-radius: 4px; transition: background-color 0.2s;">
        <div style="display: flex; justify-content: space-between; align-items: start;">
          <strong>Description:</strong>
          ${
            isLongDescription
              ? `
            <button class="toggle-description" style="background: none; border: none; color: #46A109; cursor: pointer; font-size: 12px; padding: 2px 4px;">
              Show More
            </button>
          `
              : ''
          }
        </div>
        <div class="description-content" style="margin-top: 4px; white-space: pre-wrap;">
          <span class="preview-text">${previewText}</span>
          <span class="full-text" style="display: none;">${startup.description}</span>
        </div>
      </div>
      ${
        startup.features && startup.features.length > 0
          ? `
      <div class="copyable-field features-field" data-value="${startup.features.join('\n')}" style="margin-bottom: 8px; cursor: pointer; padding: 4px; border-radius: 4px; transition: background-color 0.2s;">
        <div style="display: flex; justify-content: space-between; align-items: start;">
          <strong>Features:</strong>
          ${
            startup.features.length > 3
              ? `
            <button class="toggle-features" style="background: none; border: none; color: #46A109; cursor: pointer; font-size: 12px; padding: 2px 4px;">
              Show All (${startup.features.length})
            </button>
          `
              : ''
          }
        </div>
        <div class="features-content" style="margin-top: 4px;">
          <div class="preview-features">
            ${startup.features
              .slice(0, 3)
              .map(
                (feature) => `
              <div style="margin-bottom: 2px;">${feature}</div>
            `
              )
              .join('')}
            ${
              startup.features.length > 3
                ? `
              <div style="color: #9ca3af; font-size: 12px;">+ ${startup.features.length - 3} more</div>
            `
                : ''
            }
          </div>
          <div class="full-features" style="display: none;">
            ${startup.features
              .map(
                (feature) => `
              <div style="margin-bottom: 2px;">${feature}</div>
            `
              )
              .join('')}
          </div>
        </div>
      </div>
      `
          : ''
      }
      <div class="copyable-field" data-value="${startup.tags}" style="margin-bottom: 8px; cursor: pointer; padding: 4px; border-radius: 4px; transition: background-color 0.2s;">
        <strong>Tags:</strong> ${startup.tags}
      </div>
      <div style="margin-bottom: 8px;">
        <strong>Social Media:</strong>
        <div style="margin-left: 12px;">
          ${
            startup.socialMedia.twitter
              ? `
          <div class="copyable-field" data-value="${startup.socialMedia.twitter}" style="cursor: pointer; padding: 4px; border-radius: 4px; transition: background-color 0.2s;">
            Twitter: <a href="${startup.socialMedia.twitter}" target="_blank" style="color: #46A109;">Link</a>
          </div>`
              : ''
          }
          ${
            startup.socialMedia.linkedin
              ? `
          <div class="copyable-field" data-value="${startup.socialMedia.linkedin}" style="cursor: pointer; padding: 4px; border-radius: 4px; transition: background-color 0.2s;">
            LinkedIn: <a href="${startup.socialMedia.linkedin}" target="_blank" style="color: #46A109;">Link</a>
          </div>`
              : ''
          }
          ${
            startup.socialMedia.facebook
              ? `
          <div class="copyable-field" data-value="${startup.socialMedia.facebook}" style="cursor: pointer; padding: 4px; border-radius: 4px; transition: background-color 0.2s;">
            Facebook: <a href="${startup.socialMedia.facebook}" target="_blank" style="color: #46A109;">Link</a>
          </div>`
              : ''
          }
        </div>
      </div>
      ${
        startup.logo
          ? `
      <div class="copyable-field" data-value="${startup.logo}" style="margin-bottom: 8px; cursor: pointer; padding: 4px; border-radius: 4px; transition: background-color 0.2s;">
        <strong>Logo:</strong>
        <div style="margin-top: 4px; display: flex; align-items: center; gap: 8px;">
          <div class="image-preview" style="width: 48px; height: 48px; border-radius: 4px; border: 1px solid #2a2a2b; overflow: hidden; position: relative; background: #1a1a1b;">
            <img src="${startup.logo}" alt="Logo" style="width: 100%; height: 100%; object-fit: contain;" onerror="this.parentElement.innerHTML='<div style=\'width:100%;height:100%;display:flex;align-items:center;justify-content:center;color:#9ca3af;font-size:20px;\'>🖼️</div>'">
          </div>
          <a href="${startup.logo}" target="_blank" style="color: #46A109;">View Full Size</a>
        </div>
      </div>
      `
          : ''
      }
      ${
        startup.screenshots && startup.screenshots.length > 0
          ? `
      <div>
        <strong>Screenshots:</strong>
        <div style="margin-top: 8px; display: grid; grid-template-columns: repeat(auto-fill, minmax(80px, 1fr)); gap: 8px;">
          ${startup.screenshots
            .map(
              (url, i) => `
            <div class="copyable-field" data-value="${url}" style="cursor: pointer; padding: 4px; border-radius: 4px; transition: background-color 0.2s;">
              <div style="position: relative;">
                <div class="image-preview" style="width: 100%; aspect-ratio: 16/9; border-radius: 4px; border: 1px solid #2a2a2b; overflow: hidden; position: relative; background: #1a1a1b;">
                  <img src="${url}" alt="Screenshot ${i + 1}" style="width: 100%; height: 100%; object-fit: cover;" onerror="this.parentElement.innerHTML='<div style=\'width:100%;height:100%;display:flex;align-items:center;justify-content:center;color:#9ca3af;font-size:20px;\'>🖼️</div>'">
                </div>
                <a href="${url}" target="_blank" style="color: #46A109; font-size: 12px; margin-top: 4px; display: block; text-align: center;">View #${i + 1}</a>
              </div>
            </div>
          `
            )
            .join('')}
        </div>
      </div>
      `
          : ''
      }
    </div>
  `

  // Add to page
  document.body.appendChild(panel)

  // Add features toggle functionality
  const featuresField = panel.querySelector('.features-field')
  if (featuresField) {
    const toggleBtn = featuresField.querySelector('.toggle-features')
    const previewFeatures = featuresField.querySelector('.preview-features')
    const fullFeatures = featuresField.querySelector('.full-features')

    if (toggleBtn) {
      toggleBtn.addEventListener('click', (e) => {
        e.stopPropagation() // Prevent copying when clicking the toggle
        const isExpanded = toggleBtn.textContent.includes('Show Less')

        if (isExpanded) {
          previewFeatures.style.display = 'block'
          fullFeatures.style.display = 'none'
          toggleBtn.textContent = `Show All (${startup.features.length})`
        } else {
          previewFeatures.style.display = 'none'
          fullFeatures.style.display = 'block'
          toggleBtn.textContent = 'Show Less'
        }
      })
    }
  }

  // Add description toggle functionality
  const descriptionField = panel.querySelector('.description-field')
  if (descriptionField) {
    const toggleBtn = descriptionField.querySelector('.toggle-description')
    const previewText = descriptionField.querySelector('.preview-text')
    const fullText = descriptionField.querySelector('.full-text')

    if (toggleBtn) {
      toggleBtn.addEventListener('click', (e) => {
        e.stopPropagation() // Prevent copying when clicking the toggle
        const isExpanded = toggleBtn.textContent.trim() === 'Show Less'

        if (isExpanded) {
          previewText.style.display = 'inline'
          fullText.style.display = 'none'
          toggleBtn.textContent = 'Show More'
        } else {
          previewText.style.display = 'none'
          fullText.style.display = 'inline'
          toggleBtn.textContent = 'Show Less'
        }
      })
    }
  }

  // Add copy functionality
  panel.querySelectorAll('.copyable-field').forEach((field) => {
    field.addEventListener('click', async (e) => {
      // Don't trigger copy when clicking the toggle buttons or links
      if (
        e.target.classList.contains('toggle-description') ||
        e.target.classList.contains('toggle-features') ||
        e.target.tagName === 'A'
      )
        return

      const value = field.dataset.value
      try {
        await navigator.clipboard.writeText(value)

        // Visual feedback
        const originalBg = field.style.backgroundColor
        field.style.backgroundColor = '#1e3a17'

        // Create and show tooltip
        const tooltip = document.createElement('div')
        tooltip.textContent = 'Copied!'
        tooltip.style.cssText = `
          position: absolute;
          background: #46A109;
          color: white;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 12px;
          pointer-events: none;
          z-index: 1000000;
        `

        // Position tooltip near the cursor
        tooltip.style.left = `${e.clientX + 10}px`
        tooltip.style.top = `${e.clientY + 10}px`

        document.body.appendChild(tooltip)

        // Remove tooltip and reset background after delay
        setTimeout(() => {
          tooltip.remove()
          field.style.backgroundColor = originalBg
        }, 1000)
      } catch (err) {
        console.error('Failed to copy:', err)
      }
    })

    // Hover effect
    field.addEventListener('mouseenter', () => {
      field.style.backgroundColor = '#1e2e19'
    })
    field.addEventListener('mouseleave', () => {
      field.style.backgroundColor = 'transparent'
    })
  })

  // Add close button handler
  document
    .getElementById('close-startup-panel')
    .addEventListener('click', () => {
      panel.remove()
    })

  // Make panel draggable
  let isDragging = false
  let currentX
  let currentY
  let initialX
  let initialY
  let xOffset = 0
  let yOffset = 0

  const dragStart = (e) => {
    initialX = e.clientX - xOffset
    initialY = e.clientY - yOffset

    if (
      e.target.closest('#startup-info-panel') &&
      !e.target.closest('#close-startup-panel')
    ) {
      isDragging = true
    }
  }

  const dragEnd = () => {
    isDragging = false
  }

  const drag = (e) => {
    if (isDragging) {
      e.preventDefault()
      currentX = e.clientX - initialX
      currentY = e.clientY - initialY
      xOffset = currentX
      yOffset = currentY

      panel.style.transform = `translate(${currentX}px, ${currentY}px)`
    }
  }

  panel.addEventListener('mousedown', dragStart)
  document.addEventListener('mousemove', drag)
  document.addEventListener('mouseup', dragEnd)
}
