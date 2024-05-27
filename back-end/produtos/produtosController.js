const { MongoClient } = require('mongodb');

async function obterProdutos(req, res) {
    let client;

    try {
        const uri = process.env.MONGODB_URI;
        client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
        await client.connect();
        const database = client.db('test');
        const collection = database.collection('produtos');
        const produtos = await collection.find({}).toArray();

        console.log('Produtos obtidos do banco de dados:', produtos); // Log dos produtos obtidos

        if (produtos.length > 0) {
            res.status(200).json(produtos);
        } else {
            res.status(404).json({ message: 'Nenhum produto encontrado.' });
        }
    } catch (error) {
        console.error('Erro ao obter produtos:', error.message); // Log do erro
        res.status(500).json({ message: 'Erro ao obter produtos', error: error.message });
    } finally {
        if (client) {
            await client.close();
        }
    }
}

async function monitorarProdutos(callback) {
    const uri = process.env.MONGODB_URI;
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

    try {
        await client.connect();
        const database = client.db('supermercado_dados');
        const collection = database.collection('produtos');
        const changeStream = collection.watch();

        changeStream.on('change', (change) => {
            console.log('Alteração detectada nos produtos:', change); // Log da alteração detectada
            callback(change);
        });
    } catch (error) {
        console.error('Erro ao monitorar produtos:', error.message); // Log do erro
    }
}

module.exports = { obterProdutos, monitorarProdutos };
