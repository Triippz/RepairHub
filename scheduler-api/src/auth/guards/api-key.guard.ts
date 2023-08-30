import { AuthGuard } from '@nestjs/passport';

export class ApiKeyGuard extends AuthGuard('headerapikey') {}