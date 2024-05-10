function updateSlots() {
    let ss = SpreadsheetApp.getActive();
    let values = ss.getSheetByName('Tracker').getDataRange().getValues();
    let slots = values.slice(3).filter(row => row[0] !== '' && row[11] > 0).map(value => value[0])
      .sort((a, b) => {
        const [gradeA, subjectA, , indexA] = a.split(' ');
        const [gradeB, subjectB, , indexB] = b.split(' ');
  
        let numericGradeA = parseInt(gradeA);
        let numericGradeB = parseInt(gradeB);
        let numericIndexA = parseInt(indexA);
        let numericIndexB = parseInt(indexB);
  
        if (numericGradeA !== numericGradeB) {
          return numericGradeA - numericGradeB;
        }
  
        if (subjectA !== subjectB) {
          return subjectA.localeCompare(subjectB);
        }
  
        return numericIndexA - numericIndexB;
      });
  
    let fm = FormApp.openById('1DzGwyrmR8oUcY1FBJ2V16oXkk2ygeNMNQpw-_QTUyuY');
    fm.getItems().forEach(item => {
      let title = item.getTitle();
      if (title === 'Slot Name') {
        item.asMultipleChoiceItem().setChoiceValues([...new Set(slots)])
      }
    })
  }