// Sample data
let data = [
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin', status: 'Active', dateJoined: '2023-01-15', salary: 75000, department: 'Engineering' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'User', status: 'Inactive', dateJoined: '2023-02-20', salary: 65000, department: 'Marketing' },
    { id: 3, name: 'Robert Johnson', email: 'robert@example.com', role: 'Manager', status: 'Active', dateJoined: '2022-11-05', salary: 85000, department: 'Sales' },
    { id: 4, name: 'Emily Davis', email: 'emily@example.com', role: 'User', status: 'Active', dateJoined: '2023-03-10', salary: 60000, department: 'HR' },
    { id: 5, name: 'Michael Brown', email: 'michael@example.com', role: 'Developer', status: 'Active', dateJoined: '2022-09-15', salary: 80000, department: 'Engineering' },
    { id: 6, name: 'Sarah Wilson', email: 'sarah@example.com', role: 'Designer', status: 'Inactive', dateJoined: '2023-04-22', salary: 70000, department: 'Design' },
    { id: 7, name: 'David Taylor', email: 'david@example.com', role: 'Manager', status: 'Active', dateJoined: '2022-07-30', salary: 90000, department: 'Operations' },
    { id: 8, name: 'Jessica Martinez', email: 'jessica@example.com', role: 'Developer', status: 'Active', dateJoined: '2023-01-10', salary: 78000, department: 'Engineering' },
    { id: 9, name: 'Thomas Anderson', email: 'thomas@example.com', role: 'Analyst', status: 'Inactive', dateJoined: '2023-05-15', salary: 72000, department: 'Finance' },
    { id: 10, name: 'Lisa Jackson', email: 'lisa@example.com', role: 'User', status: 'Active', dateJoined: '2023-06-01', salary: 68000, department: 'Marketing' },
    { id: 11, name: 'William Clark', email: 'william@example.com', role: 'Developer', status: 'Active', dateJoined: '2022-12-10', salary: 82000, department: 'Engineering' },
    { id: 12, name: 'Megan Lewis', email: 'megan@example.com', role: 'Designer', status: 'Active', dateJoined: '2023-07-15', salary: 75000, department: 'Design' },
    { id: 13, name: 'Christopher Lee', email: 'chris@example.com', role: 'Analyst', status: 'Inactive', dateJoined: '2023-03-25', salary: 71000, department: 'Finance' },
    { id: 14, name: 'Amanda Walker', email: 'amanda@example.com', role: 'Manager', status: 'Active', dateJoined: '2022-08-18', salary: 95000, department: 'Operations' },
    { id: 15, name: 'Daniel Hall', email: 'daniel@example.com', role: 'Developer', status: 'Active', dateJoined: '2023-02-05', salary: 77000, department: 'Engineering' }
];

// DOM elements
const tableBody = document.getElementById('table-body');
const tableHeaders = document.getElementById('table-headers');
const globalSearch = document.getElementById('global-search');
const searchBtn = document.getElementById('search-btn');
const resetBtn = document.getElementById('reset-btn');
const addRowBtn = document.getElementById('add-row-btn');
const roleFilter = document.getElementById('role-filter');
const statusFilter = document.getElementById('status-filter');
const departmentFilter = document.getElementById('department-filter');
const dateFilter = document.getElementById('date-filter');
const salaryRange = document.getElementById('salary-range');
const salaryValue = document.getElementById('salary-value');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const pageInfo = document.getElementById('page-info');
const pageSize = document.getElementById('page-size');
const editModal = document.getElementById('edit-modal');
const editForm = document.getElementById('edit-form');
const saveEditBtn = document.getElementById('save-edit-btn');
const cancelEditBtn = document.getElementById('cancel-edit-btn');
const addModal = document.getElementById('add-modal');
const addForm = document.getElementById('add-form');
const saveAddBtn = document.getElementById('save-add-btn');
const cancelAddBtn = document.getElementById('cancel-add-btn');
const closeButtons = document.querySelectorAll('.close');

// State variables
let currentPage = 1;
let itemsPerPage = 10;
let sortColumn = null;
let sortDirection = 'asc';
let filteredData = [...data];
let searchTimeout = null;
let currentEditId = null;
let columnTitles = {
    id: 'ID',
    name: 'Name',
    email: 'Email',
    role: 'Role',
    status: 'Status',
    dateJoined: 'Join Date',
    salary: 'Salary',
    department: 'Department'
};

// Initialize the table
function init() {
    renderTableHeaders();
    renderTable();
    populateFilters();
    setupEventListeners();
}

// Render table headers with editable titles
function renderTableHeaders() {
    tableHeaders.innerHTML = '';
    
    // Add regular columns
    Object.keys(columnTitles).forEach(key => {
        const th = document.createElement('th');
        th.setAttribute('data-column', key);
        th.textContent = columnTitles[key];
        th.classList.add('editable');
        
        // Make header editable
        th.addEventListener('dblclick', () => {
            makeHeaderEditable(th, key);
        });
        
        // Add sorting
        th.addEventListener('click', () => {
            sortData(key);
        });
        
        tableHeaders.appendChild(th);
    });
    
    // Add action column
    const actionTh = document.createElement('th');
    actionTh.textContent = 'Actions';
    tableHeaders.appendChild(actionTh);
}

// Make table header editable
function makeHeaderEditable(th, key) {
    const input = document.createElement('input');
    input.type = 'text';
    input.value = columnTitles[key];
    
    th.innerHTML = '';
    th.appendChild(input);
    input.focus();
    
    const saveEdit = () => {
        columnTitles[key] = input.value.trim();
        renderTableHeaders();
    };
    
    input.addEventListener('blur', saveEdit);
    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            saveEdit();
        }
    });
}

// Render the table with current data
function renderTable() {
    tableBody.innerHTML = '';
    
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage);
    
    if (paginatedData.length === 0) {
        const tr = document.createElement('tr');
        const td = document.createElement('td');
        td.colSpan = Object.keys(columnTitles).length + 1;
        td.textContent = 'No records found';
        td.style.textAlign = 'center';
        tr.appendChild(td);
        tableBody.appendChild(tr);
        return;
    }
    
    paginatedData.forEach(row => {
        const tr = document.createElement('tr');
        
        // Add data cells
        Object.keys(columnTitles).forEach(key => {
            const td = document.createElement('td');
            td.classList.add('editable');
            
            // Format values
            if (key === 'salary') {
                td.textContent = '$' + row[key].toLocaleString();
            } else {
                td.textContent = row[key];
            }
            
            // Make cell editable
            td.addEventListener('dblclick', () => {
                makeCellEditable(td, row, key);
            });
            
            tr.appendChild(td);
        });
        
        // Add action buttons
        const actionTd = document.createElement('td');
        actionTd.className = 'action-buttons';
        
        const editBtn = document.createElement('button');
        editBtn.className = 'action-btn edit-btn';
        editBtn.innerHTML = '<i class="fas fa-edit"></i>';
        editBtn.title = 'Edit';
        editBtn.addEventListener('click', () => openEditModal(row));
        
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'action-btn delete-btn';
        deleteBtn.innerHTML = '<i class="fas fa-trash"></i>';
        deleteBtn.title = 'Delete';
        deleteBtn.addEventListener('click', () => deleteRow(row.id));
        
        actionTd.appendChild(editBtn);
        actionTd.appendChild(deleteBtn);
        tr.appendChild(actionTd);
        
        tableBody.appendChild(tr);
    });
    
    updatePagination();
}

// Make table cell editable
function makeCellEditable(td, row, key) {
    const input = document.createElement(key === 'salary' ? 'input' : key === 'dateJoined' ? 'input' : 'input');
    input.type = key === 'salary' ? 'number' : key === 'dateJoined' ? 'date' : 'text';
    input.value = row[key];
    
    td.innerHTML = '';
    td.appendChild(input);
    input.focus();
    
    const saveEdit = () => {
        let newValue = input.value.trim();
        
        // Convert to number if it's the salary column
        if (key === 'salary') {
            newValue = Number(newValue);
            if (isNaN(newValue)) {
                newValue = row[key]; // Revert if invalid
            }
        }
        
        // Update data
        row[key] = newValue;
        
        // Re-render cell with formatted value
        if (key === 'salary') {
            td.textContent = '$' + newValue.toLocaleString();
        } else {
            td.textContent = newValue;
        }
        
        td.classList.add('editable');
    };
    
    input.addEventListener('blur', saveEdit);
    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            saveEdit();
        }
    });
}

// Populate all filter dropdowns
function populateFilters() {
    const roles = [...new Set(data.map(item => item.role))];
    const statuses = [...new Set(data.map(item => item.status))];
    const departments = [...new Set(data.map(item => item.department))];
    
    roles.forEach(role => {
        const option = document.createElement('option');
        option.value = role;
        option.textContent = role;
        roleFilter.appendChild(option);
    });
    
    statuses.forEach(status => {
        const option = document.createElement('option');
        option.value = status;
        option.textContent = status;
        statusFilter.appendChild(option);
    });
    
    departments.forEach(dept => {
        const option = document.createElement('option');
        option.value = dept;
        option.textContent = dept;
        departmentFilter.appendChild(option);
    });
    
    // Set up salary range display
    salaryRange.addEventListener('input', () => {
        salaryValue.textContent = '$' + Number(salaryRange.value).toLocaleString();
        applyFilters();
    });
}

// Apply all filters and search
function applyFilters() {
    const searchTerm = globalSearch.value.toLowerCase();
    const minSalary = Number(salaryRange.value);
    const filterDate = dateFilter.value ? new Date(dateFilter.value) : null;
    
    filteredData = data.filter(item => {
        // Global search
        if (searchTerm) {
            const matches = Object.values(item).some(value => 
                String(value).toLowerCase().includes(searchTerm)
            );
            if (!matches) return false;
        }
        
        // Role filter
        if (roleFilter.value && item.role !== roleFilter.value) {
            return false;
        }
        
        // Status filter
        if (statusFilter.value && item.status !== statusFilter.value) {
            return false;
        }
        
        // Department filter
        if (departmentFilter.value && item.department !== departmentFilter.value) {
            return false;
        }
        
        // Date filter
        if (filterDate && new Date(item.dateJoined) < filterDate) {
            return false;
        }
        
        // Salary range
        if (item.salary < minSalary) {
            return false;
        }
        
        return true;
    });
    
    // Apply sorting
    applySorting();
    
    // Reset to first page
    currentPage = 1;
    renderTable();
}

// Reset all filters and search
function resetFilters() {
    globalSearch.value = '';
    roleFilter.value = '';
    statusFilter.value = '';
    departmentFilter.value = '';
    dateFilter.value = '';
    salaryRange.value = '50000';
    salaryValue.textContent = '$50,000';
    
    filteredData = [...data];
    sortColumn = null;
    sortDirection = 'asc';
    
    // Reset sort indicators
    document.querySelectorAll('th').forEach(header => {
        header.classList.remove('sort-asc', 'sort-desc');
    });
    
    currentPage = 1;
    renderTable();
}

// Apply sorting to filtered data
function applySorting() {
    if (sortColumn) {
        filteredData.sort((a, b) => {
            const aValue = a[sortColumn];
            const bValue = b[sortColumn];
            
            // Handle numeric sorting
            if (typeof aValue === 'number' && typeof bValue === 'number') {
                return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
            }
            
            // Handle date sorting
            if (sortColumn === 'dateJoined') {
                const dateA = new Date(aValue);
                const dateB = new Date(bValue);
                return sortDirection === 'asc' ? dateA - dateB : dateB - dateA;
            }
            
            // Default string sorting
            return sortDirection === 'asc' 
                ? String(aValue).localeCompare(String(bValue))
                : String(bValue).localeCompare(String(aValue));
        });
    }
}

// Update sort indicators in UI
function updateSortIndicators() {
    document.querySelectorAll('th').forEach(header => {
        header.classList.remove('sort-asc', 'sort-desc');
        const column = header.getAttribute('data-column');
        if (column === sortColumn) {
            header.classList.add(`sort-${sortDirection}`);
        }
    });
}

// Handle sorting when column header is clicked
function sortData(column) {
    // If clicking the same column, toggle direction
    if (sortColumn === column) {
        sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
        sortColumn = column;
        sortDirection = 'asc';
    }
    
    // Update visual indicators
    updateSortIndicators();
    
    // Apply sorting and refresh
    applySorting();
    renderTable();
}

// Update pagination controls
function updatePagination() {
    const totalPages = Math.ceil(filteredData.length / itemsPerPage) || 1;
    
    pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;
    prevBtn.disabled = currentPage === 1;
    nextBtn.disabled = currentPage === totalPages || totalPages === 0;
}

// Delete a row
function deleteRow(id) {
    if (confirm('Are you sure you want to delete this record?')) {
        data = data.filter(item => item.id !== id);
        filteredData = filteredData.filter(item => item.id !== id);
        renderTable();
    }
}

// Open edit modal
function openEditModal(row) {
    currentEditId = row.id;
    editForm.innerHTML = '';
    
    // Create form fields for each column
    Object.keys(columnTitles).forEach(key => {
        if (key !== 'id') { // Don't allow editing ID
            const div = document.createElement('div');
            div.className = 'form-group';
            
            const label = document.createElement('label');
            label.textContent = columnTitles[key];
            label.setAttribute('for', `edit-${key}`);
            
            let input;
            if (key === 'role' || key === 'status' || key === 'department') {
                input = document.createElement('select');
                input.id = `edit-${key}`;
                
                // Get unique values for this column
                const uniqueValues = [...new Set(data.map(item => item[key]))];
                uniqueValues.forEach(value => {
                    const option = document.createElement('option');
                    option.value = value;
                    option.textContent = value;
                    if (value === row[key]) option.selected = true;
                    input.appendChild(option);
                });
            } else if (key === 'dateJoined') {
                input = document.createElement('input');
                input.type = 'date';
                input.id = `edit-${key}`;
                input.value = row[key];
            } else {
                input = document.createElement('input');
                input.type = key === 'salary' ? 'number' : 'text';
                input.id = `edit-${key}`;
                input.value = row[key];
            }
            
            div.appendChild(label);
            div.appendChild(input);
            editForm.appendChild(div);
        }
    });
    
    editModal.style.display = 'block';
}

// Save edited row
function saveEditedRow() {
    const row = data.find(item => item.id === currentEditId);
    
    Object.keys(columnTitles).forEach(key => {
        if (key !== 'id') {
            const input = document.getElementById(`edit-${key}`);
            if (input) {
                row[key] = key === 'salary' ? Number(input.value) : input.value;
            }
        }
    });
    
    editModal.style.display = 'none';
    renderTable();
}

// Open add modal
function openAddModal() {
    addForm.innerHTML = '';
    
    // Create form fields for each column (except ID which will be auto-generated)
    Object.keys(columnTitles).forEach(key => {
        if (key !== 'id') {
            const div = document.createElement('div');
            div.className = 'form-group';
            
            const label = document.createElement('label');
            label.textContent = columnTitles[key];
            label.setAttribute('for', `add-${key}`);
            
            let input;
            if (key === 'role' || key === 'status' || key === 'department') {
                input = document.createElement('select');
                input.id = `add-${key}`;
                
                // Get unique values for this column
                const uniqueValues = [...new Set(data.map(item => item[key]))];
                uniqueValues.forEach(value => {
                    const option = document.createElement('option');
                    option.value = value;
                    option.textContent = value;
                    input.appendChild(option);
                });
            } else if (key === 'dateJoined') {
                input = document.createElement('input');
                input.type = 'date';
                input.id = `add-${key}`;
                input.value = new Date().toISOString().split('T')[0];
            } else {
                input = document.createElement('input');
                input.type = key === 'salary' ? 'number' : 'text';
                input.id = `add-${key}`;
            }
            
            div.appendChild(label);
            div.appendChild(input);
            addForm.appendChild(div);
        }
    });
    
    addModal.style.display = 'block';
}

// Add new row
function addNewRow() {
    const newRow = { id: Math.max(...data.map(item => item.id)) + 1 };
    
    Object.keys(columnTitles).forEach(key => {
        if (key !== 'id') {
            const input = document.getElementById(`add-${key}`);
            if (input) {
                newRow[key] = key === 'salary' ? Number(input.value) : input.value;
            }
        }
    });
    
    data.push(newRow);
    filteredData.push(newRow);
    addModal.style.display = 'none';
    renderTable();
}

// Setup all event listeners
function setupEventListeners() {
    // Search
    searchBtn.addEventListener('click', applyFilters);
    globalSearch.addEventListener('keyup', (e) => {
        if (e.key === 'Enter') applyFilters();
        
        // Debounce the search
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            applyFilters();
        }, 500);
    });
    
    // Reset
    resetBtn.addEventListener('click', resetFilters);
    
    // Add row
    addRowBtn.addEventListener('click', openAddModal);
    
    // Filters
    roleFilter.addEventListener('change', applyFilters);
    statusFilter.addEventListener('change', applyFilters);
    departmentFilter.addEventListener('change', applyFilters);
    dateFilter.addEventListener('change', applyFilters);
    
    // Pagination
    prevBtn.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            renderTable();
        }
    });
    
    nextBtn.addEventListener('click', () => {
        const totalPages = Math.ceil(filteredData.length / itemsPerPage);
        if (currentPage < totalPages) {
            currentPage++;
            renderTable();
        }
    });
    
    // Page size
    pageSize.addEventListener('change', () => {
        itemsPerPage = parseInt(pageSize.value);
        currentPage = 1;
        renderTable();
    });
    
    // Edit modal
    saveEditBtn.addEventListener('click', saveEditedRow);
    cancelEditBtn.addEventListener('click', () => {
        editModal.style.display = 'none';
    });
    
    // Add modal
    saveAddBtn.addEventListener('click', addNewRow);
    cancelAddBtn.addEventListener('click', () => {
        addModal.style.display = 'none';
    });
    
    // Close modals when clicking X
    closeButtons.forEach(button => {
        button.addEventListener('click', () => {
            editModal.style.display = 'none';
            addModal.style.display = 'none';
        });
    });
    
    // Close modals when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === editModal) {
            editModal.style.display = 'none';
        }
        if (e.target === addModal) {
            addModal.style.display = 'none';
        }
    });
}

// Initialize the app
init();