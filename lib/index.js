import express from "express";
import amqpMiddleware from "./middlewares/amqp";

const app = express();

app.use(amqpMiddleware);

app.get("/", (req, res) => {
  if (res.amqp.exchange) {
    const exchangeOpts = {
      durable: true
    };

    const confirmCb = confirm => {
      if (confirm === false) {
        console.log("publish confirmed");
      } else {
        console.error(confirm);
      }
    };

    res.amqp.exchange.publish("task", "Hello World", exchangeOpts, confirmCb);
  }

  res.send("Hello World");
});

app.listen(3000);
