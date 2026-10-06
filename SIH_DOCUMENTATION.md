# 🏆 SMART INDIA HACKATHON (SIH) — OFFICIAL PROJECT DOCUMENTATION & PITCH DECK

---

## 📌 PROJECT METADATA

- **Project Title:** NAGAR-NETRA (*Network for Evidence, Tracking, Reporting & Action*)
- **Tagline:** *"Digital Eyes. Verified Action."*
- **Target Organization / Stakeholder:** Sangli-Miraj-Kupwad Municipal Corporation (SMKC) & Urban Local Bodies (ULBs)
- **Domain / Theme:** Smart Governance / Civic Technology / AI & GIS Urban Enforcement
- **Category:** Software Edition

---

# 📑 PART 1: SIH PRESENTATION SLIDE-BY-SLIDE PITCH DECK

This slide deck follows the official Smart India Hackathon presentation guidelines.

---

### 🔹 SLIDE 1: Title & Overview
* **Project Name:** NAGAR-NETRA (नगर-नेत्र)
* **Subtitle:** AI & GIS-Powered Civic Enforcement & Geo-Evidence Tracking Platform
* **Partner / Case ULB:** Sangli-Miraj-Kupwad Municipal Corporation (SMKC)
* **Motto:** *"Digital Eyes. Verified Action."*
* **Core Value:** Transforming passive grievance filing into an active, verified, AI-assisted civic enforcement pipeline that eliminates illegal hoardings and public encroachments while recovering municipal revenue.

---

### 🔹 SLIDE 2: Problem Statement & Civic Pain Points
* **Uncontrolled Civic Violations:**
  * Proliferation of unauthorized commercial and political hoardings causing visual clutter, public safety hazards, and road accidents.
  * Rapid footpath encroachments obstructing pedestrian movement.
* **Massive Municipal Revenue Leakage:**
  * Hoardings erected without municipal permits bypass advertising licensing fees, costing ULBs lakhs in lost revenue every month.
* **Flaws in Existing Grievance Portals (e.g., generic municipal apps):**
  * ❌ No geo-fencing or automated location verification (spurious/vague complaints).
  * ❌ No AI-driven duplicate detection (hundreds of tickets for the same hoarding).
  * ❌ Citizen friction (complex logins, no instant chat/WhatsApp intake).
  * ❌ Lack of verifiable proof of resolution (tickets closed without proof).

---

### 🔹 SLIDE 3: Proposed Solution — NAGAR-NETRA
* **End-to-End Closed-Loop Ecosystem:**
  1. **Omnichannel Intake:** High-speed Web Portal + Citizen WhatsApp Chatbot simulator with instant photo & location sharing.
  2. **Geo-Evidence Engine:** Mandatory high-precision GPS capture, anti-tamper timestamping, and image validation.
  3. **AI Vision & Deduplication:** Automated classification of hoarding vs. encroachment, OCR detection of sponsor details, and duplicate clustering within radius.
  4. **Dynamic Role-Based Dispatch:** Hierarchical workflow (Citizen ➔ Supervisor ➔ Field Officer ➔ Admin) with SLA countdowns.
  5. **Verifiable Before/After Proof:** Resolution requires geo-tagged "After" inspection photos before a ticket can be closed.

---

### 🔹 SLIDE 4: Core Innovation & Key Differentiators
| Feature | Traditional Grievance Systems | NAGAR-NETRA Platform |
| :--- | :--- | :--- |
| **Intake Mechanism** | Cumbersome web forms & logins | WhatsApp Bot + 60-second Quick Web Form |
| **Location Accuracy** | Manual address typing (vague) | Real-time GPS auto-lock + Interactive GIS pin |
| **Verification & Fraud Prevention** | Anonymous spam / untraceable | Mandatory mobile validation + Anti-tamper logs |
| **Field Verification** | Unverified checkbox closure | Mandatory Before vs. After photographic evidence |
| **Revenue Tracking** | Nil / Disconnected from finance | Integrated fine & advertising fee recovery estimator |
| **Spatial Intelligence** | Tabular spreadsheets | Real-time Leaflet GIS heatmap & ward analytics |

---

### 🔹 SLIDE 5: Technical Architecture & System Design
```
                       ┌────────────────────────────────────────────────────────┐
                       │                     CITIZEN INTAKE                     │
                       │  • Web Portal (Mobile Responsive React 19)             │
                       │  • WhatsApp Simulator / API (Simulated Chatbot)         │
                       └──────────────────────────┬─────────────────────────────┘
                                                  │ (Geo-tagged Report & Media)
                                                  ▼
                       ┌────────────────────────────────────────────────────────┐
                       │                INTELLIGENCE & TRIAGE LAYER             │
                       │  • Mobile Number Validation & Anti-Spam Gate           │
                       │  • Category Classifier & AI Tagging                    │
                       │  • Geo-Coordinate Verification & Spatial Clustering     │
                       └──────────────────────────┬─────────────────────────────┘
                                                  │
                                                  ▼
                       ┌────────────────────────────────────────────────────────┐
                       │             CENTRAL STATE & STORAGE ENGINE             │
                       │  • Reactive State Store (Cases, Users, SLA Trackers)   │
                       │  • Mock/REST API Layer with Persistent LocalStorage    │
                       │  • Audit Trail & Cryptographic Verification Log        │
                       └──────────────────────────┬─────────────────────────────┘
                                                  │
                 ┌────────────────────────────────┼──────────────────────────────┐
                 ▼                                ▼                              ▼
    ┌─────────────────────────┐      ┌─────────────────────────┐     ┌───────────────────────┐
    │     ADMIN COMMAND       │      │   SUPERVISOR STATION    │     │   OFFICER DISPATCH    │
    │  • GIS City Heatmaps    │      │  • Zone Allocations     │     │  • Mobile Field View  │
    │  • Ward Violation Stats │      │  • Workload Balancing   │     │  • Route Navigation   │
    │  • Revenue Recovery     │      │  • Priority Escalations │     │  • Before/After Proof │
    └─────────────────────────┘      └─────────────────────────┘     └───────────────────────┘
```

---

### 🔹 SLIDE 6: Role-Based Workflows & User Personas
* **1. Citizen:**
  * 60-second reporting flow with GPS location capture.
  * Real-time ticket timeline tracking using mobile number or Ticket ID.
  * WhatsApp chatbot conversation for zero-barrier reporting.
* **2. Supervisor (Zonal In-Charge):**
  * Triage pending reports across Sangli, Miraj, and Kupwad zones.
  * Assign tickets to specific field enforcement squads based on distance and workload.
* **3. Field Enforcement Officer:**
  * Turn-by-turn map navigation to violation coordinates.
  * Mandatory camera capture of the cleared site ("After" photo).
  * Digital signature / punch-out to complete enforcement.
* **4. Municipal Administrator / Commissioner:**
  * City-level performance dashboard: Total resolved, SLA breach alerts, ward leaderboards.
  * Revenue recovered from penalties and illegal hoarding clearances.
  * Immutable audit log for legal and RTI compliance.

---

### 🔹 SLIDE 7: Feasibility, Viability & Scalability
* **Economic Feasibility:**
  * Zero license fees on proprietary GIS; built using modern open-source stacks (React, Vite, Leaflet, Tailwind-inspired CSS).
  * Direct ROI for Municipal Corporation by identifying unpermitted commercial displays.
* **Social Viability:**
  * Cleaner city streets, safe pedestrian walkways, unblocked traffic signals.
  * Transparent governance increases public trust in municipal authorities.
* **Scalability:**
  * Modular component architecture allows horizontal scaling from SMKC (3 towns) to any municipal corporation or Smart City across India.
  * Designed to integrate with national initiatives like Swachh Bharat Mission (SBM-U) and National Urban Digital Mission (NUDM).

---

### 🔹 SLIDE 8: Implementation Roadmap
* **Phase 1 (Months 1–2): Pilot Deployment**
  * Rollout in high-density commercial corridors of Sangli (e.g., Market Yard, High Street).
  * WhatsApp bot integration with SMKC citizen helpline.
* **Phase 2 (Months 3–4): Full ULB Scaling**
  * Integration across all 4 administrative wards (Sangli, Miraj, Kupwad, Rural fringe).
  * Automated penalty notice generation linked to advertising database.
* **Phase 3 (Months 5–6): State & National Expansion**
  * Multi-language support (Marathi, Hindi, English).
  * Integration with drone surveillance and automated street camera feeds.

---

### 🔹 SLIDE 9: Conclusion & Vision
* **NAGAR-NETRA transforms municipal enforcement from reactive complaints to proactive, verifiable governance.**
* *"A digital eye on every corner, accountable action in every ward."*
* **Ready for Pilot Implementation at Sangli-Miraj-Kupwad Municipal Corporation.**

---

# 📖 PART 2: COMPREHENSIVE PROJECT DOCUMENTATION & TECHNICAL REPORT

---

## 1. Executive Summary
The rapid growth of Tier-2 and Tier-3 urban centers in India has led to significant civic violations, most prominently **unauthorized hoardings, political banners, and pedestrian walkway encroachments**. In cities like **Sangli-Miraj-Kupwad**, these encroachments not only cause severe safety risks and visual pollution but also lead to substantial municipal tax evasion.

**NAGAR-NETRA** is an intelligent civic-tech platform designed specifically for SMKC. It unites citizens and municipal authorities into a closed-loop system powered by GIS mapping, automated geo-location validation, mobile identity verification, and multi-tier role-based dispatch workflows.

---

## 2. Key Modules & Functional Description

### 2.1 Public Landing Page & Citizen Intake
* **Hero Banner & Trust Markers:** Designed with authentic government civic aesthetics, official SMKC emblem, and helpline hotline integration.
* **Quick Report Modal:**
  * **Location Capture:** Auto-geolocation via HTML5 Geolocation API with manual pin adjustment on Leaflet map.
  * **Violation Category:** Hoarding (Unauthorized Commercial / Political), Footpath Encroachment, Public Space Obstruction, Garbage / Debris.
  * **Citizen Identity Safeguard:** Mandatory 10-digit mobile number validation to curb anonymous abuse while safeguarding privacy.
  * **Live File Upload:** Direct photo upload with preview and dimension validation.
* **Real-Time Ticket Tracking:** Public lookup page where citizens enter their Ticket ID (e.g., `SMKC-2026-XXXX`) or mobile number to see progress stages: `Submitted ➔ Verified ➔ Assigned ➔ In Progress ➔ Resolved`.

### 2.2 Citizen WhatsApp Simulator
* Emulates an end-to-end WhatsApp Business chatbot.
* Citizens can send a photo, share their live WhatsApp location pin, and receive automated acknowledgment tickets with clickable tracking links.

### 2.3 Command & Enforcement Dashboards
1. **Admin Dashboard:**
   * High-level KPI widgets: Active cases, resolved cases, SLA compliance rate, estimated revenue recovery.
   * Interactive Leaflet Map displaying hot spots, ward boundaries, and violation pins color-coded by severity.
   * Comprehensive Audit Log tracking every state transition with timestamp and user ID.
2. **Supervisor Dashboard:**
   * Rapid assignment matrix for routing unassigned violations to local field officers.
   * SLA countdown monitors to prevent overdue tickets.
3. **Field Officer Dashboard:**
   * Mobile-first view designed for field operations.
   * "Get Directions" button linking to GPS coordinates.
   * Resolution submission requiring mandatory "After" photograph upload and remarks.

---

## 3. Technology Stack & Dependencies

| Layer | Technology | Rationale |
| :--- | :--- | :--- |
| **Frontend Framework** | React 19 + Vite | Blazing fast build speeds, responsive rendering, modular component tree |
| **Routing** | React Router DOM v6 | Seamless multi-page navigation across public, admin, supervisor, and officer roles |
| **Styling & Design System** | Modern Vanilla CSS & Design Tokens | Zero Tailwind dependency overhead, custom civic color palette (SMKC Navy & Saffron Gold), dark/light compatibility |
| **Mapping & GIS** | Leaflet.js + OpenStreetMap | Open-source, zero-cost mapping with custom geo-pins and heat clusters |
| **State Management** | Centralized Store / React Context + LocalStorage | Instant client-side persistence, mock data statefulness across reloads |
| **Icons & Media** | Lucide React | Clean, accessible vector icons for government interfaces |

---

## 4. Security, Fraud Prevention & Anti-Spam Measures
1. **Mandatory Mobile Validation:** Ensures accountability and allows SMS/WhatsApp status updates while preventing automated bot submissions.
2. **Geo-Fencing & Coordinate Verification:** Reports must lie within the geographic bounding box of the Sangli-Miraj-Kupwad Municipal Corporation.
3. **Role-Based Access Control (RBAC):** Strict separation between Public, Field Officer, Supervisor, and Administrator interfaces.
4. **Immutable Audit Logging:** Every ticket update (status change, officer reassignment, timestamp) is permanently logged to an audit register.

---

## 5. Potential Impact & Quantitative Outcomes
* ⏱️ **65% Reduction in Resolution Time:** From an average of 7 days down to 48 hours through automated direct dispatch.
* 💰 **₹25 Lakhs+ Estimated Annual Revenue Recovery:** Through identification and retroactive penalization of unauthorized commercial billboards.
* 👥 **10x Citizen Engagement:** Zero-barrier reporting via WhatsApp and mobile-friendly web eliminates bureaucratic paperwork.
* 🛡️ **100% Audit Accountability:** Eliminates paper-based ticket clearing; every closed ticket has verifiable Before & After photographic evidence.

---

## 6. Project Setup & Execution Instructions

### Prerequisites
* Node.js (v18.0.0 or higher)
* npm (v9.0.0 or higher)

### Installation & Launch
```bash
# 1. Navigate to the project directory
cd smkc

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev

# 4. Open in browser
# Navigate to http://localhost:5173
```

### Pre-Configured Test Accounts (RBAC)
* **Admin:** `admin@smkc.gov.in` / `admin123`
* **Supervisor:** `supervisor@smkc.gov.in` / `super123`
* **Field Officer:** `officer@smkc.gov.in` / `officer123`
* **Citizen:** Public access via homepage (no password required for reporting/tracking)
