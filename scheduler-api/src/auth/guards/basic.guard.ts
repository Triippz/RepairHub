import { AuthGuard } from '@nestjs/passport';

export class BasicGuard extends AuthGuard('basic') {}