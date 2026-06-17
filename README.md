# ✦ StellarPay — Stellar Testnet dApp

> Level 1 White Belt Submission — Rise In Stellar Journey to Mastery

A clean, professional Stellar dApp built on the Stellar Testnet. Connect your Freighter wallet, check your XLM balance, send XLM transactions, and view your transaction history — all in one interface.

---

## 🚀 Live Features

- ✅ **Freighter Wallet Connect / Disconnect** — full integration with Freighter browser extension
- ✅ **Manual Address Entry** — fallback mode when Freighter isn't installed
- ✅ **XLM Balance Display** — real-time balance fetch from Horizon testnet API
- ✅ **Send XLM Transactions** — build, sign, and broadcast transactions on Stellar Testnet
- ✅ **Transaction Feedback** — success state with tx hash + failure state with error details
- ✅ **Transaction History** — last 10 transactions with Stellar Expert explorer links
- ✅ **Friendbot Integration** — fund testnet account with one click
- ✅ **Error Handling** — graceful handling of all edge cases

---

## 📸 Screenshots

| Wallet Connected | Balance Display |
|---|---|
| ![Wallet](public/screenshot-1-wallet.png) | ![Balance](public/screenshot-2-balance.png) |

| Transaction Success | Transaction Result |
|---|---|
| ![TX](public/screenshot-3-tx-success.png) | ![Result](public/screenshot-4-tx-result.png) |

---

## 🛠️ Tech Stack

- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **@stellar/stellar-sdk** — transaction building
- **@stellar/freighter-api** — wallet signing
- **Stellar Horizon Testnet API**

---

## ⚙️ Setup & Run Locally

```bash
# 1. Clone the repository
git clone https://github.com/gopichandchalla16/stellar-pay-app.git
cd stellar-pay-app

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev

# 4. Open in browser
# http://localhost:3000
```

### Prerequisites
- Node.js 18+
- [Freighter Wallet](https://freighter.app) Chrome extension (optional — manual mode available)
- Switch Freighter to **Testnet** network

---

## 🔑 How to Test

1. Install [Freighter](https://freighter.app) → set network to **Testnet**
2. Open `http://localhost:3000`
3. Click **Connect Freighter Wallet**
4. Click **🪙 Fund via Friendbot** to get 10,000 testnet XLM
5. Go to **Send XLM** tab
6. Enter destination: `GBBD47IF6LWK7P7MDEVSCWR7DPUWV3NY3DTQEVFL4NAT4AQH3ZLLFLA5`
7. Enter amount: `1`
8. Click **🚀 Send XLM** → approve in Freighter → see success screen

---

## 📁 Project Structure

```
src/
├── app/
│   ├── page.tsx          # Main app page
│   ├── layout.tsx        # Root layout
│   └── globals.css       # Design system & styles
└── components/
    ├── SendPayment.tsx   # XLM transfer component
    └── TransactionHistory.tsx # TX history viewer
```

---

## 🌐 Deployed App

> Deploy via Vercel: `npx vercel --prod`

---

Built with ❤️ for the **Rise In Stellar Journey to Mastery** program.
