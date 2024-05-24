import React, { useState, useEffect } from "react";
import { MdEmail, MdPersonSearch } from 'react-icons/md';
import { Button } from '../../components/Button';
import { Header } from '../../components/Header';
import Modal from 'react-modal';
import moment from 'moment';
import { v4 as uuidv4 } from 'uuid';

import { InputField, SelectField, Container, Title, Column, SubtitleLogin, Wrapper, PedidoList, ErrorMsg } from './styles';

import { useForm, Controller } from "react-hook-form";

Modal.setAppElement('#root');

const Pedido = () => {
    const { control, formState: { errors }, reset, getValues } = useForm({
        reValidateMode: 'onChange',
        mode: 'onChange',
    });

    const [produtos, setProdutos] = useState([]);
    const [pedidos, setPedidos] = useState([]);
    const [erroCadastro, setErroCadastro] = useState('');
    const [novoPedido, setNovoPedido] = useState({ produto: '', quantidade: '', preco: 0 });
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [usuarioInfo, setUsuarioInfo] = useState({ nome: '', email: '' });
    const [pedidoInfo, setPedidoInfo] = useState({ nome: '', email: '', dataPedido: '' });

    useEffect(() => {
        const fetchProdutos = async () => {
            try {
                const response = await fetch('http://localhost:3001/produtos');
                if (!response.ok) {
                    throw new Error(`Erro ao carregar produtos: ${response.status}`);
                }
                const data = await response.json();
                setProdutos(data);
            } catch (error) {
                console.error('Erro ao carregar produtos:', error);
            }
        };

        fetchProdutos();
    }, []);

    const adicionarPedido = () => {
        if (novoPedido.produto && novoPedido.quantidade) {
            const produto = produtos.find(item => item.ID === parseInt(novoPedido.produto));
            if (produto) {
                if (produto.qty_stock < novoPedido.quantidade) {
                    alert('Quantidade insuficiente no estoque');
                    return;
                }
                setPedidos([...pedidos, { ...novoPedido, preco: produto.Price }]);
                setNovoPedido({ produto: '', quantidade: '', preco: 0 });
            }
        } else {
            console.error('Erro: Produto e quantidade são obrigatórios.');
        }
    };

    const handleMakeOrderClick = async () => {
        const { nome, email } = getValues();
    
        if (!nome || !email) {
            console.error('Erro: Todos os campos são obrigatórios.');
            setErroCadastro('Todos os campos são obrigatórios.');
            return;
        }
    
        if (pedidos.length === 0) {
            console.error('Erro: Deve haver pelo menos um pedido.');
            setErroCadastro('Deve haver pelo menos um pedido.');
            return;
        }
    
        const pedidoData = {
            usuario: nome,
            email: email,
            pedidos: pedidos
        };
    
        try {
            const response = await fetch('http://localhost:3001/cadastroPedido', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(pedidoData)
            });
            if (!response.ok) {
                const errorMessage = await response.text();
                throw new Error(`Erro ao enviar pedido: ${errorMessage}`);
            }
            const data = await response.json();
            console.log('Pedido cadastrado com sucesso!', data);
    
            reset();
            setPedidos([]);
            setUsuarioInfo({ nome, email, userId: data.userId });
            setPedidoInfo({ ...pedidoData, nome, email });
            setModalIsOpen(true);

            // Atualizar o estoque localmente
            setProdutos(produtos.map(produto => {
                const pedido = pedidos.find(p => p.produto === produto.ID.toString());
                if (pedido) {
                    return { ...produto, qty_stock: produto.qty_stock - pedido.quantidade };
                }
                return produto;
            }));
        } catch (error) {
            console.error('Erro ao enviar pedido:', error.message);
            setErroCadastro(error.message);
        }
    };

    const handleDelete = (index) => {
        const updatedPedidos = [...pedidos];
        updatedPedidos.splice(index, 1);
        setPedidos(updatedPedidos);
    };

    const handleQuantityChange = (index, quantidade) => {
        const updatedPedidos = [...pedidos];
        updatedPedidos[index].quantidade = quantidade;
        setPedidos(updatedPedidos);
    };

    const getProductName = (productId) => {
        const produto = produtos.find(item => item.ID === parseInt(productId));
        return produto ? produto.Name : 'Produto não encontrado';
    };

    const calculateTotal = () => {
        return pedidos.reduce((total, pedido) => total + (pedido.preco * pedido.quantidade), 0);
    };

    const formatCurrency = (value) => {
        return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    };

    return (
        <>
            <Header />
            <Container>
                <Column>
                    <Title>Faça hoje mesmo o seu pedido! e receba no conforto de sua casa</Title>
                </Column>
                <Column>
                    <Wrapper>
                        <form>
                            <SubtitleLogin>Usuário:</SubtitleLogin>
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

                            {erroCadastro && <ErrorMsg>{erroCadastro}</ErrorMsg>}

                            <div>
                                <SubtitleLogin style={{ marginTop: '2rem' }}>Pedido:</SubtitleLogin>
                                <Controller
                                    name="produto"
                                    control={control}
                                    rules={{ required: true }}
                                    render={({ field }) => (
                                        <SelectField {...field} value={novoPedido.produto} onChange={(e) => setNovoPedido({ ...novoPedido, produto: e.target.value })}>
                                            <option value="">Selecione um produto</option>
                                            {produtos.map(produto => (
                                                <option key={produto.ID} value={produto.ID}>{produto.Name}</option>
                                            ))}
                                        </SelectField>
                                    )}
                                />
                                {errors.produto && <ErrorMsg>Produto é obrigatório</ErrorMsg>}
                            </div>

                            <Controller
                                name="quantidade"
                                control={control}
                                rules={{ required: true }}
                                render={({ field }) => (
                                    <InputField placeholder="Quantidade" type="number" {...field} value={novoPedido.quantidade} onChange={(e) => setNovoPedido({ ...novoPedido, quantidade: e.target.value })} />
                                )}
                            />
                            {errors.quantidade && <ErrorMsg>Quantidade é obrigatória</ErrorMsg>}

                            <Button title="Adicionar Pedido" variant="secondary" type="button" onClick={adicionarPedido} />
                            
                        </form>
                    </Wrapper>

                    <PedidoList style={{ marginBottom: '1.5rem', marginTop: '2.5rem' }}>
                        <h2>Pedidos</h2>
                        {pedidos.map((pedido, index) => (
                            <div key={index}>
                                <p style={{ marginTop: '1rem' }}>
                                    {getProductName(pedido.produto)} - Quantidade:
                                    <input
                                        type="number"
                                        value={pedido.quantidade}
                                        onChange={(e) => handleQuantityChange(index, parseInt(e.target.value))}
                                        style={{ width: '50px', margin: '0 10px' }}
                                    />
                                    - Preço Unitário: {formatCurrency(pedido.preco)} - Total: {formatCurrency(pedido.preco * pedido.quantidade)}
                                </p>
                                <button onClick={() => handleDelete(index)}>Excluir</button>
                            </div>
                        ))}
                        <h3>Total da Compra: {formatCurrency(calculateTotal())}</h3>
                    </PedidoList>
                    <Button title="Fazer Pedido" variant="secondary" type="button" onClick={handleMakeOrderClick} />
                </Column>
            </Container>
            
            <Modal
                isOpen={modalIsOpen}
                onRequestClose={() => setModalIsOpen(false)}
                contentLabel="Pedido Feito com Sucesso"
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
                <h2>Pedido feito com sucesso!</h2>
                <p style={{ marginTop: '0.5rem' }}>Nome: {usuarioInfo.nome}</p>
                <p style={{ marginTop: '0.5rem', marginBottom: '1rem' }}>Email: {usuarioInfo.email}</p>

                <p style={{ marginTop: '0.5rem', marginBottom: '1rem' }}>Data do Pedido: {moment(pedidoInfo.dataPedido).format('DD/MM/YYYY')}</p>

                <Button title="Ir para área do usuário" variant="secondary" type="button" onClick={() => { window.location.href = 'http://localhost:3000/areaUsuario'; setModalIsOpen(false); }} />
                <Button title="Fechar" variant="secondary" type="button" onClick={() => setModalIsOpen(false)} />
            </Modal>
        </>
    );
};

export { Pedido };