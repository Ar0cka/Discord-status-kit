namespace DiscordRichPresence.ConnectToDiscordApi;

public class DiscordRichPresenceContext
{
    #region AppNames

    public string AppId { get; set; }
    public string Status { get; set; }
    public string Details { get; set; }
    public string LargeImage { get; set; }
    public string LargeText { get; set; }
    public string SmallImage { get; set; }
    public string SmallText { get; set; }

    #endregion
    
    public DiscordRichPresenceContext(string appId, string status,
        string details, string largeImage,
        string largeText, string smallImage, string smallText)
    {
        AppId = appId;
        Details = details;
        LargeImage = largeImage;
        LargeText = largeText;
        SmallImage = smallImage;
        SmallText = smallText;
        Status = status;
    }
}