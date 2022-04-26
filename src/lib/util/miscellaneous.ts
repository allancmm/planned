export const downloadFile = (fileName = 'fileNameUndefined', file: any, fileType = 'zip' ) => {
    const downloadURL = window.URL.createObjectURL(file);
    const link = document.createElement('a');
    link.href = downloadURL;
    link.setAttribute('download', `${fileName}.${fileType}`);
    document.body.appendChild(link);
    link.click();
    link.remove();
}

export const convertJsonToBlob = (json: any) : Blob =>
    new Blob([ JSON.stringify(json)], {type: 'application/json'});
