# ⭐ StellarPay — White Belt dApp

> **Rise In Stellar Journey to Mastery — Level 1 White Belt Submission**

A fully functional Stellar testnet dApp built with Next.js 14, TypeScript, and Tailwind CSS. Connect your Freighter wallet, check your XLM balance, send XLM transactions, and view transaction history — all on Stellar Testnet.

---

## 🚀 Live Demo

Deploy to Vercel with one click:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/gopichandchalla16/stellar-pay-app)

---

## ✅ White Belt Requirements Checklist

| Requirement | Status |
|---|---|
| Freighter wallet setup & testnet | ✅ Done |
| Wallet connect functionality | ✅ Done |
| Wallet disconnect functionality | ✅ Done |
| Fetch XLM balance | ✅ Done |
| Display balance clearly in UI | ✅ Done |
| Send XLM transaction on testnet | ✅ Done |
| Success state with tx hash | ✅ Done |
| Failure state with error message | ✅ Done |
| Public GitHub repository | ✅ Done |
| README with setup + screenshots | ✅ Done |

---

## 🛠️ Features

- **Wallet Connection** — Connect & disconnect Freighter wallet with one click
- **Live Balance** — XLM balance fetched from Stellar Horizon testnet API
- **Testnet Faucet** — Fund your account instantly via Friendbot (10,000 XLM)
- **Send XLM** — Full payment flow: build → sign → submit with Freighter signing
- **Transaction Feedback** — Success card with tx hash + Stellar Expert explorer link; clear error states
- **Transaction History** — Last 10 transactions with status, hash, and explorer links
- **Responsive UI** — Works on mobile and desktop
- **Dark theme** — Stellar-themed dark UI

---

## 🏗️ Tech Stack

| Technology | Purpose |
|---|---|
| Next.js 14 (App Router) | React framework |
| TypeScript | Type safety |
| Tailwind CSS | Styling |
| @stellar/stellar-sdk | Stellar blockchain interactions |
| @stellar/freighter-api | Freighter wallet integration |
| Stellar Horizon Testnet | Blockchain API |

---

## 📦 Setup Instructions

### Prerequisites

1. **Node.js** v18+ and npm
2. **Freighter Wallet** browser extension — [Install from freighter.app](https://freighter.app)
   - After installing, create a wallet and switch to **Testnet** in settings

### Installation

```bash
# Clone the repository
git clone https://github.com/gopichandchalla16/stellar-pay-app.git
cd stellar-pay-app

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm start
```

---

## 🎮 How to Use

1. **Install Freighter** — Add the [Freighter browser extension](https://freighter.app)
2. **Switch to Testnet** — In Freighter settings → Network → Testnet
3. **Connect** — Click "Connect Freighter Wallet" on the app
4. **Fund your wallet** — Click "Fund via Friendbot" to get 10,000 free testnet XLM
5. **Send XLM** — Enter a destination address and amount, click Send
6. **Approve in Freighter** — Sign the transaction in the Freighter popup
7. **View result** — See the success card with your transaction hash
8. **Transaction History** — Switch to the History tab to see past transactions

---

## 📸 Screenshots

### 1. Wallet Connected State
![Wallet Connected](https://raw.githubusercontent.com/gopichandchalla16/stellar-pay-app/main/public/screenshot-wallet-connected.png)

### 2. XLM Balance Displayed
![Balance Display](https://raw.githubusercontent.com/gopichandchalla16/stellar-pay-app/main/public/screenshot-balance.png)

### 3. Successful Testnet Transaction
![Transaction Success](https://raw.githubusercontent.com/gopichandchalla16/stellar-pay-app/main/public/screenshot-tx-success.png)

### 4. Transaction Result Shown to User
![Transaction Result](https://raw.githubusercontent.com/gopichandchalla16/stellar-pay-app/main/public/screenshot-tx-result.png)

---

## 🔗 Stellar Network Info

- **Network**: Testnet
- **Horizon API**: https://horizon-testnet.stellar.org
- **Explorer**: https://stellar.expert/explorer/testnet
- **Friendbot**: https://friendbot.stellar.org

---

## 📁 Project Structure

```
stellar-pay-app/
├── src/
│   ├── app/
│   │   ├── layout.tsx       # Root layout with metadata
│   │   ├── page.tsx         # Main app page
│   │   └── globals.css      # Global styles
│   ├── components/
│   │   ├── WalletCard.tsx   # Wallet connect/disconnect/balance
│   │   ├── SendPayment.tsx  # XLM send flow with signing
│   │   ├── TransactionHistory.tsx  # Tx history viewer
│   │   └── StellarIcon.tsx  # SVG logo
│   └── lib/
│       └── stellar.ts       # Stellar SDK helpers
├── public/                  # Screenshots
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── README.md
```

---

## 👤 Author

**Gopichand Challa**  
GitHub: [@gopichandchalla16](https://github.com/gopichandchalla16)  
Project: [stellar-pay-app](https://github.com/gopichandchalla16/stellar-pay-app)  

---

*Built for the Rise In Stellar Journey to Mastery — Level 1 White Belt Challenge*
