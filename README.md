# 📝 Notebook-app - Rust-Svelte

Una aplicación de escritorio de alto rendimiento para la gestión de notas personales, construida con **Tauri**, **SvelteKit** y **SQLite**.

---

![Home](https://github.com/MarioPortacio/notebook-app/blob/e76dbc78b0aa76074a308a581cbf32dccad83d38/img/p1.jpg)

![Nota 1](https://github.com/MarioPortacio/notebook-app/blob/e76dbc78b0aa76074a308a581cbf32dccad83d38/img/p2.jpg)

---



## 🚀 Características

- **Edición Enriquecida:** Editor de texto WYSIWYG basado en TipTap.
- **Persistencia Local:** Base de datos SQLite integrada para un almacenamiento rápido y seguro.
- **Guardado Automático:** Sincronización en tiempo real entre el estado del frontend y la base de datos.
- **Exportación Nativa:** Capacidad para exportar notas directamente a archivos `.txt` usando la API nativa del SO.
- **Rendimiento Optimizado:** Binario ligero gracias a la arquitectura de Rust, con un consumo mínimo de memoria RAM.

---

## 🛠️ Stack Tecnológico

| Componente | Tecnología |
| :--- | :--- |
| **Frontend** | SvelteKit, TypeScript, Tailwind CSS |
| **Editor** | TipTap (Prosemirror) |
| **Backend** | Rust (Tauri v2) |
| **Database** | SQLite (tauri-plugin-sql) |
| **OS Bridge** | Tauri API (Dialog, FS) |

---

## 📦 Instalación (Desarrollo)

A) Si deseas ejecutar este proyecto localmente para desarrollo:

1. **Clonar el repositorio:**
   git clone [https://github.com/MarioPortacio/notebook-app.git](https://github.com/MarioPortacio/notebook-app.git)
   cd notebook-app

2. **Instalar dependencias:**
    npm install

3. **Ejecutar en modo dev:**
    npm run tauri dev

B) Si deseas instalar la aplicación:

   En la sección **Releases** de este repositorio encontrará el archivo instalador .msi
   Descarga y ejecuta el archivo .msi para instalar la aplicación en Windows.
   
---
