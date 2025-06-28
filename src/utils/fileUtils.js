// fileUtils.js - File operation utilities

const fs = require('fs');
const path = require('path');

/**
 * Check if a path exists
 * @param {string} filePath - Path to check
 * @returns {boolean} True if path exists
 */
function pathExists(filePath) {
  try {
    return fs.existsSync(filePath);
  } catch (error) {
    return false;
  }
}

/**
 * Get file extension
 * @param {string} filePath - File path
 * @returns {string} File extension (without dot)
 */
function getFileExtension(filePath) {
  return path.extname(filePath).toLowerCase().slice(1);
}

/**
 * Get file size in human readable format
 * @param {string} filePath - File path
 * @returns {string} Human readable file size
 */
function getFileSize(filePath) {
  try {
    const stats = fs.statSync(filePath);
    const bytes = stats.size;
    
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  } catch (error) {
    return 'Unknown';
  }
}

/**
 * Read file content safely
 * @param {string} filePath - File path
 * @param {number} maxSize - Maximum file size to read (in bytes)
 * @returns {string|null} File content or null if error
 */
function readFileSafely(filePath, maxSize = 1024 * 1024) { // 1MB default
  try {
    const stats = fs.statSync(filePath);
    
    if (stats.size > maxSize) {
      console.log(`⚠️ File too large to read: ${filePath} (${getFileSize(filePath)})`);
      return null;
    }
    
    return fs.readFileSync(filePath, 'utf8');
  } catch (error) {
    console.log(`❌ Error reading file: ${filePath}`);
    return null;
  }
}

/**
 * Get relative path from project root
 * @param {string} filePath - Absolute file path
 * @param {string} projectRoot - Project root directory
 * @returns {string} Relative path
 */
function getRelativePath(filePath, projectRoot) {
  return path.relative(projectRoot, filePath);
}

/**
 * Check if file is binary
 * @param {string} filePath - File path
 * @returns {boolean} True if file is binary
 */
function isBinaryFile(filePath) {
  const binaryExtensions = [
    'png', 'jpg', 'jpeg', 'gif', 'svg', 'webp', 'ico',
    'pdf', 'doc', 'docx', 'xls', 'xlsx',
    'zip', 'rar', '7z', 'tar', 'gz',
    'exe', 'dll', 'so', 'dylib',
    'mp3', 'mp4', 'avi', 'mov', 'wav',
    'ttf', 'otf', 'woff', 'woff2'
  ];
  
  const extension = getFileExtension(filePath);
  return binaryExtensions.includes(extension);
}

/**
 * Get file modification time
 * @param {string} filePath - File path
 * @returns {Date|null} Modification time or null if error
 */
function getFileModTime(filePath) {
  try {
    const stats = fs.statSync(filePath);
    return stats.mtime;
  } catch (error) {
    return null;
  }
}

/**
 * Create directory if it doesn't exist
 * @param {string} dirPath - Directory path
 * @returns {boolean} True if successful
 */
function ensureDirectory(dirPath) {
  try {
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
    return true;
  } catch (error) {
    console.error(`❌ Error creating directory: ${dirPath}`);
    return false;
  }
}

/**
 * Copy file safely
 * @param {string} source - Source file path
 * @param {string} destination - Destination file path
 * @returns {boolean} True if successful
 */
function copyFile(source, destination) {
  try {
    ensureDirectory(path.dirname(destination));
    fs.copyFileSync(source, destination);
    return true;
  } catch (error) {
    console.error(`❌ Error copying file: ${source} to ${destination}`);
    return false;
  }
}

/**
 * Get all files in directory recursively
 * @param {string} dirPath - Directory path
 * @param {Array} ignoreList - List of files/folders to ignore
 * @returns {Array} Array of file paths
 */
function getAllFiles(dirPath, ignoreList = []) {
  const files = [];
  
  try {
    const items = fs.readdirSync(dirPath);
    
    for (const item of items) {
      if (ignoreList.includes(item)) continue;
      
      const fullPath = path.join(dirPath, item);
      const stats = fs.statSync(fullPath);
      
      if (stats.isDirectory()) {
        files.push(...getAllFiles(fullPath, ignoreList));
      } else {
        files.push(fullPath);
      }
    }
  } catch (error) {
    console.error(`❌ Error reading directory: ${dirPath}`);
  }
  
  return files;
}

/**
 * Get file statistics
 * @param {string} filePath - File path
 * @returns {Object|null} File stats or null if error
 */
function getFileStats(filePath) {
  try {
    const stats = fs.statSync(filePath);
    return {
      size: stats.size,
      modified: stats.mtime,
      created: stats.birthtime,
      isDirectory: stats.isDirectory(),
      isFile: stats.isFile()
    };
  } catch (error) {
    return null;
  }
}

module.exports = {
  pathExists,
  getFileExtension,
  getFileSize,
  readFileSafely,
  getRelativePath,
  isBinaryFile,
  getFileModTime,
  ensureDirectory,
  copyFile,
  getAllFiles,
  getFileStats
}; 