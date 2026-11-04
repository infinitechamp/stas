(function () {
  'use strict';

  var cfg = window.STAS_PAYMENTS || {};
  var site = window.STAS_SITE || {};
  var form = document.getElementById('pay-form');
  var methodsBox = document.getElementById('methods');
  var setup = document.getElementById('setup-notice');
  var result = document.getElementById('pay-result');
  var note = document.getElementById('pay-note');
  if (!form) return;

  var cur = cfg.currency || 'KES';
  document.querySelectorAll('.cur').forEach(function (el) { el.textContent = cur; });

  function isHttps(u) { return typeof u === 'string' && /^https:\/\//i.test(u); }
  function el(tag, cls, text) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text != null) e.textContent = text;
    return e;
  }
  function money(n) {
    return cur + ' ' + Number(n).toLocaleString('en-KE', { maximumFractionDigits: 2 });
  }

  // Build the list of methods that are actually configured
  var methods = [];
  if (isHttps(cfg.checkoutUrl)) {
    methods.push({ id: 'checkout', title: cfg.checkoutLabel || 'Pay with M-Pesa or card', desc: 'Secure online checkout. Recommended.' });
  }
  if (cfg.mpesa && cfg.mpesa.number && (cfg.mpesa.type === 'paybill' || cfg.mpesa.type === 'till')) {
    methods.push({ id: 'mpesa', title: 'M-Pesa ' + (cfg.mpesa.type === 'paybill' ? 'Paybill' : 'Till'), desc: 'Pay from your phone menu.' });
  }
  if (cfg.bank && cfg.bank.accountNumber) {
    methods.push({ id: 'bank', title: 'Bank transfer', desc: 'Pay from your bank or mobile banking.' });
  }
  if (isHttps(cfg.paypalUrl)) {
    methods.push({ id: 'paypal', title: 'PayPal / international', desc: 'For payments from outside Kenya.' });
  }

  if (!methods.length) {
    setup.hidden = false;
    return;
  }
  form.hidden = false;

  methods.forEach(function (m, i) {
    var label = el('label', 'method');
    var input = el('input');
    input.type = 'radio'; input.name = 'method'; input.value = m.id;
    if (i === 0) input.checked = true;
    var body = el('span', 'method-body');
    body.appendChild(el('strong', null, m.title));
    body.appendChild(el('small', null, m.desc));
    label.appendChild(input); label.appendChild(body);
    methodsBox.appendChild(label);
  });

  function copyRow(labelText, value) {
    var row = el('div', 'copy-row');
    row.appendChild(el('span', 'copy-label', labelText));
    row.appendChild(el('code', 'copy-value', value));
    var btn = el('button', 'copy-btn', 'Copy');
    btn.type = 'button';
    btn.addEventListener('click', function () {
      try {
        navigator.clipboard.writeText(value).then(function () {
          btn.textContent = 'Copied';
          setTimeout(function () { btn.textContent = 'Copy'; }, 1500);
        });
      } catch (e) { btn.textContent = 'Select and copy'; }
    });
    row.appendChild(btn);
    return row;
  }

  function summary(d) {
    var box = el('div', 'summary');
    [['Name', d.name], ['Reference', d.ref], ['Amount', money(d.amount)]].forEach(function (p) {
      var r = el('div', 'summary-row');
      r.appendChild(el('span', null, p[0]));
      r.appendChild(el('strong', null, p[1]));
      box.appendChild(r);
    });
    return box;
  }

  function confirmLinks(d) {
    var wrap = el('div', 'confirm');
    wrap.appendChild(el('h3', null, 'After you have paid'));
    wrap.appendChild(el('p', null, 'Send us a quick confirmation so we can match your payment.'));
    var msg = 'Hello STAS, I have paid ' + money(d.amount) + ' for ' + d.ref + '. Name: ' + d.name + '.';
    var actions = el('div', 'hero-cta');
    if (site.whatsapp && /^\d{9,15}$/.test(site.whatsapp)) {
      var wa = el('a', 'btn btn-gold btn-sm', 'Confirm on WhatsApp');
      wa.href = 'https://wa.me/' + site.whatsapp + '?text=' + encodeURIComponent(msg);
      wa.target = '_blank'; wa.rel = 'noopener';
      actions.appendChild(wa);
    }
    var mail = el('a', 'btn btn-ghost-dark btn-sm', 'Confirm by email');
    mail.href = 'mailto:' + (site.email || 'stasinfinitysystems@gmail.com') + '?subject=' +
      encodeURIComponent('Payment confirmation: ' + d.ref) + '&body=' + encodeURIComponent(msg);
    actions.appendChild(mail);
    wrap.appendChild(actions);
    return wrap;
  }

  function show(d, method) {
    result.textContent = '';
    result.appendChild(el('h2', 'form-title', 'Complete your payment'));
    result.appendChild(summary(d));

    if (method === 'checkout') {
      result.appendChild(el('p', null, 'Click below to open our secure checkout. Please enter ' + d.ref + ' as the reference if asked.'));
      var go = el('a', 'btn btn-gold', 'Continue to secure checkout');
      go.href = cfg.checkoutUrl; go.target = '_blank'; go.rel = 'noopener noreferrer';
      result.appendChild(go);
    } else if (method === 'mpesa') {
      var t = cfg.mpesa.type === 'paybill' ? 'Paybill' : 'Till';
      var ol = el('ol', 'pay-steps');
      var steps = cfg.mpesa.type === 'paybill'
        ? ['Open M-Pesa and choose Lipa na M-Pesa, then Paybill.', 'Enter the business number below.', 'Enter ' + d.ref + ' as the account number.', 'Enter the amount and your M-Pesa PIN.']
        : ['Open M-Pesa and choose Lipa na M-Pesa, then Buy Goods and Services.', 'Enter the till number below.', 'Enter the amount and your M-Pesa PIN.'];
      steps.forEach(function (s) { ol.appendChild(el('li', null, s)); });
      result.appendChild(ol);
      result.appendChild(copyRow(t + ' number', cfg.mpesa.number));
      if (cfg.mpesa.type === 'paybill') result.appendChild(copyRow('Account number', d.ref));
      result.appendChild(copyRow('Amount', String(d.amount)));
      if (cfg.mpesa.businessName) result.appendChild(el('p', 'small', 'Business name shown: ' + cfg.mpesa.businessName));
    } else if (method === 'bank') {
      var b = cfg.bank;
      if (b.bankName) result.appendChild(copyRow('Bank', b.bankName));
      if (b.accountName) result.appendChild(copyRow('Account name', b.accountName));
      result.appendChild(copyRow('Account number', b.accountNumber));
      if (b.branch) result.appendChild(copyRow('Branch', b.branch));
      result.appendChild(copyRow('Payment reference', d.ref));
    } else if (method === 'paypal') {
      result.appendChild(el('p', null, 'Use the link below and include ' + d.ref + ' in the note.'));
      var pp = el('a', 'btn btn-gold', 'Continue to PayPal');
      pp.href = cfg.paypalUrl; pp.target = '_blank'; pp.rel = 'noopener noreferrer';
      result.appendChild(pp);
    }

    result.appendChild(confirmLinks(d));
    var back = el('button', 'link-btn', 'Change details');
    back.type = 'button';
    back.addEventListener('click', function () {
      result.hidden = true; form.hidden = false; form.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
    result.appendChild(back);

    form.hidden = true; result.hidden = false;
    result.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  form.addEventListener('input', function (ev) {
    var f = ev.target.closest && ev.target.closest('.field');
    if (f) f.classList.remove('invalid');
  });

  form.addEventListener('submit', function (ev) {
    ev.preventDefault();
    var d = {
      name: form.elements.name.value.trim(),
      email: form.elements.email.value.trim(),
      ref: form.elements.ref.value.trim(),
      amount: parseFloat(form.elements.amount.value)
    };
    var ok = true;
    function flag(id, bad) {
      form.elements[id].closest('.field').classList.toggle('invalid', bad);
      if (bad) ok = false;
    }
    flag('name', !d.name);
    flag('email', !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.email));
    flag('ref', !d.ref);
    flag('amount', !(d.amount > 0));
    if (!ok) { note.textContent = 'Please complete all fields with valid details.'; return; }
    note.textContent = '';
    var picked = form.querySelector('input[name="method"]:checked');
    show(d, picked ? picked.value : methods[0].id);
  });
})();
