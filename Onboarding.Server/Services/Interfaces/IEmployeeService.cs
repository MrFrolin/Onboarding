namespace Onboarding.Server.Services.Interfaces;

public interface IEmployeeService<T> where T : class
{
    Task<T> GetEmployeeByEmail(string email);
    Task<bool> CheckIfEmployeeIsManager(string email);
}