Descrição:

Este projeto é o front-end de um sistema que gerencia um banco de dados de produtos. Ele foi desenvolvido utilizando React (Javascript) e possui funcionalidades como cadastro de usuário, realização de pedidos e gerenciamento de itens por parte do usuário.

Instalação
Para executar este projeto localmente, siga os passos abaixo:

Certifique-se de ter o Node.js instalado em sua máquina.
Clone este repositório para o seu ambiente local.
Navegue até o diretório do projeto no terminal.
Execute o comando npm install para instalar todas as dependências.
Após a instalação das dependências, execute o comando npm start para iniciar o servidor local.
O projeto estará disponível no seu navegador no endereço http://localhost:3000.

"dependencies": {
 "@testing-library/jest-dom": "^5.16.5",
 "@testing-library/react": "^13.4.0",
 "@testing-library/user-event": "^13.5.0",
 "axios": "^1.1.3",
 "moment": "^2.30.1",
 "react": "^18.2.0",
 "react-dom": "^18.2.0",
 "react-hook-form": "^7.38.0",
 "react-icons": "^4.6.0",
 "react-modal": "^3.16.1",
 "react-router-dom": "^6.4.2",
 "react-scripts": "5.0.1",
 "styled-components": "^5.3.6",
 "uuid": "^9.0.1",
 "web-vitals": "^2.1.4"
 }

Funcionalidades
Página inicial (home) com botão para acessar a página de pedidos.
Página de pedidos (/pedidos) para cadastro de usuário e realização de pedidos.
Área do usuário (/areaUsuario) para gerenciamento de itens (exclusão e adição).
Área do Estoque (/estoque) para ver os produtos em estoque

No front-end não tive nenhum problema, pois é a parte que mais domino de um sistema hahah, pois comecei como front-end, então a parte que mais domino sempre penso em deixar sempre boa, pensei sempre na performance do sistema para não ter problema de travar, porque as duas partes são muito importante quando o front-end quanto o back-end pois não adianta ter algum bonito que não tem função e ter algo feio com varias funções, pois o que nos compramos é o que vemos.

No front-end tem a pagina home que é a primeira tela, ao clicar no botão irá para a parte de /pedidos que é aonde o usuario ira fazer o primeiro contato com o cadastro do usuario e fazer seu pedido, todos os itens são cadastros enviados para o back-end aonde é feito a exclusão do valor escolhido por item pelo cliente e é descontado do qty_stock, depois temos a /areaUsuario, na qual o usuario pode excluir um produto ja na lista e tambem adicionar um novo, estou tendo problema ao excluir quando o produto ja esta no array de obejeto de itens do usuario, vou resolver isso.

 Desenvolvido por Victor Govedice

 website: https://victorgovedice.vercel.app/about
 whatsapp: https://wa.me/5511941881298
 linkedin: https://www.linkedin.com/in/victorgovedice/
 instagram: https://www.instagram.com/victorhugoakw/

 Let's go 🚀🚀