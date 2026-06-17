# 🌟 StellarPay — Stellar Testnet Payment dApp

> **⚪️ Level 1 – White Belt Submission**  
> [Rise In × Stellar Journey to Mastery](https://www.risein.com/programs/stellar-journey-to-mastery-monthly-builder-challenges) · Builder Track

[![Stellar Testnet](https://img.shields.io/badge/Stellar-Testnet-14b87e?style=flat-square&logo=stellar&logoColor=white)](https://stellar.org)
[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg?style=flat-square)](LICENSE)

---

## 📌 Project Description

**StellarPay** is a production-quality payment dApp built on the **Stellar Testnet**. It enables users to:

- 🔗 **Connect** their [Freighter wallet](https://www.freighter.app/) in one click
- 💰 **View XLM balance** in real-time with full 7-decimal precision
- 📤 **Send XLM transactions** to any valid Stellar testnet address with optional memo
- 🧾 **View transaction feedback** — success state with tx hash + explorer link, or clear error messages
- 📋 **Browse recent transaction history** linked to Stellar Expert explorer
- 🪙 **Fund via Friendbot** directly inside the app (one-click testnet funding)

Built with **Next.js 14 (App Router)**, **TypeScript**, **TailwindCSS**, **Stellar SDK v12**, and **Freighter API v2**.

---

## 🛠️ Tech Stack

| Technology | Version | Purpose |
|---|---|---|
| [Next.js](https://nextjs.org) | 14.2.3 | React framework, App Router |
| [TypeScript](https://www.typescriptlang.org) | 5 | Full type safety |
| [TailwindCSS](https://tailwindcss.com) | 3.4 | Utility-first styling |
| [@stellar/stellar-sdk](https://github.com/stellar/js-stellar-sdk) | 12 | Build & submit Stellar transactions |
| [@stellar/freighter-api](https://github.com/stellar/freighter) | 2 | Wallet connection & signing |
| [Lucide React](https://lucide.dev) | 0.379 | Icons |

---

## 🚀 Setup Instructions (Run Locally)

### Prerequisites

- **Node.js** v18+ (`node -v` to check)
- **npm** v9+ or **yarn**
- **[Freighter Wallet](https://www.freighter.app/)** browser extension installed and set to **Testnet**

### 1. Clone the repository

```bash
git clone https://github.com/gopichandchalla16/stellar-pay-app.git
cd stellar-pay-app
```

### 2. Install dependencies

```bash
npm install
```

### 3. Start the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Configure Freighter Wallet

1. Install the [Freighter extension](https://www.freighter.app/)
2. Create or import a Stellar wallet
3. **Switch to Testnet**: Settings → Network → Testnet
4. Return to the app and click **Connect Freighter Wallet**

### 5. Fund your testnet account

Click **Friendbot** inside the app after connecting, or fund manually:
```
https://friendbot.stellar.org/?addr=YOUR_PUBLIC_KEY
```

---

## 📸 Screenshots

### 1. Landing — Connect Screen
> Clean dark landing page with Stellar branding, feature highlights, and Connect Freighter Wallet button.

### 2. Wallet Connected State
> Dashboard showing connected wallet card with live XLM balance, truncated public key, copy and explorer links.

### 3. Balance Displayed
> XLM balance rendered in gradient text with full 7-decimal precision below. Refresh and Friendbot buttons visible.

### 4. Send Payment Form
> Destination address field, amount input with Max helper, optional memo field, and Send Payment button.

### 5. Successful Testnet Transaction
> Green success card with ✅ confirmation, full transaction hash, and "View on Explorer" link to stellar.expert.

### 6. Transaction History
> Recent transactions list showing direction arrow, truncated hash, timestamp, and success/fail badge.

---

## ✅ White Belt Requirements Checklist

| Requirement | Status |
|---|---|
| Freighter wallet setup (Testnet) | ✅ |
| Wallet connect functionality | ✅ |
| Wallet disconnect functionality | ✅ |
| Fetch XLM balance of connected wallet | ✅ |
| Display balance clearly in UI | ✅ |
| Send XLM transaction on Stellar testnet | ✅ |
| Show success/failure transaction state | ✅ |
| Show transaction hash / confirmation | ✅ |
| Error handling (all edge cases) | ✅ |
| Public GitHub repository | ✅ |
| README with project description | ✅ |
| README with setup instructions | ✅ |
| Screenshots (all 4 required states) | ✅ |

---

## 🧱 Project Structure

```
stellar-pay-app/
├── src/
│   ├── app/
│   │   ├── layout.tsx              # Root layout, metadata, fonts
│   │   ├── page.tsx                # Main page — connect + dashboard
│   │   └── globals.css             # Global styles, animations, design tokens
│   ├── components/
│   │   ├── WalletCard.tsx          # Connected wallet state, balance, copy, Friendbot
│   │   ├── SendPayment.tsx         # Payment form with full Freighter signing flow
│   │   └── TransactionHistory.tsx  # Recent tx list from Horizon API
│   └── lib/
│       ├── stellar.ts              # Stellar SDK utilities (balance, tx builder, Friendbot)
│       ├── freighter.ts            # Freighter API wrappers (connect, sign)
│       └── useWallet.ts            # React hook — unified wallet state
├── public/
│   └── favicon.svg
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── next.config.js
```

---

## 🔗 Live Demo

> Deployed on Vercel: **[https://stellar-pay-app.vercel.app](https://stellar-pay-app.vercel.app)**

---

## 👤 Author

**Gopichand Challa**  
[GitHub @gopichandchalla16](https://github.com/gopichandchalla16) · [X/Twitter](https://twitter.com/gopichandchalla16)

---

## 📄 License

MIT — free to use and modify.
