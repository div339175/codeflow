# CodeFlow — Keyboard-Controlled Infinite Programming Feed

**CodeFlow** is a clean, fullscreen programming-content web application designed for screen recording. It provides a continuous, infinite stream of algorithm problems, open-source projects, and engineering tutorials with **smooth, configurable keyboard-driven scrolling**.

---

## ⚡ Main Feature: Precision Keyboard Down Scroll

The website is controlled via keyboard navigation, giving you exact control over how slowly and smoothly the page moves when you press or hold the Down key:

- **`Spacebar` / `↓` (ArrowDown) / `PageDown`**: Smoothly moves downward by a configurable distance and velocity based on your speed setting.
- **Single Tap**: Advances by one clean discrete step and stops completely (no drift).
- **Hold `Spacebar` or `↓`**: Continuous, jitter-free gliding at the exact set speed. Stops immediately when released.
- **`↑` / `PageUp`**: Smoothly moves upward.

### Custom Animation Controller
Rather than relying on browser-default jumps or rigid CSS smooth scrolling, CodeFlow uses a dedicated `requestAnimationFrame` controller with:
- Target tracking with sub-pixel floating point positioning
- Velocity throttling strictly proportional to your speed setting
- Smooth easing and deceleration as the target is reached

---

## 🎛️ Minimalist Scroll Speed Slider

A small, clean floating control widget in the bottom corner allows you to set the scroll speed:

- **Live Speed Indicator**: Shows the current numeric value (e.g. `Scroll Speed: 0.10`).
- **Logarithmic / Non-Linear Slider**: The extremely slow speed range (`0.01` to `0.20`) occupies 50% of the slider track, giving you fine-grained precision for recording.
- **Micro Steppers**: `[-]` and `[+]` buttons allow single-hundredth adjustments (`0.10` → `0.11` → `0.12`).
- **Quick Presets**:
  - `[Extremely Slow]` = `0.01` (moves ~25px at ~1.2 px/s — ideal for teleprompter-style slow recording)
  - `[Very Slow]` = `0.05` (moves ~51px at ~6 px/s)
  - `[Slow]` = `0.10` (moves ~78px at ~12 px/s)
  - `[Normal]` = `0.50` (moves ~245px at ~60 px/s)
  - `[Fast]` = `1.00` (moves ~415px at ~120 px/s)
- **Hide / Collapse Button**: Click the eye icon to collapse the widget into a tiny, unobtrusive pill. Keyboard scrolling continues to work while hidden.

---

## 📚 Content Library (57 Curated Items)

- **LeetCode (15 problems)**: Two Sum, Valid Parentheses, 3Sum, Trapping Rain Water, Coin Change, Reverse Linked List, etc.
- **GeeksforGeeks (10 problems)**: Subarray with Given Sum, Detect Loop, Missing Number, Kadane's, Next Greater Element, etc.
- **Codeforces (10 problems)**: Watermelon, Way Too Long Words, Team, Next Round, Beautiful Matrix, Domino Piling, etc.
- **GitHub Projects (10 projects)**: Zustand, Fastify, Ripgrep, Redis, Tauri, Excalidraw, Neovim, etc.
- **Tutorials (12 deep-dives)**: JavaScript Event Loop, Go Worker Pools, Rust Memory & Lifetimes, Token Bucket Rate Limiter, LRU Cache, B-Trees vs LSM, gRPC, etc.

### Content Ordering & Preloading
- **Sequential Within Sources**: Problems follow their natural sequence (Problem 1 → 2 → 3 → 4...).
- **Random Source Switching**: Shuffling happens between source groups when a sequence completes.
- **Infinite Preloading**: Powered by `IntersectionObserver` with a 1600px lookahead buffer. Content is never empty and no blank screen ever occurs.

---

## 🛠️ Development & Running

```bash
# Install dependencies
npm install

# Start local server
npm run dev
```

Open `http://127.0.0.1:3000` in your browser.
