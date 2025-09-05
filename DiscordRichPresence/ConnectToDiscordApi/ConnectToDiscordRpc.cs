using System;
using System.IO.Pipes;
using System.Net.WebSockets;
using System.Text.Json;
using System.Threading.Tasks;

namespace DiscordRichPresence.ConnectToDiscordApi;

public class ConnectToDiscordRpc
{
    public NamedPipeClientStream GetDiscordPipe()
    {
        for (int i = 0; i < 10; i++)
        {
            var pipeName = $"discord-ipc-{i}";
            var client = new NamedPipeClientStream(".", pipeName, PipeDirection.InOut, PipeOptions.Asynchronous);

            try
            {
                client.Connect();
                Console.WriteLine("Connected to discord pipe");
                return client;
            }
            catch (Exception e)
            {
                client.Dispose();
                Console.WriteLine("Next iteration");
            }
        }
        throw new Exception("Could not connect to the discord pipe.");
    }
}