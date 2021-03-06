﻿using LiteDB;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Text;

namespace Frame
{
    public class ObjectIdJsonConverter : JsonConverter
    {
        public override bool CanConvert(Type objectType)
        {
            return objectType == typeof(ObjectId);
        }

        public override object ReadJson(JsonReader reader, Type objectType, object existingValue, Newtonsoft.Json.JsonSerializer serializer)
        {
            var value = (string)reader.Value;
            return string.IsNullOrEmpty(value) ? ObjectId.Empty : new ObjectId(value);
        }

        public override void WriteJson(JsonWriter writer, object value, Newtonsoft.Json.JsonSerializer serializer)
        {
            var objectId = (ObjectId)value;
            writer.WriteValue(objectId != ObjectId.Empty ? objectId.ToString() : string.Empty);
        }
    }
}
