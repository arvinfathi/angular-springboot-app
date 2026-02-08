const fs = require('fs');
const path = require('path');

// 1. Define the path to your placeholder file
const targetPath = path.join(__dirname, '../src/environments/environment.ts');

// 2. Pick the URL: Use Vercel's env var if it exists, otherwise use localhost
const backendUrl = process.env.BACKEND_URL || 'http://localhost:8080';

// 3. Create the content (Production Mode)
const envConfigFile = `export const environment = {
  production: true,
  apiUrl: '${backendUrl}'
};
`;

// 4. Overwrite the file
console.log(`Writing environment file to ${targetPath}`);
console.log(`Using API URL: ${backendUrl}`);

fs.writeFileSync(targetPath, envConfigFile);