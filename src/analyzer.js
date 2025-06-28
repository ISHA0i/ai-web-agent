// analyzer.js - Codebase analysis functionality

const fs = require('fs');
const path = require('path');

class CodebaseAnalyzer {
  constructor() {
    this.ignoreList = ['node_modules', '.git', 'dist', 'build', '.next', '.nuxt'];
  }

  /**
   * Main analysis function - analyzes a codebase and returns structured data
   * @param {string} projectPath - Path to the project to analyze
   * @returns {Object} Analysis results
   */
  analyzeCodebase(projectPath) {
    console.log('🔍 Analyzing codebase...');
    
    const allFiles = this.findAllFiles(projectPath);
    console.log(`📁 Found ${allFiles.length} files`);
    
    const fileTypes = this.categorizeFiles(allFiles);
    const importantFiles = this.identifyImportantFiles(allFiles);
    const dependencies = this.analyzeDependencies(projectPath);
    
    return {
      projectName: path.basename(projectPath),
      totalFiles: allFiles.length,
      fileTypes,
      importantFiles,
      dependencies,
      technology: this.detectTechnology(fileTypes, dependencies),
      structure: this.analyzeStructure(allFiles, projectPath)
    };
  }

  /**
   * Recursively find all files in the project
   * @param {string} folderPath - Directory to search
   * @returns {Array} Array of file paths
   */
  findAllFiles(folderPath) {
    let allFiles = [];
    
    try {
      const items = fs.readdirSync(folderPath);
      
      for (let item of items) {
        if (this.ignoreList.includes(item)) continue;
        
        const fullPath = path.join(folderPath, item);
        
        if (fs.statSync(fullPath).isDirectory()) {
          allFiles = allFiles.concat(this.findAllFiles(fullPath));
        } else {
          allFiles.push(fullPath);
        }
      }
    } catch (error) {
      console.log(`❌ Error reading directory: ${folderPath}`);
    }
    
    return allFiles;
  }

  /**
   * Categorize files by type and extension
   * @param {Array} files - Array of file paths
   * @returns {Object} Categorized files
   */
  categorizeFiles(files) {
    const categories = {
      javascript: [],
      typescript: [],
      react: [],
      vue: [],
      angular: [],
      styles: [],
      html: [],
      images: [],
      config: [],
      documentation: [],
      tests: [],
      other: []
    };

    files.forEach(file => {
      const fileName = path.basename(file);
      const extension = path.extname(file).toLowerCase();
      const relativePath = file;

      if (extension === '.js' && !fileName.includes('.test.') && !fileName.includes('.spec.')) {
        categories.javascript.push(relativePath);
      } else if (extension === '.ts' && !fileName.includes('.test.') && !fileName.includes('.spec.')) {
        categories.typescript.push(relativePath);
      } else if (extension === '.jsx' || extension === '.tsx') {
        categories.react.push(relativePath);
      } else if (extension === '.vue') {
        categories.vue.push(relativePath);
      } else if (extension === '.css' || extension === '.scss' || extension === '.sass' || extension === '.less') {
        categories.styles.push(relativePath);
      } else if (extension === '.html') {
        categories.html.push(relativePath);
      } else if (['.png', '.jpg', '.jpeg', '.gif', '.svg', '.webp'].includes(extension)) {
        categories.images.push(relativePath);
      } else if (['package.json', 'package-lock.json', '.env', 'tsconfig.json', 'webpack.config.js'].includes(fileName)) {
        categories.config.push(relativePath);
      } else if (['.md', '.txt', '.rst'].includes(extension)) {
        categories.documentation.push(relativePath);
      } else if (fileName.includes('.test.') || fileName.includes('.spec.') || extension === '.test.js' || extension === '.spec.js') {
        categories.tests.push(relativePath);
      } else {
        categories.other.push(relativePath);
      }
    });

    return categories;
  }

  /**
   * Identify important files in the project
   * @param {Array} files - Array of file paths
   * @returns {Object} Important files by category
   */
  identifyImportantFiles(files) {
    const important = {
      entryPoints: [],
      components: [],
      pages: [],
      api: [],
      config: [],
      styles: []
    };

    files.forEach(file => {
      const fileName = path.basename(file);
      const filePath = file.toLowerCase();

      // Entry points
      if (['index.html', 'index.js', 'index.ts', 'App.js', 'App.tsx', 'main.js', 'main.ts'].includes(fileName)) {
        important.entryPoints.push(file);
      }
      
      // React components (capitalized files)
      if (fileName.match(/^[A-Z].*\.(jsx|tsx)$/)) {
        important.components.push(file);
      }
      
      // Pages (common patterns)
      if (filePath.includes('/pages/') || filePath.includes('/views/') || fileName.match(/^page\.(js|ts|jsx|tsx)$/)) {
        important.pages.push(file);
      }
      
      // API files
      if (filePath.includes('/api/') || filePath.includes('/routes/') || fileName.includes('route')) {
        important.api.push(file);
      }
      
      // Config files
      if (['package.json', '.env', 'tsconfig.json', 'next.config.js', 'vite.config.js'].includes(fileName)) {
        important.config.push(file);
      }
      
      // Main style files
      if (fileName === 'index.css' || fileName === 'App.css' || fileName === 'globals.css') {
        important.styles.push(file);
      }
    });

    return important;
  }

  /**
   * Analyze project dependencies
   * @param {string} projectPath - Project root path
   * @returns {Object} Dependency information
   */
  analyzeDependencies(projectPath) {
    const packageJsonPath = path.join(projectPath, 'package.json');
    
    try {
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
      return {
        dependencies: packageJson.dependencies || {},
        devDependencies: packageJson.devDependencies || {},
        scripts: packageJson.scripts || {},
        type: packageJson.type || 'commonjs'
      };
    } catch (error) {
      return {
        dependencies: {},
        devDependencies: {},
        scripts: {},
        type: 'commonjs'
      };
    }
  }

  /**
   * Detect the main technology stack
   * @param {Object} fileTypes - Categorized files
   * @param {Object} dependencies - Project dependencies
   * @returns {Object} Technology information
   */
  detectTechnology(fileTypes, dependencies) {
    const deps = { ...dependencies.dependencies, ...dependencies.devDependencies };
    
    return {
      framework: this.detectFramework(deps),
      language: this.detectLanguage(fileTypes),
      styling: this.detectStyling(fileTypes, deps),
      bundler: this.detectBundler(deps),
      testing: this.detectTesting(deps),
      hasTypeScript: fileTypes.typescript.length > 0 || fileTypes.react.some(f => f.endsWith('.tsx')),
      hasReact: fileTypes.react.length > 0 || deps.react,
      hasVue: fileTypes.vue.length > 0 || deps.vue,
      hasAngular: deps['@angular/core']
    };
  }

  /**
   * Detect the main framework
   * @param {Object} dependencies - Project dependencies
   * @returns {string} Framework name
   */
  detectFramework(dependencies) {
    if (dependencies.next) return 'Next.js';
    if (dependencies.nuxt) return 'Nuxt.js';
    if (dependencies.vue) return 'Vue.js';
    if (dependencies['@angular/core']) return 'Angular';
    if (dependencies.react) return 'React';
    if (dependencies.express) return 'Express.js';
    return 'Vanilla JavaScript';
  }

  /**
   * Detect the main programming language
   * @param {Object} fileTypes - Categorized files
   * @returns {string} Language name
   */
  detectLanguage(fileTypes) {
    if (fileTypes.typescript.length > 0) return 'TypeScript';
    if (fileTypes.javascript.length > 0) return 'JavaScript';
    return 'Unknown';
  }

  /**
   * Detect styling approach
   * @param {Object} fileTypes - Categorized files
   * @param {Object} dependencies - Project dependencies
   * @returns {string} Styling approach
   */
  detectStyling(fileTypes, dependencies) {
    if (dependencies.tailwindcss) return 'Tailwind CSS';
    if (dependencies['styled-components']) return 'Styled Components';
    if (dependencies['@emotion/react']) return 'Emotion';
    if (fileTypes.styles.length > 0) return 'CSS/SCSS';
    return 'Unknown';
  }

  /**
   * Detect bundler
   * @param {Object} dependencies - Project dependencies
   * @returns {string} Bundler name
   */
  detectBundler(dependencies) {
    if (dependencies.vite) return 'Vite';
    if (dependencies.webpack) return 'Webpack';
    if (dependencies.parcel) return 'Parcel';
    return 'Unknown';
  }

  /**
   * Detect testing framework
   * @param {Object} dependencies - Project dependencies
   * @returns {string} Testing framework
   */
  detectTesting(dependencies) {
    if (dependencies.jest) return 'Jest';
    if (dependencies.vitest) return 'Vitest';
    if (dependencies.cypress) return 'Cypress';
    if (dependencies['@testing-library/react']) return 'Testing Library';
    return 'None detected';
  }

  /**
   * Analyze project structure
   * @param {Array} files - All files
   * @param {string} projectPath - Project root
   * @returns {Object} Structure analysis
   */
  analyzeStructure(files, projectPath) {
    const directories = new Set();
    
    files.forEach(file => {
      const relativePath = path.relative(projectPath, file);
      const dir = path.dirname(relativePath);
      if (dir !== '.') {
        directories.add(dir);
      }
    });

    return {
      directories: Array.from(directories).sort(),
      hasSrcFolder: directories.has('src'),
      hasPublicFolder: directories.has('public'),
      hasComponentsFolder: Array.from(directories).some(dir => dir.includes('components')),
      hasPagesFolder: Array.from(directories).some(dir => dir.includes('pages')),
      hasApiFolder: Array.from(directories).some(dir => dir.includes('api'))
    };
  }
}

module.exports = CodebaseAnalyzer; 