using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ApiExplorer;
using Microsoft.AspNetCore.Diagnostics.HealthChecks;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using Serilog;
using Serilog.Events;
using System.Security.Claims;
using System.Text;
using System.Text.Json;
using System.Threading.RateLimiting;
using Stripe;
using Nuvia.Data;
using Nuvia.DTOs;
using Nuvia.JWT;
using Nuvia.Profiles;
using Nuvia.Services;
using Nuvia.Services.Base;
using Nuvia.Services.Bookings;
using Nuvia.Services.Carts;
using Nuvia.Services.Flights;
using Nuvia.Services.Hotels;
using Nuvia.Services.Packages;
using Nuvia.Services.Payments;
using Nuvia.Services.Tours;
using Nuvia.Settings;
using Nuvia.Stripe;

var builder = WebApplication.CreateBuilder(args);

// Configure Serilog with console and file sinks
var logFilePath = Path.Combine(AppContext.BaseDirectory, "logs", "nuvia-.txt");
Log.Logger = new LoggerConfiguration()
    .MinimumLevel.Information()
    .MinimumLevel.Override("Microsoft", LogEventLevel.Warning)
    .MinimumLevel.Override("System", LogEventLevel.Warning)
    .Enrich.FromLogContext()
    .Enrich.WithProperty("Application", "Nuvia")
    .WriteTo.Console()
    .WriteTo.File(logFilePath, 
        rollingInterval: RollingInterval.Day,
        outputTemplate: "{Timestamp:yyyy-MM-dd HH:mm:ss.fff zzz} [{Level:u3}] {Message:lj}{NewLine}{Exception}")
    .CreateBootstrapLogger();
builder.Host.UseSerilog((ctx, lc) => 
    lc.MinimumLevel.Information()
      .MinimumLevel.Override("Microsoft", LogEventLevel.Warning)
      .MinimumLevel.Override("System", LogEventLevel.Warning)
      .Enrich.FromLogContext()
      .Enrich.WithProperty("Application", "Nuvia")
      .Enrich.WithProperty("Environment", ctx.HostingEnvironment.EnvironmentName)
      .WriteTo.Console()
      .WriteTo.File(logFilePath,
          rollingInterval: RollingInterval.Day,
          outputTemplate: "{Timestamp:yyyy-MM-dd HH:mm:ss.fff zzz} [{Level:u3}] {Message:lj}{NewLine}{Exception}"));

// Add services to the container.

builder.Services.AddControllers(options =>
{
    // Add global model sanitization filter
    options.Filters.Add(typeof(Nuvia.Filters.SanitizeModelFilter));
});
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();

var ConnectionString = builder.Configuration.GetConnectionString("DefaultConnection");
builder.Services.AddDbContext<NuviaDbContext>(options =>
    options.UseSqlServer(ConnectionString));

builder.Services.AddScoped<
    ICrudService<FlightDTO, FlightCreateDTO, FlightUpdateDTO>,
    FlightService>();

builder.Services.AddScoped<
    ICrudService<HotelDTO, HotelCreateDTO, HotelUpdateDTO>,
    HotelService>();

builder.Services.AddScoped<
    ICrudService<TourDTO, TourCreateDTO, TourUpdateDTO>,
    TourService>();

builder.Services.AddScoped<
    ICrudService<PackageDTO, PackageCreateDTO, PackageUpdateDTO>,
    PackageService>();

builder.Services.AddScoped<
    ICrudService<BookingDTO, BookingCreateDTO, BookingUpdateDTO>,
    BookingService>();

builder.Services.AddScoped<IBookingService, BookingService>();

builder.Services.AddScoped<ICartService, CartService>();

builder.Services.AddScoped<IPaymentService, PaymentService>();

builder.Services.AddScoped<PaymentStripeService>();


builder.Services.AddAutoMapper(typeof(NuviaProfile).Assembly);

builder.Services.AddScoped<IJwtTokenGenerator, JwtTokenGenerator>();
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IEmailSender, SmtpEmailSender>();

builder.Services.Configure<StripeSettings>(builder.Configuration.GetSection("Stripe"));
builder.Services.Configure<JwtSettings>(builder.Configuration.GetSection("JwtSettings"));
builder.Services.Configure<SmtpSettings>(builder.Configuration.GetSection("Smtp"));
builder.Services.Configure<MagicLinkSettings>(builder.Configuration.GetSection("MagicLink"));
builder.Services.Configure<FrontendSettings>(builder.Configuration.GetSection("Frontend"));
builder.Services.Configure<CorsSettings>(builder.Configuration.GetSection("Cors"));

StripeConfiguration.ApiKey = builder.Configuration["Stripe:SecretKey"];

var corsSettings = builder.Configuration.GetSection("Cors").Get<CorsSettings>() ?? new CorsSettings();

var defaultOrigins = new[]
{
    "http://localhost:3000",
    "http://localhost:5173",
    "http://localhost:5174",
    "http://127.0.0.1:5173",
    "http://127.0.0.1:5174",
    "http://192.168.229.201:3000",
    "http://192.168.229.201:5173"
};

if (corsSettings.AllowedOrigins == null || corsSettings.AllowedOrigins.Length == 0)
{
    corsSettings.AllowedOrigins = defaultOrigins;
}
else
{
    var mergedOrigins = new List<string>(corsSettings.AllowedOrigins);
    foreach (var origin in defaultOrigins)
    {
        if (!mergedOrigins.Contains(origin, StringComparer.OrdinalIgnoreCase))
        {
            mergedOrigins.Add(origin);
        }
    }

    corsSettings.AllowedOrigins = mergedOrigins.ToArray();
}

builder.Services.AddCors(options =>
{
    options.AddPolicy("NuviaPolicy", policy =>
    {
        policy.WithOrigins(corsSettings.AllowedOrigins)
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

var jwtSettings = builder.Configuration.GetSection("JwtSettings").Get<JwtSettings>();
if (jwtSettings == null)
{
    throw new InvalidOperationException("Se requiere la sección JwtSettings en la configuración.");
}

var jwtKey = jwtSettings.Key;
if (string.IsNullOrWhiteSpace(jwtKey))
{
    throw new InvalidOperationException("JwtSettings:Key no está configurada. Coloca el valor en User Secrets o una variable de entorno.");
}

builder.Services
    .AddAuthentication(Microsoft.AspNetCore.Authentication.JwtBearer.JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = jwtSettings.Issuer,
            ValidAudience = jwtSettings.Audience,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey)),
            RoleClaimType = ClaimTypes.Role
        };

        options.Events = new Microsoft.AspNetCore.Authentication.JwtBearer.JwtBearerEvents
        {
            OnAuthenticationFailed = async context =>
            {
                if (context.Exception is SecurityTokenExpiredException)
                {
                    if (!context.Response.HasStarted)
                    {
                        context.Response.StatusCode = StatusCodes.Status401Unauthorized;
                        context.Response.ContentType = "application/json";
                        var payload = JsonSerializer.Serialize(new
                        {
                            status = StatusCodes.Status401Unauthorized,
                            code = "token_expired",
                            error = "Tu sesión ha expirado. Inicia sesión nuevamente."
                        });

                        // Set header before writing body to avoid "headers are read-only" errors
                        context.Response.Headers["WWW-Authenticate"] = "Bearer error=\"invalid_token\", error_description=\"token_expired\"";
                        await context.Response.WriteAsync(payload);
                    }
                    else
                    {
                        // Response already started; nothing we can safely write here. Let pipeline continue.
                    }
                }
            },
            OnChallenge = async context =>
            {
                if (!context.Response.HasStarted)
                {
                    context.Response.StatusCode = StatusCodes.Status401Unauthorized;
                    context.Response.ContentType = "application/json";
                    var payload = JsonSerializer.Serialize(new
                    {
                        status = StatusCodes.Status401Unauthorized,
                        code = "unauthorized",
                        error = "No estás autorizado para realizar esta acción."
                    });

                    await context.Response.WriteAsync(payload);
                }

                context.HandleResponse();
            }
        };
    });

builder.Services.AddAuthorization();

builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo 
    { 
        Title = "Nuvia Travel & Tourism API", 
        Version = "v1",
        Description = "API de gestión de viajes y turismo",
        Contact = new OpenApiContact
        {
            Name = "Nuvia Support",
            Email = "support@nuvia.local"
        }
    });

    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = "Autenticación JWT usando Bearer. Ejemplo: 'Bearer {token}'",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.ApiKey,
        Scheme = "Bearer"
    });

    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
});

// Rate limiting - include IP partitioned policy
builder.Services.AddRateLimiter(options =>
{
    options.RejectionStatusCode = StatusCodes.Status429TooManyRequests;
    options.OnRejected = async (context, cancellationToken) =>
    {
        context.HttpContext.Response.ContentType = "application/json";
        var payload = JsonSerializer.Serialize(new
        {
            status = StatusCodes.Status429TooManyRequests,
            code = "rate_limit_exceeded",
            error = "Demasiadas solicitudes. Intenta nuevamente más tarde."
        });

        await context.HttpContext.Response.WriteAsync(payload, cancellationToken);
    };

    // IP-based limiter (default): 60 req/min per IP.
    options.AddPolicy("ip", context =>
        RateLimitPartition.GetFixedWindowLimiter(
            partitionKey: context.Connection.RemoteIpAddress?.ToString() ?? "unknown",
            factory: _ => new FixedWindowRateLimiterOptions
            {
                Window = TimeSpan.FromMinutes(1),
                PermitLimit = 60,
                QueueProcessingOrder = QueueProcessingOrder.OldestFirst,
                QueueLimit = 10
            }));

    // General policy: 60 requests per minute
    options.AddFixedWindowLimiter("default", cfg =>
    {
        cfg.Window = TimeSpan.FromMinutes(1);
        cfg.PermitLimit = 60;
        cfg.QueueProcessingOrder = QueueProcessingOrder.OldestFirst;
        cfg.QueueLimit = 10;
    });

    // Strict policy for auth endpoints: 5 requests per minute
    options.AddFixedWindowLimiter("auth", cfg =>
    {
        cfg.Window = TimeSpan.FromMinutes(1);
        cfg.PermitLimit = 5;
        cfg.QueueProcessingOrder = QueueProcessingOrder.OldestFirst;
        cfg.QueueLimit = 2;
    });

    // Payment endpoints: 10 requests per minute
    options.AddFixedWindowLimiter("payments", cfg =>
    {
        cfg.Window = TimeSpan.FromMinutes(1);
        cfg.PermitLimit = 10;
        cfg.QueueProcessingOrder = QueueProcessingOrder.OldestFirst;
        cfg.QueueLimit = 5;
    });
});

// Health checks: DB, SMTP, Stripe (custom DB check to avoid extra packages)
builder.Services.AddHealthChecks()
    .AddCheck<Nuvia.HealthChecks.DbHealthCheck>("Database")
    .AddCheck<Nuvia.HealthChecks.SmtpHealthCheck>("SMTP")
    .AddCheck<Nuvia.HealthChecks.StripeHealthCheck>("Stripe");

var app = builder.Build();

NuviaSeeder.Seed(app);

// Error handling middleware MUST be first
app.UseMiddleware<Nuvia.Middleware.ErrorHandlingMiddleware>();
app.UseMiddleware<Nuvia.Middleware.InputSanitizationMiddleware>();

app.UseCors("NuviaPolicy");

// Log HTTP requests with Serilog (adds RequestId, elapsed ms, path and user metadata)
app.UseSerilogRequestLogging(options =>
{
    options.MessageTemplate = "HTTP {RequestMethod} {RequestPath} responded {StatusCode} in {Elapsed:0.0000} ms";
    options.EnrichDiagnosticContext = (diagnosticContext, httpContext) =>
    {
        diagnosticContext.Set("RequestHost", httpContext.Request.Host.Value);
        diagnosticContext.Set("RequestPath", httpContext.Request.Path.Value);
        diagnosticContext.Set("RequestMethod", httpContext.Request.Method);
        diagnosticContext.Set("UserName", httpContext.User?.Identity?.Name ?? "anonymous");
    };
});

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthentication();

app.UseAuthorization();

// Apply rate limiting middleware before endpoints
app.UseRateLimiter();

// Apply IP-based rate limiting globally
app.MapControllers().RequireRateLimiting("ip");

// Map health checks with detailed JSON response
app.MapHealthChecks("/health", new HealthCheckOptions
{
    ResponseWriter = async (context, report) =>
    {
        context.Response.ContentType = "application/json";

        var result = new
        {
            status = report.Status.ToString(),
            totalDuration = report.TotalDuration.TotalMilliseconds,
            checks = report.Entries.Select(e => new
            {
                name = e.Key,
                status = e.Value.Status.ToString(),
                description = e.Value.Description,
                duration = e.Value.Duration.TotalMilliseconds,
                data = e.Value.Data
            })
        };

        await context.Response.WriteAsync(JsonSerializer.Serialize(result));
    }
});

// Use rate limiter middleware (applies configured policies)
app.UseRateLimiter();

Serilog.Log.Information("Nuvia API iniciada correctamente");

app.Run();
