import express from 'express'
import cors from 'cors'
import path from 'path'
import { fileURLToPath } from 'url'
import { analyzeRepository } from './node_modules/code-metric-analyzer/codeMetric.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const PORT = process.env.PORT || 3000

app.use(cors())
app.use(express.json())
app.use(express.static('public'))

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

app.listen(PORT, () => {
  console.log(`Server körs på http://localhost:${PORT}`)
})