const express = require('express');
const cors = require('cors'); // importe do pacote cors
const { v4: uuidv4 } = require('uuid');
require("dotenv").config();
require("./database/connection"); // Importa e conecta ao MongoDB

const app = express();
const port = 3001;

// Middleware para configurar o CORS
app.use(cors());

// Importar o controlador de produtos
const { obterProdutos } = require('./produtos/produtosController');

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
        // Encontre o produto pelo ID no banco de dados
        const produto = await Produto.findOne({ ID: id });

        // Verifique se o produto foi encontrado
        if (!produto) {
            return res.status(404).json({ error: `Produto com ID ${id} não encontrado` });
        }

        // Se o produto foi encontrado, retorne os detalhes do produto em formato JSON
        res.status(200).json(produto);
    } catch (error) {
        // Se ocorrer algum erro durante a consulta ao banco de dados, responda com um erro 500
        console.error('Erro ao obter detalhes do produto:', error.message);
        res.status(500).json({ error: "Erro ao obter detalhes do produto", message: error.message });
    }
});

app.post('/pedidos/novo-item', async (req, res) => {
    const { usuario, produtoId, quantidade } = req.body;

    try {
        // Encontre o pedido existente do usuário ou crie um novo
        let pedido = await Pedido.findOne({ usuario });

        // Se não existir pedido, cria um novo
        if (!pedido) {
            pedido = new Pedido({ usuario, itens: [] });
        }

        // Verifique se o produto já existe no pedido
        const itemExistente = pedido.itens.find(item => item.produto === produtoId);

        const produto = await Produto.findOne({ ID: produtoId });
        if (!produto) {
            return res.status(404).json({ error: `Produto com ID ${produtoId} não encontrado` });
        }

        if (quantidade > produto.qty_stock) {
            return res.status(400).json({ error: `Quantidade insuficiente em estoque para o produto ${produto.Name}` });
        }

        // Se o item já existe no pedido, atualize a quantidade, caso contrário, adicione um novo item
        if (itemExistente) {
            itemExistente.quantidade += quantidade;
        } else {
            pedido.itens.push({
                produto: produtoId,
                quantidade,
                valorUnitario: produto.Price
            });
        }

        // Salve o pedido atualizado
        await pedido.save();

        res.status(200).json(pedido);
    } catch (error) {
        console.error('Erro ao adicionar novo item ao pedido:', error.message);
        res.status(500).json({ error: "Erro ao adicionar novo item ao pedido", message: error.message });
    }
});

// Rota para cadastrar um novo pedido
app.post('/cadastroPedido', async (req, res) => {
    const { usuario, email, pedidos } = req.body;

    try {
        // Gerar um novo ID para o pedido
        const orderId = uuidv4();

        // Gerar um novo ID único para o usuário
        const userId = uuidv4();

        // Verifique o estoque antes de criar o pedido
        for (const pedido of pedidos) {
            const produto = await Produto.findOne({ ID: pedido.produto });
            if (!produto) {
                return res.status(404).json({ error: `Produto com ID ${pedido.produto} não encontrado` });
            }
            if (produto.qty_stock < pedido.quantidade) {
                return res.status(400).json({ error: `Quantidade insuficiente para o produto ${produto.Name}` });
            }
        }

        // Crie um novo pedido usando o modelo Pedido
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

        // Salve o novo pedido no banco de dados
        await novoPedido.save();

        // Atualize o estoque após o pedido ser salvo
        for (const pedido of pedidos) {
            await Produto.updateOne(
                { ID: pedido.produto },
                { $inc: { qty_stock: -pedido.quantidade } }
            );
        }

        // Responda ao front-end com um status de sucesso e o userId criado
        res.status(201).json({ message: "Pedido cadastrado com sucesso!", userId: userId });
    } catch (error) {
        // Se ocorrer algum erro, responda ao front-end com o erro
        console.error('Erro ao cadastrar pedido:', error.message);
        res.status(500).json({ error: "Erro ao cadastrar pedido", message: error.message });
    }
});

// Rota para a área do usuário
app.get('/areaUsuario', async (req, res) => {
    const { usuario, email, dataPedido } = req.query;

    try {
        let query = {};

        // Adicione filtros para nome de usuário, e-mail e data de pedido, se fornecidos
        if (usuario) {
            query.usuario = usuario;
        }
        if (email) {
            query.email = email;
        }
        if (dataPedido) {
            // Converta a dataPedido do formato YYYY-MM-DD para o formato de data correto
            const dataInicio = new Date(dataPedido);
            const dataFim = new Date(dataInicio);
            dataFim.setDate(dataFim.getDate() + 1);
            query.dataPedido = { $gte: dataInicio, $lt: dataFim };
            console.log(`Data de Início: ${dataInicio}`);
            console.log(`Data de Fim: ${dataFim}`);
        }

        // Encontre pedidos com base nos filtros
        const pedidos = await Pedido.find(query);

        // Responda com os pedidos encontrados
        res.status(200).json(pedidos);
    } catch (error) {
        // Se ocorrer algum erro, responda ao front-end com o erro
        console.error('Erro ao carregar pedidos do usuário:', error.message);
        res.status(500).json({ error: "Erro ao carregar pedidos do usuário", message: error.message });
    }
});

app.post('/salvarAlteracoes', async (req, res) => {
    const { pedidos, usuarioLogado } = req.body;

    try {
        if (!usuarioLogado || !usuarioLogado.userId) {
            return res.status(400).json({ error: 'Usuário não autenticado' });
        }

        // Encontre o pedido existente do usuário
        let pedidoExistente = await Pedido.findOne({ userId: usuarioLogado.userId });

        if (!pedidoExistente) {
            // Se não houver um pedido existente, crie um novo com os pedidos fornecidos
            pedidoExistente = new Pedido({
                usuario: usuarioLogado.nome,
                userId: usuarioLogado.userId,
                email: usuarioLogado.email,
                itens: pedidos
            });
        } else {
            // Log dos itens antigos que serão descartados
            console.log('Itens antigos descartados:');
            console.log(pedidoExistente.itens);

            // Remova todos os itens existentes do pedido
            pedidoExistente.itens = [];

            // Adicione os novos itens fornecidos e registre cada item adicionado
            console.log('Novos itens adicionados:');
            pedidos.forEach(item => {
                console.log(item);
                pedidoExistente.itens.push(item);
            });
        }

        // Salve as alterações no pedido
        await pedidoExistente.save();

        res.status(200).json({ message: 'Alterações salvas com sucesso!' });
    } catch (error) {
        console.error('Erro ao salvar alterações:', error.message);
        res.status(500).json({ error: 'Erro ao salvar alterações', message: error.message });
    }
});


// Rota para excluir um produto de um pedido de um usuário
app.delete('/pedidos/:pedidoId/produto/:produtoId', async (req, res) => {
    const { pedidoId, produtoId } = req.params;

    try {
        // Encontre o pedido pelo ID
        const pedido = await Pedido.findById(pedidoId);
        if (!pedido) {
            return res.status(404).json({ error: `Pedido com ID ${pedidoId} não encontrado` });
        }

        // Remova o produto do pedido
        pedido.itens = pedido.itens.filter(item => item._id !== produtoId);

        // Salve as alterações no pedido
        await pedido.save();

        // Responda com uma mensagem de sucesso
        res.status(200).json({ message: "Produto excluído do pedido com sucesso!" });
    } catch (error) {
        // Se ocorrer algum erro, responda ao front-end com o erro
        console.error('Erro ao excluir produto do pedido:', error.message);
        res.status(500).json({ error: "Erro ao excluir produto do pedido", message: error.message });
    }
});

app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});
