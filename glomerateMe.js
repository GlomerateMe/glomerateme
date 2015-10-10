function glomerateMe() {
  var threads    = GmailApp.getInboxThreads();
  var glomerates = [];

  // Go through each thread in our inbox
  for (var i = 0; i < threads.length; i++) {
    var thread = threads[i];
    var emails = thread.getMessages();

    // Go through each email in the thread
    for (var j = 0; j < emails.length; j++) {
      var email = emails[j];
      var to    = email.getTo();

      var plus      = (to.indexOf("+") == -1) ? 0 : (to.indexOf("+") + 1);
      var recipient = to.substr(plus, (to.indexOf("@") - plus)); // Get just the Group ID from the 'to' field

      if (glomerates[recipient] == undefined) {
        // Create an array for that glomerate
        glomerates[recipient] = [];
      }

      // Get a dictionary with the sender's email address, subject, body
      var temp = {from: email.getFrom(), subject: email.getSubject(), body: email.getBody()};
      glomerates[recipient].push(temp);
    }

    // Move the thread to trash since we don't need it anymore
    thread.markRead();
    thread.moveToTrash();
  }

  // Now we go through each of the threads we found
  for (id in glomerates) {
    var subject = "Glomerate.Me - " + id;
    var body    = "";
    var emails  = [];

    // Build the HTML body of the email we're going to send out
    for (var i = 0; i < glomerates[id].length; i++) {
      var thread = glomerates[id][i];

      body += "<br /><br /><strong>" + thread['subject'] + "</strong><br />" + thread['body'] + "<br /><hr />";
      emails.push(thread['from']);
    }

    // Send out the emails!
    for (var i = 0; i < emails.length; i++) {
      if (!emails[i].equalsIgnoreCase("glomerateme@gmail.com")) {
        GmailApp.sendEmail(emails[i], subject, body, {htmlBody: body, noReply: true});
      }
    }
  }
}
