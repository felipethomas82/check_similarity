const express = require('express');
const multer = require('multer');
const similarity = require('string-similarity');

// Configuração do multer para capturar o nome completo do arquivo
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const app = express();

app.use(express.static('public'));

app.post('/check-similarity', upload.array('files'), (req, res) => {
    const files = req.files;
    const fileContents = {};

    files.forEach(file => {
        
        const relativePath = file.originalname.replace(/\\/g, '/'); // Mantém o caminho relativo original
        const content = file.buffer.toString('utf8'); // Lê o conteúdo do buffer diretamente
        
        // Armazena o conteúdo do arquivo e o caminho original como chave
        fileContents[relativePath] = content;
    });

    let similarities = {};

    const fileKeys = Object.keys(fileContents);

    for (let i = 0; i < fileKeys.length; i++) {
        for (let j = i + 1; j < fileKeys.length; j++) {
            const file1Key = fileKeys[i];
            const file2Key = fileKeys[j];
            const similarityScore = similarity.compareTwoStrings(fileContents[file1Key], fileContents[file2Key]);

            if (similarityScore > 0.7) { // Threshold de similaridade (pode ajustar)
                if (!similarities[file1Key]) similarities[file1Key] = [];
                similarities[file1Key].push({
                    file: file2Key,
                    similarity: similarityScore
                });
            }
        }
    }

    res.json(similarities);
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
