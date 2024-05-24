const { MongoClient } = require('mongodb');

async function obterProdutos(req, res) {
    let client;

    try {
        const uri = process.env.MONGODB_URI;
        client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
        await client.connect();
        const database = client.db('supermercado_dados');
        const collection = database.collection('produtos');
        const produtos = await collection.find({}).toArray();

        if (produtos.length > 0) {
            res.status(200).json(produtos);
        } else {
            res.status(404).json({ message: 'Nenhum produto encontrado' });
        }
    } catch (error) {
        console.error('Erro ao obter produtos:', error);
        res.status(500).json({ message: 'Erro ao obter produtos' });
    } finally {
        if (client) {
            await client.close();
        }
    }
}

module.exports = { obterProdutos };
