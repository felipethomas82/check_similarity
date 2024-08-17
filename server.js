const express = require('express');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const similarity = require('string-similarity');

// Configuração do multer para capturar o nome completo do arquivo
const storage = multer.memoryStorage();
const upload = multer({ dest: 'uploads/' });

const app = express();

app.use(express.static('public'));

app.post('/check-similarity', upload.array('files'), (req, res) => {
    const files = req.files;
    const fileContents = {};
    const SIMILARITY_THRESHOLD = req.body.threshold; // Threshold de similaridade (pode ajustar)

    console.log(`Processando ${files.length} arquivos`);
    console.log(`Threshold de similaridade: ${SIMILARITY_THRESHOLD}`);

    files.forEach(file => {
        const content = fs.readFileSync(file.path, 'utf8');
        fileContents[file.originalname] = content;
        fs.unlinkSync(file.path); // Limpa o arquivo temporário
    });

    let similarities = {};

    const fileKeys = Object.keys(fileContents);

    for (let i = 0; i < fileKeys.length; i++) {
        for (let j = i + 1; j < fileKeys.length; j++) {
            if (i == j) continue; //pula arquivos iguais
            const file1Key = fileKeys[i];
            const file2Key = fileKeys[j];
            const similarityScore = similarity.compareTwoStrings(fileContents[file1Key], fileContents[file2Key]);
            
            if (similarityScore > SIMILARITY_THRESHOLD) { 
                if (!similarities[file1Key]) similarities[file1Key] = [];
                similarities[file1Key].push({
                    file: file2Key,
                    similarity: similarityScore
                });
            }
        }
    }
    console.log("Fim da verificação");
    res.json(similarities);
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
