const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const http = require('http');
const WebSocket = require('ws');
require("dotenv").config();
require("./database/connection"); // Importa e conecta ao MongoDB

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });
const port = 3001;

// Middleware para configurar o CORS
app.use(cors());

// Importar o controlador de produtos
const { obterProdutos, monitorarProdutos } = require('./produtos/produtosController');

// Importar o modelo de Pedido e Produto
const Pedido = require('./models/Pedido');
const Produto = require('./models/Produto');

// Middleware para parsing de JSON
app.use(express.json());

// Rota para obter produtos
app.get('/produtos', obterProdutos);

// Rota para obter detalhes de um produto por ID
app.get('/produtos/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const produto = await Produto.findOne({ ID: id });

        if (!produto) {
            return res.status(404).json({ error: `Produto com ID ${id} não encontrado` });
        }

        res.status(200).json(produto);
    } catch (error) {
        console.error('Erro ao obter detalhes do produto:', error.message);
        res.status(500).json({ error: "Erro ao obter detalhes do produto", message: error.message });
    }
});

app.post('/pedidos/novo-item', async (req, res) => {
    const { usuario, produtoId, quantidade } = req.body;

    try {
        const produto = await Produto.findOne({ ID: produtoId });
        if (!produto) {
            return res.status(404).json({ error: `Produto com ID ${produtoId} não encontrado` });
        }

        if (quantidade > produto.qty_stock) {
            return res.status(400).json({ error: `Quantidade insuficiente em estoque para o produto ${produto.Name}` });
        }

        let pedido = await Pedido.findOne({ usuario });

        if (!pedido) {
            pedido = new Pedido({ usuario, itens: [] });
        }

        const itemExistente = pedido.itens.find(item => item.produto === produtoId);

        if (itemExistente) {
            itemExistente.quantidade += quantidade;
        } else {
            pedido.itens.push({
                produto: produtoId,
                quantidade,
                valorUnitario: produto.Price
            });
        }

        await pedido.save();

        res.status(200).json(pedido);
    } catch (error) {
        console.error('Erro ao adicionar novo item ao pedido:', error.message);
        res.status(500).json({ error: "Erro ao adicionar novo item ao pedido", message: error.message });
    }
});

app.post('/cadastroPedido', async (req, res) => {
    const { usuario, email, pedidos } = req.body;

    try {
        const orderId = uuidv4();
        const userId = uuidv4();

        for (const pedido of pedidos) {
            const produto = await Produto.findOne({ ID: pedido.produto });
            if (!produto) {
                return res.status(404).json({ error: `Produto com ID ${pedido.produto} não encontrado` });
            }
            if (produto.qty_stock < pedido.quantidade) {
                return res.status(400).json({ error: `Quantidade insuficiente para o produto ${produto.Name}` });
            }
        }

        const novoPedido = new Pedido({
            usuario: usuario,
            userId: userId,
            email: email,
            orderId: orderId,
            itens: pedidos.map(pedido => ({
                produto: pedido.produto,
                quantidade: pedido.quantidade,
                valorUnitario: pedido.preco
            }))
        });

        await novoPedido.save();

        for (const pedido of pedidos) {
            await Produto.updateOne(
                { ID: pedido.produto },
                { $inc: { qty_stock: -pedido.quantidade } }
            );
        }

        res.status(201).json({ message: "Pedido cadastrado com sucesso!", userId: userId });
    } catch (error) {
        console.error('Erro ao cadastrar pedido:', error.message);
        res.status(500).json({ error: "Erro ao cadastrar pedido", message: error.message });
    }
});

app.get('/areaUsuario', async (req, res) => {
    const { usuario, email, dataPedido } = req.query;

    try {
        let query = {};

        if (usuario) {
            query.usuario = usuario;
        }
        if (email) {
            query.email = email;
        }
        if (dataPedido) {
            const dataInicio = new Date(dataPedido);
            const dataFim = new Date(dataInicio);
            dataFim.setDate(dataFim.getDate() + 1);
            query.dataPedido = { $gte: dataInicio, $lt: dataFim };
            console.log(`Data de Início: ${dataInicio}`);
            console.log(`Data de Fim: ${dataFim}`);
        }

        const pedidos = await Pedido.find(query);

        res.status(200).json(pedidos);
    } catch (error) {
        console.error('Erro ao carregar pedidos do usuário:', error.message);
        res.status(500).json({ error: "Erro ao carregar pedidos do usuário", message: error.message });
    }
});

app.post('/salvarAlteracoes', async (req, res) => {
    const { pedidos, usuarioLogado } = req.body;

    try {
        if (!usuarioLogado || !usuarioLogado.email || !usuarioLogado.userId) {
            return res.status(400).json({ error: 'Usuário não autenticado' });
        }

        if (!Array.isArray(pedidos) || pedidos.some(pedido => !pedido.itens || pedido.itens.length === 0)) {
            return res.status(400).json({ error: 'Formato dos pedidos inválido' });
        }

        for (const pedido of pedidos) {
            for (const item of pedido.itens) {
                const produto = await Produto.findOne({ ID: item.produto });
                if (!produto) {
                    return res.status(404).json({ error: `Produto com ID ${item.produto} não encontrado` });
                }
                if (produto.qty_stock < item.quantidade) {
                    return res.status(400).json({ error: `Quantidade insuficiente para o produto ${produto.Name}. Quantidade em estoque: ${produto.qty_stock}` });
                }
            }
        }

        await Pedido.deleteOne({ email: usuarioLogado.email });

        const novoPedido = new Pedido({
            usuario: usuarioLogado.nome,
            userId: usuarioLogado.userId,
            email: usuarioLogado.email,
            itens: pedidos.reduce((acc, pedido) => [...acc, ...pedido.itens], [])
        });
        await novoPedido.save();

        for (const pedido of pedidos) {
            for (const item of pedido.itens) {
                await Produto.updateOne(
                    { ID: item.produto },
                    { $inc: { qty_stock: -item.quantidade } }
                );
            }
        }

        res.status(200).json({ message: 'Alterações salvas com sucesso!' });
    } catch (error) {
        console.error('Erro ao salvar alterações:', error.message);
        res.status(500).json({ error: 'Erro ao salvar alterações', message: error.message });
    }
});

app.delete('/pedidos/:pedidoId/produto/:produtoId', async (req, res) => {
    const { pedidoId, produtoId } = req.params;

    try {
        const pedido = await Pedido.findById(pedidoId);
        if (!pedido) {
            return res.status(404).json({ error: `Pedido com ID ${pedidoId} não encontrado` });
        }

        pedido.itens = pedido.itens.filter(item => item._id.toString() !== produtoId);

        await pedido.save();

        res.status(200).json({ message: "Produto excluído do pedido com sucesso!" });
    } catch (error) {
        console.error('Erro ao excluir produto do pedido:', error.message);
        res.status(500).json({ error: "Erro ao excluir produto do pedido", message: error.message });
    }
});

function enviarAtualizacaoParaClientes(mensagem) {
    console.log('Enviando atualização para clientes:', mensagem); // Log da mensagem sendo enviada
    wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(mensagem));
        }
    });
}

monitorarProdutos(enviarAtualizacaoParaClientes);

server.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});
