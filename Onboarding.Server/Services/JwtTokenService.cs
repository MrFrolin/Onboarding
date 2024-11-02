using Microsoft.IdentityModel.JsonWebTokens;
using Onboarding.Server.Services.Interfaces;

namespace Onboarding.Server.Services;

public class JwtTokenService : IJwtTokenService
{
    public bool TokenHasExpired(string jwtToken)
    {
        var token = new JsonWebToken(jwtToken);

        return DateTime.UtcNow.AddMinutes(1) >= token.ValidTo;
    }
}