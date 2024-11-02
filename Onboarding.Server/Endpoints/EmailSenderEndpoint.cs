using System.Runtime.CompilerServices;
using Onboarding.DataAccess.Entities;
using Onboarding.Server.Services;
using Onboarding.Server.Services.Interfaces;

namespace Onboarding.Server.Endpoints;

public static class EmailSenderEndpoint
{
    //API to EmailService
    public static IEndpointRouteBuilder MapEmailSenderEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("email");

        group.MapPost("/newUser", SendNewUserEmailAsync);

        group.MapPost("/complete", SendCompletedEmail);

        return app;
    }
    private static async Task<IResult> SendNewUserEmailAsync(IEmailSender emailSender, FirebaseUser user)
    {
        await emailSender.NewUserEmailAsync(user);
        return Results.Ok();
    }

    private static async Task<IResult> SendCompletedEmail(IEmailSender emailSender, FirebaseUser user)
    {
        await emailSender.CompletedEmail(user);
        return Results.Ok();
    }
}