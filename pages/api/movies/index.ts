import {NextApiRequest, NextApiResponse} from "next";
import prismadb from "@/libs/prismadb";
import serverAuth from "@/libs/serverAuth";
import bcrypt from "bcrypt";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // limit request just to GET
    if (req.method !== 'GET') {
      return res.status(405).end()
    }

    // check if the user authenticated or not(authenticate this route)
    await serverAuth(req)

    const movies = await prismadb.movie.findMany()

    return res.status(200).json(movies)
  } catch (error) {
    console.log(error)
    return res.status(500).end()
  }
}
