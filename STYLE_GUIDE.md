# 🎨 Guía de Estilo

<div align="center">

[![Contribución](https://img.shields.io/badge/Contribución-Guía-blue?style=for-the-badge&logo=github)](CONTRIBUTING.md)
[![Código de Conducta](https://img.shields.io/badge/Código-Conducta-green?style=for-the-badge&logo=github)](CODE_OF_CONDUCT.md)
[![Estilo](https://img.shields.io/badge/Guía-Estilo-purple?style=for-the-badge&logo=github)](STYLE_GUIDE.md)

</div>

## 📋 Tabla de Contenidos

1. [🌟 Principios Generales](#-principios-generales)
2. [📝 JavaScript/TypeScript](#-javascripttypescript)
3. [🎨 CSS/Estilos](#-cssestilos)
4. [📄 HTML/Markup](#-htmlmarkup)
5. [📦 Estructura de Archivos](#-estructura-de-archivos)
6. [📚 Documentación](#-documentación)

## 🌟 Principios Generales

### 📏 Reglas Fundamentales

1. **Consistencia**
   - Mantén un estilo coherente
   - Sigue las convenciones establecidas
   - Usa las herramientas de formato automático

2. **Claridad**
   - Código auto-documentado
   - Nombres descriptivos
   - Funciones pequeñas y enfocadas

3. **Mantenibilidad**
   - DRY (Don't Repeat Yourself)
   - KISS (Keep It Simple, Stupid)
   - SOLID principles

## 📝 JavaScript/TypeScript

### 🔤 Nomenclatura

```typescript
// Variables
const userName = 'John';      // camelCase para variables
const MAX_RETRIES = 3;       // UPPER_CASE para constantes

// Clases
class UserManager {          // PascalCase para clases
  private users: User[];     // Tipos explícitos en TS
  
  constructor() {
    this.users = [];
  }
}

// Interfaces
interface IUser {            // Prefijo 'I' para interfaces
  id: string;
  name: string;
  email: string;
}

// Enums
enum UserRole {              // PascalCase para enums
  ADMIN = 'ADMIN',
  USER = 'USER',
  GUEST = 'GUEST'
}
```

### 📏 Formato

```typescript
// Espaciado y Sangría
function calculateTotal(items: Item[]): number {
  return items
    .filter(item => item.active)
    .reduce((total, item) => {
      return total + item.price;
    }, 0);
}

// Longitud máxima de línea: 80 caracteres
const longString = 
  'Esta es una cadena muy larga que debería dividirse ' +
  'en múltiples líneas para mejor legibilidad';

// Imports organizados
import { Component } from 'react';                 // React primero
import { connect } from 'react-redux';            // Librerías externas
import { UserService } from '@services/user';      // Imports internos
import { Button } from '@components/common';       // Componentes
import { formatDate } from '@utils/date';          // Utilidades
```

## 🎨 CSS/Estilos

### 📏 Organización

```css
/* Orden de propiedades */
.element {
  /* Posicionamiento */
  position: absolute;
  top: 0;
  right: 0;
  
  /* Display y Box Model */
  display: flex;
  width: 100%;
  padding: 10px;
  
  /* Colores y Tipografía */
  background: var(--primary);
  color: var(--text);
  font-size: 16px;
  
  /* Otros */
  cursor: pointer;
  transition: all 0.3s ease;
}

/* Variables CSS */
:root {
  --primary: #7C3AED;
  --text: #F8FAFC;
  --spacing-sm: 8px;
  --spacing-md: 16px;
  --spacing-lg: 24px;
}
```

### 🎨 Nomenclatura BEM

```css
/* Bloque */
.card {
  background: white;
}

/* Elemento */
.card__title {
  font-size: 1.5em;
}

/* Modificador */
.card--featured {
  border: 2px solid gold;
}
```

## 📄 HTML/Markup

### 🏗️ Estructura

```html
<!-- Estructura básica -->
<article class="card">
  <header class="card__header">
    <h2 class="card__title">Título</h2>
  </header>
  
  <div class="card__content">
    <p class="card__text">Contenido</p>
  </div>
  
  <footer class="card__footer">
    <button class="button button--primary">
      Acción
    </button>
  </footer>
</article>

<!-- Atributos ordenados -->
<input
  type="text"
  id="username"
  class="input input--large"
  name="username"
  placeholder="Usuario"
  required
/>
```

## 📦 Estructura de Archivos

```
src/
├── components/           # Componentes React
│   ├── common/          # Componentes reutilizables
│   └── features/        # Componentes específicos
├── services/            # Servicios y APIs
├── utils/               # Utilidades y helpers
├── styles/              # Estilos globales
└── types/               # Definiciones de tipos TS
```

## 📚 Documentación

### 📝 Comentarios

```typescript
/**
 * Calcula el total de una orden
 * @param {Order} order - Orden a procesar
 * @returns {number} Total calculado
 * @throws {Error} Si la orden es inválida
 */
function calculateOrderTotal(order: Order): number {
  // Validación de entrada
  if (!order.items?.length) {
    throw new Error('Orden inválida');
  }
  
  // Cálculo del total
  return order.items.reduce((total, item) => {
    return total + (item.price * item.quantity);
  }, 0);
}
```

### 📖 JSDoc

```typescript
/**
 * Representa un usuario del sistema
 * @interface IUser
 * @property {string} id - ID único del usuario
 * @property {string} name - Nombre completo
 * @property {string} email - Correo electrónico
 * @property {UserRole} role - Rol del usuario
 */
interface IUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}
```

---

<div align="center">

**Recuerda: Un código limpio es un código feliz 😊**

</div>