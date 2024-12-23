// Lista de arquivos a serem ignorados a partir do arquivo files_to_ignore.json da pasta public
const file = fetch('/files_to_ignore.json');
let ignoreList;
file.then(response => response.json()).then(data => {
    const divIgnoreFiles = document.getElementById('ignore_files');
    for (const fileName of data) {
        divIgnoreFiles.innerHTML += `${fileName}, `;
    }
    ignoreList = data;
});

document.getElementById('projectForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const folderInput = document.getElementById('projectFolder');
    const files = Array.from(folderInput.files);

    if (files.length === 0) {
        alert('Por favor, selecione uma pasta de projetos.');
        return;
    }

    let filteredFiles = files.filter(file => {
        return !ignoreList.some(ignoreFile => file.name.endsWith(ignoreFile));
    });

    filteredFiles = files.filter(file => {
        return !ignoreList.some(ignoreFile => file.name.toLowerCase().indexOf(ignoreFile.toLowerCase()) !== -1);
    });

    const fileExtension = document.getElementById('extension').value;
    if (fileExtension.trim() !== " ") {
        filteredFiles = filteredFiles.filter(file => file.name.endsWith(fileExtension));
    }

    const formData = new FormData();
    formData.append('threshold', document.getElementById('threshold').value);

    for (let file of filteredFiles) {
        const filePath = file.webkitRelativePath || file.name; // Captura o caminho relativo
        const newFileName = filePath.replace(/\//g, '_'); // Substitui '/' por '_'
        formData.append('files', new File([file], newFileName));
    }

    fetch('/check-similarity', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        const resultDiv = document.getElementById('result');
        resultDiv.style.display = "block";
        resultDiv.innerHTML = '';

        if (Object.keys(data).length === 0) {
            resultDiv.innerHTML = '<p>Nenhuma similaridade encontrada.</p>';
        } else {
            for (let file1 in data) {
                let similarFiles = data[file1];
                let file1Div = document.createElement('div');
                file1Div.classList.add('file-section');

                let fileInfoHTML = `
                    <div class="file-info">
                        <h3>Arquivo: ${file1}</h3>
                `;
                fileInfoHTML += renderCode(similarFiles);
                fileInfoHTML += `
                    </div>
                    <div class="similar-files">
                        <h4>Arquivos similares:</h4>
                `;

                similarFiles.similars.forEach(similar => {
                    fileInfoHTML += `
                        <div class="similar-file">
                            <p>Similar a: ${similar.file} (Similaridade: ${(similar.similarity * 100).toFixed(2)}%)</p>
                            ${renderCode(similar)}
                        </div>
                    `;
                });
                fileInfoHTML += '</div>';

                file1Div.innerHTML = fileInfoHTML;
                resultDiv.appendChild(file1Div);
            }

            document.querySelectorAll('pre code').forEach((block) => {
                hljs.highlightElement(block);
            });
        }
    })
    .catch(error => {
        console.error('Erro:', error);
    });
});

function renderCode(similar) {
    return `
        <button class="toggle-content">Exibir Conteúdo</button>
        <div class="file-content" style="display: none;">
            <pre><code class="language-java">${similar.content}</code></pre>
        </div>
    `;
}

// Evento para alternar a visibilidade do conteúdo do arquivo
document.addEventListener('click', function(event) {
    if (event.target.classList.contains('toggle-content')) {
        const contentDiv = event.target.nextElementSibling;
        if (contentDiv.style.display === 'none') {
            contentDiv.style.display = 'block';
            event.target.innerText = 'Ocultar Conteúdo';
        } else {
            contentDiv.style.display = 'none';
            event.target.innerText = 'Exibir Conteúdo';
        }
    }
});