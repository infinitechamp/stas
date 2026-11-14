/*
 * STAS payments configuration.
 *
 * IMPORTANT: this file is public (it is served by GitHub Pages).
 * Only put PUBLIC information here: payment-link URLs, Paybill/Till numbers,
 * bank account details you are happy to share on invoices.
 * NEVER put API secret keys here (Paystack sk_..., IntaSend secret, Pesapal consumer secret, etc.).
 *
 * Any option left empty ("") is hidden automatically on pay.html.
 */
window.STAS_PAYMENTS = {
  currency: "KES",

  // Phone, WhatsApp and email for "I have paid" confirmations now come from js/site-config.js

  // 1) Paystack checkout pages (one per currency). Paste the https:// page links from your Paystack dashboard.
  //    Never put your Paystack secret key (sk_...) in this file.
  paystack: {
    kes: "https://paystack.shop/pay/kossas2v4p",   // Kenyan shillings (card + M-Pesa)
    usd: "https://paystack.shop/pay/cwyky3477x"    // US dollars (international cards)
  },

  // 2) M-Pesa Paybill or Till (manual payment, works with no provider)
  mpesa: {
    type: "till",        // "paybill" or "till" (Buy Goods and Services = till)
    number: "9501131",   // Paybill or Till number
    businessName: "STAS Intelligent Systems"
  },

  // 3) Bank transfer
  bank: {
    bankName: "",
    accountName: "",
    accountNumber: "",
    branch: ""
  }
};
