using Microsoft.AspNetCore.Mvc;
using Onboarding.DataAccess.Entities;
using Onboarding.DataAccess.Repositories.Interface;
using Onboarding.Server.Services.Interfaces;
using System.Security.AccessControl;

namespace Onboarding.Server.Extensions;

public static class FirebaseUserEndpoint
{
    //API to FirebaseUserRepository
    public static IEndpointRouteBuilder MapFirebaseUserEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("firestoreuser");

        group.MapGet("/", GetAllUsers);

        group.MapGet("/{email}", GetUser);

        group.MapPost("/", AddUser);

        group.MapPut("/{firestoreUserId}", UpdateUser);

        group.MapDelete("/{firestoreUserId}", DeleteUser);

        group.MapGet("/checkuser/{email}", CheckIfUserExist);

        return app;
    }


    private static async Task<IResult> GetAllUsers(IFirebaseUserRepository<FirebaseUser> firebaseUserRepository)
    {
        return Results.Ok(await firebaseUserRepository.GetAllUsers());
    }

    private static async Task<IResult> GetUser(IFirebaseUserRepository<FirebaseUser> firebaseUserRepo, IFirebaseTeamRepository firebaseTeamRepo, IFirebaseTaskRepository<Activity> firebaseTaskRepo, string email)
    {
        
        var responseUser = await firebaseUserRepo.GetUser(email);
        var lstTasks = await firebaseTaskRepo.GetAllTasksForUserId(responseUser.FirestoreId);

        if (responseUser == null)
        {
            return Results.NotFound($"Employee not found");
        }

        responseUser.Activities.AddRange(lstTasks);

        return Results.Ok(responseUser);
    }

    private static async Task<IResult> AddUser(IFirebaseUserRepository<FirebaseUser> firebaseUserRepository, IEmployeeService<Employee> employeeService, IFirebaseTaskRepository<Activity> firebaseTaskRepo, FirebaseUser newFirebaseUser)
    {
        if (newFirebaseUser.Email != "employeeVOM@test.com")
        {
            var isManager = await employeeService.CheckIfEmployeeIsManager(newFirebaseUser.Email);
            newFirebaseUser.IsManager = isManager;
        }

        var allStaticTasks = new List<Activity>();
        allStaticTasks.AddRange(await firebaseTaskRepo.GetStaticTasksByDepartment("HR"));
        allStaticTasks.AddRange(await firebaseTaskRepo.GetStaticTasksByDepartment("IT"));

        return Results.Ok(await firebaseUserRepository.AddUser(newFirebaseUser, allStaticTasks));
    }

    private static async Task<IResult> UpdateUser(IFirebaseUserRepository<FirebaseUser> firebaseUserRepository, string firestoreUserId, FirebaseUser updatedUser)
    {
        return Results.Ok(await firebaseUserRepository.UpdateUser(updatedUser, firestoreUserId));
    }

    private static async Task<IResult> DeleteUser(IFirebaseUserRepository<FirebaseUser> firebaseUserRepository, string firestoreUserId, string email)
    {
        if (!await firebaseUserRepository.CheckIfUserExist(email))
        {
            return Results.NotFound("FirebaseUser not found");
        }

        await firebaseUserRepository.DeleteUser(firestoreUserId);
        return Results.Ok("FirebaseUser has successfully been deleted");
    }

    private static async Task<IResult> CheckIfUserExist(IFirebaseUserRepository<FirebaseUser> firebaseUserRepository, string email)
    {
        return Results.Ok(await firebaseUserRepository.CheckIfUserExist(email));
    }
}