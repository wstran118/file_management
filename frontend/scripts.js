const apiUrl = 'http://localhost:5000/api/file';

async function fetchFiles() {
    try {
        const response = await fetch(apiUrl);
        const files = await response.json();
        const fileList = document.getElementById('fileList');
        fileList.innerHTML = '';
        files.forEach(file => {
            const li = document.createElement('li');
            li.innerHTML = `
                <span>${file.name}</span>
                <div>
                    <button onclick="downloadFile('${file.name}')">Download</button>
                    <button class="delete-btn" onclick="deleteFile('${file.name}')">Delete</button>
                </div>
            `;
            fileList.appendChild(li);
        });
    } catch (error) {
        console.error('Error fetching files:', error);
    }
}

async function uploadFiles() {
    const fileInput = document.getElementById('fileInput');
    const files = fileInput.files;
    const formData = new FormData();

    for (let file of files) {
        formData.append('file', file);
    }

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            body: formData
        });
        if (response.ok) {
            alert('Files uploaded successfully');
            fetchFiles();
        } else {
            alert('Error uploading files');
        }
    } catch (error) {
        console.error('Error uploading files:', error);
        alert('Error uploading files');
    }
}

async function downloadFile(fileName) {
    try {
        const response = await fetch(`${apiUrl}/download/${fileName}`);
        if (response.ok) {
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = fileName;
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);
        } else {
            alert('Error downloading file');
        }
    } catch (error) {
        console.error('Error downloading file:', error);
        alert('Error downloading file');
    }
}

async function deleteFile(fileName) {
    if (confirm(`Are you sure you want to delete ${fileName}?`)) {
        try {
            const response = await fetch(`${apiUrl}/${fileName}`, {
                method: 'DELETE'
            });
            if (response.ok) {
                alert('File deleted successfully');
                fetchFiles();
            } else {
                alert('Error deleting file');
            }
        } catch (error) {
            console.error('Error deleting file:', error);
            alert('Error deleting file');
        }
    }
}

// Initial fetch of files
fetchFiles();