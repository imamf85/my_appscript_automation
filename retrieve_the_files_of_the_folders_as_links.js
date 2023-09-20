function listAllFolderFiles() {
    var folderId = 'xxxxxx'; // Replace with your folder ID
    var sheetId = 'yyyyyy'; // Replace with your sheet ID
    var sheetName = 'Sheet1' // your sheet name which you want to put the links
    var sheet = SpreadsheetApp.openById(sheetId).getSheetByName(sheetName);
  
    // Get all files in the folder and its subfolders
    var folder = DriveApp.getFolderById(folderId);
    var files = getAllFilesInFolder(folder);
  
    files.reverse() //change the order of the result
  
    // Write the links to the sheet
    for (var i = 0; i < files.length; i++) {
      var file = files[i];
      var fileLink = file.getUrl(); //get the url of the files
      var fileName = file.getName(); //get the name of the files
      
      sheet.getRange(i + 2, 4) //the position starts from 2nd row and 4th col
           .setValue(fileLink);
      sheet.getRange(i + 2, 1) //the position starts from 2nd row and 1st col
           .setValue(fileName);
    }
  }
  
function getAllFilesInFolder(folder) {
    var files = [];
    var folderFiles = folder.getFiles();
    while (folderFiles.hasNext()) {
      files.push(folderFiles.next());
    }
    var subfolders = folder.getFolders();
    while (subfolders.hasNext()) {
      var subfolder = subfolders.next();
      var subfolderFiles = getAllFilesInFolder(subfolder);
      files = files.concat(subfolderFiles);
    }
    return files;
  }
  