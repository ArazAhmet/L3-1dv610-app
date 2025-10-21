# Reflection - Clean Code Chapters 2-11

## Chapter 2: Meaningful Names

I have tried to pick good names in my code. Function names like `analyzeRepository`, `prepareRepository`, and `displayResults` tell you what they do. Variable names like `totalSize`, `languageList`, and `repoUrl` are easy to understand. But I found a problem - sometimes good
names are long. For example, `executeCommand` is clear but `exec` is shorter. I picked the longer name because it's easier to understand, even if it takes more time to type.

**Code Example from [codeMetric.js:13-31](../node_modules/code-metric-analyzer/codeMetric.js#L13-L31):**

```javascript
export async function analyzeRepository(repositoryUrl = DEFAULT_REPO, options = {}) {
  try {
    logAnalysisStart(repositoryUrl)

    const repoPath = await prepareRepository(repositoryUrl)

    const result = await performAnalysis(repositoryUrl, repoPath)

    await cleanupIfNeeded(options)

    logAnalysisComplete()

    return result
  } catch (error) {
    handleAnalysisError(error)
    throw error
  }
}
```

These function names show what they do without needing comments.

---

## Chapter 3: Functions

My functions follow the **Do One Thing** principle. Functions like `logAnalysisStart`, `prepareRepository`, and `cleanupIfNeeded` each do just one thing. I broke down big functions into smaller ones, which makes the code easier to read. One problem I found is that sometimes
I create small functions that only get called once. This might seem like too much, but it makes the code clearer.

**Code Example from [codeMetric.js:38-52](../node_modules/code-metric-analyzer/codeMetric.js#L38-L52):**

```javascript
function logAnalysisStart(url) {
  console.log("Starting Language Analyzer...")
  console.log(`Repository: ${url}`)
}

async function prepareRepository(url) {
  await cloneRepository(url)
  return findRepositoryPath()
}

async function performAnalysis(url, repoPath) {
  displayHeader(url)
  return await analyzeLanguageDistribution(repoPath)
}

async function cleanupIfNeeded(options) {
  if (!options.keepFiles) {
    await removeDirectory(CLONE_DIR)
  }
}
```

Each function does ONE thing. This makes `analyzeRepository` read like a story.

---

## Chapter 4: Comments

My code has no comments at all because I tried to make the code explain itself. Instead of writing comments about what the code does, I used clear names for functions and variables. For example, `formatBytes` needs no comment - the name tells you what it does. This follows
the book's idea that good code doesn't need comments. But sometimes I wonder: can code always explain itself? For example, the constant `MB = 1024 ** 2` might be clearer with a comment explaining why we use 1024.

**Code Example from [app.js:42-75](../public/app.js#L42-L75):**

```javascript
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
```

This function needs no comments. The code explains itself with clear names like `formatBytes`, `percentage`, and `languageList`.

---

## Chapter 5: Formatting

I keep the same formatting style in all my code. I use the same indentation and spacing everywhere. Functions that belong together are placed near each other - for example, all directory functions (`createDirectory`, `removeDirectory`, `buildRemoveCommand`) are in the same
area. I keep lines short (under 100
characters) so they are easy to read. Sometimes I need to choose between adding space to make concepts clear and keeping files short.

**Code Example from [codeMetric.js:123-159](../node_modules/code-metric-analyzer/codeMetric.js#L123-L159):**

```javascript
async function createDirectory(dirPath) {
  try {
    const cmd = buildMkdirCommand(dirPath)
    await executeCommand(cmd)
  } catch {
    createDirectoryFallback(dirPath)
  }
}

function buildMkdirCommand(dirPath) {
  return isWindows ? `mkdir "${dirPath}"` : `mkdir -p ${dirPath}`
}

function createDirectoryFallback(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true })
}

export async function removeDirectory(dirPath) {
  if (!fs.existsSync(dirPath)) {
    return
  }

  try {
    const cmd = buildRemoveCommand(dirPath)
    await executeCommand(cmd)
  } catch {
    removeDirectoryFallback(dirPath)
  }
}

function buildRemoveCommand(dirPath) {
  return isWindows ? `rmdir /s /q "${dirPath}"` : `rm -rf ${dirPath}`
}

function removeDirectoryFallback(dirPath) {
  fs.rmSync(dirPath, { recursive: true, force: true })
}
```

Functions that work together are grouped together. Blank lines separate different ideas. This makes the code easy to follow.

---

## Chapter 6: Objects and Data Structures

In my code, I can see the difference between objects and data structures. Functions like `formatResultData` return simple data `{ totalSize, languages }` without any behavior. The module itself has behavior but hides how it works inside. This follows the book's
**Data/Object Anti-Symmetry**. But sometimes I mix these ideas when I use objects that both hold data and do things. It might be better to keep data and behavior more separate.

**Code Example from [languageAnalyzer.js:88-117](../node_modules/code-metric-analyzer/languageAnalyzer.js#L88-L117):**

```javascript
function formatResultData(languageSizes, allFiles) {
  const totalSizeInMB = Object.values(languageSizes).reduce((sum, size) => sum + size, 0)
  const totalSizeInBytes = totalSizeInMB * MB

  const languages = Object.entries(languageSizes)
    .map(([lang, sizeMB]) => {
      const sizeBytes = sizeMB * MB
      const files = allFiles.filter(f => getFileExtension(f) === lang)
      const totalLines = files.reduce((sum, file) => {
        try {
          const content = fs.readFileSync(file, 'utf-8')
          return sum + content.split('\n').length
        } catch {
          return sum
        }
      }, 0)

      return {
        language: lang,
        bytes: Math.round(sizeBytes),
        lines: totalLines
      }
    })
    .sort((a, b) => b.bytes - a.bytes)

  return {
    totalSize: Math.round(totalSizeInBytes),
    languages
  }
}
```

This function returns simple data without any methods. It just gives you `totalSize` and a `languages` array.

---

## Chapter 7: Error Handling

I use **exceptions** (not error codes) to handle errors. In the server, I use try-catch to catch errors and send back clear error messages. The function `handleAnalysisError` gives helpful information when Git commands fail. One weakness is that I catch all errors the same
way (`catch (error)`). This makes debugging harder sometimes, but it keeps the code simpler.

**Code Example from [server.js:17-35](../server.js#L17-L35):**

```javascript
app.post('/api/analyze', async (req, res) => {
  try {
    const { repoUrl } = req.body

    if (!repoUrl) {
      return res.status(400).json({ error: 'Repository URL krävs' })
    }

    console.log(`Analyserar repository: ${repoUrl}`)

    const result = await analyzeRepository(repoUrl)

    console.log('Analys klar!')
    res.json({ success: true, data: result })
  } catch (error) {
    console.error('Fel vid analys:', error)
    res.status(500).json({ error: error.message || 'Något gick fel vid analysen' })
  }
})
```

I use try-catch to handle errors. I give clear error messages and write errors to the log for debugging.

---

## Chapter 8: Boundaries

I handle **Third-Party Code** by keeping external libraries in one place. The library `node-recursive-directory` is only used in one function: `analyzeLanguageDistribution`. This makes it easy to change the library later if needed. The package `code-metric-analyzer` creates
a clean wall between my L2 and L3 code. But I could do better - I use Express directly in server.js, which ties my code to Express more than it should.

**Code Example from [server.js:1-5](../server.js#L1-L5):**

```javascript
import express from 'express'
import cors from 'cors'
import path from 'path'
import { fileURLToPath } from 'url'
import { analyzeRepository } from 'code-metric-analyzer'
```

I only import `analyzeRepository` from the package. This creates a clear wall - the rest of my app doesn't need to know how the analysis works.

---

## Chapter 9: Unit Tests

This is my biggest problem - **I have no unit tests**. This is something I need to fix. The book talks about F.I.R.S.T principles (Fast, Independent, Repeatable, Self-Validating, Timely). Tests would have helped me find bugs earlier. Functions like `formatBytes` and
`calculateLanguageSizes` would be easy to test. The problem is time - writing tests takes time at first but saves time later. I should have used TDD from the start.

**Reflection:**

I have no tests in this project, which is bad. Functions like `formatBytes`, `calculateLanguageSizes`, and `loadSupportedLanguages` are easy to test. Not having tests makes changing code risky. For example, if I want to change how `formatBytes` works, I have no way to make
sure I didn't break something.

---

## Chapter 10: Classes

I don't use classes in my JavaScript code, but I still follow the **Single Responsibility Principle** in my files. The file `languageAnalyzer.js` only does language analysis. The file `codeMetric.js` only handles repository work. Each file has **high cohesion** - all the
functions work together toward the same goal. One thing I could improve is that my files have many small functions. This might seem messy, but it makes the code easier to read.

**Code Example from [languageAnalyzer.js](../node_modules/code-metric-analyzer/languageAnalyzer.js):**

```javascript
export async function analyzeLanguageDistribution(directoryPath) {
  try {
    console.log("\nAnalyzing programming languages...")

    const supportedLanguages = loadSupportedLanguages()
    const allFiles = await scanDirectory(directoryPath)
    const languageSizes = calculateLanguageSizes(allFiles, supportedLanguages)

    displayResults(languageSizes)

    return formatResultData(languageSizes, allFiles)

  } catch (error) {
    console.error(`Language analysis failed: ${error.message}`)
    throw error
  }
}
```

This file has one job: analyze language distribution. All functions (`loadSupportedLanguages`, `calculateLanguageSizes`, `formatResultData`) help with this job.

---

## Chapter 11: Systems

I have separated my system into three parts: frontend, backend, and analysis. The file server.js sets up Express, while the real work is done in other files. This follows **Separation of Concerns**. I use the NPM package `code-metric-analyzer` as an example of
**Dependency Injection** - the server imports the function it needs. One weakness is that I don't use a container to manage all these parts, which would help if the system gets bigger.

**Code Example from [server.js](../server.js):**

```javascript
const app = express()
const PORT = process.env.PORT || 3000

app.use(cors())
app.use(express.json())
app.use(express.static('public'))

app.post('/api/analyze', async (req, res) => {
  // ... routing logic
})

app.listen(PORT, () => {
  console.log(`Server körs på http://localhost:${PORT}`)
})
```

The code shows clear separation: Express setup (middleware), routing (API), and server start. The analysis work is in its own package.

---

## Summary

Working with Clean Code has made my code better. The biggest wins are **Meaningful Names** and **Small Functions** - they make the code much easier to read. The biggest problem is that I have no **Unit Tests**. One interesting conflict I found is between making many small
functions (good for reading) and not making too many (KISS principle). I have learned that code is not just for the computer - it's also for other developers to read.
