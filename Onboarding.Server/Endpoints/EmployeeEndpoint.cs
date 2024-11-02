using Onboarding.DataAccess.Entities;
using Onboarding.Server.Services.Interfaces;

namespace Onboarding.Server.Extensions;

public static class EmployeeEndpoint
{
    public static IEndpointRouteBuilder MapEmployeeEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("employee");

        group.MapGet("/{email}", GetEmployeeByEmail);

        group.MapGet("/ismanager/{email}", CheckIfEmployeeIsManager);

        return app;
    }


    private static async Task<IResult> GetEmployeeByEmail(IEmployeeService<Employee> service, string email)
    {
        var employee = await service.GetEmployeeByEmail(email);

        return Results.Ok(employee);
    }

    private static async Task<IResult> CheckIfEmployeeIsManager(IEmployeeService<Employee> service, string email)
    {
        var isManager = await service.CheckIfEmployeeIsManager(email);

        return Results.Ok(isManager);
    }
}