(function () {
  'use strict';

  var site = window.STAS_SITE || {};
  var waNumber = /^\d{9,15}$/.test(site.whatsapp || '') ? site.whatsapp : '';

  function waLink(msg) {
    return 'https://wa.me/' + waNumber + '?text=' + encodeURIComponent(msg || site.whatsappGreeting || 'Hello STAS');
  }

  // Mobile nav toggle
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.getElementById('nav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    nav.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        nav.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // Footer year
  var year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  // Fill contact details from js/site-config.js
  document.querySelectorAll('[data-site-text]').forEach(function (el) {
    var v = site[el.getAttribute('data-site-text')];
    if (v) el.textContent = v;
  });
  document.querySelectorAll('[data-site-href]').forEach(function (el) {
    var kind = el.getAttribute('data-site-href');
    if (kind === 'mailto' && site.email) el.href = 'mailto:' + site.email;
    if (kind === 'tel' && site.phone) el.href = 'tel:' + site.phone.replace(/[^\d+]/g, '');
    if (kind === 'whatsapp' && waNumber) {
      el.href = waLink(el.getAttribute('data-wa') || document.body.getAttribute('data-wa'));
      el.target = '_blank'; el.rel = 'noopener';
    }
  });

  // Floating WhatsApp chat button (all pages that load this script)
  if (waNumber) {
    var wa = document.createElement('a');
    wa.className = 'wa-float';
    wa.href = waLink(document.body.getAttribute('data-wa'));
    wa.target = '_blank'; wa.rel = 'noopener';
    wa.setAttribute('aria-label', 'Chat with STAS on WhatsApp');
    wa.innerHTML =
      '<svg viewBox="0 0 24 24" aria-hidden="true" width="28" height="28"><path fill="#fff" d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2z"/>' +
      '<path fill="#25D366" d="M16.5 14.4c-.2-.1-1.3-.7-1.5-.7s-.4-.1-.5.1-.6.7-.7.9-.3.2-.5.1a6 6 0 0 1-3-2.6c-.2-.4.2-.4.6-1.2.1-.1 0-.3 0-.4l-.7-1.6c-.2-.4-.4-.4-.5-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.200 5.200 0 0 0 1.100 2.800 11.900 11.900 0 0 0 4.600 4c.6.3 1.100.4 1.500.5a2.700 2.700 0 0 0 1.200-.1 2.100 2.100 0 0 0 1.400-1c.2-.4.2-.8.1-.9s-.2-.2-.5-.3z"/></svg>' +
      '<span>Chat with us</span>';
    document.body.appendChild(wa);
  }

  // Scroll reveal
  var targets = document.querySelectorAll('.card, .steps li, .mini, .values li, .pillar');
  targets.forEach(function (el) { el.classList.add('reveal'); });
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.12 });
    targets.forEach(function (el) { io.observe(el); });
  } else {
    targets.forEach(function (el) { el.classList.add('in'); });
  }

  // Contact form
  var form = document.getElementById('contact-form');
  var note = document.getElementById('form-note');
  if (form) {
    // Preselect the service when arriving from a service page (?service=...)
    try {
      var wanted = new URLSearchParams(window.location.search).get('service');
      if (wanted) {
        Array.prototype.forEach.call(form.elements.service.options, function (o) {
          if (o.text === wanted) form.elements.service.value = o.value || o.text;
        });
      }
    } catch (e) { /* ignore */ }

    form.addEventListener('input', function (ev) {
      var f = ev.target.closest && ev.target.closest('.field');
      if (f) f.classList.remove('invalid');
    });

    function setNote(text, kind) {
      note.textContent = text;
      note.className = 'form-note' + (kind ? ' ' + kind : '');
    }

    form.addEventListener('submit', function (ev) {
      ev.preventDefault();
      var name = form.elements.name.value.trim();
      var email = form.elements.email.value.trim();
      var service = form.elements.service.value;
      var message = form.elements.message.value.trim();

      var ok = true;
      ['name', 'email', 'message'].forEach(function (id) {
        var field = form.elements[id].closest('.field');
        var bad = !form.elements[id].value.trim();
        if (id === 'email' && !bad) bad = !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.elements[id].value.trim());
        field.classList.toggle('invalid', bad);
        if (bad) ok = false;
      });
      if (!ok) { setNote('Please fill in your name, a valid email and a message.', 'err'); return; }

      var subject = 'Website enquiry: ' + service;

      // Fallback when no form key has been configured yet: open the visitor's email app.
      if (!site.formAccessKey) {
        var body = 'Name: ' + name + '\nEmail: ' + email + '\nInterested in: ' + service + '\n\n' + message;
        window.location.href = 'mailto:' + (site.email || 'stasinfinitysystems@gmail.com') + '?subject=' + encodeURIComponent(subject) +
          '&body=' + encodeURIComponent(body);
        setNote('Opening your email app. If nothing opens, write to ' + (site.email || 'stasinfinitysystems@gmail.com') + ' directly.');
        return;
      }

      var btn = form.querySelector('button[type="submit"]');
      var label = btn.textContent;
      btn.disabled = true; btn.textContent = 'Sending...';
      setNote('');

      fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({
          access_key: site.formAccessKey,
          subject: site.formSubject || subject,
          from_name: 'STAS website',
          name: name,
          email: email,
          service: service,
          message: message,
          botcheck: form.elements.botcheck ? form.elements.botcheck.checked : false
        })
      }).then(function (res) {
        return res.json().then(function (data) { return { ok: res.ok && data.success !== false, data: data }; });
      }).then(function (r) {
        if (!r.ok) throw new Error((r.data && r.data.message) || 'Send failed');
        form.reset();
        setNote('Thank you! Your message has been sent. We will reply as soon as we can.', 'ok');
      }).catch(function () {
        var contact = site.email || 'stasinfinitysystems@gmail.com';
        note.className = 'form-note err';
        note.textContent = 'Sorry, we could not send your message. Please try again, or ';
        var m = document.createElement('a');
        m.href = 'mailto:' + contact + '?subject=' + encodeURIComponent(subject) +
          '&body=' + encodeURIComponent('Name: ' + name + '\nEmail: ' + email + '\n\n' + message);
        m.textContent = 'email us';
        note.appendChild(m);
        if (waNumber) {
          note.appendChild(document.createTextNode(' or '));
          var w = document.createElement('a');
          w.href = waLink('Hello STAS, my name is ' + name + '. ' + message);
          w.target = '_blank'; w.rel = 'noopener';
          w.textContent = 'message us on WhatsApp';
          note.appendChild(w);
        }
        note.appendChild(document.createTextNode('.'));
      }).then(function () {
        btn.disabled = false; btn.textContent = label;
      });
    });
  }
})();
