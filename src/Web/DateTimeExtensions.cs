using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Web
{
    public static class DateTimeExtensions
    {
        public static string Display(this DateTime date)
        {
            return date.ToString("MM-dd");
        }
    }
}
