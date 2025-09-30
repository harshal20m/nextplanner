import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import connectDB from "../../../../lib/mongodb";
import User from "../../../../lib/models/User";

const handler = NextAuth({
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        }),
    ],
    callbacks: {
        async signIn({ user, account }) {
            if (account.provider === "google") {
                try {
                    await connectDB();

                    // Check if user exists
                    let existingUser = await User.findOne({
                        email: user.email,
                    });

                    if (!existingUser) {
                        // Create new user
                        existingUser = new User({
                            email: user.email,
                            name: user.name,
                            image: user.image,
                            id: user.id,
                            createdAt: new Date().toISOString(),
                        });
                        await existingUser.save();
                    } else {
                        // Update existing user with Google info
                        existingUser.name = user.name;
                        existingUser.image = user.image;
                        existingUser.id = user.id;
                        await existingUser.save();
                    }

                    return true;
                } catch (error) {
                    console.error("Error in signIn callback:", error);
                    return false;
                }
            }
            return true;
        },
        async session({ session }) {
            if (session?.user) {
                try {
                    await connectDB();
                    const user = await User.findOne({
                        email: session.user.email,
                    });
                    if (user) {
                        session.user.id = user.id;
                        session.user.name = user.name;
                        // Only use database image if it exists, otherwise keep Google image
                        if (user.image) {
                            session.user.image = user.image;
                        }
                    }
                } catch (error) {
                    console.error("Error in session callback:", error);
                }
            }
            return session;
        },
    },
    pages: {
        signIn: "/auth/signin",
    },
    session: {
        strategy: "jwt",
    },
});

export { handler as GET, handler as POST };
