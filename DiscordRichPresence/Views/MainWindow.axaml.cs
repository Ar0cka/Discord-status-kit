using System;
using Avalonia.Controls;
using Avalonia.Interactivity;
using System.Diagnostics;
using System.Threading.Tasks;
using Avalonia.Media;
using DiscordRichPresence.ConnectToDiscordApi;

namespace DiscordRichPresence.Views;

public partial class MainWindow : Window
{
    public MainWindow()
    {
        InitializeComponent();
    }

    protected override void OnOpened(EventArgs e)
    {
        base.OnOpened(e);
        _ = Task.Run(MonitorConnection);
    }
    
    private void GitHubButton(object? sender, RoutedEventArgs e)
    {
        string url = "https://github.com/Ar0cka/Discord-status-kit";
        Process.Start(new ProcessStartInfo
        {
            FileName = url,
            UseShellExecute = true
        });
    }

    private void UpdatePresence(object? sender, RoutedEventArgs e)
    {
        var instance = RichPresenceAPI.Instance;
        
        var richContext = CreateContext();
        
        try
        {
            _ = Task.Run(() => instance.LoopUpdateData(richContext));
        }
        catch (Exception exception)
        {
            Console.WriteLine($"Failed to update presence {exception.Message}");
            throw;
        }
    }
    
    private async void EndConnection(object? sender, RoutedEventArgs e)
    {
        var instance = RichPresenceAPI.Instance;
        await instance.EndConnection();
    }

    private async void UpdateContext(object? sender, RoutedEventArgs e)
    {
        var richContext = CreateContext();
        
        var instance = RichPresenceAPI.Instance;
        
        await instance.UpdateCurrentContext(richContext);
    }

    private async void SaveConfigData(object? sender, RoutedEventArgs e)
    {
        var rpcContext = CreateContext();
        var topLevel = this;
        
        var instance = SaveAndLoadConfigs.Instance.SaveCurrentConfig(rpcContext, topLevel);

        await instance;
    }

    private async void LoadConfigData(object? sender, RoutedEventArgs e)
    {
        var topLevel = this;
        var instance = SaveAndLoadConfigs.Instance.ReadContext(topLevel);

        var rpcContext = await instance;

        if (rpcContext is null) return;
        
        WriteConfigOnTextBox(rpcContext);
    }

    private async Task MonitorConnection()
    {
        while (true)
        {
            Avalonia.Threading.Dispatcher.UIThread.Post(() =>
            {
                if (RichPresenceAPI.Instance != null)
                    ConnectionDot.Fill = RichPresenceAPI.Instance.IsConnected ? Brushes.Green : Brushes.Red;
                else
                    ConnectionDot.Fill = Brushes.Gray;
            });

            await Task.Delay(1000); // проверка раз в секунду
        }
    }
    
    private void WriteConfigOnTextBox(DiscordRichPresenceContext context)
    {
        AppId.Text = context.AppId;
        Details.Text =  context.Details;
        Status.Text = context.Status;
        LargeImage.Text = context.LargeImage;
        LargeText.Text = context.LargeText;
        SmallImage.Text =  context.SmallImage;
        SmallText.Text = context.SmallText;
    }
    private DiscordRichPresenceContext CreateContext()
    {
        string appId = AppId.Text ?? ""; 
        string details = Details.Text ?? "";
        string status = Status.Text ?? "";
        string largeImage = LargeImage.Text ?? "";
        string largeText = LargeText.Text ?? "";
        string smallImage = SmallImage.Text ?? "";
        string smallText = SmallText.Text ?? "";

        var richContext =
            new DiscordRichPresenceContext(appId, status, details, largeImage, largeText, smallImage, smallText);
        
        return richContext;
    }
}