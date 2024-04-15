const express = require("express");
const helmet = require("helmet");
const cluster = require("cluster");
let os = require("os");
const cors = require("cors");
const { pid } = require("process");
const fs = require("fs");
const ngrok = require("ngrok");
const http = require("http");
const numCPUs = os.cpus().length;
const server = express();
require("dotenv").config();
const PORT = process.env.PORT || 8080;

const mainRouter = require("./routes/mainRouter");

const establishConnection = require("./initializeConnection.js");
// const { generateKey } = require('crypto');
const { generateKey } = require('./RSA/keyGen.js');
const reInitDatabase = require("./schema/reInitDatabase");

server.use(helmet());
server.use(express.json());
server.use(cors());
server.disable("x-powered-by");
const bodyParser = require('body-parser');
server.use(bodyParser.json({ limit: '50mb' }));

server.use("/api", mainRouter);

if (cluster.isPrimary) {
  console.log(`[MESSAGE]: Primary ${process.pid} is running`);
  db = establishConnection();

  const initializeOne = () => {
    if (fs.existsSync('./middleware/RSA/public_key.pem') && (fs.existsSync('./middleware/RSA/private_key.pem'))) {
      console.log(`[MESSAGE]: RSA keys already exist`);
    } else {
      generateKey();
    }
    console.log('[MESSAGE]: Initialization Step 1 Complete');
  }
  initializeOne();
  // const initializeTwo = () => {
  //     reInitDatabase(db[0]);
  //     console.log('[MESSAGE]: Initialization Step 2 Complete');
  // }

  // initializeOne(); // Run only once in production
  // initializeTwo(); // Run only once in production

  reInitDatabase(db);
  console.log(`[MESSAGE]: Forking for ${numCPUs} CPUs`);

  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on("exit", (worker, code, signal) => {
    console.log(`[MESSAGE]: Worker ${worker.process.pid} died`);
  });

  // Start Ngrok
  (async () => {
    try {
      const url = await ngrok.connect({
        addr: PORT,
        authtoken: process.env.NGROK_AUTH_TOKEN,
      });
      console.log(`[MESSAGE]: Ngrok tunnel is live at ${url}`);
    } catch (error) {
      console.error(`[ERROR]: Ngrok connection failed - ${error}`);
    }
  })();

} else {
  server.listen(PORT, (err) => {
    if (err) {
      console.log(`[ERROR]: ${err}`);
    } else {
      console.log(`[MESSAGE]: Process ${pid} listening on PORT ${PORT}`);
    }
  });
}
