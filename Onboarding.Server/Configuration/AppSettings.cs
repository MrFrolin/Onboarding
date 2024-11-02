namespace Onboarding.Server.Configuration;

public class AppSettings : ISettings
{
    public ClientOptions ClientOptions { get; set; }
    public EmailOptions EmailOptions { get; set; }

    public AppSettings(ClientOptions clientOptions, EmailOptions emailOptions)
    {
        ClientOptions = clientOptions;
        EmailOptions = emailOptions;
    }
}