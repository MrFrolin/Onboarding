using Google.Cloud.Firestore;
using Onboarding.Shared.DTOs;

namespace Onboarding.DataAccess.Entities;

//Class to represent the user in the Firestore database
[FirestoreData]
public class FirebaseUser
{
    [FirestoreDocumentId]
    public string FirestoreId { get; set; }

    [FirestoreProperty]
    public required int VismaId { get; set; }

    [FirestoreProperty]
    public string FirstName { get; set; }

    [FirestoreProperty]
    public string LastName { get; set; }

    [FirestoreProperty]
    public required string Email { get; set; }

    [FirestoreProperty] 
    public string OrganisationName { get; set; }

    [FirestoreProperty]
    public string PositionName { get; set; }

    [FirestoreProperty]
    public string ManagerName { get; set; }

    [FirestoreProperty]
    public required string ManagerEmail { get; set; }

    public List<Activity> Activities { get; set; } = new();

    public DateTime registerDate { get; set; }

    [FirestoreProperty]
    public bool IsManager { get; set; } = false;

    [FirestoreProperty] 
    public string MainDiscipline { get; set; }

    [FirestoreProperty] 
    public string TeamId { get; set; }


}