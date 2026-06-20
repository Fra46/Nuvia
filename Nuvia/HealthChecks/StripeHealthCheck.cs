using Microsoft.Extensions.Diagnostics.HealthChecks;
using Microsoft.Extensions.Options;
using Nuvia.Stripe;
using Stripe;

namespace Nuvia.HealthChecks
{
    public class StripeHealthCheck : IHealthCheck
    {
        private readonly StripeSettings _settings;

        public StripeHealthCheck(IOptions<StripeSettings> settings)
        {
            _settings = settings.Value;
        }

        public async Task<HealthCheckResult> CheckHealthAsync(HealthCheckContext context, CancellationToken cancellationToken = default)
        {
            try
            {
                var key = _settings?.SecretKey;
                if (string.IsNullOrWhiteSpace(key))
                    return HealthCheckResult.Unhealthy("Stripe secret key not configured.");

                using var http = new System.Net.Http.HttpClient();
                http.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", key);
                http.Timeout = TimeSpan.FromSeconds(5);

                var resp = await http.GetAsync("https://api.stripe.com/v1/account", cancellationToken);
                if (resp.IsSuccessStatusCode)
                {
                    return HealthCheckResult.Healthy("Stripe reachable");
                }

                var content = await resp.Content.ReadAsStringAsync(cancellationToken);
                return HealthCheckResult.Unhealthy($"Stripe responded with {(int)resp.StatusCode}: {content}");
            }
            catch (Exception ex)
            {
                return HealthCheckResult.Unhealthy("Stripe check failed: " + ex.Message);
            }
        }
    }
}
