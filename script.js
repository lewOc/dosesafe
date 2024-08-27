// Initialize drug database with a placeholder
let drugDatabase = {
    "placeholder": {
        "name": "Placeholder Drug",
        "harmReductionInfo": [
            "This is a placeholder harm reduction tip 1.",
            "This is a placeholder harm reduction tip 2.",
            "This is a placeholder harm reduction tip 3.",
            "This is a placeholder harm reduction tip 4.",
            "This is a placeholder harm reduction tip 5."
        ],
        "additionalInfo": "This is placeholder additional information about the drug."
    }
};

// Flag to check if the database has been loaded
let databaseLoaded = true;  // Set to true for the placeholder

// Add these variables at the top of your script
let combosDatabase = {};
let combosDatabaseLoaded = false;
let comboDefinitions = [];

// Add this function to fetch both combos database and combo definitions
function fetchDatabases() {
    Promise.all([
        fetch('combos.json').then(response => response.json()),
        fetch('combo_definitions.json').then(response => response.json())
    ])
    .then(([combosData, definitionsData]) => {
        combosDatabase = combosData;
        comboDefinitions = definitionsData;
        combosDatabaseLoaded = true;
        populateDrugDropdowns();
    })
    .catch(error => console.error('Error loading databases:', error));
}

// Function to populate dropdowns with drug names
function populateDrugDropdowns() {
    const dropdowns = ['drug1Select', 'drug2Select'];
    
    dropdowns.forEach(dropdownId => {
        const select = document.getElementById(dropdownId);
        select.innerHTML = '<option value="">Select a drug</option>';
        
        for (let drugKey in combosDatabase) {
            const option = document.createElement('option');
            option.value = drugKey;
            option.textContent = drugKey.charAt(0).toUpperCase() + drugKey.slice(1); // Capitalize first letter
            select.appendChild(option);
        }
    });
}

// Fetch the drug database from JSON file
fetch('drugs.json')
  .then(response => response.json())
  .then(data => {
    // Merge placeholder with loaded data
    drugDatabase = {...drugDatabase, ...data};
    databaseLoaded = true;
    populateAdditionalShortcuts();
    populateDrugDropdown(); // Add this line to populate the dropdown
    
    // Check if there's a drug name in the URL on page load
    const urlParams = new URLSearchParams(window.location.search);
    const drugName = urlParams.get('drug');
    if (drugName) {
      displayDrugInfo(drugName);
    }
  })
  .catch(error => console.error('Error loading drug database:', error));

/**
 * Display drug information in the results div
 * @param {string} drugName - The name of the drug to display
 */
function displayDrugInfo(drugName) {
  const resultsDiv = document.getElementById('results');
  
  if (!databaseLoaded) {
    resultsDiv.innerHTML = '<p>Please wait, drug database is still loading...</p>';
    return;
  }

  const drug = drugDatabase[drugName.toLowerCase()];

  if (drug) {
    let infoHTML = `
      <h2 style="text-align: center;">${drug.pretty_name || drug.name}</h2>
    `;

    if (drug.properties && drug.properties.summary) {
      infoHTML += `<p><strong>Summary:</strong> ${drug.properties.summary}</p>`;
    }

    if (drug.properties && drug.properties.dose) {
      infoHTML += `<p><strong>Dosage:</strong> ${drug.properties.dose}</p>`;
    } else if (drug.formatted_dose) {
      infoHTML += `<p><strong>Dosage:</strong></p><ul>`;
      for (let [route, doses] of Object.entries(drug.formatted_dose)) {
        infoHTML += `<li>${route}:<ul>`;
        for (let [level, amount] of Object.entries(doses)) {
          infoHTML += `<li>${level}: ${amount}</li>`;
        }
        infoHTML += `</ul></li>`;
      }
      infoHTML += `</ul>`;
    }

    if (drug.properties && drug.properties.duration) {
      infoHTML += `<p><strong>Duration:</strong> ${drug.properties.duration}</p>`;
    }

    if (drug.properties && drug.properties.onset) {
      infoHTML += `<p><strong>Onset:</strong> ${drug.properties.onset}</p>`;
    }

    resultsDiv.innerHTML = infoHTML;
    
    // Update the URL
    const newUrl = `${window.location.pathname}?drug=${encodeURIComponent(drugName)}`;
    history.pushState({drugName: drugName}, '', newUrl);
  } else {
    resultsDiv.innerHTML = `<p>No information available for ${drugName}.</p>`;
  }
}

/**
 * Search for a drug based on user input
 */
function searchDrug() {
  const searchInput = document.getElementById('searchInput');
  const suggestionsContainer = document.getElementById('suggestions');
  displayDrugInfo(searchInput.value.trim() || "placeholder");
  suggestionsContainer.style.display = 'none';
}

/**
 * Search for a drug using the shortcut buttons
 * @param {string} drugName - The name of the drug to search for
 */
function searchShortcut(drugName) {
  displayDrugInfo(drugName);
}

/**
 * Populate additional shortcuts based on the drug database
 */
function populateAdditionalShortcuts() {
  const additionalShortcutsDiv = document.querySelector('.additional-shortcuts');
  if (!additionalShortcutsDiv) return;  // Guard clause in case the div doesn't exist

  const existingShortcuts = ['MDMA', 'Cocaine', 'Weed', 'Alcohol', 'Meth'];
  
  for (let drug in drugDatabase) {
    if (!existingShortcuts.includes(drugDatabase[drug].name)) {
      const shortcut = document.createElement('div');
      shortcut.className = 'shortcut';
      shortcut.textContent = drugDatabase[drug].name;
      shortcut.onclick = () => searchShortcut(drug);
      additionalShortcutsDiv.appendChild(shortcut);
    }
  }
}

/**
 * Populate the drug dropdown with options from the database
 */
function populateDrugDropdown() {
    const drugSelect = document.getElementById('drugSelect');
    
    // Clear existing options
    drugSelect.innerHTML = '<option value="">Select a drug</option>';
    
    // Add options for each drug in the database
    for (let drugKey in drugDatabase) {
        if (drugKey !== 'placeholder') {
            const option = document.createElement('option');
            option.value = drugKey;
            option.textContent = drugDatabase[drugKey].name;
            drugSelect.appendChild(option);
        }
    }
}

// Event listener for dosage form submission
document.getElementById('dosageForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const result = document.getElementById('dosageResult');
    const selectedDrug = document.getElementById('drugSelect').value;
    const weight = parseFloat(document.getElementById('weight').value);
    
    result.style.display = 'block';
    
    if (selectedDrug && drugDatabase[selectedDrug] && !isNaN(weight)) {
        const drug = drugDatabase[selectedDrug];
        let dosageInfo = drug.dosageInfo || 'No specific dosage information available for this drug.';
        
        // Specific calculation for MDMA
        if (selectedDrug.toLowerCase() === 'mdma') {
            const recommendedDose = weight + 50;
            dosageInfo = `
                <p>Based on the formula (body weight in kg + 50):</p>
                <p>Recommended dose: ${recommendedDose.toFixed(2)} mg</p>
                <p><strong>Important:</strong> This is a general guideline. Never exceed 200 mg in a session. 
                Always start with a lower dose, especially if it's from a new batch.</p>
            `;
        }
        
        result.innerHTML = `
            <h3>Dosage Information for ${drug.name}</h3>
            ${dosageInfo}
            <p><strong>Remember:</strong> This information is for educational purposes only. Always consult a medical professional for personalized advice.</p>
        `;
    } else {
        result.innerHTML = 'Please select a valid drug from the dropdown and enter a valid weight.';
    }
});

// Handle browser back/forward navigation
window.onpopstate = function(event) {
  if (event.state && event.state.drugName) {
    displayDrugInfo(event.state.drugName);
  } else {
    displayDrugInfo("placeholder");
  }
};

// Display placeholder drug info on page load if no drug is specified in the URL
document.addEventListener('DOMContentLoaded', function() {
  const urlParams = new URLSearchParams(window.location.search);
  const drugName = urlParams.get('drug');
  if (!drugName) {
    displayDrugInfo("placeholder");
  }
  populateDrugDropdown(); // Add this line to populate the dropdown on page load
});

// Update this function to display combination effects including the definition and emoji
function displayCombinationEffects(drug1, drug2) {
    const result = document.getElementById('combinationResult');
    
    if (drug1 && drug2 && combosDatabaseLoaded) {
        let combination = combosDatabase[drug1]?.[drug2] || combosDatabase[drug2]?.[drug1];
        if (combination) {
            let status = combination.status;
            let note = combination.note || "No additional information available.";
            
            // Find the matching definition
            let definitionObj = comboDefinitions.find(def => def.status === status) || {};
            let emoji = definitionObj.emoji || "";
            let definition = definitionObj.definition || "No definition available.";
            
            result.innerHTML = `
                <h3>Combination of ${drug1} and ${drug2}:</h3>
                <p><strong>Status:</strong> ${emoji} ${status}</p>
                <p><strong>Note:</strong> ${note}</p>
                <p><strong>Definition:</strong> ${emoji} ${definition}</p>
            `;
        } else {
            result.innerHTML = `No specific information available for the combination of ${drug1} and ${drug2}. Please consult a medical professional for accurate information about drug interactions.`;
        }
    } else if (!combosDatabaseLoaded) {
        result.innerHTML = 'Please wait, drug combination database is still loading...';
    } else {
        result.innerHTML = 'Please select two drugs to check their combination.';
    }
}

document.getElementById('combinationsForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const drug1 = document.getElementById('drug1Select').value;
    const drug2 = document.getElementById('drug2Select').value;
    displayCombinationEffects(drug1, drug2);
});

// Update your DOMContentLoaded event listener
document.addEventListener('DOMContentLoaded', function() {
    // ... (existing code)
    fetchDatabases();
});

// Add this function to your existing script.js file

function showSuggestions() {
    const input = document.getElementById('searchInput');
    const suggestionsContainer = document.getElementById('suggestions');
    const inputValue = input.value.toLowerCase();

    // Clear previous suggestions
    suggestionsContainer.innerHTML = '';

    if (inputValue.length === 0) {
        suggestionsContainer.style.display = 'none';
        return;
    }

    const matchingDrugs = Object.keys(drugDatabase).filter(key => 
        drugDatabase[key].name.toLowerCase().includes(inputValue)
    );

    if (matchingDrugs.length > 0) {
        matchingDrugs.forEach(key => {
            const suggestion = document.createElement('div');
            suggestion.className = 'suggestion';
            suggestion.textContent = drugDatabase[key].name;
            suggestion.onclick = function() {
                input.value = this.textContent;
                suggestionsContainer.style.display = 'none';
                displayDrugInfo(this.textContent);
            };
            suggestionsContainer.appendChild(suggestion);
        });
        suggestionsContainer.style.display = 'block';
    } else {
        suggestionsContainer.style.display = 'none';
    }
}

// Add these event listeners to your existing DOMContentLoaded event
document.addEventListener('DOMContentLoaded', function() {
    // ... (existing code)

    const searchInput = document.getElementById('searchInput');
    searchInput.addEventListener('input', showSuggestions);

    // Hide suggestions when clicking outside
    document.addEventListener('click', function(e) {
        if (e.target.id !== 'searchInput') {
            document.getElementById('suggestions').style.display = 'none';
        }
    });
});

// Update your existing searchDrug function
function searchDrug() {
    const searchInput = document.getElementById('searchInput');
    const suggestionsContainer = document.getElementById('suggestions');
    displayDrugInfo(searchInput.value.trim() || "placeholder");
    suggestionsContainer.style.display = 'none';
}