# Drug Harm Reduction Information

## Description
This project is a web-based application designed to provide harm reduction information for various drugs. It offers a searchable database of drugs, dosage information, and drug combination effects. The primary goal is to educate users about the potential risks and safe practices associated with drug use.

## Features
- Search functionality for drug information
- Drug shortcuts for quick access to common substances
- Detailed drug information including dosage, duration, and onset
- Dosage calculator (with specific calculations for certain drugs like MDMA)
- Drug combination checker to display potential interactions
- Auto-suggest feature for drug searches

## Technologies Used
- HTML5
- CSS3
- JavaScript (ES6+)
- Fetch API for asynchronous data loading

## Setup
1. Clone the repository to your local machine.
2. Ensure you have a web server set up to serve the files (due to CORS restrictions when loading local JSON files).
3. Place the following JSON files in the project root:
   - `drugs.json`: Contains detailed information about individual drugs
   - `combos.json`: Contains information about drug combinations
   - `combo_definitions.json`: Contains definitions for different combination statuses

## Usage
1. Open `index.html` in a web browser.
2. Use the search bar to find information about specific drugs.
3. Click on drug shortcuts for quick access to common substances.
4. Use the dosage calculator for educational purposes (not for actual dosing advice).
5. Check drug combinations to understand potential interactions.

## Important Note
This application is for educational and harm reduction purposes only. It is not a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of a qualified healthcare provider with any questions you may have regarding a medical condition or substance use.

## Contributing
Contributions to improve the application or expand the drug database are welcome. Please submit pull requests for review.

## License
[Insert your chosen license here]

## Disclaimer
The creators and contributors of this application do not condone or encourage the use of illegal substances. The information provided is for harm reduction purposes only. Always prioritize your health and safety, and be aware of the legal status of substances in your jurisdiction.
