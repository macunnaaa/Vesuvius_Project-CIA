# 🏛️ VesuviusX 2.0: Vesuvius AI Surface Detection Portal

VESUVIUSX 2.0 is a professional Full-Stack Web Application developed for the **Vesuvius Challenge**, designed to detect hidden Greek text in carbonized scroll fragments using 3D AI Analysis.

---

## 🚀 Core Technologies
* **AI Model:** 3D Sobel Gradient Analysis (Kaggle Leaderboard Score: 0.295).
* **Backend:** FastAPI (Asynchronous Python Framework).
* **Frontend:** React.js (High-end Cinematic Dashboard).
* **Database:** PostgreSQL (vesuvius_db2).

---

## 📂 Implementation Logic
The system processes **27.32 GB fragments** through a specialized pipeline:
1. **Gaussian Filtering:** Removes noise from volumetric CT scans.
2. **Sobel Gradient (axis=0):** Identifies surface transitions along the Z-axis.
3. **95th Percentile Thresholding:** Dynamically isolates high-confidence ink signals.

---

## 🏛️ System Architecture


## 🛠️ Installation
1. Clone the repo: `https://github.com/macunnaaa/Vesuvius_Project-CIA.git`
2. Start Backend: `cd backend && uvicorn main:app --reload`
3. Start Frontend: `cd frontend && npm install && npm start`