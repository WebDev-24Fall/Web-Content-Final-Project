# Web Content Management Systems

PROG8761 - Fall 2024 - Section 6

## Final Project

### Students' Charts

- [Abdul Mannan, Mohammed](./Abdul/)
- [Gu, Yunxiang](./yunxiang/)
- [Macwan, Sarah Advin](./sarah/)
- [Shaikh, Daneesh Bashir](./danish/)

### Data Source

The data used in this project is sourced from the [United Nations data repository](https://data.un.org/). It provides comprehensive statistics on population growth, fertility rates, life expectancy, and mortality indicators, offering a detailed examination of global demographic trends. The dataset is regularly updated to ensure accuracy and relevance.

For this project, the following specific dimensions were utilized:

-	Population aged 0 to 14: The proportion of children within the total population.
-	Population aged 60+ years: Data on the elderly population, reflecting aging trends globally.
-	Population mid-year estimates:
-	Total population: Mid-year population figures.
-	Male population: Gender-specific data for males.
-	Female population: Gender-specific data for females.
-	Population density: The number of people per square kilometer of land area.
-	Sex ratio: The number of males per 100 females in the population.
-	Surface area (thousand km²): Land area size, providing context for population density and distribution.

These detailed metrics allow for an in-depth analysis of demographic patterns, population structure, and their implications on societal development.

For more details, you can access the data through the following links:

-	[PDF Report](https://data.un.org/_Docs/SYB/PDFs/SYB66_1_202310_Population,%20Surface%20Area%20and%20Density.pdf)

-	[CSV Dataset](https://data.un.org/_Docs/SYB/CSV/SYB66_1_202310_Population,%20Surface%20Area%20and%20Density.csv)

**Updated: 25-Oct-2023**

---

## Chart Class Documentation

### Overview

The `Chart` class is a powerful utility for parsing, filtering, and processing CSV data with flexible configuration options. It provides an easy-to-use interface for extracting specific data from CSV files based on custom filtering criteria.

### Class Features

- CSV file parsing
- Dynamic data filtering
- Automatic type conversion
- Asynchronous data fetching

### Constructor

#### `new Chart(config)`

Creates a new Chart instance with a specified configuration.

##### Parameters
- `config` (Object): A configuration object that defines how to filter and extract data from the CSV.

##### Configuration Object Structure
```javascript
{
  key1: {
    index: number,      // Column index to extract
    filter?: string[]   // Optional array of values to filter by
  },
  key2: {
    // Similar structure
  }
}
```

### Methods

#### `fetchData()` 

An asynchronous method that retrieves and processes CSV data based on the configuration.

##### Returns
- `Promise<Array>`: An array of objects matching the specified configuration.

### Example Usage

```javascript
// Create a Chart instance with specific filtering
const chart = new Chart({
  year: {
    index: 2,
    filter: ["2022"]
  },
  continent: {
    index: 1,
    filter: ["Africa", "Europe"]
  },
  population: {
    index: 4
  }
});

// Fetch and process data
async function processData() {
  try {
    const filteredData = await chart.fetchData();
    console.log(filteredData);
  } catch (error) {
    console.error("Data processing failed:", error);
  }
}
```

### Internal Methods

#### `#parseCSV(csvContent)`
- Parses raw CSV content into a 2D array
- Handles quoted and comma-separated values
- Trims whitespace from fields

#### `#convertToNumber(value)`
- Converts string values to numbers
- Removes commas from numeric strings

### Key Behaviors

1. Skips the first row (header) of the CSV
2. Applies all specified filters
3. Converts population values to numeric type
4. Handles missing or malformed data gracefully

### Error Handling

- Throws an error if file fetching fails
- Logs detailed error information to the console
- Provides comprehensive error messages

### Limitations

- Requires CSV file to be accessible via `fetch`
- Assumes specific CSV structure
- Limited to client-side processing

### Best Practices

- Specify all necessary filters
- Handle potential errors in data fetching
- Verify CSV file path and accessibility

### Potential Improvements

- Add support for more complex filtering
- Implement caching mechanism
- Enhance error handling and logging
- Support multiple file formats

### License

MIT License

### Contributing

Contributions are welcome! Please submit pull requests or open issues on the project repository.
