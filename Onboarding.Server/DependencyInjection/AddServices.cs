using Onboarding.DataAccess.Entities;
using Onboarding.DataAccess.Repositories;
using Onboarding.DataAccess.Repositories.Interface;
using Onboarding.Server.Configuration;
using Onboarding.Server.Services;
using Onboarding.Server.Services.Factory;
using Onboarding.Server.Services.Interfaces;

namespace Onboarding.Server.DependencyInjection;

public static class AddServices
{
    //Inject all Repositories and Services to the builder
    public static IServiceCollection AddApplicationServices(this IServiceCollection services)
    {
        services.AddScoped<IFirebaseUserRepository<FirebaseUser>, FirebaseUserRepository>();
        services.AddScoped<IFirebaseTaskRepository<Activity>, FirebaseTaskRepository>();
        services.AddScoped<IFirebaseTeamRepository, FirebaseTeamRepository>();
        services.AddScoped<IFirebaseHrRepository, FirebaseHrRepository>();
        services.AddScoped<IFirebaseFileRepository, FirebaseFileRepository>();
        services.AddScoped<IConnectClientFactory, ConnectClientFactory>();
        services.AddScoped<IEmployeeService<Employee>, EmployeeService>();
        services.AddScoped<IConnectService, ConnectService>();
        services.AddScoped<IJwtTokenService, JwtTokenService>();
        services.AddTransient<IEmailSender, EmailSender>();

        return services;
    }
}