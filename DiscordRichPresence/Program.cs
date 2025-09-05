using Avalonia;
using System;
using System.Threading.Tasks;
using DiscordRichPresence.ConnectToDiscordApi;

namespace DiscordRichPresence;

sealed class Program
{
    private static ConnectToDiscordRpc _discordRpc;
    private static RichPresenceAPI _api;
    
    // Initialization code. Don't use any Avalonia, third-party APIs or any
    // SynchronizationContext-reliant code before AppMain is called: things aren't initialized
    // yet and stuff might break.
    [STAThread]
    public static void Main(string[] args)
    {
        _discordRpc = new ConnectToDiscordRpc();
        
        _api = new RichPresenceAPI(_discordRpc);
        
        BuildAvaloniaApp()
            .StartWithClassicDesktopLifetime(args);
    }

    // Avalonia configuration, don't remove; also used by visual designer.
    public static AppBuilder BuildAvaloniaApp()
        => AppBuilder.Configure<App>()
            .UsePlatformDetect()
            .WithInterFont()
            .LogToTrace();
}