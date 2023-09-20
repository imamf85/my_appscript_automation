function createSheetsBasedOnLinkFiles() {
    var originalSpreadsheetId = "xxxxx"; //change your sheet id
    var originalSheetName = "Sheet1"; //change with your name sheet
  
    var originalSpreadsheet = SpreadsheetApp.openById(originalSpreadsheetId);
    var originalSheet = originalSpreadsheet.getSheetByName(originalSheetName);
    var data = originalSheet.getDataRange().getValues();
  
    // Assuming the column containing link_files is the 4th column (index 3).
    var linkFilesColumnIndex = 3;
    var subjectIndex = 4;
    var gradeIndex = 1;
    var slotIndex = 2;
  
    // Loop through the data and create new sheets based on the link_files column.
    for (var i = 1; i < data.length; i++) { // Start from the second row.
      var linkFileValue = data[i][linkFilesColumnIndex]; //to point out the position of the links
      var subjectIndexValue = data[i][subjectIndex]; //get the subject col
      var gradeIndexValue = data[i][gradeIndex]; //get the grade col
      var slotIndexValue = data[i][slotIndex]; //get the slot col
      
      // Check if the link_file value is not empty.
      if (linkFileValue) {
        // Create a new spreadsheet based on the link file.
        var newSpreadsheet = SpreadsheetApp.openByUrl(linkFileValue);
  
        // Create a new sheet in the new spreadsheet named "upcoming_sheet."
        newSpreadsheet.insertSheet("upcoming_sheet"); //you can rename the target sheet name
        newSpreadsheet.getActiveSheet().getRange("A1").setValue("Subject").setFontWeight("bold"); //customize it
        newSpreadsheet.getActiveSheet().getRange("A2").setValue("Course_grade").setFontWeight("bold");
        newSpreadsheet.getActiveSheet().getRange("A3").setValue("Slot").setFontWeight("bold");
        newSpreadsheet.getActiveSheet().getRange("B1").setValue(subjectIndexValue);
        newSpreadsheet.getActiveSheet().getRange("B2").setValue(gradeIndexValue);
        newSpreadsheet.getActiveSheet().getRange("B3").setValue(slotIndexValue);
  
        //put the formula into cell A6
        newSpreadsheet.getActiveSheet().getRange("A6")
        .setFormula(`=QUERY(IMPORTRANGE(\"1LOZo-mKB0fdsbuUrWqg0KzlkQq5Tyj5pBMuTL4MWy_I\",\"Upcoming_class!A2:H\"), \"Select * where  Col4 ='${gradeIndexValue}' AND  Col3 ='${slotIndexValue}' order by Col8, Col7 \",1)`);
  
        newSpreadsheet.getSheetByName("upcoming_sheet").getRange(6,1,1,8).setBackground("#c9daf8").setFontWeight("bold");
        
      }
    }
  }
  