#!/usr/bin/env node

// index.js - Main entry point for AI Web Agent

const path = require('path');
const fs = require('fs');
const CodebaseAnalyzer = require('./src/analyzer');
const PromptGenerator = require('./src/promptGenerator');

class AIWebAgent {
  constructor() {
    this.analyzer = new CodebaseAnalyzer();
    this.promptGenerator = new PromptGenerator();
    this.config = this.loadConfig();
  }

  /**
   * Load configuration from settings file
   * @returns {Object} Configuration object
   */
  loadConfig() {
    try {
      const configPath = path.join(__dirname, 'config', 'settings.json');
      return JSON.parse(fs.readFileSync(configPath, 'utf8'));
    } catch (error) {
      console.log('⚠️ Using default configuration');
      return {
        analysis: { ignorePatterns: ['node_modules', '.git', 'dist'] },
        prompts: { outputDirectory: 'output' },
        output: { includeTimestamp: true }
      };
    }
  }

  /**
   * Main function to analyze a project and generate AI prompts
   * @param {string} projectPath - Path to the project to analyze
   * @param {string} userQuestion - User's question or request
   * @param {Object} options - Additional options
   * @returns {Object} Analysis and prompt results
   */
  async analyzeAndGeneratePrompt(projectPath, userQuestion = '', options = {}) {
    console.log('🚀 AI Web Agent Starting...\n');

    try {
      // Validate project path
      if (!fs.existsSync(projectPath)) {
        throw new Error(`Project path does not exist: ${projectPath}`);
      }

      // Analyze the codebase
      console.log('🔍 Analyzing codebase...');
      const analysis = this.analyzer.analyzeCodebase(projectPath);
      
      console.log(`✅ Analysis complete! Found ${analysis.totalFiles} files`);
      console.log(`📊 Main technology: ${analysis.technology.framework}`);

      // Generate prompt
      console.log('📝 Generating AI prompt...');
      const prompt = this.promptGenerator.generatePrompt(analysis, userQuestion, options.templateType);

      // Save prompt to file
      const outputPath = options.outputPath || this.config.prompts.outputDirectory;
      const savedPath = this.promptGenerator.savePrompt(prompt, outputPath);

      // Return results
      const results = {
        analysis,
        prompt,
        savedPath,
        timestamp: new Date().toISOString()
      };

      console.log('\n🎉 AI Web Agent completed successfully!');
      console.log(`📄 Prompt saved to: ${savedPath}`);
      
      return results;

    } catch (error) {
      console.error(`❌ Error: ${error.message}`);
      throw error;
    }
  }

  /**
   * Generate a specialized prompt for specific task types
   * @param {string} projectPath - Path to the project
   * @param {string} taskType - Type of task (feature, bugfix, optimization, etc.)
   * @param {string} description - Task description
   * @param {Object} options - Additional options
   * @returns {Object} Results
   */
  async generateSpecializedPrompt(projectPath, taskType, description, options = {}) {
    console.log(`🎯 Generating specialized prompt for: ${taskType}`);

    const analysis = this.analyzer.analyzeCodebase(projectPath);
    const prompt = this.promptGenerator.generateSpecializedPrompt(analysis, taskType, description);
    
    const outputPath = options.outputPath || this.config.prompts.outputDirectory;
    const savedPath = this.promptGenerator.savePrompt(prompt, outputPath);

    return {
      analysis,
      prompt,
      savedPath,
      taskType,
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Quick analysis without generating prompts
   * @param {string} projectPath - Path to the project
   * @returns {Object} Analysis results
   */
  async quickAnalysis(projectPath) {
    console.log('🔍 Quick analysis...');
    const analysis = this.analyzer.analyzeCodebase(projectPath);
    
    console.log('\n📊 Analysis Summary:');
    console.log(`- Project: ${analysis.projectName}`);
    console.log(`- Files: ${analysis.totalFiles}`);
    console.log(`- Framework: ${analysis.technology.framework}`);
    console.log(`- Language: ${analysis.technology.language}`);
    console.log(`- Has React: ${analysis.technology.hasReact ? 'Yes' : 'No'}`);
    console.log(`- Has TypeScript: ${analysis.technology.hasTypeScript ? 'Yes' : 'No'}`);
    
    return analysis;
  }

  /**
   * List available templates
   * @returns {Array} Available template names
   */
  listTemplates() {
    const templatesDir = path.join(__dirname, 'src', 'templates');
    const templates = [];

    try {
      const files = fs.readdirSync(templatesDir);
      files.forEach(file => {
        if (file.endsWith('.md')) {
          templates.push(path.basename(file, '.md'));
        }
      });
    } catch (error) {
      console.log('No custom templates found');
    }

    return templates;
  }
}

// CLI interface
if (require.main === module) {
  const agent = new AIWebAgent();
  const args = process.argv.slice(2);

  if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
    console.log(`
🤖 AI Web Agent - Codebase Analysis & AI Prompt Generator

Usage:
  node index.js <project-path> [question] [options]

Examples:
  node index.js ./my-react-app "Add a contact form"
  node index.js ./my-vue-app "Fix mobile menu bug"
  node index.js ./my-project --quick
  node index.js ./my-project --specialized feature "Add user authentication"

Options:
  --quick              Quick analysis only (no prompt generation)
  --specialized <type> Generate specialized prompt (feature, bugfix, optimization, refactor)
  --template <name>    Use specific template
  --output <path>      Custom output directory

Available specialized types:
  - feature: Feature development
  - bugfix: Bug fixing
  - optimization: Performance optimization
  - refactor: Code refactoring
  - security: Security audit
  - testing: Test improvement
`);
    process.exit(0);
  }

  const projectPath = args[0];
  const question = args[1];
  const options = {};

  // Parse options
  for (let i = 2; i < args.length; i++) {
    if (args[i] === '--quick') {
      agent.quickAnalysis(projectPath).catch(console.error);
      return;
    } else if (args[i] === '--specialized' && args[i + 1]) {
      const taskType = args[i + 1];
      const description = args[i + 2] || '';
      agent.generateSpecializedPrompt(projectPath, taskType, description, options)
        .then(results => console.log('✅ Specialized prompt generated!'))
        .catch(console.error);
      return;
    } else if (args[i] === '--template' && args[i + 1]) {
      options.templateType = args[i + 1];
    } else if (args[i] === '--output' && args[i + 1]) {
      options.outputPath = args[i + 1];
    }
  }

  // Default behavior
  agent.analyzeAndGeneratePrompt(projectPath, question, options)
    .then(results => console.log('✅ Analysis and prompt generation complete!'))
    .catch(console.error);
}

module.exports = AIWebAgent; 