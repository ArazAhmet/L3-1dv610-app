const form = document.getElementById('analyzeForm')
const loadingSection = document.getElementById('loadingSection')
const resultsSection = document.getElementById('resultsSection')
const errorSection = document.getElementById('errorSection')
const errorMessage = document.getElementById('errorMessage')
const totalSize = document.getElementById('totalSize')
const languageList = document.getElementById('languageList')

form.addEventListener('submit', async (e) => {
  e.preventDefault()

  const repoUrl = document.getElementById('repoUrl').value

  resultsSection.hidden = true
  errorSection.hidden = true
  loadingSection.hidden = false

  try {
    const response = await fetch('http://localhost:3000/api/analyze', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ repoUrl })
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || 'Något gick fel')
    }

    displayResults(data.data)

  } catch (error) {
    showError(error.message)
  } finally {
    loadingSection.hidden = true
  }
})

function displayResults(data) {
  resultsSection.hidden = false

  if (data.totalSize !== undefined) {
    totalSize.textContent = `Total storlek: ${formatBytes(data.totalSize)}`
  }

  if (data.languages && data.languages.length > 0) {
    languageList.innerHTML = ''

    data.languages.forEach(lang => {
      const langItem = document.createElement('div')
      langItem.className = 'language-item'

      const percentage = ((lang.bytes / data.totalSize) * 100).toFixed(2)

      langItem.innerHTML = `
        <div class="language-header">
          <span class="language-name">${lang.language}</span>
          <span class="language-percentage">${percentage}%</span>
        </div>
        <div class="language-bar">
          <div class="language-bar-fill" style="width: ${percentage}%"></div>
        </div>
        <div class="language-stats">
          <span>${formatBytes(lang.bytes)}</span>
          <span>${lang.lines.toLocaleString()} rader</span>
        </div>
      `

      languageList.appendChild(langItem)
    })
  }
}

function showError(message) {
  errorSection.hidden = false
  errorMessage.textContent = message
}

function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes'

  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
}