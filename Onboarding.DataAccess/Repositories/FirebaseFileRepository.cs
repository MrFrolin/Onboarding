using Google.Cloud.Storage.V1;
using Onboarding.DataAccess.Repositories.Interface;
using System.IO;
using System.IO.Pipes;
using System.Security.AccessControl;

namespace Onboarding.DataAccess.Repositories;

//Manage files in Firebase storage
public class FirebaseFileRepository(FirestoreDbContext context) : IFirebaseFileRepository
{
    private readonly string _bucketName = context.GetBucketName();
    private readonly StorageClient _storageClient = context.GetStorageClient();


    public async Task<string> UploadFileAsync(string localFilePath, string objectName, string folder)
    {
        try
        {
            await using var fileStream = File.OpenRead(localFilePath);
            objectName = $"{folder}/{objectName}";

            var objectInfo = await _storageClient.UploadObjectAsync(_bucketName, objectName,null,  fileStream);
            var publicUrl = $"https://storage.googleapis.com/{_bucketName}/{objectInfo.Name}";

            return publicUrl;
        }
        catch (Google.GoogleApiException ex)
        {
            Console.WriteLine($"Error uploading file: {ex.Message}");
            throw;
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Unexpected error: {ex.Message}");
            throw;
        }
    }

    public async Task<string> DownloadFileAsync(string objectName)
    {
        var storageObject = await _storageClient.GetObjectAsync(_bucketName, objectName);
        if (storageObject == null)
        {
            throw new Exception("File not found in Firebase storage.");
        }
        var downloadUrl = $"https://firebasestorage.googleapis.com/v0/b/{_bucketName}/o/{Uri.EscapeDataString(objectName)}?alt=media";
        return downloadUrl;
    }

    public async Task<List<string>> GetFilesUrlFromFolder(string folder)
    {
        var urlNames = new List<string>();

        var urls = _storageClient.ListObjectsAsync(_bucketName, folder);

        await foreach (var objectName in urls)
        {
            urlNames.Add(objectName.Name);
        }
        return urlNames;
    }

    public async Task DeleteFileAsync(string objectName)
    {
       await _storageClient.DeleteObjectAsync(_bucketName, objectName);
    }
}