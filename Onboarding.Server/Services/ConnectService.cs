using System.CodeDom;
using System.Diagnostics.CodeAnalysis;
using System.Text.Json.Nodes;
using Onboarding.Server.Configuration;
using Onboarding.Server.Services.Interfaces;

namespace Onboarding.Server.Services;

[ExcludeFromCodeCoverage]
public class ConnectService(ISettings settings, HttpClient client): IConnectService
{
    public async Task<string> GetAccessToken()
    {
        var body = new Dictionary<string, string>
        {
            {"client_id", settings.ClientOptions.ClientId},
            {"client_secret", settings.ClientOptions.ClientSecret},
            {"grant_type", "client_credentials"}
        };

        var response = await client.PostAsync(settings.ClientOptions.ConnectTokenEndpoint, new FormUrlEncodedContent(body));
        response.EnsureSuccessStatusCode();

        var responseToken = await response.Content.ReadFromJsonAsync<JsonObject>();

         var accessToken = responseToken?["access_token"]?.ToString();
        ArgumentException.ThrowIfNullOrWhiteSpace(accessToken);

        return accessToken;
    }
}