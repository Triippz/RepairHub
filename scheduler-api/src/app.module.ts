import {Logger, Module} from '@nestjs/common';
import {AuthModule} from "./auth/auth.module";
import {UsersModule} from "./users/users.module";
import {AppointmentsModule} from "./appointments/appointments.module";
import {SvcTechModule} from "./service_technicians/svc-tech.module";
import { PrismaModule, loggingMiddleware } from 'nestjs-prisma';
import { ThrottlerModule } from '@nestjs/throttler';

import {ThrottlerBehindProxyGuard} from "./common/guards/throttle-behind-proxy.guard";
import {APP_GUARD} from "@nestjs/core";

@Module({
  imports: [
      PrismaModule.forRoot({
          isGlobal: true,
          prismaServiceOptions: {
              middlewares: [
                  // configure your prisma middleware
                  loggingMiddleware({
                      logger: new Logger('PrismaMiddleware'),
                      logLevel: 'log',
                  }),
              ],
          },
      }),
      ThrottlerModule.forRoot({
          ttl: 60,
          limit: 50,
      }),
      AuthModule,
      UsersModule,
      AppointmentsModule,
      SvcTechModule
  ],
  controllers: [],
    providers: [
        {
            provide: APP_GUARD,
            useClass: ThrottlerBehindProxyGuard,
        },
    ],
})
export class AppModule {}
