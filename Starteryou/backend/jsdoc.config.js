module.exports = {
    "source": {
        "include": ["."], // Include the current directory (backend)
        "exclude": ["node_modules", "public"] // Directories to exclude
    },
    "opts": {
        "destination": "./docs", // Output directory for the generated docs
        "recurse": true // Include subdirectories
    },
    "plugins": [
        "plugins/markdown"
    ]
};
