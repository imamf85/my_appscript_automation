function duplicateSheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheetToDuplicate = ss.getSheetByName("Template Day to Day"); //Sheet yang mau diduplikasi
  var sheetNames = [];
  
  // kode di bawah ini untuk membuat data sheet dengan format dd/mm dalam bentuk array
  for (var i = 1; i <= 30; i++) {
    var date = new Date("04/" + i + "/2023");
    var sheetName = Utilities.formatDate(date, ss.getSpreadsheetTimeZone(), "dd/MM");
    sheetNames.push(sheetName);
  }
  
  // Kode di bawah ini untuk menduplikasi sheet dan mengubah nama-nama sheetnya sesuai dengan format yang sudah ditentukan
  for (var i = 0; i < sheetNames.length; i++) {
    var newSheet = sheetToDuplicate.copyTo(ss);
    newSheet.setName(sheetNames[i]);
  }
}

