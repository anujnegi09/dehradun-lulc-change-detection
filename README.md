# Dehradun Land Use Land Cover (LULC) Change Detection

## Overview

This project performs Land Use Land Cover (LULC) classification and change detection for Dehradun district using Google Earth Engine. The study compares land cover changes between 2014 and 2024 using Landsat satellite imagery and machine learning classifiers.

## Objectives

* Compare land cover between 2014 and 2024
* Classify Water, Urban, Forest, and Barren land
* Evaluate Random Forest and CART classifiers
* Calculate area changes over time

## Technologies Used

* Google Earth Engine
* JavaScript
* Landsat 7
* Landsat 9
* Random Forest Classifier
* CART Classifier

## Study Area

### Dehradun Boundary (ROI)

![Dehradun Boundary](images/Dehradun%20Boundary%20(ROI).png)

---

## Training Data Collection

### All Training Points

![All Training Points](Images/All%20Training%20points.png)

### Water Points

![Water Points](Images/Water%20points.png)

### Urban Points

![Urban Points](Images/Urben%20points.png)

### Forest Points

![Forest Points](Images/Forest%20points.png)

### Barren Points

![Barren Points](Images/Barren%20points.png)

---

## Classification Results

### Random Forest 2014

![RF 2014](Results/RF%202014.png)

### Random Forest 2024

![RF 2024](Results/RF%202024.png)

### CART 2014

![CART 2014](Results/CART%202014.png)

### CART 2024

![CART 2024](Results/CART%202024.png)

---

## Confusion Matrices

### Random Forest

![Confusion Matrix RF](Results/confusion%20matrix%20RF.png)

### CART

![Confusion Matrix CART](Results/confusion%20matrix%20CART.png)

---

## Classification Accuracy

| Classifier    | Year | Overall Accuracy |
| ------------- | ---- | ---------------: |
| Random Forest | 2014 |           99.78% |
| Random Forest | 2024 |           99.56% |
| CART          | 2014 |          100.00% |
| CART          | 2024 |          100.00% |

**Total Training Samples:** 453

---

## Land Cover Change Analysis (2014–2024)

| Land Cover Class | Area in 2014 (ha) | Area in 2024 (ha) | Change (ha) | Trend        |
| ---------------- | ----------------: | ----------------: | ----------: | ------------ |
| Water            |          8,067.05 |         11,038.14 |   +2,971.09 | 📈 Increased |
| Urban            |         11,097.92 |         10,134.52 |     -963.40 | 📉 Decreased |
| Forest           |         34,508.99 |         33,125.71 |   -1,383.28 | 📉 Decreased |
| Barren Land      |         13,245.06 |         12,620.65 |     -624.41 | 📉 Decreased |

### Key Findings

* Water bodies increased by **2,971.09 hectares** between 2014 and 2024.
* Forest cover decreased by **1,383.28 hectares**.
* Urban area decreased by **963.40 hectares**.
* Barren land decreased by **624.41 hectares**.

---

## Author

**Anuj Negi**
