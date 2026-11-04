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

  // 1) Hosted checkout / payment link from your provider (M-Pesa + card).
  //    Create a payment link in your Paystack, IntaSend, Pesapal or Flutterwave dashboard
  //    and paste its https:// URL here.
  checkoutUrl: "",
  checkoutLabel: "Pay with M-Pesa or card",

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
  },

  // 4) PayPal (international clients). PayPal does not support Kenyan shillings, so these payments are in USD.
  //    email: your PayPal account email. The client sees it with copy buttons and sends the money from PayPal.
  //    me   (optional, recommended): your PayPal.Me name. For paypal.me/stasinfinity put "stasinfinity".
  //                            Adds a one-click button with the amount filled in automatically.
  //    link (optional): any PayPal payment link or button link (https://...), if PayPal.Me is not available for your account.
  paypal: {
    email: "stastechn@gmail.com",
    me: "",
    link: "https://www.paypal.com/ncp/payment/F2T42MUHCCBWC",
    currency: "USD"
  }
};
