/**
 * Recommendations Module - JavaScript  
 * Handles AI recommendations, insights, and task management functionality
 */

// Initialize Recommendations
function initializeRecommendations() {
    console.log('Initializing Recommendations...');
    setupRecommendationFilters();
    setupRecommendationActions();
    setupTodoManagement();
    setupInsightActions();
    setupQuickActions();
    loadRecommendationData();
}

// Setup Recommendation Filters
function setupRecommendationFilters() {
    const filterButtons = document.querySelectorAll('input[name="recFilter"]');
    const sortDropdown = document.getElementById('sortRecommendations');
    
    filterButtons.forEach(button => {
        button.addEventListener('change', function() {
            const filterType = this.id;
            console.log('Filter changed to:', filterType);
            filterRecommendations(filterType);
        });
    });
    
    if (sortDropdown) {
        sortDropdown.addEventListener('change', function() {
            const sortType = this.value;
            console.log('Sort changed to:', sortType);
            sortRecommendations(sortType);
        });
    }
}

// Setup Recommendation Actions
function setupRecommendationActions() {
    const refreshBtn = document.getElementById('refreshAnalysisBtn');
    
    if (refreshBtn) {
        refreshBtn.addEventListener('click', function() {
            refreshAnalysis();
        });
    }
    
    // Setup solve issue buttons
    const solveButtons = document.querySelectorAll('.solve-issue-btn');
    solveButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const issue = this.getAttribute('data-issue');
            solveIssue(issue);
        });
    });
    
    // Setup create opportunity buttons
    const opportunityButtons = document.querySelectorAll('.create-opportunity-btn');
    opportunityButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const opportunity = this.getAttribute('data-opportunity');
            createOpportunity(opportunity);
        });
    });
}

// Setup Todo Management
function setupTodoManagement() {
    const todoCheckboxes = document.querySelectorAll('.todo-item input[type="checkbox"]');
    const completeTodoButtons = document.querySelectorAll('.complete-todo-btn');
    
    todoCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            const todoItem = this.closest('.todo-item');
            if (this.checked) {
                todoItem.classList.add('completed');
                updateTaskStats('completed');
            } else {
                todoItem.classList.remove('completed');
                updateTaskStats('uncompleted');
            }
        });
    });
    
    completeTodoButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const todoId = this.getAttribute('data-todo');
            completeTodo(todoId);
        });
    });
}

// Setup Insight Actions
function setupInsightActions() {
    const insightButtons = document.querySelectorAll('.act-on-insight-btn');
    
    insightButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const insight = this.getAttribute('data-insight');
            actOnInsight(insight);
        });
    });
}

// Setup Quick Actions
function setupQuickActions() {
    const addTaskBtn = document.getElementById('addNewTaskBtn');
    const viewCalendarBtn = document.getElementById('viewCalendarBtn');
    const exportReportBtn = document.getElementById('exportReportBtn');
    
    if (addTaskBtn) {
        addTaskBtn.addEventListener('click', function() {
            showAddTaskModal();
        });
    }
    
    if (viewCalendarBtn) {
        viewCalendarBtn.addEventListener('click', function() {
            openCalendarView();
        });
    }
    
    if (exportReportBtn) {
        exportReportBtn.addEventListener('click', function() {
            exportRecommendationsReport();
        });
    }
}

// Load Recommendation Data
function loadRecommendationData() {
    console.log('Loading recommendation data...');
    // Simulate API call to load latest recommendations
    setTimeout(() => {
        updateRecommendationStats();
        console.log('Recommendation data loaded successfully');
    }, 1000);
}

// Filter Recommendations
function filterRecommendations(filterType) {
    const categories = document.querySelectorAll('.recommendation-category');
    
    categories.forEach(category => {
        const categoryTitle = category.querySelector('.category-header h5').textContent.toLowerCase();
        let shouldShow = false;
        
        switch(filterType) {
            case 'all-recs':
                shouldShow = true;
                break;
            case 'critical-recs':
                shouldShow = categoryTitle.includes('critical');
                break;
            case 'opportunities-recs':
                shouldShow = categoryTitle.includes('opportunities');
                break;
            case 'actions-recs':
                shouldShow = categoryTitle.includes('pending actions');
                break;
        }
        
        if (shouldShow) {
            category.style.display = 'block';
            category.classList.add('fade-in');
        } else {
            category.style.display = 'none';
            category.classList.remove('fade-in');
        }
    });
}

// Sort Recommendations
function sortRecommendations(sortType) {
    console.log('Sorting recommendations by:', sortType);
    
    const categories = document.querySelectorAll('.recommendation-category');
    
    categories.forEach(category => {
        const cards = Array.from(category.querySelectorAll('.recommendation-card'));
        
        cards.sort((a, b) => {
            switch(sortType) {
                case 'Sort by Priority':
                    return getPriorityValue(a) - getPriorityValue(b);
                case 'Sort by Impact':
                    return getImpactValue(b) - getImpactValue(a);
                case 'Sort by Date':
                    return getDateValue(a) - getDateValue(b);
                default:
                    return 0;
            }
        });
        
        // Re-append sorted cards
        const container = category.querySelector('.row');
        cards.forEach(card => {
            container.appendChild(card.parentElement);
        });
    });
}

// Refresh Analysis
function refreshAnalysis() {
    const btn = document.getElementById('refreshAnalysisBtn');
    if (btn) {
        const originalText = btn.innerHTML;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin me-1"></i>Refreshing...';
        btn.disabled = true;
        
        // Simulate analysis refresh
        setTimeout(() => {
            btn.innerHTML = originalText;
            btn.disabled = false;
            
            // Update stats with new data
            updateRecommendationStats();
            showAlert('AI analysis refreshed with latest data!', 'success');
        }, 3000);
    }
}

// Solve Issue
function solveIssue(issue) {
    console.log('Solving issue:', issue);
    
    const btn = document.querySelector(`[data-issue="${issue}"]`);
    if (btn) {
        const card = btn.closest('.recommendation-card');
        card.classList.add('loading');
        
        const originalText = btn.innerHTML;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin me-1"></i>Processing...';
        btn.disabled = true;
        
        // Simulate solving the issue
        setTimeout(() => {
            card.classList.remove('loading');
            card.classList.add('completed');
            btn.innerHTML = '<i class="fas fa-check me-1"></i>Completed';
            btn.classList.remove('btn-danger');
            btn.classList.add('btn-success');
            
            showAlert(getIssueMessage(issue), 'success');
            updateRecommendationStats();
        }, 2500);
    }
}

// Create Opportunity
function createOpportunity(opportunity) {
    console.log('Creating opportunity:', opportunity);
    
    const btn = document.querySelector(`[data-opportunity="${opportunity}"]`);
    if (btn) {
        const card = btn.closest('.recommendation-card');
        card.classList.add('loading');
        
        const originalText = btn.innerHTML;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin me-1"></i>Creating...';
        btn.disabled = true;
        
        // Simulate creating campaign
        setTimeout(() => {
            card.classList.remove('loading');
            btn.innerHTML = '<i class="fas fa-check me-1"></i>Campaign Created';
            btn.classList.add('btn-outline-success');
            
            showAlert(getOpportunityMessage(opportunity), 'success');
        }, 2000);
    }
}

// Complete Todo
function completeTodo(todoId) {
    console.log('Completing todo:', todoId);
    
    const btn = document.querySelector(`[data-todo="${todoId}"]`);
    if (btn) {
        const todoItem = btn.closest('.todo-item');
        const checkbox = todoItem.querySelector('input[type="checkbox"]');
        
        // Mark as loading
        btn.innerHTML = '<i class="fas fa-spinner fa-spin me-1"></i>Processing...';
        btn.disabled = true;
        
        setTimeout(() => {
            checkbox.checked = true;
            todoItem.classList.add('completed');
            btn.innerHTML = '<i class="fas fa-check me-1"></i>Completed';
            btn.classList.remove('btn-warning');
            btn.classList.add('btn-success');
            
            updateTaskStats('completed');
            showAlert(getTodoMessage(todoId), 'success');
        }, 1500);
    }
}

// Act on Insight
function actOnInsight(insight) {
    console.log('Acting on insight:', insight);
    
    const btn = document.querySelector(`[data-insight="${insight}"]`);
    if (btn) {
        const card = btn.closest('.insight-card');
        
        btn.innerHTML = '<i class="fas fa-spinner fa-spin me-1"></i>Implementing...';
        btn.disabled = true;
        
        setTimeout(() => {
            btn.innerHTML = '<i class="fas fa-check me-1"></i>Implemented';
            btn.classList.add('btn-outline-success');
            card.style.opacity = '0.7';
            
            showAlert(getInsightMessage(insight), 'success');
        }, 2000);
    }
}

// Show Add Task Modal
function showAddTaskModal() {
    const modalHtml = `
        <div class="modal fade" id="addTaskModal" tabindex="-1">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Add New Task</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <form id="addTaskForm">
                            <div class="mb-3">
                                <label class="form-label">Task Title</label>
                                <input type="text" class="form-control" required>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Description</label>
                                <textarea class="form-control" rows="3"></textarea>
                            </div>
                            <div class="row">
                                <div class="col-md-6 mb-3">
                                    <label class="form-label">Priority</label>
                                    <select class="form-select" required>
                                        <option value="">Select priority...</option>
                                        <option value="high">High</option>
                                        <option value="medium">Medium</option>
                                        <option value="low">Low</option>
                                    </select>
                                </div>
                                <div class="col-md-6 mb-3">
                                    <label class="form-label">Due Date</label>
                                    <input type="date" class="form-control">
                                </div>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                        <button type="submit" form="addTaskForm" class="btn btn-primary">Add Task</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Remove existing modal if any
    const existingModal = document.getElementById('addTaskModal');
    if (existingModal) {
        existingModal.remove();
    }
    
    // Add modal to body
    document.body.insertAdjacentHTML('beforeend', modalHtml);
    
    // Show modal
    const modal = new bootstrap.Modal(document.getElementById('addTaskModal'));
    modal.show();
    
    // Handle form submission
    document.getElementById('addTaskForm').addEventListener('submit', function(e) {
        e.preventDefault();
        modal.hide();
        showAlert('New task added successfully!', 'success');
        updateTaskStats('added');
    });
}

// Open Calendar View
function openCalendarView() {
    console.log('Opening calendar view...');
    showAlert('Calendar integration - Coming Soon!', 'info');
}

// Export Recommendations Report
function exportRecommendationsReport() {
    const btn = document.getElementById('exportReportBtn');
    if (btn) {
        const originalText = btn.innerHTML;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin me-1"></i>Generating...';
        btn.disabled = true;
        
        setTimeout(() => {
            btn.innerHTML = originalText;
            btn.disabled = false;
            showAlert('Recommendations report exported successfully!', 'success');
        }, 2500);
    }
}

// Update Recommendation Stats
function updateRecommendationStats() {
    const statCards = document.querySelectorAll('.recommendation-stat-card');
    
    statCards.forEach(card => {
        const statValue = card.querySelector('h3');
        const currentValue = parseInt(statValue.textContent);
        
        if (card.classList.contains('critical')) {
            animateStatValue(statValue, currentValue, Math.max(0, currentValue - 1));
        } else if (card.classList.contains('opportunities')) {
            animateStatValue(statValue, currentValue, currentValue + Math.floor(Math.random() * 3));
        }
    });
}

// Update Task Stats
function updateTaskStats(action) {
    const taskStatsItems = document.querySelectorAll('.task-stats .stat-item strong');
    
    switch(action) {
        case 'completed':
            const completedStat = document.querySelector('.task-stats .text-success');
            if (completedStat) {
                const current = parseInt(completedStat.textContent);
                completedStat.textContent = current + 1;
            }
            
            const overdueStat = document.querySelector('.task-stats .text-danger');
            if (overdueStat && parseInt(overdueStat.textContent) > 0) {
                const current = parseInt(overdueStat.textContent);
                overdueStat.textContent = Math.max(0, current - 1);
            }
            
            updateProgressBar();
            break;
            
        case 'added':
            const totalStat = taskStatsItems[0];
            if (totalStat) {
                const current = parseInt(totalStat.textContent);
                totalStat.textContent = current + 1;
            }
            break;
    }
}

// Update Progress Bar
function updateProgressBar() {
    const progressBar = document.querySelector('.progress-bar');
    const progressText = document.querySelector('.progress-section small');
    
    if (progressBar && progressText) {
        const currentWidth = parseInt(progressBar.style.width);
        const newWidth = Math.min(currentWidth + 5, 100);
        
        progressBar.style.width = newWidth + '%';
        progressText.textContent = `${newWidth}% completed this week`;
    }
}

// Animate Stat Value
function animateStatValue(element, from, to) {
    const duration = 1000;
    const startTime = performance.now();
    
    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        const current = Math.round(from + (to - from) * progress);
        element.textContent = current;
        
        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }
    
    requestAnimationFrame(update);
}

// Helper Functions
function getPriorityValue(card) {
    const badge = card.querySelector('.badge');
    if (!badge) return 999;
    
    const priority = badge.textContent.toLowerCase();
    if (priority.includes('critical')) return 1;
    if (priority.includes('high')) return 2;
    if (priority.includes('medium')) return 3;
    return 4;
}

function getImpactValue(card) {
    const impactText = card.querySelector('.rec-impact small');
    if (!impactText) return 0;
    
    const match = impactText.textContent.match(/₹([\d.]+)L/);
    return match ? parseFloat(match[1]) : 0;
}

function getDateValue(card) {
    // Mock implementation - would use actual dates in real app
    return Math.random();
}

function getIssueMessage(issue) {
    const messages = {
        'mobile-optimization': 'Mobile optimization strategy implemented! Expected revenue increase: ₹3.2L/month',
        'instagram-setup': 'Instagram marketing campaign launched! Content calendar created for next 30 days',
    };
    return messages[issue] || 'Issue resolved successfully!';
}

function getOpportunityMessage(opportunity) {
    const messages = {
        'telemedicine': 'Telemedicine campaign created! Targeting 800-1200 leads with 320% ROI projection',
        'seasonal-cardiac': 'Winter cardiac health campaign launched! Targeting patients 45+ with screening packages',
        'referral-program': 'Patient referral program activated! Incentive structure and tracking system implemented',
    };
    return messages[opportunity] || 'Campaign created successfully!';
}

function getTodoMessage(todoId) {
    const messages = {
        'asset-approval': 'Campaign assets reviewed and approved! Marketing team notified to proceed',
        'budget-update': 'Google Ads budget updated! Cardiology campaign increased by 25%',
        'social-scheduling': 'Social media posts scheduled for next week! 7 posts across Facebook and Instagram',
    };
    return messages[todoId] || 'Task completed successfully!';
}

function getInsightMessage(insight) {
    const messages = {
        'orthopedic-demand': 'Orthopedic campaign prepared! Targeting winter sports season with 40% demand increase',
        'scheduling-optimization': 'Ad scheduling optimized! Monday morning slots prioritized for 35-50 age group',
    };
    return messages[insight] || 'AI insight implemented successfully!';
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
    
    // Auto dismiss after 4 seconds
    setTimeout(() => {
        if (alertDiv.parentNode) {
            alertDiv.remove();
        }
    }, 4000);
}