import {NextApiRequest, NextApiResponse} from "next";
import prismadb from "@/libs/prismadb";
import serverAuth from "@/libs/serverAuth";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // limit request just to GET
  if (req.method !== 'GET') {
    return res.status(405).end()
  }

  try {


    // check if the user authenticated or not(authenticate this route)
    await serverAuth(req)

    // when we define a route name like this in square brackets it's going to know that this is going to put that in the request.query we named it movieId so that's where we
    // know we can search for movieId here({movieId})
    const {movieId} = req.query

    if (typeof movieId !== 'string') {
      throw new Error('Invalid ID')
    }

    if (!movieId) {
      throw new Error('Invalid ID')
    }

    const movie = await prismadb.movie.findUnique({
      where: {
        // movieId from request parameter
        id: movieId
      }
    })

    if (!movie) {
      throw new Error('Invalid ID')
    }


    return res.status(200).json(movie)
  } catch (error) {
    console.log(error)
    return res.status(500).end()
  }
}
