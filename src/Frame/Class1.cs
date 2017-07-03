using System;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Data.Sqlite;

namespace Frame
{
    public class Class1
    {
        public class Context : DbContext
        {
            public DbSet<Test> Test { get; set; }

            protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
            {
                //var csb = new SqliteConnectionStringBuilder
                //{
                //    DataSource = "c:\\oracle\\oracle.sqlite"
                //};

                //var cnn = csb.ToString();
                //var connection = new SqliteConnection(cnn);

                optionsBuilder.UseSqlite("Filename=c:\\oracle\\oracle.sqlite");
                //optionsBuilder.UseSqlite(connection);
            }
        }

        //public void ConfigurationServices(IServiceCollection services)
        //{
        //    services.AddEntityFrameworkSqlite().AddDbContext<Context>();
        //}

        public bool OpenConnection()
        {
            using (var db = new Context())
            {
                //var test = new Test { col = "1", pk = 1 };
                //db.Test.Add(test);
                //db.SaveChanges();

                var tests = db.Test.Where(t => t.pk == 1).ToList();

                int x = 1;

            }
            //var context = new Context();
            //var connection = "Data Source=c:\\oracle\\oracle.sqlite";
            //var open = new SQLiteConnection(connection);
            return true;
        }
    }
}

