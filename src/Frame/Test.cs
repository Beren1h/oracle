using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace Frame
{
    public class Test
    {
        [Key]
        public int pk { get; set; }
        public string col { get; set; }
    }
}
