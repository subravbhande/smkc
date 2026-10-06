# 🏛️ NAGAR-NETRA (नगर-नेत्र)
### *AI & GIS-Powered Civic Enforcement & Geo-Evidence Tracking Platform*
**Sangli-Miraj-Kupwad Municipal Corporation (SMKC)**

> **"Digital Eyes. Verified Action."**  
> AI + GIS powered civic enforcement for a cleaner, safer, and better-managed city.

---

## 🏆 Smart India Hackathon (SIH) Documentation
The complete, official SIH pitch deck slides and technical documentation report have been compiled in:
👉 **[SIH_DOCUMENTATION.md](file:///c:/Users/subra/OneDrive/Desktop/finance%20tracker%20project/smkc/SIH_DOCUMENTATION.md)**

---

## 🚀 Key Features

1. **Public Citizen Portal (`/`):**
   - High-fidelity civic portal with official SMKC branding.
   - Quick 60-second violation reporting with mandatory mobile verification.
   - Live GPS auto-detection & Leaflet map pin placement.
   - Real-time complaint tracking with stage-by-stage visual timeline.

2. **WhatsApp Civic Bot Simulator (`/admin/whatsapp-simulator`):**
   - End-to-end simulated WhatsApp chatbot for zero-friction citizen reporting.
   - Instant image and GPS coordinate intake with instant ticket response.

3. **Multi-Role Municipal Dashboards:**
   - **Admin (`/admin`):** Ward heatmaps, violation distribution, SLA breach monitoring, and audit log.
   - **Supervisor (`/supervisor`):** Queue triage, field squad allocation, and workload balancing.
   - **Field Officer (`/officer`):** Mobile route navigation, site inspection, and mandatory "Before & After" photo resolution.

---

## 💻 Tech Stack
- **Frontend:** React 19, Vite, React Router DOM v6
- **GIS & Maps:** Leaflet.js, OpenStreetMap
- **Styling:** Custom Vanilla CSS & Civic Design Tokens
- **Icons:** Lucide React

---

## 🏃 Getting Started

```bash
# Navigate to smkc folder
cd smkc

# Install packages
npm install

# Run local development server
npm run dev
```

Visit `http://localhost:5173` to explore the live application.
