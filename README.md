Sistema de Gerenciamento de Produtos


Este projeto consiste em um sistema completo para gerenciar um banco de dados de produtos, incluindo um front-end desenvolvido em React e um back-end em Node.js com Express e MongoDB.

Descrição
O front-end deste sistema permite a interação do usuário com funcionalidades como cadastro, realização de pedidos e gerenciamento de itens. Desenvolvido em React, ele prioriza a performance para garantir uma experiência fluida.

Instalação
Para executar este projeto localmente, siga os passos abaixo:

Pré-requisitos: Certifique-se de ter o Node.js instalado em sua máquina.
Clone o repositório:

Clone o repositório:
git clone [URL do repositório]

Navegue até o diretório do projeto:
cd nome-do-diretorio

Instale as dependências:
npm install

Inicie o servidor local:
npm start

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
Página inicial (home): Com botão para acessar a página de pedidos.
Página de pedidos (/pedidos): Cadastro de usuário e realização de pedidos.
Área do usuário (/areaUsuario): Gerenciamento de itens (adição e exclusão).
Área do Estoque (/estoque): Visualização dos produtos em estoque.

Comentários do Desenvolvedor
No front-end, priorizei a performance para evitar travamentos e garantir uma experiência de usuário otimizada. A página inicial leva à página de pedidos, onde os usuários podem se cadastrar e fazer pedidos. Na área do usuário, é possível adicionar e excluir produtos, embora haja um problema ao excluir produtos já presentes no array de itens do usuário, que estou resolvendo.


------------------------------------------------------------------------------

Back-end

Descrição:
O back-end deste sistema gerencia a lógica de negócios e a persistência de dados, utilizando Node.js, Express e MongoDB. Ele lida com a criação de usuários, pedidos e gerenciamento do banco de dados.

Instalação
Para executar o back-end localmente, siga os passos abaixo:

Pré-requisitos: Certifique-se de ter o Node.js instalado em sua máquina.

Clone o repositório:
git clone [URL do repositório]

Navegue até o diretório do projeto:
cd nome-do-diretorio

Instale as dependências:
npm install

Inicie o servidor:
node app.js

Ou, para reinicialização automática ao salvar alterações:
nodemon app.js

"dependencies": {
  "cors": "^2.8.5",
  "dotenv": "^16.4.5",
  "express": "^4.19.2",
  "mongodb": "^6.6.2",
  "mongoose": "^8.4.0",
  "uuid": "^9.0.1"
}

Comentários do Desenvolvedor
Embora o projeto esteja funcional, estou investigando alguns problemas relacionados ao banco de dados, especialmente na exclusão de produtos. Planejo refatorar o código para melhorar a estrutura dos modelos e controladores, o que deve facilitar a resolução desses problemas.


Desenvolvido por Victor Govedice

 website: https://victorgovedice.vercel.app/about
 whatsapp: https://wa.me/5511941881298
 linkedin: https://www.linkedin.com/in/victorgovedice/
 instagram: https://www.instagram.com/victorhugoakw/

Let's go 🚀🚀
