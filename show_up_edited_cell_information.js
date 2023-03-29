function onEdit(e) {
    const { range, oldValue, user } = e;
    let options = {
       weekday: 'long',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      timeZoneName: 'short',
    };
  
    let date = new Date();
    let dateString = date.toLocaleString('id-ID',options);
  
    if (oldValue !== undefined){
    const note = `Cell ini diedit pada ${dateString} oleh ${user.getEmail()} dengan nilai sebelumnya adalah: ${oldValue}`;
    range.setNote(note);
    }
  }