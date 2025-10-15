/**
 * Competitor Analysis Module - JavaScript
 * Handles competitor analysis functionality and interactions
 */

// Initialize Competitor Analysis
function initializeCompetitorAnalysis() {
    console.log('Initializing Competitor Analysis...');
    setupRadiusSlider();
    setupServiceFilter();
    setupMapInteractions();
    setupCompetitorActions();
    loadCompetitorData();
}

// Setup Radius Slider
function setupRadiusSlider() {
    const radiusSlider = document.getElementById('radiusSlider');
    const radiusValue = document.getElementById('radiusValue');
    
    if (radiusSlider && radiusValue) {
        radiusSlider.addEventListener('input', function() {
            radiusValue.textContent = this.value;
            updateSliderBackground(this);
            // Trigger map update with debounce
            clearTimeout(window.radiusUpdateTimeout);
            window.radiusUpdateTimeout = setTimeout(() => {
                updateCompetitorMap(this.value);
            }, 500);
        });
        
        // Initialize slider background
        updateSliderBackground(radiusSlider);
    }
}

// Update slider background color
function updateSliderBackground(slider) {
    const value = (slider.value - slider.min) / (slider.max - slider.min) * 100;
    slider.style.background = `linear-gradient(to right, #0066cc 0%, #0066cc ${value}%, #dee2e6 ${value}%, #dee2e6 100%)`;
}

// Setup Service Filter
function setupServiceFilter() {
    const serviceFilter = document.getElementById('serviceFilter');
    
    if (serviceFilter) {
        serviceFilter.addEventListener('change', function() {
            const selectedService = this.value;
            console.log('Service filter changed:', selectedService);
            filterCompetitorsByService(selectedService);
        });
    }
}

// Setup Map Interactions
function setupMapInteractions() {
    const refreshMapBtn = document.getElementById('refreshMapBtn');
    const exportMapBtn = document.getElementById('exportMapBtn');
    const competitorMap = document.getElementById('competitorMap');
    
    if (refreshMapBtn) {
        refreshMapBtn.addEventListener('click', function() {
            this.innerHTML = '<i class="fas fa-spinner fa-spin me-1"></i>Refreshing...';
            this.disabled = true;
            
            // Simulate map refresh
            setTimeout(() => {
                this.innerHTML = '<i class="fas fa-sync-alt me-1"></i>Refresh';
                this.disabled = false;
                showAlert('Competitor map refreshed successfully!', 'success');
            }, 2000);
        });
    }
    
    if (exportMapBtn) {
        exportMapBtn.addEventListener('click', function() {
            exportCompetitorMap();
        });
    }
    
    // Make map interactive
    if (competitorMap) {
        competitorMap.addEventListener('click', function() {
            if (!this.classList.contains('map-loaded')) {
                loadInteractiveMap();
            }
        });
    }
}

// Setup Competitor Actions
function setupCompetitorActions() {
    const viewAllBtn = document.getElementById('viewAllCompetitors');
    const addCompetitorBtn = document.getElementById('addCompetitorBtn');
    const generateReportBtn = document.getElementById('generateReportBtn');
    
    if (viewAllBtn) {
        viewAllBtn.addEventListener('click', function() {
            showAllCompetitors();
        });
    }
    
    if (addCompetitorBtn) {
        addCompetitorBtn.addEventListener('click', function() {
            showAddCompetitorModal();
        });
    }
    
    if (generateReportBtn) {
        generateReportBtn.addEventListener('click', function() {
            generateCompetitorReport();
        });
    }
}

// Load Competitor Data
function loadCompetitorData() {
    console.log('Loading competitor data...');
    // Simulate API call
    setTimeout(() => {
        updateCompetitorMetrics();
        console.log('Competitor data loaded successfully');
    }, 1000);
}

// Update Competitor Map
function updateCompetitorMap(radius) {
    console.log('Updating competitor map for radius:', radius + ' km');
    
    const mapContent = document.querySelector('.map-content');
    if (mapContent) {
        // Show loading state
        mapContent.querySelector('p').textContent = `Searching competitors within ${radius} km...`;
        mapContent.querySelector('.map-loading').classList.remove('d-none');
        
        // Simulate map update
        setTimeout(() => {
            mapContent.querySelector('p').textContent = 'Interactive competitor map will appear here';
            mapContent.querySelector('.map-loading').classList.add('d-none');
            updateCompetitorList(radius);
        }, 1500);
    }
}

// Filter Competitors by Service
function filterCompetitorsByService(service) {
    const competitorItems = document.querySelectorAll('.competitor-item[data-competitor]');
    
    competitorItems.forEach(item => {
        const competitorDetails = item.querySelector('.competitor-details small').textContent;
        const shouldShow = service === 'All Services' || competitorDetails.includes(service);
        
        if (shouldShow) {
            item.style.display = 'block';
            item.classList.add('filtered-in');
        } else {
            item.style.display = 'none';
            item.classList.remove('filtered-in');
        }
    });
    
    // Update competitor count
    const visibleCount = document.querySelectorAll('.competitor-item[data-competitor]:not([style*="display: none"])').length;
    console.log(`Showing ${visibleCount} competitors for service: ${service}`);
}

// Update Competitor List based on radius
function updateCompetitorList(radius) {
    const competitorItems = document.querySelectorAll('.competitor-item[data-competitor]');
    const radiusNum = parseInt(radius);
    
    competitorItems.forEach(item => {
        const distanceText = item.querySelector('.competitor-details small').textContent;
        const distance = parseFloat(distanceText.match(/(\d+\.?\d*)\s*km/)[1]);
        
        if (distance <= radiusNum) {
            item.style.display = 'block';
            item.classList.remove('out-of-range');
        } else {
            item.style.display = 'none';
            item.classList.add('out-of-range');
        }
    });
}

// View Competitor Details
function viewCompetitorDetails(competitorId) {
    console.log('Viewing details for competitor:', competitorId);
    
    const competitorData = getCompetitorData(competitorId);
    const modalContent = document.getElementById('competitorDetailsContent');
    
    if (modalContent) {
        modalContent.innerHTML = `
            <div class="row">
                <div class="col-md-6">
                    <h6>Hospital Information</h6>
                    <div class="info-group">
                        <strong>Name:</strong> ${competitorData.name}<br>
                        <strong>Distance:</strong> ${competitorData.distance}<br>
                        <strong>Specialties:</strong> ${competitorData.specialties}<br>
                        <strong>Rating:</strong> ${competitorData.rating}<br>
                        <strong>Reviews:</strong> ${competitorData.reviews}
                    </div>
                </div>
                <div class="col-md-6">
                    <h6>Marketing Metrics</h6>
                    <div class="info-group">
                        <strong>Online Presence:</strong> ${competitorData.onlinePresence}<br>
                        <strong>Social Media:</strong> ${competitorData.socialMedia}<br>
                        <strong>SEO Score:</strong> ${competitorData.seoScore}<br>
                        <strong>Ad Spend:</strong> ${competitorData.adSpend}<br>
                        <strong>Market Share:</strong> ${competitorData.marketShare}
                    </div>
                </div>
            </div>
            <div class="mt-3">
                <h6>Services Offered</h6>
                <div class="services-list">
                    ${competitorData.services.map(service => 
                        `<span class="badge bg-light text-dark me-1 mb-1">${service}</span>`
                    ).join('')}
                </div>
            </div>
        `;
        
        // Show modal
        const modal = new bootstrap.Modal(document.getElementById('competitorModal'));
        modal.show();
    }
}

// Compare Competitor
function compareCompetitor(competitorId) {
    console.log('Comparing with competitor:', competitorId);
    
    const competitorItem = document.querySelector(`[data-competitor="${competitorId}"]`);
    if (competitorItem) {
        competitorItem.classList.add('compared');
        
        // Add to comparison list
        addToComparisonList(competitorId);
        
        showAlert(`${getCompetitorData(competitorId).name} added to comparison`, 'success');
    }
}

// Get Competitor Data
function getCompetitorData(competitorId) {
    const competitorDatabase = {
        apollo: {
            name: 'Apollo Hospital',
            distance: '2.5 km',
            specialties: 'Multi-specialty',
            rating: '4.2★',
            reviews: '850+ Reviews',
            onlinePresence: 'Strong',
            socialMedia: '45k followers',
            seoScore: '85/100',
            adSpend: '₹2.5L/month',
            marketShare: '15%',
            services: ['Cardiology', 'Neurology', 'Oncology', 'Orthopedics', 'Emergency', 'ICU']
        },
        care: {
            name: 'Care Hospital',
            distance: '4.1 km',
            specialties: 'Cardiology Focus',
            rating: '4.0★',
            reviews: '520+ Reviews',
            onlinePresence: 'Moderate',
            socialMedia: '28k followers',
            seoScore: '72/100',
            adSpend: '₹1.8L/month',
            marketShare: '10%',
            services: ['Cardiology', 'Cardiac Surgery', 'Interventional Cardiology', 'Heart Transplant']
        },
        continental: {
            name: 'Continental Hospital',
            distance: '6.8 km',
            specialties: 'Specialty Care',
            rating: '3.9★',
            reviews: '340+ Reviews',
            onlinePresence: 'Moderate',
            socialMedia: '15k followers',
            seoScore: '68/100',
            adSpend: '₹1.2L/month',
            marketShare: '8%',
            services: ['Nephrology', 'Gastroenterology', 'Pulmonology', 'Endocrinology']
        }
    };
    
    return competitorDatabase[competitorId] || {};
}

// Load Interactive Map
function loadInteractiveMap() {
    const mapContainer = document.getElementById('competitorMap');
    if (mapContainer) {
        mapContainer.innerHTML = `
            <div class="interactive-map">
                <div class="map-controls">
                    <button class="btn btn-sm btn-outline-primary me-2">
                        <i class="fas fa-search-plus"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-primary me-2">
                        <i class="fas fa-search-minus"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-primary">
                        <i class="fas fa-crosshairs"></i>
                    </button>
                </div>
                <div class="map-markers">
                    <div class="marker your-hospital" style="top: 50%; left: 50%;">
                        <i class="fas fa-hospital text-primary"></i>
                        <span class="marker-label">Your Hospital</span>
                    </div>
                    <div class="marker competitor high" style="top: 30%; left: 60%;">
                        <i class="fas fa-circle text-danger"></i>
                        <span class="marker-label">Apollo Hospital</span>
                    </div>
                    <div class="marker competitor medium" style="top: 70%; left: 30%;">
                        <i class="fas fa-circle text-warning"></i>
                        <span class="marker-label">Care Hospital</span>
                    </div>
                    <div class="marker competitor low" style="top: 20%; left: 20%;">
                        <i class="fas fa-circle text-success"></i>
                        <span class="marker-label">Continental Hospital</span>
                    </div>
                </div>
            </div>
        `;
        
        mapContainer.classList.add('map-loaded');
        
        // Add map styles
        const mapStyles = `
            <style>
                .interactive-map {
                    position: relative;
                    width: 100%;
                    height: 100%;
                    background: linear-gradient(135deg, #e8f4f8 0%, #d1ecf1 100%);
                    border-radius: 8px;
                }
                .map-controls {
                    position: absolute;
                    top: 10px;
                    right: 10px;
                    z-index: 10;
                }
                .marker {
                    position: absolute;
                    transform: translate(-50%, -50%);
                    cursor: pointer;
                    transition: all 0.3s ease;
                }
                .marker:hover {
                    transform: translate(-50%, -50%) scale(1.2);
                }
                .marker-label {
                    position: absolute;
                    top: 25px;
                    left: 50%;
                    transform: translateX(-50%);
                    background: rgba(0, 0, 0, 0.8);
                    color: white;
                    padding: 4px 8px;
                    border-radius: 4px;
                    font-size: 11px;
                    white-space: nowrap;
                    opacity: 0;
                    transition: opacity 0.3s ease;
                }
                .marker:hover .marker-label {
                    opacity: 1;
                }
            </style>
        `;
        
        document.head.insertAdjacentHTML('beforeend', mapStyles);
    }
}

// Export Competitor Map
function exportCompetitorMap() {
    console.log('Exporting competitor map...');
    
    // Simulate export process
    showAlert('Preparing competitor map export...', 'info');
    
    setTimeout(() => {
        showAlert('Competitor map exported successfully!', 'success');
    }, 2000);
}

// Show All Competitors
function showAllCompetitors() {
    console.log('Showing all competitors...');
    // This would typically open a new page or modal with complete competitor list
    showAlert('All competitors view - Coming Soon!', 'info');
}

// Show Add Competitor Modal
function showAddCompetitorModal() {
    const modalContent = document.getElementById('competitorDetailsContent');
    
    if (modalContent) {
        modalContent.innerHTML = `
            <form id="addCompetitorForm">
                <div class="row">
                    <div class="col-md-6 mb-3">
                        <label class="form-label">Hospital Name</label>
                        <input type="text" class="form-control" required>
                    </div>
                    <div class="col-md-6 mb-3">
                        <label class="form-label">Distance (km)</label>
                        <input type="number" class="form-control" min="0" step="0.1" required>
                    </div>
                    <div class="col-md-6 mb-3">
                        <label class="form-label">Primary Specialty</label>
                        <select class="form-select" required>
                            <option value="">Select specialty...</option>
                            <option>Cardiology</option>
                            <option>Orthopedics</option>
                            <option>Neurology</option>
                            <option>Oncology</option>
                            <option>Pediatrics</option>
                            <option>Multi-specialty</option>
                        </select>
                    </div>
                    <div class="col-md-6 mb-3">
                        <label class="form-label">Competition Level</label>
                        <select class="form-select" required>
                            <option value="">Select level...</option>
                            <option value="high">High</option>
                            <option value="medium">Medium</option>
                            <option value="low">Low</option>
                        </select>
                    </div>
                </div>
                <div class="text-end">
                    <button type="button" class="btn btn-secondary me-2" data-bs-dismiss="modal">Cancel</button>
                    <button type="submit" class="btn btn-primary">Add Competitor</button>
                </div>
            </form>
        `;
        
        // Show modal
        const modal = new bootstrap.Modal(document.getElementById('competitorModal'));
        modal.show();
        
        // Handle form submission
        const form = document.getElementById('addCompetitorForm');
        if (form) {
            form.addEventListener('submit', function(e) {
                e.preventDefault();
                // Process form data
                modal.hide();
                showAlert('New competitor added successfully!', 'success');
            });
        }
    }
}

// Generate Competitor Report
function generateCompetitorReport() {
    console.log('Generating competitor report...');
    
    const btn = document.getElementById('generateReportBtn');
    if (btn) {
        const originalText = btn.innerHTML;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin me-1"></i>Generating...';
        btn.disabled = true;
        
        setTimeout(() => {
            btn.innerHTML = originalText;
            btn.disabled = false;
            showAlert('Competitor analysis report generated successfully!', 'success');
        }, 3000);
    }
}

// Add to Comparison List
function addToComparisonList(competitorId) {
    // Store in localStorage or memory for comparison
    let comparisonList = JSON.parse(localStorage.getItem('competitorComparison') || '[]');
    
    if (!comparisonList.includes(competitorId)) {
        comparisonList.push(competitorId);
        localStorage.setItem('competitorComparison', JSON.stringify(comparisonList));
    }
    
    console.log('Current comparison list:', comparisonList);
}

// Update Competitor Metrics
function updateCompetitorMetrics() {
    // Update summary statistics
    const summaryStats = document.querySelectorAll('.summary-stat .stat-value');
    if (summaryStats.length >= 4) {
        summaryStats[0].textContent = '12'; // Total Competitors
        summaryStats[1].textContent = document.getElementById('radiusValue').textContent + ' km radius'; // Market Coverage
        summaryStats[2].textContent = 'Medium-High'; // Competition Level
        summaryStats[3].textContent = '2 hours ago'; // Last Updated
    }
}

// Utility function to show alerts
function showAlert(message, type = 'info') {
    // Create alert element
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show position-fixed`;
    alertDiv.style.cssText = 'top: 20px; right: 20px; z-index: 9999; min-width: 300px;';
    alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    document.body.appendChild(alertDiv);
    
    // Auto dismiss after 3 seconds
    setTimeout(() => {
        if (alertDiv.parentNode) {
            alertDiv.remove();
        }
    }, 3000);
}