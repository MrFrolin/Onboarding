using Onboarding.DataAccess.Entities;

namespace Onboarding.DataAccess.Repositories.Interface;

public interface IFirebaseHrRepository
{
    Task<List<string>> GetHrLinks();
    Task UpdateHrLink(string link);
    Task<string> GetHrVideo();
    Task UpdateHrVideo(string videoUrl);
    Task UpdateHrTaskList(List<Activity> listOfTasks);
    Task DeleteHrTask(string taskName, string category);
}