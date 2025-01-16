# 🤝 Guía de Contribución

<div align="center">

[![Contribución](https://img.shields.io/badge/Contribución-Guía-blue?style=for-the-badge&logo=github)](CONTRIBUTING.md)
[![Código de Conducta](https://img.shields.io/badge/Código-Conducta-green?style=for-the-badge&logo=github)](CODE_OF_CONDUCT.md)
[![Estilo](https://img.shields.io/badge/Guía-Estilo-purple?style=for-the-badge&logo=github)](STYLE_GUIDE.md)

</div>

## 📋 Tabla de Contenidos

1. [🌟 Introducción](#-introducción)
2. [🚀 Primeros Pasos](#-primeros-pasos)
3. [💻 Proceso de Desarrollo](#-proceso-de-desarrollo)
4. [📝 Guías de Estilo](#-guías-de-estilo)
5. [🔍 Testing](#-testing)
6. [📦 Pull Requests](#-pull-requests)
7. [🐛 Reporte de Bugs](#-reporte-de-bugs)
8. [✨ Propuesta de Mejoras](#-propuesta-de-mejoras)

## 🌟 Introducción

¡Gracias por tu interés en contribuir a Mi Notebook Personal! Este documento proporciona las pautas y mejores prácticas para contribuir al proyecto.

### 💪 Formas de Contribuir

- 🐛 Reportar bugs
- 💡 Sugerir nuevas características
- 📝 Mejorar la documentación
- 🔍 Revisar pull requests
- 💻 Contribuir código

## 🚀 Primeros Pasos

### 📋 Prerrequisitos

- Node.js (v14+)
- MySQL (v8.0+)
- Git
- Editor de código (recomendado: VS Code)

### 🔧 Configuración del Entorno

1. Fork del repositorio
```bash
# Clonar tu fork
git clone https://github.com/Rexyto/mi-notebook-personal.git

# Entrar al directorio
cd mi-notebook-personal

# Instalar dependencias
npm install
```

2. Configurar base de datos
```bash
# Configurar variables de entorno
cp .env.example .env
```

## 💻 Proceso de Desarrollo

### 🌿 Branching

- 🔨 \`feature/*\`: Nuevas características
- 🐛 \`fix/*\`: Correcciones de bugs
- 📝 \`docs/*\`: Cambios en documentación
- 🎨 \`style/*\`: Cambios de estilo
- ⚡ \`perf/*\`: Mejoras de rendimiento

### 📝 Commits

Seguimos la convención de [Conventional Commits](https://www.conventionalcommits.org/):

\`\`\`
<tipo>[alcance opcional]: <descripción>

[cuerpo opcional] 

[nota de pie opcional]
\`\`\`

Tipos de commit:
- ✨ feat: Nueva característica
- 🐛 fix: Corrección de bug
- 📚 docs: Documentación
- 🎨 style: Cambios de estilo
- ♻️ refactor: Refactorización
- ⚡ perf: Mejoras de rendimiento
- 🧪 test: Añadir/modificar tests

## 🔍 Testing

### 🧪 Tipos de Tests

1. **Unitarios**
\`\`\`bash
npm run test:unit
\`\`\`

2. **Integración**
\`\`\`bash
npm run test:integration
\`\`\`

3. **E2E**
\`\`\`bash
npm run test:e2e
\`\`\`

### ✅ Cobertura

- Mínimo 80% de cobertura en nuevo código
- Todos los tests deben pasar antes del PR

## 📦 Pull Requests

### 📋 Checklist

- [ ] Tests añadidos/actualizados
- [ ] Documentación actualizada
- [ ] Código sigue guía de estilo
- [ ] Branch actualizada con main
- [ ] Commits siguen convención

### 📝 Plantilla PR

\`\`\`markdown
## 📄 Descripción
[Descripción detallada]

## 🔄 Cambios
- Cambio 1
- Cambio 2

## 🧪 Testing
[Detalles de testing]

## 📸 Screenshots
[Si aplica]
\`\`\`

## 🐛 Reporte de Bugs

### 📝 Plantilla Issue

\`\`\`markdown
## 🐛 Descripción
[Descripción clara y concisa]

## 🔄 Comportamiento Esperado
[Qué debería suceder]

## 🚫 Comportamiento Actual
[Qué está sucediendo]

## 🔍 Pasos para Reproducir
1. Paso 1
2. Paso 2
3. ...

## 💻 Entorno
- OS: [e.g. Windows 10]
- Node: [e.g. 14.17.0]
- MySQL: [e.g. 8.0.26]
\`\`\`

## ✨ Propuesta de Mejoras

### 📝 Plantilla Feature Request

\`\`\`markdown
## 💡 Descripción
[Descripción detallada]

## 🎯 Objetivo
[Qué problema resuelve]

## 📋 Propuesta
[Cómo implementarlo]

## 🔄 Alternativas
[Otras soluciones consideradas]
\`\`\`

---

<div align="center">

**¡Gracias por contribuir a Mi Notebook Personal! 💖**

</div>