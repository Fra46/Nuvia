using Microsoft.Extensions.Diagnostics.HealthChecks;
using Nuvia.Data;

namespace Nuvia.HealthChecks
{
    public class DbHealthCheck : IHealthCheck
    {
        private readonly NuviaDbContext _db;

        public DbHealthCheck(NuviaDbContext db)
        {
            _db = db;
        }

        public async Task<HealthCheckResult> CheckHealthAsync(HealthCheckContext context, CancellationToken cancellationToken = default)
        {
            try
            {
                var canConnect = await _db.Database.CanConnectAsync(cancellationToken);
                return canConnect ? HealthCheckResult.Healthy("Database reachable") : HealthCheckResult.Unhealthy("Cannot connect to database");
            }
            catch (Exception ex)
            {
                return HealthCheckResult.Unhealthy("Database check failed: " + ex.Message);
            }
        }
    }
}
