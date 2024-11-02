using System.Net.Http.Headers;
using Onboarding.Server.Services.Interfaces;

namespace Onboarding.Server.Services.Factory;

internal class ConnectClientFactory(IConnectService connectService, IJwtTokenService jwtTokenService, HttpClient client) : IConnectClientFactory
{

    private static string? accessToken;

    public async Task<HttpClient> GetClient()
    {
        if (accessToken is null || jwtTokenService.TokenHasExpired(accessToken))
            await SetNewAccessToken();
        else
            SetExistingAccessToken();
        return client;
    }

    private async Task SetNewAccessToken()
    {
        accessToken = await connectService.GetAccessToken();

        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);
    }

    private void SetExistingAccessToken()
    {
        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);
    }
}