using MailKit.Net.Smtp;
using MimeKit;
using Onboarding.DataAccess.Entities;
using Onboarding.Server.Configuration;
using Onboarding.Server.Services.Interfaces;
using System.Security.AccessControl;

namespace Onboarding.Server.Services;

public class EmailSender(ISettings settings) : IEmailSender
{
    //Build email and send
    private async Task SendEmailAsync(string email, string subject, string htmlBody, string userName)
    {
        var message = new MimeMessage();
        message.From.Add(new MailboxAddress("noreply@frolin.com", settings.EmailOptions.Email));
        message.To.Add(new MailboxAddress(userName ,email)); //TODO:Change to ManagerEmail
        message.Subject = subject;

        var bodyBuilder = new BodyBuilder
        {
            HtmlBody = htmlBody
        };
        message.Body = bodyBuilder.ToMessageBody();

        using (var smtpClient = new SmtpClient())
        {
            await smtpClient.ConnectAsync(settings.EmailOptions.Host, settings.EmailOptions.Port, MailKit.Security.SecureSocketOptions.StartTls);
            await smtpClient.AuthenticateAsync(settings.EmailOptions.Email, settings.EmailOptions.Password);
            await smtpClient.SendAsync(message);
            await smtpClient.DisconnectAsync(true);
        }
    }

    //Create email when new user is added
    public async Task NewUserEmailAsync(FirebaseUser user)
    {
        //Get body from EmailTemplates
        string basePath = Directory.GetCurrentDirectory();
        string templatePath = Path.Combine(basePath, "EmailTemplates", "NewUserNotificationTemplate.html");
        string htmlBody = await File.ReadAllTextAsync(templatePath);

        var userName = user.FirstName + " " + user.LastName;
        var subject = "New User Added: Action Required";

        htmlBody = htmlBody
            .Replace("{{ManagerName}}", user.ManagerName)
            .Replace("{{UserName}}", userName)
            .Replace("{{UserRole}}", user.PositionName)
            .Replace("{{StartDate}}", DateTime.Now.ToString("MMMM dd, yyyy HH:mm"));

        //Send email with body
        await SendEmailAsync(user.Email, subject, htmlBody, userName);
    }

    //Create email when tasks is completed
    public async Task CompletedEmail(FirebaseUser user)
    {
        //Get body from EmailTemplates
        string basePath = Directory.GetCurrentDirectory();
        string templatePath = Path.Combine(basePath, "EmailTemplates", "TasksCompletedTemplate.html");
        string htmlBody = await File.ReadAllTextAsync(templatePath);

        var userName = user.FirstName + " " + user.LastName;
        var subject = "Task Completed: Action Required";

        var completedTasks = user.Activities.Where(t => t.Completed == true).ToArray();
        var completedCount = completedTasks.Length;

        htmlBody = htmlBody
            .Replace("{{ManagerName}}", user.ManagerName)
            .Replace("{{UserName}}", userName)
            .Replace("{{TotalTaskCount}}", user.Activities.Count.ToString())
            .Replace("{{TaskCount}}", completedCount.ToString());

        string taskRows = string.Empty;
        foreach (var task in completedTasks)
        {
            taskRows += $"<tr><td>{task.Name}</td><td>{task.Completed}</td></tr>";
        }
        htmlBody = htmlBody.Replace("{{TaskRows}}", taskRows);

        //Send email with body
        await SendEmailAsync(user.Email, subject, htmlBody, userName);
    }
}