// Hospital Marketing AI Dashboard - Shared Scripts

// Global Application State
window.MarketingApp = {
    currentSection: 'dashboard',
    sidebarCollapsed: false,
    
    // Initialize the application
    init() {
        this.initSidebar();
        this.initNavigation();
        this.initDatePickers();
        this.bindGlobalEvents();
        this.showToast('Welcome to Marketing AI Dashboard', 'success');
    },
    
    // Sidebar functionality
    initSidebar() {
        const collapseBtn = document.getElementById('sidebarCollapseBtn');
        const sidebar = document.querySelector('.sidebar');
        
        if (collapseBtn) {
            collapseBtn.addEventListener('click', () => {
                this.toggleSidebar();
            });
        }
        
        // Initialize sidebar state from localStorage
        const sidebarState = localStorage.getItem('sidebarCollapsed');
        if (sidebarState === 'true') {
            this.toggleSidebar(true);
        }
    },
    
    toggleSidebar(force = null) {
        const sidebar = document.querySelector('.sidebar');
        const isCollapsed = force !== null ? force : !sidebar.classList.contains('collapsed');
        
        if (isCollapsed) {
            sidebar.classList.add('collapsed');
            this.sidebarCollapsed = true;
        } else {
            sidebar.classList.remove('collapsed');
            this.sidebarCollapsed = false;
        }
        
        // Save state to localStorage
        localStorage.setItem('sidebarCollapsed', this.sidebarCollapsed.toString());
    },
    
    // Navigation functionality
    initNavigation() {
        // Set active navigation based on current page
        const currentPath = window.location.pathname;
        const navLinks = document.querySelectorAll('.nav-link[data-section]');
        
        navLinks.forEach(link => {
            const section = link.getAttribute('data-section');
            const href = link.getAttribute('href');
            
            if (currentPath.includes(section) || (currentPath === '/' && section === 'dashboard')) {
                link.classList.add('active');
                this.currentSection = section;
            } else {
                link.classList.remove('active');
            }
        });
        
        // Handle navigation clicks (for SPA-style navigation if needed)
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                // Let default navigation happen
                const section = link.getAttribute('data-section');
                this.setActiveNavigation(section);
            });
        });
    },
    
    setActiveNavigation(section) {
        // Update active navigation
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        
        const activeLink = document.querySelector(`[data-section="${section}"]`);
        if (activeLink) {
            activeLink.classList.add('active');
        }
        
        this.currentSection = section;
    },
    
    // Date picker initialization
    initDatePickers() {
        const dateInputs = document.querySelectorAll('input[type="date"]');
        dateInputs.forEach(input => {
            if (!input.value) {
                // Set default dates
                const today = new Date();
                const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate());
                
                if (input.classList.contains('start-date')) {
                    input.value = lastMonth.toISOString().split('T')[0];
                } else if (input.classList.contains('end-date')) {
                    input.value = today.toISOString().split('T')[0];
                }
            }
        });
    },
    
    // Global event handlers
    bindGlobalEvents() {
        // Handle mobile sidebar toggle
        document.addEventListener('click', (e) => {
            const sidebar = document.querySelector('.sidebar');
            const sidebarToggle = e.target.closest('#sidebarCollapseBtn');
            const isClickInsideSidebar = e.target.closest('.sidebar');
            
            // Close sidebar on mobile when clicking outside
            if (window.innerWidth <= 1200 && !isClickInsideSidebar && !sidebarToggle) {
                sidebar.classList.remove('show');
            }
        });
        
        // Handle window resize
        window.addEventListener('resize', () => {
            this.handleResize();
        });
        
        // Handle keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            // Ctrl/Cmd + B to toggle sidebar
            if ((e.ctrlKey || e.metaKey) && e.key === 'b') {
                e.preventDefault();
                this.toggleSidebar();
            }
        });
    },
    
    handleResize() {
        const sidebar = document.querySelector('.sidebar');
        if (window.innerWidth > 1200) {
            sidebar.classList.remove('show');
        }
    },
    
    // Toast notification system
    showToast(message, type = 'info', duration = 3000) {
        // Create toast container if it doesn't exist
        let toastContainer = document.querySelector('.toast-container');
        if (!toastContainer) {
            toastContainer = document.createElement('div');
            toastContainer.className = 'toast-container position-fixed top-0 end-0 p-3';
            toastContainer.style.zIndex = '9999';
            document.body.appendChild(toastContainer);
        }
        
        // Create toast element
        const toast = document.createElement('div');
        toast.className = `toast align-items-center text-bg-${type} border-0`;
        toast.setAttribute('role', 'alert');
        toast.innerHTML = `
            <div class="d-flex">
                <div class="toast-body">
                    ${message}
                </div>
                <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
            </div>
        `;
        
        toastContainer.appendChild(toast);
        
        // Initialize Bootstrap toast
        const bsToast = new bootstrap.Toast(toast, { delay: duration });
        bsToast.show();
        
        // Remove toast element after it's hidden
        toast.addEventListener('hidden.bs.toast', () => {
            toast.remove();
        });
    },
    
    // Utility functions
    formatCurrency(amount, currency = 'USD') {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currency
        }).format(amount);
    },
    
    formatNumber(number, decimals = 0) {
        return new Intl.NumberFormat('en-US', {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals
        }).format(number);
    },
    
    formatPercentage(value, decimals = 1) {
        return new Intl.NumberFormat('en-US', {
            style: 'percent',
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals
        }).format(value / 100);
    },
    
    formatDate(date, options = {}) {
        const defaultOptions = {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        };
        return new Intl.DateTimeFormat('en-US', { ...defaultOptions, ...options }).format(new Date(date));
    },
    
    // Data fetching utilities (mock data for demo)
    async fetchData(endpoint, options = {}) {
        // Simulate API call with mock data
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(this.getMockData(endpoint));
            }, 500);
        });
    },
    
    getMockData(endpoint) {
        const mockData = {
            dashboard: {
                kpis: {
                    totalCampaigns: 24,
                    activeLeads: 1847,
                    conversionRate: 12.5,
                    monthlySpend: 45000
                }
            },
            campaigns: {
                active: 8,
                planned: 5,
                completed: 11
            },
            leads: {
                total: 1847,
                new: 234,
                qualified: 156
            }
        };
        return mockData[endpoint] || {};
    },
    
    // Loading state management
    showLoading(element) {
        if (typeof element === 'string') {
            element = document.querySelector(element);
        }
        
        if (element) {
            const loader = document.createElement('div');
            loader.className = 'loading-spinner d-flex justify-content-center align-items-center';
            loader.innerHTML = `
                <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">Loading...</span>
                </div>
            `;
            loader.style.position = 'absolute';
            loader.style.top = '0';
            loader.style.left = '0';
            loader.style.right = '0';
            loader.style.bottom = '0';
            loader.style.backgroundColor = 'rgba(255, 255, 255, 0.8)';
            loader.style.zIndex = '999';
            
            element.style.position = 'relative';
            element.appendChild(loader);
        }
    },
    
    hideLoading(element) {
        if (typeof element === 'string') {
            element = document.querySelector(element);
        }
        
        if (element) {
            const loader = element.querySelector('.loading-spinner');
            if (loader) {
                loader.remove();
            }
        }
    }
};

// Common Chart Utilities
window.ChartUtils = {
    defaultColors: [
        '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0',
        '#9966FF', '#FF9F40', '#FF6384', '#C9CBCF'
    ],
    
    createChart(ctx, type, data, options = {}) {
        const defaultOptions = {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        };
        
        return new Chart(ctx, {
            type,
            data,
            options: { ...defaultOptions, ...options }
        });
    },
    
    generateChartData(labels, datasets) {
        return {
            labels,
            datasets: datasets.map((dataset, index) => ({
                ...dataset,
                backgroundColor: dataset.backgroundColor || this.defaultColors[index % this.defaultColors.length],
                borderColor: dataset.borderColor || this.defaultColors[index % this.defaultColors.length]
            }))
        };
    }
};

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.MarketingApp.init();
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { MarketingApp, ChartUtils };
}