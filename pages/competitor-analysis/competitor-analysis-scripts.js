class CompetitorAnalysisPage {
    constructor() {
        this.competitors = [];
        this.filteredCompetitors = [];
        this.campaigns = [];
        this.insights = [];
        this.marketShareChart = null;
        this.marketTrendsChart = null;
        this.filters = {
            search: '',
            category: '',
            campaignType: ''
        };
        this.init();
    }

    init() {
        this.generateSampleData();
        this.renderOverview();
        this.renderCompetitors();
        this.initializeCharts();
        this.initializeEventHandlers();
        this.setupPositioningChart();
    }

    generateSampleData() {
        // Generate competitors
        this.competitors = [
            {
                id: 1,
                name: 'City General Hospital',
                category: 'hospital',
                website: 'https://citygeneral.com',
                location: 'Downtown Metro Area',
                revenue: 'large',
                threatLevel: 'high',
                marketShare: 28,
                marketShareChange: +2.1,
                revenueEst: '$890M',
                patientVolume: '125K+',
                geographicReach: 'Metropolitan',
                specialties: ['cardiology', 'oncology', 'emergency', 'neurology'],
                qualityScore: 85,
                priceScore: 70,
                notes: 'Major regional competitor with strong brand recognition',
                lastUpdated: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
            },
            {
                id: 2,
                name: 'MedTech Digital Health',
                category: 'digital',
                website: 'https://medtechdigital.com',
                location: 'San Francisco, CA',
                revenue: 'medium',
                threatLevel: 'medium',
                marketShare: 15,
                marketShareChange: +5.8,
                revenueEst: '$45M',
                patientVolume: '89K+',
                geographicReach: 'National',
                specialties: ['telemedicine', 'remote monitoring'],
                qualityScore: 78,
                priceScore: 85,
                notes: 'Rapidly growing digital health platform',
                lastUpdated: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
            },
            {
                id: 3,
                name: 'Specialty Care Centers',
                category: 'specialty',
                website: 'https://specialtycare.com',
                location: 'Multiple Locations',
                revenue: 'medium',
                threatLevel: 'medium',
                marketShare: 12,
                marketShareChange: -1.2,
                revenueEst: '$67M',
                patientVolume: '34K+',
                geographicReach: 'Regional',
                specialties: ['orthopedics', 'cardiology', 'oncology'],
                qualityScore: 90,
                priceScore: 60,
                notes: 'High-quality specialty care network',
                lastUpdated: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
            },
            {
                id: 4,
                name: 'Community Health Network',
                category: 'clinic',
                website: 'https://communityhealthnet.com',
                location: 'Suburban Area',
                revenue: 'medium',
                threatLevel: 'low',
                marketShare: 8,
                marketShareChange: +0.5,
                revenueEst: '$23M',
                patientVolume: '45K+',
                geographicReach: 'Local',
                specialties: ['family medicine', 'pediatrics', 'urgent care'],
                qualityScore: 75,
                priceScore: 90,
                notes: 'Affordable community-focused healthcare',
                lastUpdated: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
            },
            {
                id: 5,
                name: 'Metro Emergency Centers',
                category: 'specialty',
                website: 'https://metroemergency.com',
                location: 'Metro Area',
                revenue: 'small',
                threatLevel: 'low',
                marketShare: 6,
                marketShareChange: -0.8,
                revenueEst: '$18M',
                patientVolume: '28K+',
                geographicReach: 'Metropolitan',
                specialties: ['emergency', 'urgent care'],
                qualityScore: 82,
                priceScore: 75,
                notes: 'Specialized emergency and urgent care',
                lastUpdated: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
            }
        ];

        // Add our company for positioning
        this.competitors.unshift({
            id: 0,
            name: 'MedFlow Healthcare',
            category: 'hospital',
            website: 'https://medflow.com',
            location: 'Central Metro',
            revenue: 'large',
            threatLevel: 'none',
            marketShare: 32,
            marketShareChange: +1.5,
            revenueEst: '$1.2B',
            patientVolume: '180K+',
            geographicReach: 'Regional',
            specialties: ['cardiology', 'oncology', 'neurology', 'pediatrics', 'emergency'],
            qualityScore: 88,
            priceScore: 75,
            notes: 'Our organization',
            isOurCompany: true,
            lastUpdated: new Date()
        });

        this.filteredCompetitors = [...this.competitors];

        // Generate competitor campaigns
        this.campaigns = [
            {
                id: 1,
                competitorId: 1,
                competitorName: 'City General Hospital',
                title: 'Heart Health Awareness Campaign',
                type: 'digital',
                description: 'Comprehensive digital campaign promoting cardiac services with focus on preventive care and early detection.',
                startDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
                endDate: new Date(Date.now() + 16 * 24 * 60 * 60 * 1000),
                budget: '$85K',
                reach: '2.3M',
                engagement: '4.8%',
                conversions: '1,240'
            },
            {
                id: 2,
                competitorId: 2,
                competitorName: 'MedTech Digital Health',
                title: 'Telemedicine First Campaign',
                type: 'social',
                description: 'Social media campaign highlighting convenience and accessibility of telemedicine services.',
                startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
                endDate: new Date(Date.now() + 23 * 24 * 60 * 60 * 1000),
                budget: '$42K',
                reach: '1.8M',
                engagement: '6.2%',
                conversions: '890'
            },
            {
                id: 3,
                competitorId: 3,
                competitorName: 'Specialty Care Centers',
                title: 'Orthopedic Excellence Initiative',
                type: 'traditional',
                description: 'Multi-channel campaign featuring patient success stories and advanced surgical techniques.',
                startDate: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000),
                endDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
                budget: '$67K',
                reach: '1.2M',
                engagement: '3.1%',
                conversions: '456'
            }
        ];

        // Generate AI insights
        this.insights = [
            {
                id: 1,
                title: 'Digital Health Disruption Opportunity',
                category: 'market trend',
                priority: 'high',
                content: 'MedTech Digital Health\'s rapid growth (+5.8% market share) indicates strong demand for digital healthcare solutions. Consider accelerating digital transformation initiatives.',
                recommendations: ['Invest in telemedicine platform', 'Develop mobile health apps', 'Partner with digital health startups'],
                confidence: 87
            },
            {
                id: 2,
                title: 'Price Competition Intensification',
                category: 'competitive threat',
                priority: 'medium',
                content: 'Community Health Network\'s focus on affordability is attracting price-sensitive patients. Monitor pricing strategies and value proposition.',
                recommendations: ['Review pricing strategy', 'Enhance value communication', 'Consider tiered service options'],
                confidence: 76
            },
            {
                id: 3,
                title: 'Specialty Care Market Gap',
                category: 'opportunity',
                priority: 'medium',
                content: 'Declining market share in specialty centers suggests opportunities for expansion in specialized services.',
                recommendations: ['Evaluate specialty service expansion', 'Recruit specialist physicians', 'Enhance specialty marketing'],
                confidence: 82
            }
        ];
    }

    renderOverview() {
        this.renderPositioning();
        this.renderTopCompetitors();
        this.renderRecentActivity();
    }

    renderPositioning() {
        const container = document.getElementById('positioningDots');
        if (!container) return;

        container.innerHTML = '';

        this.competitors.forEach(competitor => {
            if (!competitor.qualityScore || !competitor.priceScore) return;

            const dot = document.createElement('div');
            dot.className = `competitor-dot ${competitor.isOurCompany ? 'our-company' : this.getThreatClass(competitor.threatLevel)}`;
            
            // Convert scores to positions (0-100% of container)
            const xPos = (competitor.priceScore / 100) * 100;
            const yPos = 100 - (competitor.qualityScore / 100) * 100; // Invert Y axis

            dot.style.left = `${xPos}%`;
            dot.style.top = `${yPos}%`;

            const label = document.createElement('div');
            label.className = 'dot-label';
            label.textContent = competitor.name;
            dot.appendChild(label);

            dot.addEventListener('click', () => {
                if (!competitor.isOurCompany) {
                    this.showCompetitorDetails(competitor.id);
                }
            });

            container.appendChild(dot);
        });
    }

    getThreatClass(threatLevel) {
        switch (threatLevel) {
            case 'high': case 'critical': return 'high-threat';
            case 'medium': return 'medium-threat';
            case 'low': default: return 'low-threat';
        }
    }

    renderTopCompetitors() {
        const container = document.getElementById('topCompetitors');
        if (!container) return;

        const topCompetitors = this.competitors
            .filter(c => !c.isOurCompany)
            .sort((a, b) => b.marketShare - a.marketShare)
            .slice(0, 5);

        container.innerHTML = '';

        topCompetitors.forEach((competitor, index) => {
            const item = document.createElement('div');
            item.className = 'ranking-item';
            item.onclick = () => this.showCompetitorDetails(competitor.id);

            const positionClass = index === 0 ? 'first' : index === 1 ? 'second' : index === 2 ? 'third' : 'other';

            item.innerHTML = `
                <div class="ranking-position ${positionClass}">${index + 1}</div>
                <div class="ranking-content">
                    <div class="ranking-name">${competitor.name}</div>
                    <div class="ranking-score">${competitor.marketShare}% market share</div>
                </div>
            `;

            container.appendChild(item);
        });
    }

    renderRecentActivity() {
        const container = document.getElementById('recentActivity');
        if (!container) return;

        const activities = [
            {
                type: 'campaign',
                icon: 'fa-bullhorn',
                iconBg: 'bg-primary',
                title: 'New Campaign Launch',
                description: 'City General Hospital launched "Heart Health Awareness" digital campaign targeting cardiac patients.',
                time: '2 hours ago',
                competitor: 'City General Hospital'
            },
            {
                type: 'pricing',
                icon: 'fa-dollar-sign',
                iconBg: 'bg-warning',
                title: 'Pricing Strategy Change',
                description: 'MedTech Digital reduced telemedicine consultation fees by 15% to increase market penetration.',
                time: '6 hours ago',
                competitor: 'MedTech Digital Health'
            },
            {
                type: 'expansion',
                icon: 'fa-building',
                iconBg: 'bg-success',
                title: 'Service Expansion',
                description: 'Specialty Care Centers opened two new orthopedic clinics in the suburban market.',
                time: '1 day ago',
                competitor: 'Specialty Care Centers'
            },
            {
                type: 'partnership',
                icon: 'fa-handshake',
                iconBg: 'bg-info',
                title: 'Strategic Partnership',
                description: 'Community Health Network partnered with local insurance providers for better coverage.',
                time: '2 days ago',
                competitor: 'Community Health Network'
            }
        ];

        container.innerHTML = '';

        activities.forEach(activity => {
            const item = document.createElement('div');
            item.className = 'activity-item';

            item.innerHTML = `
                <div class="activity-icon ${activity.iconBg}">
                    <i class="fas ${activity.icon}"></i>
                </div>
                <div class="activity-content">
                    <div class="activity-title">${activity.title}</div>
                    <div class="activity-description">${activity.description}</div>
                    <div class="activity-meta">
                        <span>${activity.competitor}</span> • <span>${activity.time}</span>
                    </div>
                </div>
            `;

            container.appendChild(item);
        });
    }

    renderCompetitors() {
        const container = document.getElementById('competitorsList');
        if (!container) return;

        container.innerHTML = '';

        const competitorsToShow = this.filteredCompetitors.filter(c => !c.isOurCompany);

        if (competitorsToShow.length === 0) {
            container.innerHTML = `
                <div class="col-12 text-center py-5">
                    <i class="fas fa-search fa-3x text-muted mb-3"></i>
                    <h6>No competitors found</h6>
                    <p class="text-muted">Try adjusting your search or filter criteria</p>
                </div>
            `;
            return;
        }

        competitorsToShow.forEach(competitor => {
            const card = this.createCompetitorCard(competitor);
            container.appendChild(card);
        });
    }

    createCompetitorCard(competitor) {
        const card = document.createElement('div');
        card.className = 'competitor-card';
        card.onclick = () => this.showCompetitorDetails(competitor.id);

        const categoryLabels = {
            hospital: 'Hospital System',
            clinic: 'Clinic Network',
            specialty: 'Specialty Center',
            digital: 'Digital Health'
        };

        card.innerHTML = `
            <div class="competitor-header">
                <div class="competitor-info">
                    <h6>${competitor.name}</h6>
                    <div class="competitor-category">${categoryLabels[competitor.category] || competitor.category}</div>
                </div>
                <div class="threat-badge ${competitor.threatLevel}">${competitor.threatLevel}</div>
            </div>
            
            <div class="competitor-stats">
                <div class="stat-item">
                    <span class="stat-value">${competitor.marketShare}%</span>
                    <span class="stat-title">Market Share</span>
                </div>
                <div class="stat-item">
                    <span class="stat-value">${competitor.revenueEst}</span>
                    <span class="stat-title">Revenue Est.</span>
                </div>
            </div>
            
            <div class="competitor-specialties">
                ${competitor.specialties.slice(0, 3).map(specialty => 
                    `<span class="specialty-tag">${specialty}</span>`
                ).join('')}
                ${competitor.specialties.length > 3 ? `<span class="specialty-tag">+${competitor.specialties.length - 3}</span>` : ''}
            </div>
            
            <div class="competitor-actions">
                ${competitor.website ? `<a href="${competitor.website}" class="competitor-website" target="_blank" onclick="event.stopPropagation()">Visit Website</a>` : '<span></span>'}
                <small class="text-muted">Updated ${this.formatTimeAgo(competitor.lastUpdated)}</small>
            </div>
        `;

        return card;
    }

    initializeCharts() {
        this.initializeMarketShareChart();
        this.initializeMarketTrendsChart();
        this.renderMarketShareTable();
    }

    initializeMarketShareChart() {
        const ctx = document.getElementById('marketShareCanvas');
        if (!ctx) return;

        const competitorData = this.competitors.filter(c => !c.isOurCompany);
        const ourData = this.competitors.find(c => c.isOurCompany);

        const allData = [...competitorData, ourData].sort((a, b) => b.marketShare - a.marketShare);

        this.marketShareChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: allData.map(c => c.name),
                datasets: [{
                    data: allData.map(c => c.marketShare),
                    backgroundColor: [
                        '#007bff', '#dc3545', '#28a745', '#ffc107', 
                        '#17a2b8', '#6c757d', '#fd7e14', '#e83e8c'
                    ],
                    borderWidth: 2,
                    borderColor: '#fff'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            padding: 20,
                            usePointStyle: true
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return context.label + ': ' + context.parsed + '%';
                            }
                        }
                    }
                }
            }
        });
    }

    initializeMarketTrendsChart() {
        const ctx = document.getElementById('marketTrendsCanvas');
        if (!ctx) return;

        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
        const topCompetitors = this.competitors
            .filter(c => !c.isOurCompany)
            .sort((a, b) => b.marketShare - a.marketShare)
            .slice(0, 3);

        const ourCompany = this.competitors.find(c => c.isOurCompany);

        this.marketTrendsChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: months,
                datasets: [
                    {
                        label: ourCompany.name,
                        data: [30.5, 31.2, 31.8, 32.1, 32.3, 32.0],
                        borderColor: '#007bff',
                        backgroundColor: 'rgba(0, 123, 255, 0.1)',
                        borderWidth: 3,
                        fill: true
                    },
                    ...topCompetitors.map((competitor, index) => ({
                        label: competitor.name,
                        data: this.generateTrendData(competitor.marketShare),
                        borderColor: ['#dc3545', '#28a745', '#ffc107'][index],
                        backgroundColor: `rgba(${index === 0 ? '220, 53, 69' : index === 1 ? '40, 167, 69' : '255, 193, 7'}, 0.1)`,
                        borderWidth: 2,
                        fill: false
                    }))
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                },
                scales: {
                    y: {
                        beginAtZero: false,
                        title: {
                            display: true,
                            text: 'Market Share (%)'
                        }
                    }
                }
            }
        });
    }

    generateTrendData(currentShare) {
        const trend = [];
        let value = currentShare - 2;
        for (let i = 0; i < 6; i++) {
            value += (Math.random() - 0.5) * 1.5;
            trend.push(Math.max(0, Math.round(value * 10) / 10));
        }
        trend[5] = currentShare; // Ensure last value matches current
        return trend;
    }

    renderMarketShareTable() {
        const tbody = document.getElementById('marketShareTableBody');
        if (!tbody) return;

        const sortedCompetitors = [...this.competitors].sort((a, b) => b.marketShare - a.marketShare);

        tbody.innerHTML = '';

        sortedCompetitors.forEach(competitor => {
            const row = document.createElement('tr');
            if (competitor.isOurCompany) {
                row.classList.add('table-primary');
            }

            const changeIcon = competitor.marketShareChange > 0 ? 'fa-arrow-up text-success' : 
                              competitor.marketShareChange < 0 ? 'fa-arrow-down text-danger' : 
                              'fa-minus text-muted';

            row.innerHTML = `
                <td>
                    <strong>${competitor.name}</strong>
                    ${competitor.isOurCompany ? '<span class="badge bg-primary ms-2">Our Company</span>' : ''}
                </td>
                <td>${competitor.marketShare}%</td>
                <td>
                    <i class="fas ${changeIcon} me-1"></i>
                    ${Math.abs(competitor.marketShareChange)}%
                </td>
                <td>${competitor.revenueEst}</td>
                <td>${competitor.patientVolume}</td>
                <td>${competitor.geographicReach}</td>
                <td>
                    <div class="specialty-tags">
                        ${competitor.specialties.slice(0, 2).map(s => 
                            `<span class="badge bg-light text-dark me-1">${s}</span>`
                        ).join('')}
                        ${competitor.specialties.length > 2 ? `<span class="badge bg-secondary">+${competitor.specialties.length - 2}</span>` : ''}
                    </div>
                </td>
            `;

            tbody.appendChild(row);
        });
    }

    renderCampaigns() {
        const container = document.getElementById('competitorCampaigns');
        if (!container) return;

        container.innerHTML = '';

        const filteredCampaigns = this.campaigns.filter(campaign => {
            if (this.filters.campaignType && campaign.type !== this.filters.campaignType) {
                return false;
            }
            if (this.filters.search && !campaign.title.toLowerCase().includes(this.filters.search.toLowerCase())) {
                return false;
            }
            return true;
        });

        if (filteredCampaigns.length === 0) {
            container.innerHTML = `
                <div class="text-center py-5">
                    <i class="fas fa-bullhorn fa-3x text-muted mb-3"></i>
                    <h6>No campaigns found</h6>
                    <p class="text-muted">No competitor campaigns match your current filters</p>
                </div>
            `;
            return;
        }

        filteredCampaigns.forEach(campaign => {
            const item = this.createCampaignItem(campaign);
            container.appendChild(item);
        });
    }

    createCampaignItem(campaign) {
        const item = document.createElement('div');
        item.className = 'campaign-item';

        const typeLabels = {
            digital: 'Digital Marketing',
            social: 'Social Media',
            traditional: 'Traditional Media',
            email: 'Email Marketing'
        };

        item.innerHTML = `
            <div class="campaign-header">
                <div>
                    <div class="campaign-title">${campaign.title}</div>
                    <div class="campaign-competitor">${campaign.competitorName}</div>
                    <div class="campaign-type">${typeLabels[campaign.type] || campaign.type}</div>
                </div>
                <div class="campaign-date">
                    ${this.formatDate(campaign.startDate)} - ${this.formatDate(campaign.endDate)}
                </div>
            </div>
            
            <div class="campaign-description">${campaign.description}</div>
            
            <div class="campaign-metrics">
                <div class="campaign-metric">
                    <span class="metric-value">${campaign.budget}</span>
                    <div class="metric-label">Budget</div>
                </div>
                <div class="campaign-metric">
                    <span class="metric-value">${campaign.reach}</span>
                    <div class="metric-label">Reach</div>
                </div>
                <div class="campaign-metric">
                    <span class="metric-value">${campaign.engagement}</span>
                    <div class="metric-label">Engagement</div>
                </div>
                <div class="campaign-metric">
                    <span class="metric-value">${campaign.conversions}</span>
                    <div class="metric-label">Conversions</div>
                </div>
            </div>
        `;

        return item;
    }

    renderInsights() {
        this.renderAIInsights();
        this.renderRecommendations();
        this.renderOpportunities();
        this.renderThreats();
    }

    renderAIInsights() {
        const container = document.getElementById('aiInsights');
        if (!container) return;

        container.innerHTML = '';

        this.insights.forEach(insight => {
            const item = document.createElement('div');
            item.className = 'insight-item';

            item.innerHTML = `
                <div class="insight-header">
                    <div class="insight-icon ${insight.priority}-priority">
                        <i class="fas fa-brain"></i>
                    </div>
                    <div>
                        <div class="insight-title">${insight.title}</div>
                        <div class="insight-category">${insight.category}</div>
                    </div>
                </div>
                
                <div class="insight-content">${insight.content}</div>
                
                <div class="insight-actions">
                    <button class="btn btn-sm btn-outline-primary">
                        <i class="fas fa-lightbulb me-1"></i>View Recommendations
                    </button>
                    <span class="badge bg-info">${insight.confidence}% confidence</span>
                </div>
            `;

            container.appendChild(item);
        });
    }

    renderRecommendations() {
        const container = document.getElementById('strategicRecommendations');
        if (!container) return;

        const recommendations = [
            {
                title: 'Accelerate Digital Transformation',
                category: 'strategic initiative',
                priority: 'high',
                content: 'Invest in telemedicine and digital health platforms to compete with MedTech Digital Health\'s rapid growth.'
            },
            {
                title: 'Enhance Value Communication',
                category: 'marketing strategy',
                priority: 'medium',
                content: 'Develop clear value proposition messaging to counter price competition from community providers.'
            },
            {
                title: 'Specialty Service Expansion',
                category: 'service development',
                priority: 'medium',
                content: 'Consider expanding specialty care offerings where competitors show declining market share.'
            }
        ];

        container.innerHTML = '';

        recommendations.forEach(rec => {
            const item = document.createElement('div');
            item.className = 'recommendation-item';

            item.innerHTML = `
                <div class="recommendation-header">
                    <div class="recommendation-icon ${rec.priority}-priority">
                        <i class="fas fa-lightbulb"></i>
                    </div>
                    <div>
                        <div class="recommendation-title">${rec.title}</div>
                        <div class="recommendation-category">${rec.category}</div>
                    </div>
                </div>
                
                <div class="recommendation-content">${rec.content}</div>
                
                <div class="recommendation-actions">
                    <button class="btn btn-sm btn-primary">
                        <i class="fas fa-plus me-1"></i>Add to Plan
                    </button>
                </div>
            `;

            container.appendChild(item);
        });
    }

    renderOpportunities() {
        const container = document.getElementById('opportunities');
        if (!container) return;

        const opportunities = [
            {
                title: 'Digital Health Gap',
                description: 'Competitors lag in comprehensive digital offerings'
            },
            {
                title: 'Premium Positioning',
                description: 'Quality-focused positioning opportunity exists'
            },
            {
                title: 'Geographic Expansion',
                description: 'Underserved markets in suburban areas'
            },
            {
                title: 'Partnership Opportunities',
                description: 'Strategic alliances with digital platforms'
            }
        ];

        container.innerHTML = '';

        opportunities.forEach(opp => {
            const item = document.createElement('div');
            item.className = 'opportunity-item';

            item.innerHTML = `
                <div class="opportunity-icon">
                    <i class="fas fa-plus"></i>
                </div>
                <div class="opportunity-content">
                    <div class="opportunity-title">${opp.title}</div>
                    <div class="opportunity-description">${opp.description}</div>
                </div>
            `;

            container.appendChild(item);
        });
    }

    renderThreats() {
        const container = document.getElementById('threats');
        if (!container) return;

        const threats = [
            {
                title: 'Digital Disruption',
                description: 'MedTech Digital rapidly gaining market share'
            },
            {
                title: 'Price Competition',
                description: 'Community providers competing on affordability'
            },
            {
                title: 'Specialty Competition',
                description: 'Specialized centers targeting niche markets'
            },
            {
                title: 'Technology Gap',
                description: 'Risk of falling behind in healthcare tech'
            }
        ];

        container.innerHTML = '';

        threats.forEach(threat => {
            const item = document.createElement('div');
            item.className = 'threat-item';

            item.innerHTML = `
                <div class="threat-icon">
                    <i class="fas fa-exclamation-triangle"></i>
                </div>
                <div class="threat-content">
                    <div class="threat-title">${threat.title}</div>
                    <div class="threat-description">${threat.description}</div>
                </div>
            `;

            container.appendChild(item);
        });
    }

    setupPositioningChart() {
        // Position competitors on the chart
        this.renderPositioning();
    }

    initializeEventHandlers() {
        // Tab change handlers
        document.querySelectorAll('#analysisTab .nav-link').forEach(tab => {
            tab.addEventListener('shown.bs.tab', (e) => {
                const target = e.target.getAttribute('data-bs-target');
                switch (target) {
                    case '#competitors':
                        this.renderCompetitors();
                        break;
                    case '#market-share':
                        setTimeout(() => {
                            if (this.marketShareChart) this.marketShareChart.resize();
                            if (this.marketTrendsChart) this.marketTrendsChart.resize();
                        }, 100);
                        break;
                    case '#campaigns':
                        this.renderCampaigns();
                        break;
                    case '#insights':
                        this.renderInsights();
                        break;
                }
            });
        });

        // Search and filter handlers
        document.getElementById('competitorSearch')?.addEventListener('input', (e) => {
            this.filters.search = e.target.value;
            this.applyFilters();
        });

        document.getElementById('competitorFilter')?.addEventListener('change', (e) => {
            this.filters.category = e.target.value;
            this.applyFilters();
        });

        document.getElementById('campaignSearch')?.addEventListener('input', (e) => {
            this.filters.search = e.target.value;
            this.renderCampaigns();
        });

        document.getElementById('campaignTypeFilter')?.addEventListener('change', (e) => {
            this.filters.campaignType = e.target.value;
            this.renderCampaigns();
        });

        // Form handler
        document.getElementById('addCompetitorForm')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleAddCompetitor(e.target);
        });
    }

    applyFilters() {
        this.filteredCompetitors = this.competitors.filter(competitor => {
            if (competitor.isOurCompany) return true; // Always include our company
            
            if (this.filters.search) {
                const searchTerm = this.filters.search.toLowerCase();
                if (!competitor.name.toLowerCase().includes(searchTerm) &&
                    !competitor.specialties.some(s => s.toLowerCase().includes(searchTerm))) {
                    return false;
                }
            }

            if (this.filters.category && competitor.category !== this.filters.category) {
                return false;
            }

            return true;
        });

        this.renderCompetitors();
    }

    addCompetitor() {
        const modal = new bootstrap.Modal(document.getElementById('addCompetitorModal'));
        modal.show();
    }

    handleAddCompetitor(form) {
        const formData = new FormData(form);
        
        const newCompetitor = {
            id: this.competitors.length + 1,
            name: formData.get('name'),
            category: formData.get('category'),
            website: formData.get('website'),
            location: formData.get('location'),
            revenue: formData.get('revenue'),
            threatLevel: formData.get('threatLevel'),
            marketShare: Math.floor(Math.random() * 10) + 1,
            marketShareChange: (Math.random() - 0.5) * 4,
            revenueEst: this.estimateRevenue(formData.get('revenue')),
            patientVolume: this.estimatePatientVolume(formData.get('revenue')),
            geographicReach: 'Local',
            specialties: Array.from(formData.getAll('specialties')),
            qualityScore: Math.floor(Math.random() * 30) + 70,
            priceScore: Math.floor(Math.random() * 40) + 60,
            notes: formData.get('notes'),
            lastUpdated: new Date()
        };

        this.competitors.push(newCompetitor);
        this.applyFilters();

        // Close modal and reset form
        const modal = bootstrap.Modal.getInstance(document.getElementById('addCompetitorModal'));
        modal.hide();
        form.reset();

        this.showToast(`${newCompetitor.name} added to competitor tracking`, 'success');

        // Update positioning chart
        this.renderPositioning();
    }

    estimateRevenue(revenueRange) {
        const ranges = {
            small: '$5M',
            medium: '$25M',
            large: '$150M',
            enterprise: '$800M'
        };
        return ranges[revenueRange] || '$10M';
    }

    estimatePatientVolume(revenueRange) {
        const volumes = {
            small: '5K+',
            medium: '25K+',
            large: '85K+',
            enterprise: '150K+'
        };
        return volumes[revenueRange] || '10K+';
    }

    showCompetitorDetails(competitorId) {
        const competitor = this.competitors.find(c => c.id === competitorId);
        if (!competitor) return;

        const modal = new bootstrap.Modal(document.getElementById('competitorDetailModal'));
        
        document.getElementById('competitorDetailTitle').textContent = competitor.name;
        
        const content = document.getElementById('competitorDetailContent');
        content.innerHTML = `
            <div class="row">
                <div class="col-md-6">
                    <h6>Organization Details</h6>
                    <table class="table table-sm">
                        <tr><td><strong>Category:</strong></td><td>${competitor.category}</td></tr>
                        <tr><td><strong>Location:</strong></td><td>${competitor.location}</td></tr>
                        <tr><td><strong>Website:</strong></td><td>${competitor.website ? `<a href="${competitor.website}" target="_blank">${competitor.website}</a>` : 'N/A'}</td></tr>
                        <tr><td><strong>Threat Level:</strong></td><td><span class="threat-badge ${competitor.threatLevel}">${competitor.threatLevel}</span></td></tr>
                    </table>
                    
                    <h6 class="mt-4">Market Performance</h6>
                    <table class="table table-sm">
                        <tr><td><strong>Market Share:</strong></td><td>${competitor.marketShare}%</td></tr>
                        <tr><td><strong>Revenue Est.:</strong></td><td>${competitor.revenueEst}</td></tr>
                        <tr><td><strong>Patient Volume:</strong></td><td>${competitor.patientVolume}</td></tr>
                        <tr><td><strong>Geographic Reach:</strong></td><td>${competitor.geographicReach}</td></tr>
                    </table>
                </div>
                
                <div class="col-md-6">
                    <h6>Competitive Positioning</h6>
                    <div class="positioning-scores mb-3">
                        <div class="score-item mb-2">
                            <div class="d-flex justify-content-between">
                                <span>Quality Score</span>
                                <span>${competitor.qualityScore}/100</span>
                            </div>
                            <div class="progress">
                                <div class="progress-bar bg-info" style="width: ${competitor.qualityScore}%"></div>
                            </div>
                        </div>
                        <div class="score-item">
                            <div class="d-flex justify-content-between">
                                <span>Price Competitiveness</span>
                                <span>${competitor.priceScore}/100</span>
                            </div>
                            <div class="progress">
                                <div class="progress-bar bg-warning" style="width: ${competitor.priceScore}%"></div>
                            </div>
                        </div>
                    </div>
                    
                    <h6>Specialty Areas</h6>
                    <div class="specialty-list mb-3">
                        ${competitor.specialties.map(specialty => 
                            `<span class="badge bg-light text-dark me-1 mb-1">${specialty}</span>`
                        ).join('')}
                    </div>
                    
                    ${competitor.notes ? `
                        <h6>Notes</h6>
                        <p class="text-muted">${competitor.notes}</p>
                    ` : ''}
                </div>
            </div>
        `;
        
        modal.show();
    }

    exportCompetitors() {
        const csvContent = this.generateCompetitorCSV();
        this.downloadCSV(csvContent, 'competitor-analysis.csv');
        this.showToast('Competitor data exported successfully', 'success');
    }

    generateCompetitorCSV() {
        const headers = ['Name', 'Category', 'Market Share', 'Revenue Est.', 'Threat Level', 'Location', 'Specialties'];
        const rows = this.competitors
            .filter(c => !c.isOurCompany)
            .map(c => [
                c.name,
                c.category,
                `${c.marketShare}%`,
                c.revenueEst,
                c.threatLevel,
                c.location,
                c.specialties.join('; ')
            ]);

        return [headers, ...rows]
            .map(row => row.map(cell => `"${cell}"`).join(','))
            .join('\n');
    }

    downloadCSV(content, filename) {
        const blob = new Blob([content], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        window.URL.revokeObjectURL(url);
    }

    refreshData() {
        this.showToast('Refreshing competitor data...', 'info');
        
        // Simulate data refresh
        setTimeout(() => {
            // Update last updated timestamps
            this.competitors.forEach(c => {
                if (!c.isOurCompany) {
                    c.lastUpdated = new Date();
                }
            });
            
            this.renderCompetitors();
            this.renderRecentActivity();
            this.showToast('Competitor data updated successfully', 'success');
        }, 1500);
    }

    formatDate(date) {
        return new Intl.DateTimeFormat('en-US', {
            month: 'short',
            day: 'numeric'
        }).format(date);
    }

    formatTimeAgo(date) {
        const now = new Date();
        const diff = now - date;
        const days = Math.floor(diff / (24 * 60 * 60 * 1000));
        
        if (days === 0) return 'today';
        if (days === 1) return 'yesterday';
        if (days < 7) return `${days} days ago`;
        if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
        return `${Math.floor(days / 30)} months ago`;
    }

    showToast(message, type = 'info') {
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

        let toastContainer = document.querySelector('.toast-container');
        if (!toastContainer) {
            toastContainer = document.createElement('div');
            toastContainer.className = 'toast-container position-fixed top-0 end-0 p-3';
            document.body.appendChild(toastContainer);
        }

        toastContainer.appendChild(toast);

        const bsToast = new bootstrap.Toast(toast, {
            autohide: true,
            delay: type === 'error' ? 5000 : 3000
        });
        bsToast.show();

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
    
    // Initialize competitor analysis page
    window.competitorPage = new CompetitorAnalysisPage();
});