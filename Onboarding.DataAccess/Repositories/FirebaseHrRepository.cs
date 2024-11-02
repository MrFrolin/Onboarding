using Google.Cloud.Firestore;
using Onboarding.DataAccess.Entities;
using Onboarding.DataAccess.Repositories.Interface;

namespace Onboarding.DataAccess.Repositories;

public class FirebaseHrRepository(FirestoreDbContext context): IFirebaseHrRepository
{
    private readonly FirestoreDb _firestoreDb = context.GetFirestoreDb();

    public async Task<List<string>> GetHrLinks()
    {
        var hrSnapShot = await _firestoreDb.Collection("departments").Document("HR").GetSnapshotAsync();

        if (hrSnapShot.Exists)
        {
            var teamLinks = hrSnapShot.GetValue<List<string>>("Links");
            return teamLinks;
        }

        return new List<string>();
    }

    public async Task UpdateHrLink(string link)
    {
        if (!link.StartsWith("https://"))
        {
            link = "https://" + link;
        }
        WriteBatch batch = _firestoreDb.StartBatch();

        var hrSnapShot = await _firestoreDb.Collection("departments").Document("HR").GetSnapshotAsync();

        if (hrSnapShot.Exists)
        {

            DocumentReference docRef = hrSnapShot.Reference;

            batch.Update(docRef, new Dictionary<string, object>
            {
                { "Links", FieldValue.ArrayUnion(link) }
            });
        }
        await batch.CommitAsync();
    }

    public async Task<string> GetHrVideo()
    {
        var hrSnapShot = await _firestoreDb.Collection("departments").Document("HR").GetSnapshotAsync();

        if (hrSnapShot.Exists)
        {
            var videoUrl = hrSnapShot.GetValue<string>("VideoURL");
            return videoUrl;
        }

        return "j9ArrnDVY8w";
    }

    public async Task UpdateHrVideo(string videoUrl)
    {
        WriteBatch batch = _firestoreDb.StartBatch();

        var hrSnapShot = await _firestoreDb.Collection("departments").Document("HR").GetSnapshotAsync();


        var videoId = videoUrl.Split('=');
        if (videoId.Length < 2)
        {
            Console.WriteLine("Incorrect VideoURL '=' missing");
            return;
        }

        if (hrSnapShot.Exists)
        {
            DocumentReference docRef = hrSnapShot.Reference;
            await docRef.UpdateAsync("VideoURL", videoId[1]);
        }
        await batch.CommitAsync();
    }

    public async Task UpdateHrTaskList(List<Activity> listOfTasks)
    {
        throw new NotImplementedException();
    }

    public Task DeleteHrTask(string taskName, string category)
    {
        throw new NotImplementedException();
    }

    private async Task SendUpdateToHrMembers()
    {
        // Try to Send update to all members in tea
    }
}