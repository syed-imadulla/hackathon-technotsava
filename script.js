document.addEventListener('DOMContentLoaded', function() {
    // Sample data - can be replaced with real data
    const sampleData = [
        { id: 1, text: "Sample Item 1", number: 100, category: "Type A", date: "2023-05-15", status: true },
        { id: 2, text: "Example Data 2", number: 250, category: "Type B", date: "2023-06-20", status: false },
        { id: 3, text: "Test Record 3", number: 75, category: "Type A", date: "2023-04-10", status: true },
        { id: 4, text: "Demo Item 4", number: 300, category: "Type B", date: "2023-07-05", status: false },
        { id: 5, text: "Sample Data 5", number: 150, category: "Type A", date: "2023-08-12", status: true },
        { id: 6, text: "Another Item 6", number: 225, category: "Type B", date: "2023-09-18", status: false },
        { id: 7, text: "More Data 7", number: 50, category: "Type A", date: "2023-10-22", status: true },
        { id: 8, text: "Final Test 8", number: 175, category: "Type B", date: "2023-11-30", status: false },
        { id: 9, text: "Additional 9", number: 125, category: "Type A", date: "2023-12-05", status: true },
        { id: 10, text: "Last One 10", number: 275, category: "Type B", date: "2024-01-15", status: false }
    ];

    // Table state
    const tableState = {
        data: [...sampleData],
        filteredData: [...sampleData],
        currentPage: 1,
        rowsPerPage: 10,
        sortColumn: null,
        sortDirection: 'asc',
        filters: {}
    };

    // DOM elements
    const tableBody = document.querySelector('#data-table tbody');
    const globalSearch = document.getElementById('global-search');
    const searchBtn = document.getElementById('search-btn');
    const rowsPerPage = document.getElementById('rows-per-page');
    const addRowBtn = document.getElementById('add-row');
    const exportCsvBtn = document.getElementById('export-csv');
    const resetFiltersBtn = document.getElementById('reset-filters');
    const paginationInfo = document.querySelector('.pagination-info');
    const pageNumbers = document.querySelector('.page-numbers');
    const firstPageBtn = document.getElementById('first-page');
    const prevPageBtn = document.getElementById('prev-page');
    const nextPageBtn = document.getElementById('next-page');
    const lastPageBtn = document.getElementById('last-page');

    // Initialize the table
    function initTable() {
        renderTable();
        setupEventListeners();
        updatePagination();
    }

    // Render the table with current data
    function renderTable() {
        tableBody.innerHTML = '';
        
        const startIdx = (tableState.currentPage - 1) * tableState.rowsPerPage;
        const endIdx = startIdx + tableState.rowsPerPage;
        const paginatedData = tableState.filteredData.slice(startIdx, endIdx);
        
        paginatedData.forEach(row => {
            const tr = document.createElement('tr');
            tr.dataset.id = row.id;
            
            tr.innerHTML = `
                <td>${row.id}</td>
                <td><span class="view-mode">${row.text}</span><input type="text" class="edit-mode" value="${row.text}" style="display: none;"></td>
                <td><span class="view-mode">${row.number}</span><input type="number" class="edit-mode" value="${row.number}" style="display: none;"></td>
                <td>
                    <span class="view-mode">${row.category}</span>
                    <select class="edit-mode" style="display: none;">
                        <option value="Type A" ${row.category === 'Type A' ? 'selected' : ''}>Type A</option>
                        <option value="Type B" ${row.category === 'Type B' ? 'selected' : ''}>Type B</option>
                    </select>
                </td>
                <td><span class="view-mode">${formatDate(row.date)}</span><input type="date" class="edit-mode" value="${row.date}" style="display: none;"></td>
                <td>
                    <div class="checkbox-container">
                        <span class="view-mode">${row.status ? '✓' : '✗'}</span>
                        <input type="checkbox" class="edit-mode" ${row.status ? 'checked' : ''} style="display: none;">
                    </div>
                </td>
                <td class="action-buttons-cell">
                    <button class="action-btn edit-btn"><i class="fas fa-edit"></i></button>
                    <button class="action-btn delete-btn"><i class="fas fa-trash"></i></button>
                    <button class="action-btn save-btn" style="display: none;"><i class="fas fa-save"></i></button>
                    <button class="action-btn cancel-btn" style="display: none;"><i class="fas fa-times"></i></button>
                </td>
            `;
            
            tableBody.appendChild(tr);
        });
    }

    // Format date for display
    function formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    }

    // Setup event listeners
    function setupEventListeners() {
        // Global search
        searchBtn.addEventListener('click', applyGlobalSearch);
        globalSearch.addEventListener('keyup', function(e) {
            if (e.key === 'Enter') applyGlobalSearch();
        });

        // Column sorting
        document.querySelectorAll('th[data-sortable="true"]').forEach(th => {
            th.addEventListener('click', function() {
                const column = this.dataset.column;
                const type = this.dataset.type || 'text';
                
                // Reset sort indicators
                document.querySelectorAll('th[data-sorted]').forEach(h => {
                    h.removeAttribute('data-sorted');
                });
                
                // Determine new sort direction
                if (tableState.sortColumn === column) {
                    tableState.sortDirection = tableState.sortDirection === 'asc' ? 'desc' : 'asc';
                } else {
                    tableState.sortColumn = column;
                    tableState.sortDirection = 'asc';
                }
                
                this.setAttribute('data-sorted', tableState.sortDirection);
                
                // Sort data
                sortData(column, type, tableState.sortDirection);
                renderTable();
            });
        });

        // Column filters
        document.querySelectorAll('.column-filter').forEach(input => {
            input.addEventListener('input', function() {
                const column = this.dataset.column;
                const value = this.value.toLowerCase();
                
                if (value) {
                    tableState.filters[column] = { type: 'text', value };
                } else {
                    delete tableState.filters[column];
                }
                
                applyFilters();
            });
        });

        document.querySelectorAll('.number-filter').forEach(input => {
            input.addEventListener('input', function() {
                const column = this.dataset.column;
                const isMin = this.classList.contains('min');
                
                if (!tableState.filters[column]) {
                    tableState.filters[column] = { type: 'number', min: null, max: null };
                }
                
                if (isMin) {
                    tableState.filters[column].min = this.value ? Number(this.value) : null;
                } else {
                    tableState.filters[column].max = this.value ? Number(this.value) : null;
                }
                
                applyFilters();
            });
        });

        document.querySelectorAll('.select-filter').forEach(select => {
            select.addEventListener('change', function() {
                const column = this.dataset.column;
                const value = this.value;
                
                if (value) {
                    tableState.filters[column] = { type: 'select', value };
                } else {
                    delete tableState.filters[column];
                }
                
                applyFilters();
            });
        });

        // Pagination controls
        rowsPerPage.addEventListener('change', function() {
            tableState.rowsPerPage = Number(this.value);
            tableState.currentPage = 1;
            updatePagination();
            renderTable();
        });

        firstPageBtn.addEventListener('click', function() {
            tableState.currentPage = 1;
            updatePagination();
            renderTable();
        });

        prevPageBtn.addEventListener('click', function() {
            if (tableState.currentPage > 1) {
                tableState.currentPage--;
                updatePagination();
                renderTable();
            }
        });

        nextPageBtn.addEventListener('click', function() {
            const totalPages = Math.ceil(tableState.filteredData.length / tableState.rowsPerPage);
            if (tableState.currentPage < totalPages) {
                tableState.currentPage++;
                updatePagination();
                renderTable();
            }
        });

        lastPageBtn.addEventListener('click', function() {
            const totalPages = Math.ceil(tableState.filteredData.length / tableState.rowsPerPage);
            tableState.currentPage = totalPages;
            updatePagination();
            renderTable();
        });

        // Add row button
        addRowBtn.addEventListener('click', function() {
            const newId = tableState.data.length > 0 ? 
                Math.max(...tableState.data.map(row => row.id)) + 1 : 1;
            
            const newRow = {
                id: newId,
                text: "New Item",
                number: 0,
                category: "Type A",
                date: new Date().toISOString().split('T')[0],
                status: false
            };
            
            tableState.data.unshift(newRow);
            applyFilters();
            tableState.currentPage = 1;
            updatePagination();
            renderTable();
            
            // Automatically put the new row in edit mode
            const firstRow = tableBody.querySelector('tr');
            if (firstRow) {
                toggleEditMode(firstRow, true);
            }
        });

        // Export button
        exportCsvBtn.addEventListener('click', exportToCsv);

        // Reset filters button
        resetFiltersBtn.addEventListener('click', function() {
            // Reset all filters
            tableState.filters = {};
            document.querySelectorAll('.column-filter, .number-filter').forEach(input => {
                input.value = '';
            });
            document.querySelectorAll('.select-filter').forEach(select => {
                select.value = '';
            });
            globalSearch.value = '';
            
            applyFilters();
        });

        // Table row actions (using event delegation)
        tableBody.addEventListener('click', function(e) {
            const row = e.target.closest('tr');
            if (!row) return;
            
            const rowId = Number(row.dataset.id);
            
            // Edit button
            if (e.target.closest('.edit-btn')) {
                toggleEditMode(row, true);
            }
            
            // Delete button
            else if (e.target.closest('.delete-btn')) {
                if (confirm('Are you sure you want to delete this row?')) {
                    deleteRow(rowId);
                }
            }
            
            // Save button
            else if (e.target.closest('.save-btn')) {
                saveRow(row, rowId);
            }
            
            // Cancel button
            else if (e.target.closest('.cancel-btn')) {
                toggleEditMode(row, false);
            }
        });
    }

    // Toggle edit mode for a row
    function toggleEditMode(row, enable) {
        const viewCells = row.querySelectorAll('.view-mode');
        const editCells = row.querySelectorAll('.edit-mode');
        const editBtn = row.querySelector('.edit-btn');
        const deleteBtn = row.querySelector('.delete-btn');
        const saveBtn = row.querySelector('.save-btn');
        const cancelBtn = row.querySelector('.cancel-btn');
        
        if (enable) {
            viewCells.forEach(cell => cell.style.display = 'none');
            editCells.forEach(cell => cell.style.display = '');
            editBtn.style.display = 'none';
            deleteBtn.style.display = 'none';
            saveBtn.style.display = '';
            cancelBtn.style.display = '';
        } else {
            viewCells.forEach(cell => cell.style.display = '');
            editCells.forEach(cell => cell.style.display = 'none');
            editBtn.style.display = '';
            deleteBtn.style.display = '';
            saveBtn.style.display = 'none';
            cancelBtn.style.display = 'none';
        }
    }

    // Save edited row
    function saveRow(row, rowId) {
        const text = row.querySelector('td:nth-child(2) .edit-mode').value;
        const number = Number(row.querySelector('td:nth-child(3) .edit-mode').value);
        const category = row.querySelector('td:nth-child(4) .edit-mode').value;
        const date = row.querySelector('td:nth-child(5) .edit-mode').value;
        const status = row.querySelector('td:nth-child(6) .edit-mode').checked;
        
        const rowIndex = tableState.data.findIndex(r => r.id === rowId);
        if (rowIndex !== -1) {
            tableState.data[rowIndex] = {
                id: rowId,
                text,
                number,
                category,
                date,
                status
            };
            
            applyFilters();
            toggleEditMode(row, false);
            renderTable();
        }
    }

    // Delete a row
    function deleteRow(rowId) {
        tableState.data = tableState.data.filter(row => row.id !== rowId);
        applyFilters();
        
        // Adjust current page if needed
        const totalPages = Math.ceil(tableState.filteredData.length / tableState.rowsPerPage);
        if (tableState.currentPage > totalPages) {
            tableState.currentPage = Math.max(1, totalPages);
        }
        
        updatePagination();
        renderTable();
    }

    // Apply global search
    function applyGlobalSearch() {
        const searchTerm = globalSearch.value.toLowerCase();
        
        if (searchTerm) {
            tableState.filters.global = { type: 'global', value: searchTerm };
        } else {
            delete tableState.filters.global;
        }
        
        applyFilters();
    }

    // Apply all filters
    function applyFilters() {
        let filtered = [...tableState.data];
        
        // Apply each filter
        for (const [column, filter] of Object.entries(tableState.filters)) {
            if (filter.type === 'global') {
                const searchTerm = filter.value;
                filtered = filtered.filter(row => {
                    return Object.values(row).some(value => 
                        String(value).toLowerCase().includes(searchTerm)
                    );
                });
            } 
            else if (filter.type === 'text') {
                filtered = filtered.filter(row => {
                    const rowValue = getRowValue(row, column);
                    return String(rowValue).toLowerCase().includes(filter.value);
                });
            } 
            else if (filter.type === 'number') {
                filtered = filtered.filter(row => {
                    const rowValue = Number(getRowValue(row, column));
                    if (filter.min !== null && rowValue < filter.min) return false;
                    if (filter.max !== null && rowValue > filter.max) return false;
                    return true;
                });
            } 
            else if (filter.type === 'select') {
                filtered = filtered.filter(row => {
                    const rowValue = getRowValue(row, column);
                    return rowValue === filter.value;
                });
            }
        }
        
        tableState.filteredData = filtered;
        tableState.currentPage = 1;
        updatePagination();
        renderTable();
    }

    // Helper to get row value by column index
    function getRowValue(row, column) {
        const columns = ['id', 'text', 'number', 'category', 'date', 'status'];
        return row[columns[column]];
    }

    // Sort data
    function sortData(column, type, direction) {
        const columns = ['id', 'text', 'number', 'category', 'date', 'status'];
        const key = columns[column];
        
        tableState.filteredData.sort((a, b) => {
            let valA = a[key];
            let valB = b[key];
            
            if (type === 'number') {
                valA = Number(valA);
                valB = Number(valB);
                return direction === 'asc' ? valA - valB : valB - valA;
            } 
            else if (type === 'date') {
                valA = new Date(valA);
                valB = new Date(valB);
                return direction === 'asc' ? valA - valB : valB - valA;
            } 
            else if (type === 'boolean') {
                valA = valA ? 1 : 0;
                valB = valB ? 1 : 0;
                return direction === 'asc' ? valA - valB : valB - valA;
            } 
            else {
                valA = String(valA).toLowerCase();
                valB = String(valB).toLowerCase();
                return direction === 'asc' ? 
                    valA.localeCompare(valB) : valB.localeCompare(valA);
            }
        });
    }

    // Update pagination controls
    function updatePagination() {
        const totalRows = tableState.filteredData.length;
        const totalPages = Math.ceil(totalRows / tableState.rowsPerPage);
        
        // Update pagination info
        const startRow = (tableState.currentPage - 1) * tableState.rowsPerPage + 1;
        const endRow = Math.min(startRow + tableState.rowsPerPage - 1, totalRows);
        paginationInfo.textContent = `Showing ${startRow} to ${endRow} of ${totalRows} entries`;
        
        // Update page numbers
        pageNumbers.innerHTML = '';
        const maxVisiblePages = 5;
        let startPage = Math.max(1, tableState.currentPage - Math.floor(maxVisiblePages / 2));
        let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
        
        if (endPage - startPage + 1 < maxVisiblePages) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }
        
        for (let i = startPage; i <= endPage; i++) {
            const pageBtn = document.createElement('button');
            pageBtn.className = 'page-number';
            if (i === tableState.currentPage) {
                pageBtn.classList.add('active');
            }
            pageBtn.textContent = i;
            pageBtn.addEventListener('click', () => {
                tableState.currentPage = i;
                updatePagination();
                renderTable();
            });
            pageNumbers.appendChild(pageBtn);
        }
        
        // Update button states
        firstPageBtn.disabled = tableState.currentPage === 1;
        prevPageBtn.disabled = tableState.currentPage === 1;
        nextPageBtn.disabled = tableState.currentPage === totalPages || totalPages === 0;
        lastPageBtn.disabled = tableState.currentPage === totalPages || totalPages === 0;
    }

    // Export to CSV
    function exportToCsv() {
        const headers = ['ID', 'Text Field', 'Number', 'Category', 'Date', 'Status'];
        const rows = tableState.filteredData.map(row => [
            row.id,
            `"${row.text.replace(/"/g, '""')}"`,
            row.number,
            row.category,
            formatDate(row.date),
            row.status ? 'Active' : 'Inactive'
        ]);
        
        const csvContent = [
            headers.join(','),
            ...rows.map(row => row.join(','))
        ].join('\n');
        
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', 'table_data.csv');
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    // Initialize the table
    initTable();
});