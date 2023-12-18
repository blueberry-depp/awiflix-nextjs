// this is a end point route
import {NextApiRequest, NextApiResponse} from "next";
import prismadb from "@/libs/prismadb";
import serverAuth from "@/libs/serverAuth";
import bcrypt from "bcrypt";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // limit request just to GET
  if (req.method !== 'GET') {
    return res.status(405).end()
  }

  try {
    // check if the user authenticated or not
    await serverAuth(req)

    // we want to get count of all movies in database without loading them
    const movieCount = await prismadb.movie.count()

    // create a random index using this movie count
    const randomIndex = Math.floor(Math.random() * movieCount)

    // we want to actually find the random movie Object from the database, we're going to be using pagination to make our algorithm for a random movie
    const randomMovies = await prismadb.movie.findMany({
      take: 1,
      skip: randomIndex
    })

    // random movies is an array, we only want one movie
    return res.status(200).json(randomMovies[0])


  } catch (error) {
    console.log(error)
    return res.status(400).end()

  }
}


