import amqp from "amqp";

export default function amqpMiddleware(req, res, next) {
  res.amqp = {};

  const amqpConnection = amqp.createConnection({
    host: "localhost",
    port: 5672,
    login: "guest",
    password: "guest",
    connectionTimeout: 10000,
    authMechanism: "AMQPLAIN",
    vhost: "/",
    noDelay: true,
    ssl: {
      enabled: false
    }
  });

  amqpConnection.on("error", e => {
    console.error("Error from AMQP : ", e);
  });

  amqpConnection.on("ready", () => {
    console.log("AMQP Server Connected");

    const exchangeOpts = {
      type: "topic",
      durable: true,
      confirm: true
    };

    const exchangeCb = () => {
      console.log("AMQP Exchange Connected");

      next();
    };

    res.amqp.exchange = amqpConnection.exchange(
      "test-exchange",
      exchangeOpts,
      exchangeCb
    );
  });
}
