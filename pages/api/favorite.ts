import {NextApiRequest, NextApiResponse} from "next";
import prismadb from "@/libs/prismadb";
import serverAuth from "@/libs/serverAuth";
import {without} from "lodash";

// this is a route
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === 'POST') {
      // get current user
      const {currentUser} = await serverAuth(req)
      const {movieId} = req.body

      // find the movie by movie id
      const existingMovie = await prismadb.movie.findUnique({
        where: {
          id: movieId
        }
      })

      if (!existingMovie) {
        throw new Error('Invalid ID')
      }

      // update our user and have to push this movie ID in their favoriteIds
      const user = await prismadb.user.update({
        where: {
          email: currentUser.email || ''
          // provide the data which we want to update
        }, data: {
          favoriteIds: {
            push: movieId
          }
        }
      })

      return res.status(200).json(user)
    }


    if (req.method === 'DELETE') {
      const {currentUser} = await serverAuth(req)
      const {movieId} = req.body

      const existingMovie = await prismadb.movie.findUnique({
        where: {
          id: movieId
        }
      })

      if (!existingMovie) {
        throw new Error('Invalid ID')
      }

      // list of our current favoriteIds without this id: movieId and remove movieId from that list
      const updatedFavoriteIds = without(currentUser.favoriteIds, movieId)

      const updatedUser = await prismadb.user.update({
        where: {
          email: currentUser.email || ''
        }, data: {
          favoriteIds: updatedFavoriteIds
        }
      })

      return res.status(200).json(updatedUser)
    }

    return res.status(405).end()
  } catch (error) {
    console.log(error)
    return res.status(500).end()

  }
}
