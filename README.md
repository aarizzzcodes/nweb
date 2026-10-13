# ✦ Aariz — Developer Portfolio (React) ✦

A modern, fast, and interactive personal developer portfolio built with React, TypeScript, and Vite.

---

## 🌟 Features

- **Interactive Constellation Canvas**: Background particles that float and react dynamically with mouse repulsion physics.
- **Magnetic Trailing Cursor**: Glowing dual-ring cursor with hover states over clickable cards.
- **3D Perspective Tilt**: Interactive project and skill cards that tilt in 3D on hover (`TiltCard`).
- **Terminal Playground**: Interactive code window with switchable tabs (`aariz.ts` & `specs.json`) and syntax highlighting.
- **Project Filter**: Real-time category filtering (Web & Apps, IoT & Hardware, Systems & Python).
- **Toast Feedback**: Copy email to clipboard and contact form transmission alerts with auto-dismiss notifications.
- **Responsive Navigation**: Glassmorphic sticky header with scroll detection and mobile navigation drawer.

---

## 📂 Project Structure

```text
├── index.html                  # HTML entry point with typography
├── package.json                # Dependencies and Vite scripts
├── tsconfig.json               # TypeScript configuration
├── vite.config.ts              # Vite bundler configuration
├── .gitignore                  # Git ignore rules for node_modules and builds
├── public/
│   ├── favicon.svg             # Custom portfolio glowing chip favicon
│   └── media/sensors/          # Sensor photos and video directory
├── src/
│   ├── components/
│   │   ├── About.tsx           # Narrative & Interactive Terminal
│   │   ├── ConstellationCanvas.tsx # Interactive background particle network
│   │   ├── Contact.tsx         # Transmission form & verified social hyperlinks
│   │   ├── CustomCursor.tsx    # Smooth glowing trailing cursor
│   │   ├── Footer.tsx          # Dynamic year & back-to-top button
│   │   ├── Hero.tsx            # Typewriter header & CTAs
│   │   ├── Icons.tsx           # SVG brand icons (GitHub, LinkedIn, Mail)
│   │   ├── Navbar.tsx          # Sticky glass navigation & mobile menu
│   │   ├── Projects.tsx        # Portfolio showcase with category filtering & Sensors subpart
│   │   ├── SensorDetailModal.tsx # Interactive 2-photo sensor modal & specs viewer
│   │   ├── SensorGuideModal.tsx # In-app visual photo upload guide modal
│   │   ├── Skills.tsx          # Technical toolbelt 3D cards
│   │   ├── TiltCard.tsx        # 3D perspective mouse physics component
│   │   ├── Timeline.tsx        # Career milestone journey
│   │   └── Toast.tsx           # Notification toast
│   ├── data/
│   │   └── sensorsData.ts      # Comprehensive sensors dataset (specs, pins, photos, wiring)
│   ├── types.ts                # TypeScript data interfaces
│   ├── App.tsx                 # Root application component with Framer Motion animations
│   ├── main.tsx                # React DOM mount point
│   └── index.css               # Obsidian theme, glows, and animations
└── README.md                   # Project documentation
```

---

## 🚀 Development & Build

```bash
# Run dev server
npm run dev

# Build for production
npm run build
```
