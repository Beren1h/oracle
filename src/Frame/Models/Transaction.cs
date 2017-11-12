using LiteDB;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using System;
using System.Collections.Generic;
using System.Runtime.Serialization;

namespace Frame.Models
{
    public class Transaction
    {
        public ObjectId _id { get; set; }
        public DateTime Date { get; set; }
        public decimal Amount { get; set; }
        public AccountingType Accounting { get; set; }
        //account or envelope
        public ObjectId ContainerId { get; set; }
        //double entry accounting.  debit/credit in container 1 paired with credit/debit in container 2
        public ObjectId PairId { get; set; }
        //id of the account credit split between envelopes
        public ObjectId DoleId { get; set; }
        public bool Pending { get; set; }
    }
    //public class Transaction
    //{
    //    public ObjectId _id { get; set; }
    //    public DateTime Date { get; set; }
    //    public decimal Amount { get; set; }
    //    public TransactionType Type { get; set; }
    //    public Envelope? Envelope { get; set; }
    //    public Account? Account { get; set; }
    //    public Reoccur? Reoccur { get; set; }
    //    public bool IsEstimate { get; set; }
    //    public ObjectId _associationId { get; set; }
    //}

    //public static class Resources
    //{
    //    public static class TransactionType
    //    {
    //        public const string DEBIT = "debit";
    //        public const string CREDIT = "credit";
    //        public const string ENVELOPE = "envelope";
    //    }

    //    public static class Account
    //    {
    //        public const string x8181 = "wells fargo";
    //        public const string x3695 = "truliant";
    //    }

    //    public static class Reoccur
    //    {
    //        public const string BAILEY_MEDICINE = "bailey medicine";
    //    }

    //    public static class Envelope
    //    {
    //        public const string MORTGAGE = "mortgage";
    //        public const string POWER = "power";
    //        public const string CAR_PAYMENT = "car payment";

    //    }

    //    public static class Lists
    //    {
    //        public static List<string> TransactionTypes = new List<string>
    //        {
    //            TransactionType.CREDIT,
    //            TransactionType.DEBIT,
    //            TransactionType.ENVELOPE
    //        };

    //        public static List<string> Accounts = new List<string>
    //        {
    //            Account.x8181,
    //            Account.x3695
    //        };

    //        public static List<string> Reoccurs = new List<string>
    //        {
    //            Reoccur.BAILEY_MEDICINE
    //        };

    //        public static List<string> Envelopes = new List<string>
    //        {
    //            Envelope.MORTGAGE,
    //            Envelope.POWER,
    //            Envelope.CAR_PAYMENT
    //        };
    //    }
    //}

    //[JsonConverter(typeof(StringEnumConverter))]
    //public enum Account
    //{
    //    [EnumMember(Value = "x8181")]
    //    wellsfargo,
    //    [EnumMember(Value = "x3695")]
    //    truliant,
    //    [EnumMember(Value = "c1398")]
    //    chasevisa,
    //    [EnumMember(Value = "c2809")]
    //    capitalonemastercard


    //}

    //[JsonConverter(typeof(StringEnumConverter))]
    //public enum Envelope
    //{
    //    [EnumMember(Value = "mortgage")]
    //    mortgage,
    //    [EnumMember(Value = "power")]
    //    power,
    //    [EnumMember(Value = "water")]
    //    water,
    //    [EnumMember(Value = "cable")]
    //    cable,
    //    [EnumMember(Value = "cell")]
    //    cell,
    //    [EnumMember(Value = "emergency")]
    //    emergency,
    //    [EnumMember(Value = "home insurance")]
    //    home_insurance,
    //    [EnumMember(Value = "car payment")]
    //    car_payment,
    //    [EnumMember(Value = "student loan")]
    //    student_loan,
    //    [EnumMember(Value = "tax")]
    //    tax,
    //    [EnumMember(Value = "medical")]
    //    medical,
    //    [EnumMember(Value = "pet")]
    //    pet,
    //    [EnumMember(Value = "activity")]
    //    activity,
    //    [EnumMember(Value = "car saving")]
    //    car_savings,
    //    [EnumMember(Value = "gas")]
    //    gas,
    //    [EnumMember(Value = "credit 1398")]
    //    credit_1398,
    //    [EnumMember(Value = "credit 2809")]
    //    credit_2809,
    //    [EnumMember(Value = "car insurance")]
    //    car_insurance,


    //}

    [JsonConverter(typeof(StringEnumConverter))]
    public enum AccountingType
    {
        credit,
        debit,
    }

    //[JsonConverter(typeof(StringEnumConverter))]
    //public enum Reoccur
    //{
    //    [EnumMember(Value = "bailey medical")]
    //    baileymedical,
    //    [EnumMember(Value = "benjamin medical")]
    //    benjaminmedical,
    //    [EnumMember(Value = "eric medical")]
    //    ericmedical,
    //    [EnumMember(Value = "arlene medical")]
    //    arlenemedical,
    //    [EnumMember(Value = "bryanna music")]
    //    bryannamusic,
    //    [EnumMember(Value = "bryanna gas")]
    //    bryannagas,
    //    [EnumMember(Value = "eric gas")]
    //    ericgas,
    //    [EnumMember(Value = "christy medical")]
    //    christymedical

    //}
}
