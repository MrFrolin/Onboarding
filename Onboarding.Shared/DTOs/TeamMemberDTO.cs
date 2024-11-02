using System.Diagnostics;

namespace Onboarding.Shared.DTOs;

//Class to represent and transfer data from Firebase user to team member in manangeTasks
public class TeamMemberDTO
{
    public string FirestoreId { get; set; }
    public string DisplayName { get; set; }
    public List<string> PersonalTaskNames { get; set; } = [];
}