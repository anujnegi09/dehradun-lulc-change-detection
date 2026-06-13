// ============================================================
// LAND USE LAND COVER (LULC) CHANGE DETECTION
// Study Area: Dehradun District
// Platform   : Google Earth Engine
// Imagery    : Landsat 7 (2014) & Landsat 9 (2024)
// Classifiers: Random Forest & CART
// ============================================================



// ============================================================
// SECTION 1: LOAD STUDY AREA (ROI)
// ============================================================

// Import Dehradun district boundary
var dehradunBoundary = ee.FeatureCollection("users/anujanand2284/DDN_final");

// Display boundary on map
Map.addLayer(
  dehradunBoundary,
  {color: 'FF0000', width: 2},
  "Dehradun Boundary"
);

// Center map on Dehradun
Map.setCenter(78.0322, 30.3165, 10);



// ============================================================
// SECTION 2: DEFINE SATELLITE BANDS
// ============================================================

// Landsat 7 Surface Reflectance Bands
var landsat7Bands = [
  'SR_B1',
  'SR_B2',
  'SR_B3',
  'SR_B4',
  'SR_B5',
  'SR_B7'
];

// Landsat 9 Surface Reflectance Bands
var landsat9Bands = [
  'SR_B2',
  'SR_B3',
  'SR_B4',
  'SR_B5',
  'SR_B6',
  'SR_B7'
];

// Common renamed bands
var commonBands = [
  'Blue',
  'Green',
  'Red',
  'NIR',
  'SWIR1',
  'SWIR2'
];



// ============================================================
// SECTION 3: LOAD & PREPROCESS LANDSAT DATA
// ============================================================


// -------------------- Landsat 7 (2014) --------------------

var landsat2014 = ee.ImageCollection('LANDSAT/LE07/C02/T1_L2')

  // Filter date range
  .filterDate('2014-01-01', '2014-12-31')

  // Filter study area
  .filterBounds(dehradunBoundary)

  // Preprocessing
  .map(function(image){

    return image

      // Select and rename bands
      .select(landsat7Bands, commonBands)

      // Apply scale factor
      .multiply(0.0000275)
      .add(-0.2);

  })

  // Create median composite
  .median()

  // Clip to study area
  .clip(dehradunBoundary);



// -------------------- Landsat 9 (2024) --------------------

var landsat2024 = ee.ImageCollection('LANDSAT/LC09/C02/T1_L2')

  .filterDate('2024-01-01', '2024-12-31')

  .filterBounds(dehradunBoundary)

  .map(function(image){

    return image

      .select(landsat9Bands, commonBands)

      .multiply(0.0000275)
      .add(-0.2);

  })

  .median()

  .clip(dehradunBoundary);



// ============================================================
// SECTION 4: VISUALIZE TRUE COLOR COMPOSITES
// ============================================================

var trueColorVisualization = {
  bands: ['Red', 'Green', 'Blue'],
  min: 0,
  max: 0.3
};

Map.addLayer(
  landsat2014,
  trueColorVisualization,
  "Landsat 2014 True Color"
);

Map.addLayer(
  landsat2024,
  trueColorVisualization,
  "Landsat 2024 True Color"
);



// ============================================================
// SECTION 5: PREPARE TRAINING DATA
// ============================================================

// Assign class labels

var WaterPoints = WaterPoints.map(function(feature){
  return feature.set('class', 0);
});

var UrbanPoints = UrbanPoints.map(function(feature){
  return feature.set('class', 1);
});

var ForestPoints = ForestPoints.map(function(feature){
  return feature.set('class', 2);
});

var BarrenPoints = BarrenPoints.map(function(feature){
  return feature.set('class', 3);
});


// Merge all training datasets

var trainingData = WaterPoints
  .merge(UrbanPoints)
  .merge(ForestPoints)
  .merge(BarrenPoints);


// Print training sample size
print("Total Training Samples:", trainingData.size());



// ============================================================
// SECTION 6: SAMPLE SATELLITE PIXELS
// ============================================================

// Sample 2014 image
var training2014 = landsat2014.sampleRegions({
  collection: trainingData,
  properties: ['class'],
  scale: 30
});


// Sample 2024 image
var training2024 = landsat2024.sampleRegions({
  collection: trainingData,
  properties: ['class'],
  scale: 30
});



// ============================================================
// SECTION 7: TRAIN MACHINE LEARNING CLASSIFIERS
// ============================================================


// -------------------- RANDOM FOREST --------------------

var randomForest2014 = ee.Classifier
  .smileRandomForest(50)
  .train({
    features: training2014,
    classProperty: 'class',
    inputProperties: commonBands
  });


var randomForest2024 = ee.Classifier
  .smileRandomForest(50)
  .train({
    features: training2024,
    classProperty: 'class',
    inputProperties: commonBands
  });



// -------------------- CART CLASSIFIER --------------------

var cart2014 = ee.Classifier
  .smileCart()
  .train({
    features: training2014,
    classProperty: 'class',
    inputProperties: commonBands
  });


var cart2024 = ee.Classifier
  .smileCart()
  .train({
    features: training2024,
    classProperty: 'class',
    inputProperties: commonBands
  });



// ============================================================
// SECTION 8: IMAGE CLASSIFICATION
// ============================================================


// Random Forest Classification

var classifiedRF2014 = landsat2014.classify(randomForest2014);

var classifiedRF2024 = landsat2024.classify(randomForest2024);


// CART Classification

var classifiedCART2014 = landsat2014.classify(cart2014);

var classifiedCART2024 = landsat2024.classify(cart2024);



// ============================================================
// SECTION 9: VISUALIZATION OF CLASSIFIED MAPS
// ============================================================

var classificationVisualization = {
  min: 0,
  max: 3,
  palette: [
    'blue',    // Water
    'red',     // Urban
    'green',   // Forest
    'yellow'   // Barren
  ]
};


// Add classified layers to map

Map.addLayer(
  classifiedRF2014,
  classificationVisualization,
  "Random Forest 2014"
);

Map.addLayer(
  classifiedRF2024,
  classificationVisualization,
  "Random Forest 2024"
);

Map.addLayer(
  classifiedCART2014,
  classificationVisualization,
  "CART 2014"
);

Map.addLayer(
  classifiedCART2024,
  classificationVisualization,
  "CART 2024"
);



// ============================================================
// SECTION 10: EXPORT CLASSIFIED OUTPUTS
// ============================================================

var exportImages = [

  {
    image: classifiedRF2014,
    description: 'RF_2014'
  },

  {
    image: classifiedRF2024,
    description: 'RF_2024'
  },

  {
    image: classifiedCART2014,
    description: 'CART_2014'
  },

  {
    image: classifiedCART2024,
    description: 'CART_2024'
  }

];


// Export all classified maps

exportImages.forEach(function(item){

  Export.image.toDrive({

    image: item.image,

    description: item.description,

    folder: 'GEE_Exports',

    scale: 30,

    region: dehradunBoundary,

    maxPixels: 1e13

  });

});



// ============================================================
// SECTION 11: ACCURACY ASSESSMENT
// ============================================================

function assessAccuracy(classifiedImage, trainingDataset, modelName){

  // Extract classified values
  var validated = classifiedImage.sampleRegions({

    collection: trainingDataset,

    properties: ['class'],

    scale: 30

  });


  // Generate confusion matrix
  var confusionMatrix = validated.errorMatrix(
    'class',
    'classification'
  );


  // Print results
  print(modelName + ' Confusion Matrix:', confusionMatrix);

  print(
    modelName + ' Overall Accuracy:',
    confusionMatrix.accuracy()
  );

}



// Assess Random Forest Accuracy

assessAccuracy(
  classifiedRF2014,
  trainingData,
  "Random Forest 2014"
);

assessAccuracy(
  classifiedRF2024,
  trainingData,
  "Random Forest 2024"
);


// Assess CART Accuracy

assessAccuracy(
  classifiedCART2014,
  trainingData,
  "CART 2014"
);

assessAccuracy(
  classifiedCART2024,
  trainingData,
  "CART 2024"
);



// ============================================================
// SECTION 12: AREA STATISTICS & CHANGE ANALYSIS
// ============================================================


// Define class names

var classNames = ee.Dictionary({

  0: "Water",

  1: "Urban",

  2: "Forest",

  3: "Barren"

});



// Function to calculate area

function calculateArea(classifiedImage){

  var areaImage = ee.Image.pixelArea()
    .addBands(classifiedImage);


  var statistics = areaImage.reduceRegion({

    reducer: ee.Reducer.sum().group({

      groupField: 1,

      groupName: 'class'

    }),

    geometry: dehradunBoundary,

    scale: 30,

    maxPixels: 1e13

  });


  return ee.List(statistics.get('groups'))
    .map(function(group){

      group = ee.Dictionary(group);

      return ee.Dictionary({

        class: group.get('class'),

        area_ha: ee.Number(group.get('sum'))
          .divide(10000)

      });

    });

}



// Calculate area statistics

var area2014 = ee.List(
  calculateArea(classifiedRF2014)
);

var area2024 = ee.List(
  calculateArea(classifiedRF2024)
);



// Compare land cover changes

var comparison = area2014.zip(area2024)
  .map(function(pair){

    pair = ee.List(pair);

    var year2014 = ee.Dictionary(pair.get(0));

    var year2024 = ee.Dictionary(pair.get(1));

    var classValue = year2014.get('class');

    var className = classNames.get(classValue);


    return ee.String("2014 - ")

      .cat(ee.String(className))
      .cat(" : ")

      .cat(
        year2014.getNumber('area_ha')
        .format('%.2f')
      )

      .cat(" ha\n")

      .cat("2024 - ")

      .cat(ee.String(className))
      .cat(" : ")

      .cat(
        year2024.getNumber('area_ha')
        .format('%.2f')
      )

      .cat(" ha\n")

      .cat("Difference : ")

      .cat(
        year2024.getNumber('area_ha')
        .subtract(year2014.getNumber('area_ha'))
        .format('%.2f')
      )

      .cat(" ha\n");

  });



// Print final comparison

print("========== LULC AREA CHANGE (2014 → 2024) ==========");

comparison.evaluate(function(result){

  result.forEach(function(item){

    print(item);

  });

});



// ============================================================
// END OF PROJECT
// ============================================================