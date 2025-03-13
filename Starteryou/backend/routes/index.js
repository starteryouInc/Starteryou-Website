// routes/index.js
const express = require("express");
const router = express.Router();
const fileRoutes = require("./fileRoutes");
const textRoutes = require("./textRoutes.js");
const authRoutes = require("./authRoutes");
const userAuthRoutes = require("./userAuthRoutes");
const jobRoutes = require("./jobRoutes");
const profileRoutes = require("./profileRoutes");
const jobApplicationRoutes = require("./jobApplicationRoutes");
const bookmarkRoutes = require("./bookmarkRoutes");
const companyProfileRoutes = require("./companyProfileRoutes");
const authenticate = require("../middleware/authMiddleware");
const logger = require("../utils/logger"); //Logger import

// Store all API endpoints and their descriptions
const apiEndpoints = [
  // File Management APIs
  {
    group: "File Management",
    endpoints: [
      {
        method: "POST",
        path: "/api/files/upload",
        description: "Upload a new file with metadata",
        requestBody: {
          type: "multipart/form-data",
          fields: {
            file: {
              type: "file",
              required: true,
              description: "File to upload (max 10MB)",
            },
            title: {
              type: "string",
              required: true,
              description: "Unique title for the file",
            },
            uploadedBy: {
              type: "string",
              required: false,
              description: "Name of the uploader",
            },
          },
        },
        responses: {
          201: {
            description: "File uploaded successfully",
            content: {
              metadata: {
                title: "string",
                originalFilename: "string",
                uploadedBy: "string",
                createdAt: "date",
                gridFsFileId: "ObjectId",
              },
            },
          },
          400: {
            description: "Invalid request (missing file or duplicate title)",
          },
          500: {
            description: "Server error during upload",
          },
        },
        example: {
          curl: `curl -X POST http://localhost:3000/api/files/upload \
          -F "file=@/path/to/file.pdf" \
          -F "title=example-file" \
          -F "uploadedBy=admin"`,
        },
      },
      {
        method: "GET",
        path: "/api/files/download/:title",
        description: "Download a file by its title",
        parameters: {
          title: {
            in: "path",
            required: true,
            type: "string",
            description: "Title of the file to download",
          },
        },
        responses: {
          200: {
            description: "File stream",
            content: "application/octet-stream",
          },
          404: {
            description: "File not found",
          },
          500: {
            description: "Server error during download",
          },
        },
        example: {
          curl: "curl http://localhost:3000/api/files/download/example-file --output downloaded-file.pdf",
        },
      },
      {
        method: "PUT",
        path: "/api/files/update/:title",
        description: "Update a file and/or its metadata by title",
        parameters: {
          title: {
            in: "path",
            required: true,
            type: "string",
            description: "Current title of the file to update",
          },
        },
        requestBody: {
          type: "multipart/form-data",
          fields: {
            file: {
              type: "file",
              required: false,
              description: "New file to replace existing one (optional)",
            },
            newTitle: {
              type: "string",
              required: false,
              description: "New title for the file (optional)",
            },
            uploadedBy: {
              type: "string",
              required: false,
              description: "New uploader name (optional)",
            },
          },
        },
        responses: {
          200: {
            description: "File updated successfully",
            content: {
              metadata: {
                title: "string",
                originalFilename: "string",
                uploadedBy: "string",
                updatedAt: "date",
                gridFsFileId: "ObjectId",
              },
            },
          },
          404: {
            description: "File not found",
          },
          500: {
            description: "Server error during update",
          },
        },
        example: {
          curl: `curl -X PUT http://localhost:3000/api/files/update/example-file \
          -F "file=@/path/to/newfile.pdf" \
          -F "newTitle=updated-file" \
          -F "uploadedBy=admin"`,
        },
      },
      {
        method: "DELETE",
        path: "/api/files/delete/:title",
        description: "Delete a file by its title",
        parameters: {
          title: {
            in: "path",
            required: true,
            type: "string",
            description: "Title of the file to delete",
          },
        },
        responses: {
          200: {
            description: "File deleted successfully",
          },
          404: {
            description: "File not found",
          },
          500: {
            description: "Server error during deletion",
          },
        },
        example: {
          curl: "curl -X DELETE http://localhost:3000/api/files/delete/example-file",
        },
      },
    ],
  },
  // System APIs
  {
    group: "System Management",
    endpoints: [
      {
        method: "GET",
        path: "/health",
        description: "Check system health status",
        responses: {
          200: {
            description: "System health information",
            content: {
              status: "string",
              timestamp: "string",
              uptime: "number",
            },
          },
        },
        example: {
          curl: "curl http://localhost:3000/health",
        },
      },
      {
        method: "GET",
        path: "/api/system/verify/:title",
        description: "Verify a specific file's integrity",
        parameters: {
          title: {
            in: "path",
            required: true,
            type: "string",
            description: "Title of the file to verify",
          },
        },
        responses: {
          200: {
            description: "File verification details",
          },
          404: {
            description: "File not found",
          },
        },
        example: {
          curl: "curl http://localhost:3000/api/system/verify/example-file",
        },
      },
    ],
  },
  // Text Content Management APIs
  {
    group: "Text Content Management",
    endpoints: [
      {
        method: "GET",
        path: "/api/text",
        description: "Retrieve text content for a specific page and component",
        parameters: {
          page: {
            in: "query",
            required: true,
            type: "string",
            description: "Name of the page to retrieve content for",
          },
          component: {
            in: "query",
            required: true,
            type: "string",
            description: "Name of the component to retrieve content for",
          },
        },
        responses: {
          200: {
            description: "Content retrieved successfully",
            content: {
              page: "string",
              component: "string",
              content: "string",
              paragraphs: ["string"],
              createdAt: "date",
              updatedAt: "date",
            },
          },
          400: {
            description: "Missing page or component parameter",
          },
          404: {
            description:
              "Content not found for the specified page and component",
          },
          500: {
            description: "Server error during retrieval",
          },
        },
        example: {
          curl: 'curl "http://localhost:3000/api/text?page=AboutPage&component=HeroAbout"',
        },
      },
      {
        method: "PUT",
        path: "/api/text",
        description:
          "Update or create text content for a specific page and component",
        requestBody: {
          type: "application/json",
          fields: {
            page: {
              type: "string",
              required: true,
              description: "Name of the page to update",
            },
            component: {
              type: "string",
              required: true,
              description: "Name of the component to update",
            },
            content: {
              type: "string",
              required: false,
              description: "Text content to update (optional)",
            },
            paragraphs: {
              type: ["string"],
              required: false,
              description: "Paragraphs to update (optional)",
            },
          },
        },
        responses: {
          200: {
            description: "Content updated successfully",
            content: {
              page: "string",
              component: "string",
              content: "string",
              paragraphs: ["string"],
              createdAt: "date",
              updatedAt: "date",
            },
          },
          400: {
            description: "Invalid request body",
          },
          500: {
            description: "Server error during update",
          },
        },
        example: {
          curl:
            "curl -X PUT http://localhost:3000/api/text \\\n" +
            '-H "Content-Type: application/json" \\\n' +
            '-d \'{"page": "AboutPage", "component": "HeroAbout", "content": "New content here", "paragraphs": ["Updated paragraph 1", "Updated paragraph 2"]}\'',
        },
      },
      {
        method: "DELETE",
        path: "/api/text",
        description: "Delete text content for a specific page and component",
        parameters: {
          page: {
            in: "query",
            required: true,
            type: "string",
            description: "Name of the page to delete content from",
          },
          component: {
            in: "query",
            required: true,
            type: "string",
            description: "Name of the component to delete",
          },
        },
        responses: {
          200: {
            description: "Content deleted successfully",
          },
          400: {
            description: "Missing page or component parameter",
          },
          404: {
            description:
              "Content not found for the specified page and component",
          },
          500: {
            description: "Server error during deletion",
          },
        },
        example: {
          curl: 'curl -X DELETE "http://localhost:3000/api/text?page=AboutPage&component=HeroAbout"',
        },
      },
    ],
  },
  // Authentication APIs
  {
    group: "Authentication",
    endpoints: [
      {
        method: "POST",
        path: "/api/v1/auth/register",
        description: "Register a new user",
        requestBody: {
          type: "application/json",
          fields: {
            username: {
              type: "string",
              required: true,
              description: "Username for the new user",
            },
            email: {
              type: "string",
              required: true,
              description: "Email for the new user",
            },
            password: {
              type: "string",
              required: true,
              description: "Password for the new user",
            },
          },
        },
        responses: {
          201: {
            description: "User successfully registered",
          },
          400: {
            description: "Invalid input",
          },
        },
        example: {
          curl: `curl -X POST http://localhost:3000/api/v1/auth/register \
          -H "Content-Type: application/json" \
          -d '{"username": "user1", "email": "user1@example.com", "password": "password123"}'`,
        },
      },
      {
        method: "POST",
        path: "/api/v1/auth/login",
        description: "Login an existing user",
        requestBody: {
          type: "application/json",
          fields: {
            email: {
              type: "string",
              required: true,
              description: "Email of the user",
            },
            password: {
              type: "string",
              required: true,
              description: "Password of the user",
            },
          },
        },
        responses: {
          200: {
            description: "Login successful",
          },
          401: {
            description: "Invalid credentials",
          },
        },
        example: {
          curl: `curl -X POST http://localhost:3000/api/v1/auth/login \
          -H "Content-Type: application/json" \
          -d '{"email": "user1@example.com", "password": "password123"}'`,
        },
      },
    ],
  },
];

// Mount routes
router.use("/api/files", fileRoutes);
router.use("/api", textRoutes);
router.use("/api/v1/auth", authRoutes);
router.use("/api/v1/userAuth", userAuthRoutes);
router.use("/api/v1/jobportal/jobs", authenticate, jobRoutes);
router.use("/api/v1/jobportal/profile", authenticate, profileRoutes);
router.use(
  "/api/v1/jobportal/applications",
  authenticate,
  jobApplicationRoutes
);
router.use("/api/v1/jobportal/bookmarks", authenticate, bookmarkRoutes);
router.use(
  "/api/v1/jobportal/companyProfile",
  authenticate,
  companyProfileRoutes
);

// API documentation endpoint with enhanced information
router.get("/api/docs", (req, res) => {
  const baseUrl =
    process.env.BASE_URL || `http://localhost:${process.env.PORT || 3000}`;

  res.json({
    title: "Enhanced API Documentation",
    version: "1.0.0",
    baseUrl,
    description:
      "API for managing files, text content, and authentication functionalities.",
    totalEndpoints: apiEndpoints.reduce(
      (total, group) => total + group.endpoints.length,
      0
    ),
    apiGroups: apiEndpoints,
    generalNotes: [
      "Components are used as unique identifiers for text content.",
      "All file operations use titles as unique identifiers.",
      "Maximum file size: 10MB.",
      "Supported file types: All (e.g., PDFs, images, videos).",
      "Authentication: Implemented as of v1.",
      "Rate limiting: Not implemented (add as needed).",
      "Data persistence: Uses MongoDB with GridFS for file storage.",
    ],
    postmanCollection: {
      description:
        "Import the Postman collection for easy API testing and exploration.",
      url: `${baseUrl}/api/docs/postman`,
    },
  });
});

// Postman collection export endpoint
router.get("/api/docs/postman", (req, res) => {
  const baseUrl =
    process.env.BASE_URL || `http://localhost:${process.env.PORT || 3000}`;

  const postmanCollection = {
    info: {
      name: "File, Text & Auth Management API",
      description:
        "API collection for managing files, text content, and authentication.",
      schema:
        "https://schema.getpostman.com/json/collection/v2.1.0/collection.json",
    },
    item: apiEndpoints.flatMap((group) =>
      group.endpoints.map((endpoint) => ({
        name: `${endpoint.method} ${endpoint.path}`,
        request: {
          method: endpoint.method,
          url: {
            raw: `${baseUrl}${endpoint.path}`,
            host: [baseUrl.replace(/https?:\/\//, "").split(":")[0]], // Host only
            path: endpoint.path.split("/").filter(Boolean),
          },
          description: endpoint.description,
          header: [],
        },
      }))
    ),
  };

  res.json(postmanCollection);
});

// Export both the router and endpoints for potential reuse
module.exports = {
  router,
  apiEndpoints,
  mountRoutes: (app) => {
    app.use("/", router);
    logger.info("✅ Routes mounted successfully");
  },
};
