// Function to read a file as text
const readFileAsText = (file) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsText(file);
});

// Function to download a file
const downloadFile = (filename, content) => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
};

const processFiles = async () => {
    const configFile = document.getElementById('configFile').files[0];
    const files = document.getElementById('fileInput').files;
    const imageFile = document.getElementById('imageInput').files[0];
    
    if (!configFile) {
        alert('Please upload a config file.');
        return;
    }
    
    if (files.length === 0) {
        alert('Please upload at least one file.');
        return;
    }
    
    try {
        // Read the config file
        const configContent = await readFileAsText(configFile);
        const config = JSON.parse(configContent);

        // Process each file
        for (const file of files) {
            const fileContent = await readFileAsText(file);
            let modifiedContent = fileContent;
            
            // Perform replacements
            modifiedContent = modifiedContent.replace(/空中传媒/g, config.gameName);
            modifiedContent = modifiedContent.replace(/game.ikongzhong.cn/g, config.gameAccessAddress);
            modifiedContent = modifiedContent.replace(/http:\/\/mp.weixin.qq.com\/s\?__biz=MzI4MjA2MjE0MQ==&mid=246005295&idx=1&sn=490f8141976d607ba079d48f52a3fcd7#rd/g, config.followLink);
            modifiedContent = modifiedContent.replace(/mkongzhong/g, config.wechatID);

            // Download the modified file
            downloadFile(file.name, modifiedContent);
        }

        // Handle image replacement
        if (imageFile) {
            const imageURL = URL.createObjectURL(imageFile);
            const a = document.createElement('a');
            a.href = imageURL;
            a.download = 'weixin.jpg';
            a.click();
            URL.revokeObjectURL(imageURL);
        }
    } catch (error) {
        console.error('Error processing files:', error);
    }
};
