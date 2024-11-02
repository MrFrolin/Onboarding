using Google.Cloud.Firestore;
using Onboarding.DataAccess.Entities;
using Onboarding.DataAccess.Repositories.Interface;
using System.Threading.Tasks;
using Google.Protobuf.WellKnownTypes;
using Onboarding.Shared.DTOs;

namespace Onboarding.DataAccess.Repositories;

public class FirebaseTeamRepository(FirestoreDbContext context) : IFirebaseTeamRepository
{
    //Manage data in Firestore Teams collection

    private readonly FirestoreDb _firestoreDb = context.GetFirestoreDb();

    public async Task<List<TeamMemberDTO>> GetTeamMembers(string teamId)
    {
        var usersSnapShot = await _firestoreDb.Collection("employee").WhereEqualTo("TeamId", teamId).GetSnapshotAsync();

        List<TeamMemberDTO> teamMembers = new List<TeamMemberDTO>();

        foreach (var user in usersSnapShot)
        {
            if (user.Exists)
            {
                var firstName = user.GetValue<string>("FirstName");
                var lastName = user.GetValue<string>("LastName");
                TeamMemberDTO teamMember = new TeamMemberDTO
                {
                    FirestoreId = user.Id,
                    DisplayName = firstName + "." + lastName[0]
                };
                teamMembers.Add(teamMember);
            }
        }

        return teamMembers;
    }

    public async Task<List<string>> GetTeamLinks(string teamId)
    {
        var teamSnapShot = await _firestoreDb.Collection("teams").Document(teamId).GetSnapshotAsync();

        if (teamSnapShot.Exists)
        {
            var teamLinks = teamSnapShot.GetValue<List<string>>("Links");
            return teamLinks;
        }

        return new List<string>();
    }

    public async Task UpdateTeamLink(string teamId, string link)
    {
        if (!link.StartsWith("https://"))
        {
            link = "https://" + link;
        }
        WriteBatch batch = _firestoreDb.StartBatch();

        var teamSnapShot = await _firestoreDb.Collection("teams").Document(teamId).GetSnapshotAsync();

        if (teamSnapShot.Exists)
        {

            DocumentReference docRef = teamSnapShot.Reference;

            batch.Update(docRef, new Dictionary<string, object>
                {
                    { "Links", FieldValue.ArrayUnion(link) }
                });
        }
        await batch.CommitAsync();
    }

    public async Task<string> GetTeamVideo(string teamId)
    {
        var teamSnapShot = await _firestoreDb.Collection("teams").Document(teamId).GetSnapshotAsync();

        if (teamSnapShot.Exists)
        {
            var videoUrl = teamSnapShot.GetValue<string>("VideoURL");
            return videoUrl;
        }

        return "j9ArrnDVY8w";
    }

    public async Task UpdateTeamVideo(string teamId, string videoUrl)
    {
        WriteBatch batch = _firestoreDb.StartBatch();

        var teamSnapShot = await _firestoreDb.Collection("teams").Document(teamId).GetSnapshotAsync();


        var videoId = videoUrl.Split('=');
        if (videoId.Length < 2)
        {
            Console.WriteLine("Incorrect VideoURL '=' missing");
            return;
        }

        if (teamSnapShot.Exists)
        {
            DocumentReference docRef = teamSnapShot.Reference;
            await docRef.UpdateAsync("VideoURL", videoId[1]);
        }
        await batch.CommitAsync();
    }

    public async Task UpdateTeamsTaskList(string teamId, List<Activity> listOfTasks)
    {
        WriteBatch batch = _firestoreDb.StartBatch();

        var teamSnapShot = await _firestoreDb.Collection("teams").Document(teamId).GetSnapshotAsync();
        var usersSnapShot = await _firestoreDb.Collection("employee").WhereEqualTo("TeamId", teamId).GetSnapshotAsync();

        List<DocumentSnapshot> allSnapShots = usersSnapShot.Documents.ToList();
        if (listOfTasks[0].Category != "HR-Tasks")
        {
            allSnapShots.Add(teamSnapShot);
        }

        foreach (var documentSnapshot in allSnapShots)
        {
            if (documentSnapshot.Exists)
            {

                foreach (var task in listOfTasks)
                {
                    var taskSnapshot = await documentSnapshot.Reference
                        .Collection(task.Category)
                        .WhereEqualTo("Name", task.Name)
                        .GetSnapshotAsync();

                    DocumentReference? docRef = taskSnapshot.FirstOrDefault()?.Reference;

                    if (docRef != null)
                    {
                        Dictionary<string, object> updates = new Dictionary<string, object>
                        {
                            {"Name", task.Name},
                            {"PriorityIndex", task.PriorityIndex},
                            {"Description", task.Description}
                        };
                        batch.Set(docRef, updates, SetOptions.MergeAll);
                    }
                    else
                    {
                        var newDocRef = documentSnapshot.Reference.Collection(task.Category).Document();

                        Activity newTask = new Activity
                        {
                            Name = task.Name,
                            Completed = false,
                            Category = task.Category,
                            PriorityIndex = task.PriorityIndex,
                            Description = task.Description
                        };
                        batch.Set(newDocRef, newTask);
                    }
                }
            }
        }
        await batch.CommitAsync();
    }

    public async Task DeleteTeamsTask(string teamId, string taskName, string category)
    {
        WriteBatch batch = _firestoreDb.StartBatch();

        var teamSnapShot = await _firestoreDb.Collection("teams").Document(teamId).GetSnapshotAsync();
        var usersSnapShot = await _firestoreDb.Collection("employee").WhereEqualTo("TeamId", teamId).GetSnapshotAsync();

        List<DocumentSnapshot> allSnapShots = usersSnapShot.Documents.ToList();
        if (category != "HR-Tasks")
        {
            allSnapShots.Add(teamSnapShot);
        }

        foreach (var documentSnapshot in allSnapShots)
        {
            if (documentSnapshot.Exists)
            {
                var taskSnapshot = await documentSnapshot.Reference.Collection(category).WhereEqualTo("Name", taskName).GetSnapshotAsync();
                DocumentReference? docRef = taskSnapshot.FirstOrDefault()?.Reference;

                batch.Delete(docRef);
            }
        }
        await batch.CommitAsync();
    }

    private async Task SendUpdateToTeamMembers(string teamId)
    {
        // Try to Send update to all members in tea
    }
}