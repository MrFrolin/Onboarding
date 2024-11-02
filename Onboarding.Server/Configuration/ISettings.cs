namespace Onboarding.Server.Configuration;

public interface ISettings
{
    ClientOptions ClientOptions { get; }
    EmailOptions EmailOptions { get; }
}

public class ClientOptions
{
    public string ClientId { get; init; }
    public string ClientSecret { get; init; }
    public string? ConnectTokenEndpoint { get; init; }
}

public class EmailOptions
{
    public string Email { get; init; }
    public string Password { get; init; }
    public string Host { get; init; }
    public int Port { get; init; }
}

