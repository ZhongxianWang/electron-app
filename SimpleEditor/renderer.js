window.fileApi.onFileOpened((data) => {
    const { filepath, content } = data;
    const textArea = document.getElementById('text-editor') || document.createElement('textarea');
    textArea.value = content;
})

document.addEventListener('DOMContentLoaded', () => {
    const textArea = document.getElementById('text-editor');
    textArea.focus();
});

