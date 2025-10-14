class ReportsPage {
    constructor() {
        this.charts = {};
        this.reportData = [];
        this.filters = {};
        this.currentDateRange = 30;
        this.init();
    }

    init() {
        this.initializeCharts();
        this.initializeEventHandlers();
        this.loadReportData();
        this.populateReportsTable();
        this.startRealTimeUpdates();
    }

    initializeCharts() {
        // Performance Trends Chart
        this.initPerformanceChart();
        
        // Channel Distribution Chart
        this.initChannelChart();
        
        // Campaign Performance Chart
        this.initCampaignChart();
        
        // Demographics Chart
        this.initDemographicsChart();
    }

    initPerformanceChart() {
        const ctx = document.getElementById('performanceChart').getContext('2d');
        
        const gradient = ctx.createLinearGradient(0, 0, 0, 300);
        gradient.addColorStop(0, 'rgba(0, 123, 255, 0.2)');
        gradient.addColorStop(1, 'rgba(0, 123, 255, 0.02)');
        
        this.charts.performance = new Chart(ctx, {
            type: 'line',
            data: {
                labels: this.generateDateLabels(30),
                datasets: [{
                    label: 'Impressions',
                    data: this.generateTrendData(30, 1000, 3000),
                    borderColor: '#007bff',
                    backgroundColor: gradient,
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: '#007bff',
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2,
                    pointRadius: 4,
                    pointHoverRadius: 6
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        titleColor: '#fff',
                        bodyColor: '#fff',
                        cornerRadius: 8,
                        displayColors: false
                    }
                },
                scales: {
                    x: {
                        grid: {
                            display: false
                        },
                        ticks: {
                            color: '#666'
                        }
                    },
                    y: {
                        grid: {
                            color: 'rgba(0, 0, 0, 0.1)'
                        },
                        ticks: {
                            color: '#666',
                            callback: function(value) {
                                return value.toLocaleString();
                            }
                        }
                    }
                },
                interaction: {
                    intersect: false,
                    mode: 'index'
                }
            }
        });
    }

    initChannelChart() {
        const ctx = document.getElementById('channelChart').getContext('2d');
        
        this.charts.channel = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Google Ads', 'Facebook', 'Instagram', 'LinkedIn'],
                datasets: [{
                    data: [42, 28, 18, 12],
                    backgroundColor: ['#007bff', '#28a745', '#ffc107', '#dc3545'],
                    borderWidth: 0,
                    cutout: '65%'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        titleColor: '#fff',
                        bodyColor: '#fff',
                        cornerRadius: 8,
                        callbacks: {
                            label: function(context) {
                                return context.label + ': ' + context.parsed + '%';
                            }
                        }
                    }
                }
            }
        });
    }

    initCampaignChart() {
        const ctx = document.getElementById('campaignChart').getContext('2d');
        
        this.charts.campaign = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Cardiology', 'Orthopedics', 'Emergency', 'Pediatrics', 'Neurology'],
                datasets: [{
                    label: 'Conversions',
                    data: [45, 38, 29, 22, 18],
                    backgroundColor: ['#007bff', '#28a745', '#ffc107', '#fd7e14', '#6f42c1'],
                    borderRadius: 6,
                    borderSkipped: false
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        titleColor: '#fff',
                        bodyColor: '#fff',
                        cornerRadius: 8
                    }
                },
                scales: {
                    x: {
                        grid: {
                            display: false
                        },
                        ticks: {
                            color: '#666'
                        }
                    },
                    y: {
                        grid: {
                            color: 'rgba(0, 0, 0, 0.1)'
                        },
                        ticks: {
                            color: '#666'
                        },
                        beginAtZero: true
                    }
                }
            }
        });
    }

    initDemographicsChart() {
        const ctx = document.getElementById('demographicsChart').getContext('2d');
        
        this.charts.demographics = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['18-24', '25-34', '35-44', '45-54', '55-64', '65+'],
                datasets: [
                    {
                        label: 'Male',
                        data: [12, 19, 24, 18, 15, 12],
                        backgroundColor: '#007bff',
                        borderRadius: 4
                    },
                    {
                        label: 'Female',
                        data: [15, 22, 28, 21, 18, 16],
                        backgroundColor: '#28a745',
                        borderRadius: 4
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top',
                        labels: {
                            usePointStyle: true,
                            padding: 20
                        }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        titleColor: '#fff',
                        bodyColor: '#fff',
                        cornerRadius: 8
                    }
                },
                scales: {
                    x: {
                        grid: {
                            display: false
                        },
                        ticks: {
                            color: '#666'
                        }
                    },
                    y: {
                        grid: {
                            color: 'rgba(0, 0, 0, 0.1)'
                        },
                        ticks: {
                            color: '#666'
                        },
                        stacked: false
                    }
                }
            }
        });
    }

    initializeEventHandlers() {
        // Date range selector
        document.getElementById('dateRangeSelect').addEventListener('change', (e) => {
            this.currentDateRange = parseInt(e.target.value) || 30;
            this.updateChartData();
        });

        // Performance metric toggles
        document.querySelectorAll('input[name="performanceMetric"]').forEach(radio => {
            radio.addEventListener('change', (e) => {
                this.updatePerformanceMetric(e.target.id);
            });
        });

        // Export handlers
        document.getElementById('exportReportBtn').addEventListener('click', () => {
            this.showExportModal();
        });

        document.getElementById('confirmExportBtn').addEventListener('click', () => {
            this.exportReport();
        });

        // Schedule handlers
        document.getElementById('scheduleReportBtn').addEventListener('click', () => {
            this.showScheduleModal();
        });

        document.getElementById('confirmScheduleBtn').addEventListener('click', () => {
            this.scheduleReport();
        });

        // Filter handlers
        document.getElementById('filterBtn').addEventListener('click', () => {
            this.showFilterModal();
        });

        document.getElementById('applyFiltersBtn').addEventListener('click', () => {
            this.applyFilters();
        });

        document.getElementById('clearFiltersBtn').addEventListener('click', () => {
            this.clearFilters();
        });

        // Table export
        document.getElementById('exportTableBtn').addEventListener('click', () => {
            this.exportTableData();
        });
    }

    generateDateLabels(days) {
        const labels = [];
        const now = new Date();
        
        for (let i = days - 1; i >= 0; i--) {
            const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
            labels.push(date.toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric' 
            }));
        }
        
        return labels;
    }

    generateTrendData(days, min, max) {
        const data = [];
        let lastValue = Math.floor(Math.random() * (max - min) + min);
        
        for (let i = 0; i < days; i++) {
            const change = (Math.random() - 0.5) * (max * 0.2);
            lastValue = Math.max(min, Math.min(max, lastValue + change));
            data.push(Math.floor(lastValue));
        }
        
        return data;
    }

    updatePerformanceMetric(metric) {
        let data, label, color;
        
        switch (metric) {
            case 'impressions':
                data = this.generateTrendData(this.currentDateRange, 1000, 3000);
                label = 'Impressions';
                color = '#007bff';
                break;
            case 'clicks':
                data = this.generateTrendData(this.currentDateRange, 50, 150);
                label = 'Clicks';
                color = '#28a745';
                break;
            case 'conversions':
                data = this.generateTrendData(this.currentDateRange, 5, 25);
                label = 'Conversions';
                color = '#ffc107';
                break;
        }
        
        this.charts.performance.data.datasets[0].data = data;
        this.charts.performance.data.datasets[0].label = label;
        this.charts.performance.data.datasets[0].borderColor = color;
        this.charts.performance.update('active');
    }

    updateChartData() {
        // Update performance chart with new date range
        this.charts.performance.data.labels = this.generateDateLabels(this.currentDateRange);
        
        const currentMetric = document.querySelector('input[name="performanceMetric"]:checked').id;
        this.updatePerformanceMetric(currentMetric);
    }

    loadReportData() {
        // Generate sample report data
        this.reportData = [
            {
                name: 'Cardiology Services Campaign',
                channel: 'Google Ads',
                impressions: 15420,
                clicks: 485,
                ctr: 3.14,
                conversions: 23,
                cost: 1850,
                roi: 245,
                status: 'active'
            },
            {
                name: 'Emergency Care Awareness',
                channel: 'Facebook',
                impressions: 12890,
                clicks: 356,
                ctr: 2.76,
                conversions: 18,
                cost: 1200,
                roi: 180,
                status: 'active'
            },
            {
                name: 'Orthopedic Surgery',
                channel: 'Instagram',
                impressions: 8950,
                clicks: 267,
                ctr: 2.98,
                conversions: 15,
                cost: 950,
                roi: 210,
                status: 'paused'
            },
            {
                name: 'Pediatric Health Check',
                channel: 'LinkedIn',
                impressions: 5430,
                clicks: 142,
                ctr: 2.61,
                conversions: 8,
                cost: 680,
                roi: 165,
                status: 'completed'
            },
            {
                name: 'Mental Health Awareness',
                channel: 'Google Ads',
                impressions: 9870,
                clicks: 298,
                ctr: 3.02,
                conversions: 12,
                cost: 780,
                roi: 190,
                status: 'active'
            }
        ];
    }

    populateReportsTable() {
        const tbody = document.getElementById('reportsTableBody');
        tbody.innerHTML = '';

        let filteredData = this.reportData;
        
        // Apply filters
        if (this.filters.status) {
            filteredData = filteredData.filter(item => item.status === this.filters.status);
        }
        if (this.filters.channel) {
            filteredData = filteredData.filter(item => 
                item.channel.toLowerCase().includes(this.filters.channel.toLowerCase())
            );
        }

        filteredData.forEach(campaign => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>
                    <div class="fw-semibold">${campaign.name}</div>
                </td>
                <td>
                    <span class="badge bg-light text-dark">${campaign.channel}</span>
                </td>
                <td>${campaign.impressions.toLocaleString()}</td>
                <td>${campaign.clicks.toLocaleString()}</td>
                <td>${campaign.ctr}%</td>
                <td>${campaign.conversions}</td>
                <td>$${campaign.cost.toLocaleString()}</td>
                <td class="${campaign.roi > 200 ? 'roi-positive' : campaign.roi < 150 ? 'roi-negative' : 'roi-neutral'}">
                    ${campaign.roi}%
                </td>
                <td>
                    <span class="status-badge ${campaign.status}">${campaign.status}</span>
                    <button class="btn btn-sm btn-outline-primary action-btn ms-1" onclick="window.reportsPage.viewCampaign('${campaign.name}')">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-secondary action-btn" onclick="window.reportsPage.editCampaign('${campaign.name}')">
                        <i class="fas fa-edit"></i>
                    </button>
                </td>
            `;
            tbody.appendChild(row);
        });
    }

    showExportModal() {
        const modal = new bootstrap.Modal(document.getElementById('exportModal'));
        
        // Set default dates
        const today = new Date();
        const startDate = new Date(today.getTime() - this.currentDateRange * 24 * 60 * 60 * 1000);
        
        document.querySelector('[name="startDate"]').value = startDate.toISOString().split('T')[0];
        document.querySelector('[name="endDate"]').value = today.toISOString().split('T')[0];
        
        modal.show();
    }

    exportReport() {
        const form = document.getElementById('exportForm');
        const formData = new FormData(form);
        const exportData = Object.fromEntries(formData.entries());
        
        // Add progress indicator
        this.showExportProgress();
        
        // Simulate export process
        setTimeout(() => {
            this.downloadReport(exportData);
            this.hideExportProgress();
            
            const modal = bootstrap.Modal.getInstance(document.getElementById('exportModal'));
            modal.hide();
            
            this.showToast('Report exported successfully!', 'success');
        }, 2000);
    }

    showExportProgress() {
        const exportBtn = document.getElementById('confirmExportBtn');
        exportBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-1"></i> Exporting...';
        exportBtn.disabled = true;
        
        // Add progress bar if it doesn't exist
        if (!document.querySelector('.export-progress')) {
            const progressDiv = document.createElement('div');
            progressDiv.className = 'export-progress';
            progressDiv.innerHTML = `
                <div class="progress">
                    <div class="progress-bar" role="progressbar" style="width: 0%"></div>
                </div>
            `;
            document.querySelector('#exportModal .modal-body').appendChild(progressDiv);
        }
        
        document.querySelector('.export-progress').style.display = 'block';
        
        // Animate progress
        let progress = 0;
        const interval = setInterval(() => {
            progress += Math.random() * 30;
            if (progress > 90) progress = 90;
            
            document.querySelector('.progress-bar').style.width = progress + '%';
            
            if (progress >= 90) {
                clearInterval(interval);
                setTimeout(() => {
                    document.querySelector('.progress-bar').style.width = '100%';
                }, 500);
            }
        }, 200);
    }

    hideExportProgress() {
        const exportBtn = document.getElementById('confirmExportBtn');
        exportBtn.innerHTML = '<i class="fas fa-download me-1"></i> Export Report';
        exportBtn.disabled = false;
        
        document.querySelector('.export-progress').style.display = 'none';
    }

    downloadReport(exportData) {
        // Generate CSV content
        const csvContent = this.generateCSVContent(exportData.reportType);
        
        // Create download link
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `marketing-report-${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
    }

    generateCSVContent(reportType) {
        let content = 'Campaign Name,Channel,Impressions,Clicks,CTR,Conversions,Cost,ROI,Status\n';
        
        this.reportData.forEach(campaign => {
            content += `"${campaign.name}","${campaign.channel}",${campaign.impressions},${campaign.clicks},${campaign.ctr}%,${campaign.conversions},$${campaign.cost},${campaign.roi}%,"${campaign.status}"\n`;
        });
        
        return content;
    }

    showScheduleModal() {
        const modal = new bootstrap.Modal(document.getElementById('scheduleModal'));
        modal.show();
    }

    scheduleReport() {
        const form = document.getElementById('scheduleForm');
        const formData = new FormData(form);
        const scheduleData = Object.fromEntries(formData.entries());
        
        // Simulate API call
        setTimeout(() => {
            const modal = bootstrap.Modal.getInstance(document.getElementById('scheduleModal'));
            modal.hide();
            
            this.showToast(`Report "${scheduleData.reportName}" scheduled successfully!`, 'success');
            
            // Clear form
            form.reset();
        }, 1000);
    }

    showFilterModal() {
        const modal = new bootstrap.Modal(document.getElementById('filterModal'));
        modal.show();
    }

    applyFilters() {
        const form = document.getElementById('filterForm');
        const formData = new FormData(form);
        
        this.filters = {};
        for (let [key, value] of formData.entries()) {
            if (value) {
                this.filters[key] = value;
            }
        }
        
        this.populateReportsTable();
        
        const modal = bootstrap.Modal.getInstance(document.getElementById('filterModal'));
        modal.hide();
        
        this.showToast('Filters applied successfully!', 'info');
    }

    clearFilters() {
        this.filters = {};
        document.getElementById('filterForm').reset();
        this.populateReportsTable();
        
        this.showToast('Filters cleared!', 'info');
    }

    exportTableData() {
        const csvContent = this.generateCSVContent('detailed');
        
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `campaign-data-${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
        
        this.showToast('Table data exported successfully!', 'success');
    }

    viewCampaign(campaignName) {
        this.showToast(`Viewing details for: ${campaignName}`, 'info');
        // In a real app, this would navigate to campaign details
    }

    editCampaign(campaignName) {
        this.showToast(`Opening editor for: ${campaignName}`, 'info');
        // In a real app, this would open campaign editor
    }

    startRealTimeUpdates() {
        // Simulate real-time data updates every 30 seconds
        setInterval(() => {
            this.updateStatsWithRandomData();
        }, 30000);
    }

    updateStatsWithRandomData() {
        // Update stat cards with slight variations
        const statNumbers = document.querySelectorAll('.stat-number');
        
        statNumbers.forEach(stat => {
            const currentValue = parseFloat(stat.textContent.replace(/[K,$,%]/g, ''));
            const variation = (Math.random() - 0.5) * 0.02; // ±1% variation
            let newValue = currentValue * (1 + variation);
            
            // Format the new value
            if (stat.textContent.includes('K')) {
                stat.textContent = (newValue / 1000).toFixed(1) + 'K';
            } else if (stat.textContent.includes('$')) {
                stat.textContent = '$' + newValue.toLocaleString();
            } else if (stat.textContent.includes('%')) {
                stat.textContent = newValue.toFixed(2) + '%';
            } else {
                stat.textContent = Math.floor(newValue).toLocaleString();
            }
        });
    }

    showToast(message, type = 'info') {
        // Create toast element
        const toast = document.createElement('div');
        toast.className = `toast align-items-center text-bg-${type === 'error' ? 'danger' : type} border-0`;
        toast.setAttribute('role', 'alert');
        toast.innerHTML = `
            <div class="d-flex">
                <div class="toast-body">
                    <i class="fas ${this.getToastIcon(type)} me-2"></i>
                    ${message}
                </div>
                <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
            </div>
        `;

        // Add to toast container
        let toastContainer = document.querySelector('.toast-container');
        if (!toastContainer) {
            toastContainer = document.createElement('div');
            toastContainer.className = 'toast-container position-fixed top-0 end-0 p-3';
            document.body.appendChild(toastContainer);
        }

        toastContainer.appendChild(toast);

        // Show toast
        const bsToast = new bootstrap.Toast(toast, {
            autohide: true,
            delay: type === 'error' ? 5000 : 3000
        });
        bsToast.show();

        // Remove from DOM after hiding
        toast.addEventListener('hidden.bs.toast', () => {
            toast.remove();
        });
    }

    getToastIcon(type) {
        const icons = {
            success: 'fa-check-circle',
            error: 'fa-exclamation-circle',
            warning: 'fa-exclamation-triangle',
            info: 'fa-info-circle'
        };
        return icons[type] || icons.info;
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize shared app
    if (typeof MarketingApp !== 'undefined') {
        window.marketingApp = new MarketingApp();
    }
    
    // Initialize reports page
    window.reportsPage = new ReportsPage();
});