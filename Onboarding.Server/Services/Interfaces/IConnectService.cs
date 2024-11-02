namespace Onboarding.Server.Services.Interfaces;

public interface IConnectService
{
    Task<string> GetAccessToken();
}