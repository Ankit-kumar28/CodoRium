import app from "./app.js";
import { env } from "./config/env.js";
import { verifyEmailConnection } from "./services/email/email.service.js";

async function startServer() {
  console.log(
    "🔄 Initializing CodoRium backend..."
  );

  try {
    await verifyEmailConnection();  

    app.listen(
      env.PORT,
      () => {
        console.log(
          `🚀 CodoRium backend running on port ${env.PORT}`
        );
      }
    );
  } catch (error) {
    console.error(
      "❌ Failed to initialize server"
    );

    console.error(error);

    process.exit(1);
  }
}

startServer();