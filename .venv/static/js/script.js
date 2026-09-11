const botaoAbrir = document.querySelector('#abrirModal');
const dialog = document.querySelector('#modalTarefa');
const formulario = document.querySelector('#modalTarefa form');
const inputTitulo = document.querySelector('#tituloTarefa');
const textareaDesc = document.querySelector('#descTarefa');
const listaTarefas = document.querySelector('#listaTarefas');
const botaoCancelar = document.querySelector('#cancelarTarefa')

let tarefaEmEdicao = null   

botaoAbrir.addEventListener('click', () => {
    tarefaEmEdicao = null;
    formulario.reset();
    dialog.showModal();
});

botaoCancelar.addEventListener('click', () => {
    dialog.close(); 
});

formulario.addEventListener('submit', (evento) => {

    evento.preventDefault();

    const titulo = inputTitulo.value.trim();
    const descricao = textareaDesc.value.trim();

    if (titulo === "") {
        alert("Por favor, insira um título para a sua tarefa!");
        return; 
    }
    
    if (tarefaEmEdicao) {
        const h3Edicao = tarefaEmEdicao.querySelector('h3');
        const pEdicao = tarefaEmEdicao.querySelector('p');

        h3Edicao.textContent = titulo;
        pEdicao.textContent = descricao;

        tarefaEmEdicao = null;
        formulario.reset();
        dialog.close();
        return;
    }

    const novoArticle = document.createElement('article');

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';

    const h3 = document.createElement('h3');
    h3.textContent = titulo;

    const p = document.createElement('p');
    p.textContent = descricao;

    const btnEditar = document.createElement('button');
    btnEditar.type = 'button';
    btnEditar.textContent = '✏️';

    const btnExcluir = document.createElement('button');
    btnExcluir.type = 'button';
    btnExcluir.textContent = '🗑️';

    checkbox.addEventListener('change', () => {
        if (checkbox.checked) {
            h3.classList.add('tarefa-concluida');
        } else {
            h3.classList.remove('tarefa-concluida');
        }
    });

    btnExcluir.addEventListener('click', () => {
        novoArticle.remove(); 
    });

    btnEditar.addEventListener('click', () => {
        tarefaEmEdicao = novoArticle;

        inputTitulo.value = h3.textContent;
        textareaDesc.value = p.textContent;

        dialog.showModal();
    });

    novoArticle.appendChild(checkbox);
    novoArticle.appendChild(h3);
    novoArticle.appendChild(p);
    novoArticle.appendChild(btnEditar);
    novoArticle.appendChild(btnExcluir);

    listaTarefas.prepend(novoArticle);

    formulario.reset();
    dialog.close();
});
