import React, { useState, useEffect } from 'react';
import { Header } from '../../components/Header';
import { Container, Title, Table, TableHeader, TableBody, TableRow, TableCell } from './styles';
import axios from 'axios'; // Importe o axios para fazer requisições HTTP

const Estoque = () => {
  const [produtos, setProdutos] = useState([]);

  const fetchProdutos = async () => {
    try {
      const response = await axios.get('http://localhost:3001/produtos');
      const sortedProdutos = response.data.sort((a, b) => a.ID - b.ID);
      console.log('Produtos obtidos do back-end:', sortedProdutos); // Log dos produtos obtidos
      setProdutos(sortedProdutos);
    } catch (error) {
      console.error('Erro ao buscar produtos:', error); // Log do erro
    }
  };

  useEffect(() => {
    fetchProdutos();
  }, []);

  // Função para formatar o preço em reais
  const formatarPreco = (preco) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(preco);
  };

  return (
    <>
      <Header />
      <Container>
        <Title>Estoque de Produtos</Title>
        <Table>
          <TableHeader>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Nome</TableCell>
              <TableCell>Preço</TableCell>
              <TableCell>Quantidade em Estoque</TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {produtos.map(produto => (
              <TableRow key={produto.ID}>
                <TableCell>{produto.ID}</TableCell>
                <TableCell>{produto.Name}</TableCell>
                <TableCell>{formatarPreco(produto.Price)}</TableCell>
                <TableCell>{produto.qty_stock}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Container>
    </>
  );
};

export default Estoque;
