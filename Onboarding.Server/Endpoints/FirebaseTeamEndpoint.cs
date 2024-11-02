using Onboarding.DataAccess.Entities;
using Onboarding.DataAccess.Repositories.Interface;
using static Google.Rpc.Help.Types;

namespace Onboarding.Server.Endpoints;

public static class FirebaseTeamEndpoint
{
    //API to FirebaseTeamRepository
    public static IEndpointRouteBuilder MapFirebaseTeamEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("team");

        group.MapGet("/{teamId}", GetTeamMembers);

        group.MapGet("/link/{teamId}", GetTeamLinks);

        group.MapPut("/link/{teamId}", UpdateTeamLink);

        group.MapGet("/video/{teamId}", GetTeamVideo);

        group.MapPut("/video/{teamId}", UpdateTeamVideo);

        group.MapPut("/{teamId}", UpdateTeamTaskList);

        group.MapDelete("/{teamId}", DeleteTeamTask);

        return app;
    }

    private static async Task<IResult> GetTeamMembers(IFirebaseTeamRepository firebaseTeamRepository, IFirebaseTaskRepository<Activity> firebaseTaskRepository, string teamId)
    {

        var response = await firebaseTeamRepository.GetTeamMembers(teamId);

        foreach (var member in response)
        {
            var tasks = await firebaseTaskRepository.GetTasksByCategory(member.FirestoreId, "Personal-Tasks");

            foreach (var task in tasks)
            {
                member.PersonalTaskNames.Add(task.Name);
            }
        }

        return Results.Ok(response);
    }

    private static async Task<List<string>> GetTeamLinks(IFirebaseTeamRepository firebaseTeamRepository, string teamId)
    {
        return await firebaseTeamRepository.GetTeamLinks(teamId);
    }

    private static async Task UpdateTeamLink(IFirebaseTeamRepository firebaseTeamRepository, string teamId, string link)
    {
        await firebaseTeamRepository.UpdateTeamLink(teamId, link);
    }

    private static async Task<string> GetTeamVideo(IFirebaseTeamRepository firebaseTeamRepository, string teamId)
    {
        return await firebaseTeamRepository.GetTeamVideo(teamId);
    }

    private static async Task UpdateTeamVideo(IFirebaseTeamRepository firebaseTeamRepository, string teamId, string videoUrl)
    {
        await firebaseTeamRepository.UpdateTeamVideo(teamId, videoUrl);
    }


    private static async Task UpdateTeamTaskList(IFirebaseTeamRepository firebaseTeamRepository, string teamId, List<Activity> listOfTasks)
    {
        await firebaseTeamRepository.UpdateTeamsTaskList(teamId, listOfTasks);
    }

    private static async Task DeleteTeamTask(IFirebaseTeamRepository firebaseTeamRepository, string teamId, string taskName, string category)
    {
        await firebaseTeamRepository.DeleteTeamsTask(teamId, taskName, category);
    }
}