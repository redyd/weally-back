import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthService, LoginResponse } from './auth.service';
import { LoginDto } from './dto/login-dto';
import { RefreshTokenDto } from './dto/refresh-token-dto';
import { JwtRefreshGuard } from './jwt/JwtRefreshGuard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * Permet à un utilisateur de se connecter.
   *
   * Cette méthode authentifie l'utilisateur avec son email et son mot de passe,
   * puis renvoie les tokens JWT ainsi que les informations de l'utilisateur.
   *
   * Structure de la réponse :
   *
   * {
   *   "tokens": {
   *     "access_token": "votre_access_token",
   *     "refresh_token": "votre_refresh_token"
   *   },
   *   "user": {
   *     "id": nombre,
   *     "email": "votre@email.com",
   *     "username": "votre_username",
   *     "created_at": "2025-12-16T16:48:23.487Z",
   *     "role": "votre_role",
   *     "familyId": nombre
   *   }
   * }
   *
   * @param user Objet contenant les informations de connexion
   *
   * @returns Promise<LoginResponse> contenant les tokens et les informations de l'utilisateur
   */
  @Post('login')
  login(@Body() user: LoginDto): Promise<LoginResponse> {
    return this.authService.login(user.email, user.password);
  }

  /**
   * Permet à un utilisateur de rafraichir ses tokens.
   *
   * Cette méthode va rechercher les informations de l'utilisateur et recrée
   * des tokens.
   *
   * Structure de la réponse :
   *
   * {
   *   "tokens": {
   *     "access_token": "votre_access_token",
   *     "refresh_token": "votre_refresh_token"
   *   },
   *   "user": {
   *     "id": nombre,
   *     "email": "votre@email.com",
   *     "username": "votre_username",
   *     "created_at": "2025-12-16T16:48:23.487Z",
   *     "role": "votre_role",
   *     "familyId": nombre
   *   }
   * }
   * @param token
   */
  @UseGuards(JwtRefreshGuard)
  @Post('refresh')
  refreshToken(@Body() token: RefreshTokenDto): Promise<LoginResponse> {
    return this.authService.refresh(token);
  }
}
