import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import {
    FastifyAdapter,
    NestFastifyApplication,
} from "@nestjs/platform-fastify";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { apiReference } from "@scalar/nestjs-api-reference";
import { ValidationPipe } from "@nestjs/common";

async function bootstrap() {
    const app = await NestFactory.create<NestFastifyApplication>(
        AppModule,
        new FastifyAdapter(),
    );

    const documentBuilder = new DocumentBuilder()
        .setTitle("")
        .setDescription("")
        .setVersion("")
        .build();

    const documentFactory = SwaggerModule.createDocument(app, documentBuilder);
    /* use the commented code bellow to use swagger documentation */
    // SwaggerModule.setup("api", app, documentFactory);

    const scalarConfig = apiReference({
        url: "/api-spec.json",
        withFastify: true,
        content: documentFactory,
    });

    const validationPipe = new ValidationPipe({ transform: true });

    app.use("/api", scalarConfig);
    app.useGlobalPipes(validationPipe);

    await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
