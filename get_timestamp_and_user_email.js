function getTimestampUser(e) {

    var ss = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  
    const row = e.range.getRow();
    const column = e.range.getColumn();
    const currentDate = new Date();
    const getUser = Session.getActiveUser().getEmail();
  
    if (column === 18 && row > 2 && ss.getName() === "your_sheet_name") {
  
      e.source.getActiveSheet().getRange(row, 30).setValue(currentDate);
      e.source.getActiveSheet().getRange(row, 31).setValue(getUser)
  
      if (ss.getRange(row, 29).getValue() === "") {
  
        ss.getRange(row, 29).setValue(currentDate);
  
      }
  
    }
  
    if (column === 21 && row > 2 && ss.getName() === "your_sheet_name") {
  
      e.source.getActiveSheet().getRange(row, 30).setValue(currentDate);
      e.source.getActiveSheet().getRange(row, 31).setValue(getUser)
  
      if (ss.getRange(row, 29).getValue() === "") {
  
        ss.getRange(row, 29).setValue(currentDate);
  
      }
  
    }
  
  
  }