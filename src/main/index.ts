import { app, shell, BrowserWindow, ipcMain, dialog } from 'electron'
import path, { join } from 'path'
import fs from 'fs';
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import { contentBtwSeparators, pathProvider } from './helper';
import { isAnnotatedOrNotFun } from './annotatedFun';
import { SpecificityArr, annotatorDetailsSeparator } from './constants';

let selectedFolder;
function createWindow(): void {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.


function readDirectory(selectedFolder, folderName, events){
  fs.readdir(selectedFolder, (err, files) => {

    if(err) {
      console.log(err);
      return;
    }

    files = files.sort();
    let filesWithStatus = new Array(files.length)
    if(!files.length){
      events.reply('initial-load-success', {filesDetailsArr : filesWithStatus, folderName: folderName})                
    }


    files.forEach((fileName, index) => {
      let path = pathProvider(selectedFolder, fileName);
      fs.readFile(path, 'utf8', (err, data) => {
        if(err){
          console.log('File Reading Failed in Node js');   
          filesWithStatus[index] = {textContent: '', isAnnotatedOrNot: false, fileName: fileName, isSuccess: false}
        }

        else {
          let isAnnotatedOrNot = isAnnotatedOrNotFun(data);
          filesWithStatus[index] = {textContent: data, isAnnotatedOrNot, fileName: fileName, isSuccess: true}
        }

        if(!filesWithStatus.includes(undefined)){
          events.reply('initial-load-success', {filesDetailsArr : filesWithStatus, folderName: folderName})                
        }
        
      })
    })
  });
}


ipcMain.on('readFile', (events, args) => {
  let selectedFileName = args;
 let tempPath = path.join(selectedFolder, selectedFileName)
  let reg = /\\/g;
  tempPath = tempPath.replace(reg, '/')
  fs.readFile(tempPath, 'utf8', (err, data) => {
    if(err) {
      console.log(err);
      events.reply('readFile', err)
      return
    };
    events.reply('readFile', data);
  })
})

ipcMain.on('selectFolder', (events) => {
  dialog.showOpenDialog({properties: ['openDirectory']})
  .then(result => {
    if(!result.canceled){
      selectedFolder = result.filePaths[0];
      let folderNameArr = selectedFolder.split('\\')
      let folderName = folderNameArr[folderNameArr.length - 1];
      readDirectory(selectedFolder, folderName, events)        
    }
  })
  .catch(err => {
    console.log('Error Occured');
    console.log(err)
    // ipcRenderer.send('folder-error', 'Something File Error occured')
  })
})


ipcMain.on('saveFile', (events, args) => {
  let {fileName, newString, annotatorDetailsReplace} = args;
  console.log(annotatorDetailsReplace)
 let tempPath = pathProvider(selectedFolder, fileName)
  fs.readFile(tempPath, 'utf8', (err, data) => {
    if(err){
      console.log('unable to read the data from ');
      return 'unable to read the data from local folder'
    }

    else {
      let replacableString = contentBtwSeparators([...SpecificityArr, data]);
      let annotatorDetailsReplaceStr = data.split(annotatorDetailsSeparator)[1]
  
      console.log(annotatorDetailsReplaceStr)
  
      let newData = data.replace(replacableString, newString);
      newData = newData.replace(annotatorDetailsReplaceStr, `\n\n${annotatorDetailsReplace}`)
      fs.writeFile(tempPath, newData, (err) => {
        if(err) {
          console.log('Error occured while saving the file');
          return;
        }
        console.log('Saved file successfully');
        events.reply('fileSaved', {status: 'success', data: newData})
        return
      })
      return;
    }

 
  })

})


ipcMain.on('reload', (events) => {
  let folderNameArr = selectedFolder.split('\\')
  let folderName = folderNameArr[folderNameArr.length - 1];
  readDirectory(selectedFolder, folderName, events)     
})

