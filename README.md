# 🤖 AI Web Agent

An intelligent AI agent that analyzes web projects and generates contextual prompts for AI assistance. Perfect for developers who want to get better, more contextual help from AI tools like Cursor, GitHub Copilot, or ChatGPT.

## ✨ Features

- **🔍 Smart Codebase Analysis**: Automatically detects frameworks, technologies, and project structure
- **📝 Contextual Prompt Generation**: Creates detailed prompts based on your project's specific tech stack
- **🎯 Specialized Templates**: Generate prompts for specific tasks (features, bugfixes, optimization, etc.)
- **📊 Technology Detection**: Supports React, Vue, Angular, Next.js, Nuxt.js, and more
- **⚡ Quick Analysis**: Get instant insights about your project structure
- **🛠️ Configurable**: Customize analysis settings and output formats

## 🚀 Quick Start

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/ai-web-agent.git
cd ai-web-agent

# Install dependencies (if any)
npm install

# Make it executable
chmod +x index.js
```

### Basic Usage

```bash
# Analyze a project and generate a prompt
node index.js ./my-react-app "Add a contact form"

# Quick analysis only
node index.js ./my-project --quick

# Generate specialized prompt for feature development
node index.js ./my-app --specialized feature "Add user authentication"

# Use a specific template
node index.js ./my-app "Fix mobile menu" --template custom
```

## 📖 Usage Examples

### 1. Basic Analysis & Prompt Generation

```bash
node index.js ./my-react-app "Add a shopping cart feature"
```

This will:
- Analyze your React project structure
- Detect dependencies and technologies
- Generate a contextual prompt for adding a shopping cart
- Save the prompt to `output/ai-prompt-[timestamp].md`

### 2. Specialized Prompts

```bash
# Feature development
node index.js ./my-app --specialized feature "Add dark mode toggle"

# Bug fixing
node index.js ./my-app --specialized bugfix "Fix mobile menu not working"

# Performance optimization
node index.js ./my-app --specialized optimization "Improve page load speed"

# Code refactoring
node index.js ./my-app --specialized refactor "Clean up component structure"
```

### 3. Quick Analysis

```bash
node index.js ./my-project --quick
```

Output:
```
📊 Analysis Summary:
- Project: my-project
- Files: 45
- Framework: React
- Language: TypeScript
- Has React: Yes
- Has TypeScript: Yes
```

## 🏗️ Project Structure

```
ai-web-agent/
├── src/
│   ├── analyzer.js          # Codebase analysis
│   ├── promptGenerator.js   # Prompt creation
│   ├── templates/           # Prompt templates
│   │   └── default.md
│   └── utils/               # Helper functions
│       └── fileUtils.js
├── config/
│   └── settings.json        # Configuration
├── output/                  # Generated prompts
├── index.js                 # Main entry point
├── package.json
└── README.md
```
## ⚙️ Configuration

The agent uses `config/settings.json` for configuration. Key settings include:

```json
{
  "analysis": {
    "ignorePatterns": ["node_modules", ".git", "dist"],
    "maxFileSize": 1048576
  },
  "prompts": {
    "outputDirectory": "output",
    "includeFileContents": false
  }
}
```

## 🎯 Supported Technologies

### Frameworks
- **React** (with JSX/TSX detection)
- **Vue.js** (with .vue files)
- **Angular** (with TypeScript detection)
- **Next.js** (with Next.js specific patterns)
- **Nuxt.js** (with Nuxt.js specific patterns)
- **Express.js** (for backend projects)

### Styling
- **Tailwind CSS**
- **Styled Components**
- **Emotion**
- **CSS/SCSS/Less**

### Bundlers
- **Vite**
- **Webpack**
- **Parcel**

### Testing
- **Jest**
- **Vitest**
- **Cypress**
- **Testing Library**

## 📝 Custom Templates

Create custom templates in `src/templates/`:

```markdown
# Custom Template

## Project Info
- Name: {{projectName}}
- Framework: {{technology.framework}}

## Your Request
{{userQuestion}}

## Guidelines
[Your custom instructions here]
```

Use custom templates:
```bash
node index.js ./my-app "Add feature" --template custom
```

## 🔧 API Usage

You can also use the AI Web Agent programmatically:

```javascript
const AIWebAgent = require('./index.js');

const agent = new AIWebAgent();

// Analyze and generate prompt
const results = await agent.analyzeAndGeneratePrompt(
  './my-project',
  'Add a new component',
  { templateType: 'feature' }
);

console.log(results.prompt);
console.log(results.savedPath);
```

## 📊 Output Format

Generated prompts include:

- **Project Overview**: Technology stack, file counts, dependencies
- **File Structure**: Important files, components, pages, API routes
- **Technology Detection**: Framework, language, styling, bundler, testing
- **Contextual Instructions**: Tailored guidance based on your tech stack
- **User Request**: Your specific question or task

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built for developers who want better AI assistance
- Inspired by the need for more contextual code analysis
- Designed to work with modern AI coding assistants

## 🐛 Issues & Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/yourusername/ai-web-agent/issues) page
2. Create a new issue with detailed information
3. Include your project structure and the command you ran

---

**Happy coding with AI! 🚀** 



node index.js ./your-project-path "Your question or feature request"