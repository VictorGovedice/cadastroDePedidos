import { useNavigate  } from "react-router-dom";
import bannerImage from '../../assets/app-online.png'

import { Button } from '../../components/Button';

import { Header } from '../../components/Header';

import { Container, Title, TitleHighlight, TextContent } from './styles';

const Home = () => {

    const navigate = useNavigate();

    const handleClickSignIn = () => {
        navigate('/pedido')
    }

    return (<>
        <Header />
        <Container>
            <div>
                <Title>
                    <TitleHighlight>
                        Implemente <br />
                    </TitleHighlight>
                o seu futuro agora!</Title>
                <TextContent>Faça seus pedidos online sem sair de casa e aproveite todas as vantagens! Oferecemos entrega rápida,
                    com segurança garantida e rastreamento do pedido. Receba sua compra em até 24 horas no conforto do seu lar. Não perca tempo, faça seu pedido agora mesmo!</TextContent>
                <Button title="Começar agora" variant="secondary" onClick={handleClickSignIn}/>
            </div>
            <div>
                <img src={bannerImage} alt="Imagem principal do site." />
            </div>
        </Container>
    </>)
}

export { Home }