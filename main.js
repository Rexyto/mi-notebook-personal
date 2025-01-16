const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const mysql = require('mysql2/promise');

let mainWindow;
let connection;

async function createDatabase() {
  try {
    // Crear conexión a la base de datos
    connection = await mysql.createConnection({
      host: 'localhost',
      user: 'username',
      password: 'password'
    });

    // Crear base de datos si no existe
    await connection.query('CREATE DATABASE IF NOT EXISTS notebook_db');
    await connection.query('USE notebook_db');

    // Crear tabla con nuevos campos
    await connection.query(`
      CREATE TABLE IF NOT EXISTS escritura (
        id INT AUTO_INCREMENT PRIMARY KEY,
        titulo VARCHAR(255) NOT NULL,
        contenido TEXT,
        categoria VARCHAR(50) DEFAULT NULL,
        fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        fecha_modificacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    // Añadir columna categoria si no existe
    await connection.query(`
      SELECT COUNT(*) as count 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = 'notebook_db' 
      AND TABLE_NAME = 'escritura' 
      AND COLUMN_NAME = 'categoria'
    `).then(async ([rows]) => {
      if (rows[0].count === 0) {
        await connection.query('ALTER TABLE escritura ADD COLUMN categoria VARCHAR(50) DEFAULT NULL');
      }
    });

  } catch (error) {
    console.error('Database Error:', error);
    dialog.showErrorBox('Error de Base de Datos', 
      'No se pudo conectar a la base de datos. Asegúrate de que MySQL esté ejecutándose.');
    app.quit();
  }
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true
    },
    frame: false,
    backgroundColor: '#0F172A',
    show: false,
    icon: path.join(__dirname, 'fotin.png')
  });

  mainWindow.loadFile('index.html');
  
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  // Manejar el cierre de la ventana
  mainWindow.on('close', async (e) => {
    if (mainWindow) {
      const result = await dialog.showMessageBox(mainWindow, {
        type: 'question',
        buttons: ['Salir', 'Cancelar'],
        title: 'Confirmar salida',
        message: '¿Estás seguro de que quieres salir?'
      });

      if (result.response === 1) {
        e.preventDefault();
      }
    }
  });
}

app.whenReady().then(async () => {
  await createDatabase();
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// Manejar la creación de notas
ipcMain.handle('guardar-nota', async (event, { titulo, contenido, categoria }) => {
  try {
    const [result] = await connection.query(
      'INSERT INTO escritura (titulo, contenido, categoria) VALUES (?, ?, ?)',
      [titulo, contenido, categoria]
    );
    return { success: true, id: result.insertId };
  } catch (error) {
    console.error('Error al guardar nota:', error);
    return { success: false, error: error.message };
  }
});

// Manejar la actualización de notas
ipcMain.handle('actualizar-nota', async (event, { id, titulo, contenido, categoria }) => {
  try {
    await connection.query(
      'UPDATE escritura SET titulo = ?, contenido = ?, categoria = ? WHERE id = ?',
      [titulo, contenido, categoria, id]
    );
    return { success: true };
  } catch (error) {
    console.error('Error al actualizar nota:', error);
    return { success: false, error: error.message };
  }
});

// Manejar el borrado de notas
ipcMain.handle('borrar-nota', async (event, { id }) => {
  try {
    await connection.query('DELETE FROM escritura WHERE id = ?', [id]);
    return { success: true };
  } catch (error) {
    console.error('Error al borrar nota:', error);
    return { success: false, error: error.message };
  }
});

// Obtener todas las notas
ipcMain.handle('obtener-notas', async () => {
  try {
    const [rows] = await connection.query(
      'SELECT * FROM escritura ORDER BY fecha_modificacion DESC'
    );
    return rows;
  } catch (error) {
    console.error('Error al obtener notas:', error);
    return [];
  }
});

// Buscar notas
ipcMain.handle('buscar-notas', async (event, { query }) => {
  try {
    const [rows] = await connection.query(
      'SELECT * FROM escritura WHERE titulo LIKE ? OR contenido LIKE ? OR categoria LIKE ? ORDER BY fecha_modificacion DESC',
      [`%${query}%`, `%${query}%`, `%${query}%`]
    );
    return rows;
  } catch (error) {
    console.error('Error al buscar notas:', error);
    return [];
  }
});