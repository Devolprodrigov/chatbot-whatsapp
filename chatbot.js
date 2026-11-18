// =====================================
// IMPORTAÇÕES
// =====================================
const qrcode = require("qrcode-terminal");
const { Client, LocalAuth } = require("whatsapp-web.js");

// =====================================
// CONFIGURAÇÃO DO CLIENTE (Otimizado para Nuvem / Render / Linux)
// =====================================
const client = new Client({
  authStrategy: new LocalAuth(),
  puppeteer: {
    headless: true,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--disable-gpu",
      "--single-process",
    ],
  },
});

// =====================================
// QR CODE
// =====================================
client.on("qr", (qr) => {
  console.log("📲 Escaneie o QR Code abaixo:");
  qrcode.generate(qr, { small: true });
});

// =====================================
// WHATSAPP CONECTADO
// =====================================
client.on("ready", () => {
  console.log("✅ Tudo certo! WhatsApp conectado.");
});

// =====================================
// DESCONEXÃO
// =====================================
client.on("disconnected", (reason) => {
  console.log("⚠️ Desconectado:", reason);
});

// =====================================
// INICIALIZA
// =====================================
client.initialize();

// =====================================
// FUNÇÃO DE DELAY
// =====================================
const delay = (ms) => new Promise((res) => setTimeout(res, ms));

// =====================================
// FUNIL DE MENSAGENS E ATENDIMENTO
// =====================================
client.on("message", async (msg) => {
  try {
    // ❌ Ignora mensagens sem remetente, de grupos (@g.us), status ou mensagens vazias
    if (!msg.from || msg.from.endsWith("@g.us") || msg.from === "status@broadcast") return;
    if (!msg.body) return;

    const texto = msg.body.trim().toLowerCase();

    // Função de envio limpa (envia direto para msg.from sem precisar de getChat)
    const enviarResposta = async (respostaTexto) => {
      await delay(1000);
      await client.sendMessage(msg.from, respostaTexto);
    };

    // =====================================
    // 0. TRANSRBORDO / FALAR COM HUMANO (Opção 9)
    // =====================================
    if (texto === "9" || texto.includes("atendente") || texto.includes("humano")) {
      await enviarResposta(
        "👤 Entendido! Estou transferindo seu atendimento para um de nossos operadores humanos. Por favor, aguarde um instante."
      );
      return;
    }

    // =====================================
    // 1. MENU PRINCIPAL (Boas-Vindas)
    // =====================================
    if (/^(menu|oi|olá|ola|bom dia|boa tarde|boa noite|inicio|início)$/i.test(texto)) {
      const hora = new Date().getHours();
      let saudacao = "Olá";

      if (hora >= 5 && hora < 12) saudacao = "Bom dia";
      else if (hora >= 12 && hora < 18) saudacao = "Boa tarde";
      else saudacao = "Boa noite";

      const menuPrincipal = 
        `${saudacao}! Seja bem-vindo(a) ao atendimento automatizado da nossa Reciclaria. ♻️\n\n` +
        `Para agilizar o seu atendimento, por favor, escolha uma das opções abaixo:\n\n` +
        `1️⃣ **Financeiro**\n` +
        `2️⃣ **Compra** (Fornecedores de materiais)\n` +
        `3️⃣ **Vendas** (Compradores de fardos/material)\n` +
        `4️⃣ **Coleta** (Busca de materiais)\n` +
        `5️⃣ **Entrega** (Balança e pátio)\n\n` +
        `💡 *Dica:* Digite o número correspondente à opção desejada a qualquer momento, ou **9** para falar com um atendente humano.`;

      await enviarResposta(menuPrincipal);
      return;
    }

    // =====================================
    // 2. SUBMENUS POR SETOR
    // =====================================

    // --- SETOR 1: FINANCEIRO ---
    if (texto === "1" || texto === "financeiro") {
      const subFinanceiro = 
        `💰 Você selecionou o setor **Financeiro**. Como podemos te ajudar hoje?\n\n` +
        `1.1 - Pagamento\n` +
        `1.2 - Pagamento pendente\n` +
        `1.3 - Status de pagamento\n\n` +
        `0️⃣ Voltar ao menu principal\n` +
        `9️⃣ Falar com atendente`;
      
      await enviarResposta(subFinanceiro);
      return;
    }

    if (texto === "1.1" || texto === "1.2" || texto === "1.3") {
      await enviarResposta(
        `📄 Por favor, envie o seu **CNPJ/CPF** ou o **número da nota/fatura** para que possamos localizar os dados no sistema.`
      );
      return;
    }

    // --- SETOR 2: COMPRA ---
    if (texto === "2" || texto === "compra") {
      const subCompra = 
        `📥 Setor de **Compra** (Recepção de Materiais). Escolha uma opção:\n\n` +
        `2.1 - Tabela de preços de materiais\n` +
        `2.2 - Tipos de materiais aceitos\n` +
        `2.3 - Agendar entrega na empresa\n\n` +
        `0️⃣ Voltar ao menu principal\n` +
        `9️⃣ Falar com atendente`;

      await enviarResposta(subCompra);
      return;
    }

    if (texto === "2.1") {
      await enviarResposta(
        `📊 Segue abaixo a nossa tabela atualizada de materiais recicláveis aceitos (papelão, plástico, ferro, alumínio, etc.). Caso precise de cotações específicas para grandes volumes, digite 9.`
      );
      return;
    }

    // --- SETOR 3: VENDAS ---
    if (texto === "3" || texto === "vendas") {
      const subVendas = 
        `📦 Setor de **Vendas** (Materiais Reciclados). O que você procura?\n\n` +
        `3.1 - Consultar estoque disponível\n` +
        `3.2 - Solicitar orçamento / Cotação\n` +
        `3.3 - Condições de carga e retirada\n\n` +
        `0️⃣ Voltar ao menu principal\n` +
        `9️⃣ Falar com atendente`;

      await enviarResposta(subVendas);
      return;
    }

    if (texto === "3.2") {
      await enviarResposta(
        `📝 Por favor, digite o **tipo de material** e a **quantidade desejada** (em kg ou toneladas) para que nossa equipe comercial prepare a sua cotação.`
      );
      return;
    }

    // --- SETOR 4: COLETA ---
    if (texto === "4" || texto === "coleta") {
      const subColeta = 
        `🚚 Setor de **Coleta**. Como podemos ajudar com a sua rota?\n\n` +
        `4.1 - Solicitar nova coleta\n` +
        `4.2 - Status / Previsão de coleta agendada\n` +
        `4.3 - Alterar dados da coleta\n\n` +
        `0️⃣ Voltar ao menu principal\n` +
        `9️⃣ Falar com atendente`;

      await enviarResposta(subColeta);
      return;
    }

    if (texto === "4.1") {
      await enviarResposta(
        `📍 Para solicitar uma nova coleta, por favor informe:\n1. Endereço completo\n2. Tipo de material\n3. Volume aproximado`
      );
      return;
    }

    // --- SETOR 5: ENTREGA ---
    if (texto === "5" || texto === "entrega") {
      const subEntrega = 
        `⚖️ Setor de **Entrega** (Balança e Pátio). Qual informação você precisa?\n\n` +
        `5.1 - Horários de balança e portaria\n` +
        `5.2 - Documentação necessária\n` +
        `5.3 - Orientações para descarregamento\n\n` +
        `0️⃣ Voltar ao menu principal\n` +
        `9️⃣ Falar com atendente`;

      await enviarResposta(subEntrega);
      return;
    }

    // Voltar ao menu principal
    if (texto === "0" || texto === "voltar") {
      const menuPrincipal = 
        `Retornando ao menu principal...\n\n` +
        `Escolha uma das opções abaixo:\n` +
        `1️⃣ Financeiro\n` +
        `2️⃣ Compra\n` +
        `3️⃣ Vendas\n` +
        `4️⃣ Coleta\n` +
        `5️⃣ Entrega\n\n` +
        `*(Digite "menu" a qualquer momento para ver as opções)*`;
      await enviarResposta(menuPrincipal);
      return;
    }

    // =====================================
    // 3. MENSAGEM DE ERRO (FALLBACK)
    // =====================================
    await enviarResposta(
      `Desculpe, não consegui entender sua resposta. Por favor, digite o número correspondente à opção desejada ou digite **"menu"** para ver as opções principais. Se preferir, digite **9** para falar com nossa equipe.`
    );

  } catch (error) {
    console.error("❌ Erro detalhado no processamento:", error);
  }
});
