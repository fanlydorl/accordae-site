// ACCORDAE · script partagé
(function () {
  var body = document.body;

  // Menu burger
  var burger = document.querySelector('.burger');
  var nav = document.getElementById('nav');
  function closeNav() { body.classList.remove('nav-open'); if (burger) { burger.setAttribute('aria-expanded', 'false'); burger.setAttribute('aria-label', 'Ouvrir le menu'); } }
  if (burger && nav) {
    burger.addEventListener('click', function () {
      var open = body.classList.toggle('nav-open');
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
      burger.setAttribute('aria-label', open ? 'Fermer le menu' : 'Ouvrir le menu');
    });
    nav.addEventListener('click', function (e) { if (e.target.closest('a')) closeNav(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeNav(); });
  }

  // Année du pied de page
  document.querySelectorAll('[data-annee]').forEach(function (el) { el.textContent = new Date().getFullYear(); });

  // Accueil : onglets 01 à 04 + pastilles
  var tabs = Array.prototype.slice.call(document.querySelectorAll('.tab'));
  if (tabs.length) {
    var bulles = document.querySelectorAll('.bulle[data-tab]');
    var timers = [];
    var select = function (i) {
      tabs.forEach(function (t, k) {
        t.setAttribute('aria-selected', k === i ? 'true' : 'false');
        t.tabIndex = k === i ? 0 : -1;
        document.getElementById(t.getAttribute('aria-controls')).hidden = k !== i;
      });
      bulles.forEach(function (b) { b.classList.toggle('is-active', +b.dataset.tab === i); });
    };
    var stopIntro = function () { timers.forEach(clearTimeout); timers = []; };
    tabs.forEach(function (t, i) {
      t.addEventListener('click', function () { stopIntro(); select(i); });
      t.addEventListener('keydown', function (e) {
        var d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
        if (!d) return;
        e.preventDefault(); stopIntro();
        var n = (i + d + tabs.length) % tabs.length; select(n); tabs[n].focus();
      });
    });
    bulles.forEach(function (b) { b.addEventListener('click', function () { stopIntro(); select(+b.dataset.tab); }); });
    // petit tour d'introduction
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      [1, 2, 3, 0].forEach(function (t, k) { timers.push(setTimeout(function () { select(t); }, 700 + k * 1000)); });
    }
  }

  // Accordéons (offres, questions) : un seul ouvert à la fois
  var accs = Array.prototype.slice.call(document.querySelectorAll('.acc'));
  accs.forEach(function (acc) {
    var head = acc.querySelector('.acc__head');
    var panel = document.getElementById(head.getAttribute('aria-controls'));
    head.addEventListener('click', function () {
      var willOpen = head.getAttribute('aria-expanded') !== 'true';
      accs.forEach(function (o) {
        var h = o.querySelector('.acc__head');
        h.setAttribute('aria-expanded', 'false');
        document.getElementById(h.getAttribute('aria-controls')).hidden = true;
        o.classList.remove('is-open');
      });
      if (willOpen) { head.setAttribute('aria-expanded', 'true'); panel.hidden = false; acc.classList.add('is-open'); }
    });
  });

})();
