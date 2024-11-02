namespace Onboarding.Server.Services.Interfaces;

public interface IJwtTokenService
{
    bool TokenHasExpired(string jwtToken);
}