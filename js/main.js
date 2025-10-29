/**
 * Hospital Marketing AI Dashboard - Main JavaScript
 * Handles all interactivity, navigation, charts, and mock data
 */

// Global Variables
let currentStep = 1;
let maxSteps = 5;
let callsChart, campaignChart, roiChart;
let globalAssets = [];

// Template Assets Data
const templateAssets = {
    email: {
        'cardiology-email': {
            id: 'cardiology-email',
            title: 'Cardiology Consultation Email',
            subject: 'Schedule Your Heart Health Checkup',
            content: 'Dear Patient,\n\nTake care of your heart health with our expert cardiology team. Our specialists are here to help you maintain optimal cardiovascular wellness.\n\nKey benefits:\n• Comprehensive heart health assessment\n• State-of-the-art diagnostic equipment\n• Personalized treatment plans\n• 24/7 emergency cardiac care\n\nBook your consultation today and take the first step towards a healthier heart.',
            cta: 'Book Consultation',
            status: 'Approved',
            created: '2 days ago',
            type: 'email'
        },
        'followup-email': {
            id: 'followup-email',
            title: 'Follow-up Appointment',
            subject: 'Time for your follow-up checkup',
            content: 'Dear Patient,\n\nIt\'s time for your scheduled follow-up appointment. Regular check-ups are essential for maintaining your health and monitoring your progress.\n\nPlease schedule your appointment at your earliest convenience.\n\nYour health is our priority.',
            cta: 'Schedule Appointment',
            status: 'Draft',
            created: '1 week ago',
            type: 'email'
        },
        'preventive-email': {
            id: 'preventive-email',
            title: 'Preventive Care Campaign',
            subject: 'Annual Health Screening - Book Now',
            content: 'Dear Valued Patient,\n\nPreventive care is the key to long-term health and wellness. Our comprehensive annual health screening packages are designed to detect potential health issues early.\n\nWhat\'s included:\n• Complete blood work analysis\n• Blood pressure and cholesterol check\n• Cancer screening tests\n• Nutritional assessment\n• Lifestyle counseling\n\nInvest in your health today for a healthier tomorrow.',
            cta: 'Book Screening',
            status: 'Approved',
            created: '3 days ago',
            type: 'email'
        }
    },
    sms: {
        'appointment-reminder': {
            id: 'appointment-reminder',
            title: 'Appointment Reminder',
            content: 'Reminder: Your cardiology appointment is tomorrow at 2 PM at City Hospital. Please arrive 15 minutes early. Reply CONFIRM or call (555) 123-4567',
            created: '1 day ago',
            status: 'Active',
            type: 'sms'
        },
        'health-checkup-sms': {
            id: 'health-checkup-sms',
            title: 'Health Checkup Offer',
            content: 'Limited time: 20% off comprehensive health checkups! Book your appointment this month. Call (555) 123-4567 or visit CityHospital.com/checkup',
            created: '4 days ago',
            status: 'Scheduled',
            type: 'sms'
        }
    },
    social: {
        'wellness-facebook': {
            id: 'wellness-facebook',
            title: 'Wellness Wednesday Post',
            platform: 'facebook',
            content: '🌟 Wellness Wednesday Tip: Did you know that just 30 minutes of walking daily can reduce your risk of heart disease by 30%? Take a step towards better health today! Our cardiology team is here to support your heart health journey.',
            hashtags: '#WellnessWednesday #HeartHealth #Healthcare #Prevention #CityHospital',
            created: '1 day ago',
            status: 'Scheduled',
            type: 'social'
        },
        'community-instagram': {
            id: 'community-instagram',
            title: 'Community Health Drive',
            platform: 'instagram',
            content: 'Join us this Saturday for our FREE community health screening! ❤️ Check your blood pressure, BMI, and get health tips from our experts. Together, we build a healthier community! 📍 City Hospital Main Lobby | 9 AM - 4 PM',
            hashtags: '#CommunityHealth #FreeScreening #HealthyLiving #CityHospital #PreventiveCare',
            created: '2 days ago',
            status: 'Approved',
            type: 'social'
        }
    },
    whatsapp: {
        'appointment-confirmation': {
            id: 'appointment-confirmation',
            title: 'Appointment Confirmation',
            content: 'Hello 👋 Your appointment with Dr. Smith is confirmed for March 15th at 10:30 AM. Location: City Hospital, Cardiology Wing. Need to reschedule? Reply here or call (555) 123-4567',
            created: '3 hours ago',
            status: 'Active',
            type: 'whatsapp'
        }
    },
    image: {
        'doctor-consultation': {
            id: 'doctor-consultation',
            title: 'Doctor Consultation',
            filename: 'doctor-consultation.jpg',
            dimensions: '1920x1080',
            size: '234 KB',
            created: '2 days ago',
            usage: '3 campaigns',
            type: 'image'
        },
        'hospital-exterior': {
            id: 'hospital-exterior',
            title: 'Hospital Building',
            filename: 'hospital-exterior.jpg',
            dimensions: '1920x1080',
            size: '456 KB',
            created: '1 week ago',
            usage: '1 campaign',
            type: 'image'
        }
    },
    video: {
        'hospital-tour': {
            id: 'hospital-tour',
            title: 'Hospital Virtual Tour',
            filename: 'hospital-tour.mp4',
            dimensions: '1920x1080',
            duration: '2:30',
            size: '45 MB',
            created: '3 days ago',
            usage: '2 campaigns',
            type: 'video'
        },
        'doctor-testimonial': {
            id: 'doctor-testimonial',
            title: 'Doctor Testimonial',
            filename: 'doctor-testimonial.mp4',
            dimensions: '1920x1080',
            duration: '1:15',
            size: '28 MB',
            created: '1 week ago',
            usage: 'Not used yet',
            type: 'video'
        }
    }
};
let campaignData = {
    objective: '',
    campaignType: '',
    serviceLine: '',
    budget: 0,
    duration: 0,
    segments: {
        ageMin: 25,
        ageMax: 65,
        gender: 'All',
        radius: 15,
        patientType: 'newPatients',
        crmSegments: ['high-value', 'cardiac-history']
    },
    assets: {
        email: [],
        sms: [],
        whatsapp: [],
        social: []
    },
    channels: {
        google: { enabled: true, budget: 15000 },
        meta: { enabled: true, budget: 12000 },
        sms: { enabled: false, budget: 3000 },
        whatsapp: { enabled: false, budget: 5000 },
        email: { enabled: true, budget: 5000 }
    },
    totalBudget: 32000,
    startDate: '',
    endDate: ''
};

// Mock Data
const mockData = {
    kpis: {
        totalCalls: 1247,
        newUserCalls: 456,
        responded: 892,
        appointmentsBooked: 234
    },
    callsData: [45, 52, 38, 65, 48, 72, 58, 63, 47, 55, 69, 42, 38, 51, 67, 59, 44, 48, 62, 55, 41, 49, 56, 43],
    campaignData: {
        labels: ['Google Ads', 'Facebook', 'WhatsApp', 'Email', 'SMS'],
        datasets: [{
            label: 'Leads Generated',
            data: [423, 267, 145, 198, 89],
            backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF']
        }]
    },
    roiData: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [{
            label: 'ROI %',
            data: [145, 178, 234, 198, 267, 289],
            borderColor: '#007bff',
            backgroundColor: '#007bff',
            borderWidth: 1
        }]
    },
    campaigns: [
        {
            id: 1001,
            name: 'Cardiology Awareness Q4',
            status: 'Active',
            budget: 50000,
            spent: 12500,
            leads: 156,
            cpl: 320,
            startDate: '2025-10-01',
            endDate: '2025-10-31',
            channels: 'Google, Meta, Email',
            serviceLine: 'Cardiology'
        },
        {
            id: 1002,
            name: 'Pediatric Teleconsult',
            status: 'Active',
            budget: 30000,
            spent: 9000,
            leads: 89,
            cpl: 337,
            startDate: '2025-09-15',
            endDate: '2025-10-15',
            channels: 'Facebook, WhatsApp',
            serviceLine: 'Pediatrics'
        }
    ]
};

// Initialize App
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    initializeSidebarState();
    setupEventListeners();
    initializeCharts();
    updateKPIs();
    setupSettingsNavigation();
    setupResponsiveNavigation();
    setupDashboardInteractions();
    updateCampaignsTable();
    updateApprovalsSection();
    initializeOnboarding();
    initializeBranchManagement();
    loadConnectedPlatforms();
}

// Event Listeners Setup
function setupEventListeners() {
    // Sidebar Navigation
    document.querySelectorAll('.sidebar-nav .nav-link').forEach(link => {
        link.addEventListener('click', handleSidebarNavigation);
    });

    // Sidebar Collapse
    const sidebarCollapseBtn = document.getElementById('sidebarCollapseBtn');
    if (sidebarCollapseBtn) {
        sidebarCollapseBtn.addEventListener('click', toggleSidebar);
    }

    // New Campaign Button
    const newCampaignBtn = document.getElementById('newCampaignBtn');
    if (newCampaignBtn) {
        newCampaignBtn.addEventListener('click', openCampaignModal);
    }

    // Create Campaign Button (in campaigns section)
    const createCampaignBtn = document.getElementById('createCampaignBtn');
    if (createCampaignBtn) {
        createCampaignBtn.addEventListener('click', openCampaignModal);
    }

    // View Alerts Button
    const viewAlertsBtn = document.getElementById('viewAlertsBtn');
    if (viewAlertsBtn) {
        viewAlertsBtn.addEventListener('click', function() {
            showSection('dashboard');
            document.querySelector('.alerts-todos-panel').scrollIntoView({ behavior: 'smooth' });
        });
    }

    // Campaign Wizard Steps
    const nextStepBtn = document.getElementById('nextStep');
    const prevStepBtn = document.getElementById('prevStep');
    const createCampaignFinalBtn = document.getElementById('createCampaign');

    if (nextStepBtn) nextStepBtn.addEventListener('click', nextStep);
    if (prevStepBtn) prevStepBtn.addEventListener('click', prevStep);
    if (createCampaignFinalBtn) createCampaignFinalBtn.addEventListener('click', createCampaign);

    // Campaign Wizard Form Elements
    setupCampaignWizardListeners();

    // Date Range Change
    const startDate = document.getElementById('startDate');
    const endDate = document.getElementById('endDate');
    
    if (startDate) startDate.addEventListener('change', updateChartsData);
    if (endDate) endDate.addEventListener('change', updateChartsData);

    // Radius Slider
    const radiusSlider = document.getElementById('radiusSlider');
    const radiusValue = document.getElementById('radiusValue');
    
    if (radiusSlider && radiusValue) {
        radiusSlider.addEventListener('input', function() {
            radiusValue.textContent = this.value;
            // Mock: Update competitor data based on radius
            updateCompetitorData(this.value);
        });
    }

    // Form Submissions
    const onboardingForm = document.getElementById('onboardingForm');
    if (onboardingForm) {
        onboardingForm.addEventListener('submit', handleOnboardingSubmit);
    }

    // Settings Tab Navigation
    document.querySelectorAll('[data-settings-tab]').forEach(tab => {
        tab.addEventListener('click', handleSettingsTabClick);
    });

    // Asset Tab Navigation
    document.querySelectorAll('[data-bs-toggle="tab"]').forEach(tab => {
        tab.addEventListener('click', handleAssetTabClick);
    });

    // Mock Interactive Elements
    setupMockInteractions();
}

// Sidebar Navigation Handler
function handleSidebarNavigation(e) {
    e.preventDefault();
    
    const targetSection = e.currentTarget.getAttribute('data-section');
    
    // Update active state
    document.querySelectorAll('.sidebar-nav .nav-link').forEach(link => {
        link.classList.remove('active');
    });
    e.currentTarget.classList.add('active');
    
    // Show target section
    showSection(targetSection);
    
    // Close sidebar on mobile
    if (window.innerWidth < 1200) {
        document.getElementById('sidebar').classList.remove('show');
    }
}

// Show Section
function showSection(sectionName) {
    // Hide all sections
    document.querySelectorAll('.content-section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Show target section
    const targetSection = document.getElementById(`${sectionName}-section`);
    if (targetSection) {
        targetSection.classList.add('active');
        
        // Animate section entrance
        targetSection.style.opacity = '0';
        targetSection.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            targetSection.style.transition = 'all 0.3s ease';
            targetSection.style.opacity = '1';
            targetSection.style.transform = 'translateY(0)';
        }, 50);
    }
    
    // Update charts if switching to dashboard or reports
    if (sectionName === 'dashboard' || sectionName === 'reports') {
        setTimeout(() => {
            if (callsChart) callsChart.resize();
            if (roiChart) roiChart.resize();
        }, 100);
    }
}

// Campaign Modal Functions
function openCampaignModal() {
    const modal = new bootstrap.Modal(document.getElementById('campaignModal'));
    resetCampaignWizard();
    modal.show();
}

function resetCampaignWizard() {
    currentStep = 1;
    updateWizardStep();
}

function nextStep() {
    if (currentStep < maxSteps) {
        currentStep++;
        updateWizardStep();
    }
}

function prevStep() {
    if (currentStep > 1) {
        currentStep--;
        updateWizardStep();
    }
}

function updateWizardStep() {
    // Update step indicators
    document.querySelectorAll('.step').forEach((step, index) => {
        const stepNumber = index + 1;
        step.classList.remove('active', 'completed');
        
        if (stepNumber === currentStep) {
            step.classList.add('active');
        } else if (stepNumber < currentStep) {
            step.classList.add('completed');
        }
    });
    
    // Show/hide step content
    document.querySelectorAll('.wizard-content').forEach((content, index) => {
        const stepNumber = index + 1;
        if (stepNumber === currentStep) {
            content.classList.remove('d-none');
        } else {
            content.classList.add('d-none');
        }
    });
    
    // Update buttons
    const prevBtn = document.getElementById('prevStep');
    const nextBtn = document.getElementById('nextStep');
    const createBtn = document.getElementById('createCampaign');
    
    if (prevBtn) prevBtn.style.display = currentStep === 1 ? 'none' : 'inline-block';
    if (nextBtn) nextBtn.style.display = currentStep === maxSteps ? 'none' : 'inline-block';
    if (createBtn) {
        if (currentStep === maxSteps) {
            createBtn.style.display = 'inline-block';
            createBtn.classList.remove('d-none');
        } else {
            createBtn.style.display = 'none';
            createBtn.classList.add('d-none');
        }
    }
    
    // Update review section when reaching step 5
    if (currentStep === 5) {
        updateReviewSection();
    }
}

function createCampaign() {
    // Get service line from form or default
    const serviceLine = document.querySelector('#step-1 select')?.value || 'Healthcare';
    const objective = document.querySelector('#step-1 input[type="text"]')?.value || 'Marketing Campaign';
    
    const budget = campaignData.totalBudget || 50000;
    const newCampaignId = Date.now();
    
    // Create approval object - campaign only exists in approvals until approved
    const newApproval = {
        id: newCampaignId,
        title: `${serviceLine} Campaign - ${objective.substring(0, 30)}${objective.length > 30 ? '...' : ''}`,
        description: `Budget: ₹${budget.toLocaleString()} • Duration: 30 days`,
        requestedBy: 'Marketing Team',
        requestedTime: 'Just now',
        type: 'campaign',
        status: 'pending',
        campaignData: { 
            ...campaignData, 
            serviceLine, 
            objective,
            channels: Object.entries(campaignData.channels || {})
                .filter(([_, config]) => config.enabled)
                .map(([channel, _]) => channel.charAt(0).toUpperCase() + channel.slice(1))
                .join(', ') || 'Google, Meta'
        },
        details: {
            budget: budget,
            duration: 30,
            serviceLine: serviceLine,
            targetAudience: `Ages ${campaignData.segments?.ageMin || 25}-${campaignData.segments?.ageMax || 65}, ${campaignData.segments?.gender || 'All'} gender`,
            channels: Object.entries(campaignData.channels || {})
                .filter(([_, config]) => config.enabled)
                .map(([channel, _]) => channel.charAt(0).toUpperCase() + channel.slice(1))
                .join(', ') || 'Google, Meta',
            totalAssets: Object.values(campaignData.assets || {}).reduce((sum, arr) => sum + (arr?.length || 0), 0)
        }
    };
    
    // Add ONLY to pending approvals (not to campaigns table yet)
    pendingApprovals.push(newApproval);
    
    // Update sections
    updateAssetsSection();
    updateApprovalsSection();
    
    // Show success message
    showToast('Campaign submitted for approval successfully!', 'success');
    
    // Close modal
    const modal = bootstrap.Modal.getInstance(document.getElementById('campaignModal'));
    modal.hide();
    
    // Switch to approvals section to show the new campaign
    setTimeout(() => {
        showSection('approvals');
        // Update navigation active states
        document.querySelectorAll('.sidebar-nav .nav-link').forEach(link => {
            link.classList.remove('active');
        });
        document.querySelector('[data-section="approvals"]').classList.add('active');
    }, 500);
}

// Compare Modal
function openCompareModal() {
    const modal = new bootstrap.Modal(document.getElementById('compareModal'));
    modal.show();
}

// Sidebar Toggle Function
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const mainContent = document.querySelector('.main-content');
    
    if (sidebar && mainContent) {
        sidebar.classList.toggle('collapsed');
        mainContent.classList.toggle('sidebar-collapsed');
        
        // Update chart sizes after sidebar toggle
        setTimeout(() => {
            if (callsChart) callsChart.resize();
            if (roiChart) roiChart.resize();
        }, 350); // Wait for transition to complete
        
        // Save state to localStorage
        const isCollapsed = sidebar.classList.contains('collapsed');
        localStorage.setItem('sidebarCollapsed', isCollapsed);
    }
}

// Initialize Sidebar State
function initializeSidebarState() {
    const isCollapsed = localStorage.getItem('sidebarCollapsed') === 'true';
    const sidebar = document.getElementById('sidebar');
    const mainContent = document.querySelector('.main-content');
    
    if (isCollapsed && sidebar && mainContent) {
        // Use setTimeout to ensure DOM is ready
        setTimeout(() => {
            sidebar.classList.add('collapsed');
            mainContent.classList.add('sidebar-collapsed');
        }, 100);
    }
}

// Chart Initialization
function initializeCharts() {
    initializeTrendsChart();
    initializeROIChart();
    initializeServiceBubbleChart();
}

function initializeTrendsChart() {
    const ctx = document.getElementById('trendsChart');
    if (!ctx) return;
    
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
    
    callsChart = new Chart(ctx, {
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
}

function initializeROIChart() {
    const ctx = document.getElementById('roiChart');
    if (!ctx) return;
    
    roiChart = new Chart(ctx, {
        type: 'bar',
        data: mockData.roiData,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
                    },
                    ticks: {
                        callback: function(value) {
                            return value + '%';
                        }
                    }
                },
                x: {
                    grid: {
                        display: false
                    }
                }
            }
        }
    });
}

function initializeServiceBubbleChart() {
    const ctx = document.getElementById('serviceBubbleChart');
    if (!ctx) return;
    
    // Service line data: performance, cost per lead, number of leads
    const serviceData = [
        { name: 'Cardiology', performance: 92, cpl: 380, leads: 456, category: 'excellent' },
        { name: 'Dermatology', performance: 78, cpl: 395, leads: 198, category: 'good' },
        { name: 'Gynecology', performance: 82, cpl: 365, leads: 267, category: 'good' },
        { name: 'Pediatrics', performance: 85, cpl: 350, leads: 312, category: 'good' },
        { name: 'Psychiatry', performance: 58, cpl: 485, leads: 124, category: 'average' },
        { name: 'Neurology', performance: 62, cpl: 520, leads: 156, category: 'average' },
        { name: 'Orthopedics', performance: 68, cpl: 425, leads: 234, category: 'average' },
        { name: 'Oncology', performance: 35, cpl: 680, leads: 89, category: 'poor' }
    ];
    
    // Color mapping based on performance categories
    const colorMap = {
        'excellent': 'rgba(40, 167, 69, 0.7)',
        'good': 'rgba(23, 162, 184, 0.7)',
        'average': 'rgba(255, 193, 7, 0.7)',
        'poor': 'rgba(220, 53, 69, 0.7)'
    };
    
    const borderColorMap = {
        'excellent': 'rgba(40, 167, 69, 1)',
        'good': 'rgba(23, 162, 184, 1)',
        'average': 'rgba(255, 193, 7, 1)',
        'poor': 'rgba(220, 53, 69, 1)'
    };
    
    // Create datasets for each service
    const bubbleData = serviceData.map(service => ({
        label: service.name,
        data: [{
            x: service.cpl,          // Cost per lead on x-axis
            y: service.performance,  // Performance on y-axis
            r: Math.sqrt(service.leads) / 1.5  // Bubble size based on leads (scaled for visibility)
        }],
        backgroundColor: colorMap[service.category],
        borderColor: borderColorMap[service.category],
        borderWidth: 2,
        hoverBackgroundColor: colorMap[service.category],
        hoverBorderColor: borderColorMap[service.category],
        hoverBorderWidth: 3
    }));
    
    new Chart(ctx, {
        type: 'bubble',
        data: {
            datasets: bubbleData
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true,
                    position: 'right',
                    labels: {
                        usePointStyle: true,
                        padding: 15,
                        font: {
                            size: 11
                        }
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const service = serviceData[context.datasetIndex];
                            return [
                                `${service.name}`,
                                `Performance: ${service.performance}%`,
                                `Cost per Lead: ₹${service.cpl}`,
                                `Total Leads: ${service.leads}`
                            ];
                        }
                    }
                }
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Cost Per Lead (₹)',
                        font: {
                            size: 13,
                            weight: 'bold'
                        }
                    },
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
                    },
                    ticks: {
                        callback: function(value) {
                            return '₹' + value;
                        }
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Performance Score (%)',
                        font: {
                            size: 13,
                            weight: 'bold'
                        }
                    },
                    min: 0,
                    max: 100,
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
                    },
                    ticks: {
                        callback: function(value) {
                            return value + '%';
                        }
                    }
                }
            },
            onClick: (event, elements) => {
                if (elements.length > 0) {
                    const datasetIndex = elements[0].datasetIndex;
                    const service = serviceData[datasetIndex];
                    showDepartmentDetails(service.name, service.performance, service.name.toLowerCase());
                }
            }
        }
    });
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
    
    // Note: Bubble chart clicks are handled within the chart initialization
    // The old circular heatmap segment clicks have been replaced by bubble chart onClick event
    
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
}

// Handle KPI Card Clicks
function handleKPIClick(kpiType) {
    switch(kpiType) {
        case 'campaigns':
            showSection('campaigns');
            document.querySelector('[data-section="campaigns"]').classList.add('active');
            document.querySelector('[data-section="dashboard"]').classList.remove('active');
            break;
        case 'leads':
            showSection('leads');
            document.querySelector('[data-section="leads"]').classList.add('active');
            document.querySelector('[data-section="dashboard"]').classList.remove('active');
            break;
        case 'cpl':
        case 'budget':
            showSection('reports');
            document.querySelector('[data-section="reports"]').classList.add('active');
            document.querySelector('[data-section="dashboard"]').classList.remove('active');
            break;
        case 'ai-recommendations':
            showSection('recommendations');
            document.querySelector('[data-section="recommendations"]').classList.add('active');
            document.querySelector('[data-section="dashboard"]').classList.remove('active');
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
    
    showAlert(alertMessage, 'info', true);
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
    if (!callsChart) return;
    
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
    
    callsChart.data.labels = newData.labels;
    callsChart.data.datasets[0].data = newData.leads;
    callsChart.data.datasets[1].data = newData.cpl;
    callsChart.update('active');
}

// Update Charts Data (when date range changes)
function updateChartsData() {
    const startDate = document.getElementById('startDate')?.value;
    const endDate = document.getElementById('endDate')?.value;
    
    // Mock: Generate new data based on date range
    if (callsChart) {
        const newLeadsData = Array.from({length: 7}, () => Math.floor(Math.random() * 100) + 200);
        const newCPLData = Array.from({length: 7}, () => Math.floor(Math.random() * 200) + 300);
        
        callsChart.data.datasets[0].data = newLeadsData;
        callsChart.data.datasets[1].data = newCPLData;
        callsChart.update('active');
    }
    
    // Update KPIs as well
    updateKPIs();
    
    showAlert(`Data updated for period: ${startDate} to ${endDate}`, 'info');
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

// Settings Navigation
function setupSettingsNavigation() {
    // This function is called during initialization
}

function handleSettingsTabClick(e) {
    e.preventDefault();
    
    const targetTab = e.currentTarget.getAttribute('data-settings-tab');
    
    // Update active state
    document.querySelectorAll('[data-settings-tab]').forEach(tab => {
        tab.classList.remove('active');
    });
    e.currentTarget.classList.add('active');
    
    // Show target content
    document.querySelectorAll('.settings-content').forEach(content => {
        content.classList.remove('active');
    });
    
    const targetContent = document.getElementById(`settings-${targetTab}`);
    if (targetContent) {
        targetContent.classList.add('active');
    }
}

// Asset Tab Handler
function handleAssetTabClick(e) {
    // Bootstrap handles this automatically, but we can add custom logic here
    console.log('Asset tab clicked:', e.target.getAttribute('href'));
}

// Responsive Navigation
function setupResponsiveNavigation() {
    const sidebarToggle = document.getElementById('sidebar-toggle');
    const sidebar = document.getElementById('sidebar');
    
    if (sidebarToggle && sidebar) {
        sidebarToggle.addEventListener('click', function() {
            sidebar.classList.toggle('show');
        });
        
        // Close sidebar when clicking outside on mobile
        document.addEventListener('click', function(e) {
            if (window.innerWidth < 1200 && 
                !sidebar.contains(e.target) && 
                !sidebarToggle.contains(e.target) &&
                sidebar.classList.contains('show')) {
                sidebar.classList.remove('show');
            }
        });
    }
    
    // Handle window resize
    window.addEventListener('resize', function() {
        const sidebar = document.getElementById('sidebar');
        if (window.innerWidth >= 1200 && sidebar) {
            sidebar.classList.remove('show');
        }
    });
}

// Mock Interactions
function setupMockInteractions() {
    // Campaign table interactions
    document.querySelectorAll('.table tbody tr').forEach(row => {
        row.addEventListener('click', function() {
            this.style.backgroundColor = 'rgba(0, 102, 204, 0.1)';
            setTimeout(() => {
                this.style.backgroundColor = '';
            }, 200);
        });
    });
    
    // Button hover effects
    document.querySelectorAll('.btn').forEach(btn => {
        btn.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-1px)';
        });
        
        btn.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
    
    // Form validation mock
    document.querySelectorAll('input, select, textarea').forEach(input => {
        input.addEventListener('blur', function() {
            if (this.value.trim() === '' && this.hasAttribute('required')) {
                this.classList.add('is-invalid');
            } else {
                this.classList.remove('is-invalid');
                this.classList.add('is-valid');
            }
        });
        
        input.addEventListener('input', function() {
            this.classList.remove('is-invalid', 'is-valid');
        });
    });
    
    // Mock approval buttons
    document.querySelectorAll('.approval-actions .btn-success').forEach(btn => {
        btn.addEventListener('click', function() {
            const item = this.closest('.approval-item');
            if (item) {
                item.style.transition = 'all 0.3s ease';
                item.style.opacity = '0.5';
                item.style.transform = 'translateX(20px)';
                
                setTimeout(() => {
                    item.remove();
                    showAlert('Item approved successfully!', 'success');
                }, 300);
            }
        });
    });
    
    document.querySelectorAll('.approval-actions .btn-danger').forEach(btn => {
        btn.addEventListener('click', function() {
            const item = this.closest('.approval-item');
            if (item) {
                item.style.transition = 'all 0.3s ease';
                item.style.opacity = '0.5';
                item.style.transform = 'translateX(-20px)';
                
                setTimeout(() => {
                    item.remove();
                    showAlert('Item rejected!', 'warning');
                }, 300);
            }
        });
    });
    
    // Mock asset actions
    document.querySelectorAll('.asset-actions .btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const action = this.textContent.trim();
            showAlert(`${action} action triggered!`, 'info');
        });
    });
    
    // Mock lead contact buttons
    document.querySelectorAll('.table .btn-primary').forEach(btn => {
        if (btn.textContent.includes('Contact')) {
            btn.addEventListener('click', function() {
                showAlert('Initiating contact with lead...', 'info');
                this.textContent = 'Contacting...';
                this.disabled = true;
                
                setTimeout(() => {
                    this.textContent = 'Contact';
                    this.disabled = false;
                    showAlert('Contact initiated successfully!', 'success');
                }, 2000);
            });
        }
    });
}

// Handle Form Submissions
function handleOnboardingSubmit(e) {
    e.preventDefault();
    
    // Mock form processing
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    
    submitBtn.textContent = 'Saving...';
    submitBtn.disabled = true;
    
    setTimeout(() => {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        showAlert('Hospital profile saved successfully!', 'success');
    }, 1500);
}

// Update Competitor Data (mock function)
function updateCompetitorData(radius) {
    // Mock: Update competitor list based on radius
    console.log(`Updating competitor data for radius: ${radius}km`);
    
    // You could update the competitor list here
    const competitorItems = document.querySelectorAll('.competitor-item');
    competitorItems.forEach((item, index) => {
        const distance = parseFloat(item.querySelector('small').textContent);
        if (distance > radius) {
            item.style.opacity = '0.5';
        } else {
            item.style.opacity = '1';
        }
    });
}

// Utility Functions
function showAlert(message, type = 'info', isHTML = false) {
    // Create alert element
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show position-fixed`;
    alertDiv.style.cssText = 'top: 20px; right: 20px; z-index: 9999; min-width: 300px; max-width: 400px;';
    
    if (isHTML) {
        alertDiv.innerHTML = `
            <div class="alert-content">${message}</div>
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
    } else {
        alertDiv.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
    }
    
    document.body.appendChild(alertDiv);
    
    // Auto-remove after 8 seconds for HTML alerts, 5 seconds for regular
    const timeout = isHTML ? 8000 : 5000;
    setTimeout(() => {
        if (alertDiv.parentNode) {
            alertDiv.remove();
        }
    }, timeout);
}

// Toast notifications
function showToast(message, type = 'info') {
    // Create toast container if it doesn't exist
    let toastContainer = document.querySelector('.toast-container');
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.classList.add('toast-container', 'position-fixed', 'top-0', 'end-0', 'p-3');
        toastContainer.style.zIndex = '1055';
        document.body.appendChild(toastContainer);
    }
    
    // Create unique ID for toast
    const toastId = 'toast-' + Date.now();
    
    // Create toast element
    const toastHTML = `
        <div id="${toastId}" class="toast ${type}" role="alert" aria-live="assertive" aria-atomic="true">
            <div class="toast-header">
                <i class="fas ${type === 'success' ? 'fa-check-circle text-success' : 
                               type === 'error' ? 'fa-exclamation-circle text-danger' : 
                               type === 'warning' ? 'fa-exclamation-triangle text-warning' : 
                               'fa-info-circle text-info'} me-2"></i>
                <strong class="me-auto">${type.charAt(0).toUpperCase() + type.slice(1)}</strong>
                <small class="text-muted">now</small>
                <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
            </div>
            <div class="toast-body">
                ${message}
            </div>
        </div>
    `;
    
    toastContainer.insertAdjacentHTML('beforeend', toastHTML);
    
    // Initialize Bootstrap toast
    const toastElement = document.getElementById(toastId);
    const bsToast = new bootstrap.Toast(toastElement, {
        delay: 4000
    });
    bsToast.show();
    
    // Remove toast element after it's hidden
    toastElement.addEventListener('hidden.bs.toast', () => {
        toastElement.remove();
    });
}

function generateRandomData(length, min = 0, max = 100) {
    return Array.from({length}, () => Math.floor(Math.random() * (max - min + 1)) + min);
}

function formatCurrency(amount) {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 0
    }).format(amount);
}

function formatNumber(number) {
    return new Intl.NumberFormat('en-IN').format(number);
}

// Local Storage Functions
function saveToLocalStorage(key, data) {
    try {
        localStorage.setItem(key, JSON.stringify(data));
    } catch (e) {
        console.error('Failed to save to localStorage:', e);
    }
}

function getFromLocalStorage(key, defaultValue = null) {
    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : defaultValue;
    } catch (e) {
        console.error('Failed to read from localStorage:', e);
        return defaultValue;
    }
}

// Window Resize Handler
window.addEventListener('resize', function() {
    // Update charts on resize
    if (callsChart) callsChart.resize();
    if (campaignChart) campaignChart.resize();
    if (roiChart) roiChart.resize();
    
    // Handle sidebar on desktop/mobile switch
    const sidebar = document.getElementById('sidebar');
    if (window.innerWidth >= 1200) {
        sidebar.classList.remove('show');
    }
});

// Keyboard Navigation
document.addEventListener('keydown', function(e) {
    // Escape key closes modals
    if (e.key === 'Escape') {
        const openModals = document.querySelectorAll('.modal.show');
        openModals.forEach(modal => {
            const modalInstance = bootstrap.Modal.getInstance(modal);
            if (modalInstance) modalInstance.hide();
        });
    }
    
    // Ctrl/Cmd + N for new campaign
    if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
        e.preventDefault();
        openCampaignModal();
    }
});

// Initialize tooltips and popovers if needed
document.addEventListener('DOMContentLoaded', function() {
    // Initialize Bootstrap tooltips
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
    
    // Initialize Bootstrap popovers
    const popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'));
    popoverTriggerList.map(function (popoverTriggerEl) {
        return new bootstrap.Popover(popoverTriggerEl);
    });
});

// Campaign Wizard Functionality
function setupCampaignWizardListeners() {
    // Step 2: Segments
    const locationRadius = document.getElementById('locationRadius');
    const radiusDisplay = document.getElementById('radiusDisplay');
    
    if (locationRadius && radiusDisplay) {
        locationRadius.addEventListener('input', function() {
            radiusDisplay.textContent = this.value;
            campaignData.segments.radius = parseInt(this.value);
        });
    }
    
    // Segment removal
    document.addEventListener('click', function(e) {
        if (e.target.closest('.segment-tag i')) {
            e.target.closest('.segment-tag').remove();
        }
    });
    
    // Add segment button
    const addSegmentBtn = document.getElementById('addSegmentBtn');
    if (addSegmentBtn) {
        addSegmentBtn.addEventListener('click', function() {
            const segmentTags = document.querySelector('.segment-tags');
            const newTag = document.createElement('span');
            newTag.className = 'badge bg-secondary me-2 mb-2 segment-tag';
            newTag.innerHTML = 'New Segment <i class="fas fa-times ms-1"></i>';
            segmentTags.insertBefore(newTag, this);
        });
    }
    
    // Step 3: Assets Generation
    const generateAssetsBtn = document.getElementById('generateAssetsBtn');
    if (generateAssetsBtn) {
        generateAssetsBtn.addEventListener('click', generateAssets);
    }
    
    // Step 4: Channel Checkboxes and Budget Sliders
    document.querySelectorAll('.channel-checkbox').forEach(checkbox => {
        checkbox.addEventListener('change', updateChannelBudgets);
    });
    
    document.querySelectorAll('.budget-slider').forEach(slider => {
        slider.addEventListener('input', updateChannelBudgets);
    });
    
    // Initialize budget display
    updateChannelBudgets();
    
    // Set default dates
    const today = new Date();
    const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    const nextMonth = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);
    
    const startDateField = document.getElementById('campaignStartDate');
    const endDateField = document.getElementById('campaignEndDate');
    
    if (startDateField) startDateField.value = nextWeek.toISOString().split('T')[0];
    if (endDateField) endDateField.value = nextMonth.toISOString().split('T')[0];
}

function generateAssets() {
    const generateBtn = document.getElementById('generateAssetsBtn');
    const originalText = generateBtn.innerHTML;
    
    // Show loading state
    generateBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-1"></i>Generating...';
    generateBtn.disabled = true;
    
    setTimeout(() => {
        // Mock asset generation
        const assetTemplates = {
            email: [
                'Subject: Schedule Your Heart Health Checkup Today',
                'Subject: Expert Cardiology Care - Book Now',
                'Subject: Don\'t Wait - Your Heart Health Matters'
            ],
            sms: [
                'Book your cardiology consultation today. Expert care awaits. Call: 040-12345678',
                'Priority heart health checkup available. Limited slots. Book now: bit.ly/heartcare',
                'Cardiac screening package - 30% off this month. Schedule: hospitalcare.com'
            ],
            social: [
                'Facebook Ad: Expert cardiology care with state-of-the-art facilities',
                'Instagram Story: Heart health matters - book your consultation today',
                'Facebook Carousel: Meet our cardiology specialists'
            ],
            whatsapp: [
                'Hello! Schedule your cardiology consultation with our expert team. Reply YES to book.',
                'Cardiac health checkup reminder. Book your appointment: wa.me/919876543210'
            ]
        };
        
        // Populate assets
        Object.keys(assetTemplates).forEach(type => {
            const container = document.getElementById(`${type}AssetsList`);
            const checkbox = document.getElementById(`${type}Assets`);
            
            if (container && checkbox && checkbox.checked) {
                container.innerHTML = '';
                assetTemplates[type].forEach(asset => {
                    const assetDiv = document.createElement('div');
                    assetDiv.className = 'asset-item';
                    assetDiv.textContent = asset;
                    container.appendChild(assetDiv);
                });
                container.classList.add('has-assets');
                
                // Update campaign data
                campaignData.assets[type] = assetTemplates[type];
            }
        });
        
        // Update generated count
        const totalAssets = Object.values(campaignData.assets).reduce((sum, arr) => sum + arr.length, 0);
        document.querySelector('.generated-count .badge').textContent = `${totalAssets} Assets Generated`;
        
        // Reset button
        generateBtn.innerHTML = originalText;
        generateBtn.disabled = false;
        
        showAlert('Campaign assets generated successfully!', 'success');
    }, 2000);
}

function updateChannelBudgets() {
    let totalBudget = 0;
    const budgetBreakdown = document.getElementById('budgetBreakdown');
    
    if (budgetBreakdown) {
        budgetBreakdown.innerHTML = '';
        
        document.querySelectorAll('.channel-checkbox').forEach(checkbox => {
            const channelName = checkbox.nextElementSibling.textContent.trim();
            const slider = checkbox.closest('.channel-item').querySelector('.budget-slider');
            const budgetDisplay = checkbox.closest('.channel-item').querySelector('.budget-display span');
            const channel = slider.dataset.channel;
            
            if (checkbox.checked) {
                const budget = parseInt(slider.value);
                totalBudget += budget;
                
                // Update display
                budgetDisplay.textContent = budget.toLocaleString();
                
                // Add to breakdown
                const breakdownItem = document.createElement('div');
                breakdownItem.className = 'budget-item';
                breakdownItem.innerHTML = `
                    <span class="channel-name">${channelName.split('\n')[0]}</span>
                    <span class="channel-amount">₹${budget.toLocaleString()}</span>
                `;
                budgetBreakdown.appendChild(breakdownItem);
                
                // Update campaign data
                campaignData.channels[channel] = { enabled: true, budget: budget };
            } else {
                campaignData.channels[channel] = { enabled: false, budget: parseInt(slider.value) };
            }
        });
    }
    
    campaignData.totalBudget = totalBudget;
    const totalBudgetElement = document.getElementById('totalBudget');
    if (totalBudgetElement) {
        totalBudgetElement.textContent = totalBudget.toLocaleString();
    }
}

function updateReviewSection() {
    // Objective Review
    const reviewObjective = document.getElementById('reviewObjective');
    if (reviewObjective) {
        const objective = document.querySelector('#step-1 input[type="text"]')?.value || 'Increase cardiology consult requests by 20%';
        const campaignType = document.querySelector('#step-1 select')?.value || 'Awareness';
        const serviceLine = document.querySelector('#step-1 select:nth-of-type(2)')?.value || 'Cardiology';
        
        reviewObjective.innerHTML = `
            <p><strong>Objective:</strong> ${objective}</p>
            <p><strong>Type:</strong> ${campaignType}</p>
            <p><strong>Service Line:</strong> ${serviceLine}</p>
        `;
    }
    
    // Segments Review
    const reviewSegments = document.getElementById('reviewSegments');
    if (reviewSegments) {
        const ageMin = document.getElementById('ageMin')?.value || '25';
        const ageMax = document.getElementById('ageMax')?.value || '65';
        const gender = document.getElementById('genderSelect')?.value || 'All';
        const radius = document.getElementById('locationRadius')?.value || '15';
        const patientType = document.querySelector('input[name="patientType"]:checked')?.nextElementSibling?.textContent || 'New Patients';
        
        reviewSegments.innerHTML = `
            <p><strong>Age Range:</strong> ${ageMin} - ${ageMax} years</p>
            <p><strong>Gender:</strong> ${gender}</p>
            <p><strong>Location Radius:</strong> ${radius} km</p>
            <p><strong>Patient Type:</strong> ${patientType}</p>
        `;
    }
    
    // Assets Review
    const reviewAssets = document.getElementById('reviewAssets');
    if (reviewAssets) {
        const totalAssets = Object.values(campaignData.assets).reduce((sum, arr) => sum + arr.length, 0);
        reviewAssets.innerHTML = `
            <p><strong>Total Assets Generated:</strong> ${totalAssets}</p>
            <div class="asset-summary">
                ${campaignData.assets.email.length > 0 ? `<span class="badge bg-primary me-2">Email: ${campaignData.assets.email.length}</span>` : ''}
                ${campaignData.assets.sms.length > 0 ? `<span class="badge bg-success me-2">SMS: ${campaignData.assets.sms.length}</span>` : ''}
                ${campaignData.assets.social.length > 0 ? `<span class="badge bg-info me-2">Social: ${campaignData.assets.social.length}</span>` : ''}
                ${campaignData.assets.whatsapp.length > 0 ? `<span class="badge bg-success me-2">WhatsApp: ${campaignData.assets.whatsapp.length}</span>` : ''}
            </div>
        `;
    }
    
    // Channels Review
    const reviewChannels = document.getElementById('reviewChannels');
    if (reviewChannels) {
        const enabledChannels = Object.entries(campaignData.channels)
            .filter(([_, data]) => data.enabled)
            .map(([channel, data]) => `${channel.charAt(0).toUpperCase() + channel.slice(1)}: ₹${data.budget.toLocaleString()}`)
            .join(', ');
        
        reviewChannels.innerHTML = `
            <p><strong>Selected Channels:</strong> ${enabledChannels}</p>
            <p><strong>Total Budget:</strong> ₹${campaignData.totalBudget.toLocaleString()}</p>
            <p><strong>Duration:</strong> ${document.getElementById('campaignStartDate')?.value || 'Not set'} to ${document.getElementById('campaignEndDate')?.value || 'Not set'}</p>
        `;
    }
}

function createCampaign() {
    const launchOption = document.querySelector('input[name="launchOption"]:checked')?.id;
    
    let actionText = 'Campaign created successfully!';
    let actionType = 'success';
    
    switch(launchOption) {
        case 'launchNow':
            actionText = 'Campaign launched successfully! It will be live within 30 minutes.';
            break;
        case 'saveAsDraft':
            actionText = 'Campaign saved as draft. You can edit and launch it later.';
            actionType = 'info';
            break;
        case 'submitForApproval':
            actionText = 'Campaign submitted for approval. You will be notified once approved.';
            actionType = 'warning';
            break;
    }
    
    // Show loading state
    const createBtn = document.getElementById('createCampaign');
    const originalText = createBtn.innerHTML;
    createBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-1"></i>Processing...';
    createBtn.disabled = true;
    
    setTimeout(() => {
        showAlert(actionText, actionType);
        
        // Close modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('campaignModal'));
        modal.hide();
        
        // Reset form
        resetCampaignWizard();
        
        // Switch to campaigns section to show the new campaign
        setTimeout(() => {
            showSection('campaigns');
            document.querySelector('[data-section="campaigns"]').classList.add('active');
            document.querySelector('[data-section="dashboard"]').classList.remove('active');
            
            // Add the new campaign to the table (mock)
            addNewCampaignToTable(launchOption);
        }, 500);
        
        // Reset button
        createBtn.innerHTML = originalText;
        createBtn.disabled = false;
    }, 2000);
}

function addNewCampaignToTable(launchOption) {
    const tbody = document.querySelector('#campaigns-section .table tbody');
    if (tbody) {
        const statusMap = {
            'launchNow': '<span class="badge bg-success">Active</span>',
            'saveAsDraft': '<span class="badge bg-secondary">Draft</span>',
            'submitForApproval': '<span class="badge bg-warning">Pending Approval</span>'
        };
        
        const newRow = document.createElement('tr');
        newRow.innerHTML = `
            <td><input type="checkbox" class="form-check-input"></td>
            <td>New Cardiology Campaign</td>
            <td><span class="badge bg-info">Awareness</span></td>
            <td>${statusMap[launchOption] || statusMap['launchNow']}</td>
            <td>₹${campaignData.totalBudget.toLocaleString()}</td>
            <td>0</td>
            <td>₹0</td>
            <td>0%</td>
            <td>
                <button class="btn btn-sm btn-outline-primary me-1">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-sm btn-outline-secondary">
                    <i class="fas fa-pause"></i>
                </button>
            </td>
        `;
        tbody.insertBefore(newRow, tbody.firstChild);
        
        // Highlight the new row
        newRow.style.backgroundColor = 'rgba(40, 167, 69, 0.1)';
        setTimeout(() => {
            newRow.style.backgroundColor = '';
        }, 3000);
    }
}

// Update Assets Section with created assets
function updateAssetsSection() {
    const assetsContent = document.getElementById('assets-content');
    if (!assetsContent) return;

    // Update the assets tabs with campaign assets
    const allAssetsTab = document.querySelector('#all-assets-tab');
    if (allAssetsTab) {
        let assetsHTML = '<div class="row">';
        
        // Add assets from campaign data
        Object.entries(campaignData.assets).forEach(([type, assets]) => {
            assets.forEach((asset, index) => {
                const assetId = `${type}-${index}`;
                assetsHTML += `
                    <div class="col-md-4 mb-3">
                        <div class="card">
                            <div class="card-body">
                                <div class="asset-preview ${type === 'email' ? 'bg-light text-dark' : type === 'sms' ? 'bg-info' : type === 'whatsapp' ? 'bg-success' : 'bg-primary'} text-white mb-3">
                                    <i class="fas ${type === 'email' ? 'fa-envelope' : type === 'sms' ? 'fa-sms' : type === 'whatsapp' ? 'fa-whatsapp' : 'fa-share-alt'}"></i>
                                </div>
                                <div class="asset-info">
                                    <h6>${asset.title}</h6>
                                    <p class="text-muted">${type.toUpperCase()} Asset</p>
                                    <p><small><strong>Status:</strong> <span class="badge bg-success">Ready</span></small></p>
                                    <small class="text-muted">
                                        ${asset.lastModified ? 
                                            `Modified: ${new Date(asset.lastModified).toLocaleDateString()}` : 
                                            `Created: ${new Date().toLocaleDateString()}`
                                        }
                                    </small>
                                    ${asset.lastModified ? '<br><small class="text-info"><i class="fas fa-edit"></i> Edited</small>' : ''}
                                </div>
                                <div class="mt-2">
                                    <button class="btn btn-sm btn-outline-primary me-2" onclick="previewAsset('${assetId}')">
                                        <i class="fas fa-eye"></i> Preview
                                    </button>
                                    <button class="btn btn-sm btn-outline-secondary" onclick="editAsset('${assetId}')">
                                        <i class="fas fa-edit"></i> Edit
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
            });
        });
        
        if (Object.values(campaignData.assets).every(arr => arr.length === 0)) {
            assetsHTML = '<div class="text-center py-5"><p class="text-muted">No assets created yet. Create a campaign to generate assets.</p></div>';
        }
        
        assetsHTML += '</div>';
        allAssetsTab.innerHTML = assetsHTML;
    }
}

// Preview asset function
function previewAsset(assetId) {
    const [type, index] = assetId.split('-');
    const asset = campaignData.assets[type][parseInt(index)];
    
    if (!asset) return;
    
    let previewHTML = '';
    
    switch(type) {
        case 'email':
            previewHTML = `
                <div class="email-preview">
                    <div class="email-header p-3 bg-light border-bottom">
                        <h6>Subject: ${asset.subject || asset.title}</h6>
                        <small class="text-muted">From: Apollo Hospital <noreply@apollo.com></small>
                    </div>
                    <div class="email-body p-3">
                        <p>${asset.content}</p>
                        <div class="text-center mt-3">
                            <button class="btn btn-primary">${asset.cta || 'Book Appointment'}</button>
                        </div>
                    </div>
                </div>
            `;
            break;
        case 'sms':
            previewHTML = `
                <div class="sms-preview">
                    <div class="sms-bubble">${asset.content}</div>
                    <small class="text-muted">SMS Preview - 160 characters</small>
                </div>
            `;
            break;
        case 'whatsapp':
            previewHTML = `
                <div class="whatsapp-preview">
                    <div class="whatsapp-bubble bg-success text-white p-3 rounded">
                        <p class="mb-2">${asset.content}</p>
                        <small>Book your appointment: bit.ly/apollo-booking</small>
                    </div>
                </div>
            `;
            break;
        case 'social':
            const platformIcon = {
                'facebook': 'fab fa-facebook text-primary',
                'instagram': 'fab fa-instagram text-danger',
                'twitter': 'fab fa-twitter text-info',
                'linkedin': 'fab fa-linkedin text-primary'
            };
            
            previewHTML = `
                <div class="social-preview">
                    <div class="card">
                        <div class="card-header d-flex align-items-center">
                            <i class="${platformIcon[asset.platform] || 'fas fa-share-alt'} me-2"></i>
                            <span>${(asset.platform || 'social').charAt(0).toUpperCase() + (asset.platform || 'social').slice(1)} Post</span>
                        </div>
                        <div class="image-placeholder text-center py-4">
                            <i class="fas fa-image fa-3x text-muted"></i>
                            <p class="mt-2 text-muted">Social Media Image</p>
                        </div>
                        <div class="card-body">
                            <p>${asset.content}</p>
                            ${asset.hashtags ? `<p class="text-primary">${asset.hashtags}</p>` : ''}
                            <div class="d-flex justify-content-between text-muted">
                                <span><i class="fas fa-heart"></i> 24</span>
                                <span><i class="fas fa-comment"></i> 8</span>
                                <span><i class="fas fa-share"></i> 12</span>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            break;
    }
    
    // Show preview in modal
    const modalHTML = `
        <div class="modal fade" id="assetPreviewModal" tabindex="-1">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Asset Preview - ${asset.title}</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        ${previewHTML}
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        <button type="button" class="btn btn-primary">Use Asset</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Remove existing modal if any
    const existingModal = document.getElementById('assetPreviewModal');
    if (existingModal) {
        existingModal.remove();
    }
    
    // Add modal to body
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // Show modal
    const modal = new bootstrap.Modal(document.getElementById('assetPreviewModal'));
    modal.show();
}

// Edit asset function
function editAsset(assetId) {
    const [type, index] = assetId.split('-');
    const asset = campaignData.assets[type][parseInt(index)];
    
    if (!asset) {
        showToast('Asset not found!', 'error');
        return;
    }
    
    // Create edit modal
    const modalHTML = `
        <div class="modal fade" id="editAssetModal" tabindex="-1">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Edit ${type.toUpperCase()} Asset</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <form id="editAssetForm">
                            <div class="mb-3">
                                <label for="assetTitle" class="form-label">Asset Title</label>
                                <input type="text" class="form-control" id="assetTitle" value="${asset.title}" required>
                            </div>
                            <div class="mb-3">
                                <label for="assetContent" class="form-label">Content</label>
                                <textarea class="form-control" id="assetContent" rows="5" required>${asset.content}</textarea>
                            </div>
                            ${type === 'email' ? `
                                <div class="mb-3">
                                    <label for="emailSubject" class="form-label">Email Subject</label>
                                    <input type="text" class="form-control" id="emailSubject" value="${asset.subject || asset.title}">
                                </div>
                                <div class="mb-3">
                                    <label for="ctaButton" class="form-label">Call-to-Action Button Text</label>
                                    <input type="text" class="form-control" id="ctaButton" value="${asset.cta || 'Book Appointment'}">
                                </div>
                            ` : ''}
                            ${type === 'sms' || type === 'whatsapp' ? `
                                <div class="mb-3">
                                    <small class="text-muted">Character count: <span id="charCount">${asset.content.length}</span>/160</small>
                                </div>
                            ` : ''}
                            ${type === 'social' ? `
                                <div class="mb-3">
                                    <label for="socialPlatform" class="form-label">Platform</label>
                                    <select class="form-select" id="socialPlatform">
                                        <option value="facebook" ${asset.platform === 'facebook' ? 'selected' : ''}>Facebook</option>
                                        <option value="instagram" ${asset.platform === 'instagram' ? 'selected' : ''}>Instagram</option>
                                        <option value="twitter" ${asset.platform === 'twitter' ? 'selected' : ''}>Twitter</option>
                                        <option value="linkedin" ${asset.platform === 'linkedin' ? 'selected' : ''}>LinkedIn</option>
                                    </select>
                                </div>
                                <div class="mb-3">
                                    <label for="hashtags" class="form-label">Hashtags</label>
                                    <input type="text" class="form-control" id="hashtags" value="${asset.hashtags || '#Healthcare #Hospital #Apollo'}" placeholder="#Healthcare #Hospital">
                                </div>
                            ` : ''}
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                        <button type="button" class="btn btn-primary" onclick="saveAssetChanges('${assetId}')">Save Changes</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Remove existing modal if any
    const existingModal = document.getElementById('editAssetModal');
    if (existingModal) {
        existingModal.remove();
    }
    
    // Add modal to body
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // Add character counter for SMS/WhatsApp
    if (type === 'sms' || type === 'whatsapp') {
        const contentTextarea = document.getElementById('assetContent');
        const charCount = document.getElementById('charCount');
        
        contentTextarea.addEventListener('input', function() {
            const count = this.value.length;
            charCount.textContent = count;
            charCount.className = count > 160 ? 'text-danger' : 'text-muted';
        });
    }
    
    // Show modal
    const modal = new bootstrap.Modal(document.getElementById('editAssetModal'));
    modal.show();
}

// Save asset changes function
function saveAssetChanges(assetId) {
    const [type, index] = assetId.split('-');
    const asset = campaignData.assets[type][parseInt(index)];
    
    if (!asset) {
        showToast('Asset not found!', 'error');
        return;
    }
    
    // Get form values
    const title = document.getElementById('assetTitle').value.trim();
    const content = document.getElementById('assetContent').value.trim();
    
    if (!title || !content) {
        showToast('Please fill in all required fields!', 'warning');
        return;
    }
    
    // Update asset object
    asset.title = title;
    asset.content = content;
    asset.lastModified = new Date().toISOString();
    
    // Type-specific updates
    if (type === 'email') {
        const subject = document.getElementById('emailSubject').value.trim();
        const cta = document.getElementById('ctaButton').value.trim();
        asset.subject = subject || title;
        asset.cta = cta || 'Book Appointment';
    }
    
    if (type === 'social') {
        const platform = document.getElementById('socialPlatform').value;
        const hashtags = document.getElementById('hashtags').value.trim();
        asset.platform = platform;
        asset.hashtags = hashtags;
    }
    
    // Validate SMS/WhatsApp character limit
    if ((type === 'sms' || type === 'whatsapp') && content.length > 160) {
        showToast('Content exceeds 160 character limit for SMS/WhatsApp!', 'warning');
        return;
    }
    
    // Close modal
    const modal = bootstrap.Modal.getInstance(document.getElementById('editAssetModal'));
    if (modal) {
        modal.hide();
    }
    
    // Update assets section display
    updateAssetsSection();
    
    // Show success message
    showToast(`${type.toUpperCase()} asset "${title}" updated successfully!`, 'success');
}

// Create new asset function
function createNewAsset(type) {
    const modalHTML = `
        <div class="modal fade" id="createAssetModal" tabindex="-1">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Create New ${type.toUpperCase()} Asset</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <form id="createAssetForm">
                            <div class="mb-3">
                                <label for="newAssetTitle" class="form-label">Asset Title *</label>
                                <input type="text" class="form-control" id="newAssetTitle" required>
                            </div>
                            ${type === 'email' ? `
                                <div class="mb-3">
                                    <label for="newAssetSubject" class="form-label">Email Subject *</label>
                                    <input type="text" class="form-control" id="newAssetSubject" required>
                                </div>
                            ` : ''}
                            <div class="mb-3">
                                <label for="newAssetContent" class="form-label">Content *</label>
                                <textarea class="form-control" id="newAssetContent" rows="6" required placeholder="Enter your ${type} content here..."></textarea>
                            </div>
                            ${type === 'email' ? `
                                <div class="mb-3">
                                    <label for="newAssetCTA" class="form-label">Call-to-Action Button Text</label>
                                    <input type="text" class="form-control" id="newAssetCTA" value="Book Appointment">
                                </div>
                            ` : ''}
                            ${type === 'sms' || type === 'whatsapp' ? `
                                <div class="mb-3">
                                    <small class="text-muted">Character count: <span id="newCharCount">0</span>/160</small>
                                </div>
                            ` : ''}
                            ${type === 'social' ? `
                                <div class="mb-3">
                                    <label for="newAssetPlatform" class="form-label">Platform</label>
                                    <select class="form-select" id="newAssetPlatform">
                                        <option value="facebook">Facebook</option>
                                        <option value="instagram">Instagram</option>
                                        <option value="twitter">Twitter</option>
                                        <option value="linkedin">LinkedIn</option>
                                    </select>
                                </div>
                                <div class="mb-3">
                                    <label for="newAssetHashtags" class="form-label">Hashtags</label>
                                    <input type="text" class="form-control" id="newAssetHashtags" placeholder="#Healthcare #Hospital">
                                </div>
                            ` : ''}
                            ${type === 'image' || type === 'video' ? `
                                <div class="mb-3">
                                    <label for="newAssetFile" class="form-label">Upload ${type.toUpperCase()} *</label>
                                    <input type="file" class="form-control" id="newAssetFile" accept="${type === 'image' ? 'image/*' : 'video/*'}" required>
                                </div>
                                <div class="mb-3">
                                    <label for="newAssetDescription" class="form-label">Description</label>
                                    <textarea class="form-control" id="newAssetDescription" rows="3" placeholder="Brief description of this ${type}..."></textarea>
                                </div>
                            ` : ''}
                            ${type === 'whatsapp' ? `
                                <div class="mb-3">
                                    <small class="text-muted">Character count: <span id="newCharCount">0</span>/1000</small>
                                </div>
                            ` : ''}
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                        <button type="button" class="btn btn-primary" onclick="saveNewAsset('${type}')">Create Asset</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Remove existing modal if any
    const existingModal = document.getElementById('createAssetModal');
    if (existingModal) {
        existingModal.remove();
    }
    
    // Add modal to body
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // Add character counter for SMS/WhatsApp
    if (type === 'sms' || type === 'whatsapp') {
        const contentTextarea = document.getElementById('newAssetContent');
        const charCount = document.getElementById('newCharCount');
        
        contentTextarea.addEventListener('input', function() {
            const count = this.value.length;
            charCount.textContent = count;
            charCount.className = count > 160 ? 'text-danger' : 'text-muted';
        });
    }
    
    // Show modal
    const modal = new bootstrap.Modal(document.getElementById('createAssetModal'));
    modal.show();
}

// Save new asset function
function saveNewAsset(type) {
    const title = document.getElementById('newAssetTitle').value.trim();
    const content = document.getElementById('newAssetContent').value.trim();
    
    if (!title || !content) {
        showToast('Please fill in all required fields!', 'warning');
        return;
    }
    
    // Validate SMS/WhatsApp character limit
    if ((type === 'sms' || type === 'whatsapp') && content.length > 160) {
        showToast('Content exceeds 160 character limit!', 'warning');
        return;
    }
    
    // Create new asset object
    const newAssetId = `new-${type}-${Date.now()}`;
    const newAsset = {
        id: newAssetId,
        title: title,
        content: content,
        created: 'Just now',
        status: 'Draft',
        type: type
    };
    
    // Type-specific properties
    if (type === 'email') {
        newAsset.subject = document.getElementById('newAssetSubject').value.trim() || title;
        newAsset.cta = document.getElementById('newAssetCTA').value.trim() || 'Book Appointment';
    }
    
    if (type === 'social') {
        newAsset.platform = document.getElementById('newAssetPlatform').value;
        newAsset.hashtags = document.getElementById('newAssetHashtags').value.trim();
    }
    
    if (type === 'image' || type === 'video') {
        const fileInput = document.getElementById('newAssetFile');
        const description = document.getElementById('newAssetDescription').value.trim();
        
        if (!fileInput.files || fileInput.files.length === 0) {
            showToast('Please select a file to upload!', 'warning');
            return;
        }
        
        const file = fileInput.files[0];
        newAsset.filename = file.name;
        newAsset.size = formatFileSize(file.size);
        newAsset.description = description;
        
        if (type === 'image') {
            newAsset.dimensions = 'Auto-detected'; // Would be detected from actual image
        } else if (type === 'video') {
            newAsset.duration = 'Auto-detected'; // Would be detected from actual video
            newAsset.dimensions = 'Auto-detected';
        }
        
        newAsset.usage = 'Not used yet';
    }
    
    // Add to template assets
    if (!templateAssets[type]) {
        templateAssets[type] = {};
    }
    templateAssets[type][newAssetId] = newAsset;
    
    // Close modal
    const modal = bootstrap.Modal.getInstance(document.getElementById('createAssetModal'));
    if (modal) {
        modal.hide();
    }
    
    // Refresh assets section
    refreshTemplateAssets(type);
    
    // Show success message
    showToast(`New ${type.toUpperCase()} asset "${title}" created successfully!`, 'success');
}

// Edit template asset function
function editTemplateAsset(type, assetId) {
    const asset = templateAssets[type] && templateAssets[type][assetId];
    
    if (!asset) {
        showToast('Asset not found!', 'error');
        return;
    }
    
    const modalHTML = `
        <div class="modal fade" id="editTemplateModal" tabindex="-1">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Edit ${type.toUpperCase()} Template</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <form id="editTemplateForm">
                            <div class="mb-3">
                                <label for="templateTitle" class="form-label">Asset Title</label>
                                <input type="text" class="form-control" id="templateTitle" value="${asset.title}" required>
                            </div>
                            ${type === 'email' ? `
                                <div class="mb-3">
                                    <label for="templateSubject" class="form-label">Email Subject</label>
                                    <input type="text" class="form-control" id="templateSubject" value="${asset.subject || asset.title}">
                                </div>
                            ` : ''}
                            <div class="mb-3">
                                <label for="templateContent" class="form-label">Content</label>
                                <textarea class="form-control" id="templateContent" rows="8" required>${asset.content}</textarea>
                            </div>
                            ${type === 'email' ? `
                                <div class="mb-3">
                                    <label for="templateCTA" class="form-label">Call-to-Action Button Text</label>
                                    <input type="text" class="form-control" id="templateCTA" value="${asset.cta || 'Book Appointment'}">
                                </div>
                            ` : ''}
                            ${type === 'social' ? `
                                <div class="mb-3">
                                    <label for="templatePlatform" class="form-label">Platform</label>
                                    <select class="form-select" id="templatePlatform">
                                        <option value="facebook" ${asset.platform === 'facebook' ? 'selected' : ''}>Facebook</option>
                                        <option value="instagram" ${asset.platform === 'instagram' ? 'selected' : ''}>Instagram</option>
                                        <option value="twitter" ${asset.platform === 'twitter' ? 'selected' : ''}>Twitter</option>
                                        <option value="linkedin" ${asset.platform === 'linkedin' ? 'selected' : ''}>LinkedIn</option>
                                    </select>
                                </div>
                                <div class="mb-3">
                                    <label for="templateHashtags" class="form-label">Hashtags</label>
                                    <input type="text" class="form-control" id="templateHashtags" value="${asset.hashtags || ''}">
                                </div>
                            ` : ''}
                            <div class="mb-3">
                                <label for="templateStatus" class="form-label">Status</label>
                                <select class="form-select" id="templateStatus">
                                    <option value="Draft" ${asset.status === 'Draft' ? 'selected' : ''}>Draft</option>
                                    <option value="Approved" ${asset.status === 'Approved' ? 'selected' : ''}>Approved</option>
                                    <option value="Archived" ${asset.status === 'Archived' ? 'selected' : ''}>Archived</option>
                                </select>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                        <button type="button" class="btn btn-primary" onclick="saveTemplateChanges('${type}', '${assetId}')">Save Changes</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Remove existing modal if any
    const existingModal = document.getElementById('editTemplateModal');
    if (existingModal) {
        existingModal.remove();
    }
    
    // Add modal to body
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // Show modal
    const modal = new bootstrap.Modal(document.getElementById('editTemplateModal'));
    modal.show();
}

// Save template changes function
function saveTemplateChanges(type, assetId) {
    const asset = templateAssets[type][assetId];
    
    if (!asset) {
        showToast('Asset not found!', 'error');
        return;
    }
    
    const title = document.getElementById('templateTitle').value.trim();
    const content = document.getElementById('templateContent').value.trim();
    const status = document.getElementById('templateStatus').value;
    
    if (!title || !content) {
        showToast('Please fill in all required fields!', 'warning');
        return;
    }
    
    // Update asset
    asset.title = title;
    asset.content = content;
    asset.status = status;
    asset.lastModified = new Date().toISOString();
    
    if (type === 'email') {
        asset.subject = document.getElementById('templateSubject').value.trim() || title;
        asset.cta = document.getElementById('templateCTA').value.trim() || 'Book Appointment';
    }
    
    if (type === 'social') {
        asset.platform = document.getElementById('templatePlatform').value;
        asset.hashtags = document.getElementById('templateHashtags').value.trim();
    }
    
    // Close modal
    const modal = bootstrap.Modal.getInstance(document.getElementById('editTemplateModal'));
    if (modal) {
        modal.hide();
    }
    
    // Refresh assets section
    refreshTemplateAssets(type);
    
    // Show success message
    showToast(`Template "${title}" updated successfully!`, 'success');
}

// Clone asset function
function cloneAsset(type, assetId) {
    const asset = templateAssets[type] && templateAssets[type][assetId];
    
    if (!asset) {
        showToast('Asset not found!', 'error');
        return;
    }
    
    const clonedAssetId = `clone-${type}-${Date.now()}`;
    const clonedAsset = {
        ...asset,
        id: clonedAssetId,
        title: `${asset.title} (Copy)`,
        created: 'Just now',
        status: 'Draft'
    };
    
    templateAssets[type][clonedAssetId] = clonedAsset;
    refreshTemplateAssets(type);
    
    showToast(`Asset cloned as "${clonedAsset.title}"!`, 'success');
}

// Use asset function
function useAsset(type, assetId) {
    showToast(`Using asset in campaign builder - Feature coming soon!`, 'info');
}

// Review asset function
function reviewAsset(type, assetId) {
    showToast(`Opening asset review workflow - Feature coming soon!`, 'info');
}

// Refresh template assets display
function refreshTemplateAssets(type) {
    // This would update the HTML display - for now just show success
    showToast(`${type.toUpperCase()} templates refreshed!`, 'info');
    
    // For demonstration purposes, log the current template assets
    console.log(`Current ${type} templates:`, templateAssets[type]);
}

// Helper function to format file size
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Campaign management functions
function viewCampaign(campaignId) {
    const campaign = mockData.campaigns.find(c => c.id === campaignId);
    if (!campaign) return;
    
    showToast(`Viewing details for ${campaign.name}`, 'info');
    // In a real app, this would open a detailed view modal
}

function editCampaign(campaignId) {
    const campaign = mockData.campaigns.find(c => c.id === campaignId);
    if (!campaign) return;
    
    showToast(`Edit mode for ${campaign.name} - Feature coming soon!`, 'info');
    // In a real app, this would open the campaign editor
}

function toggleCampaign(campaignId) {
    const campaign = mockData.campaigns.find(c => c.id === campaignId);
    if (!campaign) return;
    
    const newStatus = campaign.status === 'Active' ? 'Paused' : 'Active';
    campaign.status = newStatus;
    
    showToast(`Campaign ${newStatus.toLowerCase()} successfully!`, 'success');
    updateCampaignsTable();
}

// Settings Management Functions
function addUser() {
    showToast('Add User functionality coming soon!', 'info');
    // In a real app, this would open an add user modal
}

function editUser(userId) {
    showToast(`Edit user functionality for User ID ${userId} coming soon!`, 'info');
    // In a real app, this would open an edit user modal
}

function toggleUser(userId) {
    const userRow = document.querySelector(`[onclick="toggleUser(${userId})"]`).closest('tr');
    const statusBadge = userRow.querySelector('.badge:last-child');
    
    if (statusBadge.textContent.trim() === 'Active') {
        statusBadge.textContent = 'Inactive';
        statusBadge.className = 'badge bg-warning';
        showToast('User deactivated successfully!', 'warning');
    } else {
        statusBadge.textContent = 'Active';
        statusBadge.className = 'badge bg-success';
        showToast('User activated successfully!', 'success');
    }
}

// Lead Management Functions
const leadData = [
    {
        id: 1,
        name: 'Rajesh Kumar',
        contact: '+91 79015 49119',
        email: 'rajesh@email.com',
        service: 'Cardiology',
        source: 'Google Ads',
        score: 95,
        status: 'New',
        lastContact: '2024-01-15',
        notes: 'Interested in cardiac health checkup'
    },
    {
        id: 2,
        name: 'Priya Sharma',
        contact: '+91 87654 32109',
        email: 'priya@email.com',
        service: 'Pediatrics',
        source: 'Facebook',
        score: 87,
        status: 'Contacted',
        lastContact: '2024-01-14',
        notes: 'Looking for pediatric consultation'
    },
    {
        id: 3,
        name: 'Amit Patel',
        contact: '+91 76543 21098',
        email: 'amit@email.com',
        service: 'Orthopedics',
        source: 'Website',
        score: 92,
        status: 'Qualified',
        lastContact: '2024-01-13',
        notes: 'Knee pain, needs specialist consultation'
    },
    {
        id: 4,
        name: 'Sunita Reddy',
        contact: '+91 65432 10987',
        email: 'sunita@email.com',
        service: 'Gynecology',
        source: 'WhatsApp',
        score: 78,
        status: 'Follow-up',
        lastContact: '2024-01-12',
        notes: 'Regular checkup appointment needed'
    }
];

function contactLead(leadId) {
    const lead = leadData.find(l => l.id === leadId);
    if (!lead) return;
    
    const modalHTML = `
        <div class="modal fade" id="contactLeadModal" tabindex="-1">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Contact Lead - ${lead.name}</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <div class="lead-info mb-3">
                            <p><strong>Contact:</strong> ${lead.contact}</p>
                            <p><strong>Email:</strong> ${lead.email}</p>
                            <p><strong>Service Interest:</strong> ${lead.service}</p>
                            <p><strong>Lead Score:</strong> <span class="badge ${lead.score >= 90 ? 'bg-danger' : lead.score >= 80 ? 'bg-success' : 'bg-warning'}">${lead.score}</span></p>
                        </div>
                        
                        <div class="contact-options">
                            <h6>Contact Method:</h6>
                            <div class="row">
                                <div class="col-6">
                                    <button class="btn btn-primary w-100 mb-2" onclick="makeCall('${lead.contact}')">
                                        <i class="fas fa-phone"></i> Call
                                    </button>
                                </div>
                                <div class="col-6">
                                    <button class="btn btn-success w-100 mb-2" onclick="sendWhatsApp('${lead.contact}')">
                                        <i class="fab fa-whatsapp"></i> WhatsApp
                                    </button>
                                </div>
                                <div class="col-6">
                                    <button class="btn btn-info w-100 mb-2" onclick="sendEmail('${lead.email}')">
                                        <i class="fas fa-envelope"></i> Email
                                    </button>
                                </div>
                                <div class="col-6">
                                    <button class="btn btn-warning w-100 mb-2" onclick="sendSMS('${lead.contact}')">
                                        <i class="fas fa-sms"></i> SMS
                                    </button>
                                </div>
                            </div>
                        </div>
                        
                        <div class="notes-section mt-3">
                            <h6>Notes:</h6>
                            <textarea class="form-control" rows="3" placeholder="Add follow-up notes...">${lead.notes}</textarea>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        <button type="button" class="btn btn-primary" onclick="updateLeadStatus(${lead.id}, 'Contacted')">Mark as Contacted</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Remove existing modal if any
    const existingModal = document.getElementById('contactLeadModal');
    if (existingModal) {
        existingModal.remove();
    }
    
    // Add modal to body
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // Show modal
    const modal = new bootstrap.Modal(document.getElementById('contactLeadModal'));
    modal.show();
}

function makeCall(phoneNumber) {
    showToast(`Initiating call to ${phoneNumber}...`, 'info');
    // In a real app, this would integrate with VoIP or phone system
    setTimeout(() => {
        showToast('Call connected! Duration: 3:45 minutes', 'success');
    }, 2000);
}

function sendWhatsApp(phoneNumber) {
    showToast(`Opening WhatsApp chat with ${phoneNumber}...`, 'info');
    // In a real app, this would open WhatsApp API
    window.open(`https://wa.me/${phoneNumber.replace(/[^0-9]/g, '')}`, '_blank');
}

function sendEmail(email) {
    showToast(`Opening email client for ${email}...`, 'info');
    // In a real app, this would integrate with email service
    window.open(`mailto:${email}?subject=Apollo Hospital - Health Consultation&body=Dear Patient,%0D%0A%0D%0AThank you for your interest in Apollo Hospital services...`, '_blank');
}

function sendSMS(phoneNumber) {
    showToast(`Sending SMS to ${phoneNumber}...`, 'info');
    // In a real app, this would integrate with SMS service
    setTimeout(() => {
        showToast('SMS sent successfully!', 'success');
    }, 1500);
}

function updateLeadStatus(leadId, newStatus) {
    const lead = leadData.find(l => l.id === leadId);
    if (lead) {
        lead.status = newStatus;
        lead.lastContact = new Date().toISOString().split('T')[0];
        showToast(`Lead status updated to: ${newStatus}`, 'success');
        
        // Close modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('contactLeadModal'));
        if (modal) {
            modal.hide();
        }
        
        // Refresh leads table (in a real app)
        updateLeadsTable();
    }
}

function updateLeadsTable() {
    // In a real application, this would refresh the leads table
    showToast('Leads table updated!', 'info');
}

// Approval Management Functions
const pendingApprovals = [
    // Sample approvals for demonstration - will be replaced by actual campaign submissions
    {
        id: 1,
        title: 'Orthopedic Campaign Launch',
        description: 'Budget: ₹75,000 • Duration: 30 days',
        requestedBy: 'Marketing Team',
        requestedTime: '2 hours ago',
        type: 'campaign',
        details: {
            budget: 75000,
            duration: 30,
            serviceLine: 'Orthopedics',
            targetAudience: 'Adults 35-65 with joint pain',
            channels: 'Google, Meta'
        }
    },
    {
        id: 2,
        title: 'Asset Update - Email Template',
        description: 'Updated subject line and CTA',
        requestedBy: 'Content Team',
        requestedTime: '4 hours ago',
        type: 'asset',
        details: {
            assetType: 'Email Template',
            changes: 'Subject line optimization and new CTA button',
            impact: 'Expected 15% improvement in open rates'
        }
    }
];

function approveItem(approvalId, approve = true) {
    const approval = pendingApprovals.find(a => a.id === approvalId);
    if (!approval) return;
    
    const action = approve ? 'approved' : 'rejected';
    const actionClass = approve ? 'success' : 'danger';
    
    // Show confirmation modal
    const modalHTML = `
        <div class="modal fade" id="approvalModal" tabindex="-1">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">${approve ? 'Approve' : 'Reject'} Request</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <div class="approval-details">
                            <h6>${approval.title}</h6>
                            <p class="text-muted">${approval.description}</p>
                            <p><strong>Requested by:</strong> ${approval.requestedBy}</p>
                            <p><strong>Requested:</strong> ${approval.requestedTime}</p>
                            
                            ${approval.type === 'campaign' ? `
                                <div class="campaign-details mt-3">
                                    <h6>Campaign Details:</h6>
                                    <ul>
                                        <li>Budget: ₹${approval.details.budget.toLocaleString()}</li>
                                        <li>Duration: ${approval.details.duration} days</li>
                                        <li>Service Line: ${approval.details.serviceLine}</li>
                                        <li>Target: ${approval.details.targetAudience}</li>
                                    </ul>
                                </div>
                            ` : ''}
                            
                            ${approval.type === 'asset' ? `
                                <div class="asset-details mt-3">
                                    <h6>Asset Details:</h6>
                                    <ul>
                                        <li>Type: ${approval.details.assetType}</li>
                                        <li>Changes: ${approval.details.changes}</li>
                                        <li>Expected Impact: ${approval.details.impact}</li>
                                    </ul>
                                </div>
                            ` : ''}
                        </div>
                        
                        <div class="mt-3">
                            <label for="approvalComments" class="form-label">Comments (optional):</label>
                            <textarea class="form-control" id="approvalComments" rows="3" placeholder="Add your comments..."></textarea>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                        <button type="button" class="btn btn-${actionClass}" onclick="confirmApproval(${approvalId}, ${approve})">
                            ${approve ? 'Approve' : 'Reject'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Remove existing modal if any
    const existingModal = document.getElementById('approvalModal');
    if (existingModal) {
        existingModal.remove();
    }
    
    // Add modal to body
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // Show modal
    const modal = new bootstrap.Modal(document.getElementById('approvalModal'));
    modal.show();
}

function confirmApproval(approvalId, approve) {
    const approval = pendingApprovals.find(a => a.id === approvalId);
    const comments = document.getElementById('approvalComments').value;
    
    if (approval) {
        const action = approve ? 'approved' : 'rejected';
        showToast(`${approval.title} has been ${action}!`, approve ? 'success' : 'warning');
        
        // If approved and it's a campaign, create new active campaign
        if (approve && approval.type === 'campaign') {
            const leads = Math.floor(Math.random() * 50) + 20;
            const cpl = Math.floor(approval.details.budget / leads);
            
            // Create new active campaign from approval data
            const activeCampaign = {
                id: approval.id,
                name: approval.title,
                status: 'Active',
                budget: approval.details.budget,
                spent: Math.floor(approval.details.budget * 0.15), // Simulate some initial spending
                leads: leads,
                cpl: cpl,
                startDate: new Date().toLocaleDateString(),
                endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString(),
                channels: approval.details.channels,
                serviceLine: approval.details.serviceLine,
                campaignData: approval.campaignData || {}
            };
            
            // Add to campaigns list
            if (typeof mockData !== 'undefined' && mockData.campaigns) {
                mockData.campaigns.push(activeCampaign);
            }
            
            // Update campaigns table
            updateCampaignsTable();
        }
        // If rejected, we don't add it to campaigns table at all
        
        // Add to approval history
        const historyItem = {
            id: approval.id,
            title: approval.title,
            action: action,
            approver: 'Current User',
            timestamp: new Date().toLocaleDateString(),
            comments: comments
        };
        
        // Remove from pending approvals
        const index = pendingApprovals.indexOf(approval);
        if (index > -1) {
            pendingApprovals.splice(index, 1);
        }
        
        // Close modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('approvalModal'));
        if (modal) {
            modal.hide();
        }
        
        // Update approvals section
        updateApprovalsSection();
        
        // Update approval history
        updateApprovalHistory(historyItem);
        
        // If it's a campaign approval, show additional success message and switch to campaigns
        if (approve && approval.type === 'campaign') {
            setTimeout(() => {
                showToast('Campaign has been launched and is now live! Check Campaigns section.', 'success');
                // Auto-switch to campaigns section to show the updated status
                setTimeout(() => {
                    showSection('campaigns');
                    document.querySelectorAll('.sidebar-nav .nav-link').forEach(link => {
                        link.classList.remove('active');
                    });
                    document.querySelector('[data-section="campaigns"]').classList.add('active');
                }, 1000);
            }, 1500);
        } else if (!approve && approval.type === 'campaign') {
            setTimeout(() => {
                showToast('Campaign has been rejected. Check Campaigns section for status.', 'warning');
            }, 1500);
        }
    }
}

function updateApprovalsSection() {
    const pendingApprovalsContainer = document.querySelector('#pending-approvals-container');
    if (!pendingApprovalsContainer) return;
    
    let approvalsHTML = '';
    
    if (pendingApprovals.length === 0) {
        approvalsHTML = '<div class="text-center py-4"><p class="text-muted">No pending approvals</p></div>';
    } else {
        pendingApprovals.forEach(approval => {
            approvalsHTML += `
                <div class="approval-item" data-approval-id="${approval.id}">
                    <div class="d-flex justify-content-between align-items-start">
                        <div>
                            <h6>${approval.title}</h6>
                            <p class="text-muted mb-1">${approval.description}</p>
                            ${approval.type === 'campaign' ? `
                                <div class="campaign-badges mb-2">
                                    <span class="badge bg-primary me-1">${approval.details.channels}</span>
                                    <span class="badge bg-info me-1">${approval.details.totalAssets} Assets</span>
                                    <span class="badge bg-secondary">${approval.details.serviceLine}</span>
                                </div>
                            ` : ''}
                            <small class="text-muted">Requested ${approval.requestedTime} by ${approval.requestedBy}</small>
                        </div>
                        <div class="approval-actions">
                            <button class="btn btn-sm btn-success me-1" onclick="approveItem(${approval.id}, true)" title="Approve">
                                <i class="fas fa-check"></i>
                            </button>
                            <button class="btn btn-sm btn-danger" onclick="approveItem(${approval.id}, false)" title="Reject">
                                <i class="fas fa-times"></i>
                            </button>
                        </div>
                    </div>
                </div>
            `;
        });
    }
    
    pendingApprovalsContainer.innerHTML = approvalsHTML;
}

// Update approval history
function updateApprovalHistory(historyItem) {
    const historyContainer = document.querySelector('#approvals-section .col-lg-6:last-child .card-body');
    if (!historyContainer) return;
    
    const historyHTML = `
        <div class="approval-history-item">
            <div class="d-flex align-items-center">
                <i class="fas ${historyItem.action === 'approved' ? 'fa-check-circle text-success' : 'fa-times-circle text-danger'} me-2"></i>
                <div>
                    <h6 class="mb-1">${historyItem.title}</h6>
                    <small class="text-muted">${historyItem.action === 'approved' ? 'Approved' : 'Rejected'} by ${historyItem.approver} • ${historyItem.timestamp}</small>
                    ${historyItem.comments ? `<div class="mt-1"><small class="text-muted fst-italic">"${historyItem.comments}"</small></div>` : ''}
                </div>
            </div>
        </div>
    `;
    
    historyContainer.insertAdjacentHTML('afterbegin', historyHTML);
}

// Update campaigns table with new approved campaigns
function updateCampaignsTable() {
    const campaignsTableBody = document.querySelector('#campaigns-table-body');
    if (!campaignsTableBody || !mockData || !mockData.campaigns) return;
    
    let tableHTML = '';
    mockData.campaigns.forEach(campaign => {
        const roi = Math.floor((campaign.leads * campaign.cpl * 2.5 / campaign.budget) * 100); // Mock ROI calculation
        const campaignType = campaign.serviceLine === 'Cardiology' ? 'Awareness' : 
                           campaign.serviceLine === 'Pediatrics' ? 'Conversion' : 'Engagement';
        
        tableHTML += `
            <tr>
                <td><input type="checkbox" class="form-check-input"></td>
                <td>
                    <div class="campaign-info">
                        <h6 class="mb-1">${campaign.name}</h6>
                        <small class="text-muted">${campaign.serviceLine}</small>
                    </div>
                </td>
                <td><span class="badge bg-${campaignType === 'Awareness' ? 'info' : campaignType === 'Conversion' ? 'warning' : 'primary'}">${campaignType}</span></td>
                <td><span class="badge bg-${campaign.status === 'Active' ? 'success' : 
                                                  campaign.status === 'Paused' ? 'warning' : 
                                                  campaign.status === 'Pending Approval' ? 'info' : 
                                                  campaign.status === 'Rejected' ? 'danger' : 'secondary'}">${campaign.status}</span></td>
                <td>₹${campaign.budget.toLocaleString()}</td>
                <td>${campaign.leads}</td>
                <td>₹${campaign.cpl}</td>
                <td>${roi}%</td>
                <td>
                    <div class="btn-group" role="group">
                        <button type="button" class="btn btn-sm btn-outline-primary" onclick="viewCampaign(${campaign.id})" title="View">
                            <i class="fas fa-eye"></i>
                        </button>
                        ${campaign.status === 'Pending Approval' || campaign.status === 'Rejected' ? 
                            `<button type="button" class="btn btn-sm btn-outline-secondary" disabled title="Edit Disabled">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button type="button" class="btn btn-sm btn-outline-secondary" disabled title="Action Disabled">
                                <i class="fas fa-ban"></i>
                            </button>` :
                            `<button type="button" class="btn btn-sm btn-outline-secondary" onclick="editCampaign(${campaign.id})" title="Edit">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button type="button" class="btn btn-sm btn-outline-${campaign.status === 'Active' ? 'warning' : 'success'}" onclick="toggleCampaign(${campaign.id})" title="${campaign.status === 'Active' ? 'Pause' : 'Resume'}">
                                <i class="fas fa-${campaign.status === 'Active' ? 'pause' : 'play'}"></i>
                            </button>`
                        }
                    </div>
                </td>
            </tr>
        `;
    });
    
    campaignsTableBody.innerHTML = tableHTML;
}

// Export functions for potential external use
window.HospitalMarketingApp = {
    showSection,
    openCampaignModal,
    updateChartsData,
    showAlert,
    formatCurrency,
    formatNumber,
    generateAssets,
    updateChannelBudgets,
    updateAssetsSection,
    previewAsset,
    editAsset,
    contactLead,
    approveItem,
    confirmApproval,
    makeCall,
    sendWhatsApp,
    sendEmail,
    sendSMS,
    updateApprovalsSection,
    updateApprovalHistory,
    updateCampaignsTable,
    viewCampaign,
    editCampaign,
    toggleCampaign,
    addUser,
    editUser,
    toggleUser,
    saveAssetChanges
};

// Recommendations Modal Functionality
const recommendationsData = {
    'seasonal-cardiac': {
        objective: 'Increase cardiac health consultations during high-risk winter season',
        type: 'Awareness',
        serviceLine: 'Cardiology',
        budget: 175000,
        duration: 45,
        ageMin: 45,
        ageMax: 75,
        gender: 'All',
        locationRadius: 20,
        patientType: 'newPatients',
        channels: ['googleAds', 'metaAds', 'emailChannel'],
        budgetAllocation: {
            google: 70000,
            meta: 60000,
            email: 25000,
            sms: 20000
        }
    },
    'diabetes-awareness': {
        objective: 'World Diabetes Day comprehensive screening and awareness campaign',
        type: 'Conversion',
        serviceLine: 'Endocrinology',
        budget: 120000,
        duration: 30,
        ageMin: 30,
        ageMax: 55,
        gender: 'All',
        locationRadius: 15,
        patientType: 'bothPatients',
        channels: ['googleAds', 'metaAds', 'smsChannel'],
        budgetAllocation: {
            google: 50000,
            meta: 45000,
            sms: 15000,
            email: 10000
        }
    },
    'womens-health': {
        objective: 'Comprehensive womens health screening and preventive care campaign',
        type: 'Engagement',
        serviceLine: 'Gynecology',
        budget: 105000,
        duration: 60,
        ageMin: 25,
        ageMax: 65,
        gender: 'Female',
        locationRadius: 25,
        patientType: 'newPatients',
        channels: ['metaAds', 'emailChannel', 'whatsappChannel'],
        budgetAllocation: {
            meta: 55000,
            email: 20000,
            whatsapp: 15000,
            sms: 15000
        }
    },
    'telemedicine-expansion': {
        objective: 'Promote telemedicine services for busy professionals and elderly patients',
        type: 'Conversion',
        serviceLine: 'Telemedicine',
        budget: 215000,
        duration: 90,
        ageMin: 35,
        ageMax: 70,
        gender: 'All',
        locationRadius: 50,
        patientType: 'bothPatients',
        channels: ['googleAds', 'metaAds', 'emailChannel', 'smsChannel'],
        budgetAllocation: {
            google: 85000,
            meta: 70000,
            email: 35000,
            sms: 25000
        }
    }
};

function initializeRecommendations() {
    // View All Recommendations Button (opens detailed modal)
    const viewAllRecommendationsBtn = document.getElementById('viewAllRecommendationsBtn');
    if (viewAllRecommendationsBtn) {
        viewAllRecommendationsBtn.addEventListener('click', function() {
            const recommendationsModal = new bootstrap.Modal(document.getElementById('recommendationsModal'));
            recommendationsModal.show();
        });
    }

    // Accept Insight Buttons (Modal)
    document.addEventListener('click', function(e) {
        if (e.target.closest('.accept-insight')) {
            const insightId = e.target.closest('.accept-insight').dataset.insight;
            acceptInsight(insightId, e.target.closest('.recommendation-item'));
        }
    });

    // Reject Insight Buttons (Modal)
    document.addEventListener('click', function(e) {
        if (e.target.closest('.reject-insight')) {
            const insightId = e.target.closest('.reject-insight').dataset.insight;
            rejectInsight(insightId, e.target.closest('.recommendation-item'));
        }
    });

    // Create Campaign from Insight Buttons (Modal)
    document.addEventListener('click', function(e) {
        if (e.target.closest('.create-campaign-btn')) {
            const insightId = e.target.closest('.create-campaign-btn').dataset.insight;
            createCampaignFromInsight(insightId);
        }
    });

    // Accept Insight Buttons (Preview Cards)
    document.addEventListener('click', function(e) {
        if (e.target.closest('.accept-insight-preview')) {
            const insightId = e.target.closest('.accept-insight-preview').dataset.insight;
            acceptInsightPreview(insightId, e.target.closest('.recommendation-preview'));
        }
    });

    // Reject Insight Buttons (Preview Cards)
    document.addEventListener('click', function(e) {
        if (e.target.closest('.reject-insight-preview')) {
            const insightId = e.target.closest('.reject-insight-preview').dataset.insight;
            rejectInsightPreview(insightId, e.target.closest('.recommendation-preview'));
        }
    });

    // Create Campaign from Preview Cards
    document.addEventListener('click', function(e) {
        if (e.target.closest('.create-campaign-preview')) {
            const insightId = e.target.closest('.create-campaign-preview').dataset.insight;
            createCampaignFromInsight(insightId);
        }
    });
}

function acceptInsight(insightId, element) {
    element.classList.add('accepted');
    element.classList.remove('rejected');
    
    // Add accepted badge
    const headerDiv = element.querySelector('.recommendation-priority');
    
    // Remove existing status badges
    const existingStatusBadge = headerDiv.querySelector('.badge.bg-secondary');
    if (existingStatusBadge) {
        existingStatusBadge.remove();
    }
    
    // Add accepted badge
    const acceptedBadge = document.createElement('span');
    acceptedBadge.className = 'badge bg-success ms-2';
    acceptedBadge.innerHTML = '<i class="fas fa-check me-1"></i>Accepted';
    headerDiv.appendChild(acceptedBadge);
    
    console.log(`Insight ${insightId} accepted`);
    
    // Show success toast
    showToast('Recommendation accepted! You can now create a campaign from this insight.', 'success');
}

function rejectInsight(insightId, element) {
    element.classList.add('rejected');
    element.classList.remove('accepted');
    
    // Add rejected badge
    const headerDiv = element.querySelector('.recommendation-priority');
    
    // Remove existing status badges
    const existingStatusBadge = headerDiv.querySelector('.badge.bg-secondary');
    if (existingStatusBadge) {
        existingStatusBadge.remove();
    }
    
    // Add rejected badge
    const rejectedBadge = document.createElement('span');
    rejectedBadge.className = 'badge bg-secondary ms-2';
    rejectedBadge.innerHTML = '<i class="fas fa-times me-1"></i>Rejected';
    headerDiv.appendChild(rejectedBadge);
    
    console.log(`Insight ${insightId} rejected`);
    
    // Show info toast
    showToast('Recommendation rejected. This insight will not be shown in future suggestions.', 'info');
}

function createCampaignFromInsight(insightId) {
    const insightData = recommendationsData[insightId];
    
    if (!insightData) {
        showToast('Error: Insight data not found', 'error');
        return;
    }
    
    // Close recommendations modal
    const recommendationsModal = bootstrap.Modal.getInstance(document.getElementById('recommendationsModal'));
    if (recommendationsModal) {
        recommendationsModal.hide();
    }
    
    // Wait for modal to close, then open campaign modal with pre-filled data
    setTimeout(() => {
        openCampaignModalWithInsight(insightData);
    }, 300);
}

function openCampaignModalWithInsight(insightData) {
    // Reset to step 1
    currentStep = 1;
    updateWizardStep();
    
    // Pre-fill Step 1: Goals
    const objectiveInput = document.querySelector('#step-1 input[type="text"]');
    if (objectiveInput) {
        objectiveInput.value = insightData.objective;
    }
    
    const campaignTypeSelect = document.querySelector('#step-1 select');
    if (campaignTypeSelect) {
        campaignTypeSelect.value = insightData.type;
    }
    
    const serviceLineSelect = document.querySelectorAll('#step-1 select')[1];
    if (serviceLineSelect) {
        serviceLineSelect.value = insightData.serviceLine;
    }
    
    const budgetInput = document.querySelector('#step-1 input[placeholder="50000"]');
    if (budgetInput) {
        budgetInput.value = insightData.budget;
    }
    
    const durationInput = document.querySelector('#step-1 input[placeholder="30"]');
    if (durationInput) {
        durationInput.value = insightData.duration;
    }
    
    // Pre-fill Step 2: Segments
    const ageMinInput = document.getElementById('ageMin');
    if (ageMinInput) {
        ageMinInput.value = insightData.ageMin;
    }
    
    const ageMaxInput = document.getElementById('ageMax');
    if (ageMaxInput) {
        ageMaxInput.value = insightData.ageMax;
    }
    
    const genderSelect = document.getElementById('genderSelect');
    if (genderSelect) {
        genderSelect.value = insightData.gender;
    }
    
    const locationRadius = document.getElementById('locationRadius');
    if (locationRadius) {
        locationRadius.value = insightData.locationRadius;
        document.getElementById('radiusDisplay').textContent = insightData.locationRadius;
    }
    
    // Set patient type
    const patientTypeRadio = document.getElementById(insightData.patientType);
    if (patientTypeRadio) {
        patientTypeRadio.checked = true;
    }
    
    // Pre-fill Step 4: Channels & Budget
    setTimeout(() => {
        // Reset all channel checkboxes first
        const channelCheckboxes = document.querySelectorAll('.channel-checkbox');
        channelCheckboxes.forEach(checkbox => {
            checkbox.checked = false;
        });
        
        // Enable selected channels and set budgets
        insightData.channels.forEach(channel => {
            const checkbox = document.getElementById(channel);
            if (checkbox) {
                checkbox.checked = true;
            }
        });
        
        // Set budget allocations
        Object.keys(insightData.budgetAllocation).forEach(channel => {
            const budgetSlider = document.querySelector(`[data-channel="${channel}"]`);
            const budgetDisplay = document.getElementById(`${channel}Budget`);
            
            if (budgetSlider && budgetDisplay) {
                budgetSlider.value = insightData.budgetAllocation[channel];
                budgetDisplay.textContent = insightData.budgetAllocation[channel];
            }
        });
        
        // Update total budget display
        updateChannelBudgets();
    }, 100);
    
    // Open campaign modal
    const campaignModal = new bootstrap.Modal(document.getElementById('campaignModal'));
    campaignModal.show();
    
    // Show success message
    showToast('Campaign form pre-filled with recommended settings. You can review and modify before submitting.', 'success');
}

function acceptInsightPreview(insightId, element) {
    element.classList.add('accepted');
    element.classList.remove('rejected');
    
    console.log(`Preview insight ${insightId} accepted`);
    
    // Show success toast
    showToast('Recommendation accepted! You can now create a campaign from this insight.', 'success');
    
    // Also update the modal version if it exists
    const modalElement = document.querySelector(`.recommendation-item[data-insight="${insightId}"]`);
    if (modalElement) {
        acceptInsight(insightId, modalElement);
    }
}

function rejectInsightPreview(insightId, element) {
    element.classList.add('rejected');
    element.classList.remove('accepted');
    
    console.log(`Preview insight ${insightId} rejected`);
    
    // Show info toast
    showToast('Recommendation rejected. This insight will not be shown in future suggestions.', 'info');
    
    // Also update the modal version if it exists
    const modalElement = document.querySelector(`.recommendation-item[data-insight="${insightId}"]`);
    if (modalElement) {
        rejectInsight(insightId, modalElement);
    }
}

function showToast(message, type = 'info') {
    // Create toast element
    const toastId = 'toast-' + Date.now();
    const toastHTML = `
        <div id="${toastId}" class="toast align-items-center text-white bg-${type === 'success' ? 'success' : type === 'error' ? 'danger' : 'info'} border-0" role="alert" aria-live="assertive" aria-atomic="true">
            <div class="d-flex">
                <div class="toast-body">
                    <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-triangle' : 'info-circle'} me-2"></i>
                    ${message}
                </div>
                <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
            </div>
        </div>
    `;
    
    // Add toast container if it doesn't exist
    let toastContainer = document.querySelector('.toast-container');
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.className = 'toast-container position-fixed bottom-0 end-0 p-3';
        document.body.appendChild(toastContainer);
    }
    
    // Add toast to container
    toastContainer.insertAdjacentHTML('beforeend', toastHTML);
    
    // Show toast
    const toastElement = document.getElementById(toastId);
    const toast = new bootstrap.Toast(toastElement, {
        autohide: true,
        delay: 5000
    });
    toast.show();
    
    // Remove toast element after it's hidden
    toastElement.addEventListener('hidden.bs.toast', function() {
        toastElement.remove();
    });
}

// Initialize recommendations when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeRecommendations();
    initializeRecommendationsPage();
});

// Recommendations Page Functionality
function initializeRecommendationsPage() {
    // Solve Issue Buttons
    document.addEventListener('click', function(e) {
        if (e.target.closest('.solve-issue-btn')) {
            const issueType = e.target.closest('.solve-issue-btn').dataset.issue;
            solveIssue(issueType);
        }
    });

    // Create Opportunity Buttons
    document.addEventListener('click', function(e) {
        if (e.target.closest('.create-opportunity-btn')) {
            const opportunityType = e.target.closest('.create-opportunity-btn').dataset.opportunity;
            createOpportunityFromRecommendation(opportunityType);
        }
    });

    // Complete Todo Buttons
    document.addEventListener('click', function(e) {
        if (e.target.closest('.complete-todo-btn')) {
            const todoType = e.target.closest('.complete-todo-btn').dataset.todo;
            completeTodo(todoType);
        }
    });

    // Act on Insight Buttons
    document.addEventListener('click', function(e) {
        if (e.target.closest('.act-on-insight-btn')) {
            const insightType = e.target.closest('.act-on-insight-btn').dataset.insight;
            actOnInsight(insightType);
        }
    });

    // Filter buttons
    document.addEventListener('change', function(e) {
        if (e.target.name === 'recFilter') {
            filterRecommendations(e.target.id);
        }
    });

    // Todo checkboxes
    document.addEventListener('change', function(e) {
        if (e.target.type === 'checkbox' && e.target.closest('.todo-item')) {
            toggleTodoCompletion(e.target);
        }
    });
}

function solveIssue(issueType) {
    const issueActions = {
        'mobile-optimization': {
            title: 'Mobile Website Optimization',
            action: 'Redirecting to mobile optimization settings...',
            redirect: '#settings-section'
        },
        'instagram-setup': {
            title: 'Instagram Marketing Setup',
            action: 'Opening Instagram integration wizard...',
            redirect: '#settings-section'
        }
    };

    const issue = issueActions[issueType];
    if (issue) {
        showToast(`${issue.action}`, 'info');
        
        // Simulate navigation or action
        setTimeout(() => {
            if (issue.redirect === '#settings-section') {
                // Switch to settings section and highlight integrations
                switchToSection('settings');
                showToast(`${issue.title} setup initiated. Please follow the configuration steps.`, 'success');
            }
        }, 1500);
    }
}

function createOpportunityFromRecommendation(opportunityType) {
    const opportunities = {
        'telemedicine': {
            objective: 'Launch comprehensive telemedicine services for remote consultations',
            type: 'Conversion',
            serviceLine: 'Telemedicine',
            budget: 215000,
            duration: 90
        },
        'seasonal-cardiac': {
            objective: 'Winter cardiac health screening and awareness campaign',
            type: 'Awareness',
            serviceLine: 'Cardiology',
            budget: 175000,
            duration: 45
        },
        'referral-program': {
            objective: 'Patient referral program with incentives and rewards',
            type: 'Engagement',
            serviceLine: 'General',
            budget: 85000,
            duration: 180
        }
    };

    const opportunity = opportunities[opportunityType];
    if (opportunity) {
        showToast('Opening campaign creation with pre-filled opportunity data...', 'info');
        
        setTimeout(() => {
            // Use existing campaign creation function with opportunity data
            openCampaignModalWithInsight(recommendationsData[opportunityType] || {
                objective: opportunity.objective,
                type: opportunity.type,
                serviceLine: opportunity.serviceLine,
                budget: opportunity.budget,
                duration: opportunity.duration,
                ageMin: 25,
                ageMax: 65,
                gender: 'All',
                locationRadius: 25,
                patientType: 'bothPatients',
                channels: ['googleAds', 'metaAds', 'emailChannel'],
                budgetAllocation: {
                    google: Math.floor(opportunity.budget * 0.4),
                    meta: Math.floor(opportunity.budget * 0.35),
                    email: Math.floor(opportunity.budget * 0.15),
                    sms: Math.floor(opportunity.budget * 0.1)
                }
            });
        }, 1000);
    }
}

function completeTodo(todoType) {
    const todoActions = {
        'asset-approval': {
            title: 'Asset Approval',
            action: 'Opening asset review interface...',
            redirect: '#assets-section'
        },
        'budget-update': {
            title: 'Budget Update',
            action: 'Opening campaign budget settings...',
            redirect: '#campaigns-section'
        },
        'social-scheduling': {
            title: 'Social Media Scheduling',
            action: 'Opening social media scheduler...',
            redirect: '#assets-section'
        }
    };

    const todo = todoActions[todoType];
    if (todo) {
        showToast(`${todo.action}`, 'info');
        
        setTimeout(() => {
            switchToSection(todo.redirect.replace('#', '').replace('-section', ''));
            showToast(`${todo.title} interface opened. Complete the required actions.`, 'success');
        }, 1500);
    }
}

function actOnInsight(insightType) {
    const insights = {
        'orthopedic-demand': {
            title: 'Orthopedic Demand Campaign',
            action: 'Creating targeted orthopedic campaign based on AI prediction...'
        },
        'scheduling-optimization': {
            title: 'Ad Scheduling Optimization',
            action: 'Optimizing ad schedules based on patient behavior patterns...'
        }
    };

    const insight = insights[insightType];
    if (insight) {
        showToast(`${insight.action}`, 'info');
        
        setTimeout(() => {
            if (insightType === 'orthopedic-demand') {
                // Create orthopedic campaign
                openCampaignModalWithInsight({
                    objective: 'Winter orthopedic consultation campaign targeting sports-related injuries',
                    type: 'Conversion',
                    serviceLine: 'Orthopedics',
                    budget: 120000,
                    duration: 21,
                    ageMin: 20,
                    ageMax: 55,
                    gender: 'All',
                    locationRadius: 15,
                    patientType: 'newPatients',
                    channels: ['googleAds', 'metaAds', 'smsChannel'],
                    budgetAllocation: {
                        google: 50000,
                        meta: 45000,
                        sms: 15000,
                        email: 10000
                    }
                });
            } else {
                showToast(`${insight.title} completed. Ad schedules optimized for Monday mornings.`, 'success');
            }
        }, 1500);
    }
}

function filterRecommendations(filterId) {
    const categories = document.querySelectorAll('.recommendation-category');
    
    // Show all categories first
    categories.forEach(category => {
        category.style.display = 'block';
    });
    
    // Apply filter
    switch(filterId) {
        case 'critical-recs':
            categories.forEach(category => {
                const categoryTitle = category.querySelector('h5').textContent;
                if (!categoryTitle.includes('Critical Gaps')) {
                    category.style.display = 'none';
                }
            });
            break;
        case 'opportunities-recs':
            categories.forEach(category => {
                const categoryTitle = category.querySelector('h5').textContent;
                if (!categoryTitle.includes('Growth Opportunities')) {
                    category.style.display = 'none';
                }
            });
            break;
        case 'actions-recs':
            categories.forEach(category => {
                const categoryTitle = category.querySelector('h5').textContent;
                if (!categoryTitle.includes('Pending Actions')) {
                    category.style.display = 'none';
                }
            });
            break;
        default:
            // 'all-recs' - already showing all
            break;
    }
}

function toggleTodoCompletion(checkbox) {
    const todoItem = checkbox.closest('.todo-item');
    const todoTitle = todoItem.querySelector('.todo-title').textContent;
    
    if (checkbox.checked) {
        todoItem.style.opacity = '0.6';
        todoItem.style.textDecoration = 'line-through';
        showToast(`Task "${todoTitle}" marked as completed.`, 'success');
        
        // Update stats (simulate)
        updateTaskStats();
    } else {
        todoItem.style.opacity = '1';
        todoItem.style.textDecoration = 'none';
        showToast(`Task "${todoTitle}" marked as incomplete.`, 'info');
    }
}

function updateTaskStats() {
    // Simulate updating task statistics
    const completedTodayElement = document.querySelector('.task-stats .text-success');
    if (completedTodayElement) {
        const currentCount = parseInt(completedTodayElement.textContent);
        completedTodayElement.textContent = currentCount + 1;
    }
    
    // Update progress bar
    const progressBar = document.querySelector('.progress-bar');
    if (progressBar) {
        const currentWidth = parseInt(progressBar.style.width);
        const newWidth = Math.min(currentWidth + 5, 100);
        progressBar.style.width = newWidth + '%';
        
        const progressText = progressBar.parentElement.nextElementSibling;
        if (progressText) {
            progressText.textContent = `${newWidth}% completed this week`;
        }
    }
}

function switchToSection(sectionName) {
    // Remove active class from all sections
    document.querySelectorAll('.content-section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Remove active class from all nav links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    
    // Add active class to target section
    const targetSection = document.getElementById(sectionName + '-section');
    if (targetSection) {
        targetSection.classList.add('active');
    }
    
    // Add active class to corresponding nav link
    const targetNav = document.querySelector(`[data-section="${sectionName}"]`);
    if (targetNav) {
        targetNav.classList.add('active');
    }
}

// ==========================================
// ONBOARDING FUNCTIONALITY
// ==========================================

// Onboarding state management
const onboardingState = {
    steps: {
        basicInfo: { completed: true, progress: 100 },
        hospitalDetails: { completed: true, progress: 100 },
        socialMedia: { completed: false, progress: 0 },
        integration: { completed: false, progress: 0 }
    },
    get overallProgress() {
        const steps = Object.values(this.steps);
        const totalProgress = steps.reduce((sum, step) => sum + step.progress, 0);
        return Math.round(totalProgress / steps.length);
    }
};

function initializeOnboarding() {
    updateOnboardingUI();
    setupOnboardingEventListeners();
}

function setupOnboardingEventListeners() {
    // Dismiss banner
    const dismissBtn = document.getElementById('dismissOnboardingBanner');
    if (dismissBtn) {
        dismissBtn.addEventListener('click', () => {
            const banner = document.getElementById('onboardingProgressBanner');
            if (banner) {
                banner.style.display = 'none';
                localStorage.setItem('onboardingBannerDismissed', 'true');
            }
        });
    }
    
    // Menu item click
    const menuItem = document.getElementById('completeOnboardingMenuItem');
    if (menuItem) {
        menuItem.addEventListener('click', (e) => {
            e.preventDefault();
            showOnboardingModal();
        });
    }
    
    // Complete buttons on pending steps
    document.querySelectorAll('.onboarding-step.pending').forEach(step => {
        const completeBtn = step.querySelector('.btn');
        if (completeBtn) {
            completeBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                const stepType = step.getAttribute('data-step');
                showOnboardingModal(stepType);
            });
        }
    });
}

function updateOnboardingUI() {
    const progress = onboardingState.overallProgress;
    
    // Update progress bar
    const progressBar = document.querySelector('.onboarding-banner .progress-bar');
    if (progressBar) {
        progressBar.style.width = progress + '%';
        progressBar.setAttribute('aria-valuenow', progress);
    }
    
    // Update badge
    const badge = document.querySelector('.onboarding-banner .badge');
    if (badge) {
        badge.textContent = progress + '% Complete';
    }
    
    // Update profile ring
    updateProfileProgressRing(progress);
    
    // Update profile percentage badge
    const percentageBadge = document.querySelector('.onboarding-percentage-badge');
    if (percentageBadge) {
        percentageBadge.textContent = progress + '%';
    }
    
    // Update menu item
    const menuItem = document.getElementById('completeOnboardingMenuItem');
    if (menuItem) {
        menuItem.innerHTML = `<i class="fas fa-tasks me-2"></i>Complete Onboarding (${progress}%)`;
    }
    
    // Hide banner if completed
    if (progress === 100) {
        const banner = document.getElementById('onboardingProgressBanner');
        if (banner) {
            setTimeout(() => {
                banner.style.display = 'none';
            }, 2000);
        }
    }
}

function updateProfileProgressRing(percentage) {
    const circle = document.querySelector('.progress-ring-circle');
    if (!circle) return;
    
    const radius = 22;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (percentage / 100) * circumference;
    
    circle.setAttribute('stroke-dasharray', circumference);
    circle.setAttribute('stroke-dashoffset', offset);
    
    // Change color based on progress
    if (percentage === 100) {
        circle.setAttribute('stroke', '#28a745');
    } else if (percentage >= 75) {
        circle.setAttribute('stroke', '#20c997');
    } else if (percentage >= 50) {
        circle.setAttribute('stroke', '#ffc107');
    } else {
        circle.setAttribute('stroke', '#17a2b8');
    }
}

function showOnboardingModal(stepType = null) {
    // Create modal HTML
    const modalHTML = `
        <div class="modal fade" id="onboardingModal" tabindex="-1" aria-labelledby="onboardingModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-lg modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header bg-gradient-primary text-white">
                        <h5 class="modal-title" id="onboardingModalLabel">
                            <i class="fas fa-rocket me-2"></i>
                            ${stepType === 'social-media' ? 'Connect Social Media' : stepType === 'integration' ? 'Connect Platforms' : 'Complete Your Onboarding'}
                        </h5>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body p-4">
                        ${stepType === 'social-media' ? getSocialMediaForm() : stepType === 'integration' ? getIntegrationForm() : getOnboardingOverview()}
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        <button type="button" class="btn btn-primary" id="saveOnboardingBtn">
                            <i class="fas fa-save me-1"></i>Save & Continue
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Remove existing modal if any
    const existingModal = document.getElementById('onboardingModal');
    if (existingModal) {
        existingModal.remove();
    }
    
    // Add modal to body
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // Show modal
    const modal = new bootstrap.Modal(document.getElementById('onboardingModal'));
    modal.show();
    
    // Setup save button
    document.getElementById('saveOnboardingBtn').addEventListener('click', () => {
        saveOnboardingData(stepType);
        modal.hide();
    });
}

function getSocialMediaForm() {
    return `
        <div class="onboarding-form">
            <p class="text-muted mb-4">Connect your social media accounts to enable automated posting and analytics tracking.</p>
            
            <div class="row g-3">
                <div class="col-md-6">
                    <label class="form-label">
                        <i class="fab fa-facebook text-primary me-2"></i>Facebook Page URL
                    </label>
                    <input type="url" class="form-control" placeholder="https://facebook.com/yourpage" id="facebookUrl">
                </div>
                
                <div class="col-md-6">
                    <label class="form-label">
                        <i class="fab fa-instagram text-danger me-2"></i>Instagram Handle
                    </label>
                    <input type="text" class="form-control" placeholder="@yourhospital" id="instagramHandle">
                </div>
                
                <div class="col-md-6">
                    <label class="form-label">
                        <i class="fab fa-twitter text-info me-2"></i>Twitter Handle
                    </label>
                    <input type="text" class="form-control" placeholder="@yourhospital" id="twitterHandle">
                </div>
                
                <div class="col-md-6">
                    <label class="form-label">
                        <i class="fab fa-linkedin text-primary me-2"></i>LinkedIn Page URL
                    </label>
                    <input type="url" class="form-control" placeholder="https://linkedin.com/company/yourpage" id="linkedinUrl">
                </div>
                
                <div class="col-md-6">
                    <label class="form-label">
                        <i class="fab fa-youtube text-danger me-2"></i>YouTube Channel URL
                    </label>
                    <input type="url" class="form-control" placeholder="https://youtube.com/yourchannel" id="youtubeUrl">
                </div>
                
                <div class="col-md-6">
                    <label class="form-label">
                        <i class="fab fa-whatsapp text-success me-2"></i>WhatsApp Business Number
                    </label>
                    <input type="tel" class="form-control" placeholder="+91 1234567890" id="whatsappNumber">
                </div>
            </div>
        </div>
    `;
}

function getIntegrationForm() {
    return `
        <div class="onboarding-form">
            <p class="text-muted mb-4">Connect your marketing platforms to sync campaigns and track performance.</p>
            
            <div class="integration-options">
                <div class="integration-card mb-3 p-3 border rounded">
                    <div class="d-flex justify-content-between align-items-center">
                        <div>
                            <h6 class="mb-1"><i class="fab fa-google text-danger me-2"></i>Google Ads</h6>
                            <small class="text-muted">Connect your Google Ads account</small>
                        </div>
                        <button class="btn btn-outline-primary btn-sm" onclick="connectPlatform('google-ads')">
                            <i class="fas fa-plug me-1"></i>Connect
                        </button>
                    </div>
                </div>
                
                <div class="integration-card mb-3 p-3 border rounded">
                    <div class="d-flex justify-content-between align-items-center">
                        <div>
                            <h6 class="mb-1"><i class="fab fa-meta text-primary me-2"></i>Meta Business Suite</h6>
                            <small class="text-muted">Connect Facebook & Instagram Ads</small>
                        </div>
                        <button class="btn btn-outline-primary btn-sm" onclick="connectPlatform('meta')">
                            <i class="fas fa-plug me-1"></i>Connect
                        </button>
                    </div>
                </div>
                
                <div class="integration-card mb-3 p-3 border rounded">
                    <div class="d-flex justify-content-between align-items-center">
                        <div>
                            <h6 class="mb-1"><i class="fas fa-chart-line text-success me-2"></i>Google Analytics</h6>
                            <small class="text-muted">Track website performance</small>
                        </div>
                        <button class="btn btn-outline-primary btn-sm" onclick="connectPlatform('analytics')">
                            <i class="fas fa-plug me-1"></i>Connect
                        </button>
                    </div>
                </div>
                
                <div class="integration-card mb-3 p-3 border rounded">
                    <div class="d-flex justify-content-between align-items-center">
                        <div>
                            <h6 class="mb-1"><i class="fas fa-envelope text-info me-2"></i>Email Marketing</h6>
                            <small class="text-muted">Connect Mailchimp or SendGrid</small>
                        </div>
                        <button class="btn btn-outline-primary btn-sm" onclick="connectPlatform('email')">
                            <i class="fas fa-plug me-1"></i>Connect
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function getOnboardingOverview() {
    return `
        <div class="onboarding-overview">
            <div class="alert alert-info">
                <i class="fas fa-info-circle me-2"></i>
                Complete the remaining steps to unlock all features
            </div>
            
            <div class="list-group">
                <div class="list-group-item ${onboardingState.steps.basicInfo.completed ? 'bg-light' : ''}">
                    <div class="d-flex justify-content-between align-items-center">
                        <div>
                            <i class="fas fa-check-circle text-success me-2"></i>
                            <strong>Basic Information</strong>
                        </div>
                        <span class="badge bg-success">Complete</span>
                    </div>
                </div>
                
                <div class="list-group-item ${onboardingState.steps.hospitalDetails.completed ? 'bg-light' : ''}">
                    <div class="d-flex justify-content-between align-items-center">
                        <div>
                            <i class="fas fa-check-circle text-success me-2"></i>
                            <strong>Hospital Details</strong>
                        </div>
                        <span class="badge bg-success">Complete</span>
                    </div>
                </div>
                
                <div class="list-group-item list-group-item-action" style="cursor: pointer;" onclick="showOnboardingModal('social-media')">
                    <div class="d-flex justify-content-between align-items-center">
                        <div>
                            <i class="fas fa-circle text-warning me-2"></i>
                            <strong>Social Media Handles</strong>
                        </div>
                        <span class="badge bg-warning">Pending</span>
                    </div>
                </div>
                
                <div class="list-group-item list-group-item-action" style="cursor: pointer;" onclick="showOnboardingModal('integration')">
                    <div class="d-flex justify-content-between align-items-center">
                        <div>
                            <i class="fas fa-circle text-muted me-2"></i>
                            <strong>Connect Platforms</strong>
                        </div>
                        <span class="badge bg-secondary">Pending</span>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function saveOnboardingData(stepType) {
    if (stepType === 'social-media') {
        // Simulate saving social media data
        onboardingState.steps.socialMedia.completed = true;
        onboardingState.steps.socialMedia.progress = 100;
        
        showAlert('Social media handles saved successfully!', 'success');
    } else if (stepType === 'integration') {
        // Simulate saving integration data
        onboardingState.steps.integration.completed = true;
        onboardingState.steps.integration.progress = 100;
        
        showAlert('Platform integrations saved successfully!', 'success');
    }
    
    updateOnboardingUI();
}

function connectPlatform(platform) {
    showAlert(`Connecting to ${platform}... This will redirect to authentication.`, 'info');
    
    // Simulate connection
    setTimeout(() => {
        showAlert(`${platform} connected successfully!`, 'success');
    }, 2000);
}

// Make function available globally for onclick handlers
window.showOnboardingModal = showOnboardingModal;
window.connectPlatform = connectPlatform;

// ==========================================
// BRANCH MANAGEMENT FUNCTIONALITY
// ==========================================

let branchCounter = 1;

function initializeBranchManagement() {
    const addBranchBtn = document.getElementById('addBranchBtn');
    if (addBranchBtn) {
        addBranchBtn.addEventListener('click', addNewBranch);
    }
    
    // Setup event listeners for existing branches
    setupBranchEventListeners();
}

function addNewBranch() {
    branchCounter++;
    const branchesContainer = document.getElementById('branchesContainer');
    
    const branchHTML = `
        <div class="branch-item mb-4 p-3 border rounded" data-branch-id="${branchCounter}">
            <div class="d-flex justify-content-between align-items-center mb-3">
                <h6 class="mb-0">Branch ${branchCounter}</h6>
                <button type="button" class="btn btn-sm btn-outline-danger remove-branch-btn" onclick="removeBranch(${branchCounter})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
            
            <div class="row">
                <div class="col-md-6 mb-3">
                    <label class="form-label">Branch Name <span class="text-danger">*</span></label>
                    <input type="text" class="form-control branch-name" placeholder="e.g., Main Campus, Downtown Branch" required>
                </div>
                <div class="col-md-6 mb-3">
                    <label class="form-label">Branch Type</label>
                    <select class="form-select branch-type">
                        <option value="main">Main Hospital</option>
                        <option value="branch">Branch</option>
                        <option value="clinic">Clinic</option>
                        <option value="diagnostic">Diagnostic Center</option>
                    </select>
                </div>
            </div>
            
            <div class="mb-3">
                <label class="form-label">Address <span class="text-danger">*</span></label>
                <textarea class="form-control branch-address" rows="2" placeholder="Enter complete address" required></textarea>
            </div>
            
            <div class="row">
                <div class="col-md-4 mb-3">
                    <label class="form-label">City</label>
                    <input type="text" class="form-control branch-city" placeholder="City">
                </div>
                <div class="col-md-4 mb-3">
                    <label class="form-label">State</label>
                    <input type="text" class="form-control branch-state" placeholder="State">
                </div>
                <div class="col-md-4 mb-3">
                    <label class="form-label">Postal Code</label>
                    <input type="text" class="form-control branch-postal" placeholder="Postal Code">
                </div>
            </div>
            
            <div class="geo-location-section p-3 bg-light rounded mb-3">
                <h6 class="mb-3"><i class="fas fa-map-pin me-2"></i>Geo-Location Coordinates</h6>
                <div class="row">
                    <div class="col-md-5 mb-3">
                        <label class="form-label">Latitude</label>
                        <input type="text" class="form-control branch-latitude" placeholder="e.g., 17.3850">
                        <small class="text-muted">Decimal format (e.g., 17.3850)</small>
                    </div>
                    <div class="col-md-5 mb-3">
                        <label class="form-label">Longitude</label>
                        <input type="text" class="form-control branch-longitude" placeholder="e.g., 78.4867">
                        <small class="text-muted">Decimal format (e.g., 78.4867)</small>
                    </div>
                    <div class="col-md-2 mb-3 d-flex align-items-end">
                        <button type="button" class="btn btn-outline-primary w-100 get-location-btn" onclick="getGeoLocation(${branchCounter})">
                            <i class="fas fa-location-arrow"></i>
                        </button>
                    </div>
                </div>
                <div class="map-preview mt-2">
                    <small class="text-muted">
                        <i class="fas fa-info-circle me-1"></i>
                        You can also click "Get Location" to auto-detect or search for your address on the map
                    </small>
                </div>
            </div>
            
            <div class="row">
                <div class="col-md-6 mb-3">
                    <label class="form-label">Contact Number</label>
                    <input type="tel" class="form-control branch-phone" placeholder="+91 1234567890">
                </div>
                <div class="col-md-6 mb-3">
                    <label class="form-label">Email</label>
                    <input type="email" class="form-control branch-email" placeholder="branch@hospital.com">
                </div>
            </div>
            
            <div class="mb-3">
                <label class="form-label">Bed Capacity</label>
                <input type="number" class="form-control branch-beds" placeholder="e.g., 200">
            </div>
        </div>
    `;
    
    branchesContainer.insertAdjacentHTML('beforeend', branchHTML);
    
    // Show success message
    showAlert(`Branch ${branchCounter} added successfully! Please fill in the details.`, 'success');
    
    // Scroll to the new branch
    setTimeout(() => {
        const newBranch = document.querySelector(`[data-branch-id="${branchCounter}"]`);
        if (newBranch) {
            newBranch.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }, 100);
}

function removeBranch(branchId) {
    const branch = document.querySelector(`[data-branch-id="${branchId}"]`);
    if (branch) {
        if (confirm('Are you sure you want to remove this branch?')) {
            branch.style.opacity = '0';
            branch.style.transform = 'scale(0.9)';
            setTimeout(() => {
                branch.remove();
                showAlert('Branch removed successfully', 'info');
            }, 300);
        }
    }
}

function getGeoLocation(branchId) {
    const branch = document.querySelector(`[data-branch-id="${branchId}"]`);
    if (!branch) return;
    
    const latInput = branch.querySelector('.branch-latitude');
    const lonInput = branch.querySelector('.branch-longitude');
    
    if ('geolocation' in navigator) {
        showAlert('Getting your location...', 'info');
        
        navigator.geolocation.getCurrentPosition(
            (position) => {
                latInput.value = position.coords.latitude.toFixed(6);
                lonInput.value = position.coords.longitude.toFixed(6);
                showAlert('Location detected successfully!', 'success');
            },
            (error) => {
                let errorMessage = 'Unable to get location. ';
                switch(error.code) {
                    case error.PERMISSION_DENIED:
                        errorMessage += 'Please allow location access in your browser.';
                        break;
                    case error.POSITION_UNAVAILABLE:
                        errorMessage += 'Location information is unavailable.';
                        break;
                    case error.TIMEOUT:
                        errorMessage += 'Location request timed out.';
                        break;
                    default:
                        errorMessage += 'An unknown error occurred.';
                }
                showAlert(errorMessage, 'warning');
                // Provide example coordinates
                showAlert('You can manually enter coordinates or use Google Maps to find them.', 'info');
            }
        );
    } else {
        showAlert('Geolocation is not supported by your browser. Please enter coordinates manually.', 'warning');
    }
}

function setupBranchEventListeners() {
    // Setup listeners for the first (main) branch's get location button
    const firstGetLocationBtn = document.querySelector('.get-location-btn');
    if (firstGetLocationBtn && !firstGetLocationBtn.hasAttribute('onclick')) {
        firstGetLocationBtn.addEventListener('click', () => getGeoLocation(1));
    }
    
    // Setup submit handler for onboarding form
    const submitBtn = document.getElementById('submitOnboarding');
    if (submitBtn) {
        submitBtn.addEventListener('click', handleOnboardingSubmit);
    }
}

function handleOnboardingSubmit(e) {
    e.preventDefault();
    
    // Collect all branch data
    const branches = [];
    document.querySelectorAll('.branch-item').forEach(branch => {
        const branchData = {
            id: branch.getAttribute('data-branch-id'),
            name: branch.querySelector('.branch-name')?.value || '',
            type: branch.querySelector('.branch-type')?.value || '',
            address: branch.querySelector('.branch-address')?.value || '',
            city: branch.querySelector('.branch-city')?.value || '',
            state: branch.querySelector('.branch-state')?.value || '',
            postalCode: branch.querySelector('.branch-postal')?.value || '',
            latitude: branch.querySelector('.branch-latitude')?.value || '',
            longitude: branch.querySelector('.branch-longitude')?.value || '',
            phone: branch.querySelector('.branch-phone')?.value || '',
            email: branch.querySelector('.branch-email')?.value || '',
            bedCapacity: branch.querySelector('.branch-beds')?.value || ''
        };
        branches.push(branchData);
    });
    
    // Validate at least one branch has required fields
    const hasValidBranch = branches.some(b => b.name && b.address);
    
    if (!hasValidBranch) {
        showAlert('Please fill in at least the branch name and address for one location.', 'warning');
        return;
    }
    
    // Log the data (in real app, this would be sent to server)
    console.log('Onboarding Data:', {
        branches: branches,
        totalBranches: branches.length
    });
    
    showAlert(`Successfully saved ${branches.length} branch(es) with location data!`, 'success');
    
    // Optionally show summary
    const branchesWithGeo = branches.filter(b => b.latitude && b.longitude).length;
    if (branchesWithGeo > 0) {
        showAlert(`${branchesWithGeo} branch(es) have geo-location data and will appear on the map.`, 'info');
    }
}

// Make functions globally available
window.removeBranch = removeBranch;
window.getGeoLocation = getGeoLocation;

// ==========================================
// SOCIAL MEDIA INTEGRATION FUNCTIONALITY
// ==========================================

// Store connected platforms
const connectedPlatforms = new Set();

function connectSocialMedia(platform) {
    const platformNames = {
        'facebook': 'Facebook',
        'instagram': 'Instagram',
        'linkedin': 'LinkedIn',
        'twitter': 'Twitter/X',
        'gmb': 'Google My Business',
        'youtube': 'YouTube',
        'facebook-ads': 'Facebook Ads',
        'google-ads': 'Google Ads',
        'instagram-ads': 'Instagram Ads'
    };
    
    const platformName = platformNames[platform] || platform;
    
    // Show loading state
    showAlert(`Connecting to ${platformName}...`, 'info');
    
    // Simulate OAuth flow (in real app, this would redirect to OAuth provider)
    setTimeout(() => {
        // Add to connected platforms
        connectedPlatforms.add(platform);
        
        // Update UI
        updateSocialMediaUI(platform, true);
        
        // Show success message
        showAlert(`Successfully connected to ${platformName}! You can now post directly to this platform.`, 'success');
        
        // Store in localStorage for persistence
        localStorage.setItem('connectedPlatforms', JSON.stringify([...connectedPlatforms]));
    }, 1500);
}

function disconnectSocialMedia(platform) {
    const platformNames = {
        'facebook': 'Facebook',
        'instagram': 'Instagram',
        'linkedin': 'LinkedIn',
        'twitter': 'Twitter/X',
        'gmb': 'Google My Business',
        'youtube': 'YouTube',
        'facebook-ads': 'Facebook Ads',
        'google-ads': 'Google Ads',
        'instagram-ads': 'Instagram Ads'
    };
    
    const platformName = platformNames[platform] || platform;
    
    if (confirm(`Are you sure you want to disconnect ${platformName}? You won't be able to post to this platform until you reconnect.`)) {
        // Remove from connected platforms
        connectedPlatforms.delete(platform);
        
        // Update UI
        updateSocialMediaUI(platform, false);
        
        // Show success message
        showAlert(`Disconnected from ${platformName}`, 'info');
        
        // Update localStorage
        localStorage.setItem('connectedPlatforms', JSON.stringify([...connectedPlatforms]));
    }
}

function updateSocialMediaUI(platform, isConnected) {
    // Find the platform card
    const platformCard = document.querySelector(`.${platform}-btn`)?.closest('.social-connect-card');
    if (!platformCard) return;
    
    const connectBtn = platformCard.querySelector('.btn-connect');
    const connectedStatus = platformCard.querySelector('.connected-status');
    
    if (isConnected) {
        // Hide connect button, show connected status
        if (connectBtn) connectBtn.style.display = 'none';
        if (connectedStatus) connectedStatus.style.display = 'flex';
        
        // Add visual indicator to card
        platformCard.style.borderColor = '#28a745';
        platformCard.style.backgroundColor = '#f8fff9';
    } else {
        // Show connect button, hide connected status
        if (connectBtn) connectBtn.style.display = 'inline-block';
        if (connectedStatus) connectedStatus.style.display = 'none';
        
        // Remove visual indicator
        platformCard.style.borderColor = '#e9ecef';
        platformCard.style.backgroundColor = '#fff';
    }
}

function loadConnectedPlatforms() {
    // Load from localStorage on page load
    const stored = localStorage.getItem('connectedPlatforms');
    if (stored) {
        try {
            const platforms = JSON.parse(stored);
            platforms.forEach(platform => {
                connectedPlatforms.add(platform);
                updateSocialMediaUI(platform, true);
            });
        } catch (e) {
            console.error('Error loading connected platforms:', e);
        }
    }
}

// Make functions globally available
window.connectSocialMedia = connectSocialMedia;
window.disconnectSocialMedia = disconnectSocialMedia;

// ==========================================
// COMPETITOR ANALYSIS FUNCTIONALITY
// ==========================================

// Competitor data
const competitorsData = [
    {
        id: 1,
        name: 'Apollo Hospital',
        specialty: 'Multi-specialty',
        distance: 2.5,
        beds: 500,
        digitalFootprint: {
            score: 95,
            activity: 'highly-active',
            platforms: ['Google', 'Facebook', 'Instagram', 'Website']
        },
        reviews: {
            rating: 4.7,
            count: 12450
        },
        overlap: {
            percentage: 85,
            services: ['Cardiology', 'Orthopedics', 'Pediatrics', 'Neurology', 'Oncology']
        },
        proximity: 'high'
    },
    {
        id: 2,
        name: 'Care Hospital',
        specialty: 'Cardiology Focus',
        distance: 4.1,
        beds: 350,
        digitalFootprint: {
            score: 88,
            activity: 'highly-active',
            platforms: ['Google', 'Facebook', 'Website']
        },
        reviews: {
            rating: 4.5,
            count: 8920
        },
        overlap: {
            percentage: 72,
            services: ['Cardiology', 'Critical Care', 'Emergency']
        },
        proximity: 'medium'
    },
    {
        id: 3,
        name: 'Continental Hospital',
        specialty: 'Specialty Care',
        distance: 6.8,
        beds: 280,
        digitalFootprint: {
            score: 82,
            activity: 'moderately-active',
            platforms: ['Google', 'Facebook']
        },
        reviews: {
            rating: 4.3,
            count: 5640
        },
        overlap: {
            percentage: 68,
            services: ['Neurology', 'Oncology', 'Orthopedics']
        },
        proximity: 'medium'
    },
    {
        id: 4,
        name: 'Yashoda Hospital',
        specialty: 'Multi-specialty',
        distance: 3.2,
        beds: 450,
        digitalFootprint: {
            score: 90,
            activity: 'highly-active',
            platforms: ['Google', 'Facebook', 'Instagram', 'YouTube']
        },
        reviews: {
            rating: 4.6,
            count: 10230
        },
        overlap: {
            percentage: 78,
            services: ['Cardiology', 'Pediatrics', 'Gynecology', 'Orthopedics']
        },
        proximity: 'high'
    },
    {
        id: 5,
        name: 'Sunshine Hospital',
        specialty: 'General & Emergency',
        distance: 7.5,
        beds: 200,
        digitalFootprint: {
            score: 65,
            activity: 'moderately-active',
            platforms: ['Google', 'Website']
        },
        reviews: {
            rating: 4.1,
            count: 3420
        },
        overlap: {
            percentage: 52,
            services: ['Emergency', 'General Surgery', 'ICU']
        },
        proximity: 'low'
    },
    {
        id: 6,
        name: 'Maxcure Hospital',
        specialty: 'Multi-specialty',
        distance: 5.3,
        beds: 320,
        digitalFootprint: {
            score: 78,
            activity: 'moderately-active',
            platforms: ['Google', 'Facebook', 'Website']
        },
        reviews: {
            rating: 4.4,
            count: 6780
        },
        overlap: {
            percentage: 64,
            services: ['Cardiology', 'Neurology', 'Oncology']
        },
        proximity: 'medium'
    },
    {
        id: 7,
        name: 'KIMS Hospital',
        specialty: 'Tertiary Care',
        distance: 8.9,
        beds: 600,
        digitalFootprint: {
            score: 92,
            activity: 'highly-active',
            platforms: ['Google', 'Facebook', 'Instagram', 'Twitter', 'YouTube']
        },
        reviews: {
            rating: 4.8,
            count: 15670
        },
        overlap: {
            percentage: 88,
            services: ['Cardiology', 'Neurology', 'Oncology', 'Orthopedics', 'Pediatrics', 'Nephrology']
        },
        proximity: 'medium'
    },
    {
        id: 8,
        name: 'Rainbow Children Hospital',
        specialty: 'Pediatrics Specialist',
        distance: 4.7,
        beds: 180,
        digitalFootprint: {
            score: 85,
            activity: 'highly-active',
            platforms: ['Google', 'Facebook', 'Instagram']
        },
        reviews: {
            rating: 4.7,
            count: 8940
        },
        overlap: {
            percentage: 35,
            services: ['Pediatrics', 'Neonatology']
        },
        proximity: 'low'
    },
    {
        id: 9,
        name: 'Star Hospital',
        specialty: 'Multi-specialty',
        distance: 6.2,
        beds: 380,
        digitalFootprint: {
            score: 80,
            activity: 'moderately-active',
            platforms: ['Google', 'Facebook', 'Website']
        },
        reviews: {
            rating: 4.2,
            count: 5120
        },
        overlap: {
            percentage: 70,
            services: ['Cardiology', 'Orthopedics', 'Gastroenterology']
        },
        proximity: 'medium'
    },
    {
        id: 10,
        name: 'AIG Hospital',
        specialty: 'Gastroenterology Focus',
        distance: 9.5,
        beds: 150,
        digitalFootprint: {
            score: 75,
            activity: 'moderately-active',
            platforms: ['Google', 'Website']
        },
        reviews: {
            rating: 4.5,
            count: 4230
        },
        overlap: {
            percentage: 42,
            services: ['Gastroenterology', 'Hepatology']
        },
        proximity: 'low'
    },
    {
        id: 11,
        name: 'Krishna Institute of Medical Sciences',
        specialty: 'Multi-specialty',
        distance: 11.2,
        beds: 550,
        digitalFootprint: {
            score: 88,
            activity: 'highly-active',
            platforms: ['Google', 'Facebook', 'Instagram', 'Website']
        },
        reviews: {
            rating: 4.6,
            count: 9870
        },
        overlap: {
            percentage: 75,
            services: ['Cardiology', 'Neurology', 'Oncology', 'Orthopedics']
        },
        proximity: 'low'
    },
    {
        id: 12,
        name: 'Medicover Hospital',
        specialty: 'Multi-specialty',
        distance: 3.8,
        beds: 300,
        digitalFootprint: {
            score: 82,
            activity: 'moderately-active',
            platforms: ['Google', 'Facebook', 'Website']
        },
        reviews: {
            rating: 4.3,
            count: 6120
        },
        overlap: {
            percentage: 66,
            services: ['General Surgery', 'Orthopedics', 'Gynecology']
        },
        proximity: 'high'
    }
];

let currentSort = { column: 'distance', order: 'asc' };
let filteredCompetitors = [...competitorsData];

// Initialize Competitor Analysis
function initializeCompetitorAnalysis() {
    setupCompetitorEventListeners();
    renderCompetitorsTable();
    updateCompetitorStats();
    renderMapCompetitors();
}

function setupCompetitorEventListeners() {
    // View toggle
    const listViewBtn = document.getElementById('listViewBtn');
    const mapViewBtn = document.getElementById('mapViewBtn');
    
    if (listViewBtn && mapViewBtn) {
        listViewBtn.addEventListener('click', () => {
            toggleCompetitorView('list');
        });
        
        mapViewBtn.addEventListener('click', () => {
            toggleCompetitorView('map');
        });
    }
    
    // Search
    const searchInput = document.getElementById('competitorSearch');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            filterCompetitors();
        });
    }
    
    // Radius slider
    const radiusSlider = document.getElementById('radiusSlider');
    const radiusValue = document.getElementById('radiusValue');
    if (radiusSlider && radiusValue) {
        radiusSlider.addEventListener('input', (e) => {
            radiusValue.textContent = e.target.value;
            filterCompetitors();
        });
    }
    
    // Service filter
    const serviceFilter = document.getElementById('serviceFilter');
    if (serviceFilter) {
        serviceFilter.addEventListener('change', () => {
            filterCompetitors();
        });
    }
    
    // Reset filters
    const resetBtn = document.getElementById('resetFilters');
    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            if (searchInput) searchInput.value = '';
            if (radiusSlider) {
                radiusSlider.value = 20;
                radiusValue.textContent = '20';
            }
            if (serviceFilter) serviceFilter.value = 'all';
            filterCompetitors();
        });
    }
    
    // Table header sorting
    document.querySelectorAll('.competitors-table th.sortable').forEach(th => {
        th.addEventListener('click', () => {
            const sortColumn = th.getAttribute('data-sort');
            handleSort(sortColumn);
        });
    });
}

function toggleCompetitorView(view) {
    const listView = document.getElementById('competitorListView');
    const mapView = document.getElementById('competitorMapView');
    const listBtn = document.getElementById('listViewBtn');
    const mapBtn = document.getElementById('mapViewBtn');
    
    if (view === 'list') {
        listView.classList.add('active');
        mapView.classList.remove('active');
        listBtn.classList.add('active');
        mapBtn.classList.remove('active');
    } else {
        listView.classList.remove('active');
        mapView.classList.add('active');
        listBtn.classList.remove('active');
        mapBtn.classList.add('active');
    }
}

function filterCompetitors() {
    const searchTerm = document.getElementById('competitorSearch')?.value.toLowerCase() || '';
    const maxDistance = parseFloat(document.getElementById('radiusSlider')?.value || 20);
    const serviceFilter = document.getElementById('serviceFilter')?.value || 'all';
    
    filteredCompetitors = competitorsData.filter(competitor => {
        // Search filter
        const matchesSearch = competitor.name.toLowerCase().includes(searchTerm) ||
                            competitor.specialty.toLowerCase().includes(searchTerm);
        
        // Distance filter
        const withinDistance = competitor.distance <= maxDistance;
        
        // Service filter
        const matchesService = serviceFilter === 'all' || 
                              competitor.specialty.toLowerCase().includes(serviceFilter.toLowerCase()) ||
                              competitor.overlap.services.some(s => s.toLowerCase().includes(serviceFilter.toLowerCase()));
        
        return matchesSearch && withinDistance && matchesService;
    });
    
    renderCompetitorsTable();
    updateCompetitorStats();
    renderMapCompetitors();
}

function handleSort(column) {
    // Update sort state
    if (currentSort.column === column) {
        currentSort.order = currentSort.order === 'asc' ? 'desc' : 'asc';
    } else {
        currentSort.column = column;
        currentSort.order = 'asc';
    }
    
    // Update UI
    document.querySelectorAll('.competitors-table th.sortable').forEach(th => {
        th.classList.remove('asc', 'desc');
    });
    
    const activeTh = document.querySelector(`.competitors-table th[data-sort="${column}"]`);
    if (activeTh) {
        activeTh.classList.add(currentSort.order);
    }
    
    // Sort data
    filteredCompetitors.sort((a, b) => {
        let aVal, bVal;
        
        switch (column) {
            case 'name':
                aVal = a.name;
                bVal = b.name;
                break;
            case 'distance':
                aVal = a.distance;
                bVal = b.distance;
                break;
            case 'beds':
                aVal = a.beds;
                bVal = b.beds;
                break;
            case 'digital':
                aVal = a.digitalFootprint.score;
                bVal = b.digitalFootprint.score;
                break;
            case 'reviews':
                aVal = a.reviews.rating;
                bVal = b.reviews.rating;
                break;
            case 'overlap':
                aVal = a.overlap.percentage;
                bVal = b.overlap.percentage;
                break;
            case 'proximity':
                const proximityOrder = { 'high': 3, 'medium': 2, 'low': 1 };
                aVal = proximityOrder[a.proximity];
                bVal = proximityOrder[b.proximity];
                break;
            default:
                return 0;
        }
        
        if (typeof aVal === 'string') {
            return currentSort.order === 'asc' 
                ? aVal.localeCompare(bVal)
                : bVal.localeCompare(aVal);
        } else {
            return currentSort.order === 'asc' 
                ? aVal - bVal
                : bVal - aVal;
        }
    });
    
    renderCompetitorsTable();
}

function renderCompetitorsTable() {
    const tbody = document.getElementById('competitorsTableBody');
    if (!tbody) return;
    
    if (filteredCompetitors.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="8" class="text-center text-muted py-4">
                    <i class="fas fa-search fa-2x mb-2"></i>
                    <p>No competitors found matching your filters</p>
                </td>
            </tr>
        `;
        return;
    }
    
    tbody.innerHTML = filteredCompetitors.map(competitor => `
        <tr>
            <td>
                <div class="competitor-name-cell">${competitor.name}</div>
                <span class="competitor-specialty">${competitor.specialty}</span>
            </td>
            <td>
                <span class="distance-badge ${getDistanceClass(competitor.distance)}">
                    <i class="fas fa-map-marker-alt"></i>
                    ${competitor.distance} km
                </span>
            </td>
            <td>
                <span class="bed-capacity">${competitor.beds}</span> beds
            </td>
            <td>
                <div class="digital-footprint">
                    <div class="digital-indicator">
                        <i class="fas fa-chart-line" style="color: ${getDigitalColor(competitor.digitalFootprint.score)}"></i>
                        <strong>${competitor.digitalFootprint.score}</strong>
                    </div>
                    <span class="activity-badge ${competitor.digitalFootprint.activity}">
                        ${competitor.digitalFootprint.activity.replace('-', ' ')}
                    </span>
                </div>
                <small class="text-muted d-block mt-1">${competitor.digitalFootprint.platforms.length} platforms</small>
            </td>
            <td>
                <div class="review-rating">
                    <div class="rating-stars">
                        ${generateStars(competitor.reviews.rating)}
                        <strong class="ms-1">${competitor.reviews.rating}</strong>
                    </div>
                    <span class="review-count">${competitor.reviews.count.toLocaleString()} reviews</span>
                </div>
            </td>
            <td>
                <div class="overlap-container">
                    <div class="d-flex justify-content-between align-items-center mb-1">
                        <span class="overlap-percentage">${competitor.overlap.percentage}%</span>
                    </div>
                    <div class="overlap-bar">
                        <div class="overlap-fill ${getOverlapClass(competitor.overlap.percentage)}" 
                             style="width: ${competitor.overlap.percentage}%"></div>
                    </div>
                    <small class="overlap-services">${competitor.overlap.services.slice(0, 3).join(', ')}${competitor.overlap.services.length > 3 ? '...' : ''}</small>
                </div>
            </td>
            <td>
                <span class="impact-badge ${competitor.proximity}">
                    ${competitor.proximity} Impact
                </span>
            </td>
            <td>
                <div class="competitor-actions">
                    <button class="btn btn-sm btn-outline-primary" onclick="viewCompetitorDetails(${competitor.id})" title="View Details">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-info" onclick="compareCompetitor(${competitor.id})" title="Compare">
                        <i class="fas fa-balance-scale"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

function renderMapCompetitors() {
    const container = document.getElementById('mapCompetitorsList');
    if (!container) return;
    
    container.innerHTML = filteredCompetitors.map(competitor => `
        <div class="map-competitor-item" onclick="focusOnCompetitor(${competitor.id})">
            <div class="d-flex justify-content-between align-items-start mb-2">
                <strong class="text-truncate">${competitor.name}</strong>
                <span class="badge ${competitor.proximity === 'high' ? 'bg-danger' : competitor.proximity === 'medium' ? 'bg-warning' : 'bg-success'} ms-2">
                    ${competitor.distance} km
                </span>
            </div>
            <div class="small text-muted mb-1">${competitor.specialty}</div>
            <div class="d-flex justify-content-between align-items-center">
                <span class="small">
                    <i class="fas fa-star text-warning"></i> ${competitor.reviews.rating}
                </span>
                <span class="small">${competitor.beds} beds</span>
                <span class="small">${competitor.overlap.percentage}% overlap</span>
            </div>
        </div>
    `).join('');
}

function updateCompetitorStats() {
    const totalElem = document.getElementById('totalCompetitors');
    const highThreatElem = document.getElementById('highThreat');
    const avgOverlapElem = document.getElementById('avgOverlap');
    
    if (totalElem) totalElem.textContent = filteredCompetitors.length;
    
    if (highThreatElem) {
        const highThreat = filteredCompetitors.filter(c => c.proximity === 'high').length;
        highThreatElem.textContent = highThreat;
    }
    
    if (avgOverlapElem) {
        const avgOverlap = filteredCompetitors.reduce((sum, c) => sum + c.overlap.percentage, 0) / filteredCompetitors.length;
        avgOverlapElem.textContent = Math.round(avgOverlap) + '%';
    }
}

function getDistanceClass(distance) {
    if (distance < 4) return 'close';
    if (distance < 8) return 'medium';
    return 'far';
}

function getDigitalColor(score) {
    if (score >= 85) return '#28a745';
    if (score >= 70) return '#ffc107';
    return '#dc3545';
}

function generateStars(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    let stars = '';
    
    for (let i = 0; i < fullStars; i++) {
        stars += '<i class="fas fa-star"></i>';
    }
    if (hasHalfStar) {
        stars += '<i class="fas fa-star-half-alt"></i>';
    }
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
        stars += '<i class="far fa-star"></i>';
    }
    
    return stars;
}

function getOverlapClass(percentage) {
    if (percentage >= 75) return 'high';
    if (percentage >= 50) return 'medium';
    return 'low';
}

function viewCompetitorDetails(id) {
    const competitor = competitorsData.find(c => c.id === id);
    if (!competitor) return;
    
    showAlert(`Viewing details for ${competitor.name}`, 'info');
    // Here you could open a modal with detailed competitor information
}

function compareCompetitor(id) {
    const competitor = competitorsData.find(c => c.id === id);
    if (!competitor) return;
    
    showAlert(`Comparing with ${competitor.name}`, 'info');
    // Here you could show a comparison view
}

function focusOnCompetitor(id) {
    // Remove active class from all items
    document.querySelectorAll('.map-competitor-item').forEach(item => {
        item.classList.remove('active');
    });
    
    // Add active class to clicked item
    const items = document.querySelectorAll('.map-competitor-item');
    const index = competitorsData.findIndex(c => c.id === id);
    if (items[index]) {
        items[index].classList.add('active');
    }
    
    showAlert(`Focusing on competitor location`, 'info');
    // Here you would center the map on the competitor's location
}

// Make functions available globally
window.viewCompetitorDetails = viewCompetitorDetails;
window.compareCompetitor = compareCompetitor;
window.focusOnCompetitor = focusOnCompetitor;

// Add to initialization
const originalInit = initializeApp;
initializeApp = function() {
    originalInit();
    initializeCompetitorAnalysis();
    initializeContentCalendar();
};

// ==========================================
// CONTENT CALENDAR FUNCTIONALITY
// ==========================================

// Sample content posts data
const contentPosts = [
    {
        id: 1,
        title: 'Heart Health Awareness Week',
        content: 'Join us for Heart Health Awareness Week! Free cardiac screenings available. Book your appointment today.',
        platforms: ['facebook', 'instagram'],
        scheduledDate: '2025-11-05',
        scheduledTime: '10:00',
        status: 'pending',
        type: 'ai',
        image: null,
        engagement: { likes: 0, shares: 0, comments: 0 },
        createdBy: 'AI Assistant'
    },
    {
        id: 2,
        title: 'New Pediatric Wing Opening',
        content: 'We are excited to announce the opening of our new state-of-the-art pediatric wing! Advanced care for your little ones.',
        platforms: ['facebook', 'twitter', 'linkedin'],
        scheduledDate: '2025-11-08',
        scheduledTime: '14:00',
        status: 'approved',
        type: 'manual',
        image: null,
        engagement: { likes: 0, shares: 0, comments: 0 },
        createdBy: 'Marketing Team'
    },
    {
        id: 3,
        title: 'Happy Diwali - Festival of Lights',
        content: '✨ Wishing you and your family a bright and prosperous Diwali! May this festival of lights bring health, happiness, and wellness to your home. 🪔 Free health check-ups available this festive season!',
        platforms: ['facebook', 'instagram', 'twitter'],
        scheduledDate: '2025-11-01',
        scheduledTime: '08:00',
        status: 'approved',
        type: 'ai',
        image: null,
        engagement: { likes: 0, shares: 0, comments: 0 },
        createdBy: 'AI Assistant'
    },
    {
        id: 4,
        title: 'Diabetes Management Workshop',
        content: 'Free diabetes management workshop this Saturday! Learn about diet, exercise, and medication management from our experts.',
        platforms: ['facebook', 'instagram'],
        scheduledDate: '2025-11-12',
        scheduledTime: '09:00',
        status: 'scheduled',
        type: 'manual',
        image: null,
        engagement: { likes: 0, shares: 0, comments: 0 },
        createdBy: 'Dr. Sharma'
    },
    {
        id: 5,
        title: 'World Diabetes Day',
        content: '💙 Today on World Diabetes Day, let\'s raise awareness about diabetes prevention and management. Get your free blood sugar screening at our hospital. Early detection saves lives!',
        platforms: ['facebook', 'instagram', 'linkedin'],
        scheduledDate: '2025-11-14',
        scheduledTime: '10:00',
        status: 'pending',
        type: 'ai',
        image: null,
        engagement: { likes: 0, shares: 0, comments: 0 },
        createdBy: 'AI Assistant'
    },
    {
        id: 6,
        title: 'Cardiology Excellence Award',
        content: 'Proud to announce our Cardiology department has received the Excellence in Patient Care Award 2025!',
        platforms: ['linkedin', 'twitter'],
        scheduledDate: '2025-11-02',
        scheduledTime: '11:00',
        status: 'published',
        type: 'manual',
        image: null,
        engagement: { likes: 247, shares: 56, comments: 34 },
        createdBy: 'PR Team'
    },
    {
        id: 7,
        title: 'Orthopedic Care Tips',
        content: '5 Tips for Better Joint Health: Stay active, maintain healthy weight, proper posture, adequate calcium, and regular check-ups.',
        platforms: ['instagram', 'facebook'],
        scheduledDate: '2025-11-15',
        scheduledTime: '16:00',
        status: 'pending',
        type: 'ai',
        image: null,
        engagement: { likes: 0, shares: 0, comments: 0 },
        createdBy: 'AI Assistant'
    },
    {
        id: 8,
        title: 'Mental Health Awareness',
        content: 'Your mental health matters. Our counseling services are here to support you. Book a confidential session today.',
        platforms: ['facebook', 'twitter'],
        scheduledDate: '2025-11-18',
        scheduledTime: '12:00',
        status: 'pending',
        type: 'ai',
        image: null,
        engagement: { likes: 0, shares: 0, comments: 0 },
        createdBy: 'AI Assistant'
    },
    {
        id: 9,
        title: 'Emergency Care Available 24/7',
        content: 'Medical emergencies don\'t wait. Neither do we. Our emergency department is equipped and staffed 24/7 for your care.',
        platforms: ['facebook'],
        scheduledDate: '2025-11-20',
        scheduledTime: '18:00',
        status: 'draft',
        type: 'manual',
        image: null,
        engagement: { likes: 0, shares: 0, comments: 0 },
        createdBy: 'Marketing Team'
    },
    {
        id: 10,
        title: 'Vaccination Drive',
        content: 'Flu season is here! Get your flu shot at our hospital. Walk-ins welcome. Protect yourself and your loved ones.',
        platforms: ['facebook', 'instagram', 'twitter'],
        scheduledDate: '2025-11-22',
        scheduledTime: '10:00',
        status: 'approved',
        type: 'manual',
        image: null,
        engagement: { likes: 0, shares: 0, comments: 0 },
        createdBy: 'Health Team'
    },
    {
        id: 11,
        title: 'Merry Christmas & Happy Holidays',
        content: '🎄 Wishing you a Merry Christmas filled with joy, peace, and good health! Our emergency services remain available 24/7 throughout the holiday season. May this festive season bring wellness to you and your loved ones! 🎅',
        platforms: ['facebook', 'instagram', 'twitter', 'linkedin'],
        scheduledDate: '2025-12-25',
        scheduledTime: '07:00',
        status: 'draft',
        type: 'ai',
        image: null,
        engagement: { likes: 0, shares: 0, comments: 0 },
        createdBy: 'AI Assistant'
    }
];

// Calendar events/festivals
const calendarEvents = [
    { date: '2025-11-01', name: 'Diwali', icon: '🪔' },
    { date: '2025-11-14', name: 'World Diabetes Day', icon: '💙' },
    { date: '2025-12-25', name: 'Christmas', icon: '🎄' },
    { date: '2025-01-01', name: 'New Year', icon: '🎉' },
    { date: '2025-01-26', name: 'Republic Day', icon: '🇮🇳' },
    { date: '2025-03-08', name: 'Women\'s Day', icon: '👩' },
    { date: '2025-03-21', name: 'World Down Syndrome Day', icon: '💛' },
    { date: '2025-04-07', name: 'World Health Day', icon: '🏥' }
];

let currentMonth = 10; // November (0-indexed)
let currentYear = 2025;
let currentCalendarView = 'calendar';

function initializeContentCalendar() {
    setupContentCalendarListeners();
    renderCalendar();
    renderContentPostsList();
    renderPendingApprovals();
}

function setupContentCalendarListeners() {
    // View toggle
    const calendarViewBtn = document.getElementById('calendarViewBtn');
    const listViewBtn = document.getElementById('listViewContentBtn');
    
    if (calendarViewBtn && listViewBtn) {
        calendarViewBtn.addEventListener('click', () => {
            toggleContentView('calendar');
        });
        
        listViewBtn.addEventListener('click', () => {
            toggleContentView('list');
        });
    }
    
    // Month navigation
    const prevMonthBtn = document.getElementById('prevMonth');
    const nextMonthBtn = document.getElementById('nextMonth');
    const todayBtn = document.getElementById('todayBtn');
    
    if (prevMonthBtn) {
        prevMonthBtn.addEventListener('click', () => {
            currentMonth--;
            if (currentMonth < 0) {
                currentMonth = 11;
                currentYear--;
            }
            renderCalendar();
        });
    }
    
    if (nextMonthBtn) {
        nextMonthBtn.addEventListener('click', () => {
            currentMonth++;
            if (currentMonth > 11) {
                currentMonth = 0;
                currentYear++;
            }
            renderCalendar();
        });
    }
    
    if (todayBtn) {
        todayBtn.addEventListener('click', () => {
            const today = new Date();
            currentMonth = today.getMonth();
            currentYear = today.getFullYear();
            renderCalendar();
        });
    }
    
    // Create post button
    const createPostBtn = document.getElementById('createPostBtn');
    if (createPostBtn) {
        createPostBtn.addEventListener('click', () => {
            showCreatePostModal();
        });
    }
    
    // Generate AI content
    const generateAIBtn = document.getElementById('generateAIContentBtn');
    if (generateAIBtn) {
        generateAIBtn.addEventListener('click', () => {
            showGenerateAIContentModal();
        });
    }
    
    // Filters
    const platformFilter = document.getElementById('platformFilter');
    const statusFilter = document.getElementById('statusFilter');
    
    if (platformFilter) {
        platformFilter.addEventListener('change', () => {
            renderContentPostsList();
            renderPendingApprovals();
        });
    }
    
    if (statusFilter) {
        statusFilter.addEventListener('change', () => {
            renderContentPostsList();
            renderPendingApprovals();
        });
    }
}

function toggleContentView(view) {
    const calendarView = document.getElementById('calendarViewContainer');
    const listView = document.getElementById('listViewContentContainer');
    const calendarBtn = document.getElementById('calendarViewBtn');
    const listBtn = document.getElementById('listViewContentBtn');
    
    if (view === 'calendar') {
        calendarView?.classList.add('active');
        listView?.classList.remove('active');
        calendarBtn?.classList.add('active');
        listBtn?.classList.remove('active');
        currentCalendarView = 'calendar';
    } else {
        calendarView?.classList.remove('active');
        listView?.classList.add('active');
        calendarBtn?.classList.remove('active');
        listBtn?.classList.add('active');
        currentCalendarView = 'list';
    }
}

function renderCalendar() {
    const calendarContainer = document.getElementById('contentCalendar');
    const monthYearDisplay = document.getElementById('currentMonthYear');
    
    if (!calendarContainer) return;
    
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
                       'July', 'August', 'September', 'October', 'November', 'December'];
    
    if (monthYearDisplay) {
        monthYearDisplay.textContent = `${monthNames[currentMonth]} ${currentYear}`;
    }
    
    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    const prevMonthLastDay = new Date(currentYear, currentMonth, 0).getDate();
    
    let html = `
        <div class="calendar-header">
            <div class="calendar-day-header">Sun</div>
            <div class="calendar-day-header">Mon</div>
            <div class="calendar-day-header">Tue</div>
            <div class="calendar-day-header">Wed</div>
            <div class="calendar-day-header">Thu</div>
            <div class="calendar-day-header">Fri</div>
            <div class="calendar-day-header">Sat</div>
        </div>
    `;
    
    // Previous month days
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
        const day = prevMonthLastDay - i;
        html += `<div class="calendar-day other-month"><div class="calendar-day-number">${day}</div></div>`;
    }
    
    // Current month days
    const today = new Date();
    for (let day = 1; day <= daysInMonth; day++) {
        const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const isToday = today.getDate() === day && 
                       today.getMonth() === currentMonth && 
                       today.getFullYear() === currentYear;
        
        const postsForDay = contentPosts.filter(post => post.scheduledDate === dateStr);
        const eventsForDay = calendarEvents.filter(event => event.date === dateStr);
        
        html += `
            <div class="calendar-day ${isToday ? 'today' : ''}" onclick="handleDayClick('${dateStr}')">
                <div class="calendar-day-number">${day}</div>
                ${eventsForDay.length > 0 ? `
                    <div class="calendar-event-label">
                        ${eventsForDay[0].icon} ${eventsForDay[0].name}
                    </div>
                ` : ''}
                <div class="calendar-posts">
                    ${postsForDay.slice(0, 3).map(post => `
                        <div class="calendar-post-item ${post.status} ${post.type === 'ai' ? 'ai-generated' : ''}" 
                             onclick="event.stopPropagation(); viewPost(${post.id})">
                            <span class="calendar-post-platform ${post.platforms[0]}">
                                ${getPlatformIcon(post.platforms[0])}
                            </span>
                            <span class="calendar-post-text">${post.title}</span>
                        </div>
                    `).join('')}
                    ${postsForDay.length > 3 ? `<div class="calendar-post-more">+${postsForDay.length - 3} more</div>` : ''}
                </div>
            </div>
        `;
    }
    
    // Next month days
    const totalCells = startingDayOfWeek + daysInMonth;
    const remainingCells = 42 - totalCells; // 6 rows * 7 days
    for (let day = 1; day <= remainingCells; day++) {
        html += `<div class="calendar-day other-month"><div class="calendar-day-number">${day}</div></div>`;
    }
    
    calendarContainer.innerHTML = html;
}

function renderContentPostsList() {
    const tbody = document.getElementById('contentPostsTableBody');
    if (!tbody) return;
    
    const platformFilter = document.getElementById('platformFilter')?.value || 'all';
    const statusFilter = document.getElementById('statusFilter')?.value || 'all';
    
    let filteredPosts = contentPosts;
    
    if (platformFilter !== 'all') {
        filteredPosts = filteredPosts.filter(post => post.platforms.includes(platformFilter));
    }
    
    if (statusFilter !== 'all') {
        filteredPosts = filteredPosts.filter(post => post.status === statusFilter);
    }
    
    if (filteredPosts.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="9" class="text-center text-muted py-5">
                    <i class="fas fa-calendar-times fa-3x mb-3"></i>
                    <p>No content posts found</p>
                </td>
            </tr>
        `;
        return;
    }
    
    tbody.innerHTML = filteredPosts.map(post => `
        <tr>
            <td>
                <input type="checkbox" class="form-check-input">
            </td>
            <td>
                ${post.image ? 
                    `<img src="${post.image}" class="post-preview-img" alt="${post.title}">` :
                    `<div class="post-preview-placeholder">
                        <i class="fas fa-image"></i>
                    </div>`
                }
            </td>
            <td>
                <div class="post-content-cell">
                    <div class="post-title">${post.title}</div>
                    <div class="post-excerpt">${post.content}</div>
                </div>
            </td>
            <td>
                <div class="platform-badges">
                    ${post.platforms.map(platform => `
                        <span class="platform-badge ${platform}">
                            <i class="fab fa-${platform}"></i>
                            ${platform.charAt(0).toUpperCase() + platform.slice(1)}
                        </span>
                    `).join('')}
                </div>
            </td>
            <td>
                <div class="text-nowrap">
                    <i class="far fa-calendar me-1"></i>${formatDate(post.scheduledDate)}
                </div>
                <div class="text-muted small mt-1">
                    <i class="far fa-clock me-1"></i>${post.scheduledTime}
                </div>
            </td>
            <td>
                <span class="status-badge ${post.status}">${post.status}</span>
            </td>
            <td>
                <span class="type-badge ${post.type}">${post.type === 'ai' ? 'AI Generated' : 'Manual'}</span>
            </td>
            <td>
                ${post.status === 'published' ? `
                    <div class="engagement-stats">
                        <div class="engagement-item">
                            <i class="fas fa-heart"></i>
                            <span>${post.engagement.likes}</span>
                        </div>
                        <div class="engagement-item">
                            <i class="fas fa-share"></i>
                            <span>${post.engagement.shares}</span>
                        </div>
                        <div class="engagement-item">
                            <i class="fas fa-comment"></i>
                            <span>${post.engagement.comments}</span>
                        </div>
                    </div>
                ` : `<span class="text-muted small">Not published</span>`}
            </td>
            <td>
                <div class="d-flex gap-1">
                    ${post.status === 'pending' ? `
                        <button class="btn btn-sm btn-success" onclick="approvePost(${post.id})" title="Approve">
                            <i class="fas fa-check"></i>
                        </button>
                        <button class="btn btn-sm btn-danger" onclick="rejectPost(${post.id})" title="Reject">
                            <i class="fas fa-times"></i>
                        </button>
                    ` : `
                        <button class="btn btn-sm btn-outline-primary" onclick="editPost(${post.id})" title="Edit">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-sm btn-outline-danger" onclick="deletePost(${post.id})" title="Delete">
                            <i class="fas fa-trash"></i>
                        </button>
                    `}
                </div>
            </td>
        </tr>
    `).join('');
}

function renderPendingApprovals() {
    const container = document.getElementById('pendingApprovalsContainer');
    const countBadge = document.getElementById('pendingCount');
    
    if (!container) return;
    
    const pendingPosts = contentPosts.filter(post => post.status === 'pending');
    
    if (countBadge) {
        countBadge.textContent = pendingPosts.length;
    }
    
    if (pendingPosts.length === 0) {
        container.innerHTML = `
            <div class="col-12 text-center text-muted py-4">
                <i class="fas fa-check-circle fa-3x mb-3"></i>
                <p>No posts pending approval</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = pendingPosts.map(post => `
        <div class="col-md-4">
            <div class="pending-post-card">
                ${post.type === 'ai' ? '<div class="ai-badge"><i class="fas fa-magic"></i> AI Generated</div>' : ''}
                
                ${post.image ?
                    `<img src="${post.image}" class="pending-post-image" alt="${post.title}">` :
                    `<div class="pending-post-image-placeholder">
                        <i class="fas fa-image"></i>
                    </div>`
                }
                
                <div class="pending-post-content">
                    <h6>${post.title}</h6>
                    <p class="pending-post-text">${post.content}</p>
                    
                    <div class="pending-post-meta">
                        <div class="pending-post-meta-item">
                            <i class="far fa-calendar"></i>
                            ${formatDate(post.scheduledDate)}
                        </div>
                        <div class="pending-post-meta-item">
                            <i class="far fa-clock"></i>
                            ${post.scheduledTime}
                        </div>
                        <div class="pending-post-meta-item">
                            <i class="fas fa-user"></i>
                            ${post.createdBy}
                        </div>
                    </div>
                    
                    <div class="platform-badges mb-3">
                        ${post.platforms.map(platform => `
                            <span class="platform-badge ${platform}">
                                <i class="fab fa-${platform}"></i>
                                ${platform.charAt(0).toUpperCase() + platform.slice(1)}
                            </span>
                        `).join('')}
                    </div>
                    
                    <div class="pending-post-actions">
                        <button class="btn btn-success" onclick="approvePost(${post.id})">
                            <i class="fas fa-check me-1"></i>Approve
                        </button>
                        <button class="btn btn-outline-secondary" onclick="viewPost(${post.id})">
                            <i class="fas fa-eye me-1"></i>Review
                        </button>
                        <button class="btn btn-outline-danger" onclick="rejectPost(${post.id})">
                            <i class="fas fa-times me-1"></i>Reject
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

function getPlatformIcon(platform) {
    const icons = {
        'facebook': 'f',
        'instagram': 'ig',
        'twitter': 't',
        'linkedin': 'in'
    };
    return icons[platform] || '?';
}

function formatDate(dateStr) {
    const date = new Date(dateStr);
    const options = { month: 'short', day: 'numeric', year: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

function handleDayClick(dateStr) {
    showCreatePostModal(dateStr);
}

function viewPost(postId) {
    const post = contentPosts.find(p => p.id === postId);
    if (!post) return;
    
    // Here you would show a modal with full post details
    showAlert(`Viewing post: ${post.title}`, 'info');
}

function approvePost(postId) {
    const post = contentPosts.find(p => p.id === postId);
    if (!post) return;
    
    post.status = 'approved';
    
    showAlert(`Post "${post.title}" has been approved and will be scheduled for posting!`, 'success');
    
    // Refresh displays
    renderCalendar();
    renderContentPostsList();
    renderPendingApprovals();
}

function rejectPost(postId) {
    const post = contentPosts.find(p => p.id === postId);
    if (!post) return;
    
    if (confirm(`Are you sure you want to reject "${post.title}"?`)) {
        post.status = 'draft';
        showAlert(`Post "${post.title}" has been rejected and moved to drafts.`, 'warning');
        
        // Refresh displays
        renderCalendar();
        renderContentPostsList();
        renderPendingApprovals();
    }
}

function editPost(postId) {
    showAlert('Edit functionality coming soon!', 'info');
}

function deletePost(postId) {
    const post = contentPosts.find(p => p.id === postId);
    if (!post) return;
    
    if (confirm(`Are you sure you want to delete "${post.title}"?`)) {
        const index = contentPosts.findIndex(p => p.id === postId);
        contentPosts.splice(index, 1);
        
        showAlert('Post deleted successfully!', 'success');
        
        // Refresh displays
        renderCalendar();
        renderContentPostsList();
        renderPendingApprovals();
    }
}

function showCreatePostModal(dateStr = null) {
    const today = new Date();
    const defaultDate = dateStr || today.toISOString().split('T')[0];
    
    showAlert('Create post modal would open here with date: ' + defaultDate, 'info');
    // In a full implementation, this would show a modal with a form to create a new post
}

function showGenerateAIContentModal() {
    showAlert('AI Content Generation: This would open a modal where you can specify the topic, target audience, and platform, and AI will generate optimized content with images!', 'info');
    // In a full implementation, this would show a modal with AI generation options
}

// Make functions globally available
window.handleDayClick = handleDayClick;
window.viewPost = viewPost;
window.approvePost = approvePost;
window.rejectPost = rejectPost;
window.editPost = editPost;
window.deletePost = deletePost;