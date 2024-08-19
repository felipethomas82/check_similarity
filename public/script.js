document.getElementById('projectForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const ignoreList = ['.DS_Store', 'Thumbs.db', '.gitignore', '.env', 'AndroidManifest.xml'];

    const folderInput = document.getElementById('projectFolder');
    const files = Array.from( folderInput.files );

    if (files.length === 0) {
        alert('Por favor, selecione uma pasta de projetos.');
        return;
    }

    let filteredFiles = files.filter(file => {
        return !ignoreList.some(ignoreFile => file.name.endsWith(ignoreFile));
    });

    const fileExtension = document.getElementById('extension').value;
    if ( fileExtension.trim() !== " " ) {
        filteredFiles = filteredFiles.filter( file => file.name.endsWith( fileExtension ));
    }

    const formData = new FormData();
    formData.append( 'threshold', document.getElementById('threshold').value );

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
                file1Div.innerHTML = `<h3>Arquivo: ${file1}</h3>`;
                
                similarFiles.forEach(similar => {
                    let similarityInfo = document.createElement('p');
                    similarityInfo.innerText = `Similar a: ${similar.file} (Similaridade: ${(similar.similarity * 100).toFixed(2)}%)`;
                    file1Div.appendChild(similarityInfo);
                });
                
                resultDiv.appendChild(file1Div);
            }
        }
    })
    .catch(error => {
        console.error('Erro:', error);
    });
});
