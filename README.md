# DiscordStatusKit

DiscordStatusKit is a simple utility that helps you build and manage custom Discord Rich Presence statuses.
The project is written in C# with Avalonia UI

⚠️ Important Notes:
- Frequent connect/disconnect cycles may cause issues with opening Discord RPC ports.
If this happens, you may need to restart the application.
- The indicator in the top-right corner shows whether the app is connected to Discord RPC,
not whether a custom Activity is currently displayed.

## 🧰 What You Can Do

- Input:
  - App ID
  - Details
  - Status
  - Large/Small Image keys and their tooltips
- One-click connect and disconnect
- See live presence changes instantly
- Connection indicator built-in
- Save and Load configurations to JSON files

## 🚀 Launching

- Grab the installer or portable version from [Releases](https://github.com/Ar0cka/FakeStatusRTC/releases)
- Run it — that’s it.

✅ No Python installation required.

## 🧪 Creating a Discord Developer Application

1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Click “New Application”, set a name, create it
3. Open **Rich Presence > Art Assets**
4. Upload images (case-sensitive names!)
5. Copy your **Client ID** — it’s your App ID
6. Make sure Discord is running locally

💡 This presence will be visible to **all** users, just like game activity.

## 📸 Screenshots
Interface Preview:

   ![Interface Preview](./ReadmeAssets/NewApp.png)

Displayed Result

   ![Displayed Result](./ReadmeAssets/NewProfile.png)

## 🔗 Useful Links

- [Discord Developer Portal](https://discord.com/developers/applications)
- [Avalonia UI Documentation](https://avaloniaui.net/)
- [Discord API Documentation](https://discord.com/developers/docs/intro?utm_source=chatgpt.com)
