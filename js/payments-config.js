/*
 * STAS payments configuration.
 *
 * IMPORTANT: this file is public (it is served by GitHub Pages).
 * Only put PUBLIC information here: payment-link URLs, Paybill/Till numbers,
 * bank account details you are happy to share on invoices.
 * NEVER put API secret keys here (provider secret keys).
 *
 * Any option left empty ("") is hidden automatically on pay.html.
 */
window.STAS_PAYMENTS = {
  currency: "KES",

  // Phone, WhatsApp and email for "I have paid" confirmations now come from js/site-config.js

  // 1) Card / M-Pesa checkout pages, one per currency. Paste the https:// payment-page links
  //    from your payment provider's dashboard. Never put a secret API key in this file.
  card: {
    kes: "https://paystack.shop/pay/kossas2v4p",   // Kenyan shillings
    usd: "https://paystack.shop/pay/cwyky3477x"    // US dollars
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
