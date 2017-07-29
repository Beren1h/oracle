using Frame.Models;
using Newtonsoft.Json;
using System;

namespace Web
{
    public class EnvelopeJsonConverter : JsonConverter
    {
        public override bool CanConvert(Type objectType)
        {
            return objectType == typeof(Envelope);
        }

        public override object ReadJson(JsonReader reader, Type objectType, object existingValue, JsonSerializer serializer)
        {
            var value = (string)reader.Value;
            return Enum.Parse(typeof(Envelope), value);
        }

        public override void WriteJson(JsonWriter writer, object value, JsonSerializer serializer)
        {
            var envelope = (Envelope)value;
            writer.WriteValue(Enum.GetName(typeof(Envelope), envelope));
        }
    }
}
