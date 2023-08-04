function onEdit() {
  
    var ss = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var datass = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("source_data");
    var activeCell = ss.getActiveCell();
  
    if(activeCell.getColumn() == 28 && activeCell.getRow() > 1){
  
      activeCell.offset(0, 1).clearContent().clearDataValidations();
      activeCell.offset(0, 2).clearContent().clearDataValidations();
      activeCell.offset(0, 3).clearContent().clearDataValidations();
      activeCell.offset(0, 4).clearContent().clearDataValidations();
      activeCell.offset(0, 5).clearContent().clearDataValidations();
  
    
        var makes = datass.getRange(1, 1, 1, datass.getLastColumn()).getValues();
  
        var makeIndex = makes[0].indexOf(activeCell.getValue()) + 1;
  
        var validationRange = datass.getRange(2, makeIndex, datass.getLastRow());
        var validationRule = SpreadsheetApp.newDataValidation().requireValueInRange(validationRange).build();
        activeCell.offset(0, 1).setDataValidation(validationRule);
        activeCell.offset(0, 2).setDataValidation(validationRule);
        activeCell.offset(0, 3).setDataValidation(validationRule);
        activeCell.offset(0, 4).setDataValidation(validationRule);
        activeCell.offset(0, 5).setDataValidation(validationRule);
    }
    onEdit2();
  }