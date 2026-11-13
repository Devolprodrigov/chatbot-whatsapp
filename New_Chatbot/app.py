from flask import Flask, request, jsonify

app = Flask(__name__)

@app.route("/", methods=["POST"])
def webhook():
    data = request.json or {}
    # Pega a mensagem enviada pelo usuário e converte para texto limpo
    mensagem_usuario = str(data.get("mensagem", "")).strip().lower()
    
    # Menu Principal ou opção de voltar (0)
    if mensagem_usuario == "0" or not mensagem_usuario or "menu" in mensagem_usuario:
        resposta = (
            "Bom dia! Seja bem-vindo(a) ao atendimento automatizado da nossa Reciclaria. ♻️\n\n"
            "Para agilizar o seu atendimento, por favor, escolha uma das opções abaixo:\n\n"
            "1️⃣ *Financeiro*\n"
            "2️⃣ *Compra* (Fornecedores de materiais)\n"
            "3️⃣ *Vendas* (Compradores de fardos/material)\n"
            "4️⃣ *Coleta* (Busca de materiais)\n"
            "5️⃣ *Entrega* (Balança e pátio)\n\n"
            "💡 Dica: Digite o número correspondente à opção desejada a qualquer momento, ou *9* para falar com um atendente humano."
        )

    # Opção 1: Financeiro
    elif mensagem_usuario == "1":
        resposta = (
            "Setor *Financeiro*. Escolha uma opção:\n"
            "1.1 - Pagamentos efetuados\n"
            "1.2 - Pagamentos pendentes\n"
            "1.3 - Status de faturamento\n\n"
            "0️⃣ Voltar ao menu principal\n"
            "9️⃣ Falar com atendente"
        )

    # Opção 2: Compra
    elif mensagem_usuario == "2":
        resposta = (
            "Setor de *Compra* (Recepção de Materiais). Escolha uma opção:\n"
            "2.1 - Tabela de preços de materiais\n"
            "2.2 - Tipos de materiais aceitos\n"
            "2.3 - Agendar entrega na empresa\n\n"
            "0️⃣ Voltar ao menu principal\n"
            "9️⃣ Falar com atendente"
        )

    # Opção 3: Vendas
    elif mensagem_usuario == "3":
        resposta = (
            "Setor de *Vendas* (Compradores de fardos/material). Escolha uma opção:\n"
            "3.1 - Disponibilidade de fardos\n"
            "3.2 - Tabela comercial\n"
            "3.3 - Fechar pedido\n\n"
            "0️⃣ Voltar ao menu principal\n"
            "9️⃣ Falar com atendente"
        )

    # Opção 4: Coleta
    elif mensagem_usuario == "4":
        resposta = (
            "Setor de *Coleta* (Busca de materiais). Escolha uma opção:\n"
            "4.1 - Solicitar nova coleta\n"
            "4.2 - Consultar rota de coleta\n\n"
            "0️⃣ Voltar ao menu principal\n"
            "9️⃣ Falar com atendente"
        )

    # Opção 5: Entrega
    elif mensagem_usuario == "5":
        resposta = (
            "Setor de *Entrega* (Balança e pátio). Escolha uma opção:\n"
            "5.1 - Status de pesagem\n"
            "5.2 - Instruções de descarregamento\n\n"
            "0️⃣ Voltar ao menu principal\n"
            "9️⃣ Falar com atendente"
        )

    # Opção 9: Falar com atendente humano
    elif mensagem_usuario == "9":
        resposta = (
            "Entendido! Estou transferindo seu atendimento para um de nossos operadores humanos. "
            "Por favor, aguarde um instante."
        )

    # Resposta padrão para entradas inválidas
    else:
        resposta = (
            "Opção inválida. Por favor, digite o número correspondente à opção desejada "
            "ou digite *0* para voltar ao menu principal."
        )

    return jsonify({"resposta": resposta})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)