// promptGenerator.js - Generate AI prompts from codebase analysis

const fs = require('fs');
const path = require('path');

class PromptGenerator {
  constructor() {
    this.templates = this.loadTemplates();
  }

  /**
   * Load prompt templates from the templates directory
   * @returns {Object} Loaded templates
   */
  loadTemplates() {
    const templatesDir = path.join(__dirname, 'templates');
    const templates = {};

    try {
      const templateFiles = fs.readdirSync(templatesDir);
      
      templateFiles.forEach(file => {
        if (file.endsWith('.md')) {
          const templateName = path.basename(file, '.md');
          const templatePath = path.join(templatesDir, file);
          templates[templateName] = fs.readFileSync(templatePath, 'utf8');
        }
      });
    } catch (error) {
      console.log('⚠️ No templates found, using default templates');
    }

    return templates;
  }

  /**
   * Generate a comprehensive prompt for AI assistance
   * @param {Object} analysis - Codebase analysis results
   * @param {string} userQuestion - User's specific question or request
   * @param {string} templateType - Type of template to use
   * @returns {string} Generated prompt
   */
  generatePrompt(analysis, userQuestion = '', templateType = 'default') {
    const template = this.templates[templateType] || this.getDefaultTemplate();
    
    return this.populateTemplate(template, analysis, userQuestion);
  }

  /**
   * Get the default template if no custom templates are available
   * @returns {string} Default template
   */
  getDefaultTemplate() {
    return `# 🤖 AI CODEBASE ANALYSIS

## 📊 PROJECT OVERVIEW
- **Project Name**: {{projectName}}
- **Total Files**: {{totalFiles}}
- **Main Framework**: {{technology.framework}}
- **Language**: {{technology.language}}
- **Styling**: {{technology.styling}}
- **Bundler**: {{technology.bundler}}
- **Testing**: {{technology.testing}}

## 🏗️ TECHNOLOGY STACK
- **TypeScript**: {{technology.hasTypeScript ? 'Yes' : 'No'}}
- **React**: {{technology.hasReact ? 'Yes' : 'No'}}
- **Vue**: {{technology.hasVue ? 'Yes' : 'No'}}
- **Angular**: {{technology.hasAngular ? 'Yes' : 'No'}}

## 📁 PROJECT STRUCTURE
- **Has src/ folder**: {{structure.hasSrcFolder ? 'Yes' : 'No'}}
- **Has public/ folder**: {{structure.hasPublicFolder ? 'Yes' : 'No'}}
- **Has components/ folder**: {{structure.hasComponentsFolder ? 'Yes' : 'No'}}
- **Has pages/ folder**: {{structure.hasPagesFolder ? 'Yes' : 'No'}}
- **Has api/ folder**: {{structure.hasApiFolder ? 'Yes' : 'No'}}

## 📂 FILE BREAKDOWN
- **JavaScript Files**: {{fileTypes.javascript.length}}
- **TypeScript Files**: {{fileTypes.typescript.length}}
- **React Components**: {{fileTypes.react.length}}
- **Vue Components**: {{fileTypes.vue.length}}
- **Style Files**: {{fileTypes.styles.length}}
- **HTML Files**: {{fileTypes.html.length}}
- **Images**: {{fileTypes.images.length}}
- **Config Files**: {{fileTypes.config.length}}
- **Documentation**: {{fileTypes.documentation.length}}
- **Tests**: {{fileTypes.tests.length}}

## 🔑 IMPORTANT FILES
**Entry Points**: {{importantFiles.entryPoints.join(', ') || 'None found'}}
**Components**: {{importantFiles.components.slice(0, 10).join(', ') || 'None found'}}
**Pages**: {{importantFiles.pages.slice(0, 10).join(', ') || 'None found'}}
**API Files**: {{importantFiles.api.slice(0, 10).join(', ') || 'None found'}}
**Config Files**: {{importantFiles.config.join(', ') || 'None found'}}

## 📦 DEPENDENCIES
**Main Dependencies**: {{Object.keys(dependencies.dependencies).slice(0, 10).join(', ') || 'None'}}
**Dev Dependencies**: {{Object.keys(dependencies.devDependencies).slice(0, 10).join(', ') || 'None'}}

## 💡 USER REQUEST
{{userQuestion || '[Please specify what you need help with]'}}

## 🎯 WHAT I NEED HELP WITH
Please analyze the codebase structure above and help me with the requested task. Consider the technology stack and project structure when providing solutions.

**Examples of what you can help with:**
- Adding new features or components
- Fixing bugs or issues
- Optimizing performance
- Improving code structure
- Adding tests
- Setting up new tools or libraries
- Code refactoring
- Documentation improvements
`;
  }

  /**
   * Populate template with analysis data
   * @param {string} template - Template string
   * @param {Object} analysis - Analysis data
   * @param {string} userQuestion - User's question
   * @returns {string} Populated template
   */
  populateTemplate(template, analysis, userQuestion) {
    let populatedTemplate = template;

    // Replace basic placeholders
    populatedTemplate = populatedTemplate.replace(/\{\{projectName\}\}/g, analysis.projectName || 'Unknown');
    populatedTemplate = populatedTemplate.replace(/\{\{totalFiles\}\}/g, analysis.totalFiles || 0);
    populatedTemplate = populatedTemplate.replace(/\{\{userQuestion\}\}/g, userQuestion || '');

    // Replace technology placeholders
    if (analysis.technology) {
      populatedTemplate = populatedTemplate.replace(/\{\{technology\.framework\}\}/g, analysis.technology.framework || 'Unknown');
      populatedTemplate = populatedTemplate.replace(/\{\{technology\.language\}\}/g, analysis.technology.language || 'Unknown');
      populatedTemplate = populatedTemplate.replace(/\{\{technology\.styling\}\}/g, analysis.technology.styling || 'Unknown');
      populatedTemplate = populatedTemplate.replace(/\{\{technology\.bundler\}\}/g, analysis.technology.bundler || 'Unknown');
      populatedTemplate = populatedTemplate.replace(/\{\{technology\.testing\}\}/g, analysis.technology.testing || 'Unknown');
      populatedTemplate = populatedTemplate.replace(/\{\{technology\.hasTypeScript\}\}/g, analysis.technology.hasTypeScript ? 'Yes' : 'No');
      populatedTemplate = populatedTemplate.replace(/\{\{technology\.hasReact\}\}/g, analysis.technology.hasReact ? 'Yes' : 'No');
      populatedTemplate = populatedTemplate.replace(/\{\{technology\.hasVue\}\}/g, analysis.technology.hasVue ? 'Yes' : 'No');
      populatedTemplate = populatedTemplate.replace(/\{\{technology\.hasAngular\}\}/g, analysis.technology.hasAngular ? 'Yes' : 'No');
    }

    // Replace structure placeholders
    if (analysis.structure) {
      populatedTemplate = populatedTemplate.replace(/\{\{structure\.hasSrcFolder\}\}/g, analysis.structure.hasSrcFolder ? 'Yes' : 'No');
      populatedTemplate = populatedTemplate.replace(/\{\{structure\.hasPublicFolder\}\}/g, analysis.structure.hasPublicFolder ? 'Yes' : 'No');
      populatedTemplate = populatedTemplate.replace(/\{\{structure\.hasComponentsFolder\}\}/g, analysis.structure.hasComponentsFolder ? 'Yes' : 'No');
      populatedTemplate = populatedTemplate.replace(/\{\{structure\.hasPagesFolder\}\}/g, analysis.structure.hasPagesFolder ? 'Yes' : 'No');
      populatedTemplate = populatedTemplate.replace(/\{\{structure\.hasApiFolder\}\}/g, analysis.structure.hasApiFolder ? 'Yes' : 'No');
    }

    // Replace file types placeholders
    if (analysis.fileTypes) {
      Object.keys(analysis.fileTypes).forEach(type => {
        const placeholder = `{{fileTypes.${type}.length}}`;
        const value = analysis.fileTypes[type] ? analysis.fileTypes[type].length : 0;
        populatedTemplate = populatedTemplate.replace(new RegExp(placeholder, 'g'), value);
      });
    }

    // Replace important files placeholders
    if (analysis.importantFiles) {
      Object.keys(analysis.importantFiles).forEach(category => {
        const placeholder = `{{importantFiles.${category}}}`;
        const files = analysis.importantFiles[category] || [];
        const fileNames = files.map(file => path.basename(file));
        populatedTemplate = populatedTemplate.replace(new RegExp(placeholder, 'g'), fileNames.join(', ') || 'None found');
      });
    }

    // Replace dependencies placeholders
    if (analysis.dependencies) {
      const deps = analysis.dependencies.dependencies || {};
      const devDeps = analysis.dependencies.devDependencies || {};
      populatedTemplate = populatedTemplate.replace(/\{\{Object\.keys\(dependencies\.dependencies\)\.slice\(0, 10\)\.join\('', ''\) \|\| 'None'\}\}/g, Object.keys(deps).slice(0, 10).join(', ') || 'None');
      populatedTemplate = populatedTemplate.replace(/\{\{Object\.keys\(dependencies\.devDependencies\)\.slice\(0, 10\)\.join\('', ''\) \|\| 'None'\}\}/g, Object.keys(devDeps).slice(0, 10).join(', ') || 'None');
    }

    return populatedTemplate;
  }

  /**
   * Generate a specialized prompt for specific tasks
   * @param {Object} analysis - Codebase analysis
   * @param {string} taskType - Type of task (feature, bugfix, optimization, etc.)
   * @param {string} description - Task description
   * @returns {string} Specialized prompt
   */
  generateSpecializedPrompt(analysis, taskType, description) {
    const basePrompt = this.generatePrompt(analysis, description);
    
    const taskSpecificInstructions = {
      feature: `
## 🚀 FEATURE DEVELOPMENT INSTRUCTIONS
- Consider the existing component structure and patterns
- Follow the established coding conventions
- Ensure compatibility with the current technology stack
- Add appropriate tests if testing framework is available
- Update documentation if needed
`,
      bugfix: `
## 🐛 BUG FIXING INSTRUCTIONS
- Analyze the error or issue carefully
- Check for similar patterns in existing code
- Ensure the fix doesn't break existing functionality
- Consider edge cases and error handling
- Test the fix thoroughly
`,
      optimization: `
## ⚡ OPTIMIZATION INSTRUCTIONS
- Focus on performance bottlenecks
- Consider bundle size and loading times
- Look for code duplication and refactoring opportunities
- Optimize for the detected bundler and framework
- Maintain code readability and maintainability
`,
      refactor: `
## 🔧 REFACTORING INSTRUCTIONS
- Maintain existing functionality
- Improve code structure and organization
- Follow best practices for the technology stack
- Ensure backward compatibility
- Update related documentation
`
    };

    const instructions = taskSpecificInstructions[taskType] || '';
    return basePrompt + instructions;
  }

  /**
   * Save generated prompt to file
   * @param {string} prompt - Generated prompt
   * @param {string} outputPath - Output directory
   * @returns {string} Path to saved file
   */
  savePrompt(prompt, outputPath = 'output') {
    const timestamp = Date.now();
    const filename = `ai-prompt-${timestamp}.md`;
    const filepath = path.join(outputPath, filename);

    try {
      if (!fs.existsSync(outputPath)) {
        fs.mkdirSync(outputPath, { recursive: true });
      }
      
      fs.writeFileSync(filepath, prompt);
      console.log(`✅ Prompt saved to: ${filepath}`);
      return filepath;
    } catch (error) {
      console.error(`❌ Error saving prompt: ${error.message}`);
      return null;
    }
  }
}

module.exports = PromptGenerator; 