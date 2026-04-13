namespace Nuvia.Models
{
    public enum UserRole
    {
        Admin = 1,
        Agent = 2,
        Customer = 3
    }

    public static class RoleNames
    {
        public const string Admin = nameof(UserRole.Admin);
        public const string Agent = nameof(UserRole.Agent);
        public const string Customer = nameof(UserRole.Customer);

        // Combos reutilizables
        public const string AdminOrAgent = Admin + "," + Agent;
    }
}
