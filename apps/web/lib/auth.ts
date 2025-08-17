import prisma from "@meta/db";
import { LoginSchema } from "@meta/types"
import { compareSync } from "bcrypt-ts";
import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
 
export const {handlers, signIn, signOut, auth } = NextAuth({
    providers: [
        Credentials({
            credentials: {
                email: {
                    type: "email",
                    label: "Email",
                    placeholder: "johndoe@gmail.com",
                },
                    password: {
                    type: "password",
                    label: "Password",
                    placeholder: "*****",
                },
            },
            async authorize(credentials) {
                try {
                    const parsed = await LoginSchema.safeParseAsync(credentials)
                    if (!parsed.success) throw new Error("Invalid credentials.")

                    const { email, password } = parsed.data

                    const user = await prisma.user.findUnique({
                        where: { email },
                    })
                    console.log("user:", user)
                    if (!user) return null

                    const isValid = await compareSync(password, user.password)
                    if (!isValid) throw new Error("Invalid credentials.")

                    // if (!response.ok) return null
                    // return (await response.json()) ?? null

                    return {
                        id: user.id,
                        email: user.email,
                        name: user.name,
                    }
                } catch (error) {
                    console.log(error)
                    throw new Error("Invalid credentials.")
                }
                
            },
        }),
    ],
    session: {
        strategy: "jwt",
    },
    callbacks: {
        async jwt({token, user}) {
            if (user) {
                token.id = user.id;
                token.email = user.email;
            }
            return token;
        }
    }
})