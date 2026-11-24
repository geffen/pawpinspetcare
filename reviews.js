// Testimonials carousel, shared by the home page and the card page (/hi/).
// To change the reviews, edit this list. Keep each quote short (one or two
// sentences) so slides stay a similar height. Order = display order.
// Order alternates sites and topics: shy cats, first-timers, medication, dogs, sick pets, repeat clients.
var REVIEWS = [
  { quote: 'Louise managed to make meaningful contact every day… with our shy-est girl', name: 'Kristy', source: 'Meowtel' },
  { quote: 'This was my first time hiring a sitter for my boy… thank you for putting my mind at ease!', name: 'Hope G.', source: 'Rover' },
  { quote: 'Lou was able to consistently administer the medication(s), keep our kitties comfortable, give them tons of playtime, and send us loads of updates!', name: 'Sarah', source: 'Meowtel' },
  { quote: 'This is the second time we’ve left our sweet pup with Louise… Remy looks forward to seeing her again soon!!', name: 'Catherine D.', source: 'Rover' },
  { quote: 'Louise was incredibly helpful in dealing with our sick cat while we were away… We will absolutely hire her again.', name: 'Kimberley', source: 'Meowtel' },
  { quote: 'Louise is a great sitter! I trust her completely with my cats!', name: 'Jessica', source: 'Meowtel' }
];

(function () {
  var root = document.querySelector('[data-reviews]');
  if (!root || !REVIEWS.length) return;

  var INTERVAL = 6000;
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Build slides
  var track = document.createElement('div');
  track.className = 'reviews-track';
  track.setAttribute('aria-live', 'off');
  REVIEWS.forEach(function (r, i) {
    var fig = document.createElement('figure');
    fig.className = 'review' + (i === 0 ? ' is-active' : '');
    fig.setAttribute('role', 'group');
    fig.setAttribute('aria-roledescription', 'slide');
    fig.setAttribute('aria-label', (i + 1) + ' of ' + REVIEWS.length);
    if (i !== 0) fig.setAttribute('aria-hidden', 'true');
    var q = document.createElement('blockquote');
    q.textContent = '“' + r.quote + '”';
    var c = document.createElement('figcaption');
    c.textContent = r.name + (r.source ? ', ' + r.source + ' review' : '');
    fig.appendChild(q); fig.appendChild(c);
    track.appendChild(fig);
  });

  root.innerHTML = '';
  root.setAttribute('role', 'region');
  root.setAttribute('aria-roledescription', 'carousel');
  root.setAttribute('aria-label', 'Client reviews');
  root.appendChild(track);

  var slides = track.children;
  if (slides.length < 2) return; // one review: no dots, no rotation

  // Dots
  var dots = document.createElement('div');
  dots.className = 'reviews-dots';
  for (var i = 0; i < slides.length; i++) {
    var b = document.createElement('button');
    b.type = 'button';
    b.setAttribute('aria-label', 'Show review ' + (i + 1));
    if (i === 0) b.setAttribute('aria-current', 'true');
    b.addEventListener('click', (function (n) { return function () { go(n); restart(); }; })(i));
    dots.appendChild(b);
  }
  root.appendChild(dots);

  var current = 0, timer = null, paused = false;

  function go(n) {
    n = (n + slides.length) % slides.length;
    if (n === current) return;
    slides[current].classList.remove('is-active');
    slides[current].setAttribute('aria-hidden', 'true');
    dots.children[current].removeAttribute('aria-current');
    current = n;
    slides[current].classList.add('is-active');
    slides[current].removeAttribute('aria-hidden');
    dots.children[current].setAttribute('aria-current', 'true');
  }
  function start() {
    if (reduceMotion || paused || timer) return;
    timer = setInterval(function () { go(current + 1); }, INTERVAL);
  }
  function stop() { clearInterval(timer); timer = null; }
  function restart() { stop(); start(); }

  // Pause while someone is reading, hovering, focused inside, or the tab is hidden
  root.addEventListener('mouseenter', function () { paused = true; stop(); });
  root.addEventListener('mouseleave', function () { paused = false; start(); });
  root.addEventListener('focusin', function () { paused = true; stop(); track.setAttribute('aria-live', 'polite'); });
  root.addEventListener('focusout', function () { paused = false; start(); track.setAttribute('aria-live', 'off'); });
  document.addEventListener('visibilitychange', function () { document.hidden ? stop() : start(); });

  // Swipe on phones
  var x0 = null;
  track.addEventListener('touchstart', function (e) { x0 = e.touches[0].clientX; }, { passive: true });
  track.addEventListener('touchend', function (e) {
    if (x0 === null) return;
    var dx = e.changedTouches[0].clientX - x0;
    if (Math.abs(dx) > 40) { go(current + (dx < 0 ? 1 : -1)); restart(); }
    x0 = null;
  });

  start();
})();
