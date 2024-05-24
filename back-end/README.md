Este é o back-end do projeto de um sistema que gerencia um banco de dados de produtos. Para executá-lo, utilize o comando node app.js ou nodemon app.js. Antes disso, é necessário realizar npm install para instalar todas as suas dependências, que são:

"dependencies": {
 "cors": "^2.8.5",
 "dotenv": "^16.4.5",
 "express": "^4.19.2",
 "mongodb": "^6.6.2",
 "mongoose": "^8.4.0",
 "uuid": "^9.0.1"
 }

Embora o projeto esteja funcional, houve alguns problemas relacionados ao banco de dados que ainda estão sendo investigados. No entanto, a cada novo cadastro, um novo usuário é criado na coleção de pedidos. Este usuário possui informações como nome, email e uma data de criação, que é usada para acessar a área do usuário e visualizar os pedidos cadastrados.

Um desafio que estou enfrentando é na parte de exclusão de produtos do banco de dados. Atualmente, consigo salvar novos itens no array de produtos do usuário e criar um novo objeto. No entanto, estou tendo dificuldades para implementar a exclusão. Planejo refatorar o código em breve para melhorar a estrutura dos modelos (models) e controladores (controllers), o que deve facilitar a resolução desse problema.

Desenvolvido por Victor Govedice.

 website: https://victorgovedice.vercel.app/about
 whatsapp: https://wa.me/5511941881298
 linkedin: https://www.linkedin.com/in/victorgovedice/
 instagram: https://www.instagram.com/victorhugoakw/

 Let's go 🚀🚀