using Onboarding.DataAccess.Entities;
using Onboarding.Shared.DTOs;

namespace Onboarding.DataAccess.Repositories.Interface;

public interface IFirebaseTeamRepository
{
    Task<List<TeamMemberDTO>> GetTeamMembers(string teamId);
    Task<List<string>> GetTeamLinks(string teamId);
    Task UpdateTeamLink(string teamId, string link);
    Task<string> GetTeamVideo(string teamId);
    Task UpdateTeamVideo(string teamId, string videoUrl);
    Task UpdateTeamsTaskList(string teamId, List<Activity> listOfTasks);
    Task DeleteTeamsTask(string teamId, string taskName, string category);
}