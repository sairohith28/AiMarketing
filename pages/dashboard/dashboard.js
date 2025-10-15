/**
 * Dashboard Module - JavaScript
 * Handles dashboard-specific functionality
 */

let dashboardTrendsChart = null;

// Initialize Dashboard
function initializeDashboard() {
    console.log('Initializing Dashboard...');
    
    // Wait a bit for DOM to be fully ready
    setTimeout(() => {
        initializeTrendsChart();
        setupDashboardInteractions();
    }, 100);
}

// Chart Initialization
function initializeTrendsChart() {
    // Check if Chart.js is available
    if (typeof Chart === 'undefined') {
        console.error('Chart.js is not loaded');
        return;
    }
    
    const ctx = document.getElementById('trendsChart');
    if (!ctx) {
        console.error('Canvas element #trendsChart not found');
        return;
    }
    
    console.log('Initializing trends chart...', ctx);
    
    // Get 2D context
    const context = ctx.getContext('2d');
    if (!context) {
        console.error('Unable to get 2D context from canvas');
        return;
    }
    
    const trendsData = {
        labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6', 'Week 7'],
        datasets: [
            {
                label: 'Leads Generated',
                data: [245, 289, 312, 278, 334, 389, 425],
                borderColor: '#28a745',
                backgroundColor: 'rgba(40, 167, 69, 0.1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4,
                yAxisID: 'y'
            },
            {
                label: 'Cost Per Lead (₹)',
                data: [520, 485, 450, 460, 425, 390, 380],
                borderColor: '#dc3545',
                backgroundColor: 'rgba(220, 53, 69, 0.1)',
                borderWidth: 3,
                fill: false,
                tension: 0.4,
                yAxisID: 'y1'
            }
        ]
    };
    
    try {
        dashboardTrendsChart = new Chart(context, {
            type: 'line',
            data: trendsData,
            options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
                mode: 'index',
                intersect: false,
            },
            plugins: {
                legend: {
                    position: 'top',
                }
            },
            scales: {
                y: {
                    type: 'linear',
                    display: true,
                    position: 'left',
                    title: {
                        display: true,
                        text: 'Number of Leads'
                    },
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
                    }
                },
                y1: {
                    type: 'linear',
                    display: true,
                    position: 'right',
                    title: {
                        display: true,
                        text: 'Cost Per Lead (₹)'
                    },
                    grid: {
                        drawOnChartArea: false,
                    },
                },
                x: {
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
                    }
                }
            },
            elements: {
                point: {
                    radius: 4,
                    hoverRadius: 8
                }
            }
        }
    });
    
    console.log('Trends chart initialized successfully');
    } catch (error) {
        console.error('Error initializing trends chart:', error);
    }
}

// Setup Dashboard Interactions
function setupDashboardInteractions() {
    // KPI Card Clicks
    document.querySelectorAll('.clickable-card').forEach(card => {
        card.addEventListener('click', function() {
            const kpiType = this.getAttribute('data-kpi');
            handleKPIClick(kpiType);
        });
    });
    
    // Circular Heatmap Segment Clicks
    document.querySelectorAll('.heatmap-segment').forEach(segment => {
        segment.addEventListener('click', function() {
            const service = this.getAttribute('data-service');
            const performance = this.getAttribute('data-performance');
            const serviceName = service.charAt(0).toUpperCase() + service.slice(1);
            
            showDepartmentDetails(serviceName, performance, service);
        });
        
        // Add hover effects for better interactivity
        segment.addEventListener('mouseenter', function() {
            const service = this.getAttribute('data-service');
            const performance = this.getAttribute('data-performance');
            
            // Optional: Show tooltip or highlight effect
            this.style.cursor = 'pointer';
        });
    });
    
    // Timeframe Selector
    document.querySelectorAll('input[name="timeframe"]').forEach(radio => {
        radio.addEventListener('change', function() {
            updateTrendsChart(this.id);
        });
    });
    
    // Alert Action Buttons
    document.querySelectorAll('.alert-actions .btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const action = this.textContent.trim();
            showAlert(`${action} action initiated`, 'success');
        });
    });

    // AI Recommendations Actions
    setupRecommendationsActions();
}

// Setup AI Recommendations Actions
function setupRecommendationsActions() {
    // Accept Insight Preview buttons
    document.querySelectorAll('.accept-insight-preview').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const insight = this.getAttribute('data-insight');
            acceptInsight(insight);
        });
    });

    // Reject Insight Preview buttons
    document.querySelectorAll('.reject-insight-preview').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const insight = this.getAttribute('data-insight');
            rejectInsight(insight);
        });
    });

    // Create Campaign Preview buttons
    document.querySelectorAll('.create-campaign-preview').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const insight = this.getAttribute('data-insight');
            createCampaignFromInsight(insight);
        });
    });

    // View All Recommendations button
    const viewAllBtn = document.getElementById('viewAllRecommendationsBtn');
    if (viewAllBtn) {
        viewAllBtn.addEventListener('click', function() {
            // Navigate to recommendations page or show modal
            if (typeof showSection === 'function') {
                showSection('recommendations');
            } else {
                showAlert('Navigating to full recommendations view...', 'info');
            }
        });
    }
}

// Handle KPI Card Clicks
function handleKPIClick(kpiType) {
    switch(kpiType) {
        case 'campaigns':
            if (typeof showSection === 'function') {
                showSection('campaigns');
            } else {
                showAlert('Navigating to Campaigns...', 'info');
            }
            break;
        case 'leads':
            if (typeof showSection === 'function') {
                showSection('leads');
            } else {
                showAlert('Navigating to Leads...', 'info');
            }
            break;
        case 'cpl':
        case 'budget':
            if (typeof showSection === 'function') {
                showSection('reports');
            } else {
                showAlert('Navigating to Reports...', 'info');
            }
            break;
        case 'ai-recommendations':
            if (typeof showSection === 'function') {
                showSection('recommendations');
            } else {
                showAlert('Navigating to AI Recommendations...', 'info');
            }
            break;
    }
}

// Show Department Details
function showDepartmentDetails(serviceName, performance, serviceKey) {
    const performanceLevel = getPerformanceLevel(performance);
    const recommendations = getDepartmentRecommendations(serviceKey, performance);
    
    const alertMessage = `
        <div class="department-detail-popup">
            <div class="dept-header">
                <h6 class="mb-2">${serviceName} Department</h6>
                <span class="badge ${getPerformanceBadgeClass(performance)}">${performance}% Performance</span>
            </div>
            <div class="dept-insights mt-3">
                <div class="insight-item">
                    <strong>Status:</strong> ${performanceLevel}
                </div>
                <div class="insight-item">
                    <strong>Recommendation:</strong> ${recommendations}
                </div>
                <div class="action-buttons mt-3">
                    <button class="btn btn-sm btn-outline-primary" onclick="viewDetailedReport('${serviceKey}')">
                        View Detailed Report
                    </button>
                    <button class="btn btn-sm btn-primary" onclick="createTargetedCampaign('${serviceKey}')">
                        Create Campaign
                    </button>
                </div>
            </div>
        </div>
    `;
    
    if (typeof showAlert === 'function') {
        showAlert(alertMessage, 'info', true);
    } else {
        console.log(`Department Details: ${serviceName} - ${performanceLevel}`);
    }
}

// Accept Insight
function acceptInsight(insightKey) {
    showAlert(`Insight "${insightKey}" accepted and added to campaign queue.`, 'success');
    
    // Update UI to reflect accepted state
    const insightCard = document.querySelector(`[data-insight="${insightKey}"]`);
    if (insightCard) {
        insightCard.style.opacity = '0.7';
        insightCard.style.pointerEvents = 'none';
        
        // Add accepted badge
        const acceptedBadge = document.createElement('span');
        acceptedBadge.className = 'badge bg-success ms-2';
        acceptedBadge.textContent = 'Accepted';
        insightCard.querySelector('.priority-badges').appendChild(acceptedBadge);
    }
}

// Reject Insight
function rejectInsight(insightKey) {
    showAlert(`Insight "${insightKey}" rejected and removed from recommendations.`, 'warning');
    
    // Fade out the insight card
    const insightCard = document.querySelector(`[data-insight="${insightKey}"]`);
    if (insightCard) {
        insightCard.style.transition = 'all 0.3s ease';
        insightCard.style.transform = 'scale(0.95)';
        insightCard.style.opacity = '0.5';
        
        setTimeout(() => {
            insightCard.style.display = 'none';
        }, 300);
    }
}

// Create Campaign from Insight
function createCampaignFromInsight(insightKey) {
    showAlert(`Creating campaign from insight: ${insightKey}...`, 'info');
    
    // In a real application, this would navigate to campaign creation
    setTimeout(() => {
        showAlert(`Campaign template created successfully from ${insightKey} insight!`, 'success');
    }, 1500);
}

// Get performance level text
function getPerformanceLevel(performance) {
    if (performance >= 90) return "Excellent Performance";
    if (performance >= 70) return "Good Performance";
    if (performance >= 50) return "Average Performance";
    return "Needs Immediate Attention";
}

// Get performance badge class
function getPerformanceBadgeClass(performance) {
    if (performance >= 90) return "bg-success";
    if (performance >= 70) return "bg-info";
    if (performance >= 50) return "bg-warning";
    return "bg-danger";
}

// Get department recommendations
function getDepartmentRecommendations(serviceKey, performance) {
    const recommendations = {
        cardiology: {
            high: "Continue current strategy, consider expanding services",
            medium: "Optimize patient journey and follow-up processes",
            low: "Review pricing strategy and competitor analysis needed"
        },
        pediatrics: {
            high: "Expand pediatric subspecialties, seasonal campaigns",
            medium: "Improve parent education programs and digital presence",
            low: "Focus on community outreach and school partnerships"
        },
        orthopedics: {
            high: "Consider sports medicine expansion",
            medium: "Enhance post-surgery care programs",
            low: "Review referral networks and add weekend clinics"
        },
        oncology: {
            high: "Expand support services and patient navigation",
            medium: "Improve multidisciplinary care coordination",
            low: "Focus on early detection campaigns and patient education"
        },
        neurology: {
            high: "Consider telemedicine expansion",
            medium: "Improve appointment scheduling and wait times",
            low: "Enhance stroke and headache specialty services"
        },
        dermatology: {
            high: "Add cosmetic services and seasonal campaigns",
            medium: "Improve online booking and telehealth options",
            low: "Focus on skin cancer awareness and prevention programs"
        },
        psychiatry: {
            high: "Expand therapy options and group sessions",
            medium: "Improve mental health awareness campaigns",
            low: "Focus on stigma reduction and community partnerships"
        },
        gynecology: {
            high: "Expand women's wellness programs",
            medium: "Improve prenatal and postnatal care services",
            low: "Focus on reproductive health education and outreach"
        }
    };
    
    const level = performance >= 70 ? 'high' : performance >= 50 ? 'medium' : 'low';
    return recommendations[serviceKey]?.[level] || "Conduct detailed performance analysis";
}

// View detailed report (placeholder function)
function viewDetailedReport(serviceKey) {
    showAlert(`Opening detailed report for ${serviceKey} department...`, 'info');
}

// Create targeted campaign (placeholder function)
function createTargetedCampaign(serviceKey) {
    showAlert(`Creating targeted campaign for ${serviceKey} department...`, 'success');
    // This could open the campaign modal with pre-filled data
}

// Update Trends Chart based on timeframe
function updateTrendsChart(timeframe) {
    if (!dashboardTrendsChart) return;
    
    let newData;
    switch(timeframe) {
        case '7days':
            newData = {
                labels: ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Day 7'],
                leads: [35, 42, 38, 45, 52, 48, 61],
                cpl: [450, 425, 440, 410, 395, 385, 380]
            };
            break;
        case '30days':
            newData = {
                labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
                leads: [289, 312, 334, 389],
                cpl: [485, 450, 425, 390]
            };
            break;
        case '90days':
            newData = {
                labels: ['Month 1', 'Month 2', 'Month 3'],
                leads: [1245, 1389, 1534],
                cpl: [520, 465, 425]
            };
            break;
    }
    
    dashboardTrendsChart.data.labels = newData.labels;
    dashboardTrendsChart.data.datasets[0].data = newData.leads;
    dashboardTrendsChart.data.datasets[1].data = newData.cpl;
    dashboardTrendsChart.update('active');
}

// Update KPIs
function updateKPIs() {
    document.querySelectorAll('.kpi-number').forEach((element, index) => {
        const currentText = element.textContent;
        let baseValue, newValue;
        
        if (currentText.includes('₹')) {
            baseValue = parseInt(currentText.replace(/[₹,]/g, ''));
            const variation = Math.floor(Math.random() * 100) - 50;
            newValue = Math.max(300, baseValue + variation);
            element.textContent = `₹${newValue}`;
        } else if (currentText.includes('%')) {
            baseValue = parseInt(currentText.replace('%', ''));
            const variation = Math.floor(Math.random() * 20) - 10;
            newValue = Math.max(10, Math.min(100, baseValue + variation));
            element.textContent = `${newValue}%`;
        } else {
            const baseValues = [12, 1247, 425, 68];
            baseValue = baseValues[index] || parseInt(currentText.replace(/,/g, ''));
            const variations = [2, 100, 50, 10];
            const variation = Math.floor(Math.random() * variations[index]) - Math.floor(variations[index]/2);
            newValue = Math.max(0, baseValue + variation);
            
            if (index === 1) { // Total leads
                animateNumber(element, baseValue, newValue);
            } else {
                element.textContent = newValue.toLocaleString();
            }
        }
    });
}

// Number Animation
function animateNumber(element, start, end) {
    const duration = 1000;
    const startTime = Date.now();
    
    function update() {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        const current = Math.floor(start + (end - start) * progress);
        element.textContent = current.toLocaleString();
        
        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }
    
    update();
}

// Utility function for alerts (fallback if main showAlert doesn't exist)
function showAlert(message, type = 'info', allowHtml = false) {
    if (window.showAlert && typeof window.showAlert === 'function') {
        return window.showAlert(message, type, allowHtml);
    }
    
    // Fallback alert
    console.log(`Alert [${type}]: ${message}`);
    if (confirm) {
        alert(message.replace(/<[^>]*>/g, '')); // Strip HTML for fallback
    }
}

// Export functions for global access
window.initializeDashboard = initializeDashboard;
window.updateTrendsChart = updateTrendsChart;
window.updateKPIs = updateKPIs;
window.viewDetailedReport = viewDetailedReport;
window.createTargetedCampaign = createTargetedCampaign;