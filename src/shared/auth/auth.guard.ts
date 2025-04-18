import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const token = this.extractTokenFromHeader(request);
        const apiKey = this.extractApiKey(request);
        const secret = this.configService.get<string>('JWT_SECRET');
        const validApiKey = this.configService.get<string>('API_KEY');
       
        if (apiKey && apiKey === validApiKey) {
            return true;
        }

       
        if (!token) {
            throw new UnauthorizedException('No authentication provided');
        }

        try {
            const payload = await this.jwtService.verifyAsync(token, {
                secret: secret
            });
            request['user'] = payload;
            return true;
        } catch {
            throw new UnauthorizedException('Invalid token');
        }
    }

    private extractTokenFromHeader(request: Request): string | undefined {
        const [type, token] = request.headers.authorization?.split(' ') ?? [];
        return type === 'Bearer' ? token : undefined;
    }

    private extractApiKey(request: Request): string | undefined {
        return request.headers['x-api-key'] as string;
    }
}
