class OnboardingPage {
    constructor() {
        this.steps = [];
        this.currentTourStep = 1;
        this.totalTourSteps = 4;
        this.init();
    }

    init() {
        this.generateOnboardingSteps();
        this.renderSteps();
        this.updateProgressCircle();
        this.initializeEventHandlers();
    }

    generateOnboardingSteps() {
        this.steps = [
            {
                id: 1,
                title: 'Complete Profile Setup',
                description: 'Add your organization details, branding, and team information to personalize your experience.',
                status: 'completed',
                duration: '10 min',
                difficulty: 'Easy',
                category: 'setup',
                requirements: [
                    'Organization name and logo',
                    'Primary contact information',
                    'Business type and specialty areas'
                ],
                instructions: [
                    'Navigate to Settings > Organization Profile',
                    'Upload your organization logo and branding colors',
                    'Enter your business information and contact details',
                    'Select your primary healthcare specialties',
                    'Save your profile settings'
                ]
            },
            {
                id: 2,
                title: 'Invite Team Members',
                description: 'Add your marketing team and assign appropriate roles and permissions for collaborative work.',
                status: 'completed',
                duration: '15 min',
                difficulty: 'Easy',
                category: 'team',
                requirements: [
                    'Team member email addresses',
                    'Understanding of role permissions',
                    'Organization hierarchy'
                ],
                instructions: [
                    'Go to Settings > Team Management',
                    'Click "Invite Team Member" button',
                    'Enter email addresses and select roles',
                    'Customize permissions for each role',
                    'Send invitations and track acceptance'
                ]
            },
            {
                id: 3,
                title: 'Connect CRM Integration',
                description: 'Link your existing CRM system to sync patient data and streamline lead management processes.',
                status: 'active',
                duration: '20 min',
                difficulty: 'Medium',
                category: 'integration',
                requirements: [
                    'CRM administrator access',
                    'API credentials or connection details',
                    'Data mapping preferences'
                ],
                instructions: [
                    'Navigate to Settings > Integrations',
                    'Select your CRM provider from the list',
                    'Enter your API credentials or connection details',
                    'Configure field mapping between systems',
                    'Test the connection and sync initial data'
                ]
            },
            {
                id: 4,
                title: 'Configure Email Marketing',
                description: 'Set up email automation, templates, and HIPAA-compliant communication workflows.',
                status: 'pending',
                duration: '25 min',
                difficulty: 'Medium',
                category: 'marketing',
                requirements: [
                    'Email service provider access',
                    'HIPAA compliance documentation',
                    'Email template preferences'
                ],
                instructions: [
                    'Access Marketing > Email Automation',
                    'Connect your email service provider',
                    'Upload and customize email templates',
                    'Set up automated workflow triggers',
                    'Configure HIPAA compliance settings'
                ]
            },
            {
                id: 5,
                title: 'Set Up Analytics Tracking',
                description: 'Connect Google Analytics, Facebook Pixel, and other tracking tools for comprehensive reporting.',
                status: 'pending',
                duration: '30 min',
                difficulty: 'Hard',
                category: 'analytics',
                requirements: [
                    'Google Analytics account',
                    'Facebook Business Manager access',
                    'Website administrator rights'
                ],
                instructions: [
                    'Navigate to Settings > Analytics Integration',
                    'Connect Google Analytics using your tracking ID',
                    'Add Facebook Pixel and other tracking codes',
                    'Configure goal and conversion tracking',
                    'Verify tracking implementation'
                ]
            },
            {
                id: 6,
                title: 'Create First Campaign',
                description: 'Launch your initial marketing campaign using our guided campaign builder and best practices.',
                status: 'pending',
                duration: '45 min',
                difficulty: 'Medium',
                category: 'campaign',
                requirements: [
                    'Campaign objectives defined',
                    'Target audience identified',
                    'Creative assets prepared'
                ],
                instructions: [
                    'Go to Campaigns > Create New Campaign',
                    'Select campaign type and objectives',
                    'Define target audience and demographics',
                    'Upload creative assets and copy',
                    'Set budget, schedule, and launch campaign'
                ]
            }
        ];
    }

    renderSteps() {
        const container = document.getElementById('onboardingSteps');
        container.innerHTML = '';

        this.steps.forEach(step => {
            const stepElement = this.createStepElement(step);
            container.appendChild(stepElement);
        });
    }

    createStepElement(step) {
        const stepDiv = document.createElement('div');
        stepDiv.className = `onboarding-step ${step.status}`;
        stepDiv.dataset.stepId = step.id;

        const indicator = this.createIndicator(step);
        const content = this.createContent(step);
        const actions = this.createActions(step);

        stepDiv.appendChild(indicator);
        stepDiv.appendChild(content);
        stepDiv.appendChild(actions);

        stepDiv.addEventListener('click', (e) => {
            if (!e.target.closest('.step-actions')) {
                this.showStepDetails(step.id);
            }
        });

        return stepDiv;
    }

    createIndicator(step) {
        const indicator = document.createElement('div');
        indicator.className = `step-indicator ${step.status}`;

        if (step.status === 'completed') {
            indicator.innerHTML = '<i class="fas fa-check"></i>';
        } else {
            indicator.textContent = step.id;
        }

        return indicator;
    }

    createContent(step) {
        const content = document.createElement('div');
        content.className = 'step-content';

        const difficultyIcons = {
            'Easy': 'fa-star',
            'Medium': 'fa-star-half-alt',
            'Hard': 'fa-exclamation-triangle'
        };

        const difficultyColors = {
            'Easy': 'text-success',
            'Medium': 'text-warning', 
            'Hard': 'text-danger'
        };

        content.innerHTML = `
            <div class="step-title">${step.title}</div>
            <div class="step-description">${step.description}</div>
            <div class="step-meta">
                <div class="step-duration">
                    <i class="fas fa-clock"></i>
                    <span>${step.duration}</span>
                </div>
                <div class="step-difficulty">
                    <i class="fas ${difficultyIcons[step.difficulty]} ${difficultyColors[step.difficulty]}"></i>
                    <span>${step.difficulty}</span>
                </div>
            </div>
        `;

        return content;
    }

    createActions(step) {
        const actions = document.createElement('div');
        actions.className = 'step-actions';

        let buttonContent = '';
        
        switch (step.status) {
            case 'completed':
                buttonContent = `
                    <button class="btn btn-outline-success btn-sm me-2" onclick="window.onboardingPage.showStepDetails(${step.id})">
                        <i class="fas fa-eye me-1"></i>Review
                    </button>
                `;
                break;
            case 'active':
                buttonContent = `
                    <button class="btn btn-primary btn-sm me-2" onclick="window.onboardingPage.startStep(${step.id})">
                        <i class="fas fa-play me-1"></i>Continue
                    </button>
                    <button class="btn btn-outline-secondary btn-sm" onclick="window.onboardingPage.showStepDetails(${step.id})">
                        <i class="fas fa-info me-1"></i>Details
                    </button>
                `;
                break;
            case 'pending':
                buttonContent = `
                    <button class="btn btn-outline-primary btn-sm me-2" onclick="window.onboardingPage.startStep(${step.id})" ${this.canStartStep(step.id) ? '' : 'disabled'}>
                        <i class="fas fa-play me-1"></i>Start
                    </button>
                    <button class="btn btn-outline-secondary btn-sm" onclick="window.onboardingPage.showStepDetails(${step.id})">
                        <i class="fas fa-info me-1"></i>Preview
                    </button>
                `;
                break;
        }

        actions.innerHTML = buttonContent;
        return actions;
    }

    canStartStep(stepId) {
        // Check if all prerequisite steps are completed
        const step = this.steps.find(s => s.id === stepId);
        if (!step) return false;

        // For now, allow starting any step after the first two are completed
        const completedSteps = this.steps.filter(s => s.status === 'completed').length;
        return completedSteps >= 2 || stepId <= completedSteps + 1;
    }

    showStepDetails(stepId) {
        const step = this.steps.find(s => s.id === stepId);
        if (!step) return;

        const modal = new bootstrap.Modal(document.getElementById('stepDetailModal'));
        
        // Update modal title
        document.getElementById('stepDetailTitle').textContent = step.title;
        
        // Update modal content
        const content = document.getElementById('stepDetailContent');
        content.innerHTML = `
            <div class="step-overview mb-3">
                <p>${step.description}</p>
                <div class="row">
                    <div class="col-6">
                        <strong>Duration:</strong> ${step.duration}
                    </div>
                    <div class="col-6">
                        <strong>Difficulty:</strong> <span class="text-${step.difficulty === 'Easy' ? 'success' : step.difficulty === 'Medium' ? 'warning' : 'danger'}">${step.difficulty}</span>
                    </div>
                </div>
            </div>

            ${step.requirements ? `
                <div class="step-requirements mb-3">
                    <h6><i class="fas fa-list-check me-2"></i>Requirements</h6>
                    <ul class="requirement-list">
                        ${step.requirements.map(req => `<li><i class="fas fa-check"></i>${req}</li>`).join('')}
                    </ul>
                </div>
            ` : ''}

            ${step.instructions ? `
                <div class="step-instructions">
                    <h6><i class="fas fa-tasks me-2"></i>Step-by-Step Instructions</h6>
                    ${step.instructions.map((instruction, index) => `
                        <div class="instruction-step">
                            <div class="instruction-number">${index + 1}</div>
                            <div class="instruction-text">${instruction}</div>
                        </div>
                    `).join('')}
                </div>
            ` : ''}
        `;
        
        // Update action button
        const actionBtn = document.getElementById('stepActionBtn');
        actionBtn.onclick = () => this.handleStepAction(stepId);
        
        if (step.status === 'completed') {
            actionBtn.textContent = 'Mark as Incomplete';
            actionBtn.className = 'btn btn-warning';
        } else {
            actionBtn.textContent = step.status === 'active' ? 'Mark as Complete' : 'Start Step';
            actionBtn.className = 'btn btn-primary';
        }
        
        modal.show();
    }

    handleStepAction(stepId) {
        const step = this.steps.find(s => s.id === stepId);
        if (!step) return;

        if (step.status === 'completed') {
            // Mark as incomplete
            step.status = 'pending';
            this.showToast(`"${step.title}" marked as incomplete`, 'info');
        } else {
            // Mark as complete or start
            if (step.status === 'pending') {
                step.status = 'active';
                this.showToast(`Started "${step.title}"`, 'info');
            } else {
                step.status = 'completed';
                this.showToast(`"${step.title}" completed successfully!`, 'success');
                
                // Activate next step if it exists
                const nextStep = this.steps.find(s => s.id === stepId + 1);
                if (nextStep && nextStep.status === 'pending') {
                    nextStep.status = 'active';
                }
            }
        }

        // Close modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('stepDetailModal'));
        modal.hide();

        // Re-render steps and update progress
        this.renderSteps();
        this.updateProgressCircle();
    }

    startStep(stepId) {
        const step = this.steps.find(s => s.id === stepId);
        if (!step || !this.canStartStep(stepId)) return;

        // Navigate to appropriate page based on step category
        switch (step.category) {
            case 'setup':
                window.location.href = '../settings/settings.html';
                break;
            case 'team':
                window.location.href = '../settings/settings.html#team';
                break;
            case 'integration':
                window.location.href = '../settings/settings.html#integrations';
                break;
            case 'marketing':
                window.location.href = '../campaigns/campaigns.html';
                break;
            case 'analytics':
                window.location.href = '../reports/reports.html';
                break;
            case 'campaign':
                window.location.href = '../campaigns/campaigns.html';
                break;
            default:
                this.showStepDetails(stepId);
        }
    }

    updateProgressCircle() {
        const completedSteps = this.steps.filter(s => s.status === 'completed').length;
        const totalSteps = this.steps.length;
        const progress = Math.round((completedSteps / totalSteps) * 100);

        const progressCircle = document.querySelector('.progress-circle');
        const progressText = document.querySelector('.progress-text');
        
        if (progressCircle && progressText) {
            progressCircle.style.setProperty('--progress', progress);
            progressText.textContent = `${progress}%`;
        }
    }

    initializeEventHandlers() {
        // Guided tour navigation
        document.getElementById('tourNextBtn').addEventListener('click', () => {
            this.nextTourStep();
        });

        document.getElementById('tourPrevBtn').addEventListener('click', () => {
            this.prevTourStep();
        });
    }

    startGuidedTour() {
        this.currentTourStep = 1;
        this.updateTourDisplay();
        const modal = new bootstrap.Modal(document.getElementById('guidedTourModal'));
        modal.show();
    }

    nextTourStep() {
        if (this.currentTourStep < this.totalTourSteps) {
            this.currentTourStep++;
            this.updateTourDisplay();
        } else {
            // Tour completed
            const modal = bootstrap.Modal.getInstance(document.getElementById('guidedTourModal'));
            modal.hide();
            this.showToast('Tour completed! Welcome to MedFlow Marketing!', 'success');
        }
    }

    prevTourStep() {
        if (this.currentTourStep > 1) {
            this.currentTourStep--;
            this.updateTourDisplay();
        }
    }

    updateTourDisplay() {
        // Update step visibility
        document.querySelectorAll('.tour-step').forEach((step, index) => {
            step.classList.toggle('active', index + 1 === this.currentTourStep);
        });

        // Update progress bar
        const progress = (this.currentTourStep / this.totalTourSteps) * 100;
        document.querySelector('.tour-navigation .progress-bar').style.width = `${progress}%`;
        document.querySelector('.tour-counter').textContent = `Step ${this.currentTourStep} of ${this.totalTourSteps}`;

        // Update navigation buttons
        const prevBtn = document.getElementById('tourPrevBtn');
        const nextBtn = document.getElementById('tourNextBtn');

        prevBtn.disabled = this.currentTourStep === 1;
        
        if (this.currentTourStep === this.totalTourSteps) {
            nextBtn.innerHTML = 'Finish Tour<i class="fas fa-flag-checkered ms-1"></i>';
        } else {
            nextBtn.innerHTML = 'Next<i class="fas fa-chevron-right ms-1"></i>';
        }
    }

    scheduleDemo() {
        this.showToast('Demo scheduling feature will be available soon!', 'info');
        // In a real application, this would open a calendar scheduling interface
    }

    watchVideo() {
        this.showToast('Opening video tutorial...', 'info');
        // In a real application, this would open a video player or redirect to video library
    }

    createFirstCampaign() {
        // Check if user has completed prerequisite steps
        const completedSteps = this.steps.filter(s => s.status === 'completed').length;
        
        if (completedSteps < 3) {
            this.showToast('Please complete more onboarding steps before creating your first campaign.', 'warning');
            return;
        }

        // Navigate to campaign creation
        window.location.href = '../campaigns/campaigns.html?action=create';
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
    
    // Initialize onboarding page
    window.onboardingPage = new OnboardingPage();
});