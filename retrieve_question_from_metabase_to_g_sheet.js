function importQuestions() {
    importQuestion(3187, "data");
  }
  
  function importQuestion(questionNumber, sheetName) {
    var metabaseQuestionNum = questionNumber;
    if (metabaseQuestionNum != 'cancel' && !isNaN(metabaseQuestionNum)) {
      var status = getQuestionAsCSV(metabaseQuestionNum, sheetName);
  
      var log = {
        'user': Session.getActiveUser().getEmail(),
        'function': 'importQuestion',
        'questionNumber': metabaseQuestionNum,
        'status': status
      };
  
      if (log.status === true) {
        console.log(log);
      } else {
        console.error(log);
      }
  
      if (status.success === true) {
        console.log('Question ' + metabaseQuestionNum + ' successfully imported.');
      } else {
        console.error('Question ' + metabaseQuestionNum + ' failed to import. ' + status.error);
      }
  
      // Add timestamp to the respective cell based on sheetName
      if (sheetName === 'data') {
        var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
        var timestampCell = sheet.getRange("J1");
        timestampCell.setValue(new Date());
      }
      
    } else if (metabaseQuestionNum == 'cancel') {
      console.log('You have canceled.');
    } else {
      console.log('You did not enter a number.');
    }
  }
  
  function getSheetNumbers() {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheets = ss.getSheets();
    var questionNumbers = [];
    for (var i in sheets) {
      var sheetName = sheets[i].getName();
      if (sheetName.indexOf('(metabase/') > -1) {
        var questionMatch = sheetName.match('\(metabase\/[0-9]+\)');
        if (questionMatch !== null) {
          var questionNumber = questionMatch[0].match('[0-9]+')[0];
          if (!isNaN(questionNumber) && questionNumber !== '') {
            questionNumbers.push({
              'questionNumber': questionNumber,
              'sheetName': sheetName
            });
          }
        }
      }
    }
    return questionNumbers;
  }
  
  function getToken(baseUrl, username, password) {
    var sessionUrl = baseUrl + "api/session";
    var options = {
      "method": "post",
      "headers": {
        "Content-Type": "application/json"
      },
      "payload": JSON.stringify({
        username: username,
        password: password
      })
    };
    var response;
    try {
      response = UrlFetchApp.fetch(sessionUrl, options);
    } catch (e) {
      throw (e);
    }
    var token = JSON.parse(response).id;
    return token;
  }
  
  function getQuestionAndFillSheet(baseUrl, token, metabaseQuestionNum, sheetName) {
    var questionUrl = baseUrl + "api/card/" + metabaseQuestionNum + "/query/csv";
  
    var options = {
      "method": "post",
      "headers": {
        "Content-Type": "application/json",
        "X-Metabase-Session": token
      },
      "muteHttpExceptions": true
    };
  
    var response;
    try {
      response = UrlFetchApp.fetch(questionUrl, options);
    } catch (e) {
      return {
        'success': false,
        'error': e
      };
    }
    var statusCode = response.getResponseCode();
  
    if (statusCode == 200 || statusCode == 202) {
      var values = Utilities.parseCsv(response.getContentText());
      try {
        fillSheet(values, sheetName);
        return {
          'success': true
        };
      } catch (e) {
        return {
          'success': false,
          'error': e
        };
      }
    } else if (statusCode == 401) {
      var scriptProp = PropertiesService.getScriptProperties();
      var username = scriptProp.getProperty('USERNAME');
      var password = scriptProp.getProperty('PASSWORD');
  
      var token = getToken(baseUrl, username, password);
      scriptProp.setProperty('TOKEN', token);
      var e = "Error: Could not retrieve question. Metabase says: '" + response.getContentText() + "'. Please try again in a few minutes.";
      return {
        'success': false,
        'error': e
      };
    } else {
      var e = "Error: Could not retrieve question. Metabase says: '" + response.getContentText() + "'. Please try again later.";
      return {
        'success': false,
        'error': e
      };
    }
  }
  
  function fillSheet(values, sheetName) {
    var colLetters = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "AA", "AB", "AC", "AD", "AE", "AF", "AG", "AH", "AI", "AJ", "AK", "AL", "AM", "AN", "AO", "AP", "AQ", "AR", "AS", "AT", "AU", "AV", "AW", "AX", "AY", "AZ", "BA", "BB", "BC", "BD", "BE", "BF", "BG", "BH", "BI", "BJ", "BK", "BL", "BM", "BN", "BO", "BP", "BQ", "BR", "BS", "BT", "BU", "BV", "BW", "BX", "BY", "BZ", "CA", "CB", "CC", "CD", "CE", "CF", "CG", "CH", "CI", "CJ", "CK", "CL", "CM", "CN", "CO", "CP", "CQ", "CR", "CS", "CT", "CU", "CV", "CW", "CX", "CY", "CZ", "DA", "DB", "DC", "DD", "DE", "DF", "DG", "DH", "DI", "DJ", "DK", "DL", "DM", "DN", "DO", "DP", "DQ", "DR", "DS", "DT", "DU", "DV", "DW", "DX", "DY", "DZ", "EA", "EB", "EC", "ED", "EE", "EF", "EG", "EH", "EI", "EJ", "EK", "EL", "EM", "EN", "EO", "EP", "EQ", "ER", "ES", "ET", "EU", "EV", "EW", "EX", "EY", "EZ", "FA", "FB", "FC", "FD", "FE", "FF", "FG", "FH", "FI", "FJ", "FK", "FL", "FM", "FN", "FO", "FP", "FQ", "FR", "FS", "FT", "FU", "FV", "FW", "FX", "FY", "FZ", "GA", "GB", "GC", "GD", "GE", "GF", "GG", "GH", "GI", "GJ", "GK", "GL", "GM", "GN", "GO", "GP", "GQ", "GR", "GS", "GT", "GU", "GV", "GW", "GX", "GY", "GZ", "HA", "HB", "HC", "HD", "HE", "HF", "HG", "HH", "HI", "HJ", "HK", "HL", "HM", "HN", "HO", "HP", "HQ", "HR", "HS", "HT", "HU", "HV", "HW", "HX", "HY", "HZ", "IA", "IB", "IC", "ID", "IE", "IF", "IG", "IH", "II", "IJ", "IK", "IL", "IM", "IN", "IO", "IP", "IQ", "IR", "IS", "IT", "IU", "IV", "IW", "IX", "IY", "IZ", "JA", "JB", "JC", "JD", "JE", "JF", "JG", "JH", "JI", "JJ", "JK", "JL", "JM", "JN", "JO", "JP", "JQ", "JR", "JS", "JT", "JU", "JV", "JW", "JX", "JY", "JZ"];
  
    var sheet;
  
    sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
      var minCol = colLetters[0]; // Start from the first column (A)
      var maxCol = colLetters[values[0].length - 1]; // End at the last column of the data
      var minRow = 1; // Start from the first row
      var maxRow = minRow + values.length - 1;
  
    var range = sheet.getRange(minCol + minRow + ":" + maxCol + maxRow);
    range.setValues(values);
  }
  
  function getQuestionAsCSV(metabaseQuestionNum, sheetName) {
    var scriptProp = PropertiesService.getScriptProperties();
      var baseUrl = scriptProp.getProperty('BASE_URL');
    var username = scriptProp.getProperty('USERNAME');
    var password = scriptProp.getProperty('PASSWORD');
    var token = scriptProp.getProperty('TOKEN');
  
    if (!token) {
      token = getToken(baseUrl, username, password);
      scriptProp.setProperty('TOKEN', token);
    }
  
    status = getQuestionAndFillSheet(baseUrl, token, metabaseQuestionNum, sheetName);
    return status;
  }