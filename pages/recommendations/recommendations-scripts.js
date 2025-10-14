// Recommendations Page Scripts

class RecommendationsPage {
    constructor() {
        this.recommendations = new Map();
        this.filters = {
            priority: 'all',
            category: 'all',
            status: 'active'
        };
        
        this.init();
    }
    
    init() {
        this.loadRecommendations();
        this.bindEvents();
        this.animateCounters();
        this.initTooltips();
    }
    
    loadRecommendations() {
        // In a real application, this would fetch from an API
        const mockRecommendations = [
            {
                id: 'critical-1',
                type: 'critical',
                title: 'Low Social Media Engagement',
                description: 'Your social media campaigns are showing 40% lower engagement rates compared to industry benchmarks.',
                impact: 'High - Potential 30% decrease in leads',
                effort: 'Medium - 2-3 weeks implementation',
                status: 'active',
                createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
                priority: 'critical'
            },
            {
                id: 'critical-2',
                type: 'critical',
                title: 'Website Conversion Rate Drop',
                description: 'Website conversion rate has dropped by 25% in the last week.',
                impact: 'Critical - Direct revenue impact',
                effort: 'Low - 1-2 days to investigate',
                status: 'active',
                createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
                priority: 'critical'
            },
            {
                id: 'opportunity-1',
                type: 'opportunity',
                title: 'Increase Cardiology Campaign Budget',
                description: 'Your cardiology campaigns are performing 45% above average.',
                roi: '320% return on investment',
                timeline: 'Immediate',
                status: 'active',
                createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
                priority: 'high'
            }
        ];
        
        mockRecommendations.forEach(rec => {
            this.recommendations.set(rec.id, rec);
        });
    }
    
    bindEvents() {
        // Filter events
        document.getElementById('priorityFilter')?.addEventListener('change', (e) => {
            this.filters.priority = e.target.value;
            this.filterRecommendations();
        });
        
        // Refresh button
        document.getElementById('refreshRecommendations')?.addEventListener('click', () => {
            this.refreshRecommendations();
        });
        
        // Action buttons
        document.addEventListener('click', (e) => {
            if (e.target.closest('.accept-btn')) {
                this.handleAcceptAction(e.target.closest('.accept-btn'));
            } else if (e.target.closest('.dismiss-btn')) {
                this.handleDismissAction(e.target.closest('.dismiss-btn'));
            }
        });
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey || e.metaKey) {
                switch (e.key) {
                    case 'r':
                        e.preventDefault();
                        this.refreshRecommendations();
                        break;
                    case 'f':
                        e.preventDefault();
                        document.getElementById('priorityFilter')?.focus();
                        break;
                }
            }
        });
    }
    
    animateCounters() {
        const counters = document.querySelectorAll('.summary-count');
        
        counters.forEach((counter, index) => {
            setTimeout(() => {
                const target = parseInt(counter.textContent);
                let current = 0;
                const increment = target / 30;
                
                const timer = setInterval(() => {
                    current += increment;
                    if (current >= target) {
                        current = target;
                        clearInterval(timer);
                    }
                    counter.textContent = Math.round(current);
                }, 50);
            }, index * 200);
        });
    }
    
    handleAcceptAction(button) {
        const recommendationItem = button.closest('.recommendation-item');
        const recommendationId = recommendationItem.getAttribute('data-id');
        const title = recommendationItem.querySelector('.recommendation-title').textContent;
        const type = button.textContent.trim();
        
        // Show confirmation modal
        this.showActionModal(recommendationId, title, type, 'accept');
    }
    
    handleDismissAction(button) {
        const recommendationItem = button.closest('.recommendation-item');
        const recommendationId = recommendationItem.getAttribute('data-id');
        const title = recommendationItem.querySelector('.recommendation-title').textContent;
        const type = button.textContent.trim();
        
        // Show confirmation modal
        this.showActionModal(recommendationId, title, type, 'dismiss');
    }
    
    showActionModal(recommendationId, title, actionType, action) {
        const modal = document.getElementById('actionModal');
        const modalTitle = document.getElementById('actionModalTitle');
        const modalBody = document.getElementById('actionModalBody');
        const confirmBtn = document.getElementById('confirmActionBtn');
        
        modalTitle.textContent = `${action === 'accept' ? 'Confirm' : 'Dismiss'} Action`;
        
        modalBody.innerHTML = `
            <div class="mb-3">
                <h6>Recommendation:</h6>
                <p class="text-muted">${title}</p>
            </div>
            <div class="mb-3">
                <h6>Action:</h6>
                <p class="text-muted">${actionType}</p>
            </div>
            <div class="alert alert-${action === 'accept' ? 'success' : 'warning'} alert-sm">
                <i class="fas fa-${action === 'accept' ? 'check' : 'exclamation-triangle'} me-2"></i>
                ${action === 'accept' 
                    ? 'This will implement the recommended action and mark it as complete.' 
                    : 'This will dismiss the recommendation and remove it from your active list.'}
            </div>
        `;
        
        confirmBtn.className = `btn btn-${action === 'accept' ? 'success' : 'warning'}`;
        confirmBtn.textContent = action === 'accept' ? 'Implement' : 'Dismiss';
        
        // Handle confirmation
        confirmBtn.onclick = () => {
            this.executeAction(recommendationId, action);
            bootstrap.Modal.getInstance(modal).hide();
        };
        
        new bootstrap.Modal(modal).show();
    }
    
    executeAction(recommendationId, action) {
        const recommendationItem = document.querySelector(`[data-id="${recommendationId}"]`);
        const title = recommendationItem.querySelector('.recommendation-title').textContent;
        
        // Show processing state
        recommendationItem.classList.add('processing');
        
        // Simulate API call
        setTimeout(() => {
            recommendationItem.classList.remove('processing');
            
            if (action === 'accept') {
                // Mark as completed
                recommendationItem.classList.add('completed');
                
                // Update recommendation in data
                if (this.recommendations.has(recommendationId)) {
                    const rec = this.recommendations.get(recommendationId);
                    rec.status = 'completed';
                    rec.completedAt = new Date();
                }
                
                // Show success message
                window.MarketingApp.showToast(`Successfully implemented: ${title}`, 'success');
                
                // Create follow-up tasks or navigate to relevant page
                this.createFollowUpTasks(recommendationId);
                
            } else {
                // Remove the recommendation item with animation
                recommendationItem.style.transition = 'all 0.5s ease';
                recommendationItem.style.opacity = '0';
                recommendationItem.style.transform = 'translateX(-100%)';
                
                setTimeout(() => {
                    recommendationItem.remove();
                }, 500);
                
                // Update recommendation in data
                if (this.recommendations.has(recommendationId)) {
                    const rec = this.recommendations.get(recommendationId);
                    rec.status = 'dismissed';
                    rec.dismissedAt = new Date();
                }
                
                // Show info message
                window.MarketingApp.showToast(`Dismissed: ${title}`, 'info');
            }
            
            // Update counters
            this.updateSummaryCounts();
            
        }, 1500);
    }
    
    createFollowUpTasks(recommendationId) {
        // This would create relevant tasks or redirect to appropriate pages
        const recommendation = this.recommendations.get(recommendationId);
        
        if (recommendation) {
            switch (recommendation.type) {
                case 'critical':
                    // Create urgent tasks or redirect to campaigns
                    setTimeout(() => {
                        if (confirm('Would you like to create a new campaign to address this issue?')) {
                            window.location.href = '../campaigns/campaigns.html';
                        }
                    }, 1000);
                    break;
                    
                case 'opportunity':
                    // Redirect to budget management or campaign creation
                    setTimeout(() => {
                        if (confirm('Would you like to adjust campaign budgets now?')) {
                            window.location.href = '../campaigns/campaigns.html';
                        }
                    }, 1000);
                    break;
                    
                case 'pending':
                    // Mark in todo system or calendar
                    window.MarketingApp.showToast('Task added to your to-do list', 'info');
                    break;
            }
        }
    }
    
    filterRecommendations() {
        const items = document.querySelectorAll('.recommendation-item');
        
        items.forEach(item => {
            const shouldShow = this.shouldShowRecommendation(item);
            
            if (shouldShow) {
                item.style.display = 'block';
                item.style.animation = 'slideInUp 0.3s ease-out';
            } else {
                item.style.display = 'none';
            }
        });
        
        // Update counters based on filtered results
        this.updateSummaryCounts();
    }
    
    shouldShowRecommendation(item) {
        const itemClasses = item.classList;
        
        // Priority filter
        if (this.filters.priority !== 'all') {
            const priorityMap = {
                'critical': 'critical',
                'high': 'opportunity',
                'medium': 'pending',
                'low': 'insight'
            };
            
            if (!itemClasses.contains(priorityMap[this.filters.priority])) {
                return false;
            }
        }
        
        // Status filter (active recommendations only by default)
        if (this.filters.status === 'active' && itemClasses.contains('completed')) {
            return false;
        }
        
        return true;
    }
    
    updateSummaryCounts() {
        const counts = {
            critical: document.querySelectorAll('.recommendation-item.critical:not([style*="display: none"])').length,
            opportunity: document.querySelectorAll('.recommendation-item.opportunity:not([style*="display: none"])').length,
            pending: document.querySelectorAll('.recommendation-item.pending:not([style*="display: none"])').length,
            insight: document.querySelectorAll('.recommendation-item.insight:not([style*="display: none"])').length
        };
        
        document.querySelector('.critical-summary .summary-count').textContent = counts.critical;
        document.querySelector('.opportunity-summary .summary-count').textContent = counts.opportunity;
        document.querySelector('.action-summary .summary-count').textContent = counts.pending;
        document.querySelector('.insight-summary .summary-count').textContent = counts.insight;
    }
    
    refreshRecommendations() {
        const refreshBtn = document.getElementById('refreshRecommendations');
        const originalText = refreshBtn.innerHTML;
        
        // Show loading state
        refreshBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-1"></i> Refreshing...';
        refreshBtn.disabled = true;
        
        // Simulate refresh
        setTimeout(() => {
            // Restore button
            refreshBtn.innerHTML = originalText;
            refreshBtn.disabled = false;
            
            // Show notification
            window.MarketingApp.showToast('Recommendations updated', 'success');
            
            // Simulate new recommendations (in real app, would fetch from API)
            this.simulateNewRecommendations();
            
        }, 2000);
    }
    
    simulateNewRecommendations() {
        // This would typically fetch new data from the server
        // For demo purposes, we'll just update timestamps and maybe add a new item
        
        const newRecommendation = document.createElement('div');
        newRecommendation.className = 'recommendation-item insight';
        newRecommendation.setAttribute('data-id', 'insight-new');
        newRecommendation.innerHTML = `
            <div class="recommendation-header">
                <div class="d-flex justify-content-between align-items-start">
                    <div>
                        <h6 class="recommendation-title">New Market Opportunity</h6>
                        <div class="recommendation-meta">
                            <span class="badge bg-info">New Insight</span>
                            <span class="recommendation-date">Just now</span>
                        </div>
                    </div>
                    <div class="recommendation-actions">
                        <button class="btn btn-sm btn-outline-info accept-btn">
                            <i class="fas fa-eye me-1"></i>Explore
                        </button>
                        <button class="btn btn-sm btn-outline-secondary dismiss-btn">
                            <i class="fas fa-clock me-1"></i>Later
                        </button>
                    </div>
                </div>
            </div>
            <div class="recommendation-content">
                <p class="recommendation-description">
                    Market analysis shows emerging demand for telemedicine services in your area. 
                    Consider developing targeted campaigns for remote health consultations.
                </p>
            </div>
        `;
        
        // Add to insights section
        const insightsGrid = document.querySelector('.bg-info').closest('.recommendation-section').querySelector('.recommendation-grid');
        insightsGrid.appendChild(newRecommendation);
        
        // Update counter
        this.updateSummaryCounts();
        
        // Animate new item
        newRecommendation.style.opacity = '0';
        newRecommendation.style.transform = 'translateY(20px)';
        setTimeout(() => {
            newRecommendation.style.transition = 'all 0.5s ease';
            newRecommendation.style.opacity = '1';
            newRecommendation.style.transform = 'translateY(0)';
        }, 100);
    }
    
    initTooltips() {
        // Initialize Bootstrap tooltips for action buttons
        const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
        tooltipTriggerList.map(function (tooltipTriggerEl) {
            return new bootstrap.Tooltip(tooltipTriggerEl);
        });
    }
    
    // Export recommendations data (for reports)
    exportRecommendations() {
        const data = Array.from(this.recommendations.values());
        const csv = this.convertToCSV(data);
        this.downloadCSV(csv, 'recommendations-export.csv');
    }
    
    convertToCSV(data) {
        const headers = ['ID', 'Type', 'Title', 'Priority', 'Status', 'Created At'];
        const rows = data.map(rec => [
            rec.id,
            rec.type,
            rec.title,
            rec.priority,
            rec.status,
            rec.createdAt.toISOString()
        ]);
        
        return [headers, ...rows].map(row => row.join(',')).join('\n');
    }
    
    downloadCSV(csv, filename) {
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.setAttribute('hidden', '');
        a.setAttribute('href', url);
        a.setAttribute('download', filename);
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }
}

// Initialize recommendations page when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const recommendationsPage = new RecommendationsPage();
    
    // Make instance globally available for debugging
    window.recommendationsPage = recommendationsPage;
});