/**
 * @module API_CONFIG
 * @description Configuration object for API endpoints and base URL
 * Provides centralized management of API routes for file operations
 */

/**
 * @typedef {Object} APIEndpoints
 * @property {function(string): string} fileByTitle - Generates endpoint to fetch file by title
 * @property {string} fileUpload - Endpoint for uploading new files
 * @property {function(string): string} fileDownload - Generates endpoint to download file by title
 * @property {function(string): string} fileUpdate - Generates endpoint to update file by title
 * @property {function(string): string} fileDelete - Generates endpoint to delete file by title
 * @property {string} fileList - Endpoint to list all files
 * @property {string} fileCleanup - Endpoint for cleanup operations
 */

/**
 * @type {Object} API_CONFIG
 * @property {string} baseURL - Base URL for the API server
 * @property {APIEndpoints} endpoints - Object containing all API endpoint configurations
 * @description
 * Central configuration object for API interactions.
 * Includes base URL and endpoint definitions for all file operations.
 * 
 * Usage examples:
 * ```javascript
 * // Fetch file by title
 * fetch(`${API_CONFIG.baseURL}${API_CONFIG.endpoints.fileByTitle('example')}`)
 * 
 * // Upload new file
 * fetch(`${API_CONFIG.baseURL}${API_CONFIG.endpoints.fileUpload}`, {
 *   method: 'POST',
 *   body: formData
 * })
 * 
 * // Update existing file
 * fetch(`${API_CONFIG.baseURL}${API_CONFIG.endpoints.fileUpdate('example')}`, {
 *   method: 'PUT',
 *   body: formData
 * })
 * ```
 */
export const API_CONFIG = {
  /**
   * @constant {string} baseURL
   * @description Base URL for all API requests
   */
  baseURL: "http://54.196.202.145:3000",

  /**
   * @constant {APIEndpoints} endpoints
   * @description Object containing all API endpoint configurations
   */
  endpoints: {
    /**
     * @function fileByTitle
     * @param {string} title - Title identifier for the file
     * @returns {string} Endpoint URL for fetching file by title
     */
    fileByTitle: (title) => `/api/files/download/${title}`,

    /**
     * @constant {string} fileUpload
     * @description Endpoint for uploading new files
     */
    fileUpload: "/api/files/upload",

    /**
     * @function fileDownload
     * @param {string} title - Title identifier for the file
     * @returns {string} Endpoint URL for downloading file
     */
    fileDownload: (title) => `/api/files/download/${title}`,

    /**
     * @function fileUpdate
     * @param {string} title - Title identifier for the file
     * @returns {string} Endpoint URL for updating file
     */
    fileUpdate: (title) => `/api/files/update/${title}`,

    /**
     * @function fileDelete
     * @param {string} title - Title identifier for the file
     * @returns {string} Endpoint URL for deleting file
     */
    fileDelete: (title) => `/api/files/delete/${title}`,

    /**
     * @constant {string} fileList
     * @description Endpoint for listing all files
     */
    fileList: "/api/files/list",

    /**
     * @constant {string} fileCleanup
     * @description Endpoint for cleanup operations
     */
    fileCleanup: "/api/files/cleanup"
  }
};