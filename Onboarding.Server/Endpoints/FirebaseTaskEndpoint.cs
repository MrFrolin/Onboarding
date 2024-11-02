using Onboarding.DataAccess.Entities;
using Onboarding.DataAccess.Repositories.Interface;

namespace Onboarding.Server.Endpoints;

public static class FirebaseTaskEndpoint
{
    //API to FirebaseTaskRepository
    public static IEndpointRouteBuilder MapFirebaseTaskEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("task");

        group.MapGet("/{firestoreUserId}", GetAllTasksForUserId);

        group.MapGet("/{firestoreUserId}/{taskCategory}", GetTasksByCategory);

        group.MapPost("/{firestoreUserId}", AddTask);

        group.MapPut("/{email}", UpdateTaskCompleted);

        group.MapDelete("/{firestoreUserId}", DeleteTask);

        group.MapPut("/manager/{teamId}", SetNewTaskListForAllUsersInTeam);

        group.MapDelete("/manager/{teamId}", DeleteTaskForAllUsersInTeam);

        return app;
    }

    private static async Task<IResult> GetAllTasksForUserId(IFirebaseTaskRepository<Activity> firebaseTaskRepository, string firestoreUserId)
    {
        return Results.Ok(await firebaseTaskRepository.GetAllTasksForUserId(firestoreUserId));
    }

    private static async Task<IResult> GetTasksByCategory(IFirebaseTaskRepository<Activity> firebaseTaskRepository, string firestoreUserId, string taskCategory)
    {
        return Results.Ok(await firebaseTaskRepository.GetTasksByCategory(firestoreUserId, taskCategory));
    }

    private static async Task<IResult> AddTask(IFirebaseTaskRepository<Activity> firebaseTaskRepository, string firestoreUserId, List<Activity> tasks)
    {
        var response = await firebaseTaskRepository.AddTask(firestoreUserId, tasks);

        return Results.Ok(response);
    }

    private static async Task<IResult> UpdateTaskCompleted(IFirebaseTaskRepository<Activity> firebaseTaskRepository, string email, Activity task)
    {
        await firebaseTaskRepository.UpdateTaskCompleted(email, task);

        return Results.Ok();
    }

    private static async Task<IResult> DeleteTask(IFirebaseTaskRepository<Activity> firebaseTaskRepository, string firestoreUserId, string taskId, string category)
    {
        await firebaseTaskRepository.DeleteTask(firestoreUserId, taskId, category);

        return Results.Ok();
    }

    private static async Task SetNewTaskListForAllUsersInTeam(IFirebaseTaskRepository<Activity> firebaseTaskRepository, string teamId, List<Activity> listTask)
    {
        await firebaseTaskRepository.SetNewTaskListForAllUsersInTeam(teamId, listTask);
    }

    private static async Task DeleteTaskForAllUsersInTeam(IFirebaseTaskRepository<Activity> firebaseTaskRepository, string teamId, string taskName, string category)
    {
        await firebaseTaskRepository.DeleteTaskForAllUsersInTeam(teamId, taskName, category);
    }


}