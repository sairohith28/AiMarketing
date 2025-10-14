class AssetsPage {
    constructor() {
        this.assets = [];
        this.filteredAssets = [];
        this.selectedAssets = new Set();
        this.currentView = 'grid';
        this.currentPage = 1;
        this.itemsPerPage = 20;
        this.filters = {
            search: '',
            category: '',
            type: '',
            size: '',
            date: ''
        };
        this.init();
    }

    init() {
        this.generateSampleAssets();
        this.initializeEventHandlers();
        this.renderAssets();
        this.updateStats();
    }

    generateSampleAssets() {
        const categories = ['images', 'videos', 'documents', 'graphics', 'logos', 'templates'];
        const types = ['jpg', 'png', 'svg', 'mp4', 'pdf', 'psd'];
        const names = [
            'Hospital Exterior Photo', 'Emergency Room Campaign', 'Doctor Portrait',
            'Medical Equipment Brochure', 'Patient Testimonial Video', 'Logo Variations',
            'Surgery Center Flyer', 'Cardiology Department Banner', 'Pediatric Care Images',
            'Mental Health Awareness Poster', 'Staff Training Video', 'Annual Report Design',
            'Website Header Image', 'Social Media Template', 'Newsletter Layout',
            'Appointment Booking Form', 'Insurance Information Sheet', 'Patient Registration Form'
        ];

        this.assets = Array.from({ length: 50 }, (_, i) => {
            const category = categories[Math.floor(Math.random() * categories.length)];
            const type = types[Math.floor(Math.random() * types.length)];
            const name = names[Math.floor(Math.random() * names.length)];
            
            return {
                id: i + 1,
                name: `${name} ${i + 1}`,
                type: type,
                category: category,
                size: Math.floor(Math.random() * 10000) + 500, // KB
                downloadCount: Math.floor(Math.random() * 100),
                campaignUsage: Math.floor(Math.random() * 15),
                uploadDate: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000),
                lastAccessed: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
                description: `Professional ${category} asset for medical marketing campaigns`,
                tags: this.generateTags(category),
                thumbnail: this.generateThumbnail(type)
            };
        });

        this.filteredAssets = [...this.assets];
    }

    generateTags(category) {
        const tagsByCategory = {
            images: ['medical', 'hospital', 'healthcare', 'professional'],
            videos: ['promotional', 'educational', 'testimonial', 'marketing'],
            documents: ['brochure', 'flyer', 'information', 'educational'],
            graphics: ['design', 'illustration', 'infographic', 'visual'],
            logos: ['branding', 'identity', 'corporate', 'medical'],
            templates: ['layout', 'design', 'customizable', 'marketing']
        };
        
        const baseTags = tagsByCategory[category] || ['medical', 'healthcare'];
        const additionalTags = ['quality', 'professional', 'modern', 'clean'];
        
        return [...baseTags, ...additionalTags.slice(0, Math.floor(Math.random() * 3) + 1)];
    }

    generateThumbnail(type) {
        // In a real app, these would be actual image URLs
        const thumbnails = {
            jpg: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjE1MCIgdmlld0JveD0iMCAwIDIwMCAxNTAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMTUwIiBmaWxsPSIjRjhGOUZBIi8+CjxyZWN0IHg9IjQwIiB5PSIzMCIgd2lkdGg9IjEyMCIgaGVpZ2h0PSI5MCIgZmlsbD0iIzI4QTc0NSIvPgo8L3N2Zz4K',
            png: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjE1MCIgdmlld0JveD0iMCAwIDIwMCAxNTAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMTUwIiBmaWxsPSIjRjhGOUZBIi8+CjxyZWN0IHg9IjQwIiB5PSIzMCIgd2lkdGg9IjEyMCIgaGVpZ2h0PSI5MCIgZmlsbD0iIzAwN0JGRiIvPgo8L3N2Zz4K',
            svg: null, // Will show icon
            mp4: null, // Will show icon
            pdf: null, // Will show icon
            psd: null  // Will show icon
        };
        
        return thumbnails[type];
    }

    initializeEventHandlers() {
        // Search
        document.getElementById('assetSearchInput').addEventListener('input', (e) => {
            this.filters.search = e.target.value;
            this.applyFilters();
        });

        // View toggle
        document.querySelectorAll('input[name="viewType"]').forEach(radio => {
            radio.addEventListener('change', (e) => {
                this.currentView = e.target.id === 'gridView' ? 'grid' : 'list';
                this.toggleView();
            });
        });

        // Filters
        ['categoryFilter', 'typeFilter', 'sizeFilter', 'dateFilter'].forEach(filterId => {
            document.getElementById(filterId).addEventListener('change', (e) => {
                const filterType = filterId.replace('Filter', '');
                this.filters[filterType] = e.target.value;
                this.applyFilters();
            });
        });

        // Clear filters
        document.getElementById('clearFiltersBtn').addEventListener('click', () => {
            this.clearFilters();
        });

        // Upload
        document.getElementById('uploadAssetBtn').addEventListener('click', () => {
            this.showUploadModal();
        });

        // File input
        document.getElementById('fileInput').addEventListener('change', (e) => {
            this.handleFileSelection(e.target.files);
        });

        // Drag and drop
        const uploadArea = document.getElementById('uploadArea');
        uploadArea.addEventListener('click', () => {
            document.getElementById('fileInput').click();
        });

        uploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadArea.querySelector('.upload-zone').classList.add('dragover');
        });

        uploadArea.addEventListener('dragleave', (e) => {
            e.preventDefault();
            uploadArea.querySelector('.upload-zone').classList.remove('dragover');
        });

        uploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadArea.querySelector('.upload-zone').classList.remove('dragover');
            this.handleFileSelection(e.dataTransfer.files);
        });

        // Upload actions
        document.getElementById('startUploadBtn').addEventListener('click', () => {
            this.startUpload();
        });

        // Select all assets
        document.getElementById('selectAllAssets').addEventListener('change', (e) => {
            this.toggleSelectAll(e.target.checked);
        });

        // Asset actions in details modal
        document.getElementById('downloadAssetBtn').addEventListener('click', () => {
            this.downloadAsset();
        });

        document.getElementById('copyLinkBtn').addEventListener('click', () => {
            this.copyAssetLink();
        });

        document.getElementById('editAssetBtn').addEventListener('click', () => {
            this.showEditModal();
        });

        document.getElementById('deleteAssetBtn').addEventListener('click', () => {
            this.deleteAsset();
        });

        document.getElementById('saveAssetBtn').addEventListener('click', () => {
            this.saveAssetChanges();
        });
    }

    applyFilters() {
        this.filteredAssets = this.assets.filter(asset => {
            // Search filter
            if (this.filters.search && !asset.name.toLowerCase().includes(this.filters.search.toLowerCase()) &&
                !asset.tags.some(tag => tag.toLowerCase().includes(this.filters.search.toLowerCase()))) {
                return false;
            }

            // Category filter
            if (this.filters.category && asset.category !== this.filters.category) {
                return false;
            }

            // Type filter
            if (this.filters.type && asset.type !== this.filters.type) {
                return false;
            }

            // Size filter
            if (this.filters.size) {
                const size = asset.size;
                if (this.filters.size === 'small' && size >= 1024) return false;
                if (this.filters.size === 'medium' && (size < 1024 || size >= 10240)) return false;
                if (this.filters.size === 'large' && size < 10240) return false;
            }

            // Date filter
            if (this.filters.date) {
                const now = new Date();
                const uploadDate = asset.uploadDate;
                const daysDiff = (now - uploadDate) / (1000 * 60 * 60 * 24);

                if (this.filters.date === 'today' && daysDiff > 1) return false;
                if (this.filters.date === 'week' && daysDiff > 7) return false;
                if (this.filters.date === 'month' && daysDiff > 30) return false;
                if (this.filters.date === 'year' && daysDiff > 365) return false;
            }

            return true;
        });

        this.currentPage = 1;
        this.renderAssets();
    }

    clearFilters() {
        this.filters = {
            search: '',
            category: '',
            type: '',
            size: '',
            date: ''
        };

        document.getElementById('assetSearchInput').value = '';
        document.getElementById('categoryFilter').value = '';
        document.getElementById('typeFilter').value = '';
        document.getElementById('sizeFilter').value = '';
        document.getElementById('dateFilter').value = '';

        this.filteredAssets = [...this.assets];
        this.renderAssets();
        this.showToast('Filters cleared', 'info');
    }

    toggleView() {
        const gridView = document.getElementById('assetsGrid');
        const listView = document.getElementById('assetsList');

        if (this.currentView === 'grid') {
            gridView.classList.add('active');
            listView.classList.remove('active');
        } else {
            gridView.classList.remove('active');
            listView.classList.add('active');
        }

        this.renderAssets();
    }

    renderAssets() {
        if (this.currentView === 'grid') {
            this.renderGridView();
        } else {
            this.renderListView();
        }
        this.renderPagination();
    }

    renderGridView() {
        const container = document.getElementById('assetsGrid');
        container.innerHTML = '';

        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        const endIndex = startIndex + this.itemsPerPage;
        const pageAssets = this.filteredAssets.slice(startIndex, endIndex);

        pageAssets.forEach(asset => {
            const assetCard = this.createAssetCard(asset);
            container.appendChild(assetCard);
        });
    }

    renderListView() {
        const tbody = document.getElementById('assetsTableBody');
        tbody.innerHTML = '';

        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        const endIndex = startIndex + this.itemsPerPage;
        const pageAssets = this.filteredAssets.slice(startIndex, endIndex);

        pageAssets.forEach(asset => {
            const row = this.createAssetRow(asset);
            tbody.appendChild(row);
        });
    }

    createAssetCard(asset) {
        const card = document.createElement('div');
        card.className = 'asset-card';
        card.dataset.assetId = asset.id;

        const isSelected = this.selectedAssets.has(asset.id);
        if (isSelected) card.classList.add('selected');

        card.innerHTML = `
            <div class="asset-checkbox">
                <input type="checkbox" class="form-check-input" ${isSelected ? 'checked' : ''} 
                       onchange="window.assetsPage.toggleAssetSelection(${asset.id}, this.checked)">
            </div>
            <div class="asset-actions">
                <button class="btn btn-primary btn-sm" onclick="window.assetsPage.downloadAssetById(${asset.id})">
                    <i class="fas fa-download"></i>
                </button>
                <button class="btn btn-secondary btn-sm" onclick="window.assetsPage.viewAssetDetails(${asset.id})">
                    <i class="fas fa-eye"></i>
                </button>
            </div>
            <div class="asset-preview" onclick="window.assetsPage.viewAssetDetails(${asset.id})">
                ${this.getAssetPreview(asset)}
                <div class="file-type">${asset.type.toUpperCase()}</div>
            </div>
            <div class="asset-info">
                <h6 class="asset-name" title="${asset.name}">${asset.name}</h6>
                <p class="asset-details">${this.formatFileSize(asset.size)} • ${this.formatDate(asset.uploadDate)}</p>
            </div>
        `;

        return card;
    }

    createAssetRow(asset) {
        const row = document.createElement('tr');
        row.dataset.assetId = asset.id;

        const isSelected = this.selectedAssets.has(asset.id);

        row.innerHTML = `
            <td>
                <input type="checkbox" class="form-check-input" ${isSelected ? 'checked' : ''} 
                       onchange="window.assetsPage.toggleAssetSelection(${asset.id}, this.checked)">
            </td>
            <td>
                <div class="d-flex align-items-center gap-3">
                    <div class="file-icon file-type-${asset.type}">
                        <i class="fas ${this.getFileIcon(asset.type)}"></i>
                    </div>
                    <div>
                        <div class="fw-semibold">${asset.name}</div>
                        <small class="text-muted">${asset.description}</small>
                    </div>
                </div>
            </td>
            <td><span class="badge bg-light text-dark">${asset.type.toUpperCase()}</span></td>
            <td>${this.formatFileSize(asset.size)}</td>
            <td><span class="badge bg-secondary">${asset.category}</span></td>
            <td>${this.formatDate(asset.uploadDate)}</td>
            <td>${asset.downloadCount}</td>
            <td>
                <div class="btn-group btn-group-sm">
                    <button class="btn btn-outline-primary" onclick="window.assetsPage.downloadAssetById(${asset.id})">
                        <i class="fas fa-download"></i>
                    </button>
                    <button class="btn btn-outline-secondary" onclick="window.assetsPage.viewAssetDetails(${asset.id})">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn btn-outline-warning" onclick="window.assetsPage.editAssetById(${asset.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                </div>
            </td>
        `;

        return row;
    }

    getAssetPreview(asset) {
        if (asset.thumbnail) {
            return `<img src="${asset.thumbnail}" alt="${asset.name}">`;
        } else {
            return `<div class="file-icon file-type-${asset.type}"><i class="fas ${this.getFileIcon(asset.type)}"></i></div>`;
        }
    }

    getFileIcon(type) {
        const icons = {
            jpg: 'fa-image',
            jpeg: 'fa-image',
            png: 'fa-image',
            svg: 'fa-vector-square',
            mp4: 'fa-video',
            pdf: 'fa-file-pdf',
            psd: 'fa-file-image'
        };
        return icons[type] || 'fa-file';
    }

    formatFileSize(sizeKB) {
        if (sizeKB < 1024) {
            return `${sizeKB} KB`;
        } else if (sizeKB < 1024 * 1024) {
            return `${(sizeKB / 1024).toFixed(1)} MB`;
        } else {
            return `${(sizeKB / (1024 * 1024)).toFixed(1)} GB`;
        }
    }

    formatDate(date) {
        return new Intl.DateTimeFormat('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        }).format(date);
    }

    renderPagination() {
        const pagination = document.getElementById('assetsPagination');
        pagination.innerHTML = '';

        const totalPages = Math.ceil(this.filteredAssets.length / this.itemsPerPage);
        if (totalPages <= 1) return;

        // Previous button
        const prevLi = document.createElement('li');
        prevLi.className = `page-item ${this.currentPage === 1 ? 'disabled' : ''}`;
        prevLi.innerHTML = `<a class="page-link" href="#" onclick="window.assetsPage.goToPage(${this.currentPage - 1})">Previous</a>`;
        pagination.appendChild(prevLi);

        // Page numbers
        for (let i = 1; i <= Math.min(totalPages, 10); i++) {
            const li = document.createElement('li');
            li.className = `page-item ${this.currentPage === i ? 'active' : ''}`;
            li.innerHTML = `<a class="page-link" href="#" onclick="window.assetsPage.goToPage(${i})">${i}</a>`;
            pagination.appendChild(li);
        }

        // Next button
        const nextLi = document.createElement('li');
        nextLi.className = `page-item ${this.currentPage === totalPages ? 'disabled' : ''}`;
        nextLi.innerHTML = `<a class="page-link" href="#" onclick="window.assetsPage.goToPage(${this.currentPage + 1})">Next</a>`;
        pagination.appendChild(nextLi);
    }

    goToPage(page) {
        const totalPages = Math.ceil(this.filteredAssets.length / this.itemsPerPage);
        if (page >= 1 && page <= totalPages) {
            this.currentPage = page;
            this.renderAssets();
        }
    }

    toggleAssetSelection(assetId, selected) {
        if (selected) {
            this.selectedAssets.add(assetId);
        } else {
            this.selectedAssets.delete(assetId);
        }

        this.updateSelectionUI();
        this.updateBulkActions();
    }

    toggleSelectAll(selectAll) {
        this.selectedAssets.clear();

        if (selectAll) {
            this.filteredAssets.forEach(asset => {
                this.selectedAssets.add(asset.id);
            });
        }

        // Update checkboxes
        document.querySelectorAll('.asset-card input[type="checkbox"], .table input[type="checkbox"]:not(#selectAllAssets)').forEach(cb => {
            cb.checked = selectAll;
        });

        this.updateSelectionUI();
        this.updateBulkActions();
    }

    updateSelectionUI() {
        document.querySelectorAll('.asset-card').forEach(card => {
            const assetId = parseInt(card.dataset.assetId);
            if (this.selectedAssets.has(assetId)) {
                card.classList.add('selected');
            } else {
                card.classList.remove('selected');
            }
        });
    }

    updateBulkActions() {
        const selectedCount = this.selectedAssets.size;
        let bulkBar = document.querySelector('.bulk-actions-bar');

        if (selectedCount > 0) {
            if (!bulkBar) {
                bulkBar = this.createBulkActionsBar();
                document.body.appendChild(bulkBar);
            }

            bulkBar.querySelector('.selection-count').textContent = `${selectedCount} selected`;
            bulkBar.classList.add('show');
        } else if (bulkBar) {
            bulkBar.classList.remove('show');
        }
    }

    createBulkActionsBar() {
        const bar = document.createElement('div');
        bar.className = 'bulk-actions-bar';
        bar.innerHTML = `
            <span class="selection-count">0 selected</span>
            <button class="btn btn-sm" onclick="window.assetsPage.bulkDownload()">
                <i class="fas fa-download me-1"></i> Download
            </button>
            <button class="btn btn-sm" onclick="window.assetsPage.bulkDelete()">
                <i class="fas fa-trash me-1"></i> Delete
            </button>
            <button class="btn btn-sm" onclick="window.assetsPage.clearSelection()">
                <i class="fas fa-times me-1"></i> Cancel
            </button>
        `;
        return bar;
    }

    clearSelection() {
        this.selectedAssets.clear();
        document.querySelectorAll('input[type="checkbox"]').forEach(cb => cb.checked = false);
        this.updateSelectionUI();
        this.updateBulkActions();
    }

    showUploadModal() {
        const modal = new bootstrap.Modal(document.getElementById('uploadModal'));
        modal.show();
    }

    handleFileSelection(files) {
        const queueContainer = document.getElementById('uploadQueue');
        const queueItems = document.getElementById('queueItems');
        
        queueContainer.style.display = 'block';
        queueItems.innerHTML = '';

        Array.from(files).forEach(file => {
            const queueItem = this.createQueueItem(file);
            queueItems.appendChild(queueItem);
        });

        document.getElementById('startUploadBtn').disabled = false;
    }

    createQueueItem(file) {
        const item = document.createElement('div');
        item.className = 'queue-item';
        
        const fileType = file.name.split('.').pop().toLowerCase();
        
        item.innerHTML = `
            <div class="queue-item-icon file-type-${fileType}">
                <i class="fas ${this.getFileIcon(fileType)}"></i>
            </div>
            <div class="queue-item-info">
                <div class="queue-item-name">${file.name}</div>
                <div class="queue-item-size">${this.formatFileSize(Math.round(file.size / 1024))}</div>
            </div>
            <div class="queue-item-progress">
                <div class="progress">
                    <div class="progress-bar" style="width: 0%"></div>
                </div>
            </div>
            <div class="queue-item-actions">
                <button class="btn btn-outline-danger" onclick="this.closest('.queue-item').remove()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;

        return item;
    }

    startUpload() {
        const queueItems = document.querySelectorAll('.queue-item');
        
        queueItems.forEach((item, index) => {
            setTimeout(() => {
                this.simulateUpload(item);
            }, index * 500);
        });

        document.getElementById('startUploadBtn').disabled = true;
    }

    simulateUpload(queueItem) {
        const progressBar = queueItem.querySelector('.progress-bar');
        const fileName = queueItem.querySelector('.queue-item-name').textContent;
        
        let progress = 0;
        const interval = setInterval(() => {
            progress += Math.random() * 20;
            if (progress > 100) progress = 100;
            
            progressBar.style.width = progress + '%';
            
            if (progress >= 100) {
                clearInterval(interval);
                queueItem.classList.add('completed');
                
                // Add to assets list
                setTimeout(() => {
                    this.addNewAsset(fileName);
                    queueItem.remove();
                    
                    // Check if all uploads are complete
                    if (document.querySelectorAll('.queue-item').length === 0) {
                        const modal = bootstrap.Modal.getInstance(document.getElementById('uploadModal'));
                        modal.hide();
                        this.showToast('All files uploaded successfully!', 'success');
                    }
                }, 500);
            }
        }, 200);
    }

    addNewAsset(fileName) {
        const fileType = fileName.split('.').pop().toLowerCase();
        const category = this.getCategoryFromType(fileType);
        
        const newAsset = {
            id: this.assets.length + 1,
            name: fileName.replace(/\.[^/.]+$/, ""),
            type: fileType,
            category: category,
            size: Math.floor(Math.random() * 5000) + 500,
            downloadCount: 0,
            campaignUsage: 0,
            uploadDate: new Date(),
            lastAccessed: new Date(),
            description: `Uploaded ${category} asset`,
            tags: this.generateTags(category),
            thumbnail: this.generateThumbnail(fileType)
        };

        this.assets.unshift(newAsset);
        this.applyFilters();
        this.updateStats();
    }

    getCategoryFromType(type) {
        const typeMap = {
            jpg: 'images',
            jpeg: 'images',
            png: 'images',
            svg: 'graphics',
            mp4: 'videos',
            pdf: 'documents',
            psd: 'graphics'
        };
        return typeMap[type] || 'documents';
    }

    viewAssetDetails(assetId) {
        const asset = this.assets.find(a => a.id === assetId);
        if (!asset) return;

        const modal = new bootstrap.Modal(document.getElementById('assetDetailsModal'));
        
        // Populate modal content
        document.getElementById('assetDetailsTitle').textContent = asset.name;
        
        const preview = document.getElementById('assetPreview');
        preview.innerHTML = this.getAssetPreview(asset);
        
        const info = document.getElementById('assetInfo');
        info.innerHTML = `
            <div class="asset-info-group">
                <div class="asset-info-label">File Type</div>
                <div class="asset-info-value">${asset.type.toUpperCase()}</div>
            </div>
            <div class="asset-info-group">
                <div class="asset-info-label">File Size</div>
                <div class="asset-info-value">${this.formatFileSize(asset.size)}</div>
            </div>
            <div class="asset-info-group">
                <div class="asset-info-label">Category</div>
                <div class="asset-info-value">${asset.category}</div>
            </div>
            <div class="asset-info-group">
                <div class="asset-info-label">Upload Date</div>
                <div class="asset-info-value">${this.formatDate(asset.uploadDate)}</div>
            </div>
            <div class="asset-info-group">
                <div class="asset-info-label">Description</div>
                <div class="asset-info-value">${asset.description}</div>
            </div>
            <div class="asset-info-group">
                <div class="asset-info-label">Tags</div>
                <div class="asset-info-value">${asset.tags.map(tag => `<span class="badge bg-light text-dark me-1">${tag}</span>`).join('')}</div>
            </div>
        `;
        
        // Update usage stats
        document.getElementById('downloadCount').textContent = asset.downloadCount;
        document.getElementById('campaignUsage').textContent = asset.campaignUsage;
        document.getElementById('lastAccessed').textContent = this.formatDate(asset.lastAccessed);
        
        // Store current asset for actions
        this.currentAsset = asset;
        
        modal.show();
    }

    downloadAsset() {
        if (this.currentAsset) {
            this.downloadAssetById(this.currentAsset.id);
        }
    }

    downloadAssetById(assetId) {
        const asset = this.assets.find(a => a.id === assetId);
        if (!asset) return;

        // Simulate download
        const link = document.createElement('a');
        link.href = '#';
        link.download = `${asset.name}.${asset.type}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // Update download count
        asset.downloadCount++;
        asset.lastAccessed = new Date();
        
        this.showToast(`Downloaded: ${asset.name}`, 'success');
        this.renderAssets();
    }

    copyAssetLink() {
        if (this.currentAsset) {
            const link = `https://assets.hospital.com/${this.currentAsset.id}`;
            navigator.clipboard.writeText(link).then(() => {
                this.showToast('Asset link copied to clipboard!', 'success');
            });
        }
    }

    showEditModal() {
        if (!this.currentAsset) return;

        const modal = new bootstrap.Modal(document.getElementById('editAssetModal'));
        const form = document.getElementById('editAssetForm');
        
        // Populate form
        form.elements.name.value = this.currentAsset.name;
        form.elements.category.value = this.currentAsset.category;
        form.elements.description.value = this.currentAsset.description;
        form.elements.tags.value = this.currentAsset.tags.join(', ');
        
        modal.show();
    }

    saveAssetChanges() {
        if (!this.currentAsset) return;

        const form = document.getElementById('editAssetForm');
        const formData = new FormData(form);
        
        // Update asset
        this.currentAsset.name = formData.get('name');
        this.currentAsset.category = formData.get('category');
        this.currentAsset.description = formData.get('description');
        this.currentAsset.tags = formData.get('tags').split(',').map(tag => tag.trim()).filter(tag => tag);

        // Close modals and refresh
        bootstrap.Modal.getInstance(document.getElementById('editAssetModal')).hide();
        bootstrap.Modal.getInstance(document.getElementById('assetDetailsModal')).hide();
        
        this.renderAssets();
        this.showToast('Asset updated successfully!', 'success');
    }

    deleteAsset() {
        if (!this.currentAsset) return;

        if (confirm(`Are you sure you want to delete "${this.currentAsset.name}"?`)) {
            this.assets = this.assets.filter(a => a.id !== this.currentAsset.id);
            this.applyFilters();
            this.updateStats();
            
            bootstrap.Modal.getInstance(document.getElementById('assetDetailsModal')).hide();
            this.showToast('Asset deleted successfully!', 'success');
        }
    }

    editAssetById(assetId) {
        const asset = this.assets.find(a => a.id === assetId);
        if (asset) {
            this.currentAsset = asset;
            this.showEditModal();
        }
    }

    bulkDownload() {
        const selectedAssets = Array.from(this.selectedAssets).map(id => 
            this.assets.find(a => a.id === id)
        ).filter(Boolean);

        selectedAssets.forEach(asset => {
            this.downloadAssetById(asset.id);
        });

        this.clearSelection();
    }

    bulkDelete() {
        if (confirm(`Are you sure you want to delete ${this.selectedAssets.size} selected assets?`)) {
            this.assets = this.assets.filter(a => !this.selectedAssets.has(a.id));
            this.clearSelection();
            this.applyFilters();
            this.updateStats();
            this.showToast('Selected assets deleted successfully!', 'success');
        }
    }

    updateStats() {
        const totalAssets = this.assets.length;
        const totalDownloads = this.assets.reduce((sum, asset) => sum + asset.downloadCount, 0);
        const totalSize = this.assets.reduce((sum, asset) => sum + asset.size, 0);
        const categories = new Set(this.assets.map(asset => asset.category)).size;

        // Update stat cards (these would be updated dynamically in a real app)
        document.querySelector('.stat-card:nth-child(1) .stat-number').textContent = totalAssets;
        document.querySelector('.stat-card:nth-child(2) .stat-number').textContent = totalDownloads.toLocaleString();
        document.querySelector('.stat-card:nth-child(3) .stat-number').textContent = this.formatFileSize(totalSize);
        document.querySelector('.stat-card:nth-child(4) .stat-number').textContent = categories;
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
    
    // Initialize assets page
    window.assetsPage = new AssetsPage();
});