## TaskFlow

Aplicação web de gerenciamento de tarefas desenvolvida com Python e Flask.

## Sobre o projeto

O TaskFlow é uma aplicação web de gerenciamento de tarefas desenvolvida como projeto de portfólio para colocar em prática conceitos de desenvolvimento web, programação em Python, criação de APIs e persistência de dados.

A aplicação permite criar, visualizar, editar, concluir, reabrir, excluir e reorganizar tarefas. Os dados são armazenados em um banco de dados SQLite, permitindo que as tarefas permaneçam salvas mesmo após o encerramento da aplicação.

## Funcionalidades

- Criar novas tarefas
- Visualizar tarefas cadastradas
- Editar título e descrição
- Marcar tarefas como concluídas
- Reabrir tarefas concluídas
- Excluir tarefas
- Reorganizar tarefas por drag and drop
- Salvar as tarefas em banco de dados SQLite
- Manter os dados salvos após fechar e reabrir a aplicação

## Tecnologias utilizadas

- Python
- Flask
- SQLite
- HTML5
- CSS3
- JavaScript
- Git
- GitHub

## Estrutura do projeto

```text
taskflow/
├── main.py
├── README.md
├── templates/
│   └── index.html
├── static/
│   ├── css/
│   │   └── style.css
│   └── js/
│       └── script.js
└── database/
    └── taskflow.db
```

## Como executar o projeto

###1. Clone o repositório
```bash
#2. Acesse a pasta do projeto
cd taskflow
#3. Crie e ative um ambiente virtual

#No Windows:

python -m venv venv
venv\Scripts\activate
#4. Instale as dependências
pip install -r requirements.txt
#5. Execute a aplicação
python main.py
6. Acesse no navegador

Abra:

http://127.0.0.1:5000
```

## Próximos passos

Algumas melhorias planejadas para versões futuras do TaskFlow:

- Melhorar a responsividade para dispositivos móveis
- Criar autenticação e contas de usuário
- Permitir que cada usuário tenha sua própria lista de tarefas
- Publicar a aplicação em um ambiente online
- Melhorar a interface e a experiência do usuário

## Objetivo

O TaskFlow foi desenvolvido como projeto prático de portfólio com o objetivo de aplicar conhecimentos de desenvolvimento web e fortalecer a experiência com Python, Flask, JavaScript, bancos de dados, APIs e Git/GitHub.

O projeto também faz parte do processo de desenvolvimento de habilidades práticas para atuação profissional na área de Análise e Desenvolvimento de Sistemas.