class SettingsPage {
    constructor() {
        this.currentSection = 'general';
        this.settings = this.loadSettings();
        this.hasUnsavedChanges = false;
        this.init();
    }

    init() {
        this.initializeNavigation();
        this.initializeFormHandlers();
        this.initializeSaveHandlers();
        this.initializeResetHandler();
        this.initializeIntegrationHandlers();
        this.loadSettingsIntoForms();
        this.setupChangeTracking();
    }

    initializeNavigation() {
        const navItems = document.querySelectorAll('.settings-nav-item');
        
        navItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const section = item.dataset.section;
                this.showSection(section);
            });
        });
    }

    showSection(section) {
        // Update navigation
        document.querySelectorAll('.settings-nav-item').forEach(item => {
            item.classList.remove('active');
        });
        document.querySelector(`[data-section="${section}"]`).classList.add('active');
        
        // Update content
        document.querySelectorAll('.settings-section').forEach(section => {
            section.classList.remove('active');
        });
        document.getElementById(`${section}-section`).classList.add('active');
        
        this.currentSection = section;
        
        // Update URL hash
        window.location.hash = section;
    }

    initializeFormHandlers() {
        // General Settings Form
        const generalForm = document.getElementById('generalSettingsForm');
        if (generalForm) {
            generalForm.addEventListener('change', () => {
                this.hasUnsavedChanges = true;
                this.updateSaveButtonState();
            });
        }

        // Notification Settings Form
        const notificationForm = document.getElementById('notificationSettingsForm');
        if (notificationForm) {
            notificationForm.addEventListener('change', () => {
                this.hasUnsavedChanges = true;
                this.updateSaveButtonState();
            });
        }

        // Security Settings Form
        const securityForm = document.getElementById('securitySettingsForm');
        if (securityForm) {
            securityForm.addEventListener('change', () => {
                this.hasUnsavedChanges = true;
                this.updateSaveButtonState();
            });
        }

        // Advanced Settings Form
        const advancedForm = document.getElementById('advancedSettingsForm');
        if (advancedForm) {
            advancedForm.addEventListener('change', () => {
                this.hasUnsavedChanges = true;
                this.updateSaveButtonState();
            });
        }

        // Dark mode toggle
        const darkModeToggle = document.getElementById('darkMode');
        if (darkModeToggle) {
            darkModeToggle.addEventListener('change', (e) => {
                this.toggleDarkMode(e.target.checked);
            });
        }
    }

    initializeSaveHandlers() {
        const saveBtn = document.getElementById('saveSettingsBtn');
        if (saveBtn) {
            saveBtn.addEventListener('click', () => {
                this.saveSettings();
            });
        }
    }

    initializeResetHandler() {
        const resetBtn = document.getElementById('resetSettingsBtn');
        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                this.resetSettings();
            });
        }
    }

    initializeIntegrationHandlers() {
        // Integration buttons
        document.querySelectorAll('.integration-item button').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const integrationItem = e.target.closest('.integration-item');
                const integrationName = integrationItem.querySelector('h6').textContent;
                
                if (btn.textContent.trim() === 'Connect' || btn.textContent.trim() === 'Setup') {
                    this.connectIntegration(integrationName);
                } else if (btn.textContent.trim() === 'Configure') {
                    this.configureIntegration(integrationName);
                }
            });
        });

        // API key regeneration
        const regenerateBtn = document.querySelector('button:contains("Regenerate")');
        if (regenerateBtn) {
            regenerateBtn.addEventListener('click', () => {
                this.regenerateApiKey();
            });
        }

        // Password visibility toggle
        const passwordToggle = document.querySelector('.input-group .fa-eye').closest('button');
        if (passwordToggle) {
            passwordToggle.addEventListener('click', (e) => {
                this.togglePasswordVisibility(e.target.closest('.input-group'));
            });
        }
    }

    loadSettings() {
        // Load settings from localStorage or return defaults
        const defaultSettings = {
            general: {
                orgName: 'St. Mary\'s Hospital',
                timezone: 'UTC-5',
                currency: 'USD',
                dateFormat: 'MM/DD/YYYY',
                defaultDashboard: 'overview',
                darkMode: false,
                autoSave: true
            },
            notifications: {
                emailCampaigns: true,
                emailLeads: true,
                emailRecommendations: false,
                pushAlerts: true,
                pushReports: true,
                quietStart: '22:00',
                quietEnd: '08:00'
            },
            security: {
                twoFactor: true,
                sessionTimeout: 60,
                rememberDevice: false,
                analyticsTracking: true,
                dataExport: false
            },
            advanced: {
                dataRetention: 24
            }
        };

        return JSON.parse(localStorage.getItem('marketingSettings')) || defaultSettings;
    }

    loadSettingsIntoForms() {
        // Load general settings
        Object.keys(this.settings.general).forEach(key => {
            const element = document.querySelector(`[name="${key}"]`);
            if (element) {
                if (element.type === 'checkbox') {
                    element.checked = this.settings.general[key];
                } else {
                    element.value = this.settings.general[key];
                }
            }
        });

        // Load notification settings
        Object.keys(this.settings.notifications).forEach(key => {
            const element = document.getElementById(key) || document.querySelector(`[name="${key}"]`);
            if (element) {
                if (element.type === 'checkbox') {
                    element.checked = this.settings.notifications[key];
                } else {
                    element.value = this.settings.notifications[key];
                }
            }
        });

        // Load security settings
        Object.keys(this.settings.security).forEach(key => {
            const element = document.getElementById(key) || document.querySelector(`[name="${key}"]`);
            if (element) {
                if (element.type === 'checkbox') {
                    element.checked = this.settings.security[key];
                } else {
                    element.value = this.settings.security[key];
                }
            }
        });

        // Load advanced settings
        Object.keys(this.settings.advanced).forEach(key => {
            const element = document.querySelector(`[name="${key}"]`);
            if (element) {
                element.value = this.settings.advanced[key];
            }
        });
    }

    saveSettings() {
        const saveBtn = document.getElementById('saveSettingsBtn');
        saveBtn.classList.add('loading');
        saveBtn.disabled = true;

        // Collect form data
        const updatedSettings = {
            general: this.collectFormData('generalSettingsForm'),
            notifications: this.collectFormData('notificationSettingsForm'),
            security: this.collectFormData('securitySettingsForm'),
            advanced: this.collectFormData('advancedSettingsForm')
        };

        // Simulate API call
        setTimeout(() => {
            try {
                // Save to localStorage
                localStorage.setItem('marketingSettings', JSON.stringify(updatedSettings));
                this.settings = updatedSettings;
                this.hasUnsavedChanges = false;
                
                // Apply settings
                this.applySettings();
                
                // Show success message
                this.showToast('Settings saved successfully!', 'success');
                
                saveBtn.classList.remove('loading');
                saveBtn.disabled = false;
                this.updateSaveButtonState();
            } catch (error) {
                console.error('Error saving settings:', error);
                this.showToast('Error saving settings. Please try again.', 'error');
                saveBtn.classList.remove('loading');
                saveBtn.disabled = false;
            }
        }, 1000);
    }

    collectFormData(formId) {
        const form = document.getElementById(formId);
        const data = {};
        
        if (!form) return data;
        
        const formData = new FormData(form);
        
        // Handle regular inputs
        for (let [key, value] of formData.entries()) {
            data[key] = value;
        }
        
        // Handle checkboxes separately
        const checkboxes = form.querySelectorAll('input[type="checkbox"]');
        checkboxes.forEach(checkbox => {
            data[checkbox.name || checkbox.id] = checkbox.checked;
        });
        
        return data;
    }

    resetSettings() {
        if (confirm('Are you sure you want to reset all settings to their default values?')) {
            localStorage.removeItem('marketingSettings');
            this.settings = this.loadSettings();
            this.loadSettingsIntoForms();
            this.hasUnsavedChanges = false;
            this.updateSaveButtonState();
            this.showToast('Settings reset to defaults', 'success');
        }
    }

    applySettings() {
        // Apply dark mode
        if (this.settings.general.darkMode) {
            document.body.setAttribute('data-theme', 'dark');
        } else {
            document.body.removeAttribute('data-theme');
        }
        
        // Apply other settings as needed
    }

    setupChangeTracking() {
        // Track changes to mark as unsaved
        document.addEventListener('input', (e) => {
            if (e.target.closest('form')) {
                this.hasUnsavedChanges = true;
                this.updateSaveButtonState();
            }
        });

        // Warn before leaving with unsaved changes
        window.addEventListener('beforeunload', (e) => {
            if (this.hasUnsavedChanges) {
                e.preventDefault();
                e.returnValue = '';
                return '';
            }
        });
    }

    updateSaveButtonState() {
        const saveBtn = document.getElementById('saveSettingsBtn');
        if (saveBtn) {
            if (this.hasUnsavedChanges) {
                saveBtn.classList.remove('btn-secondary');
                saveBtn.classList.add('btn-primary');
                saveBtn.innerHTML = '<i class="fas fa-save me-1"></i> Save Changes';
            } else {
                saveBtn.classList.remove('btn-primary');
                saveBtn.classList.add('btn-secondary');
                saveBtn.innerHTML = '<i class="fas fa-check me-1"></i> Saved';
            }
        }
    }

    toggleDarkMode(enabled) {
        if (enabled) {
            document.body.setAttribute('data-theme', 'dark');
        } else {
            document.body.removeAttribute('data-theme');
        }
        this.hasUnsavedChanges = true;
        this.updateSaveButtonState();
    }

    connectIntegration(integrationName) {
        this.showToast(`Connecting to ${integrationName}...`, 'info');
        
        // Simulate connection process
        setTimeout(() => {
            this.showToast(`Successfully connected to ${integrationName}!`, 'success');
            // Update UI to show connected status
        }, 2000);
    }

    configureIntegration(integrationName) {
        this.showToast(`Opening ${integrationName} configuration...`, 'info');
        
        // In a real app, this would open a configuration modal or navigate to config page
    }

    regenerateApiKey() {
        if (confirm('Are you sure you want to regenerate your API key? This will invalidate the current key.')) {
            this.showToast('Generating new API key...', 'info');
            
            setTimeout(() => {
                const newKey = 'sk-' + Math.random().toString(36).substr(2, 20);
                document.querySelector('input[value^="sk-"]').value = newKey;
                this.showToast('New API key generated successfully!', 'success');
                this.hasUnsavedChanges = true;
                this.updateSaveButtonState();
            }, 1500);
        }
    }

    togglePasswordVisibility(inputGroup) {
        const input = inputGroup.querySelector('input');
        const icon = inputGroup.querySelector('.fa-eye, .fa-eye-slash');
        
        if (input.type === 'password') {
            input.type = 'text';
            icon.classList.remove('fa-eye');
            icon.classList.add('fa-eye-slash');
        } else {
            input.type = 'password';
            icon.classList.remove('fa-eye-slash');
            icon.classList.add('fa-eye');
        }
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
    
    // Initialize settings page
    window.settingsPage = new SettingsPage();
    
    // Handle URL hash on load
    const hash = window.location.hash.substring(1);
    if (hash && document.getElementById(`${hash}-section`)) {
        window.settingsPage.showSection(hash);
    }
});