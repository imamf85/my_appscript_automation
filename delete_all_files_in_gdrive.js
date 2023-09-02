function deleteAllFilesinMyFolder () {
    var folderId = '1KrAlw-EBsHJwQex0oP1Ngj9dXoQ3rZ4e';
    var folder = DriveApp.getFolderById(folderId);
  
    while (folder.getFiles().hasNext()) {
      folder.getFiles().next().setTrashed(true);
    }
  }