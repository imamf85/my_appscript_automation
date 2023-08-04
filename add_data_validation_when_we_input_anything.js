const createYourDValidationEasily = () => {
    let ss = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('recap');
    let ruleForCheckbox = SpreadsheetApp.newDataValidation().requireCheckbox().build();
    let ruleForList = SpreadsheetApp.newDataValidation().requireValueInList(['not yet', 'done']).build();
  
    ss.getRange(2, 14, ss.getLastRow() - 1).setDataValidation(ruleForCheckbox);
    ss.getRange(2, 15, ss.getLastRow() - 1).setDataValidation(ruleForList);
  }
  
  createYourDValidationEasily();