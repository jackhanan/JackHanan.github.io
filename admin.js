let projectsData = [];
let directoryHandle = null;

// DOM Elements
const connectBtn = document.getElementById('connect-btn');
const statusText = document.getElementById('status-text');
const dashboardView = document.getElementById('dashboard-view');
const formView = document.getElementById('form-view');
const projectsListEl = document.getElementById('admin-projects-list');
const exportBtn = document.getElementById('export-btn');

// Form Elements
const projectForm = document.getElementById('project-form');
const addProjectBtn = document.getElementById('add-project-btn');
const closeFormBtn = document.getElementById('close-form-btn');
const cancelFormBtn = document.getElementById('cancel-form-btn');
const galleryListEl = document.getElementById('gallery-list');
const addGalleryItemBtn = document.getElementById('add-gallery-item-btn');
const dropZone = document.getElementById('drop-zone');

// Initialization called after successful login
async function initAdmin() {
    await fetchProjects();
    renderDashboard();
}

// Fetch initial data
async function fetchProjects() {
    try {
        const response = await fetch('data/projects.json');
        if (response.ok) {
            projectsData = await response.json();
        } else {
            console.error('Failed to load projects.json');
        }
    } catch (error) {
        console.error('Error fetching projects:', error);
    }
}

// Connect Local Directory
connectBtn.addEventListener('click', async () => {
    try {
        if (!window.showDirectoryPicker) {
            alert('Your browser does not support the File System Access API. Please use Chrome, Edge, or Opera.');
            return;
        }
        directoryHandle = await window.showDirectoryPicker({ mode: 'readwrite' });

        statusText.textContent = `Connected to local folder. Write permissions granted.`;
        statusText.classList.remove('text-yellow-500');
        statusText.classList.add('text-green-500');
        connectBtn.textContent = "Repo Connected";
        connectBtn.classList.add('bg-white', 'text-black');
        connectBtn.disabled = true;

    } catch (error) {
        console.error('Error connecting to directory:', error);
        alert('Failed to connect to directory. Ensure you grant read/write permissions.');
    }
});

// Render Dashboard
function renderDashboard() {
    projectsListEl.innerHTML = '';

    projectsData.forEach((project, index) => {
        const card = document.createElement('div');
        card.className = 'bg-neutral-900 border border-neutral-800 rounded-lg overflow-hidden shadow-lg flex flex-col';

        card.innerHTML = `
            <div class="h-40 overflow-hidden bg-black relative group">
                <img src="${project.coverImage || ''}" alt="${project.title}" class="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity">
                <div class="absolute top-2 right-2 bg-black/80 px-2 py-1 rounded text-xs">${project.number}</div>
            </div>
            <div class="p-6 flex-grow flex flex-col justify-between">
                <div>
                    <h3 class="font-serif text-xl mb-1">${project.title}</h3>
                    <p class="text-xs text-neutral-400 mb-4">${project.subheading}</p>
                </div>
                <div class="flex space-x-3 mt-4">
                    <button class="edit-btn flex-1 bg-neutral-800 hover:bg-neutral-700 text-white text-sm py-2 rounded transition-colors" data-index="${index}">Edit</button>
                    <button class="delete-btn flex-1 border border-red-900 text-red-500 hover:bg-red-900 hover:text-white text-sm py-2 rounded transition-colors" data-index="${index}">Delete</button>
                </div>
            </div>
        `;
        projectsListEl.appendChild(card);
    });

    // Attach event listeners to new buttons
    document.querySelectorAll('.edit-btn').forEach(btn => {
        btn.addEventListener('click', (e) => openForm(e.target.dataset.index));
    });

    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const idx = e.target.dataset.index;
            if(confirm(`Are you sure you want to delete "${projectsData[idx].title}"?`)) {
                projectsData.splice(idx, 1);
                renderDashboard();
            }
        });
    });
}

// Gallery Input Management
function renderGalleryInputs(galleryArray) {
    galleryListEl.innerHTML = '';
    if (!galleryArray || galleryArray.length === 0) {
        galleryListEl.innerHTML = '<p class="text-xs text-neutral-500 italic">No gallery images added yet.</p>';
        return;
    }

    galleryArray.forEach((path, i) => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'flex gap-2 items-center';
        itemDiv.innerHTML = `
            <input type="text" class="gallery-path-input flex-grow bg-black border border-neutral-700 p-2 text-white text-sm focus:outline-none focus:border-neutral-500 rounded" value="${path}">
            <button type="button" class="remove-gallery-btn text-red-500 hover:text-red-400 p-2"><i class="ph ph-trash"></i></button>
        `;
        galleryListEl.appendChild(itemDiv);
    });

    document.querySelectorAll('.remove-gallery-btn').forEach((btn, i) => {
        btn.addEventListener('click', () => {
            const currentPaths = getGalleryPathsFromDOM();
            currentPaths.splice(i, 1);
            renderGalleryInputs(currentPaths);
        });
    });
}

function getGalleryPathsFromDOM() {
    return Array.from(document.querySelectorAll('.gallery-path-input')).map(input => input.value);
}

addGalleryItemBtn.addEventListener('click', () => {
    const currentPaths = getGalleryPathsFromDOM();
    currentPaths.push('');
    renderGalleryInputs(currentPaths);
});

// View Toggling
function showFormView() {
    dashboardView.classList.add('hidden');
    formView.classList.remove('hidden');
    window.scrollTo(0, 0);
}

function hideFormView() {
    formView.classList.add('hidden');
    dashboardView.classList.remove('hidden');
    projectForm.reset();
}

addProjectBtn.addEventListener('click', () => {
    document.getElementById('form-title').textContent = 'Add New Project';
    document.getElementById('form-id').value = ''; // Empty ID signifies new
    renderGalleryInputs([]);
    showFormView();
});

closeFormBtn.addEventListener('click', hideFormView);
cancelFormBtn.addEventListener('click', hideFormView);

// Open Form for Editing
function openForm(index) {
    const project = projectsData[index];
    document.getElementById('form-title').textContent = 'Edit Project';

    document.getElementById('form-id').value = project.id || `project_${Date.now()}`;
    document.getElementById('form-title-input').value = project.title || '';
    document.getElementById('form-number').value = project.number || '';
    document.getElementById('form-subheading').value = project.subheading || '';
    document.getElementById('form-location').value = project.location || '';
    document.getElementById('form-year').value = project.year || '';
    document.getElementById('form-description').value = project.description || '';
    document.getElementById('form-link').value = project.link || '';
    document.getElementById('form-cover-image').value = project.coverImage || '';

    renderGalleryInputs(project.gallery || []);
    showFormView();
}

// Handle Form Submission
projectForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const id = document.getElementById('form-id').value || `project_${Date.now()}`;
    const title = document.getElementById('form-title-input').value;
    const number = document.getElementById('form-number').value;
    const subheading = document.getElementById('form-subheading').value;
    const location = document.getElementById('form-location').value;
    const year = document.getElementById('form-year').value;
    const description = document.getElementById('form-description').value;
    const link = document.getElementById('form-link').value;
    const coverImage = document.getElementById('form-cover-image').value;
    const gallery = getGalleryPathsFromDOM().filter(path => path.trim() !== '');

    const projectData = {
        id, title, number, subheading, location, year, description, link, coverImage, gallery
    };

    // Update existing or add new
    const existingIndex = projectsData.findIndex(p => p.id === id);
    if (existingIndex >= 0) {
        projectsData[existingIndex] = projectData;
    } else {
        projectsData.push(projectData);
    }

    hideFormView();
    renderDashboard();
    alert("Project saved to memory. Don't forget to 'Generate & Export' to commit changes.");
});

// Implement Image File Handling (Drag & Drop)
dropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropZone.classList.add('border-white', 'bg-neutral-800');
});

dropZone.addEventListener('dragleave', (e) => {
    e.preventDefault();
    dropZone.classList.remove('border-white', 'bg-neutral-800');
});

dropZone.addEventListener('drop', async (e) => {
    e.preventDefault();
    dropZone.classList.remove('border-white', 'bg-neutral-800');

    if (!directoryHandle) {
        alert('You must Connect Local Repo first to write images.');
        return;
    }

    const files = e.dataTransfer.files;
    for (const file of files) {
        if (!file.type.startsWith('image/')) continue;

        try {
            // Get or create assets directory
            const assetsDir = await directoryHandle.getDirectoryHandle('assets', { create: true });

            // Create a unique filename if needed or use original
            const filename = `${Date.now()}_${file.name}`;
            const fileHandle = await assetsDir.getFileHandle(filename, { create: true });

            // Write file
            const writable = await fileHandle.createWritable();
            await writable.write(file);
            await writable.close();

            // Add path to gallery
            const newPath = `assets/${filename}`;
            const currentPaths = getGalleryPathsFromDOM();
            currentPaths.push(newPath);
            renderGalleryInputs(currentPaths);

            console.log(`Saved ${filename} to assets/`);

        } catch (error) {
            console.error('Error saving image:', error);
            alert(`Failed to save ${file.name}.`);
        }
    }
});

// Implement Export Logic
exportBtn.addEventListener('click', async () => {
    const jsonString = JSON.stringify(projectsData, null, 4);

    if (directoryHandle) {
        try {
            const dataDir = await directoryHandle.getDirectoryHandle('data', { create: true });
            const fileHandle = await dataDir.getFileHandle('projects.json', { create: true });
            const writable = await fileHandle.createWritable();
            await writable.write(jsonString);
            await writable.close();
            alert('Changes successfully committed to data/projects.json!');
        } catch (err) {
            console.error('Save failed', err);
            alert('Failed to write directly to repo. Downloading fallback instead.');
            downloadFallback(jsonString);
        }
    } else {
        downloadFallback(jsonString);
    }
});

function downloadFallback(data) {
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'projects.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    alert('Downloaded projects.json. Please replace the file manually in data/projects.json.');
}
