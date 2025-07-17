# 🎯 AdGenius

**AdGenius** is a modular, plugin-based ad engine designed for developers who want full control over how ads are delivered, targeted, and tracked. Built with TypeScript and Node.js, it's ideal for web apps, SaaS platforms, content-heavy websites, and anyone looking to run smarter ad campaigns without relying on bloated third-party SDKs.


<p align="center">
  <a href="https://v1.pinimg.com/videos/mc/720p/6f/ae/06/6fae062657f4335cdf5372b34f06e61b.mp4" target="_blank">
    <img src="https://i.imgur.com/0y8Ftya.png" alt="AdGenius Video Preview" width="500"/>
  </a>
</p>

---

## ✨ Features

- 🔌 **Plugin System** – Easily integrate with any ad provider (Google, Facebook, internal DSPs)
- 🎯 **Custom Targeting** – Deliver ads based on device, region, user data, or any logic
- 📊 **Built-in Analytics** – Track impressions, clicks, and conversions
- 🧩 **Middleware-Ready** – SSR and API-friendly (Express, Next.js, etc.)
- 🧱 **Fully TypeScript** – Strongly typed and scalable for production apps
- 🧪 **Testable & Extensible** – Full test coverage and plugin APIs

---

## 🧠 Tech Stack

| Tech         | Description                          |
|--------------|--------------------------------------|
| **TypeScript** | Type-safe development              |
| **Node.js**    | Runtime for backend logic          |
| **Express.js** |  Middleware integration  |
| **EventEmitter** | Internal event system for analytics |
| **Plugin Loader** | Interface for third-party ads  |

---

## 📂 Project Structure

```plaintext
AdGenius/
├── src/
│   ├── core/         # Ad logic, campaign runners
│   ├── plugins/      # Ad provider integrations
│   ├── middleware/   # API integrations
│   ├── analytics/    # Event logging + metrics
│   └── config/       # Campaign loaders & rules
├── examples/         # Sample usage projects
├── tests/            # Full test suite
└── README.md
```
---

## 🚀 Quick Start

### 1. Clone the Repo

```bash
git clone https://github.com/vcDevelop/AdGenius.git
cd AdGenius
```
---
### 2.Install Dependencies
```bash
npm install
```
---
### 3.Start Development
```bash
npm run dev
```
---
### 4.Build for Production
```bash
npm run build
```
---
### 5.Run Tests
```bash
npm run test
```
---
