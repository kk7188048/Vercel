import fs from 'fs';
import path from 'path';

export const getAllFiles = (folderPath: string): string[] => {
  let response: string[] = [];

  // Check if the directory exists
  console.log(`Checking if folder exists: ${folderPath}`);
  if (!fs.existsSync(folderPath)) {
    console.log(`Directory does not exist. Creating: ${folderPath}`);
    fs.mkdirSync(folderPath, { recursive: true }); // Create the directory if it doesn't exist
  } else {
    console.log(`Directory exists: ${folderPath}`);
  }

  // Read the contents of the directory
  console.log(`Reading contents of directory: ${folderPath}`);
  const allFilesAndFolders = fs.readdirSync(folderPath);
  console.log(`Contents of ${folderPath}:`, allFilesAndFolders);

  // Process each file and folder
  allFilesAndFolders.forEach(file => {
    console.log(`Processing file/folder: ${file}`);
    const fullFilePath = path.join(folderPath, file);
    console.log(`Full file path: ${fullFilePath}`);

    // Check if the path is a directory
    if (fs.statSync(fullFilePath).isDirectory()) {
      console.log(`It's a directory. Recursively getting files from: ${fullFilePath}`);
      response = response.concat(getAllFiles(fullFilePath));
    } else {
      console.log(`It's a file. Adding to response: ${fullFilePath}`);
      response.push(fullFilePath);
    }
  });

  console.log(`Final contents of ${folderPath}:`, response);

  return response;
};
