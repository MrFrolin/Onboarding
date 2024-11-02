namespace Onboarding.DataAccess.Entities;

//Class to represent VOMapi employee
public class Employee
{
    public int Id { get; set; }
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public string Email { get; set; }
    public string OrganisationName { get; set; }
    public string MainDiscipline { get; set; }
    public string PositionName { get; set; }
    public string ManagerName { get; set; }
    public string  ManagerEmail { get; set; }
    public int TeamId { get; set; }
}