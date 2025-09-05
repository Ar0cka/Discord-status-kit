using System;
using System.IO;
using System.Text.Json;
using System.Threading.Tasks;
using Avalonia.Controls;
using Avalonia.Platform.Storage;

namespace DiscordRichPresence.ConnectToDiscordApi;

public class SaveAndLoadConfigs
{
    public static SaveAndLoadConfigs Instance = new SaveAndLoadConfigs();

    public async Task SaveCurrentConfig(DiscordRichPresenceContext context, TopLevel topLevel)
    {
        var dialog = new FilePickerSaveOptions()
        {
            Title = "Save And Load Configs",
            
            FileTypeChoices = new[]
            {
                new FilePickerFileType("JSON")
                {
                    Patterns = new[] {".json"}
                }
            },
            
            SuggestedFileName = "config.json",
        };
        
        var result = await topLevel.StorageProvider.SaveFilePickerAsync(dialog);
        
        if (result != null)
        {
            await using var stream = await result.OpenWriteAsync();
            var json = JsonSerializer.Serialize(context, new JsonSerializerOptions { WriteIndented = true });
            await using var writer = new StreamWriter(stream);
            await writer.WriteAsync(json);
        }
        else
        {
            Console.WriteLine("No config file found.");
        }
    }

    public async Task<DiscordRichPresenceContext?> ReadContext(TopLevel topLevel)
    {
        var result = await topLevel.StorageProvider.OpenFilePickerAsync(new FilePickerOpenOptions
        {
            Title = "Save And Load Configs",
            AllowMultiple = false,
            FileTypeFilter = new[]
            {
                new FilePickerFileType("JSON")
                {
                    Patterns = new[] {"*.json"}
                }
            },
        });

        if (result.Count == 0)
        {
            Console.WriteLine("No config file found.");
            return null;
        }
        
        if (result.Count > 0)
        {
            try
            {
                var file = result[0];
                await using var stream = await file.OpenReadAsync();
                var context = await JsonSerializer.DeserializeAsync<DiscordRichPresenceContext>(stream);
                return context; 
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
                return null;
            }
        }

        return null;
    }
}