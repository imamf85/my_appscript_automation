function getCalenderOfColearn() {
    let target = SpreadsheetApp.openById('1kcluW8CbE-HK1XPMGDVbrRh9ae7j3gr6fgU3ycXVzBA');
    let targetSheet = target.getSheetByName('holiday_data');
    let today = new Date();
    let tomorrow = new Date(today.getTime() + 9 * 30 * 24 * 60 * 60 * 1000);
    let excludeHolidays = ['Diwali', 'Joint Holiday for Waisak Day', 'Batik Day', 'Father\'s Day', 'Teacher\'s Day', 'Mother\'s Day', 'Boxing Day', 'Joint Holiday for Idul Adha', 'Joint Holiday after Ascension Day', 'Kartini Day'];
  
    let calendar = CalendarApp.getCalendarById('en.indonesian#holiday@group.v.calendar.google.com')
      .getEvents(today, tomorrow).filter(data => {
        return !excludeHolidays.some(day => data.getTitle().includes(day))
      });
    let calendarBucket = [];
  
  
    for (let event of calendar) {
      let eventTitle = event.getTitle();
      let eventDate = new Date(event.getAllDayStartDate()).toLocaleDateString();
      let eventDay = new Date(event.getAllDayStartDate()).toLocaleDateString("id-ID", { weekday: 'long' })
  
      calendarBucket.push([eventTitle, eventDate, eventDay])
    }
  
    targetSheet.getRange("A2:C").clearContent();
    SpreadsheetApp.flush();
    targetSheet.getRange(2, 1, calendarBucket.length, calendarBucket[0].length).setValues(calendarBucket);
  }
  
  function getDataForReminder() {
    let webhook = "https://hooks.slack.com/services/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";
    let options = { "day": "numeric", "month": "long", "year": "numeric" };
    let today = new Date();
    let sevenDaysPlus = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    let oneDayAfterToday = new Date(today.getTime() + 1 * 24 * 60 * 60 * 1000).toLocaleDateString("id-ID", options);
    let oneWeekAfterToday = sevenDaysPlus.toLocaleDateString("id-ID", options);
    let getSs = SpreadsheetApp.openById('1kcluW8CbE-HK1XPMGDVbrRh9ae7j3gr6fgU3ycXVzBA');
    let getSheet = getSs.getSheetByName('holiday_data');
    let getReminderData = getSs.getSheetByName('reminder');
    let getDataHolidays = getSheet.getDataRange().getValues();
  
    for (let i = 1; i < getDataHolidays.length; i++) {
      let convertedToDate = new Date(getDataHolidays[i][1]).toLocaleDateString("id-ID", options);
      let getDays = getDataHolidays[i][2];
      let getEventName = getDataHolidays[i][3];
      let getOneWeekNote = getDataHolidays[i][4];
      let getLessOneDayNote = getDataHolidays[i][5];
  
      if (today.toLocaleDateString("id-ID", options) !== convertedToDate && getDays !== 'Sabtu') {
        let filteredByEventName = getDataHolidays.filter(data => data[3] === getEventName);
        let dates = filteredByEventName.map(data => data[1]);
        let singleDate = new Date(dates).toLocaleDateString("id-ID", options);
        let getMin = new Date(Math.min(...dates)).getDate();
        let getMax = new Date(Math.max(...dates)).toLocaleDateString("id-ID", options);
        let rangeDate = `${getMin}-${getMax}`;
        let conditionalForDateRange = filteredByEventName.length > 1 ? rangeDate : singleDate;
  
        if (getOneWeekNote === '' && oneWeekAfterToday === convertedToDate) {
          let payload = getPayload(7, conditionalForDateRange, getEventName);
          sendReminderToSlack(webhook, payload);
          getReminderData.appendRow([getEventName, new Date().getFullYear(), new Date(), 'one_week_before_reminder'])
        } else if (getLessOneDayNote === '' && oneDayAfterToday === convertedToDate) {
          let payload = getPayload(1, conditionalForDateRange, getEventName);
          sendReminderToSlack(webhook, payload);
          getReminderData.appendRow([getEventName, new Date().getFullYear(), new Date(), 'less_day_1_reminder'])
        }
  
      }
    }
  
  }
  
  function getPayload(count, day, getEventName) {
    let payload = {
      "blocks": [
        {
          "type": "section",
          "text": {
            "type": "mrkdwn",
            "text": "_Libur tlah Tiba.. Hatiiiku gembiraaa_ :notes:"
          }
        },
        {
          "type": "section",
          "text": {
            "type": "mrkdwn",
            "text": count + " hari lagi, `" + day + "` akan ada `" + getEventName + "`"
          }
        },
        {
          "type": "section",
          "text": {
            "type": "mrkdwn",
            "text": "Biar liburmu makin asik, pastikan hal-hal berikut udah kamu lakuin:"
          }
        },
        {
          "type": "section",
          "text": {
            "type": "mrkdwn",
            "text": ":white_check_mark:  Menghapus semua kelas pada hari tersebut @tim_ajar \n :white_check_mark:  Kelas pengganti udah ready @tim_ajar \n :white_check_mark:  Aktifkan status slack, agar tidak ada huddle misterius @tim_ajar \n :white_check_mark:  Pastikan data upcoming class tidak tersedia pada hari tersebut @dataopslive"
          }
        },
        {
          "type": "section",
          "text": {
            "type": "mrkdwn",
            "text": "Kalau udah amansa, yoook siap siap kita LIBURAAAAAN. \n See you :wave: :holiyay:"
          }
        }
      ]
    };
  
    return payload
  }
  
  function sendReminderToSlack(webhook, payload) {
    let options = {
      "method": "post",
      "contentType": "application/json",
      "muteHttpExceptions": true,
      "payload": JSON.stringify(payload)
    };
  
    try {
      UrlFetchApp.fetch(webhook, options);
    } catch (e) {
      console.log(e)
    }
  
  }
  
  