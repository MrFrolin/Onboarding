using Onboarding.DataAccess.Entities;
using Onboarding.DataAccess.Repositories.Interface;

namespace Onboarding.Server.Endpoints;

public static class FirebaseHrEndpoint
{
    public static IEndpointRouteBuilder MapFirebaseHrEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("hr");

        group.MapGet("/link", GetHrLinks);

        group.MapPut("/link", UpdateHrLink);

        group.MapGet("/video", GetHrVideo);

        group.MapPut("/video", UpdateHrVideo);

        group.MapPut("/", UpdateHrTaskList);

        group.MapDelete("/", DeleteHrTask);

        return app;
    }

    private static async Task<List<string>> GetHrLinks(IFirebaseHrRepository firebaseHrRepository)
    {
        return await firebaseHrRepository.GetHrLinks();
    }

    private static async Task UpdateHrLink(IFirebaseHrRepository firebaseHrRepository, string link)
    {
        await firebaseHrRepository.UpdateHrLink(link);
    }

    private static async Task<string> GetHrVideo(IFirebaseHrRepository firebaseHrRepository)
    {
        return await firebaseHrRepository.GetHrVideo();
    }

    private static async Task UpdateHrVideo(IFirebaseHrRepository firebaseHrRepository, string videoUrl)
    {
        await firebaseHrRepository.UpdateHrVideo(videoUrl);
    }

    private static async Task UpdateHrTaskList(IFirebaseHrRepository firebaseHrRepository, List<Activity> listOfTasks)
    {
        await firebaseHrRepository.UpdateHrTaskList(listOfTasks);
    }

    private static async Task DeleteHrTask(IFirebaseHrRepository firebaseHrRepository, string taskName, string category)
    {
        await firebaseHrRepository.DeleteHrTask(taskName, category);
    }
}