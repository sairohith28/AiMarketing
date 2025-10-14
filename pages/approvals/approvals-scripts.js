class ApprovalsPage {
    constructor() {
        this.approvals = [];
        this.filteredApprovals = [];
        this.currentTab = 'pending';
        this.currentApproval = null;
        this.filters = {
            status: '',
            priority: ''
        };
        this.init();
    }

    init() {
        this.generateSampleApprovals();
        this.initializeEventHandlers();
        this.renderApprovals();
        this.updateStats();
    }

    generateSampleApprovals() {
        const types = ['campaign', 'content', 'budget', 'asset', 'strategy'];
        const priorities = ['high', 'medium', 'low'];
        const statuses = ['pending', 'approved', 'rejected', 'revision'];
        const approvers = ['marketing-director', 'medical-director', 'ceo', 'compliance'];
        const requesters = ['John Doe', 'Jane Smith', 'Mike Johnson', 'Sarah Wilson', 'David Brown'];

        this.approvals = Array.from({ length: 25 }, (_, i) => {
            const type = types[Math.floor(Math.random() * types.length)];
            const priority = priorities[Math.floor(Math.random() * priorities.length)];
            const status = i < 12 ? 'pending' : statuses[Math.floor(Math.random() * statuses.length)];
            const requester = requesters[Math.floor(Math.random() * requesters.length)];
            const approver = approvers[Math.floor(Math.random() * approvers.length)];
            
            const createdDate = new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000);
            const dueDate = new Date(createdDate.getTime() + (Math.random() * 14 + 1) * 24 * 60 * 60 * 1000);
            const isOverdue = status === 'pending' && dueDate < new Date();

            return {
                id: i + 1,
                type: type,
                title: this.generateTitle(type, i + 1),
                description: this.generateDescription(type),
                priority: priority,
                status: status,
                requester: requester,
                approver: this.formatApprover(approver),
                createdDate: createdDate,
                dueDate: dueDate,
                isOverdue: isOverdue,
                attachments: this.generateAttachments(),
                timeline: this.generateTimeline(status, requester, createdDate),
                comments: []
            };
        });

        this.filteredApprovals = [...this.approvals];
    }

    generateTitle(type, id) {
        const titles = {
            campaign: [
                'Q4 Cardiology Campaign Launch',
                'Emergency Department Awareness Drive',
                'Women\'s Health Month Campaign',
                'Pediatric Care Marketing Initiative',
                'Mental Health Awareness Campaign'
            ],
            content: [
                'Patient Testimonial Video Publication',
                'Blog Post: "Heart Health Tips"',
                'Social Media Content Calendar',
                'Website Banner Update',
                'Newsletter Content Approval'
            ],
            budget: [
                'Digital Marketing Budget Increase',
                'Q1 Advertising Spend Allocation',
                'Conference Sponsorship Investment',
                'SEO Tool Subscription Renewal',
                'Video Production Budget Request'
            ],
            asset: [
                'Hospital Exterior Photography Usage',
                'Doctor Portrait License Agreement',
                'Brand Logo Modification Rights',
                'Stock Image Purchase Approval',
                'Video Content Usage Rights'
            ],
            strategy: [
                'Target Audience Expansion Strategy',
                'Competitor Analysis Approach',
                'Brand Messaging Update',
                'Channel Mix Optimization',
                'Patient Journey Mapping Update'
            ]
        };

        const typeOptions = titles[type] || ['Generic Request'];
        return typeOptions[id % typeOptions.length];
    }

    generateDescription(type) {
        const descriptions = {
            campaign: 'Requesting approval to launch a comprehensive marketing campaign targeting specific patient demographics with allocated budget and timeline.',
            content: 'Seeking approval for content publication across digital channels including website, social media, and email marketing platforms.',
            budget: 'Requesting budget approval for marketing initiatives with detailed cost breakdown and expected ROI projections.',
            asset: 'Requesting permission to use specific marketing assets including images, videos, and branded materials in campaigns.',
            strategy: 'Proposing strategic changes to marketing approach requiring stakeholder approval and implementation planning.'
        };

        return descriptions[type] || 'General approval request requiring stakeholder review and decision.';
    }

    formatApprover(approver) {
        const formatMap = {
            'marketing-director': 'Marketing Director',
            'medical-director': 'Medical Director',
            'ceo': 'Chief Executive Officer',
            'compliance': 'Compliance Officer'
        };
        return formatMap[approver] || approver;
    }

    generateAttachments() {
        const attachments = [
            { name: 'Campaign_Brief.pdf', size: '2.4 MB', type: 'pdf' },
            { name: 'Budget_Breakdown.xlsx', size: '156 KB', type: 'excel' },
            { name: 'Creative_Mockups.zip', size: '8.7 MB', type: 'zip' },
            { name: 'Market_Research.docx', size: '1.2 MB', type: 'doc' },
            { name: 'ROI_Projections.pdf', size: '890 KB', type: 'pdf' }
        ];

        const count = Math.floor(Math.random() * 3) + 1;
        return attachments.slice(0, count);
    }

    generateTimeline(status, requester, createdDate) {
        const timeline = [
            {
                action: 'Request Created',
                user: requester,
                date: createdDate,
                comment: 'Initial approval request submitted with all required documentation.'
            }
        ];

        if (status !== 'pending') {
            const actionDate = new Date(createdDate.getTime() + Math.random() * 7 * 24 * 60 * 60 * 1000);
            let action = '';
            let comment = '';

            switch (status) {
                case 'approved':
                    action = 'Request Approved';
                    comment = 'Approval granted. Proceed with implementation as outlined.';
                    break;
                case 'rejected':
                    action = 'Request Rejected';
                    comment = 'Request denied due to budget constraints and strategic priorities.';
                    break;
                case 'revision':
                    action = 'Revision Requested';
                    comment = 'Please provide additional information and revised budget projections.';
                    break;
            }

            timeline.push({
                action: action,
                user: 'Marketing Director',
                date: actionDate,
                comment: comment
            });
        }

        return timeline;
    }

    initializeEventHandlers() {
        // Tab navigation
        document.querySelectorAll('#approvalTabs .nav-link').forEach(tab => {
            tab.addEventListener('shown.bs.tab', (e) => {
                this.currentTab = e.target.getAttribute('href').replace('#', '').replace('-tab', '');
                this.renderApprovals();
            });
        });

        // Filters
        document.getElementById('statusFilter').addEventListener('change', (e) => {
            this.filters.status = e.target.value;
            this.applyFilters();
        });

        document.getElementById('priorityFilter').addEventListener('change', (e) => {
            this.filters.priority = e.target.value;
            this.applyFilters();
        });

        // New approval request
        document.getElementById('newApprovalBtn').addEventListener('click', () => {
            this.showNewApprovalModal();
        });

        document.getElementById('submitApprovalBtn').addEventListener('click', () => {
            this.submitNewApproval();
        });

        // Approval actions
        document.getElementById('submitActionBtn').addEventListener('click', () => {
            this.submitApprovalAction();
        });

        // Action select change
        document.getElementById('actionSelect').addEventListener('change', (e) => {
            this.toggleConditionsSection(e.target.value);
        });

        // Set default due date for new requests
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 7);
        document.querySelector('[name="dueDate"]').value = tomorrow.toISOString().split('T')[0];
    }

    applyFilters() {
        this.filteredApprovals = this.approvals.filter(approval => {
            if (this.filters.status && approval.status !== this.filters.status) {
                return false;
            }
            if (this.filters.priority && approval.priority !== this.filters.priority) {
                return false;
            }
            return true;
        });

        this.renderApprovals();
    }

    renderApprovals() {
        const tabData = this.getTabData();
        const container = this.getTabContainer();
        
        container.innerHTML = '';

        if (tabData.length === 0) {
            container.appendChild(this.createEmptyState());
            return;
        }

        tabData.forEach(approval => {
            const item = this.createApprovalItem(approval);
            container.appendChild(item);
        });
    }

    getTabData() {
        switch (this.currentTab) {
            case 'pending':
                return this.filteredApprovals.filter(a => a.status === 'pending');
            case 'my-requests':
                return this.filteredApprovals.filter(a => a.requester === 'John Doe'); // Current user
            case 'approved':
                return this.filteredApprovals.filter(a => a.status === 'approved');
            case 'history':
                return this.filteredApprovals.filter(a => a.status !== 'pending');
            default:
                return this.filteredApprovals;
        }
    }

    getTabContainer() {
        const containers = {
            'pending': 'pendingApprovals',
            'my-requests': 'myRequests',
            'approved': 'approvedItems',
            'history': 'historyItems'
        };
        return document.getElementById(containers[this.currentTab]);
    }

    createEmptyState() {
        const emptyState = document.createElement('div');
        emptyState.className = 'empty-state';
        
        const messages = {
            'pending': { icon: 'fa-clock', title: 'No pending approvals', text: 'All caught up! No items requiring your attention.' },
            'my-requests': { icon: 'fa-file-alt', title: 'No requests submitted', text: 'You haven\'t submitted any approval requests yet.' },
            'approved': { icon: 'fa-check-circle', title: 'No approved items', text: 'No approvals have been granted yet.' },
            'history': { icon: 'fa-history', title: 'No history available', text: 'No completed approval actions to display.' }
        };

        const message = messages[this.currentTab] || messages.pending;
        
        emptyState.innerHTML = `
            <i class="fas ${message.icon}"></i>
            <h6>${message.title}</h6>
            <p>${message.text}</p>
        `;

        return emptyState;
    }

    createApprovalItem(approval) {
        const item = document.createElement('div');
        item.className = 'approval-item';
        item.dataset.approvalId = approval.id;
        item.dataset.status = approval.status;
        item.dataset.priority = approval.priority;
        
        if (approval.isOverdue) {
            item.classList.add('overdue');
        }

        const typeIcons = {
            campaign: 'fa-bullhorn',
            content: 'fa-file-alt',
            budget: 'fa-dollar-sign',
            asset: 'fa-images',
            strategy: 'fa-chess'
        };

        item.innerHTML = `
            <div class="approval-header">
                <h6 class="approval-title">${approval.title}</h6>
                <div class="approval-meta">
                    <div class="priority-indicator ${approval.priority}" title="${approval.priority} priority"></div>
                    <span class="approval-status ${approval.status}">${approval.status}</span>
                </div>
            </div>
            
            <div class="approval-content">
                <div class="approval-type">
                    <i class="fas ${typeIcons[approval.type]}"></i>
                    ${approval.type.charAt(0).toUpperCase() + approval.type.slice(1)}
                </div>
                <p class="approval-description">${approval.description}</p>
            </div>
            
            <div class="approval-footer">
                <div class="approval-requester">
                    <div class="requester-avatar">${approval.requester.split(' ').map(n => n[0]).join('')}</div>
                    <span>Requested by ${approval.requester}</span>
                </div>
                <div class="approval-date">
                    ${approval.isOverdue ? 
                        `<span class="overdue-indicator">Overdue: ${this.formatDate(approval.dueDate)}</span>` :
                        `Due: ${this.formatDate(approval.dueDate)}`
                    }
                </div>
            </div>
            
            ${this.currentTab === 'pending' ? this.createQuickActions(approval) : ''}
            
            <div class="approval-actions">
                <button class="btn btn-outline-primary btn-sm" onclick="window.approvalsPage.viewApprovalDetails(${approval.id})">
                    <i class="fas fa-eye"></i>
                </button>
                ${approval.status === 'pending' ? `
                    <button class="btn btn-success btn-sm" onclick="window.approvalsPage.showApprovalAction(${approval.id}, 'approve')">
                        <i class="fas fa-check"></i>
                    </button>
                    <button class="btn btn-danger btn-sm" onclick="window.approvalsPage.showApprovalAction(${approval.id}, 'reject')">
                        <i class="fas fa-times"></i>
                    </button>
                ` : ''}
            </div>
        `;

        item.addEventListener('click', (e) => {
            if (!e.target.closest('.approval-actions') && !e.target.closest('.quick-actions')) {
                this.viewApprovalDetails(approval.id);
            }
        });

        return item;
    }

    createQuickActions(approval) {
        return `
            <div class="quick-actions">
                <button class="btn btn-success btn-sm" onclick="window.approvalsPage.quickApprove(${approval.id})">
                    <i class="fas fa-check me-1"></i> Quick Approve
                </button>
                <button class="btn btn-warning btn-sm" onclick="window.approvalsPage.showApprovalAction(${approval.id}, 'revision')">
                    <i class="fas fa-edit me-1"></i> Request Changes
                </button>
                <button class="btn btn-danger btn-sm" onclick="window.approvalsPage.showApprovalAction(${approval.id}, 'reject')">
                    <i class="fas fa-times me-1"></i> Reject
                </button>
            </div>
        `;
    }

    formatDate(date) {
        return new Intl.DateTimeFormat('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        }).format(date);
    }

    formatDateTime(date) {
        return new Intl.DateTimeFormat('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: 'numeric',
            minute: '2-digit'
        }).format(date);
    }

    viewApprovalDetails(approvalId) {
        const approval = this.approvals.find(a => a.id === approvalId);
        if (!approval) return;

        this.currentApproval = approval;
        
        const modal = new bootstrap.Modal(document.getElementById('approvalDetailModal'));
        
        document.getElementById('approvalDetailTitle').textContent = approval.title;
        
        const content = document.getElementById('approvalDetailContent');
        content.innerHTML = `
            <div class="row">
                <div class="col-md-8">
                    <div class="approval-detail-section">
                        <div class="approval-detail-label">Description</div>
                        <div class="approval-detail-value">${approval.description}</div>
                    </div>
                    
                    <div class="approval-detail-section">
                        <div class="approval-detail-label">Request Details</div>
                        <div class="approval-detail-value">
                            <div class="row">
                                <div class="col-6">
                                    <strong>Type:</strong> ${approval.type.charAt(0).toUpperCase() + approval.type.slice(1)}<br>
                                    <strong>Priority:</strong> <span class="text-${approval.priority === 'high' ? 'danger' : approval.priority === 'medium' ? 'warning' : 'success'}">${approval.priority.toUpperCase()}</span><br>
                                    <strong>Status:</strong> <span class="approval-status ${approval.status}">${approval.status}</span>
                                </div>
                                <div class="col-6">
                                    <strong>Requested by:</strong> ${approval.requester}<br>
                                    <strong>Approver:</strong> ${approval.approver}<br>
                                    <strong>Due Date:</strong> ${this.formatDate(approval.dueDate)}
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    ${approval.attachments.length > 0 ? `
                        <div class="approval-detail-section">
                            <div class="approval-detail-label">Attachments</div>
                            <div class="attachment-list">
                                ${approval.attachments.map(att => `
                                    <div class="attachment-item">
                                        <div class="attachment-icon">
                                            <i class="fas ${this.getAttachmentIcon(att.type)}"></i>
                                        </div>
                                        <div class="attachment-info">
                                            <div class="attachment-name">${att.name}</div>
                                            <div class="attachment-size">${att.size}</div>
                                        </div>
                                        <div class="attachment-actions">
                                            <button class="btn btn-outline-primary btn-sm" onclick="window.approvalsPage.downloadAttachment('${att.name}')">
                                                <i class="fas fa-download"></i>
                                            </button>
                                        </div>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    ` : ''}
                </div>
                
                <div class="col-md-4">
                    <div class="approval-detail-section">
                        <div class="approval-detail-label">Timeline</div>
                        <div class="approval-timeline">
                            ${approval.timeline.map(item => `
                                <div class="timeline-item">
                                    <div class="timeline-content">
                                        <div class="timeline-header">
                                            <div class="timeline-action">${item.action}</div>
                                            <div class="timeline-date">${this.formatDateTime(item.date)}</div>
                                        </div>
                                        <div class="timeline-user">by ${item.user}</div>
                                        <div class="timeline-comment">${item.comment}</div>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Update modal actions
        const actions = document.getElementById('approvalDetailActions');
        actions.innerHTML = `
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            ${approval.status === 'pending' ? `
                <button type="button" class="btn btn-success" onclick="window.approvalsPage.showApprovalAction(${approval.id}, 'approve')">
                    <i class="fas fa-check me-1"></i> Approve
                </button>
                <button type="button" class="btn btn-warning" onclick="window.approvalsPage.showApprovalAction(${approval.id}, 'revision')">
                    <i class="fas fa-edit me-1"></i> Request Revision
                </button>
                <button type="button" class="btn btn-danger" onclick="window.approvalsPage.showApprovalAction(${approval.id}, 'reject')">
                    <i class="fas fa-times me-1"></i> Reject
                </button>
            ` : ''}
        `;
        
        modal.show();
    }

    getAttachmentIcon(type) {
        const icons = {
            pdf: 'fa-file-pdf',
            doc: 'fa-file-word',
            excel: 'fa-file-excel',
            zip: 'fa-file-archive',
            image: 'fa-file-image'
        };
        return icons[type] || 'fa-file';
    }

    downloadAttachment(filename) {
        this.showToast(`Downloading ${filename}...`, 'info');
        // Simulate download
        setTimeout(() => {
            this.showToast(`${filename} downloaded successfully!`, 'success');
        }, 1500);
    }

    showNewApprovalModal() {
        const modal = new bootstrap.Modal(document.getElementById('newApprovalModal'));
        modal.show();
    }

    submitNewApproval() {
        const form = document.getElementById('newApprovalForm');
        const formData = new FormData(form);
        
        // Validate required fields
        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }
        
        const newApproval = {
            id: this.approvals.length + 1,
            type: formData.get('type'),
            title: formData.get('title'),
            description: formData.get('description'),
            priority: formData.get('priority'),
            status: 'pending',
            requester: 'John Doe', // Current user
            approver: this.formatApprover(formData.get('approver')),
            createdDate: new Date(),
            dueDate: new Date(formData.get('dueDate')),
            isOverdue: false,
            attachments: this.processAttachments(formData.get('attachments')),
            timeline: [{
                action: 'Request Created',
                user: 'John Doe',
                date: new Date(),
                comment: formData.get('notes') || 'Initial approval request submitted.'
            }],
            comments: []
        };

        this.approvals.unshift(newApproval);
        this.applyFilters();
        this.updateStats();
        
        const modal = bootstrap.Modal.getInstance(document.getElementById('newApprovalModal'));
        modal.hide();
        
        // Clear form
        form.reset();
        
        this.showToast('Approval request submitted successfully!', 'success');
    }

    processAttachments(files) {
        // In a real app, this would handle file upload
        if (!files || files.size === 0) return [];
        
        const attachments = [];
        // Simulate file processing
        for (let i = 0; i < Math.min(files.length, 3); i++) {
            attachments.push({
                name: `document_${i + 1}.pdf`,
                size: `${Math.floor(Math.random() * 5000) + 100} KB`,
                type: 'pdf'
            });
        }
        return attachments;
    }

    showApprovalAction(approvalId, suggestedAction = '') {
        this.currentApproval = this.approvals.find(a => a.id === approvalId);
        if (!this.currentApproval) return;
        
        const modal = new bootstrap.Modal(document.getElementById('approvalActionModal'));
        
        // Pre-select action if suggested
        const actionSelect = document.getElementById('actionSelect');
        actionSelect.value = suggestedAction;
        this.toggleConditionsSection(suggestedAction);
        
        // Update modal title
        document.getElementById('approvalActionTitle').textContent = 
            `Take Action: ${this.currentApproval.title}`;
        
        modal.show();
    }

    toggleConditionsSection(action) {
        const conditionsSection = document.getElementById('conditionsSection');
        conditionsSection.style.display = action === 'approve' ? 'block' : 'none';
    }

    submitApprovalAction() {
        const form = document.getElementById('approvalActionForm');
        const formData = new FormData(form);
        
        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }
        
        const action = formData.get('action');
        const comments = formData.get('comments');
        const conditions = formData.get('conditions');
        
        // Update approval status
        this.currentApproval.status = action === 'revision' ? 'revision' : action;
        
        // Add to timeline
        const timelineEntry = {
            action: this.getActionText(action),
            user: 'Marketing Director', // Current reviewer
            date: new Date(),
            comment: comments + (conditions ? `\n\nConditions: ${conditions}` : '')
        };
        
        this.currentApproval.timeline.push(timelineEntry);
        
        // Close modals
        const actionModal = bootstrap.Modal.getInstance(document.getElementById('approvalActionModal'));
        actionModal.hide();
        
        const detailModal = bootstrap.Modal.getInstance(document.getElementById('approvalDetailModal'));
        if (detailModal) detailModal.hide();
        
        // Clear form
        form.reset();
        
        // Refresh display
        this.renderApprovals();
        this.updateStats();
        
        const actionText = this.getActionText(action).toLowerCase();
        this.showToast(`Request ${actionText} successfully!`, 'success');
    }

    getActionText(action) {
        const actionMap = {
            approve: 'Approved',
            reject: 'Rejected', 
            revision: 'Revision Requested'
        };
        return actionMap[action] || action;
    }

    quickApprove(approvalId) {
        const approval = this.approvals.find(a => a.id === approvalId);
        if (!approval) return;
        
        approval.status = 'approved';
        approval.timeline.push({
            action: 'Quick Approved',
            user: 'Marketing Director',
            date: new Date(),
            comment: 'Approved via quick action without additional review.'
        });
        
        this.renderApprovals();
        this.updateStats();
        this.showToast(`"${approval.title}" approved successfully!`, 'success');
    }

    updateStats() {
        const pending = this.approvals.filter(a => a.status === 'pending').length;
        const approved = this.approvals.filter(a => a.status === 'approved').length;
        const overdue = this.approvals.filter(a => a.isOverdue).length;
        const urgent = this.approvals.filter(a => a.priority === 'high' && a.status === 'pending').length;

        // Update stat cards
        document.querySelector('.stat-card.pending .stat-number').textContent = pending;
        document.querySelector('.stat-card.approved .stat-number').textContent = approved;
        document.querySelector('.stat-card.overdue .stat-number').textContent = overdue;
        
        // Update urgent count
        document.querySelector('.stat-card.pending .stat-change span').textContent = `${urgent} urgent`;

        // Update tab badges
        document.querySelector('#approvalTabs .nav-link[href="#pending-tab"] .badge').textContent = pending;
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
    
    // Initialize approvals page
    window.approvalsPage = new ApprovalsPage();
});