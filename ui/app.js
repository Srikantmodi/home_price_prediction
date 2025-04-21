function getBathValue() {
  var uiBathrooms = document.getElementsByName("uiBathrooms");
  for(var i = 0; i < uiBathrooms.length; i++) {
    if(uiBathrooms[i].checked) {
        return parseInt(uiBathrooms[i].value);
    }
  }
  return 2; // Default to 2 bathrooms
}

function getBHKValue() {
  var uiBHK = document.getElementsByName("uiBHK");
  for(var i = 0; i < uiBHK.length; i++) {
    if(uiBHK[i].checked) {
        return parseInt(uiBHK[i].value);
    }
  }
  return 2; // Default to 2 BHK
}

function onClickedEstimatePrice() {
  console.log("Estimate price button clicked");
  var sqft = document.getElementById("uiSqft");
  var bhk = getBHKValue();
  var bathrooms = getBathValue();
  var location = document.getElementById("uiLocations");
  var priceValue = document.getElementById("priceValue");

  // Validation
  if (!sqft.value || isNaN(parseFloat(sqft.value))) {
    alert("Please enter a valid square footage");
    return;
  }

  if (!location.value || location.value === "Select a location") {
    alert("Please select a location");
    return;
  }

  // Show loading state
  priceValue.innerHTML = "Calculating...";

  console.log("Submitting form with values:", {
    total_sqft: parseFloat(sqft.value),
    bhk: bhk,
    bath: bathrooms,
    location: location.value
  });

  // Create form data
  const formData = new FormData();
  formData.append('total_sqft', parseFloat(sqft.value));
  formData.append('bhk', bhk);
  formData.append('bath', bathrooms);
  formData.append('location', location.value);

  // Use fetch API with form data
  fetch("http://localhost:5000/predict_home_price", { // Ensure this URL matches your backend
    method: "POST",
    body: formData
  })
    .then(response => {
      console.log("Response status:", response.status);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      console.log("Response data:", data);
      if (data && data.estimated_price) {
        if (data.estimated_price === "Error") {
          priceValue.innerHTML = "Error calculating price";
        } else {
          priceValue.innerHTML = data.estimated_price.toString() + " Lakh";
        }
      } else if (data && data.error) {
        console.error("Server error:", data.error);
        priceValue.innerHTML = "Error: " + data.error;
      } else {
        priceValue.innerHTML = "Invalid response";
      }
    })
    .catch(error => {
      console.error("Fetch error:", error);
      priceValue.innerHTML = "Error connecting to server";
    });
}

function onPageLoad() {
  console.log("Document loaded");

  // Use fetch API for better promise handling
  fetch("http://localhost:5000/get_location_names") // Updated URL
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      console.log("Location data:", data);

      if (data && data.locations && data.locations.length > 0) {
        var locations = data.locations;
        var uiLocations = document.getElementById("uiLocations");

        // Clear existing options
        uiLocations.innerHTML = "";

        // Add placeholder option
        var placeholderOption = document.createElement("option");
        placeholderOption.value = "";
        placeholderOption.disabled = true;
        placeholderOption.selected = true;
        placeholderOption.textContent = "Select a location";
        uiLocations.appendChild(placeholderOption);

        // Add location options
        for (var i = 0; i < locations.length; i++) {
          var option = document.createElement("option");
          option.value = locations[i];
          option.textContent = locations[i];
          uiLocations.appendChild(option);
        }

        console.log("Added " + locations.length + " locations to dropdown");
      } else {
        console.error("No valid locations data received");
        addDefaultLocations();
      }
    })
    .catch(error => {
      console.error("Error fetching locations:", error);
      addDefaultLocations();
    });
}

function addDefaultLocations() {
  // Add default locations if API fails
  var uiLocations = document.getElementById("uiLocations");
  uiLocations.innerHTML = "";

  var defaultLocations = [
    "1st Block Jayanagar",
    "1st Phase JP Nagar",
    "Electronic City",
    "Whitefield",
    "Sarjapur Road",
    "HSR Layout",
    "Koramangala",
    "Bannerghatta Road",
    "MG Road",
    "Indiranagar"
  ];

  // Add placeholder
  var placeholderOption = document.createElement("option");
  placeholderOption.value = "";
  placeholderOption.disabled = true;
  placeholderOption.selected = true;
  placeholderOption.textContent = "Select a location";
  uiLocations.appendChild(placeholderOption);

  // Add locations
  for (var i = 0; i < defaultLocations.length; i++) {
    var option = document.createElement("option");
    option.value = defaultLocations[i];
    option.textContent = defaultLocations[i];
    uiLocations.appendChild(option);
  }

  console.log("Added default locations to dropdown");
}

// Make sure the DOM is fully loaded before executing the onPageLoad function
document.addEventListener("DOMContentLoaded", onPageLoad);