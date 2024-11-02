using Onboarding.DataAccess.Entities;

namespace Onboarding.Server.Services.Interfaces;

public interface IEmailSender
{
    Task NewUserEmailAsync(FirebaseUser user);
    Task CompletedEmail(FirebaseUser user);
}