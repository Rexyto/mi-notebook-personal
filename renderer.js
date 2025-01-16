const { ipcRenderer } = require('electron');

let currentNoteId = null;
let hasUnsavedChanges = false;
let searchTimeout = null;
let currentCategory = null;

// Window controls
document.getElementById('minimize-btn').addEventListener('click', () => {
  require('electron').remote.getCurrentWindow().minimize();
});

document.getElementById('maximize-btn').addEventListener('click', () => {
  const win = require('electron').remote.getCurrentWindow();
  if (win.isMaximized()) {
    win.unmaximize();
    document.getElementById('maximize-btn').innerHTML = '<i class="fas fa-square"></i>';
  } else {
    win.maximize();
    document.getElementById('maximize-btn').innerHTML = '<i class="fas fa-clone"></i>';
  }
});

document.getElementById('close-btn').addEventListener('click', async () => {
  const win = require('electron').remote.getCurrentWindow();
  if (hasUnsavedChanges) {
    const choice = await showConfirmDialog(
      '¿Guardar cambios?',
      'Tienes cambios sin guardar. ¿Quieres guardarlos antes de salir?',
      ['Guardar', 'No guardar', 'Cancelar']
    );
    
    if (choice === 0) {
      await guardarNota();
      win.close();
    } else if (choice === 1) {
      win.close();
    }
  } else {
    win.close();
  }
});

// Category buttons
const categoryButtons = ['categoria-personal', 'categoria-trabajo', 'categoria-ideas'];
categoryButtons.forEach(id => {
  document.getElementById(id).addEventListener('click', (e) => {
    const category = id.replace('categoria-', '');
    const button = e.target.closest('.toolbar-btn');
    
    if (button.classList.contains('active')) {
      button.classList.remove('active');
      currentCategory = null;
    } else {
      categoryButtons.forEach(btnId => {
        document.getElementById(btnId).classList.remove('active');
      });
      button.classList.add('active');
      currentCategory = category;
    }
  });
});

// Word count
function updateWordCount() {
  const content = document.getElementById('contenido').value;
  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;
  document.querySelector('.word-count').textContent = `${wordCount} palabras`;
}

document.getElementById('contenido').addEventListener('input', updateWordCount);

// Note functionality
document.getElementById('nueva-nota').addEventListener('click', () => {
  if (hasUnsavedChanges) {
    showConfirmDialog(
      '¿Guardar cambios?',
      'Tienes cambios sin guardar. ¿Quieres guardarlos antes de crear una nueva nota?',
      ['Guardar', 'No guardar', 'Cancelar']
    ).then(choice => {
      if (choice === 0) {
        guardarNota().then(() => nuevaNota());
      } else if (choice === 1) {
        nuevaNota();
      }
    });
  } else {
    nuevaNota();
  }
});

function nuevaNota() {
  currentNoteId = null;
  document.getElementById('titulo').value = '';
  document.getElementById('contenido').value = '';
  document.getElementById('titulo').focus();
  document.getElementById('borrar-nota').disabled = true;
  categoryButtons.forEach(id => {
    document.getElementById(id).classList.remove('active');
  });
  currentCategory = null;
  updateWordCount();
  updateSaveStatus('unsaved');
  hasUnsavedChanges = false;
}

document.getElementById('borrar-nota').addEventListener('click', async () => {
  if (!currentNoteId) return;

  const choice = await showConfirmDialog(
    'Confirmar borrado',
    '¿Estás seguro de que quieres borrar esta nota? Esta acción no se puede deshacer.',
    ['Borrar', 'Cancelar']
  );

  if (choice === 0) {
    try {
      const result = await ipcRenderer.invoke('borrar-nota', { id: currentNoteId });
      if (result.success) {
        showToast('Nota eliminada correctamente', 'success');
        nuevaNota();
        cargarNotas();
      } else {
        showToast('Error al eliminar la nota', 'error');
      }
    } catch (error) {
      showToast('Error al eliminar la nota', 'error');
    }
  }
});

document.getElementById('buscar').addEventListener('input', (e) => {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    const query = e.target.value.trim();
    if (query) {
      buscarNotas(query);
    } else {
      cargarNotas();
    }
  }, 300);
});

async function buscarNotas(query) {
  const notas = await ipcRenderer.invoke('buscar-notas', { query });
  actualizarListaNotas(notas);
}

async function guardarNota() {
  const titulo = document.getElementById('titulo').value;
  const contenido = document.getElementById('contenido').value;

  if (!titulo.trim()) {
    showToast('Por favor, ingresa un título', 'warning');
    return;
  }

  updateSaveStatus('saving');

  try {
    let result;
    if (currentNoteId) {
      result = await ipcRenderer.invoke('actualizar-nota', {
        id: currentNoteId,
        titulo,
        contenido,
        categoria: currentCategory
      });
    } else {
      result = await ipcRenderer.invoke('guardar-nota', { 
        titulo, 
        contenido,
        categoria: currentCategory
      });
      if (result.success) {
        currentNoteId = result.id;
        document.getElementById('borrar-nota').disabled = false;
      }
    }

    if (result.success) {
      hasUnsavedChanges = false;
      updateSaveStatus('saved');
      showToast('Nota guardada correctamente', 'success');
      cargarNotas();
    } else {
      updateSaveStatus('error');
      showToast('Error al guardar la nota', 'error');
    }
  } catch (error) {
    updateSaveStatus('error');
    showToast('Error al guardar la nota', 'error');
  }
}

document.getElementById('guardar').addEventListener('click', guardarNota);

async function cargarNotas() {
  const notas = await ipcRenderer.invoke('obtener-notas');
  actualizarListaNotas(notas);
}

function actualizarListaNotas(notas) {
  const listaNotas = document.getElementById('lista-notas');
  listaNotas.innerHTML = '';

  notas.forEach(nota => {
    const noteElement = document.createElement('div');
    noteElement.className = 'note-item';
    if (currentNoteId === nota.id) {
      noteElement.classList.add('active');
    }

    const titleElement = document.createElement('div');
    titleElement.className = 'note-item-title';
    titleElement.textContent = nota.titulo;

    const dateElement = document.createElement('div');
    dateElement.className = 'note-item-date';
    dateElement.textContent = new Date(nota.fecha_modificacion).toLocaleString();

    if (nota.categoria) {
      const categoryTag = document.createElement('div');
      categoryTag.className = 'category-tag';
      categoryTag.innerHTML = `<i class="fas fa-${
        nota.categoria === 'personal' ? 'user' : 
        nota.categoria === 'trabajo' ? 'briefcase' : 'lightbulb'
      }"></i> ${nota.categoria}`;
      noteElement.appendChild(categoryTag);
    }

    noteElement.appendChild(titleElement);
    noteElement.appendChild(dateElement);
    
    noteElement.addEventListener('click', () => cargarNota(nota));
    listaNotas.appendChild(noteElement);
  });
}

async function cargarNota(nota) {
  if (hasUnsavedChanges) {
    const choice = await showConfirmDialog(
      '¿Guardar cambios?',
      'Tienes cambios sin guardar. ¿Quieres guardarlos antes de cambiar de nota?',
      ['Guardar', 'No guardar', 'Cancelar']
    );

    if (choice === 0) {
      await guardarNota();
    } else if (choice === 2) {
      return;
    }
  }

  currentNoteId = nota.id;
  document.getElementById('titulo').value = nota.titulo;
  document.getElementById('contenido').value = nota.contenido;
  document.getElementById('borrar-nota').disabled = false;
  
  categoryButtons.forEach(id => {
    const category = id.replace('categoria-', '');
    const button = document.getElementById(id);
    if (category === nota.categoria) {
      button.classList.add('active');
      currentCategory = category;
    } else {
      button.classList.remove('active');
    }
  });
  
  updateWordCount();
  
  document.querySelectorAll('.note-item').forEach(el => {
    el.classList.remove('active');
  });
  event.currentTarget.classList.add('active');
  
  hasUnsavedChanges = false;
  updateSaveStatus('saved');
}

// Auto-save functionality
let autoSaveTimeout;
['titulo', 'contenido'].forEach(id => {
  document.getElementById(id).addEventListener('input', () => {
    hasUnsavedChanges = true;
    updateSaveStatus('unsaved');
    
    clearTimeout(autoSaveTimeout);
    autoSaveTimeout = setTimeout(async () => {
      if (currentNoteId && hasUnsavedChanges) {
        await guardarNota();
      }
    }, 2000);
  });
});

function updateSaveStatus(status) {
  const saveStatus = document.getElementById('save-status');
  const icon = saveStatus.querySelector('i');
  const text = saveStatus.querySelector('span');
  
  saveStatus.className = 'save-status';
  icon.className = 'fas';
  
  switch (status) {
    case 'saving':
      saveStatus.classList.add('saving');
      icon.className = 'fas fa-spinner fa-spin';
      text.textContent = 'Guardando...';
      break;
    case 'saved':
      saveStatus.classList.add('saved');
      icon.className = 'fas fa-check';
      text.textContent = 'Guardado';
      break;
    case 'unsaved':
      icon.className = 'fas fa-exclamation-circle';
      text.textContent = 'No guardado';
      break;
    case 'error':
      icon.className = 'fas fa-times-circle';
      text.textContent = 'Error al guardar';
      break;
  }
}

function showToast(message, type = 'success') {
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  
  const icon = document.createElement('i');
  icon.className = 'fas';
  switch (type) {
    case 'success':
      icon.classList.add('fa-check-circle');
      break;
    case 'error':
      icon.classList.add('fa-times-circle');
      break;
    case 'warning':
      icon.classList.add('fa-exclamation-triangle');
      break;
  }
  
  toast.appendChild(icon);
  toast.appendChild(document.createTextNode(message));
  
  const container = document.getElementById('toast-container');
  container.appendChild(toast);
  
  setTimeout(() => {
    toast.style.animation = 'fadeOut 0.3s ease-out';
    setTimeout(() => container.removeChild(toast), 300);
  }, 3000);
}

function showConfirmDialog(title, message, buttons) {
  return new Promise(resolve => {
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    
    const modal = document.createElement('div');
    modal.className = 'modal';
    
    const header = document.createElement('div');
    header.className = 'modal-header';
    header.textContent = title;
    
    const content = document.createElement('div');
    content.className = 'modal-content';
    content.textContent = message;
    
    const footer = document.createElement('div');
    footer.className = 'modal-footer';
    
    buttons.forEach((text, index) => {
      const button = document.createElement('button');
      button.className = `modal-btn modal-btn-${
        index === 0 ? 'primary' : index === buttons.length - 1 ? 'secondary' : 'danger'
      }`;
      button.textContent = text;
      button.onclick = () => {
        document.body.removeChild(overlay);
        resolve(index);
      };
      footer.appendChild(button);
    });
    
    modal.appendChild(header);
    modal.appendChild(content);
    modal.appendChild(footer);
    overlay.appendChild(modal);
    document.body.appendChild(overlay);
  });
}

// Initial load
cargarNotas();