namespace Onboarding.Server.Services.Interfaces;

public interface IConnectClientFactory
{
    Task<HttpClient> GetClient();
}