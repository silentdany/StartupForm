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

// Use OpenAI API to determine which fields to fill with which startup data
async function getAIMappings(formFields, startup, apiKey) {
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
  Only return a JSON object where the keys are the indices of the form fields and the values are the content to fill in.`

  const userPrompt = `
  Startup Information:
  - Name: ${startup.name}
  - URL: ${startup.url}
  - Headline/Tagline: ${startup.headline}
  - Description: ${startup.description}
  - Tags: ${startup.tags}
  - Twitter: ${startup.socialMedia.twitter}
  - LinkedIn: ${startup.socialMedia.linkedin}
  - Facebook: ${startup.socialMedia.facebook}
  - Logo URL: ${startup.logo}
  - Screenshots: ${JSON.stringify(startup.screenshots)}
  
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
        temperature: 0.2,
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

    // Convert string indices to numbers
    const result = {}
    for (const [key, value] of Object.entries(mappings)) {
      result[parseInt(key)] = value
    }

    return result
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
