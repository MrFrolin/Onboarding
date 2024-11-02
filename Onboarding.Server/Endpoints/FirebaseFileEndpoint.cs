using Onboarding.DataAccess.Repositories;
using Onboarding.DataAccess.Repositories.Interface;

namespace Onboarding.Server.Endpoints;

public static class FirebaseFileEndpoint
{
    //API to FirebaseFileRepository
    public static IEndpointRouteBuilder MapFirebaseFileEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("file");

        group.MapGet("/{folder}", GetFilesUrlFromFolder);

        group.MapPost("/upload", UploadFileAsync);

        group.MapGet("/download", DownloadFileAsync);

        return app;
    }

    private static async Task<List<string>> GetFilesUrlFromFolder(IFirebaseFileRepository fileRepository, string folder)
    {
        var urls = await fileRepository.GetFilesUrlFromFolder(folder);

        return urls;
    }

    private static async Task<IResult> UploadFileAsync(HttpRequest request, IFirebaseFileRepository fileRepository, string folder)
    {
        var formCollection = await request.ReadFormAsync();
        var file = formCollection.Files.GetFile("file");

        if (file == null || file.Length == 0)
        {
            return Results.BadRequest("No file uploaded or file is empty.");
        }
        var tempFilePath = Path.Combine(Path.GetTempPath(), file.FileName);
        using (var stream = new FileStream(tempFilePath, FileMode.Create))
        {
            await file.OpenReadStream().CopyToAsync(stream);
        }

        await fileRepository.UploadFileAsync(tempFilePath, file.FileName, folder);
        return Results.Ok(new { message = "File uploaded successfully!" });
    }

    private static async Task<IResult> DownloadFileAsync(IFirebaseFileRepository fileRepository, string fileName)
    {
        if (string.IsNullOrEmpty(fileName))
        {
            return Results.BadRequest("File name is required.");
        }

        try
        {
            var downloadUrl = await fileRepository.DownloadFileAsync(fileName);
            return Results.Ok(new { url = downloadUrl });
        }
        catch (Exception ex)
        {
            return Results.Problem($"Error downloading file: {ex.Message}");
        }
    }

    
}