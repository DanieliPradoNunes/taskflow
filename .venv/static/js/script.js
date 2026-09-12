const botaoAbrir = document.querySelector('#abrirModal');
const dialog = document.querySelector('#modalTarefa');
const formulario = document.querySelector('#modalTarefa form');
const inputTitulo = document.querySelector('#tituloTarefa');
const textareaDesc = document.querySelector('#descTarefa');
const listaTarefas = document.querySelector('#listaTarefas');
const botaoCancelar = document.querySelector('#cancelarTarefa')

let tarefaEmEdicao = null   

document.addEventListener('DOMContentLoaded', async () => {
    try {
        const resposta = await fetch('/api/tarefas');
        const tarefas = await resposta.json();
        tarefas.forEach(tarefa => {
            criarCardNaTela(tarefa.titulo, tarefa.descricao, tarefa.id, tarefa.concluida);
        });
    } catch (erro) {
        console.error("Erro ao buscar tarefas:", erro);
    }
});

botaoAbrir.addEventListener('click', () => {
    tarefaEmEdicao = null;
    formulario.reset();
    dialog.showModal();
});

botaoCancelar.addEventListener('click', () => {
    dialog.close(); 
});

formulario.addEventListener('submit', async (evento) => {
    evento.preventDefault(); 

    const titulo = inputTitulo.value.trim();
    const descricao = textareaDesc.value.trim();

    if (titulo === "") {
        alert("Por favor, digite um título para a tarefa!");
        return; 
    }

    if (tarefaEmEdicao) {
        const id = tarefaEmEdicao.dataset.id; 

        try {
            const resposta = await fetch(`/api/tarefas/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ titulo, descricao })
            });

            if (resposta.ok) {
                tarefaEmEdicao.querySelector('h3').textContent = titulo;
                tarefaEmEdicao.querySelector('p').textContent = descricao;

                tarefaEmEdicao = null;
                formulario.reset();
                dialog.close();
            }
        } catch (erro) {
            console.error("Erro ao atualizar no banco:", erro);
        }
        return; 
    }

    try {
        const resposta = await fetch('/api/tarefas', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ titulo, descricao })
        });

        const novaTarefa = await resposta.json();
        criarCardNaTela(novaTarefa.titulo, novaTarefa.descricao, novaTarefa.id, 0);

        formulario.reset();
        dialog.close();
    } catch (erro) {
        console.error("Erro ao salvar no banco:", erro);
    }
});

function criarCardNaTela(titulo, descricao, id, concluida) {
    const novoArticle = document.createElement('article');
    novoArticle.dataset.id = id;
    
    novoArticle.setAttribute('draggable', 'true');

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    if (concluida === 1) checkbox.checked = true;

    const h3 = document.createElement('h3');
    h3.textContent = titulo;
    if (concluida === 1) h3.classList.add('tarefa-concluida');

    const p = document.createElement('p');
    p.textContent = descricao;

    const btnEditar = document.createElement('button');
    btnEditar.type = 'button';
    btnEditar.textContent = '✏️';

    const btnExcluir = document.createElement('button');
    btnExcluir.type = 'button';
    btnExcluir.textContent = '🗑️';

    novoArticle.addEventListener('dragstart', () => {
        novoArticle.classList.add('arrastando');
    });

    novoArticle.addEventListener('dragend', async () => {
        novoArticle.classList.remove('arrastando');
        await salvarNovaOrdemNoBanco();
    });

    checkbox.addEventListener('change', async () => {
        const statusConcluida = checkbox.checked ? 1 : 0;

        try {
            const resposta = await fetch(`/api/tarefas/${id}/status`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ concluida: statusConcluida })
            });

            if (resposta.ok) {
                if (checkbox.checked) {
                    h3.classList.add('tarefa-concluida');
                } else {
                    h3.classList.remove('tarefa-concluida');
                }
            } else {
                checkbox.checked = !checkbox.checked;
                alert("Não foi possível salvar o status da tarefa.");
            }
        } catch (erro) {
            console.error("Erro ao atualizar status no banco:", erro);
            checkbox.checked = !checkbox.checked;
        }
    });

    btnExcluir.addEventListener('click', async () => {
        try {
            const resposta = await fetch(`/api/tarefas/${id}`, { method: 'DELETE' });
            if (resposta.ok) {
                novoArticle.remove(); 
            }
        } catch (erro) {
            console.error("Erro ao deletar do banco:", erro);
        }
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
}

listaTarefas.addEventListener('dragover', (evento) => {
    evento.preventDefault(); 
    const elementoArrastando = document.querySelector('.arrastando');
    const proximoElemento = obterProximoElemento(listaTarefas, evento.clientX, evento.clientY);
    
    if (proximoElemento == null) {
        listaTarefas.appendChild(elementoArrastando);
    } else {
        listaTarefas.insertBefore(elementoArrastando, proximoElemento);
    }
});

function obterProximoElemento(container, x, y) {
    const elementosArrastaveis = [...container.querySelectorAll('article:not(.arrastando)')];
    
    return elementosArrastaveis.reduce((maisProximo, filho) => {
        const box = filho.getBoundingClientRect();
        const offset = x - box.left - box.width / 2; // Calcula aproximação no grid
        
        if (box.top <= y && y <= box.bottom && offset < 0 && offset > maisProximo.offset) {
            return { offset: offset, element: filho };
        } else {
            return maisProximo;
        }
    }, { offset: Number.NEGATIVE_INFINITY }).element;
}

async function salvarNovaOrdemNoBanco() {
    const cards = [...listaTarefas.querySelectorAll('article')];
    const listaIds = cards.map(card => parseInt(card.dataset.id));

    try {
        await fetch('/api/tarefas/reordenar', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ids: listaIds })
        });
    } catch (erro) {
        console.error("Erro ao salvar reordenação:", erro);
    }
}
