# Stake Pledge

A decentralized staking platform built on the Stacks blockchain that allows users to create and participate in staking pledges.

## Overview

Stake Pledge enables users to:
- Create staking pledges with customizable parameters
- Participate in existing pledges by staking STX tokens
- Track pledge progress and status
- Interact with Stacks wallets (Hiro, Leather, etc.)

## Project Structure

```
stake-pledge/
├── contracts/          # Clarity smart contracts
│   └── stake-pledge.clar
├── frontend/          # Next.js frontend application
│   ├── app/          # Next.js app directory
│   ├── components/   # React components
│   ├── providers/    # Context providers (Stacks wallet integration)
│   ├── hooks/        # Custom React hooks
│   └── lib/          # Utility functions
├── settings/         # Clarinet configuration
└── tests/           # Smart contract tests
```

## Prerequisites

- Node.js 18+ and npm
- [Clarinet](https://github.com/hirosystems/clarinet) for smart contract development
- A Stacks wallet (Hiro Wallet or Leather)

## Getting Started

### 1. Install Dependencies

```bash
# Install frontend dependencies
cd frontend
npm install
```

### 2. Run the Development Server

```bash
# Start the Next.js development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Smart Contract Development

```bash
# Check contract syntax
clarinet check

# Run contract tests
clarinet test

# Start local Stacks devnet
clarinet integrate
```

## Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **@stacks/connect** - Wallet connection library

### Smart Contracts
- **Clarity** - Stacks smart contract language
- **Clarinet** - Development and testing environment

## Wallet Integration

The application uses `@stacks/connect` to integrate with Stacks wallets. The `StacksProvider` component handles:
- Wallet connection/disconnection
- Address management
- Session persistence

## Development

### Frontend Development

The main application code is in the `frontend/` directory:
- `app/page.tsx` - Main application page
- `providers/StacksProvider.tsx` - Wallet connection context
- `components/` - Reusable UI components

### Smart Contract Development

Smart contracts are located in `contracts/`:
- `stake-pledge.clar` - Main staking pledge contract

Test files are in `tests/`:
- Run tests with `clarinet test`

## Deployment

### Frontend
The frontend can be deployed to any platform that supports Next.js:
- Vercel (recommended)
- Netlify
- Docker container

### Smart Contracts
Deploy contracts to Stacks mainnet or testnet using:
```bash
clarinet deployments generate --testnet
clarinet deployments apply --testnet
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT
