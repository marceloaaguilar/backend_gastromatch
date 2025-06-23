const amqplib = require('amqplib');

let channel;

async function handleMessage(ws, data) {
  try {
    const messageObject = JSON.parse(data.toString());

    const routingKey = `chat_messages`;

    const message =  messageObject && messageObject.message;

    await publishToQueue(routingKey, {
      chatId: messageObject.chatId,
      message: message,
      from: messageObject.from,
      to: messageObject.to,
      timestamp: new Date().toISOString()
    });


    ws.send(JSON.stringify({
      status: 'ok',
      echo: messageObject.message,
      routingKey
    }));

  } catch (err) {
    console.error("Erro ao processar mensagem:", err.message);
    ws.send(JSON.stringify({ error: "Mensagem inválida" }));
  }
}

async function connectToRabbitMQ() {
  try {
    const connection = await amqplib.connect(process.env.RABBITMQ_URL);
    channel = await connection.createChannel();
  } catch(error) {
    console.log("erro ao conectar ao rabbitmq: " + error)
  }
}

async function publishToQueue(queue, message) {
  if (!channel) {
    await connectToRabbitMQ();
  }

  await channel.assertQueue(queue, {durable: true});
  channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)), {
    persistent: true
  });

}

module.exports = handleMessage;
