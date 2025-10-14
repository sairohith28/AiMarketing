// Campaigns Page Scripts

class CampaignsPage {
    constructor() {
        this.campaigns = new Map();
        this.currentFilter = 'all';
        this.sortConfig = { field: null, direction: 'asc' };
        
        this.init();
    }
    
    init() {
        this.loadCampaigns();
        this.bindEvents();
        this.animateStats();
        this.initTooltips();
    }
    
    loadCampaigns() {
        // Mock campaign data
        const mockCampaigns = [
            {
                id: 1,
                name: 'Cardiology Awareness Q4',
                type: 'awareness',
                status: 'active',
                platform: ['google', 'facebook'],
                budget: 10000,
                spend: 8500,
                leads: 342,
                ctr: 3.8,
                roi: 245,
                startDate: '2024-10-15',
                category: 'Healthcare'
            },
            {
                id: 2,
                name: 'Emergency Care Promotion',
                type: 'lead-generation',
                status: 'review',
                platform: ['google', 'instagram'],
                budget: 7500,
                spend: 5200,
                leads: 128,
                ctr: 2.4,
                roi: 89,
                startDate: '2024-10-10',
                category: 'Emergency'
            },
            {
                id: 3,
                name: 'Wellness Check Campaign',
                type: 'conversion',
                status: 'active',
                platform: ['facebook', 'linkedin'],
                budget: 8000,
                spend: 6800,
                leads: 267,
                ctr: 4.1,
                roi: 198,
                startDate: '2024-10-05',
                category: 'Preventive'
            }
        ];
        
        mockCampaigns.forEach(campaign => {
            this.campaigns.set(campaign.id, campaign);
        });
    }
    
    bindEvents() {
        // Status filter
        document.getElementById('statusFilter')?.addEventListener('change', (e) => {
            this.currentFilter = e.target.value;
            this.filterCampaigns();
        });
        
        // Create campaign button
        document.getElementById('createCampaignBtn')?.addEventListener('click', () => {
            this.showCreateCampaignModal();
        });
        
        // Create campaign form
        document.getElementById('createCampaignForm')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleCreateCampaign(e.target);
        });
        
        // Export button
        document.getElementById('exportBtn')?.addEventListener('click', () => {
            this.exportCampaigns();
        });
        
        // Refresh button
        document.getElementById('refreshBtn')?.addEventListener('click', () => {
            this.refreshCampaigns();
        });
        
        // Campaign action buttons
        document.addEventListener('click', (e) => {
            if (e.target.closest('.action-buttons .btn')) {
                this.handleCampaignAction(e.target.closest('.btn'));
            }
        });
        
        // Table sorting (click on headers)
        document.querySelectorAll('.campaigns-table th').forEach(header => {
            header.addEventListener('click', () => {
                const field = header.textContent.toLowerCase().trim();
                this.sortCampaigns(field);
            });
        });
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey || e.metaKey) {
                switch (e.key) {
                    case 'n':
                        e.preventDefault();
                        this.showCreateCampaignModal();
                        break;
                    case 'r':
                        e.preventDefault();
                        this.refreshCampaigns();
                        break;
                    case 'e':
                        e.preventDefault();
                        this.exportCampaigns();
                        break;
                }
            }
        });
    }
    
    animateStats() {
        const statNumbers = document.querySelectorAll('.stat-number');
        
        statNumbers.forEach((element, index) => {
            setTimeout(() => {
                const target = element.textContent;
                const isPercentage = target.includes('%');
                const isCurrency = target.includes('$');
                const hasK = target.includes('K');
                
                let numericValue;
                if (isCurrency) {
                    numericValue = parseFloat(target.replace(/[$K]/g, ''));
                    if (hasK) numericValue *= 1000;
                } else if (isPercentage) {
                    numericValue = parseFloat(target.replace('%', ''));
                } else if (hasK) {
                    numericValue = parseFloat(target.replace('K', '')) * 1000;
                } else {
                    numericValue = parseInt(target);
                }
                
                this.animateNumber(element, numericValue, target);
            }, index * 200);
        });
    }
    
    animateNumber(element, target, originalFormat) {
        let current = 0;
        const increment = target / 40;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            
            element.textContent = this.formatStatNumber(current, originalFormat);
        }, 30);
    }
    
    formatStatNumber(value, originalFormat) {
        if (originalFormat.includes('$')) {
            const displayValue = originalFormat.includes('K') ? Math.round(value / 1000) : Math.round(value);
            return originalFormat.includes('K') ? `$${displayValue}K` : `$${displayValue.toLocaleString()}`;
        } else if (originalFormat.includes('%')) {
            return `${value.toFixed(1)}%`;
        } else if (originalFormat.includes('K')) {
            return `${Math.round(value / 1000)}K`;
        } else {
            return Math.round(value).toString();
        }
    }
    
    showCreateCampaignModal() {
        const modal = new bootstrap.Modal(document.getElementById('createCampaignModal'));
        modal.show();
        
        // Focus on first input
        setTimeout(() => {
            document.querySelector('#createCampaignForm input').focus();
        }, 300);
    }
    
    handleCreateCampaign(form) {
        const formData = new FormData(form);
        const campaignData = {};
        
        // Collect form data
        for (let [key, value] of formData.entries()) {
            campaignData[key] = value;
        }
        
        // Collect selected platforms
        const platforms = [];
        document.querySelectorAll('.platform-checkboxes input:checked').forEach(checkbox => {
            platforms.push(checkbox.value);
        });
        campaignData.platforms = platforms;
        
        // Show loading state
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-1"></i> Creating...';
        
        // Simulate API call
        setTimeout(() => {
            // Create new campaign
            const newCampaign = {
                id: Date.now(),
                name: campaignData.name || 'New Campaign',
                type: campaignData.type || 'awareness',
                status: 'draft',
                platform: platforms,
                budget: parseInt(campaignData.budget) || 1000,
                spend: 0,
                leads: 0,
                ctr: 0,
                roi: 0,
                startDate: new Date().toISOString().split('T')[0],
                category: 'General'
            };
            
            this.campaigns.set(newCampaign.id, newCampaign);
            this.addCampaignToTable(newCampaign);
            
            // Reset form and close modal
            form.reset();
            document.querySelectorAll('.platform-checkboxes input').forEach(cb => cb.checked = false);
            bootstrap.Modal.getInstance(document.getElementById('createCampaignModal')).hide();
            
            // Restore button
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
            
            // Show success message
            window.MarketingApp.showToast(`Campaign "${newCampaign.name}" created successfully!`, 'success');
            
            // Update stats
            this.updateStats();
            
        }, 2000);
    }
    
    addCampaignToTable(campaign) {
        const tbody = document.getElementById('campaignsTableBody');
        const row = document.createElement('tr');
        row.className = 'campaign-row';
        row.setAttribute('data-campaign-id', campaign.id);
        row.setAttribute('data-status', campaign.status);
        
        const platformIcons = campaign.platform.map(platform => {
            const iconMap = {
                google: 'fab fa-google',
                facebook: 'fab fa-facebook',
                instagram: 'fab fa-instagram',
                linkedin: 'fab fa-linkedin',
                youtube: 'fab fa-youtube'
            };
            return `<i class="${iconMap[platform] || 'fas fa-globe'}" title="${platform}"></i>`;
        }).join('');
        
        const statusClass = {
            active: 'bg-success',
            paused: 'bg-warning',
            completed: 'bg-secondary',
            draft: 'bg-info',
            review: 'bg-warning'
        };
        
        row.innerHTML = `
            <td>
                <div class="campaign-info">
                    <div class="campaign-name">${campaign.name}</div>
                    <div class="campaign-meta">Started ${campaign.startDate} • ${campaign.category}</div>
                </div>
            </td>
            <td><span class="badge ${statusClass[campaign.status] || 'bg-secondary'}">${campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}</span></td>
            <td>
                <div class="platform-icons">
                    ${platformIcons}
                </div>
            </td>
            <td>$${campaign.budget.toLocaleString()}</td>
            <td>
                <div class="spend-info">
                    <div class="spend-amount">$${campaign.spend.toLocaleString()}</div>
                    <div class="spend-percentage">${Math.round((campaign.spend / campaign.budget) * 100)}%</div>
                </div>
            </td>
            <td>${campaign.leads}</td>
            <td>${campaign.ctr}%</td>
            <td class="${campaign.roi > 0 ? 'text-success' : campaign.roi < 0 ? 'text-danger' : 'text-muted'}">
                ${campaign.roi > 0 ? '+' : ''}${campaign.roi}%
            </td>
            <td>
                <div class="action-buttons">
                    <button class="btn btn-sm btn-outline-primary view-btn" title="View Details" data-action="view">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-secondary edit-btn" title="Edit" data-action="edit">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-warning pause-btn" title="${campaign.status === 'active' ? 'Pause' : 'Resume'}" data-action="toggle">
                        <i class="fas fa-${campaign.status === 'active' ? 'pause' : 'play'}"></i>
                    </button>
                </div>
            </td>
        `;
        
        tbody.appendChild(row);
        
        // Animate new row
        row.style.opacity = '0';
        row.style.transform = 'translateY(-20px)';
        setTimeout(() => {
            row.style.transition = 'all 0.5s ease';
            row.style.opacity = '1';
            row.style.transform = 'translateY(0)';
        }, 100);
    }
    
    handleCampaignAction(button) {
        const action = button.getAttribute('data-action');
        const row = button.closest('.campaign-row');
        const campaignId = parseInt(row.getAttribute('data-campaign-id'));
        const campaign = this.campaigns.get(campaignId);
        
        switch (action) {
            case 'view':
                this.viewCampaignDetails(campaign);
                break;
            case 'edit':
                this.editCampaign(campaign);
                break;
            case 'toggle':
                this.toggleCampaignStatus(campaign, row);
                break;
        }
    }
    
    viewCampaignDetails(campaign) {
        // In a real app, this would navigate to a detailed view
        window.MarketingApp.showToast(`Viewing details for: ${campaign.name}`, 'info');
        console.log('Campaign details:', campaign);
    }
    
    editCampaign(campaign) {
        // In a real app, this would open an edit modal
        window.MarketingApp.showToast(`Editing: ${campaign.name}`, 'info');
        console.log('Edit campaign:', campaign);
    }
    
    toggleCampaignStatus(campaign, row) {
        const newStatus = campaign.status === 'active' ? 'paused' : 'active';
        
        // Show loading
        row.classList.add('loading');
        
        setTimeout(() => {
            campaign.status = newStatus;
            this.campaigns.set(campaign.id, campaign);
            
            // Update the row
            const statusBadge = row.querySelector('.badge');
            statusBadge.className = `badge ${newStatus === 'active' ? 'bg-success' : 'bg-warning'}`;
            statusBadge.textContent = newStatus.charAt(0).toUpperCase() + newStatus.slice(1);
            
            // Update toggle button
            const toggleBtn = row.querySelector('[data-action="toggle"]');
            toggleBtn.innerHTML = `<i class="fas fa-${newStatus === 'active' ? 'pause' : 'play'}"></i>`;
            toggleBtn.title = newStatus === 'active' ? 'Pause' : 'Resume';
            
            // Update row status attribute
            row.setAttribute('data-status', newStatus);
            
            row.classList.remove('loading');
            
            window.MarketingApp.showToast(
                `Campaign ${newStatus === 'active' ? 'resumed' : 'paused'}: ${campaign.name}`,
                newStatus === 'active' ? 'success' : 'warning'
            );
        }, 1000);
    }
    
    filterCampaigns() {
        const rows = document.querySelectorAll('.campaign-row');
        
        rows.forEach(row => {
            const status = row.getAttribute('data-status');
            const shouldShow = this.currentFilter === 'all' || status === this.currentFilter;
            
            if (shouldShow) {
                row.style.display = '';
                row.style.animation = 'fadeInUp 0.3s ease-out';
            } else {
                row.style.display = 'none';
            }
        });
        
        this.updateStats();
    }
    
    sortCampaigns(field) {
        // Toggle sort direction
        if (this.sortConfig.field === field) {
            this.sortConfig.direction = this.sortConfig.direction === 'asc' ? 'desc' : 'asc';
        } else {
            this.sortConfig.field = field;
            this.sortConfig.direction = 'asc';
        }
        
        // Get visible rows
        const tbody = document.getElementById('campaignsTableBody');
        const rows = Array.from(tbody.querySelectorAll('.campaign-row:not([style*="display: none"])'));
        
        // Sort rows
        rows.sort((a, b) => {
            let aVal, bVal;
            
            switch (field) {
                case 'campaign':
                    aVal = a.querySelector('.campaign-name').textContent;
                    bVal = b.querySelector('.campaign-name').textContent;
                    break;
                case 'budget':
                    aVal = parseInt(a.cells[3].textContent.replace(/[$,]/g, ''));
                    bVal = parseInt(b.cells[3].textContent.replace(/[$,]/g, ''));
                    break;
                case 'leads':
                    aVal = parseInt(a.cells[5].textContent);
                    bVal = parseInt(b.cells[5].textContent);
                    break;
                default:
                    return 0;
            }
            
            if (this.sortConfig.direction === 'asc') {
                return aVal > bVal ? 1 : -1;
            } else {
                return aVal < bVal ? 1 : -1;
            }
        });
        
        // Reorder rows
        rows.forEach(row => tbody.appendChild(row));
        
        // Show sort indicator
        document.querySelectorAll('.campaigns-table th').forEach(th => {
            th.classList.remove('sorted-asc', 'sorted-desc');
        });
        
        const headerElement = Array.from(document.querySelectorAll('.campaigns-table th'))
            .find(th => th.textContent.toLowerCase().trim() === field);
        
        if (headerElement) {
            headerElement.classList.add(`sorted-${this.sortConfig.direction}`);
        }
    }
    
    refreshCampaigns() {
        const refreshBtn = document.getElementById('refreshBtn');
        const originalText = refreshBtn.innerHTML;
        
        refreshBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-1"></i> Refreshing...';
        refreshBtn.disabled = true;
        
        // Simulate refresh
        setTimeout(() => {
            // In a real app, this would fetch fresh data
            this.updateStats();
            
            refreshBtn.innerHTML = originalText;
            refreshBtn.disabled = false;
            
            window.MarketingApp.showToast('Campaigns data refreshed', 'success');
        }, 1500);
    }
    
    updateStats() {
        const visibleCampaigns = Array.from(this.campaigns.values())
            .filter(campaign => {
                return this.currentFilter === 'all' || campaign.status === this.currentFilter;
            });
        
        const activeCampaigns = visibleCampaigns.filter(c => c.status === 'active').length;
        const totalReach = visibleCampaigns.reduce((sum, c) => sum + (c.leads * 10), 0); // Estimated reach
        const avgCTR = visibleCampaigns.length > 0 
            ? visibleCampaigns.reduce((sum, c) => sum + c.ctr, 0) / visibleCampaigns.length 
            : 0;
        const totalBudget = visibleCampaigns.reduce((sum, c) => sum + c.budget, 0);
        
        // Update display
        document.querySelector('.active-campaigns .stat-number').textContent = activeCampaigns;
        document.querySelector('.total-reach .stat-number').textContent = `${Math.round(totalReach / 1000)}K`;
        document.querySelector('.avg-ctr .stat-number').textContent = `${avgCTR.toFixed(1)}%`;
        document.querySelector('.total-budget .stat-number').textContent = `$${Math.round(totalBudget / 1000)}K`;
    }
    
    exportCampaigns() {
        const campaigns = Array.from(this.campaigns.values());
        const csv = this.convertToCSV(campaigns);
        this.downloadCSV(csv, `campaigns-export-${new Date().toISOString().split('T')[0]}.csv`);
        
        window.MarketingApp.showToast('Campaign data exported successfully', 'success');
    }
    
    convertToCSV(data) {
        const headers = ['Name', 'Type', 'Status', 'Budget', 'Spend', 'Leads', 'CTR', 'ROI', 'Start Date'];
        const rows = data.map(campaign => [
            campaign.name,
            campaign.type,
            campaign.status,
            campaign.budget,
            campaign.spend,
            campaign.leads,
            campaign.ctr,
            campaign.roi,
            campaign.startDate
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
        window.URL.revokeObjectURL(url);
    }
    
    initTooltips() {
        // Initialize Bootstrap tooltips
        const tooltipTriggerList = [].slice.call(document.querySelectorAll('[title]'));
        tooltipTriggerList.map(function (tooltipTriggerEl) {
            return new bootstrap.Tooltip(tooltipTriggerEl);
        });
    }
}

// Initialize campaigns page when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const campaignsPage = new CampaignsPage();
    
    // Make instance globally available
    window.campaignsPage = campaignsPage;
});