# Day Planner - Next.js Version

A fully client-side React planner that allows users to create, manage, and track tasks for specific time slots in a day. This is the Next.js version of the original MERN stack application.

## ✨ Features

-   🔐 **Google OAuth Authentication** with NextAuth.js
-   👤 **Guest Mode** - Use the app without login (with data loss warnings)
-   📅 **Day-wise Planner** with time slots
-   ➕ **Add Multiple Tasks per Time Slot**
-   ✅ **Mark Tasks as Done/Not Done**
-   📝 **Editable Plan Names and Times**
-   📊 **View Task History** (done & pending)
-   💾 **LocalStorage + Cloud Sync** with MongoDB
-   🔄 **Smart Data Synchronization** with conflict resolution
-   🎨 **6 Beautiful Themes** (Light, Dark, Goldish, Blueish, Midnight, Pinkish)
-   🔔 **Toast Notifications** with Sonner
-   ⚠️ **Data Loss Warnings** for guest users

## 🚀 Getting Started

### Prerequisites

-   Node.js (>= 16)
-   npm
-   MongoDB (optional, for cloud sync)

### Installation

1. Clone the repository
2. Navigate to the project directory:

    ```bash
    cd nextplanner
    ```

3. Install dependencies:

    ```bash
    npm install
    ```

4. Set up environment variables:
   Create a `.env.local` file in the root directory:

    ```env
    # MongoDB connection string
    MONGODB_URI=mongodb://localhost:27017/planner

    # NextAuth.js Configuration
    NEXTAUTH_URL=http://localhost:3000
    NEXTAUTH_SECRET=your-secret-key-here

    # Google OAuth Configuration
    GOOGLE_CLIENT_ID=your-google-client-id
    GOOGLE_CLIENT_SECRET=your-google-client-secret
    ```

    For MongoDB Atlas:

    ```env
    MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/planner
    ```

5. Set up Google OAuth (optional but recommended):

    - Go to [Google Cloud Console](https://console.cloud.google.com/)
    - Create a new project or select an existing one
    - Enable the Google+ API
    - Create OAuth 2.0 credentials
    - Add `http://localhost:3000/api/auth/callback/google` to authorized redirect URIs
    - Copy the Client ID and Client Secret to your `.env.local` file

6. Run the development server:

    ```bash
    npm run dev
    ```

7. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🛠️ Tech Stack

-   **Next.js 15** with App Router
-   **React 19**
-   **TypeScript**
-   **Tailwind CSS 4**
-   **NextAuth.js** (authentication)
-   **Google OAuth** (sign-in provider)
-   **Sonner** (toast notifications)
-   **Lucide React** (icons)
-   **MongoDB** with Mongoose (for cloud sync)
-   **LocalStorage** (for persistent auth and planner data)

## 📁 Project Structure

```
nextplanner/
├── src/
│   ├── app/
│   │   ├── api/              # Next.js API routes
│   │   │   ├── health/       # Health check endpoint
│   │   │   ├── login/        # User authentication
│   │   │   ├── sync/         # Data synchronization
│   │   │   └── planner/      # Planner data management
│   │   ├── globals.css       # Global styles
│   │   ├── layout.tsx        # Root layout
│   │   └── page.tsx          # Home page
│   ├── components/           # React components
│   │   ├── App.jsx           # Main app component
│   │   ├── Auth.jsx          # Authentication
│   │   ├── Planner.jsx       # Main planner interface
│   │   ├── TimeSlot.jsx      # Individual time slots
│   │   ├── AddTimeSlot.jsx   # Add new time slots
│   │   ├── History.jsx       # Task history view
│   │   ├── SyncControls.jsx  # Cloud sync controls
│   │   ├── ThemeSelector.jsx # Theme switching
│   │   ├── Clock.jsx         # Real-time clock
│   │   └── Footer.jsx        # Footer component
│   ├── contexts/
│   │   └── ThemeContext.jsx  # Theme management
│   ├── lib/
│   │   ├── mongodb.js        # Database connection
│   │   └── models/           # Database models
│   │       ├── User.js       # User schema
│   │       └── Planner.js    # Planner schema
│   └── utils/
│       ├── storage.js        # LocalStorage utilities
│       └── timeUtils.js      # Time parsing utilities
├── package.json
└── README.md
```

## 🔧 API Endpoints

-   `GET /api/health` - Server health check
-   `POST /api/login` - User authentication
-   `POST /api/sync` - Save/merge planner data
-   `GET /api/planner/[userId]` - Fetch user's planner data

## 🎨 Themes

The app includes 6 beautiful themes:

-   **Light** - Clean blue/indigo theme (default)
-   **Dark** - Dark gray with purple accents
-   **Goldish** - Warm yellow/amber theme
-   **Blueish** - Cool blue/cyan theme
-   **Midnight** - Dark slate with purple
-   **Pinkish** - Soft pink/rose theme

## 🔄 Authentication & Data Sync

### Authentication Options

-   **Google OAuth**: Secure authentication with Google accounts
-   **Guest Mode**: Use the app without authentication (data stored locally)

### Data Storage

-   **Local Storage**: Primary data storage for all users
-   **Cloud Sync**: Available for authenticated users only
-   **Smart Merging**: Intelligent data merging when syncing
-   **Rate Limiting**: 1-hour intervals between syncs

### Guest Mode Features

-   ⚠️ **Data Loss Warning**: Clear warnings about local-only storage
-   🚫 **No Cloud Sync**: Guest users cannot sync to server
-   🧹 **Easy Cleanup**: All data cleared when guest session ends

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

### Other Platforms

The app can be deployed to any platform that supports Next.js:

-   Netlify
-   Railway
-   DigitalOcean App Platform
-   AWS Amplify

## 📝 Migration from MERN

This Next.js version maintains 100% feature parity with the original MERN stack application:

-   ✅ All frontend components copied exactly
-   ✅ Same styling and themes
-   ✅ Same functionality
-   ✅ Backend converted to Next.js API routes
-   ✅ MongoDB integration maintained
-   ✅ LocalStorage functionality preserved

## 🧑‍💻 Author

**Harshal Mali**  
[GitHub](https://github.com/harshal20m) | [Website](https://harshalmali.online)

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
