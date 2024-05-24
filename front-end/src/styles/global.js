import { createGlobalStyle } from 'styled-components'
import usersImg from '../assets/users-img.png'; 

export const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
  }
  
  body {
    background-color: #1E192C;
    color: #FFFFFF;
    background-image: url(${usersImg});
    background-size: cover; /* Ajusta o tamanho da imagem para cobrir todo o container */
    background-repeat: no-repeat; /* Evita a repetição da imagem */
  }
`;