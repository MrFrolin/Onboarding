using Onboarding.DataAccess.Entities;

namespace Onboarding.DataAccess.Repositories.Interface;

public interface IFirebaseUserRepository<T> where T : class
{
    Task<List<T>> GetAllUsers();
    Task<T> GetUser(string email);
    Task<T> AddUser(T entity, List<Activity> staticTasks);
    Task<T> UpdateUser(T entity, string id);
    Task DeleteUser(string id);
    Task<bool> CheckIfUserExist(string email);

}