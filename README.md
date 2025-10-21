# Code Metric Analyzer Web App
A simple **web application** for analyzing programming language distribution in GitHub repositories. This app provides a user-friendly web interface where developers can enter any GitHub repository URL and instantly view language statistics with visual charts.

Built on top of the [code-metric-analyzer](https://github.com/ArazAhmet/L2-1dv610) library, this app makes repository analysis accessible through a clean web interface instead of requiring command-line usage.

## How to Use
Visit the live app on Render: **[https://l3-1dv610-app.onrender.com](https://l3-1dv610-app.onrender.com)**

1. Open the link in your browser
2. Enter a GitHub repository URL (example: `https://github.com/ArazAhmet/L3-1dv610-app.git`)
3. Click "Analyze"
4. View the results with visual charts

No installation needed!

## What It Does
The app analyzes any public GitHub repository and shows:
* Total repository size (in bytes, KB, or MB)
* Language breakdown with percentages
* Visual progress bars for each language
* Line count per language

## Features
* Clean and responsive web interface
* Real-time analysis results
* Visual language distribution charts
* Support for 10+ programming languages (js, jsx, ts, tsx, html, css, json, md, py, java)
* Works with any public GitHub repository

## Tech Stack
* **Backend:** Node.js with Express
* **Frontend:** JavaScript, HTML, CSS
* **Analysis:** code-metric-analyzer package

## API Endpoint
The app provides one REST API endpoint:

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/analyze` | POST | Analyze a GitHub repository |

Request body:
```json
{
  "repoUrl": "https://github.com/username/repository"
}
```

Response:
```json
{
  "success": true,
  "data": {
    "totalSize": 12345,
    "languages": [
      {
        "language": "js",
        "bytes": 8000,
        "lines": 250
      }
    ]
  }
}
```

## Supported Languages
js, jsx, ts, tsx, html, css, json, md, py, java

## Limitations
* Only works with public GitHub repositories
* Large repositories (>1GB) may take time
* Requires Git installed on system
* Analysis runs on server, not in browser

## Documentation
* `docs/reflection.md`: Reflections on Clean Code chapters 2-11

## Dependencies
* `express` (^5.1.0) - Web server framework
* `cors` (^2.8.5) - CORS middleware
* `code-metric-analyzer` - Repository analysis library

## License
MIT License

## Author
Araz Ahmet - [GitHub](https://github.com/ArazAhmet)