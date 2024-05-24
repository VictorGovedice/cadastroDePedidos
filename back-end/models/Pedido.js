const mongoose = require('mongoose');

// Função de formatação de data
const formatarData = (data) => {
    const dia = String(data.getDate()).padStart(2, '0');
    const mes = String(data.getMonth() + 1).padStart(2, '0'); // Janeiro é 0!
    const ano = data.getFullYear();
    return `${dia}-${mes}-${ano}`;
};

const pedidoSchema = new mongoose.Schema({
    usuario: { type: String, required: true },
    userId: { type: String, required: true }, // Adicionando a propriedade userId
    email: { type: String, required: true },
    dataPedido: {
        type: Date,
        default: Date.now,
        get: formatarData
    },
    itens: [{
        produto: { type: String, required: true },
        quantidade: { type: Number, required: true },
        valorUnitario: { type: Number, required: true }
    }]
});

// Para garantir que o getter será aplicado ao formato JSON
pedidoSchema.set('toJSON', { getters: true, virtuals: false });

const Pedido = mongoose.model('Pedido', pedidoSchema, 'pedidos');

module.exports = Pedido;
