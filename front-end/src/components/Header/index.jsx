import React from 'react';
import { Link } from 'react-router-dom'; // Importe Link para criar links na aplicação
import logo from '../../assets/carrefour.png';

import { Container, Wrapper, BuscarInputContainer, Input, Row, Menu} from './styles';

const Header = ({ autenticado }) => {
  return (
    <Wrapper>
      <Container>
          <Row>
            <Link to="/pedido"> {/* Use Link ao invés de 'a' para manter a navegação SPA */}
              <img src={logo} alt="Logo da dio" />
            </Link>
            {autenticado ? (
              <>
               <BuscarInputContainer>
                <Input placeholder='Buscar...'/>
               </BuscarInputContainer>
                <Menu>Live Code</Menu>
                <Menu>Global</Menu>
              </>
            ) : null}
          </Row>
      </Container>
    </Wrapper>
  )
}

export { Header };