document.addEventListener("DOMContentLoaded", () => {
  // DOM Elements
  const form = document.getElementById("jobsheet-form");
  const companyNameInput = document.getElementById("company-name"); // Tambahkan ini
  const marketingNameInput = document.getElementById("marketing-name"); // Tambahkan ini
  const wasteNameInput = document.getElementById("waste-name");
  const unitInput = document.getElementById("unit");
  const unitPriceInput = document.getElementById("unit-price");
  const totalClientPriceInput = document.getElementById("total-client-price");
  const costInput = document.getElementById("cost");
  const totalCostInput = document.getElementById("total-cost");
  const profitEstimationInput = document.getElementById("profit-estimation");
  const gpmInput = document.getElementById("gpm");
  const quantityInput = document.getElementById("quantity");
  const suggestionsContainer = document.getElementById("suggestions");

  let wasteData = [];

  // Fetch Waste Data
  async function fetchWasteData() {
    try {
      const response = await fetch("https://wm-be.dev.pituku.id/waste", {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: "Bearer 123", // Ganti dengan token yang benar
        },
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      wasteData = data.data;
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  // Show Suggestions
  function showSuggestions(suggestions) {
    suggestionsContainer.innerHTML = "";
    suggestions.forEach((suggestion) => {
      const div = document.createElement("div");
      div.textContent = suggestion.waste_name;
      div.addEventListener("click", () => {
        wasteNameInput.value = suggestion.waste_name;
        unitInput.value = suggestion.unit || "N/A";
        unitPriceInput.value = suggestion.waste_price;
        updateTotalClientPrice();
        updateTotalCost();
        updateProfitEstimation();
        updateGPM();
        suggestionsContainer.style.display = "none"; // Hide suggestions after selection
      });
      suggestionsContainer.appendChild(div);
    });
    suggestionsContainer.style.display =
      suggestions.length > 0 ? "block" : "none";
  }

  wasteNameInput.addEventListener("input", () => {
    const inputValue = wasteNameInput.value.toLowerCase();
    if (inputValue) {
      const filteredSuggestions = wasteData.filter((item) =>
        item.waste_name.toLowerCase().includes(inputValue)
      );
      showSuggestions(filteredSuggestions);
    } else {
      suggestionsContainer.style.display = "none";
    }
  });

  document.addEventListener("click", (event) => {
    if (
      !suggestionsContainer.contains(event.target) &&
      event.target !== wasteNameInput
    ) {
      suggestionsContainer.style.display = "none";
    }
  });

  quantityInput.addEventListener("input", () => {
    updateTotalClientPrice();
    updateTotalCost();
    updateProfitEstimation();
  });

  costInput.addEventListener("input", () => {
    updateTotalCost();
    updateProfitEstimation();
  });

  // Update Total Client Price
  function updateTotalClientPrice() {
    const quantity = parseFloat(quantityInput.value) || 0;
    const unitPrice = parseFloat(unitPriceInput.value) || 0;
    totalClientPriceInput.value = `Rp ${quantity * unitPrice}`;
  }

  // Update Total Cost
  function updateTotalCost() {
    const quantity = parseFloat(quantityInput.value) || 0;
    const cost = parseFloat(costInput.value) || 0;
    totalCostInput.value = `Rp ${quantity * cost}`;
  }

  // Update Profit Estimation
  function updateProfitEstimation() {
    const totalClientPrice = parseFloat(
      totalClientPriceInput.value.replace(/[^0-9.-]+/g, "")
    );
    const totalCost = parseFloat(
      totalCostInput.value.replace(/[^0-9.-]+/g, "")
    );
    const profit = totalClientPrice - totalCost;
    profitEstimationInput.value = `Rp ${profit}`;
    updateGPM(profit);
  }

  // Update GPM
  function updateGPM(profit) {
    const totalClientPrice = parseFloat(
      totalClientPriceInput.value.replace(/[^0-9.-]+/g, "")
    );
    const gpm = ((profit / totalClientPrice) * 100).toFixed(2);
    gpmInput.value = `${gpm}%`;
  }

  // Handle form submission
  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const jobsheet = {
      companyName: companyNameInput.value, // Tambahkan ini
      marketingName: marketingNameInput.value, // Tambahkan ini
      wasteName: wasteNameInput.value,
      unit: unitInput.value,
      quantity: quantityInput.value,
      unitPrice: unitPriceInput.value,
      totalClientPrice: totalClientPriceInput.value,
      cost: costInput.value,
      totalCost: totalCostInput.value,
      Armada: form.Armada.value,
      profitEstimation: profitEstimationInput.value,
      gpm: gpmInput.value,
    };

    // Ambil data dari localStorage dan pastikan itu adalah array
    let jobsheetData = JSON.parse(localStorage.getItem("jobsheetData"));

    if (!Array.isArray(jobsheetData)) {
      jobsheetData = [];
    }

    jobsheetData.push(jobsheet);
    localStorage.setItem("jobsheetData", JSON.stringify(jobsheetData));

    form.reset();
    alert("Jobsheet berhasil disubmit!");
    //window.location.href = "results.html";
  });

  fetchWasteData();
});
