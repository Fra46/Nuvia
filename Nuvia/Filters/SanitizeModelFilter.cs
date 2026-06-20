using System.Collections;
using System.Reflection;
using System.Text.RegularExpressions;
using System.Web;
using Microsoft.AspNetCore.Mvc.Filters;

namespace Nuvia.Filters
{
    public class SanitizeModelFilter : IActionFilter
    {
        private static readonly Regex _controlChars = new Regex(@"[\p{C}]+", RegexOptions.Compiled);
        private static readonly Regex _scriptTagRegex = new Regex("<script.*?>.*?</script>", RegexOptions.IgnoreCase | RegexOptions.Singleline | RegexOptions.Compiled);
        private static readonly Regex _tagRegex = new Regex("<.*?>", RegexOptions.Compiled);

        public void OnActionExecuting(ActionExecutingContext context)
        {
            foreach (var arg in context.ActionArguments.Values)
            {
                if (arg == null) continue;
                SanitizeObjectStrings(arg, new HashSet<object>());
            }
        }

        public void OnActionExecuted(ActionExecutedContext context)
        {
        }

        private void SanitizeObjectStrings(object obj, HashSet<object> visited)
        {
            if (obj == null || obj is string || obj.GetType().IsValueType)
                return;

            if (visited.Contains(obj))
                return;

            visited.Add(obj);

            if (obj is IDictionary dictionary)
            {
                foreach (var key in dictionary.Keys)
                {
                    var value = dictionary[key];
                    if (value is string stringValue)
                    {
                        dictionary[key] = NormalizeString(stringValue);
                    }
                    else if (value != null)
                    {
                        SanitizeObjectStrings(value, visited);
                    }
                }

                return;
            }

            if (obj is IEnumerable enumerable)
            {
                foreach (var item in enumerable)
                {
                    if (item != null)
                        SanitizeObjectStrings(item, visited);
                }

                return;
            }

            var type = obj.GetType();
            foreach (var prop in type.GetProperties(BindingFlags.Public | BindingFlags.Instance))
            {
                if (!prop.CanRead || !prop.CanWrite)
                    continue;

                if (prop.PropertyType == typeof(string))
                {
                    var current = (string?)prop.GetValue(obj);
                    if (!string.IsNullOrEmpty(current))
                    {
                        prop.SetValue(obj, NormalizeString(current));
                    }
                }
                else if (!prop.PropertyType.IsPrimitive && !prop.PropertyType.IsEnum && !prop.PropertyType.IsValueType)
                {
                    var child = prop.GetValue(obj);
                    if (child != null)
                        SanitizeObjectStrings(child, visited);
                }
            }
        }

        private static string NormalizeString(string input)
        {
            var sanitized = _scriptTagRegex.Replace(input, string.Empty);
            sanitized = _tagRegex.Replace(sanitized, string.Empty);
            sanitized = HttpUtility.HtmlEncode(sanitized);
            sanitized = _controlChars.Replace(sanitized, string.Empty);
            return sanitized.Trim();
        }
    }
}
