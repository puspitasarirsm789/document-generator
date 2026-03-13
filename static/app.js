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
    const modalEditWorkspace = document.getElementById('modal-edit-workspace');
    const modalConfirmDelete = document.getElementById('modal-confirm-delete');
    const modalViewDoc = document.getElementById('modal-view-doc');

    // Templates
    const tplDashboard = document.getElementById('tpl-dashboard').innerHTML;
    const tplWorkspace = document.getElementById('tpl-workspace').innerHTML;
    const tplLogin = document.getElementById('tpl-login').innerHTML;
    const navLogout = document.getElementById('nav-logout');

    // Initialization
    init();

    async function init() {
        setupEventListeners();
        if (localStorage.getItem('auth_token')) {
            navLogout.classList.remove('hidden');
            await loadDashboard();
        } else {
            loadLogin();
        }
    }

    function setupEventListeners() {
        navDashboard.addEventListener('click', loadDashboard);
        navLogout.addEventListener('click', handleLogout);

        // Modal Close Buttons
        document.querySelectorAll('.close-modal').forEach(btn => {
            btn.addEventListener('click', closeAllModals);
        });
        modalBackdrop.addEventListener('click', closeAllModals);

        // Form Submit
        document.getElementById('form-new-workspace').addEventListener('submit', handleNewWorkspace);
        document.getElementById('form-edit-workspace').addEventListener('submit', handleEditWorkspace);

        // Confirm Delete
        document.getElementById('btn-confirm-delete').addEventListener('click', confirmDeleteWorkspace);

        // Download single MD
        document.getElementById('btn-download-md').addEventListener('click', downloadCurrentDoc);
    }

    // --- NETWORKING ---

    async function apiFetch(url, options = {}) {
        const token = localStorage.getItem('auth_token');
        if (!options.headers) options.headers = {};
        if (token) {
            options.headers['Authorization'] = `Bearer ${token}`;
        }

        const res = await fetch(url, options);
        if (res.status === 401 && url !== '/api/login') {
            handleLogout();
            throw new Error('Unauthorized');
        }
        return res;
    }

    // --- NAVIGATION & VIEWS ---

    function loadLogin() {
        state.currentView = 'login';
        navDashboard.classList.add('hidden');
        navLogout.classList.add('hidden');
        appContent.innerHTML = tplLogin;

        document.getElementById('form-login').addEventListener('submit', async (e) => {
            e.preventDefault();
            const user = document.getElementById('login-username').value;
            const pass = document.getElementById('login-password').value;
            const errDiv = document.getElementById('login-error');
            const btn = e.target.querySelector('button');

            btn.disabled = true;
            btn.innerText = "Signing In...";
            errDiv.classList.add('hidden');

            try {
                const res = await fetch('/api/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username: user, password: pass })
                });

                if (res.ok) {
                    const data = await res.json();
                    localStorage.setItem('auth_token', data.access_token);
                    navLogout.classList.remove('hidden');
                    loadDashboard();
                } else {
                    errDiv.innerText = "Incorrect username or password";
                    errDiv.classList.remove('hidden');
                }
            } catch (err) {
                errDiv.innerText = "Network error. Please try again.";
                errDiv.classList.remove('hidden');
            }
            btn.disabled = false;
            btn.innerText = "Sign In";
        });
    }

    function handleLogout() {
        localStorage.removeItem('auth_token');
        loadLogin();
    }

    async function loadDashboard() {
        state.currentView = 'dashboard';
        appContent.innerHTML = tplDashboard;

        navDashboard.classList.remove('hidden');

        document.getElementById('btn-new-project').addEventListener('click', () => {
            openModal(modalNewWorkspace);
        });

        const res = await apiFetch('/api/workspaces');
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
            downloadWithAuth(`/api/workspaces/${id}/export`, `workspace_${id}_export.zip`);
        });

        const res = await apiFetch(`/api/workspaces/${id}`);
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
                    <div class="ws-card-actions">
                        <button class="btn-icon-only btn-icon-edit" aria-label="Edit Workspace" title="Edit Workspace">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                        </button>
                        <button class="btn-icon-only btn-icon-delete" aria-label="Delete Workspace" title="Delete Workspace">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                        </button>
                    </div>
                </div>
            `;

            el.querySelector('.ws-card-title').addEventListener('click', (e) => { e.preventDefault(); loadWorkspace(ws.id); });
            el.querySelector('.btn-open-ws').addEventListener('click', () => loadWorkspace(ws.id));

            const btnEdit = el.querySelector('.btn-icon-edit');
            if (btnEdit) btnEdit.addEventListener('click', (e) => { e.preventDefault(); e.stopPropagation(); openEditWorkspace(ws); });

            const btnDelete = el.querySelector('.btn-icon-delete');
            if (btnDelete) btnDelete.addEventListener('click', (e) => { e.preventDefault(); e.stopPropagation(); handleDeleteWorkspace(ws.id); });

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
                el.className = 'source-file-item group';
                el.innerHTML = `
                    <svg class="source-file-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
                    <span class="source-file-name" title="${src.filename}">${src.filename}</span>
                    <button class="btn-delete-source" data-id="${src.id}" title="Remove source">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                    </button>
                `;
                sourceList.appendChild(el);
            });

            // Attach delete events
            document.querySelectorAll('.btn-delete-source').forEach(btn => {
                btn.addEventListener('click', (e) => handleDeleteSource(e.currentTarget.dataset.id));
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

        if (Object.keys(catMap).length === 0) {
            catContainer.innerHTML = '<div class="text-gray text-center p-8">No documents available for this project.</div>';
        } else {
            // Build Tabs Container
            const tabsWrapper = document.createElement('div');
            tabsWrapper.className = 'tabs-container';

            const tabsHeader = document.createElement('div');
            tabsHeader.className = 'tabs-header';

            const tabsContent = document.createElement('div');
            tabsContent.className = 'tabs-content';

            let isFirst = true;

            Object.keys(catMap).sort().forEach(catTitle => {
                const number = catTitle.split('-')[0];
                const cleanTitle = catTitle.split('-').slice(1).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

                // Create a robust, safe ID string
                const safeName = cleanTitle.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
                const tabId = `tab-${number}-${safeName}`;

                // Create Tab Button
                const tabBtn = document.createElement('button');
                tabBtn.className = `tab-btn ${isFirst ? 'active' : ''}`;
                tabBtn.dataset.target = tabId;
                tabBtn.innerText = `${number}. ${cleanTitle}`;
                tabsHeader.appendChild(tabBtn);

                // Create Tab Pane
                let paneHtml = `
                    <div id="${tabId}" class="tab-pane ${isFirst ? 'active' : ''}">
                        <div class="category-section">
                            <div class="category-header">
                                <div class="cat-number">${number}</div>
                                <h2 class="category-title">${cleanTitle}</h2>
                            </div>
                            <div class="docs-grid">
                `;

                catMap[catTitle].forEach(tp => {
                    const isReady = tp.status === 'Ready';
                    const fileTokens = tp.template.title.split('-');
                    const fileId = fileTokens[0] + (fileTokens.length > 1 ? `-${fileTokens[1].toUpperCase()}` : '');

                    paneHtml += `
                        <div class="doc-card ${isReady ? 'ready' : ''}" data-path="${tp.template.path}" data-id="${isReady ? tp.document.id : ''}">
                            <div>
                                <div class="doc-card-header">
                                    <span class="file-badge">${fileId}</span>
                                    ${isReady
                            ? '<span class="badge badge-success flex items-center gap-1"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg> Ready</span>'
                            : '<span class="badge badge-pending">Pending</span>'}
                                </div>
                                <h3 class="doc-card-title">${tp.template.title.replace(/-/g, ' ').replace(/^\d+ /, '').split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ')}</h3>
                            </div>
                            <div class="doc-actions w-full mt-2" style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
                            ${!isReady ?
                            `<button class="btn btn-primary w-full btn-generate" style="flex: 1; padding: 0.5rem;" data-path="${tp.template.path}" data-lang="id">✨ Gen (ID)</button>
                                 <button class="btn btn-outline w-full btn-generate" style="flex: 1; padding: 0.5rem;" data-path="${tp.template.path}" data-lang="en">✨ Gen (EN)</button>`
                            :
                            `<button class="btn btn-outline w-full btn-view" style="flex: 1; padding: 0.5rem;" data-id="${tp.document.id}"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg> View</button>
                                 <button class="btn btn-outline w-full btn-regen" style="flex: 1; padding: 0.5rem;" data-path="${tp.template.path}" data-lang="id">Regen (ID)</button>
                                 <button class="btn btn-outline w-full btn-regen" style="flex: 1; padding: 0.5rem;" data-path="${tp.template.path}" data-lang="en">Regen (EN)</button>`
                        }
                            </div>
                        </div>
                    `;
                });

                paneHtml += `</div></div></div>`;
                tabsContent.insertAdjacentHTML('beforeend', paneHtml);
                isFirst = false;
            });

            tabsWrapper.appendChild(tabsHeader);
            tabsWrapper.appendChild(tabsContent);
            catContainer.appendChild(tabsWrapper);

            // Tab Switch Logic
            tabsHeader.querySelectorAll('.tab-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const targetId = e.currentTarget.dataset.target;

                    // Remove active from all buttons and panes
                    tabsHeader.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
                    tabsContent.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));

                    // Add active to clicked button and target pane
                    e.currentTarget.classList.add('active');
                    document.getElementById(targetId).classList.add('active');
                });
            });
        }

        // Attach events
        document.querySelectorAll('.btn-generate').forEach(b => {
            b.addEventListener('click', (e) => handleGenerate(e.currentTarget.dataset.path, e.currentTarget.dataset.lang, e.currentTarget));
        });
        document.querySelectorAll('.btn-regen').forEach(b => {
            b.addEventListener('click', (e) => handleGenerate(e.currentTarget.dataset.path, e.currentTarget.dataset.lang, e.currentTarget));
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
        const resWs = await apiFetch('/api/workspaces', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title })
        });

        if (resWs.ok) {
            const ws = await resWs.json();

            // 2. Upload text if present
            if (textContent.trim()) {
                await apiFetch(`/api/workspaces/${ws.id}/sources/text`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ title: 'Pasted Terms of Reference', content: textContent })
                });
            }

            // 3. Upload file if present
            if (fileInput.files.length > 0) {
                const formData = new FormData();
                formData.append('file', fileInput.files[0]);
                await apiFetch(`/api/workspaces/${ws.id}/sources`, {
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

    function openEditWorkspace(workspace) {
        document.getElementById('edit-ws-id').value = workspace.id;
        document.getElementById('edit-ws-title').value = workspace.title;
        openModal(modalEditWorkspace);
    }

    async function handleEditWorkspace(e) {
        e.preventDefault();

        const btn = e.target.querySelector('button[type="submit"]');
        btn.disabled = true;
        btn.innerText = "Saving...";

        const id = document.getElementById('edit-ws-id').value;
        const newTitle = document.getElementById('edit-ws-title').value;

        const res = await apiFetch(`/api/workspaces/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title: newTitle })
        });

        if (res.ok) {
            closeAllModals();
            loadDashboard(); // reload grid
        } else {
            alert("Failed to update workspace name");
        }

        btn.disabled = false;
        btn.innerText = "Save Changes";
    }

    function handleDeleteWorkspace(id) {
        document.getElementById('delete-ws-id').value = id;
        openModal(modalConfirmDelete);
    }

    async function confirmDeleteWorkspace(e) {
        const btn = e.target;
        btn.disabled = true;
        btn.innerText = "Deleting...";

        const id = document.getElementById('delete-ws-id').value;

        try {
            const res = await apiFetch(`/api/workspaces/${id}`, { method: 'DELETE' });
            if (res.ok) {
                closeAllModals();
                loadDashboard();
            } else {
                alert("Failed to delete workspace.");
            }
        } catch (err) {
            console.error(err);
            alert("Network error occurred during deletion.");
        }

        btn.disabled = false;
        btn.innerText = "Delete";
    }

    async function handleGenerate(path, lang, btnElement) {
        btnElement.disabled = true;
        const originalText = btnElement.innerHTML;
        btnElement.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="animate-spin"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg> ...`;

        try {
            const res = await apiFetch(`/api/workspaces/${state.currentWorkspace.workspace.id}/documents/generate`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ template_paths: [path], language: lang })
            });

            if (res.ok) {
                // Reload workspace to catch changes
                loadWorkspace(state.currentWorkspace.workspace.id);
            } else {
                alert("Error generating document");
                btnElement.disabled = false;
                btnElement.innerHTML = originalText;
            }
        } catch (e) {
            console.error(e);
            alert("Error generating document");
            btnElement.disabled = false;
            btnElement.innerHTML = originalText;
        }
    }

    async function handleDeleteSource(sourceId) {
        if (!confirm("Are you sure you want to delete this source file? Note that generating new documents will no longer reference this file.")) return;

        try {
            const res = await apiFetch(`/api/workspaces/${state.currentWorkspace.workspace.id}/sources/${sourceId}`, {
                method: 'DELETE'
            });
            if (res.ok) {
                loadWorkspace(state.currentWorkspace.workspace.id);
            } else {
                alert("Failed to delete source");
            }
        } catch (e) {
            console.error("Error deleting source", e);
        }
    }

    async function viewDocument(id) {
        const res = await apiFetch(`/api/documents/${id}`);
        if (res.ok) {
            const doc = await res.json();
            document.getElementById('view-doc-title').innerText = `${doc.title} - ${doc.category}`;
            document.getElementById('view-doc-category').innerText = `Category: ${doc.category.replace(/^\d+-/, '')}`;

            // Process markdown using imported marked library
            const rawContent = doc.content || "*No content generated.*";
            // Remove {#anchor-tags} format
            const cleanContent = rawContent.replace(/\{#[^}]+\}/g, '');
            const htmlContent = marked.parse(cleanContent);
            document.getElementById('view-doc-content').innerHTML = htmlContent;

            // Link download button
            const dlBtn = document.getElementById('btn-download-md');
            dlBtn.onclick = () => downloadWithAuth(`/api/documents/${id}/download`, `${doc.title}.md`);

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
        modalEditWorkspace.classList.add('hidden');
        modalConfirmDelete.classList.add('hidden');
        modalViewDoc.classList.add('hidden');
    }

    function downloadCurrentDoc() {
        // Handled dynamically in viewDocument
    }

    async function downloadWithAuth(url, defaultFilename) {
        try {
            const res = await apiFetch(url);
            if (!res.ok) throw new Error("Download failed");

            const blob = await res.blob();
            const urlObj = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = urlObj;

            let filename = defaultFilename;
            const disposition = res.headers.get('Content-Disposition');
            if (disposition && disposition.indexOf('attachment') !== -1) {
                const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
                const matches = filenameRegex.exec(disposition);
                if (matches != null && matches[1]) filename = matches[1].replace(/['"]/g, '');
            }

            a.download = filename;
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(urlObj);
        } catch (e) {
            console.error("Download error", e);
            alert("Error downloading file");
        }
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
                    const res = await apiFetch(`/api/workspaces/${workspaceId}/sources`, { method: 'POST', body: formData });
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
