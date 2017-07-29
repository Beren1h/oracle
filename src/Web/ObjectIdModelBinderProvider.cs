using LiteDB;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using Microsoft.AspNetCore.Mvc.ModelBinding.Binders;
using System.Threading.Tasks;

namespace Web
{
    public class ObjectIdModelBinderProvider : IModelBinderProvider
    {
        public IModelBinder GetBinder(ModelBinderProviderContext context)
        {
            if(context.Metadata.ModelType == typeof(ObjectId))
            {
                return new BinderTypeModelBinder(typeof(ObjectIdModelBinder));
            }

            return null;
        }
    }

}
