using Google.Cloud.Firestore;

namespace Onboarding.DataAccess.Entities;

//Class to represent the task in the Firestore database
[FirestoreData]
public class Activity
{
    [FirestoreDocumentId]
    public string FirestoreId { get; set; }

    [FirestoreProperty]
    public string Name { get; set; }

    [FirestoreProperty]
    public bool Completed { get; set; }

    [FirestoreProperty]
    public string Category { get; set; }

    [FirestoreProperty]
    public int PriorityIndex { get; set; }

    [FirestoreProperty] 
    public string Description { get; set; }

}