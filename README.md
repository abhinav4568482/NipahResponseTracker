![Uploading Screenshot 2025-08-20 195717.png…]()
# Epidemic Prediction System – Nipah Virus Risk Index Mapper

A lightweight web app that predicts and visualizes **Nipah Virus risk levels** across Indian states using **K-Means clustering** and **geospatial mapping**. It provides an interactive dashboard, heatmaps, and simple APIs.

## ✨ Features
- **Risk tiers** via K-Means (k=4) on key public-health & environmental features
- **Interactive choropleth map** with tooltips and filters
- **Dashboard** for state drill-downs and CSV export
- **REST API** to fetch tiers or score custom inputs

## 🧰 Tech Stack
**Python, Flask, scikit-learn, pandas, NumPy, Folium/Leaflet, Matplotlib, HTML/CSS/JS, GeoJSON**

## 🧪 Method (Risk Index)
Six example parameters (editable): population density, bat-habitat index, health-infra score, rainfall, temperature, mobility.
1) Clean/impute → 2) Standardize (z-score) → 3) `KMeans(n_clusters=4, random_state=42)`  
Map clusters to ordered tiers by a composite (e.g., historical cases): **Low, Moderate, High, Critical**.


