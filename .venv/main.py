from flask import Flask, render_template, request, jsonify
import sqlite3
import os

app = Flask(__name__)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATABASE_DIR = os.path.join(BASE_DIR, 'database')
DB_PATH = os.path.join(DATABASE_DIR, 'taskflow.db')

if not os.path.exists(DATABASE_DIR):
    os.makedirs(DATABASE_DIR)

def init_db():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS tarefas (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            titulo TEXT NOT NULL,
            descricao TEXT,
            concluida INTEGER DEFAULT 0,
            posicao INTEGER DEFAULT 0
        )
    ''')
    conn.commit()
    conn.close()
    print("Banco de dados verificado e tabela 'tarefas' pronta na pasta database!")

@app.route('/')
def homepage():
    return render_template('index.html')

@app.get('/api/tarefas')
def obter_tarefas():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute('SELECT id, titulo, descricao, concluida, posicao FROM tarefas ORDER BY posicao ASC, id DESC')
    rows = cursor.fetchall()
    conn.close()
    
    tarefas = [
        {
            "id": r[0], 
            "titulo": r[1], 
            "descricao": r[2], 
            "concluida": r[3],
            "posicao": r[4]
        } for r in rows
    ]
    return jsonify(tarefas)

@app.post('/api/tarefas')
def criar_tarefa():
    dados = request.get_json()
    titulo = dados.get('titulo')
    descricao = dados.get('descricao')
    posicao = dados.get('posicao', 0) 
    
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute('INSERT INTO tarefas (titulo, descricao, posicao) VALUES (?, ?, ?)', (titulo, descricao, posicao))
    conn.commit()
    novo_id = cursor.lastrowid
    conn.close()
    
    return jsonify({"id": novo_id, "titulo": titulo, "descricao": descricao, "concluida": 0, "posicao": posicao}), 201

@app.put('/api/tarefas/<int:id>')
def atualizar_tarefa(id):
    dados = request.get_json()
    titulo = dados.get('titulo')
    descricao = dados.get('descricao')
    
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute('''
        UPDATE tarefas 
        SET titulo = ?, descricao = ? 
        WHERE id = ?
    ''', (titulo, descricao, id))
    conn.commit()
    conn.close()
    
    return jsonify({"id": id, "titulo": titulo, "descricao": descricao})

@app.put('/api/tarefas/<int:id>/status')
def atualizar_status(id):
    dados = request.get_json()
    concluida = dados.get('concluida')
    
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute('UPDATE tarefas SET concluida = ? WHERE id = ?', (concluida, id))
    conn.commit()
    conn.close()
    
    return jsonify({"id": id, "concluida": concluida})

@app.put('/api/tarefas/reordenar')
def reordenar_tarefas():
    dados = request.get_json()
    lista_ids = dados.get('ids', []) 
    
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    for index, id_tarefa in enumerate(lista_ids):
        cursor.execute('UPDATE tarefas SET posicao = ? WHERE id = ?', (index, id_tarefa))
        
    conn.commit()
    conn.close()
    return jsonify({"sucesso": True})

@app.delete('/api/tarefas/<int:id>')
def deletar_tarefa(id):
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute('DELETE FROM tarefas WHERE id = ?', (id,))
    conn.commit()
    conn.close()
    return jsonify({"sucesso": True})

if __name__ == '__main__':
    init_db() 
    app.run(debug=True)
