// this is a end point route
import {NextApiRequest, NextApiResponse} from "next";
import prismadb from "@/libs/prismadb";
import bcrypt from "bcrypt";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    // limit request just to POST
    if (req.method !== 'POST') {
        return res.status(405).end()
    }

    try {
        // Extract some values from request.body
        const {email, name, password} = req.body

        // Find an existing user using this email because we want to check if an email has been taken
        const existingUser = await prismadb.user.findUnique({
            where: {
                email
            }
        })

        if (existingUser){
            return res.status(422).json({error: 'Email taken'})
        }

        const hashedPassword = await bcrypt.hash(password, 12)

        // Save hash password into a new user model
        const user = await prismadb.user.create({
            data: {
                email,
                name,
                hashedPassword,
                image: '',
                emailVerified: new Date()
            }
        })

        return res.status(200).json(user)

    } catch (error) {
        console.log(error)
        return res.status(400).end()

    }
}
