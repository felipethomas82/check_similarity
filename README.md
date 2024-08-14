# check_similarity

This project provides a web-based tool for detecting similarities between files uploaded by users. It's particularly useful for educators who need to compare students' project files to detect potential cases of code plagiarism. The application allows users to upload files, and it then analyzes and compares the contents to identify any similarities. The results are presented in an easy-to-understand JSON format that includes the file names and their respective directories.

## Features

- **File Name Modification**: Before uploading, the application modifies the file names to include the directory path, preserving the original structure.
- **Similarity Detection**: The server processes the uploaded files, analyzing them to identify and report any similarities.
- **JSON Results**: The similarity results are returned in JSON format, detailing which files are similar and in which directories they are located.

## Technologies Used

- **Frontend**: HTML, CSS, JavaScript
  - The frontend features a clean and modern design with a responsive layout, ensuring a smooth user experience.
  - JavaScript handles file selection, name modification, and progress tracking during uploads.
- **Backend**: Node.js with Express.js
  - The backend processes the uploaded files, analyzing them for similarities using a chosen comparison algorithm.
  - Uses `multer` for handling file uploads and `formidable` for file stream processing.
- **Comparison Algorithm**: A customizable algorithm to compare the files and determine similarity based on content.
  
## Installation

To get started with the project, clone the repository and install the necessary dependencies.

```bash
git clone https://github.com/felipethomas82/check_similarity
cd check_similarity
npm install
```

## Usage

1. Start the server:

```bash
npm start
```

2. Open your browser and navigate to http://localhost:3000.

3. Use the form to upload files from your local machine. The progress bar will track the upload status.

4. Once the upload is complete, the server will process the files and return a JSON report showing which files are similar and in which directories they are located.

## Project Structure
```plaintext
.
├── public
│   ├── style.css 
│   ├── script.js           # JavaScript file for handling UI interactions
│   └── index.html          # Main HTML file
├── server.js               # Node.js server file
├── package.json            # Project dependencies and scripts
└── README.md               # Project documentation
```

## Contributing
Contributions are welcome! If you find any issues or have suggestions for improvements, feel free to open an issue or create a pull request.

## License
This project is licensed under the MIT License. See the LICENSE file for more details.
