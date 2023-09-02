function createCSVFilesFromKeywords() {
    // Specify the folder ID where you want to create CSV files
    var folderId = '1KrAlw-EBsHJwQex0oP1Ngj9dXoQ3rZ4e';
    var folder = DriveApp.getFolderById(folderId);
    
    // Specify the spreadsheet and sheet name
    var spreadsheetId = '188k1lBbO8zLM5Joy-tPAcO9yLsKpH5Hp_FmEhFRFxyQ';
    var sheetName = 'data';
    var parametersSheetName = 'parameters';
    
    // Open the spreadsheet
    var spreadsheet = SpreadsheetApp.openById(spreadsheetId);
    var sheet = spreadsheet.getSheetByName(sheetName);
    var parametersSheet = spreadsheet.getSheetByName(parametersSheetName);
    
    // Get the data from the parameters sheet
    var parametersData = parametersSheet.getRange(1, 1, parametersSheet.getLastRow(), 1).getValues();
    
    // Loop through each keyword in the parameters sheet
    for (var i = 0; i < parametersData.length; i++) {
      var keyword = parametersData[i][0];
      
      // Filter the data based on the keyword
      var filteredData = sheet.getRange(1,1,sheet.getLastRow(),8).getValues().filter(function(row) {
        return row[2].toLowerCase() === keyword.toLowerCase();
      });
      
      // Create a new CSV file for the keyword
      var csvData = '';
      
      // Include the header row if there is filtered data
      if (filteredData.length > 0) {
        csvData += sheet.getRange(1, 1, 1, 8).getValues()[0].join(',') + '\n';
      }
      
      for (var j = 0; j < filteredData.length; j++) {
        csvData += filteredData[j].join(',') + '\n';
      }
      
      // Create the CSV file
      var fileName = keyword + '.csv';
      var file = DriveApp.createFile(fileName, csvData);
      
      // Move the CSV file to the specified folder
      folder.createFile(file);
      
      // Delete the temporary CSV file from the root folder
      DriveApp.getFileById(file.getId()).setTrashed(true);
    }
  }