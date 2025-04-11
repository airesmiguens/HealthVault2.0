# HealthVault 2.0

A modern, mobile-first health record management system built with Next.js, TypeScript, and Tailwind CSS.

## 🌟 Features

### Profile Management
- 👥 Create and manage multiple profiles (primary user + family members)
- 📋 Store medical history, medications, and conditions
- 🔄 Easy profile switching from sidebar
- 💾 Local storage persistence

### Voice Notes
- 🎙️ Record voice notes with automatic transcription
- 🔍 Search through transcribed notes
- 📱 Mobile-friendly recording interface
- 🏷️ Organize notes with tags

### Notifications
- 🔔 Smart reminders for health records
- ⚠️ Missing record alerts
- 📅 Follow-up reminders
- 🌐 Browser notifications support

## 🚀 Quick Start

### Prerequisites
- Node.js 18.x or later
- npm 9.x or later

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/HealthVault2.0.git
   cd HealthVault2.0
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🛠️ Tech Stack

- **Framework**: Next.js 14
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Context
- **Data Storage**: Local Storage
- **Voice Recognition**: Web Speech API

## 📁 Project Structure

```
HealthVault2.0/
├── src/
│   ├── app/                # Next.js app router pages
│   ├── components/         # React components
│   ├── contexts/          # React contexts
│   ├── types/             # TypeScript definitions
│   └── lib/               # Utility functions
├── public/                # Static assets
└── styles/               # Global styles
```

## 🔧 Configuration

### Environment Variables
No environment variables are required for local development.

### Browser Support
The voice recording feature requires a modern browser with Web Speech API support:
- ✅ Chrome (recommended)
- ✅ Edge
- ✅ Firefox
- ⚠️ Safari (limited support)

## 📱 Features Usage

### Profile Management
1. Click "Add Profile" in the sidebar
2. Fill in the required information
3. Switch between profiles using the sidebar

### Voice Notes
1. Select a profile
2. Navigate to Voice Notes section
3. Click "Start Recording"
4. Speak clearly for best transcription
5. Click "Stop Recording" to save

### Notifications
- Enable browser notifications when prompted
- Notifications appear for:
  - Missing health records
  - Upcoming appointments
  - Medication reminders

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔮 Future Enhancements

- [ ] Cloud synchronization
- [ ] Medical document upload
- [ ] Appointment scheduling
- [ ] Integration with health devices
- [ ] Export health records
- [ ] Multi-language support

## 🐛 Known Issues

- Voice recognition may have reduced accuracy in noisy environments
- Local storage has limited capacity for voice recordings
- Safari browser has limited support for some features

## 📞 Support

For support, please open an issue in the GitHub repository or contact the maintainers. 