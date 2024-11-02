using Onboarding.DataAccess.Entities;
using Onboarding.Server.Services.Interfaces;

namespace Onboarding.Server.Services;

public class EmployeeService(IConnectClientFactory connectClientFactory, IHttpClientFactory factory)
    : IEmployeeService<Employee>
{

    private async Task<HttpResponseMessage> UrlBuilder(string email, string url)
    {
        email = email.Replace("@", "%40");

        //Todo: Fix If auth
        var client = await connectClientFactory.GetClient(); // Get an authorized client

        client.BaseAddress = factory.CreateClient("Connect").BaseAddress;

        return await client.GetAsync(url + email);
        
    }

    public async Task<Employee> GetEmployeeByEmail(string email)
    {

        var response = await UrlBuilder(email, $"GetEmployeeByEmail?email=");

        response.EnsureSuccessStatusCode();

        var employee = await response.Content.ReadFromJsonAsync<Employee>();

        return employee;
    }

    public async Task<bool> CheckIfEmployeeIsManager(string email)
    {
        var response = await UrlBuilder(email, $"GetEmployeesReportingToSomeEmployee?reportingToEmail=");
        
        response.EnsureSuccessStatusCode();

        var employees = await response.Content.ReadFromJsonAsync<List<Employee>>();

        if (employees.Count == 0)
        {
            return false;
        }

        return true;
    }
}