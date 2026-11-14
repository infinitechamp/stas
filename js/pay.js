(function () {
  'use strict';

  var cfg = window.STAS_PAYMENTS || {};
  var site = window.STAS_SITE || {};
  var panel = document.getElementById('pay-panel');
  var setup = document.getElementById('setup-notice');
  if (!panel) return;

  function isHttps(u) { return typeof u === 'string' && /^https:\/\//i.test(u); }
  function el(tag, cls, text) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text != null) e.textContent = text;
    return e;
  }
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
  function block(title) {
    var b = el('div', 'pay-block');
    b.appendChild(el('h3', null, title));
    return b;
  }

  var card = cfg.card || {};
  var hasKes = isHttps(card.kes), hasUsd = isHttps(card.usd);
  var m = cfg.mpesa || {};
  var hasMpesa = m.number && (m.type === 'paybill' || m.type === 'till');
  var bank = cfg.bank || {};
  var hasBank = !!bank.accountNumber;

  if (!hasKes && !hasUsd && !hasMpesa && !hasBank) { setup.hidden = false; return; }

  panel.appendChild(el('h2', 'form-title', 'Choose how to pay'));

  if (hasKes || hasUsd) {
    var b1 = block('Pay by card or M-Pesa');
    b1.appendChild(el('p', 'small', 'Opens our secure checkout. Enter your amount and use your invoice number as the reference.'));
    var acts = el('div', 'hero-cta');
    [[hasKes, card.kes, 'Pay in KES'], [hasUsd, card.usd, 'Pay in USD']].forEach(function (x) {
      if (!x[0]) return;
      var a = el('a', 'btn btn-gold', x[2]);
      a.href = x[1]; a.target = '_blank'; a.rel = 'noopener noreferrer';
      acts.appendChild(a);
    });
    b1.appendChild(acts);
    panel.appendChild(b1);
  }

  if (hasMpesa) {
    var t = m.type === 'paybill' ? 'Paybill' : 'Till';
    var b2 = block('M-Pesa ' + t);
    var ol = el('ol', 'pay-steps');
    (m.type === 'paybill'
      ? ['Open M-Pesa and choose Lipa na M-Pesa, then Paybill.', 'Enter the business number below.', 'Enter your invoice number as the account number.', 'Enter the amount and your M-Pesa PIN.']
      : ['Open M-Pesa and choose Lipa na M-Pesa, then Buy Goods and Services.', 'Enter the till number below.', 'Enter the amount and your M-Pesa PIN.']
    ).forEach(function (s) { ol.appendChild(el('li', null, s)); });
    b2.appendChild(ol);
    b2.appendChild(copyRow(t + ' number', m.number));
    if (m.businessName) b2.appendChild(el('p', 'small', 'Business name shown: ' + m.businessName));
    panel.appendChild(b2);
  }

  if (hasBank) {
    var b3 = block('Bank transfer');
    if (bank.bankName) b3.appendChild(copyRow('Bank', bank.bankName));
    if (bank.accountName) b3.appendChild(copyRow('Account name', bank.accountName));
    b3.appendChild(copyRow('Account number', bank.accountNumber));
    if (bank.branch) b3.appendChild(copyRow('Branch', bank.branch));
    panel.appendChild(b3);
  }

  var b4 = block('After you have paid');
  b4.appendChild(el('p', 'small', 'Send us a quick confirmation so we can match your payment.'));
  var msg = 'Hello STAS, I have made a payment. Invoice number: ';
  var acts2 = el('div', 'hero-cta');
  if (site.whatsapp && /^\d{9,15}$/.test(site.whatsapp)) {
    var wa = el('a', 'btn btn-gold btn-sm', 'Confirm on WhatsApp');
    wa.href = 'https://wa.me/' + site.whatsapp + '?text=' + encodeURIComponent(msg);
    wa.target = '_blank'; wa.rel = 'noopener';
    acts2.appendChild(wa);
  }
  var mail = el('a', 'btn btn-ghost-dark btn-sm', 'Confirm by email');
  mail.href = 'mailto:' + (site.email || 'stasinfinitysystems@gmail.com') + '?subject=' +
    encodeURIComponent('Payment confirmation') + '&body=' + encodeURIComponent(msg);
  acts2.appendChild(mail);
  b4.appendChild(acts2);
  panel.appendChild(b4);

  panel.hidden = false;
})();
