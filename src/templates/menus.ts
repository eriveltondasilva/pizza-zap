// src/templates/menus.ts

/**
 * Menus do chatbot formatados em texto para envio via WhatsApp
 * Cada menu segue o formato de numeração seguido por emoji e descrição
 */

const menuFooter = '🔢 Digite o número da opção desejada:'

export const registrationMenu = [
  '👤 *CADASTRO*',
  '',
  '1️⃣ - Nome Completo 👤',
  '2️⃣ - Endereço 📍',
  '0️⃣ - Voltar 🔙',
  '',
  menuFooter,
]

export const mainMenu = [
  '📝 *MENU PRINCIPAL*',
  '',
  '1️⃣ - Fazer Pedido 🛒',
  '2️⃣ - Acompanhar Pedido 🚚',
  '3️⃣ - Ver Histórico de Pedidos 📜',
  '4️⃣ - Atualizar Cadastro 📝',
  '5️⃣ - Falar com Atendente 💬',
  '0️⃣ - Finalizar Atendimento ❌',
  '',
  menuFooter,
]

export const orderMenu = [
  '🛒 *MENU DE PEDIDO*',
  '',
  '1️⃣ - Pizza (sabor único) 🍕',
  '2️⃣ - Pizza (dois sabores) 🍕',
  '3️⃣ - Bebidas 🍹',
  '4️⃣ - Finalizar Pedido ✅',
  '0️⃣ - Cancelar Pedido ❌',
  '',
  menuFooter,
]

export const paymentMenu = [
  '💳 *MENU DE PAGAMENTO*',
  '',
  '1️⃣ - Cartão de Crédito 💳',
  '2️⃣ - Cartão de Débito 💳',
  '3️⃣ - Dinheiro 💵',
  '4️⃣ - Pix 📲',
  '',
  menuFooter,
]

export const confirmMenu = ['🆗 *MENU DE CONFIRMAÇÃO*', '', '1️⃣ - Confirmar ✅', '2️⃣ - Cancelar ❌', '', menuFooter]

export const changeMenu = [
  '🔢 *MENU DE TROCO*',
  '',
  '1️⃣ - Sim, preciso de troco 💵',
  '2️⃣ - Não preciso de troco ✅',
  '',
  menuFooter,
]

export const ratingMenu = [
  '🔢 *MENU DE AVALIAÇÃO*',
  '',
  '1️⃣ - ⭐ Ruim',
  '2️⃣ - ⭐⭐ Regular',
  '3️⃣ - ⭐⭐⭐ Bom',
  '4️⃣ - ⭐⭐⭐⭐ Muito Bom',
  '5️⃣ - ⭐⭐⭐⭐⭐ Excelente',
  '0️⃣ - Não quero avaliar ❌',
  '',
  menuFooter,
]

export const cancelMenu = [
  '🔢 *MENU DE CANCELAMENTO*',
  '',
  '1️⃣ - Sim, quero cancelar ❌',
  '2️⃣ - Não, não quero cancelar ✅',
  '',
  menuFooter,
]
