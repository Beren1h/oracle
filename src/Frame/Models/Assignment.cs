using LiteDB;
using System;

namespace Frame.Models
{
    public class Assignment 
    {
        public ObjectId _id { get; set; }
        public DateTime Date { get; set; }
        public decimal Amount { get; set; }
        public Container Envelope { get; set; }
        public string Note { get; set; }
        public ObjectId PoolId { get; set; }
    }

    //public enum Envelope
    //{
    //    mortgage,
    //    power,
    //    water,
    //    cell,
    //    cable,
    //    car_insurance,
    //    student_loan,
    //    home_insurance,
    //    medical,
    //    tax,
    //    car_repair,
    //    pet,
    //    emergency,
    //    gas,
    //    credit_1398,
    //    credit_2809,
    //    mei_mei,
    //    car,
    //    car_payment,
    //    sweep,
    //    arlene
    //};
}
