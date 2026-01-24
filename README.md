# 📝 Notebook-app - Rust-Svelte

Una aplicación de escritorio de alto rendimiento para la gestión de notas personales, construida con **Tauri**, **SvelteKit** y **SQLite**.


## 🚀 Características

- **Edición Enriquecida:** Editor de texto WYSIWYG basado en TipTap.
- **Persistencia Local:** Base de datos SQLite integrada para un almacenamiento rápido y seguro.
- **Guardado Automático:** Sincronización en tiempo real entre el estado del frontend y la base de datos.
- **Exportación Nativa:** Capacidad para exportar notas directamente a archivos `.txt` usando la API nativa del SO.
- **Rendimiento Optimizado:** Binario ligero gracias a la arquitectura de Rust, con un consumo mínimo de memoria RAM.

## 🛠️ Stack Tecnológico

| Componente | Tecnología |
| :--- | :--- |
| **Frontend** | SvelteKit, TypeScript, Tailwind CSS |
| **Editor** | TipTap (Prosemirror) |
| **Backend** | Rust (Tauri v2) |
| **Database** | SQLite (tauri-plugin-sql) |
| **OS Bridge** | Tauri API (Dialog, FS) |

## 📦 Instalación (Desarrollo)

Si deseas ejecutar este proyecto localmente para desarrollo:

1. **Clonar el repositorio:**
   git clone [https://github.com/MarioPortacio/notebook-app.git](https://github.com/MarioPortacio/notebook-app.git)
   cd notebook-app

2. **Instalar dependencias:**
    npm install

3. **Ejecutar en modo dev:**
    npm run tauri dev