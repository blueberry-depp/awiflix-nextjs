import {NextApiRequest, NextApiResponse} from "next";
import {getSession} from "next-auth/react";
import prismadb from "@/libs/prismadb";

const serverAuth = async (req: NextApiRequest) => {
    // Fetch logged in user session
    const session = await getSession({req})

    if (!session?.user?.email) {
        throw new Error('Not signed in')
    }

    const currentUser = await prismadb.user.findUnique({
        where: {
            email: session.user.email
        }
    })

    if (!currentUser) {
        throw new Error('Not signed in')
    }

    // Return object
    return {currentUser}
}

export default serverAuth
