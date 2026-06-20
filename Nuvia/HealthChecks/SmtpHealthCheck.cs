using System.Net.Sockets;
using Microsoft.Extensions.Diagnostics.HealthChecks;
using Microsoft.Extensions.Options;
using Nuvia.Settings;

namespace Nuvia.HealthChecks
{
    public class SmtpHealthCheck : IHealthCheck
    {
        private readonly SmtpSettings _settings;

        public SmtpHealthCheck(IOptions<SmtpSettings> settings)
        {
            _settings = settings.Value;
        }

        public async Task<HealthCheckResult> CheckHealthAsync(HealthCheckContext context, CancellationToken cancellationToken = default)
        {
            try
            {
                var host = _settings.Host;
                var port = _settings.Port;

                using var tcp = new TcpClient();
                await tcp.ConnectAsync(host, port).WaitAsync(TimeSpan.FromSeconds(5), cancellationToken);

                if (!tcp.Connected)
                {
                    return HealthCheckResult.Unhealthy("No se pudo conectar al servidor SMTP.");
                }

                return HealthCheckResult.Healthy("SMTP reachable");
            }
            catch (Exception ex)
            {
                return HealthCheckResult.Unhealthy("SMTP check failed: " + ex.Message);
            }
        }
    }
}
