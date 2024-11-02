using Google.Cloud.Firestore;
using Google.Cloud.Storage.V1;

namespace Onboarding.DataAccess;

public class FirestoreDbContext
{
    //Firestore and Storage Database setup
    private FirestoreDb _firestoreDb;
    private StorageClient _storageClient;
    private readonly string _bucketName;

    public FirestoreDbContext(string filepath, string projectId, string bucketName)
    {
        Environment.SetEnvironmentVariable("GOOGLE_APPLICATION_CREDENTIALS", filepath);
        _firestoreDb = FirestoreDb.Create(projectId);

        _storageClient = StorageClient.Create();
        _bucketName = bucketName;
    }

    public FirestoreDb GetFirestoreDb()
    {
        return _firestoreDb;
    }
    public StorageClient GetStorageClient()
    {
        return _storageClient;
    }
    public string GetBucketName()
    {
        return _bucketName;
    }
}