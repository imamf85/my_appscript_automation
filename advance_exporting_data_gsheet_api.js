function studentAttendance1() {
    getStudentsData(1, 30);
    getAttendanceData(1, 30);
  }
  function studentAttendance2() {
    getStudentsData(30, 60);
    getAttendanceData(30, 60);
  }
  function studentAttendance3() {
    getStudentsData(60, 90);
    getAttendanceData(60, 90);
  }
  function studentAttendance4() {
    getStudentsData(90, 120);
    getAttendanceData(90, 120);
  }
  function studentAttendance5() {
    getStudentsData(120, 150);
    getAttendanceData(120, 150);
  }
  function studentAttendance6() {
    let footprintId = SpreadsheetApp.openById('1ouykR5ELDMxn-OCfLNiBQzpR2W2QO6MHJdiupluSYw8').getSheetByName('2013-2014-SMT2').getDataRange().getValues();
  
    let filteredSlots = footprintId.filter(data => !data[2].includes('CoLearn+') && !data[2].includes('Latihan Bareng') && !data[2].includes('SNBT') && !data[2].includes('Matematika Eksklusif 1') && !data[2].includes('Club') && !data[2].includes('Fondasi'));
  
    getStudentsData(150, filteredSlots.length);
    getAttendanceData(150, filteredSlots.length);
  }
  
  
  function getStudentsData(initial, length) {
    let masterId = "11E8BG8zAqFi7H0lcNqItck5QpMCdFPGIDQfP5mUfXRY";
    let footprintId = SpreadsheetApp.openById('1ouykR5ELDMxn-OCfLNiBQzpR2W2QO6MHJdiupluSYw8').getSheetByName('2013-2014-SMT2').getDataRange().getValues();
    let sheet = SpreadsheetApp.openById(masterId).getSheetByName("students");
    let rowNum = sheet.getLastRow();
  
    let filteredSlots = footprintId.filter(data => !data[2].includes('CoLearn+') && !data[2].includes('Latihan Bareng') && !data[2].includes('SNBT') && !data[2].includes('Matematika Eksklusif 1') && !data[2].includes('Club') && !data[2].includes('Fondasi'));
  
    for (let i = initial; i < length; i++) {
      const ids = filteredSlots[i][5];
      console.log(ids)
      let getFile = SpreadsheetApp.openById(ids);
      const targetStudentsSheet = getFile.getSheetByName('Students List');
      const getSlotOfTheSlot = targetStudentsSheet.getRange(2,2).getValue();
      const getGradeOfTheSlot = targetStudentsSheet.getRange(4, 2).getValue();
      const getSubjectOfTheSlot = targetStudentsSheet.getRange(3, 2).getValue();
      const getCourseOfTheSlot = getFile.getSheetByName('Info').getRange('B6').getValue();
  
      let response = Sheets.Spreadsheets.Values.batchGet(
        masterId, { ranges: ['students!A2:N' + rowNum] });
      let values = response.valueRanges[0].values;
  
      const filteredStudentData = values.filter((data, index) => {
        return index === 0 || data[7].toString() === getGradeOfTheSlot.toString() && (getSlotOfTheSlot.includes('IPA') || getSlotOfTheSlot.includes('Fisika') || getSlotOfTheSlot.includes('Kimia') ? data[4] === getCourseOfTheSlot : data[13] === getSubjectOfTheSlot);
      }).map(data => data.slice(0,13));
  
      let request = {
        'valueInputOption': 'USER_ENTERED',
        'data': [
          {
            'range': 'Students List!A7:M' + (filteredStudentData.length + 7),
            'majorDimension': 'ROWS',
            'values': filteredStudentData
          }
        ]
      };
  
  
      targetStudentsSheet.getRange("A8:M").clearContent();
  
      SpreadsheetApp.flush();
  
      Sheets.Spreadsheets.Values.batchUpdate(request, ids);
    }
  
  }
  
  function getAttendanceData(initial, length) {
    let masterId = "11E8BG8zAqFi7H0lcNqItck5QpMCdFPGIDQfP5mUfXRY";
    let footprintId = SpreadsheetApp.openById('1ouykR5ELDMxn-OCfLNiBQzpR2W2QO6MHJdiupluSYw8').getSheetByName('2013-2014-SMT2').getDataRange().getValues();
    let sheet = SpreadsheetApp.openById(masterId);
    let participatedSheet = sheet.getSheetByName("participated");
    let nonParticipatedSheet = sheet.getSheetByName("non_participated");
    let rowNumForParticipated = participatedSheet.getLastRow();
    let rowNumForNonParticipated = nonParticipatedSheet.getLastRow();
  
    let filteredSlots = footprintId.filter(data => !data[2].includes('CoLearn+') && !data[2].includes('Latihan Bareng') && !data[2].includes('SNBT') && !data[2].includes('Matematika Eksklusif 1') && !data[2].includes('Club') && !data[2].includes('Fondasi'));
  
    for (let i = initial; i < length; i++) {
      const ids = filteredSlots[i][5];
      console.log(ids)
      const targetAttendanceSheet = SpreadsheetApp.openById(ids).getSheetByName('Attendance');
      const getSubjectLocationOfAttendance = targetAttendanceSheet.getRange(2, 2).getValue();
      const getGradeLocationOfAttendance = targetAttendanceSheet.getRange(3, 2).getValue();
      const getSlotLocationOfAttendance = targetAttendanceSheet.getRange(4, 2).getValue();
      const dateFormat = 'MMMM dd, yyyy, hh:mm a';
  
      let rangeChunks = ['participated!A2:N' + rowNumForParticipated, 'non_participated!A2:N' + rowNumForNonParticipated];
      let responses = rangeChunks.map(range => {
        return Sheets.Spreadsheets.Values.batchGet(masterId, { ranges: [range] });
      });
  
      let values = [];
      responses.forEach(response => {
        if (response.valueRanges && response.valueRanges[0] && response.valueRanges[0].values) {
          values = values.concat(response.valueRanges[0].values);
        }
      });
  
      const filteredAttendanceData = values.filter(data => {
        return data[9] === getSubjectLocationOfAttendance && data[10].toString() === getGradeLocationOfAttendance.toString() && data[8] === getSlotLocationOfAttendance;
      }).map(data => {
        data[6] = Utilities.formatDate(new Date(data[6]), 'GMT+7', dateFormat);
        data[11] = Utilities.formatDate(new Date(data[11]), 'GMT+7', dateFormat);
        data[12] = Utilities.formatDate(new Date(data[12]), 'GMT+7', dateFormat);
        return data;
      });
  
      let request = {
        'valueInputOption': 'USER_ENTERED',
        'data': [
          {
            'range': 'Attendance!A7:N' + (filteredAttendanceData.length + 7),
            'majorDimension': 'ROWS',
            'values': filteredAttendanceData
          }
        ]
      };
  
  
      targetAttendanceSheet.getRange("A7:N").clearContent();
  
      SpreadsheetApp.flush();
  
      Sheets.Spreadsheets.Values.batchUpdate(request, ids);
    }
  
  }