using LiteDB;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using System.Threading.Tasks;

namespace Web
{
    public class ObjectIdModelBinder : IModelBinder
    {
        public Task BindModelAsync(ModelBindingContext bindingContext)
        {
            if (bindingContext.ModelType != typeof(ObjectId))
            {
                return Task.CompletedTask;
            }

            var value = bindingContext.ValueProvider.GetValue(bindingContext.ModelName);

            var id = new ObjectId(value.FirstValue);

            bindingContext.Result = ModelBindingResult.Success(id);

            return Task.CompletedTask;
        }
    }
}
