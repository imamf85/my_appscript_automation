function addImportrangePermission() {
    // id of the spreadsheet to add permission to import
    const ssId = SpreadsheetApp.getActiveSpreadsheet().getId();
  
    // donor or source spreadsheet ids
    const donorIds = [
      'sheet_id_1',
      'sheet_id_2',
      'sheet_id_3'
    ];
  
    const token = ScriptApp.getOAuthToken();
  
    // Iterate through the donor IDs and add permissions
    for (const donorId of donorIds) {
      const url = `https://docs.google.com/spreadsheets/d/${ssId}/externaldata/addimportrangepermissions?donorDocId=${donorId}`;
      
      const params = {
        method: 'post',
        headers: {
          Authorization: 'Bearer ' + token,
        },
        muteHttpExceptions: true
      };
      
      UrlFetchApp.fetch(url, params);
    }
  }
  