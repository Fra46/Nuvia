using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
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
using Nuvia.Services.Tours;
using Nuvia.Services.Payments;
using Nuvia.Settings;
using Nuvia.Stripe;
using Stripe;
using System.Security.Claims;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
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

var corsSettings = builder.Configuration.GetSection("Cors").Get<CorsSettings>() ?? new CorsSettings
{
    AllowedOrigins = new[] { "http://localhost:3000", "http://192.168.229.201:3000" }
};

if (corsSettings.AllowedOrigins.Length == 0)
{
    corsSettings.AllowedOrigins = new[] { "http://localhost:3000", "http://192.168.229.201:3000" };
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
var jwtKey = jwtSettings?.Key ?? throw new InvalidOperationException("JwtSettings:Key no está configurada.");

builder.Services
    .AddAuthentication("Bearer")
    .AddJwtBearer("Bearer", options =>
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
    });

builder.Services.AddAuthorization();

builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "Nuvia API", Version = "v1" });

    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = "Autenticaci�n JWT usando Bearer. Ejemplo: 'Bearer {token}'",
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

var app = builder.Build();

NuviaSeeder.Seed(app);

app.UseMiddleware<Nuvia.Middleware.ErrorHandlingMiddleware>();

app.UseCors("NuviaPolicy");

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthentication();

app.UseAuthorization();

app.MapControllers();

app.Run();
