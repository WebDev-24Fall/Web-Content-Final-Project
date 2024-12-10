class Chart {
  // Constructor to initialize the Chart instance with column configurations
  constructor(config) {
    this.config = config; // Configuration object containing index and filter for each key
    this.filename = "../data/SYB66_1_202310_Population, Surface Area and Density.csv";
    this.result = []; // Holds the parsed and filtered data
  }

  // Private method to parse CSV content into structured data
  #parseCSV(csvContent) {
    return csvContent
      .trim() // Remove extra spaces at the beginning and end
      .split("\n") // Split content into rows
      .map((row) => {
        // Use regex to correctly handle quoted and comma-separated values
        const regex = /(".*?"|[^",]+)(?=\s*,|\s*$)/g;
        const matches = row.match(regex);
        // Remove leading and trailing quotes and trim spaces
        return matches.map((field) => field.replace(/^"|"$/g, "").trim());
      });
  }

  // Helper method to convert string to number
  #convertToNumber(value) {
    // Remove commas and convert to number
    return Number(value.replace(/,/g, ""));
  }

  // Fetch CSV data from the server and filter it based on the config
  async fetchData() {
    const { filename, config } = this;

    try {
      // Fetch the CSV file
      const response = await fetch(`http://localhost:5500/${filename}`);
      const text = await response.text();

      // Parse the CSV content
      const data = this.#parseCSV(text);

      // Clear previous results
      this.result = [];

      // Skip the header row (assuming first row is headers)
      const dataRows = data.slice(1);

      // Filter and process rows based on configuration
      for (let row of dataRows) {
        let shouldInclude = true;

        // Check each configured filter
        for (let key in config) {
          const keyConfig = config[key];

          // If the configuration has a filter array
          if (keyConfig.filter) {
            const value = row[keyConfig.index];

            // Check if the value matches any of the filter conditions
            if (!keyConfig.filter.includes(value)) {
              shouldInclude = false;
              break;
            }
          }
        }

        // If the row passes all filters, add it to the result
        if (shouldInclude) {
          const item = {};

          // Populate the item with configured values
          for (let key in config) {
            const keyConfig = config[key];
            const value = row[keyConfig.index];

            // Special handling for population - convert to number
            if (key === "population") {
              item[key] = this.#convertToNumber(value);
            } else {
              item[key] = value;
            }
          }

          this.result.push(item);
        }
      }

      return this.result;
    } catch (error) {
      console.error("Error fetching or processing data:", error);
      throw error;
    }
  }
}
