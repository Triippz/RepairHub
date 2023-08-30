import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { HeaderAPIKeyStrategy as Strategy } from 'passport-headerapikey';
import { AuthService } from '../auth.service';

@Injectable()
export class ApiKeyStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super(
      { header: 'x-api-key', prefix: '' },
      true,
      async (apiKey: string, done, req) => {
        const maybeUser = await this.authService.validateApiKey(apiKey);
        if (maybeUser) {
          return done(null, maybeUser);
        }

        return done(null, false);
      },
    );
  }
}
