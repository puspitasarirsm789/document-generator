document.addEventListener('DOMContentLoaded', () => {
    // State
    const state = {
        currentView: 'dashboard',
        workspaces: [],
        currentWorkspace: null
    };

    // DOM Elements
    const appContent = document.getElementById('app-content');
    const navDashboard = document.getElementById('nav-dashboard');
    const modalBackdrop = document.getElementById('modal-backdrop');
    const modalNewWorkspace = document.getElementById('modal-new-workspace');
    const modalViewDoc = document.getElementById('modal-view-doc');

    // Templates
    const tplDashboard = document.getElementById('tpl-dashboard').innerHTML;
    const tplWorkspace = document.getElementById('tpl-workspace').innerHTML;

    // Initialization
    init();

    async function init() {
        setupEventListeners();
        await loadDashboard();
    }

    function setupEventListeners() {
        navDashboard.addEventListener('click', loadDashboard);

        // Modal Close Buttons
        document.querySelectorAll('.close-modal').forEach(btn => {
            btn.addEventListener('click', closeAllModals);
        });
        modalBackdrop.addEventListener('click', closeAllModals);

        // Form Submit
        document.getElementById('form-new-workspace').addEventListener('submit', handleNewWorkspace);

        // Download single MD
        document.getElementById('btn-download-md').addEventListener('click', downloadCurrentDoc);
    }

    // --- NAVIGATION & VIEWS ---

    async function loadDashboard() {
        state.currentView = 'dashboard';
        appContent.innerHTML = tplDashboard;

        document.getElementById('btn-new-project').addEventListener('click', () => {
            openModal(modalNewWorkspace);
        });

        const res = await fetch('/api/workspaces');
        if (res.ok) {
            const data = await res.json();
            renderWorkspaceGrid(data);
        }
    }

    async function loadWorkspace(id) {
        state.currentView = 'workspace';
        appContent.innerHTML = tplWorkspace;

        document.getElementById('btn-back-dash').addEventListener('click', loadDashboard);
        document.getElementById('btn-export-zip').addEventListener('click', () => {
            window.location.href = `/api/workspaces/${id}/export`;
        });

        const res = await fetch(`/api/workspaces/${id}`);
        if (res.ok) {
            const data = await res.json();
            state.currentWorkspace = data;
            renderWorkspaceDetails(data);
        }
    }

    // --- RENDERING ---

    function renderWorkspaceGrid(workspaces) {
        const grid = document.getElementById('workspace-grid');
        grid.innerHTML = '';

        if (workspaces.length === 0) {
            grid.innerHTML = '<div class="text-gray col-span-full">No workspaces found. Create a new project to start.</div>';
            return;
        }

        workspaces.forEach(ws => {
            const date = new Date(ws.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

            const el = document.createElement('div');
            el.className = 'card';
            el.innerHTML = `
                <div class="flex justify-between items-start mb-4">
                    <div class="ws-card-icon">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
                    </div>
                    <span class="badge badge-pending text-xs flex items-center gap-1"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg> ${date}</span>
                </div>
                <a href="#" class="ws-card-title">${ws.title}</a>
                <p class="ws-card-desc">Project details and documentation generation workspace.</p>
                <div class="mt-4 pt-4 border-t flex justify-between items-center">
                    <button class="btn btn-link text-blue flex items-center gap-1 text-sm btn-open-ws">View Workspace <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg></button>
                </div>
            `;

            el.querySelector('.ws-card-title').addEventListener('click', (e) => { e.preventDefault(); loadWorkspace(ws.id); });
            el.querySelector('.btn-open-ws').addEventListener('click', () => loadWorkspace(ws.id));

            grid.appendChild(el);
        });
    }

    async function renderWorkspaceDetails(data) {
        document.getElementById('ws-page-title').innerText = data.workspace.title;
        document.getElementById('ws-date').innerText = 'Created ' + new Date(data.workspace.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

        // Progress Logic
        const total = data.templates_progress.length;
        const generated = data.templates_progress.filter(t => t.status === 'Ready').length;
        document.getElementById('ws-progress-text').innerText = `${generated} of ${total} Generated`;

        const percent = total > 0 ? Math.round((generated / total) * 100) : 0;
        document.getElementById('ws-progress-fill').style.width = `${percent}%`;
        document.getElementById('ws-progress-percent').innerText = `${percent}% Complete`;
        document.getElementById('ws-progress-count').innerText = `${generated}/${total}`;

        // Render Source Files List
        const sourceList = document.getElementById('ws-source-list');
        sourceList.innerHTML = '';
        if (data.sources && data.sources.length > 0) {
            data.sources.forEach(src => {
                const el = document.createElement('div');
                el.className = 'source-file-item';
                el.innerHTML = `
                    <svg class="source-file-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
                    <span class="source-file-name" title="${src.filename}">${src.filename}</span>
                `;
                sourceList.appendChild(el);
            });
        } else {
            sourceList.innerHTML = '<em class="text-sm text-gray">No sources uploaded yet.</em>';
        }

        // Setup drop zone
        setupDropZone(data.workspace.id);

        // Categories Map
        const catMap = {};
        data.templates_progress.forEach(tp => {
            const cat = tp.template.category;
            if (!catMap[cat]) catMap[cat] = [];
            catMap[cat].push(tp);
        });

        const catContainer = document.getElementById('categories-container');
        catContainer.innerHTML = '';

        Object.keys(catMap).sort().forEach(catTitle => {
            const number = catTitle.split('-')[0];
            const cleanTitle = catTitle.split('-').slice(1).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

            let html = `
                <div class="category-section">
                    <div class="category-header">
                        <div class="cat-number">${number}</div>
                        <h2 class="category-title">${number}. ${cleanTitle}</h2>
                    </div>
                    <div class="docs-grid">
            `;

            catMap[catTitle].forEach(tp => {
                const isReady = tp.status === 'Ready';
                const fileTokens = tp.template.title.split('-');
                const fileId = fileTokens[0] + (fileTokens.length > 1 ? `-${fileTokens[1].toUpperCase()}` : '');

                html += `
                    <div class="doc-card ${isReady ? 'ready' : ''}" data-path="${tp.template.path}" data-id="${isReady ? tp.document.id : ''}">
                        <div>
                            <div class="doc-card-header">
                                <span class="file-badge">${fileId}</span>
                                ${isReady
                        ? '<span class="badge badge-success flex items-center gap-1"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg> Ready</span>'
                        : '<span class="badge badge-pending">Pending</span>'}
                            </div>
                            <h3 class="doc-card-title">${tp.template.title.replace(/-/g, ' ').replace(/^\d+ /, '')}</h3>
                        </div>
                        <div class="doc-actions w-full mt-2">
                        ${!isReady ?
                        `<button class="btn btn-primary w-full btn-generate" data-path="${tp.template.path}">✨ Generate Document</button>`
                        :
                        `<button class="btn btn-outline w-full btn-view" style="flex: 1;" data-id="${tp.document.id}"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg> View</button>
                             <button class="btn btn-outline w-full btn-regen" style="flex: 1;" data-path="${tp.template.path}">Regenerate</button>`
                    }
                        </div>
                    </div>
                `;
            });

            html += `</div></div>`;
            const section = document.createElement('div');
            section.innerHTML = html;
            catContainer.appendChild(section);
        });

        // Attach events
        document.querySelectorAll('.btn-generate').forEach(b => {
            b.addEventListener('click', (e) => handleGenerate(e.target.dataset.path, b));
        });
        document.querySelectorAll('.btn-regen').forEach(b => {
            b.addEventListener('click', (e) => handleGenerate(e.target.dataset.path, b));
        });
        document.querySelectorAll('.btn-view').forEach(b => {
            b.addEventListener('click', (e) => viewDocument(e.currentTarget.dataset.id));
        });
    }

    // --- ACTIONS ---

    async function handleNewWorkspace(e) {
        e.preventDefault();

        const btn = e.target.querySelector('button[type="submit"]');
        btn.disabled = true;
        btn.innerText = "Creating...";

        const title = document.getElementById('ws-title').value;
        const textContent = document.getElementById('ws-text-content').value;
        const fileInput = document.getElementById('ws-file');

        // 1. Create Workspace
        const resWs = await fetch('/api/workspaces', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title })
        });

        if (resWs.ok) {
            const ws = await resWs.json();

            // 2. Upload text if present
            if (textContent.trim()) {
                await fetch(`/api/workspaces/${ws.id}/sources/text`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ title: 'Pasted Terms of Reference', content: textContent })
                });
            }

            // 3. Upload file if present
            if (fileInput.files.length > 0) {
                const formData = new FormData();
                formData.append('file', fileInput.files[0]);
                await fetch(`/api/workspaces/${ws.id}/sources`, {
                    method: 'POST',
                    body: formData
                });
            }

            closeAllModals();
            document.getElementById('form-new-workspace').reset();
            loadWorkspace(ws.id);
        } else {
            alert("Failed to create workspace");
        }

        btn.disabled = false;
        btn.innerText = "Create Workspace";
    }

    async function handleGenerate(path, btnElement) {
        btnElement.disabled = true;
        const originalText = btnElement.innerText;
        btnElement.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="animate-spin"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg> Generating...`;

        try {
            const res = await fetch(`/api/workspaces/${state.currentWorkspace.workspace.id}/documents/generate`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ template_paths: [path] })
            });

            if (res.ok) {
                // Reload workspace to catch changes
                loadWorkspace(state.currentWorkspace.workspace.id);
            }
        } catch (e) {
            console.error(e);
            alert("Error generating document");
            btnElement.disabled = false;
            btnElement.innerText = originalText;
        }
    }

    async function viewDocument(id) {
        const res = await fetch(`/api/documents/${id}`);
        if (res.ok) {
            const doc = await res.json();
            document.getElementById('view-doc-title').innerText = `${doc.title} - ${doc.category}`;
            document.getElementById('view-doc-category').innerText = `Category: ${doc.category.replace(/^\d+-/, '')}`;

            // Process markdown using imported marked library
            const htmlContent = marked.parse(doc.content || "*No content generated.*");
            document.getElementById('view-doc-content').innerHTML = htmlContent;

            // Link download button
            const dlBtn = document.getElementById('btn-download-md');
            dlBtn.onclick = () => window.location.href = `/api/documents/${id}/download`;

            openModal(modalViewDoc);
        }
    }

    // --- MODALS ---
    function openModal(modal) {
        modalBackdrop.classList.remove('hidden');
        modal.classList.remove('hidden');
    }

    function closeAllModals() {
        modalBackdrop.classList.add('hidden');
        modalNewWorkspace.classList.add('hidden');
        modalViewDoc.classList.add('hidden');
    }

    function downloadCurrentDoc() {
        // Handled dynamically in viewDocument
    }

    // --- UTILS ---
    function setupDropZone(workspaceId) {
        const dropZone = document.getElementById('ws-drop-zone');
        const fileInput = document.getElementById('ws-add-source-btn');
        const progressLabel = document.getElementById('ws-upload-progress');

        if (!dropZone || !fileInput) return;

        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            dropZone.addEventListener(eventName, preventDefaults, false);
        });

        function preventDefaults(e) { e.preventDefault(); e.stopPropagation(); }

        ['dragenter', 'dragover'].forEach(eventName => {
            dropZone.addEventListener(eventName, () => dropZone.classList.add('dragover'), false);
        });

        ['dragleave', 'drop'].forEach(eventName => {
            dropZone.addEventListener(eventName, () => dropZone.classList.remove('dragover'), false);
        });

        dropZone.addEventListener('drop', handleDrop, false);

        // Remove old listener if any to avoid duplicates in case of re-render
        const newFileInput = fileInput.cloneNode(true);
        fileInput.parentNode.replaceChild(newFileInput, fileInput);

        newFileInput.addEventListener('change', handleFileSelect, false);

        function handleDrop(e) {
            const dt = e.dataTransfer;
            const files = dt.files;
            if (files.length) handleFiles(files);
        }

        function handleFileSelect(e) {
            const files = e.target.files;
            if (files.length) handleFiles(files);
        }

        async function handleFiles(files) {
            progressLabel.classList.remove('hidden');
            progressLabel.innerText = "Uploading...";
            let hasError = false;

            for (let i = 0; i < files.length; i++) {
                const formData = new FormData();
                formData.append('file', files[i]);
                try {
                    const res = await fetch(`/api/workspaces/${workspaceId}/sources`, { method: 'POST', body: formData });
                    if (!res.ok) hasError = true;
                } catch (err) {
                    console.error("Upload failed for", files[i].name);
                    hasError = true;
                }
            }

            progressLabel.innerText = hasError ? "Finished with errors" : "Upload complete!";
            setTimeout(() => {
                progressLabel.classList.add('hidden');
                loadWorkspace(workspaceId);
            }, 1000);
        }
    }
});
