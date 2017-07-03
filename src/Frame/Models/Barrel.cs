using LiteDB;
using System;

namespace Frame.Models
{
    public class Barrel
    {
        public ObjectId _id { get; set; }
        public DateTime Date { get; set; }
        public Decimal Amount { get; set; }
        public Stamp Stamp { get; set; }
        public string Note { get; set; }
        public bool Pool { get; set; }
    }

    public enum Stamp
    {
        mortgage,
        power,
        water,
        cell,
        cable,
        car_insurance,
        student_loan,
        home_insurance,
        medical,
        tax,
        car_repair,
        pet,
        emergency,
        gas,
        credit_1398,
        credit_2809,
        mei_mei,
        car_payment
    };
}
