const mongoose = require('mongoose');

const produtoSchema = new mongoose.Schema({
    ID: Number,
    Name: String,
    Price: Number,
    qty_stock: Number
});

const Produto = mongoose.model('Produto', produtoSchema, 'produtos');  // Nome da coleção: produtos

module.exports = Produto;
