/// <reference types="jquery" />

// Helper to get selected radio button value by name
function getSelectedRadioValue(name) {
  const radios = document.getElementsByName(name);
  for (const radio of radios) {
    if (radio.checked) {
      return parseInt(radio.value);
    }
  }
  return -1; // Invalid Value
}

// Triggered when Estimate Price button is clicked
function onClickedEstimatePrice() {
  console.log("Estimate price button clicked");

  const sqft = parseFloat(document.getElementById("uiSqft").value);
  const bhk = getSelectedRadioValue("uiBHK");
  const bathrooms = getSelectedRadioValue("uiBathrooms");
  const location = document.getElementById("uiLocations").value;
  const estPriceElement = document.getElementById("uiEstimatedPrice");

  if (!sqft || bhk === -1 || bathrooms === -1 || !location) {
    estPriceElement.innerHTML = "<h2>Please fill in all fields correctly.</h2>";
    return;
  }

  const url = "http://127.0.0.1:5000/predict_home_price"; // Adjust for your backend

  $.post(url, {
    total_sqft: sqft,
    bhk: bhk,
    bath: bathrooms,
    location: location
  }, function (data) {
    const estimatedPrice = data.estimated_price;
    console.log("Estimated Price:", estimatedPrice);
    estPriceElement.innerHTML = `<h2>Estimated Price: ₹ ${estimatedPrice} Lakh</h2>`;
  }).fail(function () {
    estPriceElement.innerHTML = "<h2>Server error. Please try again later.</h2>";
  });
}

// Loads location names on page load
function onPageLoad() {
  console.log("Document loaded");

  const url = "http://127.0.0.1:5000/get_location_names"; // Adjust for your backend

  $.get(url, function (data) {
    if (data && data.locations) {
      const $uiLocations = $('#uiLocations');
      $uiLocations.empty();
      $uiLocations.append('<option disabled selected>Choose a Location</option>');
      for (const loc of data.locations) {
        $uiLocations.append(new Option(loc));
      }
    }
  }).fail(function () {
    console.error("Failed to load locations.");
  });
}

window.onload = onPageLoad;
