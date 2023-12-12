~~Leilão Virtual~~

~~Esta avaliação consiste em finalizar os apps auctions-api e auctioneer-app (presentes no repositório da disciplina), além de criar o app auctions-app.~~

~~A seguir, é descrito o que deve ser implementado em cada app.~~

~~**1 - Implementação do app auctioneer-app (App do Leiloeiro)**~~

~~Este app deve possuir as seguintes funcionalidades e recursos:~~

~~Criação/início de um novo leilão, informando o seu título, descrição, valor do lance inicial, uma foto do produto e prazo máximo em minutos da duração do leilão;~~

~~Acompanhamento de um leilão após o seu início, informando a listagem de lances recebidos. Caso o tempo de duração do leilão alcance o seu prazo, o leilão deve ser automaticamente finalizado e deve ser informado automaticamente quem foi o participante vencedor, tanto ao leiloeiro quanto a todos os participantes do leilão. Caso o leilão fique 30 segundos sem receber um lance, o leilão deve ser finalizado. Neste caso, se nenhum lance tiver sido recebido, tanto o leiloeiro quanto todos os participantes do leilão devem ser notificados com uma mensagem avisando que o leilão foi cancelado. Porém, se houve ao menos um lance antes da pausa de 30 segundos, então o participante que deu o maior lance no leilão deve ser o vencedor e tanto o leiloeiro quanto todos os participantes devem ser notificados quanto ao vencedor do leilão;~~

~~A página de visualização do leilão deve ter um botão para retornar à página inicial, botão este que só deve ser exibido quando o leilão for finalizado ou cancelado;~~

~~Por fim, a página inicial deve exibir uma lista com o histórico dos leilões já realizados, informando o seu título, um ícone com a foto do produto, sua descrição e a situação do leilão (finalizado caso o leilão tenha sido finalizado com sucesso, exibindo também o valor do lance do participante vencedor; ou cancelado, no caso do leilão ter sido cancelado por falta de lances).~~

~~**2 - Implementação do app auctions-api (API do Leilão Virtual)**~~

~~Este app deve possuir as seguintes funcionalidades e recursos:~~

~~Um banco de dados para manter o histórico dos leilões realizados, onde para cada leilão devem ser mantidos os seguintes dados: id (chave primária), data/horário de criação, data/horário de finalização, título, descrição, URL da foto do produto, valor do lance inicial, valor do maior lance recebido, nome do participante do maior lance recebido e situação do leilão (em andamento caso o leilão ainda não tiver sido finalizado, finalizado caso o leilão tenha sido finalizado com sucesso ou cancelado caso ele tenha sido cancelado por falta de lances). Utilize o SQLite como SGBD;~~

~~O endpoint GET /auctions que retorna o histórico dos leilões realizados, do mais recente ao mais antigo;~~

~~O endpoint GET /auctions/:id que retorna os dados do leilão cuja chave primária seja igual a :id;~~

~~Adicionar os seguintes eventos de websocket necessários para:~~

~~Notificar todos os participantes sobre o participante vencedor, quando o leilão for finalizado, informando  o participante e o lance vencedor;~~

~~Notificar todos os participantes sobre o cancelamento do leilão, quando isto ocorrer;~~

~~Os eventos de websocket devem fazer as devidas manipulações no banco de dados, quando pertinente.~~

**3 - Implementação do app auctions-app (App do Participante do Leilão Virtual)**

Este app deve conter as seguintes funcionalidades e recursos:

Caso haja algum leilão ocorrendo, a página inicial do app deve exibir os dados do leilão (título, descrição, foto do produto, maior lance atual e tempo restante para finalização do leilão), além de um botão para que o participante possa entrar e participar dele. Caso não haja nenhum leilão ocorrendo no momento, deve ser exibida uma mensagem para notificar tal fato;

Ao clicar para participar de um leilão, o participante deve ser encaminhado para uma página pela qual ele poderá acompanhar o andamento do leilão, além de poder dar um lance nele. O valor do lance deve ser pelo menos R$ 10 superior ao valor do maior lance atual do produto. Lembrando (conforme visto em aula) que ao se enviar um lance por meio do evento sendNewMessage, deve ser preenchido e enviado um objeto do tipo Bid, o qual deve conter o nome do participante, o valor do lance e o id do leilão. Após a finalização ou cancelamento do leilão, o participante não pode enviar um novo lance no leilão (sugestão: desabilite ou faça desaparecer o formulário de envio de novo lance);

Quando o leilão for finalizado ou cancelado, o participante deve ser exibido sobre tal fato. No caso de finalização, ele deve ser notificado a respeito do participante vencedor do leilão, assim como o valor do lance que arrematou o produto. No caso de cancelamento, o participante deve ser notificado sobre tal fato;

A página de acompanhamento do leilão deve ter um botão para retornar à página inicial, botão este que só deve ser exibido quando o leilão for finalizado ou cancelado;

Crie um único repositório no Github contendo os 3 projetos implementados nesta avaliação. Envie o link do repositório exclusivamente aqui pelo Moodle até as 23:59 do dia 12/12/2023. Esta avaliação deve ser realizada invidualmente ou em dupla. Caso seja realizada em dupla, informe os nomes dos membros da dupla na submissão. Esta avaliação vale até 10 pontos.