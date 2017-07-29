using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Frame.Collections;
using Frame.Models;
using Microsoft.Extensions.Configuration;
using Frame;
using LiteDB;

namespace Web
{
    public class Startup
    {
        public IConfigurationRoot Configuration { get; }

        public Startup(IHostingEnvironment env)
        {

            var builder = new ConfigurationBuilder()
                .SetBasePath(env.ContentRootPath)
                .AddJsonFile("appsettings.json", false, true)
                .AddEnvironmentVariables();

            Configuration = builder.Build();
        }

        // This method gets called by the runtime. Use this method to add services to the container.
        // For more information on how to configure your application, visit https://go.microsoft.com/fwlink/?LinkID=398940
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddMvc(options => options.ModelBinderProviders.Insert(0, new ObjectIdModelBinderProvider()))
                    .AddJsonOptions(options => {
                        options.SerializerSettings.Converters.Add(new ObjectIdJsonConverter());
                        options.SerializerSettings.Converters.Add(new EnvelopeJsonConverter());
                    });

            services.AddOptions();
            services.Configure<AppSettings>(Configuration);

            //services.Configure<AppSettings>(options =>
            //{
            //   options.DatabasePath = $"{Frame.Resources.Database.PATH}\\{options.Year}.db";
            //});

            var database = $"{Configuration.GetValue<string>("databasePath")}\\{Configuration.GetValue<string>("year")}.db";

            var db = new LiteDatabase(database);

            services.AddSingleton<IDbCollection<Pool>, PoolCollection>(provider => new PoolCollection(db));
            services.AddSingleton<IDbCollection<Assignment>, AssignmentCollection>(provider => new AssignmentCollection(db));
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env, ILoggerFactory loggerFactory)
        {
            app.UseMvc();
            app.UseStaticFiles();

            loggerFactory.AddConsole();

            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
        }
    }
}
