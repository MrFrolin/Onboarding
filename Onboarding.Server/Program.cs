using Onboarding.DataAccess;
using Onboarding.DataAccess.Entities;
using Onboarding.Server.Extensions;
using Onboarding.Server.Services;
using Microsoft.AspNetCore.Identity;
using Onboarding.Server.DependencyInjection;
using Onboarding.Server.Configuration;
using Onboarding.Server.Endpoints;
using Google.Api;
using Onboarding.Server.Services.Interfaces;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Options;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;

var builder = WebApplication.CreateBuilder(args);


//BACKUP setup
string? filepath = builder.Configuration["GoogleCloudBackup:KeyFilePath"];
string projectId = builder.Configuration["GoogleCloudBackup:ProjectId"];
string bucketName = builder.Configuration["GoogleCloudBackup:BucketName"];
builder.Services.AddSingleton(provider => new FirestoreDbContext(filepath, projectId, bucketName));


string validAudience = builder.Configuration["JwtSettings:ValidAudience"];
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        // Set the authority to Google's OpenID Connect metadata
        options.Authority = "https://accounts.google.com";

        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidIssuer = "https://accounts.google.com", 

            ValidateAudience = true,
            ValidAudience = validAudience,

            ValidateLifetime = true,
            ClockSkew = TimeSpan.Zero 
        };
    });

builder.Services.AddAuthorization();

//Add VOMApi baseaddress
var baseAddress = builder.Configuration["ApiSettings:Onboarding"];
builder.Services.AddHttpClient("Connect", client =>
{
    client.BaseAddress = new Uri(baseAddress);
});

//Get secrets from appsettings.json and configure Appsettings
builder.Services.Configure<ClientOptions>(builder.Configuration.GetSection("ClientOptions"));
builder.Services.Configure<EmailOptions>(builder.Configuration.GetSection("EmailSettings"));

//Add services to the builder, see AddServices folder
builder.Services.AddApplicationServices();


//Add appsettings to the builder with clientoptions and emailoptions
builder.Services.AddTransient<ISettings, AppSettings>(sp =>
{
    var clientOptions = sp.GetRequiredService<IOptions<ClientOptions>>().Value;
    var emailOptions = sp.GetRequiredService<IOptions<EmailOptions>>().Value;
    return new AppSettings(clientOptions, emailOptions);
});


//ADDED CORS
builder.Services
    .AddCors(options =>
            options.AddPolicy(
                "Onboarding",
                policy =>
                    policy
                        .WithOrigins("https://localhost:5173")
                        .AllowAnyMethod()
                        .AllowAnyHeader()
                        .AllowCredentials()
                )
        );



// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

//UseCorse
app.UseCors("Onboarding");

app.UseDefaultFiles();
app.UseStaticFiles();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.MapFallbackToFile("/index.html");

app.UseAuthentication();
app.UseAuthorization();


// Middleware to validate the token gets called before every endpoint call
app.Use(async (context, next) =>
{
    var token = context.Request.Headers["Authorization"].ToString().Replace("Bearer ", "");

    if (string.IsNullOrEmpty(token))
    {
        context.Response.StatusCode = 401;
        await context.Response.WriteAsync("Missing or invalid token");
        return;
    }
    var httpClientFactory = context.RequestServices.GetService<IHttpClientFactory>();
    var client = httpClientFactory.CreateClient();
    var response = await client.GetAsync($"https://www.googleapis.com/oauth2/v3/userinfo?access_token={token}");

    if (!response.IsSuccessStatusCode)
    {
        context.Response.StatusCode = 401;
        await context.Response.WriteAsync("Invalid or expired token");
        return;
    }

    await next.Invoke();
});


//Add API endpoints to the app
app.MapFirebaseTaskEndpoints();
app.MapFirebaseTeamEndpoints();
app.MapFirebaseUserEndpoints();
app.MapFirebaseFileEndpoints();
app.MapFirebaseHrEndpoints();
app.MapEmployeeEndpoints();
app.MapEmailSenderEndpoints();


app.Run();