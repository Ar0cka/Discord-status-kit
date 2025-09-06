using System;
using System.IO;
using System.IO.Pipes;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

namespace DiscordRichPresence.ConnectToDiscordApi;

public class RichPresenceAPI
{
    private readonly ConnectToDiscordRpc _connectToDiscordRpc;

    private NamedPipeClientStream _discordRpcClient;
    
    private DiscordRichPresenceContext _currentContext;
    public static RichPresenceAPI Instance { get; private set; }
    
    public bool IsConnected => _discordRpcClient.IsConnected;
    
    public RichPresenceAPI(ConnectToDiscordRpc connectToDiscordRpc)
    {
        _connectToDiscordRpc = connectToDiscordRpc;
        _discordRpcClient = _connectToDiscordRpc.GetDiscordPipe();
        Instance = this;
    }

    /// <summary>
    /// Первое сообщение, которое Discord ждёт после подключения
    /// </summary>
    private async Task Handshake(string clientId)
    {
        var data = new
        {
            v = 1,
            client_id = clientId
        };

        var json = JsonSerializer.Serialize(data);
        var buffer = ConvertToByte.ToBytes(json, 0); // op=0 = HANDSHAKE

        await SendBuffer(buffer);
    }

    /// <summary>
    /// Устанавливает активность (Rich Presence)
    /// </summary>
    private async Task UpdateConfig(DiscordRichPresenceContext context)
    {
        Console.WriteLine($"Large image {context.LargeImage} small image {context.SmallImage}");

        var rpcContext = new
        {
            cmd = "SET_ACTIVITY",
            args = new
            {
                pid = System.Diagnostics.Process.GetCurrentProcess().Id,
                activity = new
                {
                    details = context.Details,
                    state = context.Status,
                    assets = new
                    {
                        large_image = context.LargeImage,
                        large_text = context.LargeText,
                        small_image = context.SmallImage,
                        small_text = context.SmallText,
                    },
                    timestamps = new
                    {
                        start = DateTimeOffset.Now.ToUnixTimeSeconds()
                    },
                    buttons = new[]
                    {
                        new { label = "GitHub", url = "https://github.com/Ar0cka/Discord-status-kit" },
                    }
                }
            },
            nonce = Guid.NewGuid().ToString()
        };

        var json = JsonSerializer.Serialize(rpcContext);
        var buffer = ConvertToByte.ToBytes(json, 1); // op=1 = FRAME

        await SendBuffer(buffer);
    }

    private async Task<string?> ReadMessageAsync()
    {
        var header = new byte[8];
        int read = await _discordRpcClient.ReadAsync(header, 0, 8);
        if (read == 0) return null;

        int op = BitConverter.ToInt32(header, 0);
        int length = BitConverter.ToInt32(header, 4);

        var payload = new byte[length];
        read = await _discordRpcClient.ReadAsync(payload, 0, length);
        if (read == 0) return null;

        string json = Encoding.UTF8.GetString(payload, 0, read);
        Console.WriteLine($"[DISCORD RPC] op={op}, json={json}");

        return json;
    }
    
    
    
    /// <summary>
    /// Запускает цикл обновления presence
    /// </summary>
    public async Task LoopUpdateData(DiscordRichPresenceContext context)
    {
        if (!_discordRpcClient.IsConnected)
        {
            _discordRpcClient = _connectToDiscordRpc.GetDiscordPipe();
        }

        if (_currentContext == null)
            _currentContext = context;
        
        // Сначала — рукопожатие
        await Handshake(context.AppId);
        var read = await ReadMessageAsync(); // Discord ответит READY
        
        Console.WriteLine($"Handshake OK {read}");

        try
        {
            if (_discordRpcClient.IsConnected)
                await UpdateConfig(_currentContext); 
        }
        catch (Exception e)
        {
            Console.WriteLine($"Pipe broken {e.Message}");
        }
     
    }

    public async Task UpdateCurrentContext(DiscordRichPresenceContext context)
    {
        if (_currentContext == null)
        {
            Console.WriteLine($"Not context");
            return;
        }
        
        _currentContext = context;
        
        await UpdateConfig(_currentContext);
    }
    
    public async Task EndConnection()
    {
        if (_discordRpcClient.IsConnected)
        {
            await _discordRpcClient.FlushAsync();
            _discordRpcClient.Close();
            _discordRpcClient.Dispose();
        }
    }
    
    private async Task SendBuffer(byte[] buffer)
    {
        try
        {
            await _discordRpcClient.WriteAsync(buffer, 0, buffer.Length);
            await _discordRpcClient.FlushAsync();
        }
        catch (IOException e)
        {
            Console.WriteLine(e);
        }
    }
}
