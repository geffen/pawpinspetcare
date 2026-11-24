// Builds the pre-filled emails behind the meet & greet and availability buttons.
// Each link has a plain mailto: fallback in its href; this fills in subject and body.
(function () {
  var TO = 'louise@pawpinspetcare.com';
  var TEMPLATES = {
    meet: {
      subject: 'Meet & greet request',
      body: [
        "I'd love to set up a meet & greet.",
        '',
        'My name:',
        'My pet(s) (name, species, age):',
        'Any special needs or medications:',
        'Type of care I am looking for (drop-in visits / overnight sitting / boarding):',
        'My neighborhood:',
        'Days and times that work for a meet & greet:'
      ]
    },
    availability: {
      subject: 'Checking your availability',
      body: [
        'Are you available for the following?',
        '',
        'Dates (start to end):',
        'Type of care (drop-in visits / overnight sitting / boarding):',
        'Visits per day (for drop-ins):',
        'My pet(s) (name, species, age):',
        'My neighborhood:',
        '',
        "(If we haven't done a meet & greet yet, I understand we'll start with one.)"
      ]
    }
  };
  var links = document.querySelectorAll('a[data-mail]');
  for (var i = 0; i < links.length; i++) {
    var a = links[i], t = TEMPLATES[a.getAttribute('data-mail')];
    if (!t) continue;
    var intro = a.getAttribute('data-intro');
    var lines = ['Hi Louise,', ''];
    if (intro) lines.push(intro, '');
    lines = lines.concat(t.body, '', 'Thanks!');
    a.href = 'mailto:' + TO +
      '?subject=' + encodeURIComponent(t.subject) +
      '&body=' + encodeURIComponent(lines.join('\n'));
  }

  // After someone opens an email link on the home page, move the site to the
  // card welcome page (/hi/). The short delay lets the email app open first.
  var onCardPage = /\/hi\/?(index\.html)?$/.test(location.pathname);
  if (!onCardPage) {
    document.addEventListener('click', function (e) {
      var a = e.target.closest && e.target.closest('a[href^="mailto:"]');
      if (!a || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      setTimeout(function () {
        location.href = new URL('hi/?from=email', location.href).href;
      }, 700);
    });
  }

  // On the card page, arriving from an email link: show the address in case
  // the visitor's email app didn't open, then tidy the URL.
  if (onCardPage && /[?&]from=email\b/.test(location.search)) {
    var main = document.querySelector('main');
    if (main) {
      var note = document.createElement('p');
      note.className = 'notice';
      note.setAttribute('role', 'status');
      note.innerHTML = 'Your email to Louise should have opened. If it didn’t, write to ' +
        '<a href="mailto:' + TO + '">' + TO + '</a>.';
      main.insertBefore(note, main.firstChild);
    }
    if (history.replaceState) history.replaceState(null, '', location.pathname);
  }
})();
