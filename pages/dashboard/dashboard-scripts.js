// Dashboard Page Scripts

class DashboardPage {
    constructor() {
        this.charts = {};
        this.data = {
            kpis: {
                totalCampaigns: 24,
                activeLeads: 1847,
                conversionRate: 12.5,
                monthlySpend: 45000
            },
            performanceData: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
                datasets: [
                    {
                        label: 'Leads Generated',
                        data: [120, 150, 180, 140, 200, 250, 220, 280, 300, 320],
                        borderColor: '#007bff',
                        backgroundColor: 'rgba(0, 123, 255, 0.1)',
                        tension: 0.4,
                        fill: true
                    },
                    {
                        label: 'Conversions',
                        data: [15, 18, 22, 17, 25, 31, 28, 35, 38, 40],
                        borderColor: '#28a745',
                        backgroundColor: 'rgba(40, 167, 69, 0.1)',
                        tension: 0.4,
                        fill: true
                    }
                ]
            },
            leadSourceData: {
                labels: ['Google Ads', 'Social Media', 'Email', 'Referrals', 'Direct'],
                datasets: [{
                    data: [35, 25, 20, 15, 5],
                    backgroundColor: [
                        '#FF6384',
                        '#36A2EB', 
                        '#FFCE56',
                        '#4BC0C0',
                        '#9966FF'
                    ],
                    borderWidth: 2,
                    borderColor: '#ffffff'
                }]
            }
        };
        
        this.init();
    }
    
    init() {
        this.initializeCharts();
        this.bindEvents();
        this.animateKPIs();
        this.loadRecentData();
    }
    
    initializeCharts() {
        // Performance Chart
        const performanceCtx = document.getElementById('performanceChart');
        if (performanceCtx) {
            this.charts.performance = new Chart(performanceCtx, {
                type: 'line',
                data: this.data.performanceData,
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'bottom',
                            labels: {
                                usePointStyle: true,
                                padding: 20
                            }
                        },
                        tooltip: {
                            mode: 'index',
                            intersect: false,
                            backgroundColor: 'rgba(0, 0, 0, 0.8)',
                            titleColor: '#ffffff',
                            bodyColor: '#ffffff',
                            borderColor: 'rgba(255, 255, 255, 0.2)',
                            borderWidth: 1
                        }
                    },
                    scales: {
                        x: {
                            grid: {
                                display: false
                            },
                            ticks: {
                                color: '#6c757d'
                            }
                        },
                        y: {
                            beginAtZero: true,
                            grid: {
                                color: 'rgba(0, 0, 0, 0.1)'
                            },
                            ticks: {
                                color: '#6c757d'
                            }
                        }
                    },
                    interaction: {
                        mode: 'nearest',
                        axis: 'x',
                        intersect: false
                    }
                }
            });
        }
        
        // Lead Source Chart
        const leadSourceCtx = document.getElementById('leadSourceChart');
        if (leadSourceCtx) {
            this.charts.leadSource = new Chart(leadSourceCtx, {
                type: 'doughnut',
                data: this.data.leadSourceData,
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'bottom',
                            labels: {
                                usePointStyle: true,
                                padding: 15,
                                generateLabels: function(chart) {
                                    const data = chart.data;
                                    if (data.labels.length && data.datasets.length) {
                                        return data.labels.map((label, i) => {
                                            const value = data.datasets[0].data[i];
                                            const total = data.datasets[0].data.reduce((a, b) => a + b, 0);
                                            const percentage = Math.round((value / total) * 100);
                                            return {
                                                text: `${label} (${percentage}%)`,
                                                fillStyle: data.datasets[0].backgroundColor[i],
                                                strokeStyle: data.datasets[0].borderColor,
                                                lineWidth: data.datasets[0].borderWidth,
                                                pointStyle: 'circle',
                                                index: i
                                            };
                                        });
                                    }
                                    return [];
                                }
                            }
                        },
                        tooltip: {
                            backgroundColor: 'rgba(0, 0, 0, 0.8)',
                            titleColor: '#ffffff',
                            bodyColor: '#ffffff',
                            borderColor: 'rgba(255, 255, 255, 0.2)',
                            borderWidth: 1,
                            callbacks: {
                                label: function(context) {
                                    const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                    const percentage = Math.round((context.parsed / total) * 100);
                                    return `${context.label}: ${percentage}% (${context.parsed} leads)`;
                                }
                            }
                        }
                    },
                    cutout: '60%',
                    radius: '90%'
                }
            });
        }
    }
    
    bindEvents() {
        // KPI card click events
        document.querySelectorAll('.kpi-card').forEach(card => {
            card.addEventListener('click', (e) => {
                const cardType = card.classList[2]; // e.g., 'kpi-campaigns'
                this.handleKPIClick(cardType);
            });
        });
        
        // Recommendation buttons
        document.querySelectorAll('.recommendation-item .btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.handleRecommendationAction(e.target);
            });
        });
        
        // Date range change
        document.querySelectorAll('input[type="date"]').forEach(input => {
            input.addEventListener('change', () => {
                this.handleDateRangeChange();
            });
        });
        
        // Location change
        document.querySelector('.location-selector select')?.addEventListener('change', (e) => {
            this.handleLocationChange(e.target.value);
        });
        
        // Quick action buttons
        document.querySelectorAll('.quick-actions .btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                // Navigation is handled by onclick attributes in HTML
                // Add any additional tracking or analytics here
                this.trackQuickAction(btn.textContent.trim());
            });
        });
    }
    
    animateKPIs() {
        // Animate KPI values on page load
        document.querySelectorAll('.kpi-value').forEach((element, index) => {
            setTimeout(() => {
                element.style.opacity = '0';
                element.style.transform = 'translateY(20px)';
                
                setTimeout(() => {
                    element.style.transition = 'all 0.6s ease';
                    element.style.opacity = '1';
                    element.style.transform = 'translateY(0)';
                    
                    // Animate the number counting up
                    this.animateNumber(element);
                }, 100);
            }, index * 200);
        });
    }
    
    animateNumber(element) {
        const text = element.textContent;
        const isPercentage = text.includes('%');
        const isCurrency = text.includes('$');
        const hasComma = text.includes(',');
        
        // Extract the number
        let targetValue = parseFloat(text.replace(/[,$%]/g, ''));
        
        if (hasComma) {
            // For numbers with commas (like 1,847)
            targetValue = parseInt(text.replace(/[,$%]/g, ''));
        }
        
        let currentValue = 0;
        const increment = targetValue / 50; // 50 steps
        const timer = setInterval(() => {
            currentValue += increment;
            if (currentValue >= targetValue) {
                currentValue = targetValue;
                clearInterval(timer);
            }
            
            let displayValue = Math.round(currentValue);
            
            if (isCurrency) {
                displayValue = '$' + displayValue.toLocaleString();
            } else if (isPercentage) {
                displayValue = displayValue.toFixed(1) + '%';
            } else if (hasComma) {
                displayValue = displayValue.toLocaleString();
            }
            
            element.textContent = displayValue;
        }, 20);
    }
    
    handleKPIClick(cardType) {
        // Navigate to detailed view based on KPI type
        const routes = {
            'kpi-campaigns': '../pages/campaigns/campaigns.html',
            'kpi-leads': '../pages/leads/leads.html',
            'kpi-conversion': '../pages/reports/reports.html',
            'kpi-spend': '../pages/reports/reports.html'
        };
        
        if (routes[cardType]) {
            window.location.href = routes[cardType];
        }
    }
    
    handleRecommendationAction(button) {
        const recommendationItem = button.closest('.recommendation-item');
        const title = recommendationItem.querySelector('h6').textContent;
        const type = button.textContent.trim();
        
        // Show loading state
        button.disabled = true;
        const originalText = button.textContent;
        button.innerHTML = '<i class="fas fa-spinner fa-spin me-1"></i>Processing...';
        
        // Simulate processing
        setTimeout(() => {
            button.disabled = false;
            button.textContent = originalText;
            
            // Show success message
            window.MarketingApp.showToast(`${type} action completed for: ${title}`, 'success');
            
            // Add visual feedback
            recommendationItem.style.opacity = '0.6';
            recommendationItem.style.transform = 'scale(0.98)';
            
            setTimeout(() => {
                recommendationItem.style.opacity = '1';
                recommendationItem.style.transform = 'scale(1)';
            }, 300);
        }, 1500);
    }
    
    handleDateRangeChange() {
        const startDate = document.querySelector('.start-date').value;
        const endDate = document.querySelector('.end-date').value;
        
        if (startDate && endDate) {
            // Show loading state
            this.showChartLoading();
            
            // Simulate data refresh
            setTimeout(() => {
                this.refreshCharts();
                this.hideChartLoading();
                window.MarketingApp.showToast('Dashboard updated for selected date range', 'info');
            }, 1000);
        }
    }
    
    handleLocationChange(location) {
        // Show loading state
        this.showChartLoading();
        
        // Simulate data refresh
        setTimeout(() => {
            this.refreshCharts();
            this.hideChartLoading();
            window.MarketingApp.showToast(`Dashboard updated for ${location}`, 'info');
        }, 800);
    }
    
    showChartLoading() {
        Object.values(this.charts).forEach(chart => {
            if (chart && chart.canvas) {
                window.MarketingApp.showLoading(chart.canvas.parentElement);
            }
        });
    }
    
    hideChartLoading() {
        Object.values(this.charts).forEach(chart => {
            if (chart && chart.canvas) {
                window.MarketingApp.hideLoading(chart.canvas.parentElement);
            }
        });
    }
    
    refreshCharts() {
        // Simulate new data
        const newPerformanceData = {
            ...this.data.performanceData,
            datasets: this.data.performanceData.datasets.map(dataset => ({
                ...dataset,
                data: dataset.data.map(value => value + Math.random() * 20 - 10)
            }))
        };
        
        const newLeadSourceData = {
            ...this.data.leadSourceData,
            datasets: [{
                ...this.data.leadSourceData.datasets[0],
                data: this.data.leadSourceData.datasets[0].data.map(value => 
                    Math.max(1, value + Math.random() * 10 - 5)
                )
            }]
        };
        
        // Update charts
        if (this.charts.performance) {
            this.charts.performance.data = newPerformanceData;
            this.charts.performance.update('active');
        }
        
        if (this.charts.leadSource) {
            this.charts.leadSource.data = newLeadSourceData;
            this.charts.leadSource.update('active');
        }
    }
    
    loadRecentData() {
        // Simulate loading recent campaigns data
        // In a real application, this would be an API call
        const recentCampaigns = [
            {
                name: 'Cardiology Awareness Q4',
                status: 'Active',
                leads: 342,
                spend: 8500,
                roi: 245,
                startDate: '2024-10-15'
            },
            {
                name: 'Emergency Care Promotion',
                status: 'Review',
                leads: 128,
                spend: 5200,
                roi: 89,
                startDate: '2024-10-10'
            },
            {
                name: 'Wellness Check Campaign',
                status: 'Active',
                leads: 267,
                spend: 6800,
                roi: 198,
                startDate: '2024-10-05'
            }
        ];
        
        // This data is already in the HTML, but in a real app you'd populate it dynamically
    }
    
    trackQuickAction(action) {
        // Analytics tracking for quick actions
        console.log(`Quick action clicked: ${action}`);
        // In a real application, you'd send this to your analytics service
    }
    
    // Auto-refresh functionality
    startAutoRefresh() {
        setInterval(() => {
            this.refreshCharts();
        }, 30000); // Refresh every 30 seconds
    }
    
    // Utility method to format numbers for display
    formatKPIValue(value, type) {
        switch (type) {
            case 'currency':
                return window.MarketingApp.formatCurrency(value);
            case 'percentage':
                return window.MarketingApp.formatPercentage(value);
            case 'number':
                return window.MarketingApp.formatNumber(value);
            default:
                return value.toString();
        }
    }
}

// Initialize dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const dashboard = new DashboardPage();
    
    // Start auto-refresh after 5 seconds
    setTimeout(() => {
        dashboard.startAutoRefresh();
    }, 5000);
    
    // Make dashboard instance globally available for debugging
    window.dashboard = dashboard;
});