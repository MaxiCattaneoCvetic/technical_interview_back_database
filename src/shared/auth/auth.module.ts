import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthGuard } from './auth.guard';


@Module({
    imports: [
        JwtModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: async (configService: ConfigService) => ({
                global: true,
                secret: configService.get<string>('JWT_SECRET'),
                signOptions: {
                    expiresIn: '60s',
                },
            }),
        }),


    ],
    providers: [

        {
            provide: 'AuthGuard',
            useClass: AuthGuard,
        }
    ],
    exports: [
        JwtModule,
        {
            provide: 'AuthGuard',
            useClass: AuthGuard,
        }
    ]
})
export class AuthModule { }