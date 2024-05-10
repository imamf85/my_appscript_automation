function removeThePreviousFile() {
    let folder = DriveApp.getFolderById('12UR6mvpvKyVQJnBVuaB1e35bBvPm6W6o');
    let files = folder.getFiles();
  
    while (files.hasNext()) {
      let file = files.next();
      let lastUpdated = file.getLastUpdated().toLocaleDateString();
      if (lastUpdated !== new Date().toLocaleDateString()) {
        file.setSharing(DriveApp.Access.PRIVATE, DriveApp.Permission.NONE);
        file.setTrashed(true);
      }
    }
  }