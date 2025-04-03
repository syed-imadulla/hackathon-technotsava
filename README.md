Author1 : Syed Imadulla
<br>USN : 1SJ24CS151
<br><br>
Author2 : Safiya
<br>USN : 1SJ24CS125
<br><hr>
Problem statement : Develop a responsive frontend component that displays tabular data with advanced user interaction features, including filtering, sorting, and search.
<br>
Technologies used : HTML5, CSS3, Java script
<hr>
# Advanced Data Table

A responsive frontend component that displays tabular data with advanced user interaction features including filtering, sorting, and search capabilities.

## Features

- **Smart Sorting System**
  - Multi-column sorting (ascending/descending)
  - Type-aware sorting (numbers, text, dates)
  - Visual sort indicators

- **Advanced Filtering**
  - Column-specific filters (dropdowns, range sliders, date pickers)
  - Combined filters with AND/OR logic
  - Quick filter presets

- **Search Functionality**
  - Global search across all columns
  - Column-specific search
  - Highlight matching results

- **Row Management**
  - Auto-incrementing IDs
  - Stable row IDs during operations
  - Batch operations

- **Data Type Support**
  - Number formatting
  - Date formatting (multiple formats)
  - Custom display for special fields

- **UI/UX Enhancements**
  - Frozen header row
  - Resizable columns
  - Mobile-responsive design
  - Dark/light mode toggle

- **Export Options**
  - CSV export
  - Print-friendly view
  - Copy to clipboard

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/advanced-data-table.git
   ```

2. Navigate to the project directory:
   ```bash
   cd advanced-data-table
   ```

## Running the Application

This is a pure frontend application that requires no server or build process. You can simply open the `index.html` file in any modern web browser:

1. Double-click the `index.html` file in your file explorer, or
2. Use your browser's "Open File" option, or
3. If you have Python installed, you can run a simple HTTP server:
   ```bash
   python -m http.server 8000
   ```
   Then open `http://localhost:8000` in your browser.

## Testing

### Manual Testing

1. **Sorting**:
   - Click on column headers to sort
   - Verify ascending and descending order works for all data types

2. **Filtering**:
   - Test text filters in text columns
   - Test number range filters with the slider
   - Test date range filters with the date picker

3. **Search**:
   - Enter text in the global search box
   - Verify results are filtered and highlighted

4. **Row Operations**:
   - Add new rows with the "Add Row" button
   - Edit cells by double-clicking
   - Delete rows

5. **Column Operations**:
   - Add new columns
   - Change column data types
   - Delete columns

6. **Responsiveness**:
   - Resize browser window to test mobile layout
   - Test on different device sizes

7. **Export**:
   - Test CSV export functionality
   - Verify exported data matches table content

### Browser Compatibility

Test the application in:
- Chrome (latest version)
- Firefox (latest version)
- Safari (latest version)
- Edge (latest version)

## Dependencies

This project uses the following CDN-hosted libraries:
- Font Awesome (for icons)
- Flatpickr (for date pickers)
- noUiSlider (for range sliders)

All dependencies are loaded via CDN in the HTML file.

## License

This project is open-source and available under the MIT License.
```

This README provides comprehensive instructions for setting up, running, and testing the Advanced Data Table application. It covers all the main features and testing scenarios while keeping the content focused on the instructions rather than the code implementation.
