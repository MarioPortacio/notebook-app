<script lang="ts">
  import { onMount } from 'svelte';
  import Editor from '$lib/Editor.svelte';
  import { inicializarDB, obtenerNotas, guardarNota, eliminarNota, type Nota } from '$lib/db';
  import { save } from '@tauri-apps/plugin-dialog';
  import { writeTextFile } from '@tauri-apps/plugin-fs';
  import { message } from '@tauri-apps/plugin-dialog';

  let notas: Nota[] = [];
  let notaActualId: number | null = null;
  let timer: any;

  async function exportarNota() {
  if (!notaSeleccionada) return;

  try {
    const path = await save({
      filters: [{ name: 'Texto', extensions: ['txt'] }],
      defaultPath: `${notaSeleccionada.titulo}.txt`
    });

    console.log("Ruta seleccionada:", path); // Esto dirá dónde se supone que se guarda

    if (path) {
      // Limpiamos el HTML para que sea texto legible
      const textoPlano = notaSeleccionada.contenido
        .replace(/<\/p>/g, '\n') // Cambiamos cierres de párrafo por saltos de línea
        .replace(/<[^>]*>/g, ''); // Quitamos el resto de etiquetas

      // Usamos writeTextFile de @tauri-apps/plugin-fs
      await writeTextFile(path, textoPlano);
      
      alert(`¡Archivo guardado con éxito en:\n${path}`);
    }
  } catch (err) {
    console.error("Error detallado:", err);
    alert("No se pudo guardar el archivo. Revisa los permisos.");
  }
}


  // Buscamos la nota seleccionada en el array
  $: notaSeleccionada = notas.find(n => n.id === notaActualId);

  onMount(async () => {
    await inicializarDB();
    notas = await obtenerNotas();
  });



  //  Función para crear una nota real en la DB
  async function crearNuevaNota() {
    // Insertamos una nota vacía para obtener un ID real de SQLite
    await guardarNota(null, "Nueva nota", "<p></p>");
    
    // Recargamos la lista para que aparezca
    notas = await obtenerNotas();
    
    // Seleccionamos la primera (que es la que acabamos de crear)
    if (notas.length > 0) {
      notaActualId = notas[0].id;
    }
  }

  async function borrarNotaActual(id: number | null) {
  if (id === null) return;
  
  const confirmado = await confirm("¿Estás seguro de que quieres borrar esta nota?");
  if (!confirmado) return;
  
  await eliminarNota(id);
  notaActualId = null; 
  notas = await obtenerNotas(); 
}

// Función para cuando cambia el TITULO
  function handleUpdateTitulo() {
    clearTimeout(timer);
    timer = setTimeout(async () => {
      if (notaSeleccionada) {
        await guardarNota(notaSeleccionada.id, notaSeleccionada.titulo, notaSeleccionada.contenido);
        notas = await obtenerNotas(); // Refresca la lista lateral para ver el nuevo título
      }
    }, 800);
  }

  // 2. Mejorar el guardado para que actualice la lista visualmente
  async function handleUpdate(event: any) {
    if (notaActualId === null) return; // No guardar si no hay nota seleccionada

    const html = event.detail.html;
    
    clearTimeout(timer);
    timer = setTimeout(async () => {
    
      // Por ahora mantenemos un título fijo o el ID
      await guardarNota(notaActualId, "Nota " + notaActualId, html);
      
      // IMPORTANTE: Solo recargamos los datos necesarios para no perder el foco
      const nuevasNotas = await obtenerNotas();
      notas = nuevasNotas;
    }, 800);
  }


  // Función para cuando cambia el CONTENIDO (desde el Editor)
  async function handleUpdateContenido(event: any) {
    if (!notaSeleccionada) return;
    
    const nuevoContenido = event.detail.html;
    notaSeleccionada.contenido = nuevoContenido; // Actualizamos la referencia local

    clearTimeout(timer);
    timer = setTimeout(async () => {
      await guardarNota(notaSeleccionada.id, notaSeleccionada.titulo, nuevoContenido);
      
    }, 800);
  }


</script>

<main class="layout">
  <aside class="sidebar">
    <button class="btn-new" on:click={crearNuevaNota}>+ Nueva Nota</button>
    <div class="list">
      {#if notas.length === 0}
        <p style="padding: 10px; color: #888;">No hay notas aún</p>
      {:else}
        {#each notas as nota}
          <button 
            class="item" 
            class:active={notaActualId === nota.id}
            on:click={() => notaActualId = nota.id}
          >
           <b>{nota.titulo || 'Sin título'}</b>
            <small>{nota.actualizado ? new Date(nota.actualizado).toLocaleDateString() : ''}</small>
          </button>
        {/each}
      {/if}
    </div>
  </aside>

 
  <section class="editor-area">
      {#if notaSeleccionada}
        <div class="header-editor">
          <input 
            type="text" 
            bind:value={notaSeleccionada.titulo} 
            on:input={handleUpdateTitulo}
            placeholder="Escribe un título..."
            class="input-titulo"
          />

          <button class="btn-export" on:click={exportarNota}>
            💾 Exportar
          </button>
          <button class="btn-delete" on:click={() => borrarNotaActual(notaSeleccionada.id)}>
            🗑️ Eliminar Nota
          </button>
        </div>
        
        <Editor 
          initialContent={notaSeleccionada.contenido} 
          on:update={handleUpdateContenido} 
        />
      {:else}
        <div class="empty-state">
          <p>Selecciona una nota o presiona en "+ Nueva Nota" para empezar</p>
        </div>
      {/if}
  </section>
</main>

<style>
  .layout { display: flex; height: 100vh; font-family: sans-serif; }
  .sidebar { width: 250px; background: #f4f4f4; border-right: 1px solid #ddd; padding: 10px; }
  .editor-area { flex: 1; display: flex; flex-direction: column; }
  .btn-new { width: 100%; padding: 10px; margin-bottom: 10px; cursor: pointer; }
  .item { 
    display: block; width: 100%; text-align: left; padding: 10px; 
    border: none; background: none; cursor: pointer; border-bottom: 1px solid #eee;
  }
  .item.active { background: white; font-weight: bold; }
  small { display: block; color: #888; font-size: 0.7rem; }

 



  .header-editor {
    display: flex;
    align-items: center;
    padding: 15px 25px;
    background: white;
    border-bottom: 1px solid #eee;
    gap: 15px;
  }

  .input-titulo {
    flex: 1;
    border: none;
    font-size: 1.8rem;
    font-weight: 700;
    outline: none;
    color: #222;
  }

  .input-titulo::placeholder {
    color: #ccc;
  }

  .btn-delete {
    background: #fff0f0;
    color: #ff4d4d;
    border: 1px solid #ffcccc;
    padding: 8px 12px;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.2s;
  }

  .btn-delete:hover {
    background: #ff4d4d;
    color: white;
  }

  .empty-state {
    display: flex;
    height: 100%;
    align-items: center;
    justify-content: center;
    color: #aaa;
    font-size: 1.2rem;
  }

  .btn-export {
    background: #e7f3ff;
    color: #007bff;
    border: 1px solid #b3d7ff;
    padding: 8px 12px;
    border-radius: 6px;
    cursor: pointer;
    font-weight: 500;
  }

  .btn-export:hover {
    background: #007bff;
    color: white;
  }


  
</style>