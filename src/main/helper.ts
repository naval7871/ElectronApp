import path from 'path'

export function contentBtwSeparators(arr){
    const [sep1, sep2, textContent] = arr
 let index1 = textContent.indexOf(sep1);
 let index2 = textContent.indexOf(sep2);
 let sep1Length = sep1.length;
 
 return textContent.slice(index1 + sep1Length, index2).trim();
 }

 export function pathProvider(folderName, fileName){
    let tempPath = path.join(folderName, fileName)
    let reg = /\\/g;
    tempPath = tempPath.replace(reg, '/');
    return tempPath;
 }
