using System.Net.Mime;
using Google.Cloud.Firestore;
using Newtonsoft.Json;
using Onboarding.DataAccess.Entities;
using Onboarding.DataAccess.Repositories.Interface;
using System.Threading.Tasks;

namespace Onboarding.DataAccess.Repositories;

public class FirebaseUserRepository(FirestoreDbContext context) : IFirebaseUserRepository<FirebaseUser>
{
    //Manage data in Firestore Employee collection

    private readonly FirestoreDb _firestoreDb = context.GetFirestoreDb();

    public async Task<List<FirebaseUser>> GetAllUsers()
    {
        QuerySnapshot employeeQuerySnapshot = await _firestoreDb.CollectionGroup("employee")
            .GetSnapshotAsync();

        List<FirebaseUser> lstEmployee = new List<FirebaseUser>();

        foreach (DocumentSnapshot documentSnapshot in employeeQuerySnapshot.Documents)
        {

            if (documentSnapshot.Exists)
            {
                Dictionary<string, object> emp = documentSnapshot.ToDictionary();
                string json = JsonConvert.SerializeObject(emp);
                FirebaseUser newUser = JsonConvert.DeserializeObject<FirebaseUser>(json);
                newUser.FirestoreId = documentSnapshot.Id;
                newUser.registerDate = documentSnapshot.CreateTime.Value.ToDateTime();
                lstEmployee.Add(newUser);
            }
        }

        List<FirebaseUser> storedEmployeeList = lstEmployee.OrderBy(x => x.registerDate).ToList();
        return storedEmployeeList;
    }

    public async Task<FirebaseUser> GetUser(string email)
    {
        var querySnapshot = await _firestoreDb.Collection("employee").WhereEqualTo("Email", email).GetSnapshotAsync();

        if (querySnapshot.Count > 0)
        {
            var docSnapshot = querySnapshot[0];
            FirebaseUser emp = docSnapshot.ConvertTo<FirebaseUser>();
            emp.FirestoreId = docSnapshot.Id;
            return emp;
        }
        return null;
    }

    public async Task<FirebaseUser> AddUser(FirebaseUser newFirebaseUser, List<Activity> staticTasks)
    {

        newFirebaseUser.ManagerEmail = "philip.frolin@visma.com"; //TODO: Remove this line when the app is ready to be tested;

        WriteBatch batch = _firestoreDb.StartBatch();

        DocumentReference docRef = _firestoreDb.Collection("employee").Document();
        //Add HR/IT basic-tasks
        CollectionReference hrTasksCollection = docRef.Collection("HR-Tasks");
        CollectionReference itTasksCollection = docRef.Collection("IT-Tasks");
        foreach (var task in staticTasks)
        {
            DocumentReference taskDocRef = null;
            if (task.Category == "IT-Tasks")
            {
                taskDocRef = itTasksCollection.Document();
            }
            else
            {
                taskDocRef = hrTasksCollection.Document();
            }
            
            Activity newTask = new Activity
            {
                FirestoreId = taskDocRef.Id,
                Name = task.Name,
                Completed = false,
                Category = task.Category,
                PriorityIndex = task.PriorityIndex,
                Description = task.Description
            };
            batch.Set(taskDocRef, newTask);
        }

        //Add Team basic-tasks
        DocumentSnapshot teamDocSnapshot = await _firestoreDb.Collection("teams").Document(newFirebaseUser.TeamId).GetSnapshotAsync();
        if (teamDocSnapshot.Exists)
        {
            CollectionReference teamTasksCollection = docRef.Collection("Team-Tasks");
            var taskQuerySnapshot = await teamDocSnapshot.Reference.Collection("Team-Tasks").GetSnapshotAsync();

            foreach (var task in taskQuerySnapshot.Documents)
            {
                if (task.Exists)
                {
                    DocumentReference taskDocRef = teamTasksCollection.Document();
                    Dictionary<string, object> taskDict = task.ToDictionary();
                    batch.Set(taskDocRef, taskDict);
                }
            }
        }
        batch.Create(docRef, newFirebaseUser);
        await batch.CommitAsync();
        newFirebaseUser.FirestoreId = docRef.Id;

        return newFirebaseUser;
    }

    public async Task<FirebaseUser> UpdateUser(FirebaseUser updatedUser, string firestoreUserId)
    {

        WriteBatch batch = _firestoreDb.StartBatch();

        var docRef = _firestoreDb.Collection("employee").Document(firestoreUserId);


        var updates = new Dictionary<string, object>
            {
                { "VismaId", updatedUser.VismaId},
                { "FirstName", updatedUser.FirstName },
                { "LastName", updatedUser.LastName },
                { "Email", updatedUser.Email },
                { "OrganisationName", updatedUser.OrganisationName },
                { "PositionName", updatedUser.PositionName },
                { "ManagerEmail", updatedUser.ManagerEmail },
                { "ManagerName", updatedUser.ManagerName },
                { "IsManager", updatedUser.IsManager },
                { "MainDiscipline", updatedUser.MainDiscipline },
                { "TeamId", updatedUser.TeamId }
            };

        batch.Update(docRef, updates);
        await batch.CommitAsync();
        return updatedUser;
    }

    public async Task DeleteUser(string firestoreUserId)
    {
        try
        {
            DocumentReference empRef = _firestoreDb.Collection("employee").Document(firestoreUserId);
            await empRef.DeleteAsync();
        }
        catch (Exception e)
        {
            throw e;
        }
    }

    public async Task<bool> CheckIfUserExist(string email)
    {
        Query query = _firestoreDb.Collection("employee").WhereEqualTo("Email", email);
        QuerySnapshot querySnapshot = await query.GetSnapshotAsync();

        return querySnapshot.Documents.Count > 0;
    }
}