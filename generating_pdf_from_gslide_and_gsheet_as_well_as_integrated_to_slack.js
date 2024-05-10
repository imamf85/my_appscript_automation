const options = { day: "numeric", month: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit", second: "2-digit" };
const timestamp = new Date().toLocaleDateString("id-ID", options);
const webhook = 'https://hooks.slack.com/services/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';

function fileInitialization() {
  let file = DriveApp.getFileById('1aarNW8zfyitlG-httvaqWsD03AOrb49qW6K_dUFzHiY');
  let copy_file_id = file.makeCopy().getId();
  ssToFm(copy_file_id);
  let getCopyFile = DriveApp.getFileById(copy_file_id);
  let pdfInitialization = getCopyFile.getAs('application/pdf').setName(`Jadwal Bimbel (Semester 1  - 2024/2025) - last updated: ${timestamp}`);
  let pdf_converted = DriveApp.getFolderById('12UR6mvpvKyVQJnBVuaB1e35bBvPm6W6o').createFile(pdfInitialization);
  let pdf_id = pdf_converted.getId();
  let pdf_url = pdf_converted.getUrl();
  DriveApp.getFileById(pdf_id).setSharing(DriveApp.Access.DOMAIN, DriveApp.Permission.VIEW);
  let payload = messageTemplate(pdf_url);
  sendAlertToSlack(webhook, payload);
  getCopyFile.setTrashed(true);
}

function removeRowOfTable(table, data) {
  data.forEach(() => {
    let lastPositionOfRows = table.getNumRows();
    if (lastPositionOfRows > 2) {
      table.getRow(lastPositionOfRows - 1).remove();
    }
  });
}

function updateData(table, data) {
  data.forEach((row, i) => {
    let lastPositionOfRows = table.getNumRows();
    if (i < data.length - 1) {
      table.insertRow(lastPositionOfRows);
    }
    row.forEach((cell, j) => {
      table.getCell(i + 1, j).getText().setText(cell);
    })
  })
}

function ssToFm(slide_id) {
  const ss = SpreadsheetApp.openById('1RQzCK6dgn5kCNRUiChVqRYePHitk827rkHNXhzraC0U');
  const values = ss.getSheetByName('Tracker').getDataRange().getValues();
  const gslide = SlidesApp.openById(slide_id);
  let slides = gslide.getSlides().map(slide => slide.getObjectId()).filter(id => !id.includes('API'));
  let countValue = 0;
  let uniqueGrades = [...new Set(values.slice(3).map(row => row[2]).filter(row => row[2] !== ''))].sort((a, b) => {
    return b - a
  });

  let data = values.slice(3).map(row => {
    return [row[2], row[3], row[4], row[1], row[5], row[6], row[11]]
  }).filter(row => row[6] > 0).sort((a, b) => {
    let [gradeA, subjectA, , slotNumberA, ...restA] = a;
    let [gradeB, subjectB, , slotNumberB, ...restB] = b;

    let convertedNumberSlotA = parseInt(slotNumberA);
    let convertedNumberSlotB = parseInt(slotNumberB);
    let convertedGradeA = parseInt(gradeA);
    let convertedGradeB = parseInt(gradeB);

    if (convertedGradeA !== convertedGradeB) {
      return convertedGradeA - convertedGradeB;
    }
    if (subjectA.includes('Matematika') && !subjectB.includes('Matematika')) {
      return -1;
    } else if (!subjectA.includes('Matematika') && subjectB.includes('Matematika')) {
      return 1;
    }
    return convertedNumberSlotA - convertedNumberSlotB;
  });

  let grades_subjects_curriculums = values.slice(3).map(row => {
    return [row[2], row[3], row[4]];
  });

  let uniqueInitialization = new Set(grades_subjects_curriculums.map(value => JSON.stringify(value)));

  let uniqueArray = Array.from(uniqueInitialization).map(value => JSON.parse(value));

  let reorderUniqueArray = uniqueArray.sort((a, b) => {
    if (a.includes('Matematika') && !b.includes('Matematika')) {
      return 1
    } else if (!a.includes('Matematika') && b.includes('Matematika')) {
      return -1
    } return 0
  });

  uniqueGrades.forEach(grade => {
    uniqueArray.forEach(row => {
      if (row[0] === grade) {
        countValue++;
      }
    });
    inputDataToSlide(gslide, reorderUniqueArray, grade, countValue, data, slides);
  });

  removeTempSlides(gslide, slides);
  gslide.saveAndClose();
}

function inputDataToSlide(gslide, reorderUniqueArray, grade, countValue, data, slides) {
  let [sd, smp, sma] = slides;
  let conditionalGrade = grade === '4' || grade === '5' || grade === '6' ? sd : (grade === '7' || grade === '8' || grade === '9' ? smp : sma);

  reorderUniqueArray.forEach(row => {
    let grades = row[0];
    let subjects = row[1];
    let curriculums = row[2];
    if (grades === grade) {
      let duplicateAndGetId = gslide.getSlideById(conditionalGrade).duplicate().getObjectId();
      if (countValue > 1) {
        let copy_slide_id = duplicateAndGetId;
        let elements = gslide.getSlideById(copy_slide_id).getPageElements();
        elements.forEach(e => {
          if (e.getPageElementType() === SlidesApp.PageElementType.SHAPE) {
            gslide.getSlideById(copy_slide_id).replaceAllText('x', grades);
            gslide.getSlideById(copy_slide_id).replaceAllText('y', curriculums);
            gslide.getSlideById(copy_slide_id).replaceAllText('z', subjects);
            gslide.getSlideById(copy_slide_id).replaceAllText('timestamp', `last updated: ${timestamp}`)
          }
          if (e.getPageElementType() === SlidesApp.PageElementType.TABLE) {
            let getTable = e.asTable();
            let tableData = data.filter((row) => row[0] === grades && row[1] === subjects && row[2] === curriculums).map(row => row.slice(3));
            removeRowOfTable(getTable, tableData);
            updateData(getTable, tableData);
          }

        })
      } else {
        let copy_slide_id = duplicateAndGetId;
        let elements = gslide.getSlideById(copy_slide_id).getPageElements();
        elements.forEach(e => {
          if (e.getPageElementType() === SlidesApp.PageElementType.SHAPE) {
            gslide.getSlideById(copy_slide_id).replaceAllText('x', grades);
            gslide.getSlideById(copy_slide_id).replaceAllText('y', curriculums);
            gslide.getSlideById(copy_slide_id).replaceAllText('z', subjects);
            gslide.getSlideById(copy_slide_id).replaceAllText('timestamp', `last updated: ${timestamp}`)
          }
          if (e.getPageElementType() === SlidesApp.PageElementType.TABLE) {
            let getTable = e.asTable();
            let tableData = data.filter((row) => row[0] === grades && row[1] === subjects && row[2] === curriculums).map(row => row.slice(3));
            removeRowOfTable(getTable, tableData);
            updateData(getTable, tableData);
          }
        });
      }
    }
  });
}

function removeTempSlides(gslide, slides) {
  slides.forEach(slide => {
    gslide.getSlideById(slide).remove();
  })
}

function messageTemplate(jadwal_belajar_pdf) {
  let payload = {
    "blocks": [
      {
        "type": "section",
        "text": {
          "type": "mrkdwn",
          "text": 'Hi @channel :wave:\n`' + timestamp + '`'
        }
      },
      {
        "type": "section",
        "text": {
          "type": "mrkdwn",
          "text": `We just updated the class schedule for each grade in the following file: \n*<${jadwal_belajar_pdf}|jadwal_belajar>*`
        }
      },
      {
        "type": "divider"
      },
      {
        "type": "context",
        "elements": [
          {
            "type": "mrkdwn",
            "text": ":pushpin: *you do not need to download this PDF.* if you downloaded, please do not use that more than 1 day after, due to we will give you new PDF in daily basis"
          }
        ]
      },
    ]
  };
  return payload;
}

function sendAlertToSlack(webhook, payload) {
  const ss = SpreadsheetApp.openById('1RQzCK6dgn5kCNRUiChVqRYePHitk827rkHNXhzraC0U');
  let message_sheet = ss.getSheetByName('send_pdf_messages');
  let options = {
    "method": "post",
    "contentType": "application/json",
    "muteHttpExceptions": true,
    "payload": JSON.stringify(payload)
  }
  try {
    UrlFetchApp.fetch(webhook, options);
    message_sheet.appendRow([payload.blocks[0].text.text, new Date()]);
  } catch (e) {
    console.log(e)
  }
}

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

