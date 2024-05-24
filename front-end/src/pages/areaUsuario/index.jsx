import React, { useState, useEffect } from "react";
import { MdEmail, MdPersonSearch } from 'react-icons/md';
import { Button } from '../../components/Button';
import { Header } from '../../components/Header';
import Modal from 'react-modal';

import { InputField, Container, Title, Column, Wrapper, PedidoList, ErrorMsg, SelectField } from './styles';

import { useForm, Controller } from "react-hook-form";

Modal.setAppElement('#root');

const AreaUsuario = () => {
    const { control, formState: { errors }, getValues } = useForm({
        reValidateMode: 'onChange',
        mode: 'onChange',
    });

    const [pedidos, setPedidos] = useState([]);
    const [erroCadastro, setErroCadastro] = useState('');
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [usuarioInfo, setUsuarioInfo] = useState({ nome: '', email: '' });
    const [produtos, setProdutos] = useState([]);
    const [produtoSelecionado, setProdutoSelecionado] = useState('');

    useEffect(() => {
        // Obtenha a lista de produtos disponíveis ao carregar a página
        fetch('http://localhost:3001/produtos')
            .then(response => response.json())
            .then(data => setProdutos(data))
            .catch(error => console.error('Erro ao obter produtos:', error));
    }, []);

    

    const handleLoginClick = async () => {
        const { nome, email, dataEntrega } = getValues();
    
        if (!nome || !email || !dataEntrega) {
            console.error('Erro: Todos os campos são obrigatórios.');
            setErroCadastro('Todos os campos são obrigatórios.');
            return;
        }
    
        console.log(`Dados enviados: Nome: ${nome}, Email: ${email}, Data de Entrega: ${dataEntrega}`);
    
        try {
            const response = await fetch(`http://localhost:3001/areaUsuario?usuario=${nome}&email=${email}&dataPedido=${dataEntrega}`);
            if (!response.ok) {
                throw new Error(`Erro ao carregar pedidos: ${response.status}`);
            }
            const data = await response.json();
            if (data.length === 0) {
                alert('Nenhum pedido encontrado para os dados fornecidos.');
            } else {
                setPedidos(data);
                setUsuarioInfo({ nome, email });
                setModalIsOpen(true);
            }
        } catch (error) {
            console.error('Erro ao carregar pedidos:', error);
            alert('Erro ao carregar pedidos. Por favor, tente novamente.');
        }
    };

    const handleDeletePedido = async (pedidoId) => {
        try {
            const response = await fetch(`http://localhost:3001/pedidos/${pedidoId}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                const errorMessage = await response.text();
                throw new Error(`Erro ao excluir pedido: ${errorMessage}`);
            }

            setPedidos(pedidos.filter(pedido => pedido._id !== pedidoId));
        } catch (error) {
            console.error('Erro ao excluir pedido:', error.message);
        }
    };

    const handleDeleteProduto = async (pedidoId, produtoId) => {
        try {
            const response = await fetch(`http://localhost:3001/pedidos/${pedidoId}/produto/${produtoId}`, {
                method: 'DELETE'
            });
    
            if (!response.ok) {
                const errorMessage = await response.text();
                throw new Error(`Erro ao excluir produto do pedido: ${errorMessage}`);
            }
    
            // Atualizar os pedidos para remover o produto excluído
            setPedidos(pedidos.map(pedido => {
                if (pedido._id === pedidoId) {
                    return {
                        ...pedido,
                        itens: pedido.itens.filter(item => item._id !== produtoId)
                    };
                }
                return pedido;
            }));
    
            // Não é necessário excluir o produto do banco de dados aqui
        } catch (error) {
            console.error('Erro ao excluir produto do pedido:', error.message);
        }
    };

        // Função para calcular o valor total da compra
        const calculateTotalCompra = () => {
            return pedidos.reduce((totalPedido, pedido) => {
                return totalPedido + pedido.itens.reduce((totalItem, item) => {
                    return totalItem + (item.quantidade * item.valorUnitario);
                }, 0);
            }, 0);
        };

    const handleEditQuantidade = (pedidoId, produtoId, novaQuantidade) => {
        setPedidos(pedidos.map(pedido => {
          if (pedido._id === pedidoId) {
            return {
              ...pedido,
              itens: pedido.itens.map(item => {
                if (item._id === produtoId) {
                  return { ...item, quantidade: novaQuantidade };
                }
                return item;
              })
            };
          }
          return pedido;
        }));
      };

      const handleSaveChanges = async () => {
        const { nome, email } = usuarioInfo;
    
        const usuarioLogado = {
            nome,
            email,
            userId: 'fa74eb63-cc23-4017-87c6-83860a2306f2' // Defina o userId corretamente aqui
        };
    
        try {
            console.log('Dados enviados para salvar alterações:', { pedidos: pedidos, usuarioLogado });
            const response = await fetch('http://localhost:3001/salvarAlteracoes', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ pedidos: pedidos, usuarioLogado })
            });
    
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`Erro ao salvar alterações: ${errorData.message}`);
            }
    
            const data = await response.json();
            console.log('Alterações salvas com sucesso!', data);
        } catch (error) {
            console.error('Erro ao salvar alterações:', error.message);
        }
    };
    
    

    const formatCurrency = (value) => {
        return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    };

    const calculateTotal = () => {
        return pedidos.reduce((totalPedido, pedido) => {
            const totalPedidoAtual = pedido.itens.reduce((totalItem, item) => {
                return totalItem + (item.quantidade * item.valorUnitario);
            }, 0);
            return totalPedido + totalPedidoAtual;
        }, 0);
    };

    const handleAddProduto = async () => {
        if (!produtoSelecionado) {
            alert('Por favor, selecione um produto.');
            return;
        }
    
        const { nome, email } = getValues(); // Obter o usuário logado
    
        try {
            const responseEstoque = await fetch(`http://localhost:3001/produtos/${produtoSelecionado}`);
            const produtoEstoque = await responseEstoque.json();
    
            if (!produtoEstoque || typeof produtoEstoque !== 'object') {
                throw new Error('Resposta inválida do servidor');
            }
    
            if (produtoEstoque.qty_stock === 0) {
                alert('Produto fora de estoque.');
                return;
            }
    
            const response = await fetch('http://localhost:3001/pedidos/novo-item', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    usuario: nome,
                    produtoId: produtoSelecionado,
                    quantidade: 1
                })
            });
    
            if (!response.ok) {
                throw new Error(`Erro ao adicionar produto ao pedido: ${await response.text()}`);
            }
    
            const updatedPedido = await response.json();
            setPedidos(prevPedidos => {
                // Atualiza a lista de pedidos com o pedido atualizado
                const existingPedido = prevPedidos.find(p => p._id === updatedPedido._id);
                if (existingPedido) {
                    return prevPedidos.map(p => p._id === updatedPedido._id ? updatedPedido : p);
                } else {
                    return [...prevPedidos, updatedPedido];
                }
            });
    
            setProdutoSelecionado('');
        } catch (error) {
            console.error('Erro ao adicionar produto ao pedido:', error);
            alert('Erro ao adicionar produto ao pedido. Por favor, tente novamente.');
        }
    };
    return (
        <>
            <Header />
            <Container>
                <Column>
                    <Wrapper>
                        <form>
                            <Title>Área do Usuário</Title>
                            <Controller
                                name="nome"
                                control={control}
                                render={({ field }) => (
                                    <InputField placeholder="Nome" leftIcon={<MdPersonSearch />} {...field} />
                                )}
                            />

                            <Controller
                                name="email"
                                control={control}
                                render={({ field }) => (
                                    <InputField placeholder="E-mail" leftIcon={<MdEmail />} {...field} />
                                )}
                            />

                            <Controller
                                name="dataEntrega"
                                control={control}
                                render={({ field }) => (
                                    <InputField placeholder="Data de Entrega" type="date" {...field} />
                                )}
                            />

                            {erroCadastro && <ErrorMsg>{erroCadastro}</ErrorMsg>}

                            <div>

                                <Button title="Login" variant="secondary" type="button" onClick={handleLoginClick} />
                            </div>
                            <SelectField
                                    value={produtoSelecionado}
                                    onChange={(e) => setProdutoSelecionado(e.target.value)}
                                >
                                    <option value="">Selecione um produto</option>
                                    {produtos.map((produto) => (
                                        <option key={produto.ID} value={produto.ID}>
                                            {produto.Name} - {formatCurrency(produto.Price)}
                                        </option>
                                    ))}
                                </SelectField>

                            <Button title="Adicionar Produto" variant="primary" type="button" onClick={handleAddProduto} />
                        </form>
                    </Wrapper>

                        <PedidoList style={{ marginBottom: '1.5rem', marginTop: '2.5rem' }}>
                            <h2>Pedidos</h2>
                            {pedidos.map((pedido) => (
                                <div key={pedido._id}>
                                    {pedido.itens.map(item => (
                                        <div key={item._id} style={{ marginBottom: '1rem' }}>
                                            <p>
                                                Produto: {produtos.find(produto => produto._id === item.produto)?.Name} - Quantidade: <input
                                                    type="number"
                                                    value={item.quantidade}
                                                    onChange={(e) => handleEditQuantidade(pedido._id, item._id, parseInt(e.target.value))}
                                                /> - Preço Unitário: {formatCurrency(item.valorUnitario)}
                                            </p>
                                            <button onClick={() => handleDeleteProduto(pedido._id, item._id)}>Excluir Produto</button>
                                        </div>
                                    ))}
                                </div>
                            ))}
                            {/* Exibição do Valor Total da Compra */}
                            <h2>Valor Total da Compra: {formatCurrency(calculateTotalCompra())}</h2>
                        </PedidoList>
                    <Button title="Salvar Alterações" variant="primary" type="button" onClick={handleSaveChanges} />
                </Column>
            </Container>
            
            <Modal
                isOpen={modalIsOpen}
                onRequestClose={() => setModalIsOpen(false)}
                contentLabel="Login Feito com Sucesso"
                style={{
                    content: {
                        top: '50%',
                        left: '50%',
                        right: 'auto',
                        bottom: 'auto',
                        color: 'black',
                        marginRight: '-50%',
                        transform: 'translate(-50%, -50%)',
                        fontFamily: '"Open Sans", sans-serif'
                    },
                }}
            >
                <h2>Login feito com sucesso!</h2>
                <p style={{ marginTop: '0.5rem' }}>Nome: {usuarioInfo.nome}</p>
                <p style={{ marginTop: '0.5rem', marginBottom: '1rem' }}>Email: {usuarioInfo.email}</p>

                <Button title="Fechar" variant="secondary" type="button" onClick={() => setModalIsOpen(false)} />
            </Modal>
        </>
    );
};

export default AreaUsuario;