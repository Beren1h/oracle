using Frame.Models;
using Newtonsoft.Json;
using System;

namespace Web
{
    public class EnvelopeJsonConverter : JsonConverter
    {
        public override bool CanConvert(Type objectType)
        {
            return objectType == typeof(Container);
        }

        public override object ReadJson(JsonReader reader, Type objectType, object existingValue, JsonSerializer serializer)
        {
            var value = (string)reader.Value;
            return Enum.Parse(typeof(Container), value);
        }

        public override void WriteJson(JsonWriter writer, object value, JsonSerializer serializer)
        {
            var envelope = (Container)value;
            writer.WriteValue(Enum.GetName(typeof(Container), envelope));
        }
    }
}
