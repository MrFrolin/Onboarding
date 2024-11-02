namespace Onboarding.DataAccess.Repositories.Interface;

public interface IFirebaseTaskRepository<T> where T : class
{
    Task<List<T>> GetAllTasksForUserId(string firestoreUserId);
    Task<List<T>> GetStaticTasksByDepartment(string department);
    Task<List<T>> GetTasksByCategory(string firestoreUserId, string taskCategories);
    Task<string> AddTask(string firestoreUserId, List<T> task);
    Task UpdateTaskCompleted(string firestoreId, T task);
    Task DeleteTask(string firestoreId, string taskId, string category);
    Task SetNewTaskListForAllUsersInTeam(string teamId, List<T> listOfTasks);
    Task DeleteTaskForAllUsersInTeam(string teamId, string taskName, string category);


}