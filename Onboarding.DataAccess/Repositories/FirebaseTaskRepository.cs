using Google.Cloud.Firestore;
using Google.Cloud.Firestore.V1;
using Onboarding.DataAccess.Entities;
using Onboarding.DataAccess.Repositories.Interface;
using System.Reflection.Metadata;

namespace Onboarding.DataAccess.Repositories;

public class FirebaseTaskRepository(FirestoreDbContext context) : IFirebaseTaskRepository<Activity>
{
    //Mange data in Firestore for Tasks

    private readonly FirestoreDb _firestoreDb = context.GetFirestoreDb();
    
    public async Task<List<Activity>> GetAllTasksForUserId(string firestoreUserId)
    {
        string[] categories = ["IT-Tasks", "HR-Tasks", "Team-Tasks", "Personal-Tasks"];
        List<Activity> lstActivity = new List<Activity>();
        foreach (var category in categories)
        {
            var tasksByCategory = await GetTasksByCategory(firestoreUserId, category);
            lstActivity.AddRange(tasksByCategory);
        }

        return lstActivity;
    }

    public async Task<List<Activity>> GetStaticTasksByDepartment(string department)
    {
        var taskSnapShot = await _firestoreDb.Collection("departments").Document(department).Collection($"{department}-Tasks")
            .GetSnapshotAsync();


        List<Activity> staticTasks = new List<Activity>();

        foreach (var task in taskSnapShot)
        {
            if (task.Exists)
            {
                var staticTask = new Activity
                {
                    Name = task.GetValue<string>("Name"),
                    Description = task.GetValue<string>("Description"),
                    Category = task.GetValue<string>("Category"),
                    PriorityIndex = task.GetValue<int>("PriorityIndex"),
                    Completed = false
                };
                staticTasks.Add(staticTask);
            }
        }
        return staticTasks;
    }

    public async Task<List<Activity>> GetTasksByCategory(string firestoreUserId, string taskCategories)
    {
        var taskQuerySnapShot = await _firestoreDb.Collection("employee")
            .Document(firestoreUserId)
            .Collection(taskCategories).GetSnapshotAsync();


        if (taskQuerySnapShot.Count < 1)
        {
            return new List<Activity>();
        }

            
        List<Activity> lstActivity = new List<Activity>();
        foreach (var taskSnapShot in taskQuerySnapShot)
        {
            if (taskSnapShot.Exists)
            {
                var activity = taskSnapShot.ConvertTo<Activity>();

                Activity newActivity = new Activity
                {
                    FirestoreId = activity.FirestoreId,
                    Name = activity.Name,
                    Completed = activity.Completed,
                    Category = activity.Category,
                    PriorityIndex = activity.PriorityIndex,
                    Description = activity.Description
                };
                lstActivity.Add(newActivity);
            }
        }
        var sortedActivityList = lstActivity.OrderBy(a => a.PriorityIndex).ToList();
        return sortedActivityList;
    }

    public async Task<string> AddTask(string firestoreUserId, List<Activity> tasks)
    {
        WriteBatch batch = _firestoreDb.StartBatch();

        foreach (var task in tasks)
        {
            CollectionReference taskColRef =
                _firestoreDb.Collection("employee").Document(firestoreUserId).Collection(task.Category);

            var taskFromDb = await taskColRef.WhereEqualTo("Name", task.Name).GetSnapshotAsync();
            if (taskFromDb.Count > 0)
            {
                return null;
            }

            var totalTasks = taskColRef.GetSnapshotAsync().Result.Count;
            DocumentReference docRef = taskColRef.Document();

            Activity newActivity = new Activity
            {
                FirestoreId = docRef.Id,
                Name = task.Name,
                Completed = false,
                Category = task.Category,
                PriorityIndex = totalTasks + 1,
                Description = task.Description
            };
            batch.Set(docRef, newActivity);
        }

        await batch.CommitAsync();

        return "Added Correctly";
    }

    public async Task UpdateTaskCompleted(string email, Activity task)
    {
        var firestoreUserId = await GetDocumentIdByEmail(email);

        var tasksRef = _firestoreDb.Collection("employee").Document(firestoreUserId).Collection(task.Category);
        var query = tasksRef.WhereEqualTo("Name", task.Name);
        var querySnapshot = await query.GetSnapshotAsync();

        foreach (var documentSnapshot in querySnapshot.Documents)
        {
            if (documentSnapshot.Exists)
            {
                await documentSnapshot.Reference.UpdateAsync("Completed", task.Completed);
            }
        }
    }

    public async Task DeleteTask(string firestoreUserId, string taskId, string category)
    {
        WriteBatch batch = _firestoreDb.StartBatch();

        var userSnapShot = await _firestoreDb.Collection("employee").Document(firestoreUserId)
            .Collection(category).Document(taskId).GetSnapshotAsync();

        DocumentReference docRef = userSnapShot.Reference;
        batch.Delete(docRef);

        await batch.CommitAsync();
    }

    public async Task SetNewTaskListForAllUsersInTeam(string teamId, List<Activity> listOfTasks)
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
                            FirestoreId = newDocRef.Id,
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

    public async Task DeleteTaskForAllUsersInTeam(string teamId, string taskName, string category)
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

    private async Task<string> GetDocumentIdByEmail(string email)
    {
        Query query = _firestoreDb.Collection("employee").WhereEqualTo("Email", email);
        QuerySnapshot querySnapshot = await query.GetSnapshotAsync();

        foreach (var documentSnapshot in querySnapshot.Documents)
        {
            if (documentSnapshot.Exists)
            {
                return documentSnapshot.Id;
            }
        }
        return null;
    }
}