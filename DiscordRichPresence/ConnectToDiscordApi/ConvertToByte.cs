using System;
using System.Text;

namespace DiscordRichPresence.ConnectToDiscordApi;

public static class ConvertToByte
{
    public static byte[] ToBytes(string json, int op)
    {
        var jsonBytes = Encoding.UTF8.GetBytes(json);
        
        var buffer = new byte[8 + jsonBytes.Length];
        BitConverter.GetBytes(op).CopyTo(buffer, 0);
        BitConverter.GetBytes(jsonBytes.Length).CopyTo(buffer, 4);
        jsonBytes.CopyTo(buffer, 8);
        
        return buffer;
    }
}