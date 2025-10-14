// Leads Page Scripts

class LeadsPage {
    constructor() {
        this.leads = new Map();
        this.filters = {
            status: 'all',
            source: 'all'
        };
        this.sortConfig = { field: null, direction: 'asc' };
        
        this.init();
    }
    
    init() {
        this.loadLeads();
        this.bindEvents();
        this.animateStats();
        this.initDragAndDrop();
        this.startRealTimeUpdates();
    }
    
    loadLeads() {
        // Mock leads data
        const mockLeads = [
            {
                id: 1,
                firstName: 'John',
                lastName: 'Doe',
                email: 'john.doe@email.com',
                phone: '(555) 123-4567',
                status: 'new',
                source: 'google',
                service: 'cardiology',
                value: 1200,
                score: 85,
                lastContact: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
                notes: 'Interested in cardiology consultation',
                createdAt: new Date()
            },
            {
                id: 2,
                firstName: 'Sarah',
                lastName: 'Miller',
                email: 'sarah.m@email.com',
                phone: '(555) 987-6543',
                status: 'contacted',
                source: 'facebook',
                service: 'emergency',
                value: 850,
                score: 72,
                lastContact: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
                notes: 'Called, left voicemail',
                createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000)
            },
            {
                id: 3,
                firstName: 'Robert',
                lastName: 'Johnson',
                email: 'robert.j@email.com',
                phone: '(555) 456-7890',
                status: 'qualified',
                source: 'email',
                service: 'wellness',
                value: 2100,
                score: 92,
                lastContact: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
                notes: 'Very interested, scheduled follow-up',
                createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
            }
        ];
        
        mockLeads.forEach(lead => {
            this.leads.set(lead.id, lead);
        });
    }
    
    bindEvents() {
        // Filter events
        document.getElementById('statusFilter')?.addEventListener('change', (e) => {
            this.filters.status = e.target.value;
            this.filterLeads();
        });
        
        document.getElementById('sourceFilter')?.addEventListener('change', (e) => {
            this.filters.source = e.target.value;
            this.filterLeads();
        });
        
        // Add lead button
        document.getElementById('addLeadBtn')?.addEventListener('click', () => {
            this.showAddLeadModal();
        });
        
        // Add lead form
        document.getElementById('addLeadForm')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleAddLead(e.target);
        });
        
        // Export and refresh buttons
        document.getElementById('exportLeadsBtn')?.addEventListener('click', () => {
            this.exportLeads();
        });
        
        document.getElementById('refreshLeadsBtn')?.addEventListener('click', () => {
            this.refreshLeads();
        });
        
        // Lead action buttons
        document.addEventListener('click', (e) => {
            if (e.target.closest('.lead-actions .btn')) {
                this.handleLeadAction(e.target.closest('.btn'));
            }
        });
        
        // Pipeline lead clicks
        document.addEventListener('click', (e) => {
            if (e.target.closest('.pipeline-lead')) {
                this.viewLeadDetails(e.target.closest('.pipeline-lead'));
            }
        });
        
        // Table sorting
        document.querySelectorAll('.leads-table th').forEach(header => {
            header.addEventListener('click', () => {
                const field = header.textContent.toLowerCase().trim();
                this.sortLeads(field);
            });
        });
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey || e.metaKey) {
                switch (e.key) {
                    case 'n':
                        e.preventDefault();
                        this.showAddLeadModal();
                        break;
                    case 'r':
                        e.preventDefault();
                        this.refreshLeads();
                        break;
                    case 'e':
                        e.preventDefault();
                        this.exportLeads();
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
                let numericValue = isPercentage 
                    ? parseFloat(target.replace('%', ''))
                    : parseInt(target.replace(',', ''));
                
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
            
            if (originalFormat.includes('%')) {
                element.textContent = `${current.toFixed(1)}%`;
            } else if (originalFormat.includes(',')) {
                element.textContent = Math.round(current).toLocaleString();
            } else {
                element.textContent = Math.round(current).toString();
            }
        }, 30);
    }
    
    showAddLeadModal() {
        const modal = new bootstrap.Modal(document.getElementById('addLeadModal'));
        modal.show();
        
        // Focus on first input
        setTimeout(() => {
            document.querySelector('#addLeadForm input').focus();
        }, 300);
    }
    
    handleAddLead(form) {
        const formData = new FormData(form);
        const leadData = {};
        
        // Collect form data
        for (let [key, value] of formData.entries()) {
            leadData[key] = value;
        }
        
        // Show loading state
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-1"></i> Adding...';
        
        // Simulate API call
        setTimeout(() => {
            // Create new lead
            const newLead = {
                id: Date.now(),
                firstName: leadData.firstName,
                lastName: leadData.lastName,
                email: leadData.email,
                phone: leadData.phone,
                status: 'new',
                source: leadData.source,
                service: leadData.service,
                value: this.estimateLeadValue(leadData.service),
                score: Math.floor(Math.random() * 30) + 70, // Random score between 70-100
                lastContact: new Date(),
                notes: leadData.notes || '',
                createdAt: new Date()
            };
            
            this.leads.set(newLead.id, newLead);
            this.addLeadToTable(newLead);
            this.addLeadToPipeline(newLead);
            
            // Reset form and close modal
            form.reset();
            bootstrap.Modal.getInstance(document.getElementById('addLeadModal')).hide();
            
            // Restore button
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
            
            // Show success message
            window.MarketingApp.showToast(
                `Lead "${newLead.firstName} ${newLead.lastName}" added successfully!`,
                'success'
            );
            
            // Update stats
            this.updateStats();
            
        }, 2000);
    }
    
    estimateLeadValue(service) {
        const valueMap = {
            cardiology: Math.floor(Math.random() * 1000) + 1000,
            emergency: Math.floor(Math.random() * 500) + 500,
            wellness: Math.floor(Math.random() * 800) + 800,
            surgery: Math.floor(Math.random() * 2000) + 2000,
            consultation: Math.floor(Math.random() * 300) + 300
        };
        return valueMap[service] || 500;
    }
    
    addLeadToTable(lead) {
        const tbody = document.getElementById('leadsTableBody');
        const row = document.createElement('tr');
        row.className = 'lead-row';
        row.setAttribute('data-lead-id', lead.id);
        row.setAttribute('data-status', lead.status);
        
        const initials = `${lead.firstName.charAt(0)}${lead.lastName.charAt(0)}`;
        const scoreClass = lead.score >= 80 ? 'high-score' : lead.score >= 60 ? 'medium-score' : 'low-score';
        
        const sourceIcons = {
            google: 'fab fa-google text-primary',
            facebook: 'fab fa-facebook text-primary',
            email: 'fas fa-envelope text-primary',
            referral: 'fas fa-user-friends text-primary',
            direct: 'fas fa-globe text-primary'
        };
        
        const statusClasses = {
            new: 'bg-primary',
            contacted: 'bg-warning',
            qualified: 'bg-success',
            converted: 'bg-info',
            lost: 'bg-danger'
        };
        
        row.innerHTML = `
            <td>
                <div class="lead-profile">
                    <div class="lead-avatar-table">${initials}</div>
                    <div class="lead-details">
                        <div class="lead-name">${lead.firstName} ${lead.lastName}</div>
                        <div class="lead-contact">${lead.email} • ${lead.phone}</div>
                    </div>
                </div>
            </td>
            <td><span class="badge ${statusClasses[lead.status]}">${lead.status.charAt(0).toUpperCase() + lead.status.slice(1)}</span></td>
            <td>
                <div class="source-info">
                    <i class="${sourceIcons[lead.source] || 'fas fa-globe'}"></i>
                    <span>${lead.source.charAt(0).toUpperCase() + lead.source.slice(1)}</span>
                </div>
            </td>
            <td>${lead.service.charAt(0).toUpperCase() + lead.service.slice(1)}</td>
            <td class="lead-value">$${lead.value.toLocaleString()}</td>
            <td>
                <div class="lead-score ${scoreClass}">
                    <span class="score-value">${lead.score}</span>
                    <div class="score-bar">
                        <div class="score-fill" style="width: ${lead.score}%"></div>
                    </div>
                </div>
            </td>
            <td>${this.formatTimeAgo(lead.lastContact)}</td>
            <td>
                <div class="lead-actions">
                    <button class="btn btn-sm btn-outline-primary" title="Contact" data-action="contact">
                        <i class="fas fa-phone"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-info" title="Email" data-action="email">
                        <i class="fas fa-envelope"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-success" title="Qualify" data-action="qualify">
                        <i class="fas fa-check"></i>
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
    
    addLeadToPipeline(lead) {
        const stageMap = {
            new: 'newLeads',
            contacted: 'contactedLeads',
            qualified: 'qualifiedLeads',
            converted: 'convertedLeads'
        };
        
        const stageElement = document.getElementById(stageMap[lead.status]);
        if (!stageElement) return;
        
        const initials = `${lead.firstName.charAt(0)}${lead.lastName.charAt(0)}`;
        const pipelineLead = document.createElement('div');
        pipelineLead.className = 'pipeline-lead';
        pipelineLead.setAttribute('data-lead-id', lead.id);
        
        pipelineLead.innerHTML = `
            <div class="lead-avatar">${initials}</div>
            <div class="lead-info">
                <div class="lead-name">${lead.firstName} ${lead.lastName}</div>
                <div class="lead-source">${lead.source.charAt(0).toUpperCase() + lead.source.slice(1)}</div>
            </div>
            <div class="lead-value">$${lead.value.toLocaleString()}</div>
        `;
        
        stageElement.appendChild(pipelineLead);
        
        // Update stage count
        const stageHeader = stageElement.parentElement.querySelector('.stage-count');
        const currentCount = parseInt(stageHeader.textContent);
        stageHeader.textContent = currentCount + 1;
    }
    
    handleLeadAction(button) {
        const action = button.getAttribute('data-action');
        const row = button.closest('.lead-row');
        const leadId = parseInt(row.getAttribute('data-lead-id'));
        const lead = this.leads.get(leadId);
        
        // Show loading state
        button.disabled = true;
        const originalIcon = button.innerHTML;
        button.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
        
        setTimeout(() => {
            switch (action) {
                case 'contact':
                    this.contactLead(lead, row);
                    break;
                case 'email':
                    this.emailLead(lead);
                    break;
                case 'qualify':
                    this.qualifyLead(lead, row);
                    break;
            }
            
            // Restore button
            button.disabled = false;
            button.innerHTML = originalIcon;
        }, 1000);
    }
    
    contactLead(lead, row) {
        lead.status = 'contacted';
        lead.lastContact = new Date();
        this.leads.set(lead.id, lead);
        
        // Update table row
        const statusBadge = row.querySelector('.badge');
        statusBadge.className = 'badge bg-warning';
        statusBadge.textContent = 'Contacted';
        
        row.setAttribute('data-status', 'contacted');
        
        // Move in pipeline
        this.moveLeadInPipeline(lead.id, 'new', 'contacted');
        
        window.MarketingApp.showToast(`Called ${lead.firstName} ${lead.lastName}`, 'success');
    }
    
    emailLead(lead) {
        window.MarketingApp.showToast(`Email sent to ${lead.firstName} ${lead.lastName}`, 'info');
        // In a real app, this would open email composer or send via API
    }
    
    qualifyLead(lead, row) {
        lead.status = 'qualified';
        lead.lastContact = new Date();
        lead.score = Math.min(100, lead.score + 10); // Boost score
        this.leads.set(lead.id, lead);
        
        // Update table row
        const statusBadge = row.querySelector('.badge');
        statusBadge.className = 'badge bg-success';
        statusBadge.textContent = 'Qualified';
        
        row.setAttribute('data-status', 'qualified');
        
        // Update score display
        const scoreValue = row.querySelector('.score-value');
        const scoreFill = row.querySelector('.score-fill');
        scoreValue.textContent = lead.score;
        scoreFill.style.width = `${lead.score}%`;
        
        // Move in pipeline
        const currentStage = lead.status === 'qualified' ? 'contacted' : 'new';
        this.moveLeadInPipeline(lead.id, currentStage, 'qualified');
        
        window.MarketingApp.showToast(`${lead.firstName} ${lead.lastName} qualified!`, 'success');
    }
    
    moveLeadInPipeline(leadId, fromStage, toStage) {
        const stageMap = {
            new: 'newLeads',
            contacted: 'contactedLeads',
            qualified: 'qualifiedLeads',
            converted: 'convertedLeads'
        };
        
        // Find and remove from current stage
        const fromElement = document.getElementById(stageMap[fromStage]);
        const toElement = document.getElementById(stageMap[toStage]);
        
        if (fromElement && toElement) {
            const leadElement = fromElement.querySelector(`[data-lead-id="${leadId}"]`);
            if (leadElement) {
                // Remove from current stage
                leadElement.remove();
                
                // Update from stage count
                const fromCount = fromElement.parentElement.querySelector('.stage-count');
                fromCount.textContent = parseInt(fromCount.textContent) - 1;
                
                // Add to new stage
                toElement.appendChild(leadElement);
                
                // Update to stage count
                const toCount = toElement.parentElement.querySelector('.stage-count');
                toCount.textContent = parseInt(toCount.textContent) + 1;
                
                // Animate movement
                leadElement.style.transform = 'scale(1.1)';
                setTimeout(() => {
                    leadElement.style.transform = 'scale(1)';
                }, 300);
            }
        }
    }
    
    viewLeadDetails(pipelineElement) {
        const leadId = parseInt(pipelineElement.getAttribute('data-lead-id'));
        const lead = this.leads.get(leadId);
        
        if (lead) {
            // In a real app, this would open a detailed modal or navigate to lead page
            window.MarketingApp.showToast(
                `Viewing details for ${lead.firstName} ${lead.lastName}`,
                'info'
            );
        }
    }
    
    filterLeads() {
        const rows = document.querySelectorAll('.lead-row');
        
        rows.forEach(row => {
            const status = row.getAttribute('data-status');
            const leadId = parseInt(row.getAttribute('data-lead-id'));
            const lead = this.leads.get(leadId);
            
            const statusMatch = this.filters.status === 'all' || status === this.filters.status;
            const sourceMatch = this.filters.source === 'all' || lead.source === this.filters.source;
            
            if (statusMatch && sourceMatch) {
                row.style.display = '';
            } else {
                row.style.display = 'none';
            }
        });
        
        this.updateStats();
    }
    
    sortLeads(field) {
        // Implementation similar to campaigns sorting
        console.log(`Sorting by ${field}`);
    }
    
    refreshLeads() {
        const refreshBtn = document.getElementById('refreshLeadsBtn');
        const originalText = refreshBtn.innerHTML;
        
        refreshBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-1"></i> Refreshing...';
        refreshBtn.disabled = true;
        
        setTimeout(() => {
            this.updateStats();
            
            refreshBtn.innerHTML = originalText;
            refreshBtn.disabled = false;
            
            window.MarketingApp.showToast('Leads data refreshed', 'success');
        }, 1500);
    }
    
    updateStats() {
        const visibleLeads = Array.from(this.leads.values()).filter(lead => {
            const statusMatch = this.filters.status === 'all' || lead.status === this.filters.status;
            const sourceMatch = this.filters.source === 'all' || lead.source === this.filters.source;
            return statusMatch && sourceMatch;
        });
        
        // Calculate stats
        const totalLeads = visibleLeads.length;
        const newLeads = visibleLeads.filter(l => l.status === 'new').length;
        const qualifiedLeads = visibleLeads.filter(l => l.status === 'qualified').length;
        const convertedLeads = visibleLeads.filter(l => l.status === 'converted').length;
        const conversionRate = totalLeads > 0 ? (convertedLeads / totalLeads) * 100 : 0;
        
        // Update displays
        document.querySelector('.total-leads .stat-number').textContent = totalLeads.toLocaleString();
        document.querySelector('.new-leads .stat-number').textContent = newLeads;
        document.querySelector('.qualified-leads .stat-number').textContent = qualifiedLeads;
        document.querySelector('.conversion-rate .stat-number').textContent = `${conversionRate.toFixed(1)}%`;
    }
    
    exportLeads() {
        const leads = Array.from(this.leads.values());
        const csv = this.convertToCSV(leads);
        this.downloadCSV(csv, `leads-export-${new Date().toISOString().split('T')[0]}.csv`);
        
        window.MarketingApp.showToast('Leads data exported successfully', 'success');
    }
    
    convertToCSV(data) {
        const headers = [
            'First Name', 'Last Name', 'Email', 'Phone', 'Status', 
            'Source', 'Service', 'Value', 'Score', 'Created At'
        ];
        
        const rows = data.map(lead => [
            lead.firstName,
            lead.lastName,
            lead.email,
            lead.phone,
            lead.status,
            lead.source,
            lead.service,
            lead.value,
            lead.score,
            lead.createdAt.toISOString().split('T')[0]
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
    
    formatTimeAgo(date) {
        const now = new Date();
        const diff = now - date;
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);
        
        if (minutes < 60) {
            return `${minutes} minutes ago`;
        } else if (hours < 24) {
            return `${hours} hours ago`;
        } else {
            return `${days} days ago`;
        }
    }
    
    initDragAndDrop() {
        // Simple drag and drop for pipeline stages
        // In a real app, you'd use a library like SortableJS
        console.log('Drag and drop initialized for pipeline');
    }
    
    startRealTimeUpdates() {
        // Simulate real-time updates every 30 seconds
        setInterval(() => {
            // In a real app, this would fetch updates from server
            this.simulateNewLead();
        }, 30000);
    }
    
    simulateNewLead() {
        // Occasionally add a new lead to simulate real-time activity
        if (Math.random() > 0.7) { // 30% chance
            const names = [
                { first: 'Emma', last: 'Davis' },
                { first: 'James', last: 'Wilson' },
                { first: 'Olivia', last: 'Garcia' }
            ];
            
            const sources = ['google', 'facebook', 'email', 'referral'];
            const services = ['cardiology', 'emergency', 'wellness', 'consultation'];
            
            const randomName = names[Math.floor(Math.random() * names.length)];
            const randomSource = sources[Math.floor(Math.random() * sources.length)];
            const randomService = services[Math.floor(Math.random() * services.length)];
            
            const newLead = {
                id: Date.now(),
                firstName: randomName.first,
                lastName: randomName.last,
                email: `${randomName.first.toLowerCase()}.${randomName.last.toLowerCase()}@email.com`,
                phone: `(555) ${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`,
                status: 'new',
                source: randomSource,
                service: randomService,
                value: this.estimateLeadValue(randomService),
                score: Math.floor(Math.random() * 30) + 70,
                lastContact: new Date(),
                notes: 'Auto-generated lead',
                createdAt: new Date()
            };
            
            this.leads.set(newLead.id, newLead);
            this.addLeadToTable(newLead);
            this.addLeadToPipeline(newLead);
            this.updateStats();
            
            window.MarketingApp.showToast(
                `New lead: ${newLead.firstName} ${newLead.lastName}`,
                'info'
            );
        }
    }
}

// Initialize leads page when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const leadsPage = new LeadsPage();
    
    // Make instance globally available
    window.leadsPage = leadsPage;
});