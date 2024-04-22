import winston from "winston";

const prod = process.env.NODE_ENV === "production";

const logger = winston.createLogger({
  level: prod ? "info" : "debug",
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: "error.log", level: "error" }),
    new winston.transports.File({ filename: "combined.log" }),
  ],
});

if (!prod) {
  logger.add(
    new winston.transports.Console({
      format: winston.format.simple(),
    })
  );
}

export default logger;
