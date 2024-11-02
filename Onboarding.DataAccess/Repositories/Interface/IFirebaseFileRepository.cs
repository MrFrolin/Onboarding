namespace Onboarding.DataAccess.Repositories.Interface;

public interface IFirebaseFileRepository
{
    Task<string> UploadFileAsync(string filePath, string objectName, string folder);
    Task<string> DownloadFileAsync(string objectName);
    Task<List<string>> GetFilesUrlFromFolder(string teamId);
    Task DeleteFileAsync(string objectName);
}