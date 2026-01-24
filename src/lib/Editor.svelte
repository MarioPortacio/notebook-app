<script lang="ts">
  import { onMount, onDestroy, createEventDispatcher } from 'svelte';
  import { Editor } from '@tiptap/core';
  import StarterKit from '@tiptap/starter-kit';

  export let initialContent = ''; 
  const dispatch = createEventDispatcher();
  let element: HTMLElement;
  let editor: Editor;

  $: if (editor && initialContent !== undefined && editor.getHTML() !== initialContent) {
    editor.commands.setContent(initialContent, { emitUpdate: false });
  }

  onMount(() => {
    editor = new Editor({
      element: element,
      extensions: [StarterKit],
      content: initialContent,
      onUpdate({ editor }) {
        dispatch('update', { html: editor.getHTML() });
      },
        onTransaction() {
        // Al asignar el editor a sí mismo, Svelte detecta un cambio 
        // de estado y refresca los botones en el HTML
        editor = editor; 
      },


    });
  });

  onDestroy(() => { if (editor) editor.destroy(); });
</script>

<div class="editor-container">
  {#if editor}
    <div class="toolbar">
      <button 
        type="button"
        on:click={() => editor.chain().focus().toggleBold().run()} 
        class:active={editor.isActive('bold')}>
        <b>B</b>
      </button>
      <button 
        type="button"
        on:click={() => editor.chain().focus().toggleItalic().run()} 
        class:active={editor.isActive('italic')}>
        <i>I</i>
      </button>
      <button 
        type="button"
        on:click={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} 
        class:active={editor.isActive('heading', { level: 1 })}>
        H1
      </button>
      <button 
        type="button"
        on:click={() => editor.chain().focus().toggleBulletList().run()} 
        class:active={editor.isActive('bulletList')}>
        • Lista
      </button>
    </div>
  {/if}

  <div bind:this={element} class="prose-area"></div>
</div>

<style>
  .editor-container {
    display: flex;
    flex-direction: column;
    height: 100%;
  }

  .toolbar {
    display: flex;
    gap: 8px;
    padding: 10px;
    background: #fdfdfd;
    border-bottom: 1px solid #eee;
  }

  .toolbar button {
    width: 36px;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid #ddd;
    background: white;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.2s ease; /* Para que el cambio de color sea suave */
    color: #444;
  }

  /* Efecto al pasar el ratón (hover) */
  .toolbar button:hover {
    background: #f0f0f0;
    border-color: #bbb;
  }

  /* ESTADO ACTIVO: Cuando el formato está aplicado */
  .toolbar button.active {
    background: #007bff; /* Azul*/
    color: white;        /* Texto blanco para contraste */
    border-color: #0056b3;
    box-shadow: inset 0 2px 4px rgba(0,0,0,0.1); /* Efecto de presionado */
    transform: translateY(1px); /* Se hunde un poquito al hacer clic */
  }

  .prose-area {
    padding: 30px;
    flex: 1;
    overflow-y: auto;
  }

  :global(.tiptap) {
    outline: none;
    min-height: 400px;
    line-height: 1.6;
  }
</style>